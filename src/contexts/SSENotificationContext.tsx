import React, { createContext, useContext, ReactNode, useCallback } from 'react';
import { useSSENotifications, UseSSENotificationsParams } from '../state/hooks/useSSENotifications';
import { 
  NotificationData, 
  SSEConnectionState, 
  SSEConnectionOptions 
} from '../types/sse.types';

interface SSENotificationContextType {
  // Connection state
  status: SSEConnectionState['status'];
  notifications: NotificationData[];
  error?: string;
  reconnectAttempts: number;
  lastHeartbeat?: Date;
  totalReceived: number;
  
  // Computed values
  isConnected: boolean;
  isConnecting: boolean;
  hasError: boolean;
  unreadCount: number;
  
  // Actions
  connect: () => void;
  disconnect: () => void;
  reconnect: () => void;
  clearNotifications: () => void;
  markAsRead: (notificationId: string) => void;
  
  // Getters
  getUnreadNotifications: () => NotificationData[];
  getNotificationsByType: (type: string) => NotificationData[];
}

const SSENotificationContext = createContext<SSENotificationContextType | null>(null);

interface SSENotificationProviderProps {
  children: ReactNode;
  userId?: string;
  options?: SSEConnectionOptions;
  onNotification?: (notification: NotificationData) => void;
  onStatusChange?: (status: SSEConnectionState['status']) => void;
  onError?: (error: string) => void;
}

export const SSENotificationProvider: React.FC<SSENotificationProviderProps> = ({
  children,
  userId,
  options,
  onNotification,
  onStatusChange,
  onError
}) => {
  const sseHook = useSSENotifications({
    userId,
    options,
    onNotification,
    onStatusChange,
    onError
  });

  return (
    <SSENotificationContext.Provider value={sseHook}>
      {children}
    </SSENotificationContext.Provider>
  );
};

export const useSSENotificationContext = (): SSENotificationContextType => {
  const context = useContext(SSENotificationContext);
  if (!context) {
    throw new Error('useSSENotificationContext must be used within an SSENotificationProvider');
  }
  return context;
};

// Hook for notifications with toast integration
export const useSSEWithToast = (
  params: UseSSENotificationsParams & {
    showToast?: (notification: NotificationData) => void;
    autoMarkAsRead?: boolean;
  }
) => {
  const { showToast, autoMarkAsRead = false, onNotification, ...restParams } = params;

  const handleNotification = useCallback((notification: NotificationData) => {
    // Show toast if function provided
    showToast?.(notification);
    
    // Auto mark as read if enabled
    if (autoMarkAsRead) {
      setTimeout(() => {
        // This would be handled by the hook internally
      }, 3000);
    }
    
    // Call original handler
    onNotification?.(notification);
  }, [showToast, autoMarkAsRead, onNotification]);

  return useSSENotifications({
    ...restParams,
    onNotification: handleNotification
  });
};

// Hook for specific notification types
export const useSSEForNotificationType = (
  notificationType: string,
  params: Omit<UseSSENotificationsParams, 'options'> & {
    options?: Omit<SSEConnectionOptions, 'filters'>;
  }
) => {
  const { options, ...restParams } = params;
  
  return useSSENotifications({
    ...restParams,
    options: {
      ...options,
      filters: {
        type: notificationType
      }
    }
  });
};

// Hook for payment notifications specifically
export const usePaymentNotifications = (
  params: Omit<UseSSENotificationsParams, 'options'> & {
    options?: Omit<SSEConnectionOptions, 'filters'>;
  }
) => {
  return useSSEForNotificationType('payment', params);
};

// Hook for appointment notifications specifically
export const useAppointmentNotifications = (
  params: Omit<UseSSENotificationsParams, 'options'> & {
    options?: Omit<SSEConnectionOptions, 'filters'>;
  }
) => {
  return useSSEForNotificationType('appointment', params);
};

// Hook for system notifications specifically
export const useSystemNotifications = (
  params: Omit<UseSSENotificationsParams, 'options'> & {
    options?: Omit<SSEConnectionOptions, 'filters'>;
  }
) => {
  return useSSEForNotificationType('system', params);
};

// Hook for broadcast notifications
export const useBroadcastNotifications = (
  params: Omit<UseSSENotificationsParams, 'userId' | 'options'> & {
    options?: Omit<SSEConnectionOptions, 'mode'>;
  }
) => {
  const { options, ...restParams } = params;
  
  return useSSENotifications({
    ...restParams,
    options: {
      ...options,
      mode: 'broadcast'
    }
  });
};

// Hook for admin monitoring
export const useAdminNotifications = (
  token: string,
  params: Omit<UseSSENotificationsParams, 'userId' | 'options'> & {
    options?: Omit<SSEConnectionOptions, 'mode' | 'token'>;
  }
) => {
  const { options, ...restParams } = params;
  
  return useSSENotifications({
    ...restParams,
    options: {
      ...options,
      mode: 'admin',
      token
    }
  });
};