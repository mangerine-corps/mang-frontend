import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  IconButton,
  Flex,
  VStack,
  HStack,
  Badge,
  Icon,
  Portal,
  Button,
} from '@chakra-ui/react';
import {
  FiBell,
  FiX,
  FiCheck,
  FiAlertCircle,
  FiInfo,
  FiClock,
  FiMessageSquare,
  FiDollarSign,
  FiCalendar,
  FiSettings,
} from 'react-icons/fi';
import { useNotifications } from '../../hooks/useNotifications';
import { NotificationData } from '../../types/sse.types';
import { toaster } from '../ui/toaster';

interface FloatingNotificationProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  maxNotifications?: number;
  autoHide?: boolean;
  autoHideDelay?: number;
  showBadge?: boolean;
  showConnectionStatus?: boolean;
  enableSound?: boolean;
  enableVibration?: boolean;
}

interface NotificationItemProps {
  notification: NotificationData;
  onMarkAsRead: (id: string) => void;
  onDismiss: (id: string) => void;
  onAction?: (notification: NotificationData) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  onDismiss,
  onAction
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  const getNotificationIcon = (type: string, priority?: string) => {
    switch (type) {
      case 'payment':
        return FiDollarSign;
      case 'appointment':
        return FiCalendar;
      case 'message':
        return FiMessageSquare;
      case 'system':
        return FiSettings;
      case 'reminder':
        return FiClock;
      default:
        return priority === 'urgent' ? FiAlertCircle : FiInfo;
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'urgent': return 'red';
      case 'high': return 'orange';
      case 'medium': return 'yellow';
      case 'low': return 'green';
      default: return 'blue';
    }
  };

  const formatTimestamp = (timestamp: Date | string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const handleMarkAsRead = () => {
    setIsVisible(false);
    setTimeout(() => {
      onMarkAsRead(notification.id);
    }, 300);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      onDismiss(notification.id);
    }, 300);
  };

  const handleAction = () => {
    onAction?.(notification);
    handleMarkAsRead();
  };

  const IconComponent = getNotificationIcon(notification.type, notification.priority);

  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor={notification.read ? "gray.200" : "blue.200"}
      borderRadius="lg"
      boxShadow="lg"
      p={4}
      mb={3}
      maxW="400px"
      minW="320px"
      position="relative"
      _hover={{ 
        boxShadow: "xl",
        transform: "translateY(-2px)",
        transition: "all 0.2s"
      }}
      transition="all 0.2s"
    >
      {/* Header */}
      <Flex justify="space-between" align="start" mb={3}>
        <HStack gap={2} flex={1}>
          <Box
            w={8}
            h={8}
            borderRadius="full"
            bg={getPriorityColor(notification.priority)}
            color="white"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Icon as={IconComponent} boxSize={4} />
          </Box>
          <VStack align="start" gap={0} flex={1}>
            <Text fontWeight="bold" fontSize="sm" color="gray.800" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
              {notification.title}
            </Text>
            <Text fontSize="xs" color="gray.500">
              {formatTimestamp(notification.timestamp)}
            </Text>
          </VStack>
        </HStack>
        
        <HStack gap={1}>
          {notification.priority && (
            <Badge 
              colorScheme={getPriorityColor(notification.priority)} 
              size="sm" 
              borderRadius="full"
            >
              {notification.priority}
            </Badge>
          )}
          <Button
            size="xs"
            aria-label="Dismiss"
            variant="ghost"
            onClick={handleDismiss}
            _hover={{ bg: "red.100", color: "red.600" }}
            p={2}
            minW="auto"
            h="auto"
          >
            <Icon as={FiX} boxSize={4} />
          </Button>
        </HStack>
      </Flex>

      {/* Message */}
      <Box mb={3}>
        <Text fontSize="sm" color="gray.700" lineHeight="1.4">
          {notification.message}
        </Text>
        
        {notification.data && (
          <Box mt={2} p={2} bg="gray.50" borderRadius="md">
            <Text fontSize="xs" color="gray.600">
              {JSON.stringify(notification.data, null, 2)}
            </Text>
          </Box>
        )}
      </Box>

      {/* Footer */}
      <Flex justify="space-between" align="center">
        <HStack gap={2}>
          {!notification.read && (
            <Button
              size="xs"
              colorScheme="blue"
              variant="ghost"
              onClick={handleMarkAsRead}
            >
              <Icon as={FiCheck} mr={1} />
              Mark Read
            </Button>
          )}
        </HStack>
        
        {onAction && (
          <Button
            size="xs"
            colorScheme="blue"
            onClick={handleAction}
          >
            View
          </Button>
        )}
      </Flex>

      {/* Unread indicator */}
      {!notification.read && (
        <Box
          position="absolute"
          top={2}
          right={2}
          w={2}
          h={2}
          bg="blue.500"
          borderRadius="full"
        />
      )}
    </Box>
  );
};

