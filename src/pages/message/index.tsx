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
  Text,
  VStack,
  Image,
} from "@chakra-ui/react";
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
  formatLastSeen,
  getConversationPreview,
  getConversationSubtitle,
  getConversationTimestamp,
  hasConversationActivity,
  isProfileVerified,
  resolveConversationProfile,
} from "mangarine/components/ui-components/message/helpers";
import ConversationItem, { ConversationItemSkeleton } from "mangarine/components/ui-components/message/ConversationItem";

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
              ? formatLastSeen(lastActivity)
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
  const [messageTab, setMessageTab] = useState<"all" | "unread">("all");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [getConversations] = useGetConversationMutation();
  const dispatch = useDispatch();
  const { conversations, currentConversation, messages } = useAppointment();
  const { user } = useAuth();
  const { data: unreadData } = useGetUnreadByConversationQuery(undefined, { skip: true });
  const userId = user?.id ?? "";
  const queryConversationId = (router.query?.conversationId as string) || "";
  const hasSelectedConversation = Boolean(currentConversation?.id || queryConversationId);

  // Fetch all conversation pages concurrently (matches mobile loadchat.hook.ts)
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    const loadAll = async () => {
      try {
        // Page 1 first to get totalPages
        const first = await getConversations({}).unwrap();
        const firstData: any[] = first?.data ?? [];
        const totalPages: number = first?.totalPages ?? first?.meta?.totalPages ?? 1;

        let all = [...firstData];

        if (totalPages > 1) {
          const rest = await Promise.all(
            Array.from({ length: totalPages - 1 }, (_, i) =>
              getConversations({ page: i + 2 } as any).unwrap().then((p: any) => p?.data ?? [])
            )
          );
          all = all.concat(rest.flat());
        }

        if (!cancelled) {
          dispatch(
            setConversations({
              conversations: uniqBy(all, (c: any) => c.id),
            })
          );
        }
      } catch (_) {
        // silently fall through — list stays empty
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadAll();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const unreadMap = useMemo(() => {
    const nextMap = new Map<string, number>();
    unreadData?.items?.forEach((item: any) =>
      nextMap.set(String(item.conversationId), Number(item.unread) || 0)
    );
    return nextMap;
  }, [unreadData]);

  const filteredConversations = useMemo(() => {
    return conversations.filter((conversation: any) => {
      if (!conversation?.user?.id || !conversation?.consultant?.id) {
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

  return (
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

              <HStack gap={0} borderBottomWidth="1px" borderColor="border_background">
                {(["all", "unread"] as const).map((tab) => (
                  <Button
                    key={tab}
                    variant="ghost"
                    size="sm"
                    px={4}
                    py={2}
                    h="auto"
                    borderRadius={0}
                    fontFamily="Outfit"
                    fontSize="0.875rem"
                    fontWeight={messageTab === tab ? "600" : "400"}
                    color={messageTab === tab ? "text_primary" : "text_muted"}
                    borderBottomWidth="2px"
                    borderBottomColor={messageTab === tab ? "text_primary" : "transparent"}
                    mb="-1px"
                    onClick={() => setMessageTab(tab)}
                    _hover={{ bg: "transparent", color: "text_primary" }}
                  >
                    {tab === "all" ? "All messages" : "Unread messages"}
                  </Button>
                ))}
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
                  Array.from({ length: 8 }).map((_, i) => <ConversationItemSkeleton key={i} />)
                ) : filteredConversations
                    .filter((c: any) =>
                      messageTab === "unread"
                        ? (unreadMap.get(String(c.id)) || 0) > 0
                        : true
                    )
                    .length ? (
                  filteredConversations
                    .filter((c: any) =>
                      messageTab === "unread"
                        ? (unreadMap.get(String(c.id)) || 0) > 0
                        : true
                    )
                    .map((conversation: any) => (
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
                        : messageTab === "unread"
                        ? "No unread messages."
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
  );
};

export default Index;
