import {
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Input,
  Menu,
  Portal,
  Spinner,
  Text,
  VStack,
  Image,
} from "@chakra-ui/react";
import AppLayout from "mangarine/layouts/AppLayout";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { isEmpty, uniqBy } from "es-toolkit/compat";
import dynamic from "next/dynamic";
import {
  LuBan,
  LuBell,
  LuEllipsisVertical,
  LuFlag,
  LuPlus,
  LuSearch,
  LuVideo,
} from "react-icons/lu";
import { useChat } from "mangarine/components/ui-components/message/ChatProvider";

const IncomingCallModal = dynamic(
  () => import("mangarine/components/ui-components/modals/incomingcallmodal"),
  { ssr: false }
);
import NewMessageDrawer from "mangarine/components/ui-components/modals/newmessage";
import { useGetConversationMutation } from "mangarine/state/services/apointment.service";
import {
  setConversations,
  setCurrentConversation,
} from "mangarine/state/reducers/appointment.reducer";
import { useAppointment } from "mangarine/state/hooks/appointment.hook";
import { useAuth } from "mangarine/state/hooks/user.hook";
import ChatPage from "mangarine/components/ui-components/message/chatpage";
import { MuteUserModal } from "mangarine/components/ui-components/message/MuteUserModal";
import { useChatManagement } from "mangarine/hooks/useChatManagement";
import {
  useGetUnreadByConversationQuery,
  useMarkConversationReadMutation,
} from "mangarine/state/services/chat-management.service";
import ReportUser from "mangarine/components/ui-components/modals/reportuser";
import BlockConsultant from "mangarine/components/ui-components/modals/blockconsultant";
import { setMessages } from "mangarine/state/reducers/chat.reducer";
import {
  formatConversationTime,
  getConversationPreview,
  getConversationSubtitle,
  getConversationTimestamp,
  hasConversationActivity,
  isProfileVerified,
  resolveConversationProfile,
} from "mangarine/components/ui-components/message/helpers";

const DynamicAgoraChatProvider = dynamic(
  () =>
    import("mangarine/components/ui-components/message/ChatProvider").then(
      (mod) => mod.ChatProvider
    ),
  { ssr: false }
);

