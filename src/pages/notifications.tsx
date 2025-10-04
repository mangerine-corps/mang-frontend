import React, { useState, useMemo } from 'react';
import { Box, VStack, HStack, Text, Badge, Button, Select, Input, InputGroup } from '@chakra-ui/react';
import { useAuth } from '../state/hooks/user.hook';
import { useSSENotificationContext, SSENotificationProvider } from '../contexts/SSENotificationContext';
import { SSENotificationDisplay } from '../components/SSENotificationDisplay';
import { NotificationData } from '../types/sse.types';
import AppLayout from '../layouts/AppLayout';
import Biocard from 'mangarine/components/ui-components/biocard';
import DashboardCard from 'mangarine/components/ui-components/dashboardcard';
import ActivityEmptyState from 'mangarine/components/ui-components/emptystate';

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

const NotificationFiltersComponent: React.FC<{
    filters: NotificationFilters;
    onFiltersChange: (filters: NotificationFilters) => void;
    totalNotifications: number;
    unreadCount: number;
}> = ({ filters, onFiltersChange, totalNotifications, unreadCount }) => {
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
                        <InputGroup startElement={<Text
                            position="absolute"
                            left={3}
                            top="50%"
                            transform="translateY(-50%)"
                            fontSize="sm"
                            zIndex={1}
                            pointerEvents="none"
                        >
                            🔍
                        </Text>} position="relative">

                            <Input

                                placeholder="Search notifications..."
                                value={filters.search}
                                onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
                                pl={8}
                            />
                        </InputGroup>
                    </Box>
                </HStack>
            </VStack>
        </Box>
    );
};

const NotificationItem: React.FC<{
    notification: NotificationData;
    onMarkAsRead: (id: string) => void;
}> = ({ notification, onMarkAsRead }) => {
    const getPriorityColor = (priority?: string) => {
        switch (priority) {
            case 'urgent': return 'red';
            case 'high': return 'orange';
            case 'medium': return 'yellow';
            case 'low': return 'green';
            default: return 'gray';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'payment': return '💰';
            case 'appointment': return '📅';
            case 'system': return '⚙️';
            case 'custom': return '📝';
            default: return '📢';
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
                        <Text fontSize="lg">{getTypeIcon(notification.type)}</Text>
                        <Text fontWeight="bold" fontSize="sm" color="gray.800">
                            {notification.title}
                        </Text>
                        {/* {notification.priority && (
                            <Badge colorScheme={getPriorityColor(notification.priority)} size="sm" borderRadius="full">
                                {notification.priority}
                            </Badge>
                        )} */}
                        {notification.category && (
                            <Badge variant="outline" size="sm" borderRadius="full">
                                {notification.category}
                            </Badge>
                        )}
                        {!notification.read && (
                            <Badge colorScheme="blue" size="sm" borderRadius="full">
                                New
                            </Badge>
                        )}
                    </HStack>

                    <Text fontSize="sm" color="gray.600" lineHeight="1.4">
                        {notification.message}
                    </Text>

                    <HStack gap={2}>
                        <Text fontSize="xs" color="gray.400">
                            {formatTimestamp(notification.timestamp)}
                        </Text>
                        <Text fontSize="xs" color="gray.400">
                            Type: {notification.type}
                        </Text>
                    </HStack>
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
                </VStack>
            </HStack>
        </Box>
    );
};

const NotificationsPage: React.FC = () => {
    const { user } = useAuth();
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
        getUnreadNotifications
    } = useSSENotificationContext();

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

            <Box
                display={"flex"}
                // bg="red.900"
                flexDir={{ base: "column", md: "row", lg: "row", xl: "row" }}
                // alignItems={"center"}
                my={{ base: "0", md: "12px" }}
                justifyContent={"space-between"}
                w={{ base: "98%", md: "96%", lg: "96%", xl: "full" }}
                mx="auto"
                pos="relative"
                overflowY={"scroll"}
                // spaceY={{ base: "4", md: "0" }}
                css={{
                    "&::-webkit-scrollbar": {
                        width: "0px",

                        height: "0px",
                    },
                    "&::-webkit-scrollbar-track": {
                        width: "0px",
                        background: "transparent",

                        height: "0px",
                    },
                    "&::-webkit-scrollbar-thumb": {
                        background: "transparent",
                        borderRadius: "0px",
                        maxHeight: "0px",
                        height: "0px",
                        width: 0,
                    },
                }}
            >
                <VStack bg={{ base: "bg_box", md: "transparent" }} display={{ base: "none", md: "none", lg: "none", xl: "flex" }} >
                    <Biocard />
                    <DashboardCard />
                </VStack>
                <VStack gap={6} align="stretch">
                    {/* Header */}
                    <HStack justify="space-between">
                        <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                            Notifications
                        </Text>
                        <HStack gap={2} bg="red.700">
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
                                px="4"
                            >
                                Mark All As Read
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
                <VStack>
                    <ActivityEmptyState />
                </VStack>
            </Box>
        </AppLayout>
    );
};

// Wrapper component with SSE provider
const NotificationsPageWithSSE: React.FC = () => {
    const { user, token } = useAuth();

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
        <SSENotificationProvider
            userId={user.id}
            options={{
                mode: 'secure',
                token: token,
                autoReconnect: true
            }}
        >
            <NotificationsPage />
        </SSENotificationProvider>
    );
};

export default NotificationsPageWithSSE; 