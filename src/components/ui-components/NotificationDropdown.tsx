import React, { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  VStack,
  Spinner,
  HStack,
} from '@chakra-ui/react';
import { Bell, X, MessageCircle, Calendar, CreditCard, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/router';
import {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  NotificationItem,
} from 'mangarine/state/services/notifications.service';
import { useNotifications } from '../../hooks/useNotifications';

interface NotificationDropdownProps {
  trigger?: (onClick: () => void, unreadCount: number) => React.ReactNode;
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'message': return <MessageCircle size={15} />;
    case 'appointment': return <Calendar size={15} />;
    case 'payment': return <CreditCard size={15} />;
    default: return <AlertCircle size={15} />;
  }
};

const formatTimestamp = (ts?: string) => {
  if (!ts) return '';
  const now = new Date();
  const diff = now.getTime() - new Date(ts).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(ts).toLocaleDateString();
};

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ trigger }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const { isConnected } = useNotifications();

  const { data: notifData, isLoading } = useGetNotificationsQuery(
    { limit: 15 },
    { pollingInterval: 30000 }
  );

  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();

  const notifications: NotificationItem[] = notifData?.data ?? [];
  const unreadCount = notifications.filter((n) => n.status === 'unread').length;

  const handleMarkAll = async () => {
    await markAllAsRead();
  };

  const handleItemClick = async (n: NotificationItem) => {
    if (n.status === 'unread') {
      markAsRead({ notificationId: n.id });
    }
    setIsOpen(false);
  };

  return (
    <Box position="relative">
      {trigger ? (
        trigger(() => setIsOpen((o) => !o), unreadCount)
      ) : (
        <Box cursor="pointer" onClick={() => setIsOpen((o) => !o)} position="relative">
          <Bell size={20} />
          {unreadCount > 0 && (
            <Box
              position="absolute"
              top={-1}
              right={-1}
              bg="red.500"
              color="white"
              rounded="full"
              minW="16px"
              h="16px"
              fontSize="9px"
              lineHeight="16px"
              textAlign="center"
              px={0.5}
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Box>
          )}
        </Box>
      )}

      {isOpen && (
        <Box
          position="absolute"
          top="calc(100% + 10px)"
          right="0"
          bg="bg_box"
          borderWidth="1px"
          borderColor="input_border"
          rounded="xl"
          shadow="lg"
          w="380px"
          maxH="520px"
          overflow="hidden"
          zIndex="max"
        >
          {/* Header */}
          <Flex
            justify="space-between"
            align="center"
            px={4}
            py={3}
            borderBottomWidth="1px"
            borderColor="input_border"
          >
            <HStack gap={2}>
              <Text fontWeight="600" fontSize="0.95rem" color="text_primary" fontFamily="Outfit">
                Notifications
              </Text>
              {unreadCount > 0 && (
                <Box
                  bg="red.500"
                  color="white"
                  rounded="full"
                  minW="18px"
                  h="18px"
                  fontSize="10px"
                  lineHeight="18px"
                  textAlign="center"
                  px={1}
                >
                  {unreadCount}
                </Box>
              )}
              <Box
                w={2}
                h={2}
                rounded="full"
                bg={isConnected ? 'green.400' : 'red.400'}
                title={isConnected ? 'Live' : 'Disconnected'}
              />
            </HStack>
            <Box
              as="button"
              onClick={() => setIsOpen(false)}
              color="grey.400"
              _hover={{ color: 'text_primary' }}
              p={1}
            >
              <X size={16} />
            </Box>
          </Flex>

          {/* List */}
          <Box maxH="400px" overflowY="auto" css={{ '&::-webkit-scrollbar': { width: 0 } }}>
            {isLoading ? (
              <Flex justify="center" align="center" py={10}>
                <Spinner size="sm" />
              </Flex>
            ) : notifications.length === 0 ? (
              <Flex direction="column" align="center" justify="center" py={10} gap={2}>
                <Bell size={28} color="gray" />
                <Text fontSize="0.875rem" color="grey.400" fontFamily="Outfit">
                  No notifications yet
                </Text>
              </Flex>
            ) : (
              <VStack gap={0} align="stretch">
                {notifications.map((n, idx) => (
                  <Box key={n.id}>
                    <Flex
                      px={4}
                      py={3}
                      gap={3}
                      cursor="pointer"
                      _hover={{ bg: 'main_background' }}
                      onClick={() => handleItemClick(n)}
                      align="flex-start"
                      position="relative"
                    >
                      {n.status === 'unread' && (
                        <Box
                          position="absolute"
                          left={2}
                          top="50%"
                          transform="translateY(-50%)"
                          w={1.5}
                          h={1.5}
                          rounded="full"
                          bg="blue.500"
                        />
                      )}
                      <Box color="grey.400" mt={0.5} flexShrink={0}>
                        {getNotificationIcon(n.type)}
                      </Box>
                      <Box flex={1} minW={0}>
                        <Text
                          fontSize="0.85rem"
                          fontWeight={n.status === 'unread' ? '600' : '400'}
                          color="text_primary"
                          fontFamily="Outfit"
                          lineClamp={1}
                        >
                          {n.title}
                        </Text>
                        <Text fontSize="0.78rem" color="grey.500" fontFamily="Outfit" lineClamp={2} mt={0.5}>
                          {n.message}
                        </Text>
                        <Text fontSize="0.72rem" color="grey.400" fontFamily="Outfit" mt={1}>
                          {formatTimestamp(n.createdAt)}
                        </Text>
                      </Box>
                    </Flex>
                    {idx < notifications.length - 1 && (
                      <Box borderBottomWidth="1px" borderColor="input_border" />
                    )}
                  </Box>
                ))}
              </VStack>
            )}
          </Box>

          {/* Footer */}
          {notifications.length > 0 && (
            <Flex
              justify="space-between"
              align="center"
              px={4}
              py={2.5}
              borderTopWidth="1px"
              borderColor="input_border"
            >
              <Box
                as="button"
                fontSize="0.78rem"
                color="grey.500"
                fontFamily="Outfit"
                _hover={{ color: 'text_primary' }}
                onClick={handleMarkAll}
              >
                Mark all as read
              </Box>
              <Box
                as="button"
                fontSize="0.78rem"
                color="blue.500"
                fontFamily="Outfit"
                _hover={{ textDecoration: 'underline' }}
                onClick={() => { setIsOpen(false); router.push('/notifications'); }}
              >
                See all
              </Box>
            </Flex>
          )}
        </Box>
      )}
    </Box>
  );
};

export default NotificationDropdown;
