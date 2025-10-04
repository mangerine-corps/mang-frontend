import { useState, useEffect, useMemo } from 'react';
import { useSSENotifications } from './useSSENotifications';
import { usePaymentNotifications, useAppointmentNotifications, useSystemNotifications, useBroadcastNotifications } from '../../contexts/SSENotificationContext';
import { NotificationData, SSEConnectionState } from '../../types/sse.types';

interface UnifiedNotificationState {
  // Combined state
  notifications: NotificationData[];
  unreadCount: number;
  totalReceived: number;
  
  // Connection states
  isConnected: boolean;
  isConnecting: boolean;
  hasError: boolean;
  status: SSEConnectionState['status'];
  
  // Individual connection states
  paymentConnected: boolean;
  appointmentConnected: boolean;
  systemConnected: boolean;
  broadcastConnected: boolean;
  
  // Actions
  markAsRead: (notificationId: string) => void;
  clearNotifications: () => void;
  reconnect: () => void;
  
  // Getters
  getUnreadNotifications: () => NotificationData[];
  getNotificationsByType: (type: string) => NotificationData[];
  getNotificationsByPriority: (priority: string) => NotificationData[];
}

interface UseUnifiedNotificationsParams {
  userId?: string;
  token?: string;
  enablePayment?: boolean;
  enableAppointment?: boolean;
  enableSystem?: boolean;
  enableBroadcast?: boolean;
  onNotification?: (notification: NotificationData) => void;
  onError?: (error: string) => void;
}

