import React, { useState, useMemo } from 'react';
import { Box, VStack, HStack, Text, Badge, Button, Input, InputGroup, Flex, Image } from '@chakra-ui/react';
import { useAuth } from '../state/hooks/user.hook';
import { useUnifiedNotifications } from '../state/hooks/useUnifiedNotifications';
import { NotificationData } from '../types/sse.types';
import AppLayout from '../layouts/AppLayout';

// Notification filter types
type NotificationType = 'all' | 'payment' | 'appointment' | 'system' | 'custom';
type NotificationPriority = 'all' | 'low' | 'medium' | 'high' | 'urgent';
type NotificationStatus = 'all' | 'read' | 'unread';

interface NotificationFilters {
  type: NotificationType;
  priority: NotificationPriority;
  status: NotificationStatus;
  search: string;
}

const ConnectionStatusBadge: React.FC<{
  isConnected: boolean;
  status: string;
  label: string;
}> = ({ isConnected, status, label }) => (
  <Badge 
    colorScheme={isConnected ? 'green' : 'red'} 
    borderRadius="full"
    fontSize="xs"
    title={`${label}: ${status}`}
  >
    {label}
  </Badge>
);

const NotificationFiltersComponent: React.FC<{
  filters: NotificationFilters;
  onFiltersChange: (filters: NotificationFilters) => void;
  totalNotifications: number;
  unreadCount: number;
  connectionStates: {
    paymentConnected: boolean;
    appointmentConnected: boolean;
    systemConnected: boolean;
    broadcastConnected: boolean;
  };
}> = ({ filters, onFiltersChange, totalNotifications, unreadCount, connectionStates }) => {
  return (
    <Box p={4} bg="white" border="1px solid" borderColor="gray.200" borderRadius="md" mb={4}>
      <VStack gap={4} align="stretch">
        <HStack justify="space-between">
          <Text fontWeight="bold" fontSize="lg">Notifications</Text>
          <HStack gap={2}>
            <Badge colorScheme="blue" borderRadius="full">
              Total: {totalNotifications}
            </Badge>
            <Badge colorScheme="red" borderRadius="full">
              Unread: {unreadCount}
            </Badge>
          </HStack>
        </HStack>

        {/* Connection Status */}
        <HStack gap={2} wrap="wrap">
          <Text fontSize="sm" fontWeight="medium">Connections:</Text>
          <ConnectionStatusBadge 
            isConnected={connectionStates.paymentConnected} 
            status="payment" 
            label="Payment" 
          />
          <ConnectionStatusBadge 
            isConnected={connectionStates.appointmentConnected} 
            status="appointment" 
            label="Appointment" 
          />
          <ConnectionStatusBadge 
            isConnected={connectionStates.systemConnected} 
            status="system" 
            label="System" 
          />
          <ConnectionStatusBadge 
            isConnected={connectionStates.broadcastConnected} 
            status="broadcast" 
            label="Broadcast" 
          />
        </HStack>

        <HStack gap={4} wrap="wrap">
          {/* Type Filter */}
          <Box>
            <Text fontSize="sm" mb={1}>Type</Text>
            <select
              value={filters.type}
              onChange={(e) => onFiltersChange({ ...filters, type: e.target.value as NotificationType })}
              style={{
                width: '150px',
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                backgroundColor: 'white',
                fontSize: '14px'
              }}
            >
              <option value="all">All Types</option>
              <option value="payment">Payment</option>
              <option value="appointment">Appointment</option>
              <option value="system">System</option>
              <option value="custom">Custom</option>
            </select>
          </Box>

          {/* Priority Filter */}
          <Box>
            <Text fontSize="sm" mb={1}>Priority</Text>
            <select
              value={filters.priority}
              onChange={(e) => onFiltersChange({ ...filters, priority: e.target.value as NotificationPriority })}
              style={{
                width: '150px',
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                backgroundColor: 'white',
                fontSize: '14px'
              }}
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </Box>

          {/* Status Filter */}
          <Box>
            <Text fontSize="sm" mb={1}>Status</Text>
            <select
              value={filters.status}
              onChange={(e) => onFiltersChange({ ...filters, status: e.target.value as NotificationStatus })}
              style={{
                width: '150px',
                padding: '8px',
                borderRadius: '6px',
                border: '1px solid #e2e8f0',
                backgroundColor: 'white',
                fontSize: '14px'
              }}
            >
              <option value="all">All Status</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
          </Box>

          {/* Search */}
          <Box flex={1}>
            <Text fontSize="sm" mb={1}>Search</Text>
            <Box position="relative">
              <Text
                position="absolute"
                left={3}
                top="50%"
                transform="translateY(-50%)"
                fontSize="sm"
                zIndex={1}
                pointerEvents="none"
              >
                🔍
              </Text>
              <Input
                placeholder="Search notifications..."
                value={filters.search}
                onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
                size="sm"
                pl={8}
                bg="white"
                border="1px solid"
                borderColor="gray.300"
              />
            </Box>
          </Box>
        </HStack>
      </VStack>
    </Box>
  );
};