const SidebarSearchField = ({
  placeholder,
  value,
  onChange,
}: {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) => {
  return (
    <Box position="relative" w="full">
      <Box
        position="absolute"
        top="50%"
        left="16px"
        transform="translateY(-50%)"
        color="#9CA3AF"
        zIndex={1}
      >
        <LuSearch size={16} />
      </Box>
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        h="44px"
        borderRadius="10px"
        borderColor="border_background"
        bg="bg_box"
        ps="42px"
        _placeholder={{ color: "text_subtle", fontSize: "0.875rem" }}
        _focusVisible={{ borderColor: "button_bg", boxShadow: "none" }}
      />
    </Box>
  );
};

export const ChatHeader = ({
  onOpenList,
}: {
  onOpenList?: () => void;
}) => {
  const { currentConversation, messages } = useAppointment();
  const { handleMuteUser } = useChatManagement();
  const { user } = useAuth();
  const router = useRouter();
  const { initiateCall } = useChat();
  const [muteOpen, setMuteOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [blockOpen, setBlockOpen] = useState(false);
  const userId = user?.id ?? "";

  const profile = useMemo(() => {
    return resolveConversationProfile(currentConversation, userId);
  }, [currentConversation, userId]);

  const peer = useMemo(() => {
    if (!currentConversation?.id) return null;
    return userId === currentConversation?.user?.id
      ? currentConversation?.consultant
      : currentConversation?.user;
  }, [currentConversation, userId]);

  const lastActivity = useMemo(() => {
    const latestMessage = messages?.[messages.length - 1];

    return (
      latestMessage?.createdAt ||
      getConversationTimestamp(currentConversation) ||
      ""
    );
  }, [currentConversation, messages]);

  if (!currentConversation?.id) {
    return null;
  }

  const mutedUserId =
    userId === currentConversation?.user?.id
      ? currentConversation?.consultant?.id
      : currentConversation?.user?.id;

  const handleStartCall = () => {
    if (!peer?.id) return;
    // Notify the other user via socket then go straight into the room
    initiateCall(
      currentConversation.id,
      peer.id,
      peer.fullName || "User",
      peer.profilePics,
    );
    router.push(`/message/videoconsultation?consultationId=${currentConversation.id}`);
  };

  return (
    <HStack
      justify="space-between"
      align="center"
      px={{ base: 4, md: 6 }}
      py={4}
      borderBottomWidth="1px"
      borderColor="border_background"
      bg="bg_box"
      minH="78px"
    >
      <HStack gap={3} minW={0}>
        {onOpenList ? (
          <IconButton
            aria-label="Open conversations"
            display={{ base: "inline-flex", lg: "none" }}
            variant="ghost"
            borderRadius="12px"
            onClick={onOpenList}
          >
            <LuPlus />
          </IconButton>
        ) : null}

        <Box position="relative">
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
            borderColor="bg_box"
          />
        </Box>

        <VStack align="stretch" gap={0} minW={0}>
          <HStack gap={1.5}>
            <Text
              fontFamily="Outfit"
              fontSize={{ base: "1.15rem", md: "1.35rem" }}
              fontWeight="700"
              color="text_primary"
              lineClamp={1}
            >
              {profile?.fullName}
            </Text>
            {isProfileVerified(profile) ? (
              <Image src="/icons/verified.svg" alt="Verified" boxSize="14px" />
            ) : null}
          </HStack>
          <Text fontSize="0.8rem" color="text_muted">
            {lastActivity
              ? `Last seen ${formatConversationTime(lastActivity)}`
              : "Conversation details"}
          </Text>
        </VStack>
      </HStack>

      <HStack gap={2}>
        <IconButton
          aria-label="Start video call"
          variant="ghost"
          borderRadius="12px"
          borderWidth="1px"
          borderColor="border_background"
          bg="bg_box"
          color="text_primary"
          onClick={handleStartCall}
          _hover={{ bg: "bd_background", borderColor: "border_background" }}
        >
          <LuVideo />
        </IconButton>

        <Menu.Root positioning={{ placement: "bottom-end" }}>
          <Menu.Trigger asChild>
            <IconButton
              aria-label="Conversation actions"
              variant="ghost"
              borderRadius="12px"
              borderWidth="1px"
              borderColor="border_background"
              bg="bg_box"
            >
              <LuEllipsisVertical />
            </IconButton>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content
                minW="200px"
                p="8px"
                borderRadius="14px"
                bg="bg_box"
                borderColor="border_background"
                boxShadow="0 20px 48px rgba(17, 29, 74, 0.14)"
              >
                <Menu.Item
                  value="report"
                  borderRadius="10px"
                  px="12px"
                  py="10px"
                  color="text_primary"
                  onClick={() => setReportOpen(true)}
                >
                  <LuFlag />
                  Report
                </Menu.Item>
                <Menu.Item
                  value="block"
                  borderRadius="10px"
                  px="12px"
                  py="10px"
                  color="text_primary"
                  onClick={() => setBlockOpen(true)}
                >
                  <LuBan />
                  Block
                </Menu.Item>
                <Menu.Item
                  value="mute"
                  borderRadius="10px"
                  px="12px"
                  py="10px"
                  color="text_primary"
                  onClick={() => setMuteOpen(true)}
                >
                  <LuBell />
                  Mute
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      </HStack>

      <ReportUser
        isOpen={reportOpen}
        onOpenChange={() => setReportOpen(false)}
      />

      <MuteUserModal
        isOpen={muteOpen}
        onClose={() => setMuteOpen(false)}
        onConfirm={(payload) => handleMuteUser(payload)}
        mutedUserId={mutedUserId}
        conversationId={String(currentConversation?.id || "")}
        displayName={profile?.fullName || "this user"}
      />

      <BlockConsultant
        isOpen={blockOpen}
        onOpenChange={() => setBlockOpen(false)}
        data={profile}
        checkmarkSrc="/icons/verified.svg"
      />
    </HStack>
  );
};

export const ConversationItem = ({
  conversation,
  unreadCount = 0,
}: {
  conversation: any;
  unreadCount?: number;
}) => {
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
      bg={isActive ? "bd_background" : "transparent"}
      borderWidth={isActive ? "1px" : "1px"}
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

/** Renders incoming/outgoing call modals — must be inside ChatProvider */
const CallModalManager = () => {
  const router = useRouter();
  const { incomingCall, acceptCall, rejectCall } = useChat();

  const handleAccept = () => {
    const conversationId = incomingCall?.conversationId;
    acceptCall();
    if (conversationId) {
      router.push(`/message/videoconsultation?consultationId=${conversationId}`);
    }
  };

  return (
    <>
      {incomingCall && (
        <IncomingCallModal
          call={incomingCall}
          onAccept={handleAccept}
          onReject={rejectCall}
        />
      )}
    </>
  );
};

const Index = () => {
  const [search, setSearch] = useState("");
  const [showDrawer, setShowDrawer] = useState(false);
  const router = useRouter();
  const [getConversations, { isLoading }] = useGetConversationMutation();
  const dispatch = useDispatch();
  const { conversations, currentConversation, messages } = useAppointment();
  const { user } = useAuth();
  const { data: unreadData } = useGetUnreadByConversationQuery();
  const userId = user?.id ?? "";
  const queryConversationId = (router.query?.conversationId as string) || "";
  const hasSelectedConversation = Boolean(currentConversation?.id || queryConversationId);

  useEffect(() => {
    getConversations({})
      .unwrap()
      .then((payload) => {
        const { data } = payload;
        const deduped = uniqBy(data, (conversation: any) => conversation.id);
        dispatch(setConversations({ conversations: deduped }));
      })
      .catch((error) => {
        console.log(error);
      });
  }, [dispatch, getConversations]);

  const unreadMap = useMemo(() => {
    const nextMap = new Map<string, number>();
    unreadData?.items?.forEach((item: any) =>
      nextMap.set(String(item.conversationId), Number(item.unread) || 0)
    );
    return nextMap;
  }, [unreadData]);

  const filteredConversations = useMemo(() => {
    return conversations.filter((conversation: any) => {
      if (!hasConversationActivity(conversation)) {
        return false;
      }

      const profile = resolveConversationProfile(conversation, userId);
      const fullName = profile?.fullName || "";
      const subtitle = getConversationSubtitle(profile);
      const preview = getConversationPreview(conversation);
      const matchesSearch = !search.trim()
        ? true
        : `${fullName} ${subtitle} ${preview}`
            .toLowerCase()
            .includes(search.trim().toLowerCase());

      if (!matchesSearch) {
        return false;
      }

      return true;
    });
  }, [conversations, search, userId]);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    if (!queryConversationId) {
      if (!isEmpty(currentConversation)) {
        dispatch(setCurrentConversation({ conversation: {} }));
      }
      if (!isEmpty(messages)) {
        dispatch(setMessages({ messages: [] }));
      }
      return;
    }

    if (isEmpty(conversations)) {
      return;
    }

    const match = conversations.find(
      (conversation: any) =>
        String(conversation?.id) === String(queryConversationId)
    );

    if (match && (!currentConversation || currentConversation.id !== match.id)) {
      dispatch(setCurrentConversation({ conversation: match }));
    }
  }, [
    router.isReady,
    queryConversationId,
    conversations,
    dispatch,
    currentConversation,
    messages,
  ]);

  const subHeader = (
    <Text py={1} fontSize="0.92rem" color="text_muted" fontWeight="500">
      Message
    </Text>
  );

  return (
    <AppLayout subHeader={subHeader}>
      <DynamicAgoraChatProvider>
        <Box
          w="full"
          h="full"
          bg="chat_surface"
          borderRadius="24px"
          p={{ base: 3, md: 4 }}
          overflow="hidden"
        >
          <HStack align="stretch" gap={4} h="full">
            <VStack
              display={{ base: "none", lg: "flex" }}
              w="320px"
              align="stretch"
              gap={4}
              h="full"
            >
              <HStack gap={3}>
                <IconButton
                  aria-label="New message"
                  onClick={() => setShowDrawer(true)}
                  bg="bg_box"
                  borderWidth="1px"
                  borderColor="border_background"
                  borderRadius="10px"
                  boxShadow="0 8px 24px rgba(17, 29, 74, 0.04)"
                >
                  <Image src="/icons/plus.svg" alt="New message" boxSize="16px" />
                </IconButton>

                <SidebarSearchField
                  placeholder="Search messages"
                  value={search}
                  onChange={setSearch}
                />
              </HStack>

              <VStack
                align="stretch"
                gap={2}
                flex={1}
                minH={0}
                overflowY="auto"
                pr={1}
              >
                {isLoading ? (
                  <Flex justify="center" align="center" py={12}>
                    <Spinner color="button_bg" />
                  </Flex>
                ) : filteredConversations.length ? (
                  filteredConversations.map((conversation: any) => (
                    <ConversationItem
                      key={conversation.id}
                      conversation={conversation}
                      unreadCount={unreadMap.get(String(conversation.id)) || 0}
                    />
                  ))
                ) : (
                  <Box
                    py={10}
                    px={6}
                    textAlign="center"
                    bg="bg_box"
                    borderRadius="18px"
                    borderWidth="1px"
                    borderColor="border_background"
                  >
                    <Text fontSize="0.92rem" color="text_muted">
                      {search.trim()
                        ? `No conversations found for "${search}".`
                        : "No conversations yet."}
                    </Text>
                  </Box>
                )}
              </VStack>
            </VStack>

            <ChatPage onNewMessage={() => setShowDrawer(true)} />
          </HStack>

          <NewMessageDrawer
            open={showDrawer}
            onOpenChange={() => setShowDrawer(false)}
          />
        </Box>

        <CallModalManager />
      </DynamicAgoraChatProvider>
    </AppLayout>
  );
};

export default Index;
