import React from 'react';
import { SSENotificationProvider as BaseSSEProvider } from '../../contexts/SSENotificationContext';
import { useAuth } from '../../state/hooks/user.hook';

interface SSENotificationProviderProps {
  children?: React.ReactNode;
}

export const SSENotificationProvider: React.FC<SSENotificationProviderProps> = ({ 
  children 
}) => {
  const { user, token } = useAuth();

  // Debug: Log authentication state
  console.log('SSE Provider Auth State:', {
    hasUser: !!user,
    userId: user?.id,
    hasToken: !!token,
    tokenLength: token?.length
  });

  // SSE connection options
  const sseOptions = {
    mode: 'secure' as const, // Use secure mode for authenticated users
    token: token, // Pass the authentication token
    reconnectInterval: 5000,
    maxReconnectAttempts: 10,
    heartbeatInterval: 30000,
    onNotification: (notification: any) => {
      console.log('New notification received:', notification);
    },
    onStatusChange: (status: string) => {
      console.log('SSE status changed:', status);
    },
    onError: (error: string) => {
      console.error('SSE error:', error);
    },
  };

  return (
    <BaseSSEProvider
      userId={user?.id}
      options={sseOptions}
    >
        {children}
    </BaseSSEProvider>
  );
};

export default SSENotificationProvider; 