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

const DEFAULT_OPTIONS: Required<SSEConnectionOptions> = {
  mode: 'public',
  token: '',
  filters: {},
  autoReconnect: true,
  reconnectDelay: 3000,
  maxReconnectAttempts: 5,
  baseUrl: process.env.API_BASE_URL || 'http://localhost:4000'
};

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
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
  
  const [state, setState] = useState<SSEConnectionState>({
    status: 'disconnected',
    notifications: [],
    reconnectAttempts: 0,
    totalReceived: 0
  });

  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isManualDisconnectRef = useRef(false);

  // Build SSE URL based on mode and options
  const buildSSEUrl = useCallback((targetUserId?: string): string => {
    const { mode, token, filters, baseUrl } = mergedOptions;
    let url = '';

    switch (mode) {
      case 'secure':
        if (!targetUserId) throw new Error('userId is required for secure mode');
        url = `${baseUrl}/notifications/stream/secure/${targetUserId}`;
        break;
      case 'admin':
        url = `${baseUrl}/notifications/stream/admin/all`;
        break;
      case 'broadcast':
        url = `${baseUrl}/notifications/stream/broadcast`;
        break;
      case 'public':
      default:
        if (!targetUserId) throw new Error('userId is required for public mode');
        url = `${baseUrl}/notifications/stream/${targetUserId}`;
        break;
    }

    // Add query parameters
    const params = new URLSearchParams();
    if (token) params.append('token', token);
    if (filters?.type) params.append('type', filters.type);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.priority) params.append('priority', filters.priority);

    const queryString = params.toString();
    return queryString ? `${url}?${queryString}` : url;
  }, [mergedOptions]);

  // Update state and notify listeners
  const updateState = useCallback((updates: Partial<SSEConnectionState> | ((prev: SSEConnectionState) => Partial<SSEConnectionState>)) => {
    setState(prev => {
      const newUpdates = typeof updates === 'function' ? updates(prev) : updates;
      const newState = { ...prev, ...newUpdates };
      
      // Notify status change if status changed
      if (newUpdates.status && newUpdates.status !== prev.status) {
        onStatusChange?.(newUpdates.status);
      }
      
      return newState;
    });
  }, [onStatusChange]);

  // Handle incoming SSE messages
  const handleSSEMessage = useCallback((event: MessageEvent) => {
    try {
      const sseEvent: SSEEvent = JSON.parse(event.data);
      
      switch (sseEvent.type) {
        case 'connection':
          console.log('SSE Connection established:', sseEvent.message);
          updateState({ status: 'connected', reconnectAttempts: 0, error: undefined });
          break;
          
        case 'notification':
          if (sseEvent.data) {
            const notification: NotificationData = {
              ...sseEvent.data,
              timestamp: new Date(sseEvent.data.timestamp || new Date())
            };
            
            updateState(prev => ({
              notifications: [notification, ...prev.notifications].slice(0, 100), // Keep last 100
              totalReceived: prev.totalReceived + 1
            }));
            
            onNotification?.(notification);
          }
          break;
          
        case 'heartbeat':
          updateState({ lastHeartbeat: new Date() });
          break;
          
        case 'error':
          const errorMessage = sseEvent.message || 'Unknown SSE error';
          console.error('SSE Error:', errorMessage);
          updateState({ error: errorMessage });
          onError?.(errorMessage);
          break;
          
        default:
          console.warn('Unknown SSE event type:', sseEvent.type);
      }
    } catch (error) {
      console.error('Failed to parse SSE message:', error);
      const errorMessage = 'Failed to parse server message';
      updateState({ error: errorMessage });
      onError?.(errorMessage);
    }
  }, [updateState, onNotification, onError]);

  // Handle connection errors
  const handleSSEError = useCallback((event: Event) => {
    console.error('SSE Connection error:', event);
    
    if (!isManualDisconnectRef.current) {
      updateState({ status: 'error', error: 'Connection lost' });
      onError?.('Connection lost');
      
      // Attempt reconnection if enabled and under max attempts
      if (mergedOptions.autoReconnect && state.reconnectAttempts < mergedOptions.maxReconnectAttempts) {
        console.log(`Attempting reconnection ${state.reconnectAttempts + 1}/${mergedOptions.maxReconnectAttempts}`);
        scheduleReconnect();
      } else if (state.reconnectAttempts >= mergedOptions.maxReconnectAttempts) {
        console.log('Max reconnection attempts reached, stopping auto-reconnect');
        updateState({ status: 'error', error: 'Max reconnection attempts reached' });
        onError?.('Max reconnection attempts reached');
      }
    }
  }, [mergedOptions.autoReconnect, mergedOptions.maxReconnectAttempts, state.reconnectAttempts, updateState, onError]);

  // Schedule reconnection
  const scheduleReconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }

    // Add exponential backoff for reconnection attempts
    const backoffDelay = Math.min(
      mergedOptions.reconnectDelay * Math.pow(2, state.reconnectAttempts),
      30000 // Max 30 seconds
    );

    console.log(`Scheduling reconnection in ${backoffDelay}ms (attempt ${state.reconnectAttempts + 1})`);

    reconnectTimeoutRef.current = setTimeout(() => {
      if (!isManualDisconnectRef.current) {
        updateState(prev => ({ 
          status: 'reconnecting', 
          reconnectAttempts: prev.reconnectAttempts + 1 
        }));
        connect(userId);
      }
    }, backoffDelay);
  }, [mergedOptions.reconnectDelay, userId, updateState, state.reconnectAttempts]);

  // Connect to SSE
  const connect = useCallback((targetUserId?: string) => {
    // Prevent multiple simultaneous connections
    if (state.status === 'connecting' || state.status === 'connected') {
      console.log('SSE connection already in progress or connected, skipping');
      return;
    }

    // Close existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    // Clear any pending reconnection
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    try {
      const url = buildSSEUrl(targetUserId);
      console.log('Connecting to SSE:', url);
      
      // Validate URL and parameters
      if (!url || url.includes('undefined')) {
        throw new Error('Invalid SSE URL - missing required parameters');
      }
      
      updateState({ status: 'connecting', error: undefined });
      isManualDisconnectRef.current = false;

      const eventSource = new EventSource(url);
      eventSourceRef.current = eventSource;

      eventSource.onmessage = handleSSEMessage;
      eventSource.onerror = handleSSEError;

      eventSource.onopen = () => {
        console.log('SSE Connection opened successfully');
        updateState({ status: 'connected', reconnectAttempts: 0, error: undefined });
      };

    } catch (error) {
      console.error('Failed to create SSE connection:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect';
      updateState({ status: 'error', error: errorMessage });
      onError?.(errorMessage);
    }
  }, [buildSSEUrl, handleSSEMessage, handleSSEError, updateState, onError, state.status]);

  // Disconnect from SSE
  const disconnect = useCallback(() => {
    console.log('Manually disconnecting SSE');
    isManualDisconnectRef.current = true;

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    updateState({ status: 'disconnected', error: undefined });
  }, [updateState]);

  // Reconnect manually
  const reconnect = useCallback(() => {
    disconnect();
    setTimeout(() => connect(userId), 100);
  }, [disconnect, connect, userId]);

  // Clear notifications
  const clearNotifications = useCallback(() => {
    updateState({ notifications: [] });
  }, [updateState]);

  // Mark notification as read
  const markAsRead = useCallback((notificationId: string) => {
    updateState(prev => ({
      notifications: prev.notifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    }));
  }, [updateState]);

  // Get unread notifications
  const getUnreadNotifications = useCallback(() => {
    return state.notifications.filter(notification => !notification.read);
  }, [state.notifications]);

  // Get notifications by type
  const getNotificationsByType = useCallback((type: string) => {
    return state.notifications.filter(notification => notification.type === type);
  }, [state.notifications]);

  // Auto-connect when userId or key options change
  useEffect(() => {
    // Only connect if we have the required parameters
    if (userId && (mergedOptions.mode === 'public' || mergedOptions.mode === 'secure')) {
      console.log('Auto-connecting SSE for user:', userId, 'mode:', mergedOptions.mode);
      connect(userId);
    } else if (mergedOptions.mode === 'admin' || mergedOptions.mode === 'broadcast') {
      console.log('Auto-connecting SSE for admin/broadcast mode:', mergedOptions.mode);
      connect();
    }

    return () => {
      console.log('Cleaning up SSE connection');
      disconnect();
    };
  }, [userId, mergedOptions.mode, mergedOptions.token]); // Removed connect, disconnect from dependencies

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  return {
    // State
    ...state,
    
    // Computed values
    isConnected: state.status === 'connected',
    isConnecting: state.status === 'connecting' || state.status === 'reconnecting',
    hasError: state.status === 'error',
    unreadCount: getUnreadNotifications().length,
    
    // Actions
    connect: () => connect(userId),
    disconnect,
    reconnect,
    clearNotifications,
    markAsRead,
    
    // Getters
    getUnreadNotifications,
    getNotificationsByType
  };
};