export const FloatingNotification: React.FC<FloatingNotificationProps> = ({
  position = 'top-right',
  maxNotifications = 5,
  autoHide = true,
  autoHideDelay = 5000,
  showBadge = true,
  showConnectionStatus = true,
  enableSound = true,
  enableVibration = true
}) => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    isConnected,
    status,
    hasError
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);
  const [recentNotifications, setRecentNotifications] = useState<NotificationData[]>([]);
  const [audio] = useState<HTMLAudioElement | null>(
    typeof window !== 'undefined' ? new Audio('/sounds/notification.mp3') : null
  );

  // Filter recent unread notifications
  useEffect(() => {
    const recent = notifications
      .filter(n => !n.read)
      .slice(0, maxNotifications);
    setRecentNotifications(recent);
  }, [notifications, maxNotifications]);

  // Auto-hide notifications
  useEffect(() => {
    if (autoHide && recentNotifications.length > 0) {
      const timer = setTimeout(() => {
        recentNotifications.forEach(notification => {
          if (!notification.read) {
            markAsRead(notification.id);
          }
        });
      }, autoHideDelay);

      return () => clearTimeout(timer);
    }
  }, [recentNotifications, autoHide, autoHideDelay, markAsRead]);

  // Play notification sound and vibrate
  const playNotification = () => {
    if (enableSound && audio) {
      audio.play().catch(console.error);
    }
    if (enableVibration && 'vibrate' in navigator) {
      navigator.vibrate(200);
    }
  };

  // Handle new notifications
  useEffect(() => {
    const newNotifications = recentNotifications.filter(n => !n.read);
    if (newNotifications.length > 0) {
      playNotification();
      
      // Show toast for urgent notifications
      const urgentNotifications = newNotifications.filter(n => n.priority === 'urgent');
      urgentNotifications.forEach(notification => {
        toaster.create({
          title: notification.title,
          description: notification.message,
          type: 'warning',
          duration: 5000,
          closable: true
        });
      });
    }
  }, [recentNotifications]);

  const getPositionStyles = () => {
    switch (position) {
      case 'top-left':
        return { top: 4, left: 4 };
      case 'top-right':
        return { top: 4, right: 4 };
      case 'bottom-left':
        return { bottom: 4, left: 4 };
      case 'bottom-right':
        return { bottom: 4, right: 4 };
      default:
        return { top: 4, right: 4 };
    }
  };

  const handleNotificationAction = (notification: NotificationData) => {
    // Handle different notification types
    switch (notification.type) {
      case 'payment':
        // Navigate to payment page
        window.location.href = '/payments';
        break;
      case 'appointment':
        // Navigate to appointments page
        window.location.href = '/appointments';
        break;
      case 'message':
        // Navigate to messages page
        window.location.href = '/messages';
        break;
      default:
        // Navigate to notifications page
        window.location.href = '/notifications';
    }
  };

  return (
    <Portal>
      <Box
        position="fixed"
        zIndex={9999}
        {...getPositionStyles()}
      >
        {/* Notification Bell */}
        <Box position="relative" mb={3}>
          <Button
            aria-label="Notifications"
            size="lg"
            colorScheme="blue"
            variant="solid"
            borderRadius="full"
            onClick={() => setIsOpen(!isOpen)}
            position="relative"
            _hover={{ transform: "scale(1.1)" }}
            transition="all 0.2s"
            p={4}
            minW="auto"
            h="auto"
          >
            <Icon as={FiBell} boxSize={6} />
          </Button>
          
          {/* Badge */}
          {showBadge && unreadCount > 0 && (
            <Badge
              position="absolute"
              top="-2"
              right="-2"
              colorScheme="red"
              borderRadius="full"
              minW="20px"
              h="20px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="xs"
              fontWeight="bold"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
          
          {/* Connection Status */}
          {showConnectionStatus && (
            <Box
              position="absolute"
              bottom="-2"
              right="-2"
              w={3}
              h={3}
              borderRadius="full"
              bg={hasError ? "red.500" : isConnected ? "green.500" : "yellow.500"}
              border="2px solid white"
              title={`Connection: ${status}`}
            />
          )}
        </Box>

        {/* Notifications Panel */}
        {isOpen && (
          <Box
            bg="white"
            borderRadius="lg"
            boxShadow="2xl"
            p={4}
            maxH="500px"
            overflowY="auto"
            minW="350px"
            border="1px solid"
            borderColor="gray.200"
          >
            {/* Header */}
            <Flex justify="space-between" align="center" mb={4}>
              <Text fontWeight="bold" fontSize="lg">
                Notifications
              </Text>
              <HStack gap={2}>
                <Box
                  w={2}
                  h={2}
                  borderRadius="full"
                  bg={hasError ? "red.500" : isConnected ? "green.500" : "yellow.500"}
                  title={`Connection: ${status}`}
                />
                {unreadCount > 0 && (
                  <Button
                    size="xs"
                    variant="ghost"
                    onClick={() => {
                      recentNotifications.forEach(n => markAsRead(n.id));
                    }}
                  >
                    Mark All Read
                  </Button>
                )}
              </HStack>
            </Flex>

            {/* Notifications List */}
            <VStack gap={3} align="stretch">
              {recentNotifications.length === 0 ? (
                <Box textAlign="center" py={8} color="gray.500">
                  <Icon as={FiBell} boxSize={8} mb={2} />
                  <Text fontSize="sm">No new notifications</Text>
                </Box>
              ) : (
                recentNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={markAsRead}
                    onDismiss={markAsRead}
                    onAction={handleNotificationAction}
                  />
                ))
              )}
            </VStack>

            {/* Footer */}
            {recentNotifications.length > 0 && (
              <>
                <Box borderTop="1px" borderColor="gray.200" my={3} />
                <Flex justify="center">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => window.location.href = '/notifications'}
                  >
                    View All Notifications
                  </Button>
                </Flex>
              </>
            )}
          </Box>
        )}
      </Box>
    </Portal>
  );
};

export default FloatingNotification; 