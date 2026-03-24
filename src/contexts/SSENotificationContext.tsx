import React, { createContext, useContext, ReactNode } from 'react';
import { useSSENotifications, UseSSENotificationsParams } from '../state/hooks/useSSENotifications';
import { NotificationData, SSEConnectionState, SSEConnectionOptions } from '../types/sse.types';

interface SSENotificationContextType {
  status: SSEConnectionState['status'];
  notifications: NotificationData[];
  error?: string;
  reconnectAttempts: number;
  lastHeartbeat?: Date;
  totalReceived: number;
  isConnected: boolean;
  isConnecting: boolean;
  hasError: boolean;
  unreadCount: number;
  connect: () => void;
  disconnect: () => void;
  reconnect: () => void;
  clearNotifications: () => void;
  markAsRead: (id: string) => void;
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
  children, userId, options, onNotification, onStatusChange, onError
}) => {
  const value = useSSENotifications({ userId, options, onNotification, onStatusChange, onError });
  return (
    <SSENotificationContext.Provider value={value}>
      {children}
    </SSENotificationContext.Provider>
  );
};

export const useSSENotificationContext = (): SSENotificationContextType => {
  const context = useContext(SSENotificationContext);
  if (!context) throw new Error('useSSENotificationContext must be used within SSENotificationProvider');
  return context;
};
