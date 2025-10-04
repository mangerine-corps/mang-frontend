import React, { useState, useCallback } from 'react';
import {
  Box,
  Flex,
  Text,
  Badge,
  IconButton,
  Button,
  VStack,
  Avatar,
  Image,
} from '@chakra-ui/react';
import { Bell, X, Check, MessageCircle, Calendar, CreditCard, AlertCircle } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import { NotificationData } from '../../types/sse.types';

interface NotificationDropdownProps {
  maxNotifications?: number;
  showConnectionStatus?: boolean;
  autoMarkAsRead?: boolean;
  onNotificationClick?: (notification: NotificationData) => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  maxNotifications = 10,
  showConnectionStatus = true,
  autoMarkAsRead = false,
  onNotificationClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    notifications,
    unreadCount,
    markAsRead,
    isConnected,
    status,
    getUnreadNotifications,
  } = useNotifications();

  // Hardcoded colors for now - replace with theme values later
  const bgColor = 'white';
  const borderColor = 'gray.200';
  const textColor = 'gray.800';
  const mutedTextColor = 'gray.500';

  // Get notifications to display (prioritize unread)
  const displayNotifications = React.useMemo(() => {
    const unread = getUnreadNotifications();
    const read = notifications.filter(n => n.read).slice(0, maxNotifications - unread.length);
    return [...unread, ...read].slice(0, maxNotifications);
  }, [notifications, getUnreadNotifications, maxNotifications]);

  // Handle notification click
  const handleNotificationClick = useCallback((notification: NotificationData) => {
    if (autoMarkAsRead && !notification.read) {
      markAsRead(notification.id);
    }
    onNotificationClick?.(notification);
    setIsOpen(false);
  }, [autoMarkAsRead, markAsRead, onNotificationClick]);

  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageCircle size={16} />;
      case 'appointment':
        return <Calendar size={16} />;
      case 'payment':
        return <CreditCard size={16} />;
      case 'system':
      default:
        return <AlertCircle size={16} />;
    }
  };

  // Get notification color based on priority
  const getNotificationColor = (priority?: string) => {
    switch (priority) {
      case 'urgent':
        return 'red';
      case 'high':
        return 'orange';
      case 'medium':
        return 'blue';
      case 'low':
        return 'gray';
      default:
        return 'blue';
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return timestamp.toLocaleDateString();
  };

  return (
    <Box position="relative">
      <IconButton
        aria-label="Notifications"
        onClick={() => setIsOpen(!isOpen)}
        variant="ghost"
        size="md"
        color={textColor}
        _hover={{ bg: 'gray.100' }}
      >
        <Bell size={20} />
      </IconButton>
      
      {unreadCount > 0 && (
        <Badge
          position="absolute"
          top="-2"
          right="-2"
          colorScheme="red"
          borderRadius="full"
          fontSize="xs"
          minW="20px"
          h="20px"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {unreadCount > 99 ? '99+' : unreadCount}
        </Badge>
      )}

      {/* Dropdown Content */}
      {isOpen && (
        <Box
          position="absolute"
          top="100%"
          right="0"
          mt={2}
          bg={bgColor}
          border="1px"
          borderColor={borderColor}
          borderRadius="md"
          boxShadow="lg"
          w="400px"
          maxH="500px"
          overflow="hidden"
          zIndex="dropdown"
        >
          {/* Header */}
          <Flex
            justify="space-between"
            align="center"
            p={4}
            borderBottom="1px"
            borderColor={borderColor}
          >
            <Flex gap={2} align="center">
              <Text fontWeight="bold" fontSize="lg" color={textColor}>
                Notifications
              </Text>
              {unreadCount > 0 && (
                <Badge colorScheme="red" borderRadius="full" fontSize="xs">
                  {unreadCount}
                </Badge>
              )}
            </Flex>
            
            <Flex gap={2} align="center">
              {showConnectionStatus && (
                <Box
                  w={2}
                  h={2}
                  borderRadius="full"
                  bg={isConnected ? "green.400" : "red.400"}
                  title={`Connection: ${status}`}
                />
              )}
              <Button
                size="xs"
                variant="ghost"
                onClick={() => setIsOpen(false)}
                _hover={{ bg: 'gray.100' }}
              >
                <X size={16} />
              </Button>
            </Flex>
          </Flex>

          {/* Notifications List */}
          <Box maxH="400px" overflowY="auto">
            {displayNotifications.length === 0 ? (
              <Flex
                direction="column"
                align="center"
                justify="center"
                p={8}
                color={mutedTextColor}
              >
                <Bell size={32} />
                <Text mt={2} fontSize="sm">
                  No notifications
                </Text>
                <Text fontSize="xs" textAlign="center">
                  {isConnected ? 'You\'re all caught up!' : 'Connecting...'}
                </Text>
              </Flex>
            ) : (
              <VStack gap={0} align="stretch">
                {displayNotifications.map((notification, index) => (
                  <Box key={notification.id}>
                    <Flex
                      p={4}
                      cursor="pointer"
                      _hover={{ bg: 'gray.50' }}
                      onClick={() => handleNotificationClick(notification)}
                      position="relative"
                    >
                      {/* Unread indicator */}
                      {!notification.read && (
                        <Box
                          position="absolute"
                          left={2}
                          top="50%"
                          transform="translateY(-50%)"
                          w={2}
                          h={2}
                          borderRadius="full"
                          bg="blue.500"
                        />
                      )}

                      {/* Notification icon */}
                      <Box
                        color={getNotificationColor(notification.priority) + '.500'}
                        mr={3}
                        mt={0.5}
                      >
                        {getNotificationIcon(notification.type)}
                      </Box>

                      {/* Notification content */}
                      <Box flex={1} minW={0}>
                        <Text
                          fontSize="sm"
                          fontWeight={notification.read ? "normal" : "semibold"}
                          color={textColor}
                        >
                          {notification.title}
                        </Text>
                        <Text
                          fontSize="xs"
                          color={mutedTextColor}
                          mt={1}
                        >
                          {notification.message}
                        </Text>
                        <Text
                          fontSize="xs"
                          color={mutedTextColor}
                          mt={1}
                        >
                          {formatTimestamp(notification.timestamp)}
                        </Text>
                      </Box>

                      {/* Priority badge */}
                      {notification.priority && notification.priority !== 'medium' && (
                        <Badge
                          colorScheme={getNotificationColor(notification.priority)}
                          size="sm"
                          ml={2}
                        >
                          {notification.priority}
                        </Badge>
                      )}
                    </Flex>
                    {index < displayNotifications.length - 1 && (
                      <Box borderBottom="1px" borderColor={borderColor} />
                    )}
                  </Box>
                ))}
              </VStack>
            )}
          </Box>

          {/* Footer */}
          {displayNotifications.length > 0 && (
            <Box
              p={3}
              borderTop="1px"
              borderColor={borderColor}
              bg="gray.50"
            >
              <Flex justify="space-between" align="center">
                <Text fontSize="xs" color={mutedTextColor}>
                  {notifications.length} total notifications
                </Text>
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={() => {
                    displayNotifications.forEach(n => {
                      if (!n.read) markAsRead(n.id);
                    });
                  }}
                  _hover={{ bg: 'gray.200' }}
                >
                  Mark all as read
                </Button>
              </Flex>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default NotificationDropdown; 