// NotificationItem component adapted from notificationpage.tsx
const NotificationItem: React.FC<{
  notification: NotificationData;
  onMarkAsRead: (id: string) => void;
}> = ({ notification, onMarkAsRead }) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'payment': return '💰';
      case 'appointment': return '📅';
      case 'system': return '⚙️';
      case 'custom': return '📝';
      default: return '📢';
    }
  };

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
    const now = new Date();
    const diffInMinutes = Math.floor((date.getTime() - now.getTime()) / (1000 * 60));
    
    if (diffInMinutes === 0) return 'Just now';
    if (diffInMinutes < 0) return `${Math.abs(diffInMinutes)}m ago`;
    return `in ${diffInMinutes}m`;
  };

  // Check if notification has actions (for payment/appointment types)
  const hasActions = notification.type === 'payment' || notification.type === 'appointment';

  return (
    <Flex
      p={3}
      gap={3}
      borderRadius="md"
      align="start"
      cursor="pointer"
      bg={notification.read ? "transparent" : "blue.50"}
      border={notification.read ? "none" : "1px solid"}
      borderColor={notification.read ? "transparent" : "blue.200"}
      _hover={{ bg: "gray.50" }}
      transition="all 0.2s"
    >
      {/* Avatar/Icon */}
      <Box
        boxSize="40px"
        borderRadius="full"
        bg="gray.100"
        display="flex"
        alignItems="center"
        justifyContent="center"
        fontSize="20px"
      >
        {getTypeIcon(notification.type)}
      </Box>

      <Box flex="1">
        <Flex justify="space-between" gap={2} align="start">
          <Box>
            <HStack gap={2} mb={1} wrap="wrap">
              <Text
                font="outfit"
                color="text_primary"
                fontWeight="600"
                fontSize="1rem"
              >
                {notification.title}
              </Text>
              {notification.priority && (
                <Badge 
                  colorScheme={getPriorityColor(notification.priority)} 
                  size="sm" 
                  borderRadius="full"
                >
                  {notification.priority}
                </Badge>
              )}
              {!notification.read && (
                <Badge colorScheme="blue" size="sm" borderRadius="full">
                  New
                </Badge>
              )}
            </HStack>
            
            <Text
              font="outfit"
              fontWeight="400"
              fontSize="0.875rem"
              color="gray.500"
              mb={2}
            >
              {notification.message}
            </Text>

            {/* Action buttons for specific notification types */}
            {hasActions && !notification.read && (
              <HStack
                mt={3}
                gap={3}
                direction={{ base: "column", sm: "row" }}
                justify={{ base: "center", sm: "flex-start" }}
                align="stretch"
                w="full"
              >
                {notification.type === 'payment' && (
                  <>
                    <Button
                      px={4}
                      py={2}
                      borderRadius="8px"
                      color="text_primary"
                      border="1px solid"
                      variant="outline"
                      size="sm"
                    >
                      Request Refund
                    </Button>
                    <Button
                      px={4}
                      py={2}
                      gap="10px"
                      borderRadius="8px"
                      bg="blue.900"
                      color="white"
                      _hover={{ bg: "blue.800" }}
                      size="sm"
                    >
                      View Details
                    </Button>
                  </>
                )}
                
                {notification.type === 'appointment' && (
                  <>
                    <Button
                      px={4}
                      py={2}
                      borderRadius="8px"
                      color="text_primary"
                      border="1px solid"
                      variant="outline"
                      size="sm"
                    >
                      Reschedule
                    </Button>
                    <Button
                      px={4}
                      py={2}
                      gap="10px"
                      borderRadius="8px"
                      bg="blue.900"
                      color="white"
                      _hover={{ bg: "blue.800" }}
                      size="sm"
                    >
                      View Details
                    </Button>
                  </>
                )}
              </HStack>
            )}
          </Box>
          
          <VStack gap={1} align="end">
            <Text
              font="outfit"
              color="text_primary"
              fontWeight="600"
              fontSize="1rem"
            >
              {formatTimestamp(notification.timestamp)}
            </Text>
            
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
          </VStack>
        </Flex>
      </Box>
    </Flex>
  );
};

