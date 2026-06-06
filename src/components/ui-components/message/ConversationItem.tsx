import { Avatar, Box, Flex, HStack, Image, Skeleton, SkeletonCircle, Text, VStack } from "@chakra-ui/react";
import { useMarkConversationReadMutation } from "mangarine/state/services/chat-management.service";
import { setCurrentConversation } from "mangarine/state/reducers/appointment.reducer";
import { useAppointment } from "mangarine/state/hooks/appointment.hook";
import { useAuth } from "mangarine/state/hooks/user.hook";
import {
  formatConversationTime,
  getConversationPreview,
  getConversationSubtitle,
  getConversationTimestamp,
  isProfileVerified,
  resolveConversationProfile,
} from "./helpers";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { useDispatch } from "react-redux";

type Props = {
  conversation: any;
  unreadCount?: number;
};

const ConversationItem = ({ conversation, unreadCount = 0 }: Props) => {
  const { user } = useAuth();
  const { currentConversation } = useAppointment();
  const dispatch = useDispatch();
  const router = useRouter();
  const [markConversationRead] = useMarkConversationReadMutation();
  const userId = user?.id ?? "";

  const profile = useMemo(() => {
    return resolveConversationProfile(conversation, userId);
  }, [conversation, userId]);

  const isActive = conversation?.id === currentConversation?.id;
  const preview = getConversationPreview(conversation);
  const time = formatConversationTime(getConversationTimestamp(conversation));

  const handleSelectedConversation = async () => {
    dispatch(setCurrentConversation({ conversation }));

    try {
      router.replace(
        {
          pathname: router.pathname,
          query: { ...router.query, conversationId: conversation?.id },
        },
        undefined,
        { shallow: true }
      );
    } catch (_) {}

    try {
      await markConversationRead({
        conversationId: String(conversation?.id),
      }).unwrap();
    } catch (_) {}
  };

  return (
    <Flex
      align="center"
      gap={3}
      px="14px"
      py="12px"
      borderRadius="16px"
      bg={isActive ? "bd_background" : "bg_box"}
      borderWidth={isActive ? "1px" : "0"}
      borderColor={isActive ? "border_background" : "transparent"}
      boxShadow={isActive ? "0 10px 24px rgba(17, 29, 74, 0.06)" : "none"}
      cursor="pointer"
      transition="0.2s ease"
      _hover={{
        bg: "bd_background",
        borderColor: "border_background",
      }}
      onClick={handleSelectedConversation}
    >
      <Box position="relative" flexShrink={0}>
        <Avatar.Root size="lg">
          <Avatar.Fallback name={profile?.fullName} />
          <Avatar.Image src={profile?.profilePics} />
        </Avatar.Root>
        <Box
          position="absolute"
          right="2px"
          bottom="2px"
          boxSize="10px"
          borderRadius="full"
          bg="#48BB34"
          borderWidth="2px"
          borderColor="white"
        />
      </Box>

      <VStack align="stretch" gap={1} flex={1} minW={0}>
        <HStack justify="space-between" align="flex-start" gap={3}>
          <HStack gap={1.5} minW={0}>
            <Text
              fontFamily="Outfit"
              fontSize="1.05rem"
              fontWeight="700"
              color="text_primary"
              lineClamp={1}
            >
              {profile?.fullName}
            </Text>
            {isProfileVerified(profile) ? (
              <Image src="/icons/verified.svg" alt="Verified" boxSize="13px" />
            ) : null}
          </HStack>
          <Text fontSize="0.74rem" color="text_subtle" flexShrink={0}>
            {time}
          </Text>
        </HStack>

        <HStack justify="space-between" align="center" gap={3}>
          <Text
            fontSize="0.82rem"
            color="text_muted"
            lineClamp={1}
            flex={1}
          >
            {preview || getConversationSubtitle(profile)}
          </Text>

          {unreadCount > 0 ? (
            <Flex
              minW="22px"
              h="22px"
              px="6px"
              align="center"
              justify="center"
              borderRadius="999px"
              bg="button_bg"
              color="button_text"
              fontSize="0.72rem"
              fontWeight="600"
              flexShrink={0}
            >
              {unreadCount}
            </Flex>
          ) : null}
        </HStack>
      </VStack>
    </Flex>
  );
};

export const ConversationItemSkeleton = () => (
  <Flex
    align="center"
    gap={3}
    px="14px"
    py="12px"
    borderRadius="16px"
    bg="bg_box"
  >
    <SkeletonCircle size="12" flexShrink={0} />
    <VStack align="stretch" gap={2} flex={1}>
      <HStack justify="space-between">
        <Skeleton h="3.5" w="40%" rounded="md" />
        <Skeleton h="2.5" w="14%" rounded="md" />
      </HStack>
      <Skeleton h="3" w="65%" rounded="md" />
    </VStack>
  </Flex>
);

export default ConversationItem;