export const useUnifiedNotifications = ({
  userId,
  token,
  enablePayment = true,
  enableAppointment = true,
  enableSystem = true,
  enableBroadcast = false,
  onNotification,
  onError
}: UseUnifiedNotificationsParams = {}): UnifiedNotificationState => {
  
  // Individual notification hooks
  const paymentHook = usePaymentNotifications({
    userId,
    options: { mode: 'public', token },
    onNotification,
    onError
  });

  const appointmentHook = useAppointmentNotifications({
    userId,
    options: { mode: 'public', token },
    onNotification,
    onError
  });

  const systemHook = useSystemNotifications({
    userId,
    options: { mode: 'secure', token },
    onNotification,
    onError
  });

  const broadcastHook = useBroadcastNotifications({
    onNotification,
    onError
  });

  // Combine all notifications into one array
  const allNotifications = useMemo(() => {
    const notifications: NotificationData[] = [];
    
    if (enablePayment) {
      notifications.push(...paymentHook.notifications);
    }
    
    if (enableAppointment) {
      notifications.push(...appointmentHook.notifications);
    }
    
    if (enableSystem) {
      notifications.push(...systemHook.notifications);
    }
    
    if (enableBroadcast) {
      notifications.push(...broadcastHook.notifications);
    }
    
    // Sort by timestamp (newest first)
    return notifications.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [
    enablePayment, paymentHook.notifications,
    enableAppointment, appointmentHook.notifications,
    enableSystem, systemHook.notifications,
    enableBroadcast, broadcastHook.notifications
  ]);

  // Calculate combined unread count
  const unreadCount = useMemo(() => {
    return allNotifications.filter(n => !n.read).length;
  }, [allNotifications]);

  // Calculate total received
  const totalReceived = useMemo(() => {
    return paymentHook.totalReceived + 
           appointmentHook.totalReceived + 
           systemHook.totalReceived + 
           broadcastHook.totalReceived;
  }, [paymentHook.totalReceived, appointmentHook.totalReceived, systemHook.totalReceived, broadcastHook.totalReceived]);

  // Combined connection state
  const isConnected = useMemo(() => {
    const connections = [
      enablePayment && paymentHook.isConnected,
      enableAppointment && appointmentHook.isConnected,
      enableSystem && systemHook.isConnected,
      enableBroadcast && broadcastHook.isConnected
    ].filter(Boolean);
    
    return connections.length > 0 && connections.every(Boolean);
  }, [
    enablePayment, paymentHook.isConnected,
    enableAppointment, appointmentHook.isConnected,
    enableSystem, systemHook.isConnected,
    enableBroadcast, broadcastHook.isConnected
  ]);

  const isConnecting = useMemo(() => {
    const connections = [
      enablePayment && paymentHook.isConnecting,
      enableAppointment && appointmentHook.isConnecting,
      enableSystem && systemHook.isConnecting,
      enableBroadcast && broadcastHook.isConnecting
    ].filter(Boolean);
    
    return connections.length > 0 && connections.some(Boolean);
  }, [
    enablePayment, paymentHook.isConnecting,
    enableAppointment, appointmentHook.isConnecting,
    enableSystem, systemHook.isConnecting,
    enableBroadcast, broadcastHook.isConnecting
  ]);

  const hasError = useMemo(() => {
    const errors = [
      enablePayment && paymentHook.hasError,
      enableAppointment && appointmentHook.hasError,
      enableSystem && systemHook.hasError,
      enableBroadcast && broadcastHook.hasError
    ].filter(Boolean);
    
    return errors.length > 0 && errors.some(Boolean);
  }, [
    enablePayment, paymentHook.hasError,
    enableAppointment, appointmentHook.hasError,
    enableSystem, systemHook.hasError,
    enableBroadcast, broadcastHook.hasError
  ]);

  // Combined status (use the most severe status)
  const status = useMemo(() => {
    const statuses = [
      enablePayment && paymentHook.status,
      enableAppointment && appointmentHook.status,
      enableSystem && systemHook.status,
      enableBroadcast && broadcastHook.status
    ].filter(Boolean) as SSEConnectionState['status'][];
    
    if (statuses.includes('error')) return 'error';
    if (statuses.includes('reconnecting')) return 'reconnecting';
    if (statuses.includes('connecting')) return 'connecting';
    if (statuses.includes('connected')) return 'connected';
    return 'disconnected';
  }, [
    enablePayment, paymentHook.status,
    enableAppointment, appointmentHook.status,
    enableSystem, systemHook.status,
    enableBroadcast, broadcastHook.status
  ]);

  // Combined actions
  const markAsRead = (notificationId: string) => {
    paymentHook.markAsRead(notificationId);
    appointmentHook.markAsRead(notificationId);
    systemHook.markAsRead(notificationId);
    broadcastHook.markAsRead(notificationId);
  };

  const clearNotifications = () => {
    paymentHook.clearNotifications();
    appointmentHook.clearNotifications();
    systemHook.clearNotifications();
    broadcastHook.clearNotifications();
  };

  const reconnect = () => {
    if (enablePayment) paymentHook.reconnect();
    if (enableAppointment) appointmentHook.reconnect();
    if (enableSystem) systemHook.reconnect();
    if (enableBroadcast) broadcastHook.reconnect();
  };

  // Getters
  const getUnreadNotifications = () => {
    return allNotifications.filter(n => !n.read);
  };

  const getNotificationsByType = (type: string) => {
    return allNotifications.filter(n => n.type === type);
  };

  const getNotificationsByPriority = (priority: string) => {
    return allNotifications.filter(n => n.priority === priority);
  };

  return {
    // Combined state
    notifications: allNotifications,
    unreadCount,
    totalReceived,
    
    // Connection states
    isConnected,
    isConnecting,
    hasError,
    status,
    
    // Individual connection states
    paymentConnected: enablePayment ? paymentHook.isConnected : false,
    appointmentConnected: enableAppointment ? appointmentHook.isConnected : false,
    systemConnected: enableSystem ? systemHook.isConnected : false,
    broadcastConnected: enableBroadcast ? broadcastHook.isConnected : false,
    
    // Actions
    markAsRead,
    clearNotifications,
    reconnect,
    
    // Getters
    getUnreadNotifications,
    getNotificationsByType,
    getNotificationsByPriority
  };
}; 