import React, { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  VStack,
  Spinner,
  HStack,
  Image,
} from '@chakra-ui/react';
import { Bell, X, CheckCheck } from 'lucide-react';
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

const formatTimestamp = (ts?: string) => {
  if (!ts) return '';
  const now = new Date();
  const diff = now.getTime() - new Date(ts).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const getDateLabel = (ts?: string): string => {
  if (!ts) return 'Older';
  const d = new Date(ts);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const itemDay = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  if (itemDay.getTime() === today.getTime()) return 'Today';
  if (itemDay.getTime() === yesterday.getTime()) return 'Yesterday';
  return d.toLocaleDateString([], { month: 'long', day: 'numeric' });
};

const getAvatarSrc = (n: NotificationItem): string | undefined => {
  const meta: any = n.metadata ?? {};
  const data: any = n.data ?? {};
  return meta?.senderAvatar ?? meta?.avatar ?? data?.senderAvatar ?? data?.avatar ?? undefined;
};

const getAvatarInitial = (n: NotificationItem): string => {
  const meta: any = n.metadata ?? {};
  const data: any = n.data ?? {};
  const name: string = meta?.senderName ?? data?.senderName ?? n.title ?? '';
  return name.charAt(0).toUpperCase() || '?';
};

const avatarBgColors = [
  '#111D4A', '#0DBC9D', '#FC731A', '#1976D2', '#F71AFC', '#30BC0D',
];
const getAvatarBg = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return avatarBgColors[Math.abs(hash) % avatarBgColors.length];
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

  // Group notifications by date label, preserving order
  const grouped: { label: string; items: NotificationItem[] }[] = [];
  for (const n of notifications) {
    const label = getDateLabel(n.createdAt);
    const existing = grouped.find((g) => g.label === label);
    if (existing) {
      existing.items.push(n);
    } else {
      grouped.push({ label, items: [n] });
    }
  }

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
              <Text fontWeight="700" fontSize="1rem" color="text_primary" fontFamily="Outfit">
                Notification
              </Text>
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
          <Box maxH="420px" overflowY="auto" css={{ '&::-webkit-scrollbar': { width: 0 } }}>
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
                {grouped.map((group) => (
                  <Box key={group.label}>
                    {/* Section label */}
                    <Text
                      px={4}
                      pt={3}
                      pb={1}
                      fontSize="0.8rem"
                      fontWeight="700"
                      color="text_primary"
                      fontFamily="Outfit"
                    >
                      {group.label}
                    </Text>

                    {group.items.map((n, idx) => {
                      const avatarSrc = getAvatarSrc(n);
                      const initial = getAvatarInitial(n);
                      const isUnread = n.status === 'unread';

                      return (
                        <Box key={n.id}>
                          <Flex
                            px={4}
                            py={3}
                            gap={3}
                            cursor="pointer"
                            _hover={{ bg: 'main_background' }}
                            onClick={() => handleItemClick(n)}
                            align="flex-start"
                          >
                            {/* Avatar with unread dot */}
                            <Box position="relative" flexShrink={0}>
                              {avatarSrc ? (
                                <Image
                                  src={avatarSrc}
                                  alt={initial}
                                  boxSize="40px"
                                  borderRadius="full"
                                  objectFit="cover"
                                />
                              ) : (
                                <Flex
                                  boxSize="40px"
                                  borderRadius="full"
                                  bg="#111D4A"
                                  align="center"
                                  justify="center"
                                >
                                  <Text
                                    color="white"
                                    fontSize="0.9rem"
                                    fontWeight="600"
                                    fontFamily="Outfit"
                                  >
                                    {initial}
                                  </Text>
                                </Flex>
                              )}
                              {isUnread && (
                                <Box
                                  position="absolute"
                                  top="0"
                                  right="0"
                                  w="10px"
                                  h="10px"
                                  bg="red.500"
                                  borderRadius="full"
                                  borderWidth="1.5px"
                                  borderColor="bg_box"
                                />
                              )}
                            </Box>

                            {/* Content */}
                            <Box flex={1} minW={0}>
                              <Flex justify="space-between" align="center" gap={2}>
                                <Text
                                  fontSize="0.85rem"
                                  fontWeight={isUnread ? '700' : '500'}
                                  color="text_primary"
                                  fontFamily="Outfit"
                                  flex={1}
                                  lineClamp={1}
                                >
                                  {n.title}
                                </Text>
                                <Text
                                  fontSize="0.72rem"
                                  color="grey.400"
                                  fontFamily="Outfit"
                                  flexShrink={0}
                                >
                                  {formatTimestamp(n.createdAt)}
                                </Text>
                              </Flex>
                              <Text
                                fontSize="0.78rem"
                                color="grey.500"
                                fontFamily="Outfit"
                                lineClamp={2}
                                mt={0.5}
                              >
                                {n.message}
                              </Text>
                            </Box>
                          </Flex>

                          {/* Divider between items (not after last in group) */}
                          {idx < group.items.length - 1 && (
                            <Box mx={4} borderBottomWidth="1px" borderColor="input_border" />
                          )}
                        </Box>
                      );
                    })}
                  </Box>
                ))}
              </VStack>
            )}
          </Box>

          {/* Footer */}
          {notifications.length > 0 && (
            <Flex
              justify="flex-end"
              align="center"
              gap={4}
              px={4}
              py={3}
              borderTopWidth="1px"
              borderColor="input_border"
            >
              <HStack
                gap={1.5}
                as="button"
                onClick={handleMarkAll}
                _hover={{ opacity: 0.75 }}
              >
                <CheckCheck size={14} color="#111D4A" />
                <Text
                  fontSize="0.8rem"
                  color="#111D4A"
                  fontFamily="Outfit"
                  textDecoration="underline"
                >
                  Mark All as Read
                </Text>
              </HStack>
              <Box
                as="button"
                onClick={() => { setIsOpen(false); router.push('/notification'); }}
                _hover={{ opacity: 0.75 }}
              >
                <Text
                  fontSize="0.8rem"
                  color="#111D4A"
                  fontFamily="Outfit"
                  textDecoration="underline"
                >
                  See More &gt;
                </Text>
              </Box>
            </Flex>
          )}
        </Box>
      )}
    </Box>
  );
};

export default NotificationDropdown;