const UnifiedNotificationsPage: React.FC = () => {
  const { user, token } = useAuth();
  const [filters, setFilters] = useState<NotificationFilters>({
    type: 'all',
    priority: 'all',
    status: 'all',
    search: ''
  });

  const {
    notifications,
    unreadCount,
    markAsRead,
    clearNotifications,
    isConnected,
    status,
    paymentConnected,
    appointmentConnected,
    systemConnected,
    broadcastConnected,
    getUnreadNotifications,
    getNotificationsByType,
    getNotificationsByPriority
  } = useUnifiedNotifications({
    userId: user?.id,
    token,
    enablePayment: true,
    enableAppointment: true,
    enableSystem: true,
    enableBroadcast: false,
    onNotification: (notification) => {
      console.log('New unified notification:', notification);
    },
    onError: (error) => {
      console.error('Unified notification error:', error);
    }
  });

  // Filter and sort notifications
  const filteredNotifications = useMemo(() => {
    let filtered = [...notifications];

    // Type filter
    if (filters.type !== 'all') {
      filtered = filtered.filter(n => n.type === filters.type);
    }

    // Priority filter
    if (filters.priority !== 'all') {
      filtered = filtered.filter(n => n.priority === filters.priority);
    }

    // Status filter
    if (filters.status === 'read') {
      filtered = filtered.filter(n => n.read);
    } else if (filters.status === 'unread') {
      filtered = filtered.filter(n => !n.read);
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(searchLower) ||
        n.message.toLowerCase().includes(searchLower) ||
        n.type.toLowerCase().includes(searchLower)
      );
    }

    // Sort by timestamp (newest first)
    return filtered.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [notifications, filters]);

  const handleMarkAllAsRead = () => {
    notifications.forEach(notification => {
      if (!notification.read) {
        markAsRead(notification.id);
      }
    });
  };

  if (!user) {
    return (
      <AppLayout>
        <Box p={8} textAlign="center">
          <Text>Please log in to view notifications</Text>
        </Box>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <Box p={6} maxW="1200px" mx="auto">
        <VStack gap={6} align="stretch">
          {/* Header */}
          <HStack justify="space-between">
            <Text fontSize="2xl" fontWeight="bold" color="gray.800">
              Unified Notifications
            </Text>
            <HStack gap={2}>
              <Badge 
                colorScheme={isConnected ? 'green' : 'red'} 
                borderRadius="full"
                fontSize="xs"
              >
                {isConnected ? 'Connected' : 'Disconnected'}
              </Badge>
              <Button 
                size="sm" 
                onClick={handleMarkAllAsRead}
                variant="outline"
                _hover={{ bg: "gray.100" }}
                disabled={unreadCount === 0}
              >
                Mark All Read
              </Button>
              <Button 
                size="sm" 
                onClick={clearNotifications}
                variant="outline"
                _hover={{ bg: "red.100" }}
                colorScheme="red"
              >
                Clear All
              </Button>
            </HStack>
          </HStack>

          {/* Filters */}
          <NotificationFiltersComponent
            filters={filters}
            onFiltersChange={setFilters}
            totalNotifications={notifications.length}
            unreadCount={unreadCount}
            connectionStates={{
              paymentConnected,
              appointmentConnected,
              systemConnected,
              broadcastConnected
            }}
          />

          {/* Notifications List */}
          <Box
            border="1px solid"
            borderColor="gray.200"
            borderRadius="md"
            bg="white"
            shadow="sm"
            minH="400px"
          >
            {filteredNotifications.length === 0 ? (
              <Box textAlign="center" py={12} color="gray.500">
                <Text fontSize="lg" mb={2}>
                  {filters.search || filters.type !== 'all' || filters.priority !== 'all' || filters.status !== 'all'
                    ? 'No notifications match your filters'
                    : 'No notifications yet'
                  }
                </Text>
                <Text fontSize="sm">
                  {filters.search || filters.type !== 'all' || filters.priority !== 'all' || filters.status !== 'all'
                    ? 'Try adjusting your filters'
                    : 'You\'ll see notifications here when they arrive'
                  }
                </Text>
              </Box>
            ) : (
              <VStack gap={3} p={4} align="stretch">
                {filteredNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={markAsRead}
                  />
                ))}
              </VStack>
            )}
          </Box>

          {/* Footer Stats */}
          <Box textAlign="center" color="gray.500" fontSize="sm">
            <Text>
              Showing {filteredNotifications.length} of {notifications.length} notifications
              {filters.search && ` matching "${filters.search}"`}
            </Text>
          </Box>
        </VStack>
      </Box>
    </AppLayout>
  );
};

export default UnifiedNotificationsPage; 