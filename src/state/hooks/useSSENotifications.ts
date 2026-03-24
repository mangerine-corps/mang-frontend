import { useState, useEffect, useRef, useCallback } from 'react';
import {
  SSEConnectionOptions,
  SSEConnectionState,
  SSEEvent,
  NotificationData,
  NotificationHandler,
  ConnectionStatusHandler,
  ErrorHandler
} from '../../types/sse.types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface UseSSENotificationsParams {
  userId?: string;
  options?: SSEConnectionOptions;
  onNotification?: NotificationHandler;
  onStatusChange?: ConnectionStatusHandler;
  onError?: ErrorHandler;
}

export const useSSENotifications = ({
  userId,
  options = {},
  onNotification,
  onStatusChange,
  onError
}: UseSSENotificationsParams = {}) => {
  const { mode = 'secure', token = '', autoReconnect = true, reconnectDelay = 3000, maxReconnectAttempts = 5 } = options;

  const [state, setState] = useState<SSEConnectionState>({
    status: 'disconnected',
    notifications: [],
    reconnectAttempts: 0,
    totalReceived: 0
  });

  const esRef = useRef<EventSource | null>(null);
  const reconnectRef = useRef<NodeJS.Timeout | null>(null);
  const manualDisconnect = useRef(false);
  const attemptsRef = useRef(0);

  const updateState = useCallback((updates: Partial<SSEConnectionState> | ((prev: SSEConnectionState) => Partial<SSEConnectionState>)) => {
    setState(prev => {
      const next = typeof updates === 'function' ? updates(prev) : updates;
      if (next.status && next.status !== prev.status) onStatusChange?.(next.status);
      return { ...prev, ...next };
    });
  }, [onStatusChange]);

  const buildUrl = useCallback((): string => {
    let url = '';
    switch (mode) {
      case 'secure': url = `${BASE_URL}/sse/notifications/stream/secure/${userId}`; break;
      case 'admin':  url = `${BASE_URL}/sse/notifications/stream/admin/all`; break;
      case 'broadcast': url = `${BASE_URL}/sse/notifications/stream/broadcast`; break;
      default: url = `${BASE_URL}/sse/notifications/stream/${userId}`; break;
    }
    if (token) url += `?token=${token}`;
    return url;
  }, [mode, userId, token]);

  const disconnect = useCallback(() => {
    manualDisconnect.current = true;
    if (reconnectRef.current) clearTimeout(reconnectRef.current);
    if (esRef.current) { esRef.current.close(); esRef.current = null; }
    updateState({ status: 'disconnected', error: undefined });
  }, [updateState]);

  const connect = useCallback(() => {
    if (!userId && (mode === 'secure' || mode === 'public')) return;
    if (esRef.current) { esRef.current.close(); esRef.current = null; }
    if (reconnectRef.current) { clearTimeout(reconnectRef.current); reconnectRef.current = null; }

    manualDisconnect.current = false;
    updateState({ status: 'connecting', error: undefined });

    try {
      const url = buildUrl();
      const es = new EventSource(url);
      esRef.current = es;

      es.onopen = () => {
        attemptsRef.current = 0;
        updateState({ status: 'connected', reconnectAttempts: 0, error: undefined });
      };

      es.onmessage = (event: MessageEvent) => {
        try {
          const sseEvent: SSEEvent = JSON.parse(event.data);
          switch (sseEvent.type) {
            case 'connection':
              updateState({ status: 'connected', reconnectAttempts: 0, error: undefined });
              break;
            case 'notification':
              if (sseEvent.data) {
                const notification: NotificationData = {
                  ...sseEvent.data,
                  timestamp: new Date(sseEvent.data.timestamp || new Date())
                };
                updateState(prev => ({
                  notifications: [notification, ...prev.notifications].slice(0, 100),
                  totalReceived: prev.totalReceived + 1
                }));
                onNotification?.(notification);
              }
              break;
            case 'heartbeat':
              updateState({ lastHeartbeat: new Date() });
              break;
            case 'error':
              updateState({ error: sseEvent.message });
              onError?.(sseEvent.message || 'SSE error');
              break;
          }
        } catch { /* ignore parse errors */ }
      };

      es.onerror = () => {
        if (manualDisconnect.current) return;
        updateState({ status: 'error', error: 'Connection lost' });
        onError?.('Connection lost');

        if (autoReconnect && attemptsRef.current < maxReconnectAttempts) {
          const delay = Math.min(reconnectDelay * Math.pow(2, attemptsRef.current), 30000);
          attemptsRef.current += 1;
          updateState({ status: 'reconnecting', reconnectAttempts: attemptsRef.current });
          reconnectRef.current = setTimeout(() => {
            if (!manualDisconnect.current) connect();
          }, delay);
        }
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to connect';
      updateState({ status: 'error', error: msg });
      onError?.(msg);
    }
  }, [buildUrl, mode, userId, autoReconnect, reconnectDelay, maxReconnectAttempts, updateState, onNotification, onError]);

  useEffect(() => {
    if (!userId && (mode === 'secure' || mode === 'public')) return;
    connect();
    return () => { disconnect(); };
  }, [userId, mode, token]); // eslint-disable-line react-hooks/exhaustive-deps

  const markAsRead = useCallback((id: string) => {
    updateState(prev => ({
      notifications: prev.notifications.map(n => n.id === id ? { ...n, read: true } : n)
    }));
  }, [updateState]);

  const clearNotifications = useCallback(() => updateState({ notifications: [] }), [updateState]);
  const getUnreadNotifications = useCallback(() => state.notifications.filter(n => !n.read), [state.notifications]);
  const getNotificationsByType = useCallback((type: string) => state.notifications.filter(n => n.type === type), [state.notifications]);

  return {
    ...state,
    isConnected: state.status === 'connected',
    isConnecting: state.status === 'connecting' || state.status === 'reconnecting',
    hasError: state.status === 'error',
    unreadCount: getUnreadNotifications().length,
    connect,
    disconnect,
    reconnect: () => { disconnect(); setTimeout(connect, 100); },
    markAsRead,
    clearNotifications,
    getUnreadNotifications,
    getNotificationsByType,
  };
};
