/**
 * useNotifications Hook
 * 
 * This hook provides a unified interface for accessing notification data and SSE connection state.
 * It safely handles null context values during initial load by providing default values.
 * 
 * Features:
 * - Handles unauthenticated users gracefully
 * - Provides fallback values when SSE context is not available
 * - Returns consistent interface regardless of connection state
 * - Safe to use during app initialization
 */

import { useEffect, useMemo } from "react";
import { useSSENotificationContext } from "../contexts/SSENotificationContext";
import { useAuth } from "../state/hooks/user.hook";

export const useNotifications = () => {
  const { user } = useAuth();
  
  // Get SSE context (now safely handles null values)
  const sseContext = useSSENotificationContext();

  console.log('useNotifications - Context Data:', {
    isConnected: sseContext.isConnected,
    status: sseContext.status,
    notificationsCount: sseContext.notifications?.length || 0,
    unreadCount: sseContext.unreadCount
  });
  
  // Memoize the return value to prevent unnecessary re-renders
  return useMemo(() => {
    // Return default values if user is not authenticated
    if (!user?.id) {
      return {
        // Connection state
        isConnected: false,
        isConnecting: false,
        hasError: false,
        status: "disconnected",

        // Notification data
        notifications: [],
        unreadCount: 0,
        totalReceived: 0,

        // Actions
        connect: () => {},
        disconnect: () => {},
        reconnect: () => {},
        markAsRead: () => {},
        clearNotifications: () => {},

        // Getters
        getUnreadNotifications: () => [],
        getNotificationsByType: () => [],

        // User info
        userId: null,
        isAuthenticated: false,
      };
    }

    // Return actual values for authenticated users
    return {
      // Connection state
      isConnected: sseContext.isConnected || false,
      isConnecting: sseContext.isConnecting || false,
      hasError: sseContext.hasError || false,
      status: sseContext.status || "disconnected",

      // Notification data
      notifications: sseContext.notifications || [],
      unreadCount: sseContext.unreadCount || 0,
      totalReceived: sseContext.totalReceived || 0,

      // Actions
      connect: sseContext.connect || (() => {}),
      disconnect: sseContext.disconnect || (() => {}),
      reconnect: sseContext.reconnect || (() => {}),
      markAsRead: sseContext.markAsRead || (() => {}),
      clearNotifications: sseContext.clearNotifications || (() => {}),

      // Getters
      getUnreadNotifications: sseContext.getUnreadNotifications || (() => []),
      getNotificationsByType: sseContext.getNotificationsByType || (() => []),

      // User info
      userId: user.id,
      isAuthenticated: true,
    };
  }, [
    user?.id,
    sseContext.isConnected,
    sseContext.isConnecting,
    sseContext.hasError,
    sseContext.status,
    sseContext.notifications,
    sseContext.unreadCount,
    sseContext.totalReceived,
    sseContext.connect,
    sseContext.disconnect,
    sseContext.reconnect,
    sseContext.markAsRead,
    sseContext.clearNotifications,
    sseContext.getUnreadNotifications,
    sseContext.getNotificationsByType,
  ]);
};

// Hook for specific notification types
export const useNotificationType = (type: string) => {
  const { getNotificationsByType, markAsRead } = useNotifications();

  return {
    notifications: getNotificationsByType(type),
    markAsRead,
  };
};

// Hook for payment notifications
export const usePaymentNotifications = () => {
  return useNotificationType("payment");
};

// Hook for appointment notifications
export const useAppointmentNotifications = () => {
  return useNotificationType("appointment");
};

// Hook for system notifications
export const useSystemNotifications = () => {
  return useNotificationType("system");
};

// Hook for message notifications
export const useMessageNotifications = () => {
  return useNotificationType("message");
};

export default useNotifications;
