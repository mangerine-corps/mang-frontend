import {
  Avatar,
  Box,
  Button,
  HStack,
  Icon,
  Image,
  Menu,
  Portal,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
//import NewMessageItem from "mangarine/components/ui-components/newmessageitem";
import AppLayout from "mangarine/layouts/AppLayout";
import { useRouter } from "next/router";
import React, { useEffect, useState, useMemo } from "react";
import { IoEllipsisVertical } from "react-icons/io5";
import SearchInput from "mangarine/components/ui/search-input";
import NewMessageDrawer from "mangarine/components/ui-components/modals/newmessage";
import { useGetConversationMutation } from "mangarine/state/services/apointment.service";
import { useDispatch } from "react-redux";
import { setConversations, setCurrentConversation } from "mangarine/state/reducers/appointment.reducer";
import { useAppointment } from "mangarine/state/hooks/appointment.hook";
import { isEmpty, uniqBy } from "es-toolkit/compat";
import { useAuth } from "mangarine/state/hooks/user.hook";
import ChatPage from "mangarine/components/ui-components/message/chatpage";
import { MuteUserModal } from "mangarine/components/ui-components/message/MuteUserModal";
import { useChatManagement } from "mangarine/hooks/useChatManagement";
import { useGetUnreadByConversationQuery, useMarkConversationReadMutation } from "mangarine/state/services/chat-management.service";
// import { ChatProvider } from "mangarine/components/ui-components/message/ChatProvider";
import dynamic from "next/dynamic";
import { TbVideoFilled } from "react-icons/tb";
import ReportUser from "mangarine/components/ui-components/modals/reportuser";
import BlockConsultant from "mangarine/components/ui-components/modals/blockconsultant";
import BlockedConsultant from "mangarine/components/blockuser";
const DynamicAgoraChatProvider = dynamic(
  () => import('mangarine/components/ui-components/message/ChatProvider').then(mod => mod.ChatProvider),
  { ssr: false }
);

export const ChatHeader = () => {
  const { currentConversation } = useAppointment()
  const [profile, setProfile] = useState<any>({})
  const router = useRouter()
  const dispatch = useDispatch()
  const [Delete, setDelete] = useState<boolean>(false)
  const [Mute, setMute] = useState<boolean>(false)
  const [Report, setReport] = useState<boolean>(false)
  const [Block, setBlock] = useState<boolean>(false)
  const { handleMuteUser } = useChatManagement()
  const { user } = useAuth()


  useEffect(() => {
    if (user.id === currentConversation.user.id) {
      setProfile(currentConversation.consultant)

    } else {
      setProfile(currentConversation.user)
    }
  }, [currentConversation, user])
  return (
    <HStack
      w="full"
      p="4"
      alignItems={"center"}
      justifyContent={"space-between"}
      pos="absolute"
      top={"0"}
      shadow={"md"}
      bg="main_background"
      zIndex={'dropdown'}
    >
      <HStack>
        <Stack h="14" w="14">
          <Avatar.Root
            width={'full'}
            height={'full'}
            borderRadius="8px"
            objectFit="cover"
          >
            <Avatar.Fallback name={`${profile?.fullName}`} />
            <Avatar.Image src={profile?.profilePics} />
          </Avatar.Root>
        </Stack>
        <Text
          fontWeight="700"
          font="outfit"
          color="text_primary"
          fontSize="1.2rem"
        >
          {profile.fullName}
        </Text>
      </HStack>

      <HStack spaceX="2" ml="2">
        <Button
          variant="outline"
          size="md"
          border="none"
          rounded={"full"}
          // borderColor={"grey.300"}
          shadow={"md"}
          onClick={() => {
            router.push(`./message/videoconsultation?consultationId=${currentConversation.id}`);
          }}
        >
          {/* <Image
            src="/icons/camera.svg"
            alt="camera"
          // h="3"
          // w="3"
          // boxSize="30px"
          /> */}
          <Text cursor="pointer" color="text_primary" fontSize="24px"><TbVideoFilled /></Text>
        </Button>
        <Menu.Root>
          <Menu.Trigger asChild>
            <Button
              variant="outline"
              size="md"
              border="none"
              rounded={"full"}
              // borderColor={"grey.300"}
              shadow={"md"}
            >
              <IoEllipsisVertical />
              {/* <Image
                            src="/icons/plus.svg"
                            alt="New Message"
                            h="3"
                            w="3"
                            // boxSize="30px"
                          /> */}
            </Button>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content zIndex={'max'} px="3" py="3" spaceY={"2"}>
                <Menu.Item
                  value="report"
                  _hover={{ bg: "primary." }}
                  roundedTop={"6px"}
                  color="text_primary"
                  fontSize="1rem"
                  onClick={() => {
                    setReport(true);
                  }}
                  py="2"
                >
                  <Menu.ItemCommand>
                    {" "}
                    <Image
                      // onClick={open}
                      alt="link Icon"
                      src="/icons/invite.svg"
                    />
                  </Menu.ItemCommand>{" "}
                  Report
                </Menu.Item>
                <Menu.Item
                  value="block"
                  _hover={{ bg: "primary." }}
                  roundedTop={"6px"}
                  color="text_primary"
                  fontSize="1rem"
                  py="2"
                  onClick={() => {
                    setBlock(true);
                  }}
                >
                  <Menu.ItemCommand>
                    {" "}
                    <Image
                      // onClick={open}
                      alt="link Icon"
                      src="/icons/manage.svg"
                    />
                  </Menu.ItemCommand>{" "}
                  Block
                </Menu.Item>
                <Menu.Item
                  value="mute"
                  _hover={{ bg: "primary." }}
                  roundedTop={"6px"}
                  color="text_primary"
                  fontSize="1rem"
                  py="2"
                  onClick={() => {
                    setMute(true);
                  }}
                >
                  <Menu.ItemCommand>
                    {" "}
                    <Image
                      // onClick={open}
                      alt="link Icon"
                      src="/icons/pin.svg"
                    />
                  </Menu.ItemCommand>{" "}
                  Mute
                </Menu.Item>
                <Menu.Item
                  value="delete"
                  _hover={{ bg: "primary." }}
                  roundedTop={"6px"}
                  color="text_primary"
                  fontSize="1rem"
                  py="2"
                  onClick={() => {
                    setDelete(true)
                    //  s setShowB                                                               lockPage(true);
                  }}
                >
                  <Menu.ItemCommand>
                    {" "}
                    <Image
                      // onClick={open}
                      alt="link Icon"
                      src="/icons/pin.svg"
                    />
                  </Menu.ItemCommand>{" "}
                  Delete Chat
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      </HStack>
      <ReportUser isOpen={Report} onOpenChange={() => { setReport(false) }} />
      {/* Mute confirmation modal */}
      <MuteUserModal
        isOpen={Mute}
        onClose={() => setMute(false)}
        onConfirm={(payload) => handleMuteUser(payload)}
        mutedUserId={user.id === currentConversation?.user?.id ? currentConversation?.consultant?.id : currentConversation?.user?.id}
        conversationId={String(currentConversation?.id || '')}
        displayName={profile?.fullName || 'this user'}
      />

      <BlockConsultant
        isOpen={Block}
        onOpenChange={() => setBlock(false)}
        data={profile}
        checkmarkSrc="/icons/verified.svg"
      />


    </HStack>
  )
}

export const ConversationItem = ({ conversation }: { conversation: any }) => {
  const { user } = useAuth()
  const { currentConversation } = useAppointment()
  const dispatch = useDispatch()
  const router = useRouter()
  const [profile, setProfile] = useState<any>({})
  const [isActive, setIsActive] = useState(false)
  const [markConversationRead] = useMarkConversationReadMutation()

  useEffect(() => {
    if (!isEmpty(conversation)) {
      if (user.id === conversation?.user?.id) {
        setProfile(conversation.consultant)
      } else {
        setProfile(conversation.user)
      }
    }
  }, [conversation])
  useEffect(() => {
    if (conversation?.id === currentConversation?.id) {
      setIsActive(true)
    } else {
      setIsActive(false)
    }
  }, [currentConversation])


  const handleSelectedConversation = async () => {
    dispatch(setCurrentConversation({ conversation }))
    // Keep the page deep-linkable by reflecting the selected conversation in the URL
    try {
      router.replace(
        {
          pathname: router.pathname,
          query: { ...router.query, conversationId: conversation?.id },
        },
        undefined,
        { shallow: true }
      )
    } catch (_) { }
    // Mark unread as read for this conversation (best-effort)
    try {
      await markConversationRead({ conversationId: String(conversation?.id) }).unwrap()
    } catch {}
  }
  return (
    <HStack
      p={4}
      roundedTopLeft={isActive ? "lg" : "none"}
      roundedBottomLeft={isActive ? "lg" : "none"}
      // borderLeftWidth={isActive ? "4px" : "0px"}
      borderLeftColor={
        isActive ? "blue.700" : "transparent"
      }
      width={"full"}
      backgroundColor={
        isActive ? "bg_box" : "transparent"
      }
      mt={isActive ? "2" : "0"}
      color={isActive ? "text_primary" : "text_primary"}
      _hover={{ backgroundColor: "bg_box" }}
      alignItems={'center'}
      cursor={'pointer'}
      // borderRadius="md"
      shadow={isActive ? 'md' : 'xs'}
      borderColor={'gray.100'}
      align="center"
      justifyContent="space-between"
      onClick={handleSelectedConversation}
    >
      <Stack alignItems={'center'} justifyContent={'center'} rounded={'full'} shadow={'md'} h="55px"
        w="55px">
        <Image
          src={profile?.profilePics}
          alt={profile?.fullName}
          h='full'
          w='full'
          mx='auto'
          // boxSize="40px"
          borderRadius="full"
          mr={3}
        />
      </Stack>

      <Box flex="1">
        <Text
          fontWeight="700"
          font="outfit"
          color="text_primary"
          fontSize="1.2rem"
        >
          {profile?.fullName}
        </Text>
        {/* <Text fontSize="1rem" color="grey.500" textWrap={"wrap"}>
          {chat.message}
        </Text> */}
      </Box>
      <Box textAlign="right">
      </Box>

    </HStack>
  )
}

const Index = () => {
  const [startChat, setStartChat] = useState<boolean>(false);
  const [chatText, setchatText] = useState<string>("");
  const [showChatList, setshowChatList] = useState<boolean>(false);
  const [search, setSearch] = useState("");
  const [showDrawer, setShowDrawer] = useState<boolean>(false);
  const router = useRouter();
  const [getConversations, { isLoading }] = useGetConversationMutation()
  const dispatch = useDispatch()
  const { conversations, currentConversation } = useAppointment()
  const { user } = useAuth()
  const { data: unreadData } = useGetUnreadByConversationQuery()

  // Filter conversations based on search query
  const filteredConversations = conversations.filter((conversation: any) => {
    if (!search.trim()) return true;

    const profile = user.id === conversation.user.id ? conversation.consultant : conversation.user;
    const fullName = profile?.fullName || '';

    return fullName.toLowerCase().includes(search.toLowerCase());
  });
  useEffect(() => {
    getConversations({}).unwrap().then(payload => {
      const { data } = payload;
      console.log(payload, 'received conversation')
      // Prefer freshly fetched API conversations over any older persisted ones
      const merged = isEmpty(conversations) ? data : [...data, ...conversations]
      const deduped = uniqBy(merged, (conversation: any) => conversation.id)
      dispatch(setConversations({ conversations: deduped }))
    }).catch(error => {
      console.log(error)
    })
  }, [])

  // Build a map for quick unread lookup
  const unreadMap = useMemo(() => {
    const m = new Map<string, number>()
    unreadData?.items?.forEach((i: any) => m.set(String(i.conversationId), Number(i.unread) || 0))
    return m
  }, [unreadData])

  // If a conversationId is present in the query, auto-select that conversation after conversations are available
  useEffect(() => {
    const queryId = (router.query?.conversationId as string) || '';
    if (!queryId) return;
    if (isEmpty(conversations)) return;

    const match = conversations.find((c: any) => String(c?.id) === String(queryId));
    if (match && (!currentConversation || currentConversation.id !== match.id)) {
      dispatch(setCurrentConversation({ conversation: match }));
    }
  }, [router.query?.conversationId, conversations, dispatch, currentConversation])

  return (
    <AppLayout>
      <DynamicAgoraChatProvider>
        <Box
          display={"flex"}
          h="85vh"
          bg="chat_inputbg"
          flexDir={{ base: "column", md: "row", lg: "row", xl: "row" }}
          justifyContent={"space-between"}
          alignItems={"flex-start"}
          w={{ base: "98%", md: "96%", lg: "96%", xl: "full" }}
          // mx="auto"
          // pt={12}

          overflowY={"hidden"}
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
          <HStack alignItems={"stretch"} w="full" h="full">
            {/* Left section: MessageCard and Feedback */}
            <VStack
              display={{ base: "none", md: "none", lg: "flex", xl: "flex" }}
              flex={1}
              width={'full'}
            >
              <Box
                rounded={"sm"}
                bg='main_background'
                w='full'
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
                h="100vh"
                overflowY={"scroll"}
              >
                {/* Top Controls */}
                <HStack pb={2} shadow={'xs'} borderBottomWidth={0.5} py={4} px={1.5} gap={3}>
                  {/* <Box
                    cursor="pointer"
                    onClick={() => {
                      setShowDrawer(true);
                    }}
                    bg="bg_box"
                    py="4"
                    px="4"
                    rounded="md"
                  >
                    <Image
                      src="/icons/plus.svg"
                      alt="New Message"
                    // boxSize="4"
                    />
                  </Box> */}
                  <Box bg="main_background" rounded="md" flex="1">
                    <SearchInput
                      // label="Email Address"
                      placeholder="search messages"
                      id="search"
                      // required={true}
                      name="search"
                      value={search}
                      size="lg"
                      onChange={(value) => setSearch(value)}
                      // error={errors.email}
                      hasLeftIcon={true}
                      type={"text"}
                      leftIcon={
                        <Icon pl={"4"} pr="8">
                          <Image src="/icons/searchSvg.svg" alt="search" />
                        </Icon>
                      }
                    />
                  </Box>
                </HStack>

                <VStack gap={0} align="stretch">
                  {!isEmpty(filteredConversations) ? (
                    filteredConversations.map((chat) => (
                      <HStack key={chat.id}>
                        <ConversationItem conversation={chat} />
                        {unreadMap.get(String(chat.id))! > 0 && (
                          <Box
                            w="24px"
                            h="24px"
                            bg="active_chat"
                            color="white"
                            borderRadius="100px"
                            px={2}
                            textAlign="center"
                            lineHeight="24px"
                          >
                            {unreadMap.get(String(chat.id))}
                          </Box>
                        )}
                      </HStack>
                    ))
                  ) : (
                    <Box p={4} textAlign="center">
                      <Text color="gray.500" fontSize="sm">
                        {search.trim() ? `No conversations found for "${search}"` : "No conversations yet"}
                      </Text>
                    </Box>
                  )}
                </VStack>
                <NewMessageDrawer
                  open={showDrawer}
                  onOpenChange={() => {
                    setShowDrawer(false);
                  }}
                />
              </Box>
            </VStack>
            <ChatPage />
            {/* Right section: MessageEmpty */}

          </HStack>
        </Box>
      </DynamicAgoraChatProvider>
    </AppLayout>
  );
};

export default Index;
