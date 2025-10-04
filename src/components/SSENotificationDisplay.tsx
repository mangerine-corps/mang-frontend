import React from 'react';
import { Box, VStack, HStack, Text, Badge, IconButton, Button } from '@chakra-ui/react';
import { NotificationData } from '../types/sse.types';
import { useSSENotificationContext } from '../contexts/SSENotificationContext';

interface NotificationItemProps {
  notification: NotificationData;
  onMarkAsRead: (id: string) => void;
  onDismiss?: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ 
  notification, 
  onMarkAsRead, 
  onDismiss 
}) => {
  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'urgent': return 'red';
      case 'high': return 'orange';
      case 'medium': return 'yellow';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  const formatTimestamp = (timestamp: Date | string) => {
    const date = new Date(timestamp);
    const diffInMinutes = Math.floor((date.getTime() - Date.now()) / (1000 * 60));
    
    if (diffInMinutes === 0) return 'Just now';
    if (diffInMinutes < 0) return `${Math.abs(diffInMinutes)}m ago`;
    return `in ${diffInMinutes}m`;
  };

  return (
    <Box
      p={4}
      border="1px solid"
      borderColor={notification.read ? "gray.200" : "blue.200"}
      borderRadius="md"
      bg={notification.read ? "gray.50" : "blue.50"}
      shadow="sm"
      _hover={{ shadow: "md" }}
      transition="all 0.2s"
    >
      <HStack justify="space-between" align="start" gap={3}>
        <VStack align="start" gap={2} flex={1}>
          <HStack gap={2} wrap="wrap">
            <Text fontWeight="bold" fontSize="sm" color="gray.800">
              {notification.title}
            </Text>
            {notification.priority && (
              <Badge colorScheme={getPriorityColor(notification.priority)} size="sm" borderRadius="full">
                {notification.priority}
              </Badge>
            )}
            {notification.category && (
              <Badge variant="outline" size="sm" borderRadius="full">
                {notification.category}
              </Badge>
            )}
          </HStack>
          
          <Text fontSize="sm" color="gray.600" lineHeight="1.4">
            {notification.message}
          </Text>
          
          <Text fontSize="xs" color="gray.400">
            {formatTimestamp(notification.timestamp)}
          </Text>
        </VStack>
        
        <VStack gap={1} align="end">
          {!notification.read && (
            <Button
              size="xs"
              colorScheme="blue"
              variant="ghost"
              onClick={() => onMarkAsRead(notification.id)}
              _hover={{ bg: "blue.100" }}
            >
              Mark Read
            </Button>
          )}
          {onDismiss && (
            <IconButton
              size="xs"
              aria-label="Dismiss"
              variant="ghost"
              onClick={() => onDismiss(notification.id)}
              _hover={{ bg: "red.100", color: "red.600" }}
            >
              ×
            </IconButton>
          )}
        </VStack>
      </HStack>
    </Box>
  );
};

interface SSENotificationDisplayProps {
  maxItems?: number;
  showOnlyUnread?: boolean;
  allowDismiss?: boolean;
  height?: string;
}

export const SSENotificationDisplay: React.FC<SSENotificationDisplayProps> = ({
  maxItems = 10,
  showOnlyUnread = false,
  allowDismiss = false,
  height = "400px"
}) => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    clearNotifications,
    isConnected,
    status
  } = useSSENotificationContext();

  const displayNotifications = showOnlyUnread
    ? notifications.filter(n => !n.read).slice(0, maxItems)
    : notifications.slice(0, maxItems);

  const handleDismiss = (id: string) => {
    if (allowDismiss) {
      markAsRead(id);
    }
  };

  return (
    <Box>
      {/* Header */}
      <HStack justify="space-between" mb={4}>
        <HStack gap={2}>
          <Text fontWeight="bold" fontSize="lg">Notifications</Text>
          {unreadCount > 0 && (
            <Badge colorScheme="red" borderRadius="full" fontSize="xs">
              {unreadCount}
            </Badge>
          )}
        </HStack>
        
        <HStack gap={2}>
          {/* Connection status indicator */}
          <Box
            w={2}
            h={2}
            borderRadius="full"
            bg={isConnected ? "green.400" : "red.400"}
            title={`Connection: ${status}`}
          />
          
          {notifications.length > 0 && (
            <Button 
              size="xs" 
              variant="ghost" 
              onClick={clearNotifications}
              _hover={{ bg: "gray.100" }}
            >
              Clear All
            </Button>
          )}
        </HStack>
      </HStack>

      {/* Notifications list */}
      <Box
        maxH={height}
        overflowY="auto"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="md"
        p={3}
        bg="white"
        shadow="sm"
      >
        {displayNotifications.length === 0 ? (
          <Box textAlign="center" py={8} color="gray.500">
            <Text fontSize="sm">
              {showOnlyUnread ? 'No unread notifications' : 'No notifications'}
            </Text>
          </Box>
        ) : (
          <VStack gap={3} align="stretch">
            {displayNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={markAsRead}
                onDismiss={allowDismiss ? handleDismiss : undefined}
              />
            ))}
          </VStack>
        )}
      </Box>

      {/* Footer info */}
      {notifications.length > maxItems && (
        <Text fontSize="xs" color="gray.500" mt={3} textAlign="center">
          Showing {maxItems} of {notifications.length} notifications
        </Text>
      )}
    </Box>
  );
};

export default SSENotificationDisplay;