import {
  Box,
  Button,
  Flex,
  HStack,
  Image,
  Skeleton,
  SkeletonCircle,
  Text,
  VStack,
} from "@chakra-ui/react";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { useState } from "react";
import { DEFAULT_AVATAR } from "mangarine/lib/constants";
import {
  NotificationItem as NotificationItemType,
  useGetNotificationsQuery,
  useMarkAllAsReadMutation,
  useMarkAsReadMutation,
} from "mangarine/state/services/notifications.service";
import { format, isToday, isYesterday, parseISO } from "date-fns";

const groupByDate = (notifications: NotificationItemType[]) => {
  const groups: Record<string, NotificationItemType[]> = {};
  for (const n of notifications) {
    const date = n.createdAt ? parseISO(n.createdAt) : new Date();
    const label = isToday(date)
      ? "Today"
      : isYesterday(date)
      ? "Yesterday"
      : format(date, "MMMM d, yyyy");
    if (!groups[label]) groups[label] = [];
    groups[label].push(n);
  }
  return groups;
};

const NotificationRow = ({ notification }: { notification: NotificationItemType }) => {
  const [markAsRead] = useMarkAsReadMutation();

  const handleClick = () => {
    if (notification.status === "unread") {
      markAsRead({ notificationId: notification.id });
    }
  };

  const senderAvatar =
    notification.data?.senderProfilePic ||
    notification.metadata?.senderProfilePic ||
    DEFAULT_AVATAR;

  const timeLabel = notification.createdAt
    ? format(parseISO(notification.createdAt), "h:mma")
    : "";

  return (
    <Flex
      px={4}
      py={3}
      gap={3}
      align="start"
      cursor="pointer"
      onClick={handleClick}
      bg={notification.status === "unread" ? "blue.50" : "transparent"}
      _dark={{ bg: notification.status === "unread" ? "whiteAlpha.100" : "transparent" }}
      _hover={{ bg: notification.status === "unread" ? "blue.100" : "gray.50" }}
      transition="background 0.15s"
      position="relative"
    >
      {notification.status === "unread" && (
        <Box
          position="absolute"
          left={1.5}
          top="50%"
          transform="translateY(-50%)"
          w="6px"
          h="6px"
          bg="blue.500"
          rounded="full"
        />
      )}
      <Image
        src={senderAvatar}
        alt={notification.title}
        boxSize="42px"
        borderRadius="full"
        objectFit="cover"
        flexShrink={0}
      />
      <Box flex="1" minW={0}>
        <Flex justify="space-between" gap={2} align="start">
          <Box flex={1} minW={0}>
            <Text
              fontFamily="Outfit"
              color="text_primary"
              fontWeight="600"
              fontSize="0.9rem"
              mb={0.5}
            >
              {notification.title}
            </Text>
            <Text
              fontFamily="Outfit"
              fontWeight="400"
              fontSize="0.82rem"
              color="gray.500"
              lineClamp={2}
            >
              {notification.message}
            </Text>
          </Box>
          <Text
            fontFamily="Outfit"
            color="gray.400"
            fontWeight="400"
            fontSize="0.75rem"
            flexShrink={0}
            mt={0.5}
          >
            {timeLabel}
          </Text>
        </Flex>
      </Box>
    </Flex>
  );
};

const NotificationSkeleton = () => (
  <Flex px={4} py={3} gap={3} align="start">
    <SkeletonCircle size="10" flexShrink={0} />
    <VStack align="stretch" flex={1} gap={2} pt={1}>
      <Skeleton h="3" w="40%" rounded="md" />
      <Skeleton h="2.5" w="80%" rounded="md" />
      <Skeleton h="2.5" w="60%" rounded="md" />
    </VStack>
  </Flex>
);

const NotificationPage = () => {
  const [page, setPage] = useState(1);
  const limit = 15;

  const { data, isLoading } = useGetNotificationsQuery({ page, limit });
  const [markAllAsRead] = useMarkAllAsReadMutation();

  const notifications = data?.data ?? [];
  const totalPages = data?.totalPages ?? 1;
  const grouped = groupByDate(notifications);

  return (
    <Box w="full" h="full" overflowY="auto">
      {/* Header */}
      <Box px={4} py={4} borderBottomWidth="1px" borderColor="border_background" position="sticky" top={0} bg="bg_box" zIndex={1}>
        <Flex justify="space-between" align="center">
          <Text fontFamily="Outfit" fontWeight="700" fontSize="1.15rem" color="text_primary">
            Notifications
          </Text>
          <Text
            fontFamily="Outfit"
            fontWeight="500"
            fontSize="0.85rem"
            cursor="pointer"
            color="blue.500"
            _hover={{ textDecoration: "underline" }}
            onClick={() => markAllAsRead()}
          >
            Mark all as read
          </Text>
        </Flex>
      </Box>

      {/* Content */}
      {isLoading ? (
        <VStack gap={0} align="stretch">
          {[...Array(6)].map((_, i) => (
            <NotificationSkeleton key={i} />
          ))}
        </VStack>
      ) : notifications.length === 0 ? (
        <Flex direction="column" align="center" justify="center" py={16} gap={3}>
          <Image src="/icons/bell-empty.svg" alt="no notifications" boxSize="56px" opacity={0.4} />
          <Text color="gray.400" fontSize="0.9rem" fontFamily="Outfit">
            No notifications yet
          </Text>
        </Flex>
      ) : (
        <VStack gap={0} align="stretch">
          {Object.entries(grouped).map(([label, items]) => (
            <Box key={label}>
              <Box bg="bg_box" px={4} py={2} borderBottomWidth="1px" borderColor="border_background">
                <Text fontFamily="Outfit" color="text_primary" fontWeight="600" fontSize="0.82rem" textTransform="uppercase" letterSpacing="0.05em">
                  {label}
                </Text>
              </Box>
              {items.map((n) => (
                <NotificationRow key={n.id} notification={n} />
              ))}
            </Box>
          ))}
        </VStack>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Box borderTopWidth="1px" borderColor="border_background" px={4} py={3}>
          <HStack justify="center" gap={1}>
            <Button
              size="sm"
              variant="ghost"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <BiChevronLeft size={16} />
            </Button>
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              const p = i + 1;
              return (
                <Button
                  key={p}
                  size="sm"
                  variant={p === page ? "solid" : "ghost"}
                  bg={p === page ? "blue.900" : undefined}
                  color={p === page ? "white" : "text_primary"}
                  onClick={() => setPage(p)}
                  minW="8"
                >
                  {p}
                </Button>
              );
            })}
            <Button
              size="sm"
              variant="ghost"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              <BiChevronRight size={16} />
            </Button>
          </HStack>
        </Box>
      )}
    </Box>
  );
};

export default NotificationPage;
