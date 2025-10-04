"use client";
import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  IconButton,
  Image,
  Input,
  Menu,
  Portal,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { isEmpty } from "es-toolkit/compat";
import { useAppointment } from "mangarine/state/hooks/appointment.hook";
import React, { useEffect, useRef, useState } from "react";
import { BiMenuAltLeft } from "react-icons/bi";
import { IoClose, IoDocument, IoImage, IoVideocam } from "react-icons/io5";
import { Smile } from "lucide-react";
import { Popover } from "@chakra-ui/react";
import EmojiPicker from "emoji-picker-react";
import { ChatHeader } from "mangarine/pages/message";
import { useChat } from "./ChatProvider";
import { useAuth } from "mangarine/state/hooks/user.hook";
import { useSaveMessageMutation } from "mangarine/state/services/chat.service";
import MessageCard from "./MessageCard";
import { generateMessageObject } from "mangarine/utils/message";
import { deleteCloudinaryResources } from "mangarine/utils/cloudinaryUpload";
import {
  sanitizeMessageContent,
  sanitizeFilename,
} from "mangarine/utils/sanitize";
import { useDispatch } from "react-redux";
import { addMessage } from "mangarine/state/reducers/chat.reducer";
import FileUploadComponent from "./FileUploadComponent";
import { RiSendPlane2Fill } from "react-icons/ri";
import { FaMicrophone } from "react-icons/fa";
import ChatList from "./chatlist";
import MessageEmpty from "../messageempty";
import { useRouter } from "next/router";
import { useCheckIfBlockedQuery } from "mangarine/state/services/chat-management.service";

const ChatPage = () => {
  const { currentConversation, messages, conversations } = useAppointment();
  const { chatClient, socket, pagination, joinChatRoom } = useChat();
  const [startChat, setStartChat] = useState<boolean>(false);
  const messageRef = useRef(null);
  const [saveMessage] = useSaveMessageMutation();
  const [chatText, setchatText] = useState<string>("");
  const { user, token } = useAuth();
  const [peer, setPeer] = useState<any>();
  const [showChatList, setshowChatList] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<
    Array<{
      url: string;
      publicId: string;
      fileType: string;
      fileName: string;
      fileSize: number;
    }>
  >([]);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [uploadConfig, setUploadConfig] = useState<{
    allowedTypes: string[];
    capture?: boolean | "user" | "environment";
  } | null>(null);
  const dispatch = useDispatch();
  const router = useRouter();
  // Robust mobile detection to hide Camera on laptops/desktops
  const isMobileDevice = React.useMemo(() => {
    if (typeof navigator === "undefined") return false;
    const ua = navigator.userAgent || "";
    const platform = (navigator as any).platform || "";
    const maxTouch = (navigator as any).maxTouchPoints || 0;
    const coarse =
      typeof window !== "undefined" &&
      (window as any).matchMedia &&
      (window as any).matchMedia("(pointer: coarse)").matches;
    return /Mobi|Android|iPhone|iPad|iPod|Mobile/i.test(ua) ||
    (platform === "MacIntel" && maxTouch > 1) ||
    coarse;
  }, []);

  const handleSendMessage = () => {
    if (isBlocked) return;
    if (!chatText.trim() && uploadedFiles.length === 0) return;

    // Sanitize the message content
    const sanitizedContent = sanitizeMessageContent(chatText);

    // Don't send if content is empty after sanitization
    if (!sanitizedContent.trim() && uploadedFiles.length === 0) return;

    const messagePayload = {
      conversationId: currentConversation.id,
      receiverId: peer.id,
      content: sanitizedContent,
      attachments: uploadedFiles.map((file) => ({
        url: file.url,
        publicId: file.publicId,
        fileType: file.fileType,
        fileName: sanitizeFilename(file.fileName),
        fileSize: file.fileSize,
      })),
    };

    const message = generateMessageObject(messagePayload, user.id);
    dispatch(addMessage({ message, userId: user.id, from: "frontend" }));
    setchatText("");
    setUploadedFiles([]);
    if (socket) {
      (socket as any).emit("sendMessage", messagePayload);
    }
  };

  const handleFileUploaded = (fileData: {
    url: string;
    publicId: string;
    fileType: string;
    fileName: string;
    fileSize: number;
  }) => {
    // Sanitize the filename before storing
    const sanitizedFileData = {
      ...fileData,
      fileName: sanitizeFilename(fileData.fileName),
    };
    setUploadedFiles((prev) => [...prev, sanitizedFileData]);
    // toaster.success(`${sanitizedFileData.fileName} uploaded successfully!`);
  };

  const handleUploadComplete = () => {
    setShowFileUpload(false);
  };

  const handleRemoveUploadedFile = async (index: number) => {
    const file = uploadedFiles[index];
    if (!file) return;
    try {
      if (file.publicId) {
        await deleteCloudinaryResources([file.publicId], token);
      }
    } catch (err) {
      console.error("Failed to delete Cloudinary resource:", err);
    } finally {
      setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    }
  };

  useEffect(() => {
    if (currentConversation && !isEmpty(currentConversation)) {
      if (user.id === currentConversation.user.id) {
        setPeer(currentConversation.consultant);
      } else {
        setPeer(currentConversation.user);
      }
    }
  }, [currentConversation, user]);

  // Compute other participant and check if blocked
  const otherUserId = React.useMemo(() => {
    if (!currentConversation) return undefined as unknown as string | undefined;
    return user.id === currentConversation?.user?.id
      ? currentConversation?.consultant?.id
      : currentConversation?.user?.id;
  }, [currentConversation, user]);

  const conversationId = currentConversation?.id as string | undefined;

  const { data: blockedInfo } = useCheckIfBlockedQuery(
    { otherUserId: String(otherUserId || ""), conversationId: String(conversationId || "") },
    { skip: !otherUserId || !conversationId }
  );

  const isBlocked = !!blockedInfo?.isBlocked;

  useEffect(() => {
    messageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {isEmpty(conversations)?<Flex flex="2"><MessageEmpty onClick={()=>{router.push("/consultant")}}/></Flex> : <VStack
        // ml={2}
        flex={2}
        w="full"
        // h="full"
        bg="bg_box"
        overflowY={"auto"}
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
        // rounded={16}
      >
        <Box
          w="full"
          h="full"
          flex="4"
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
          {!isEmpty(currentConversation) && (
            <Box position="relative" w="full" h="full">
              <Box
                position="absolute"
                top={0}
                left={0}
                w="full"
                h="full"
                bgImage="url('/images/messageBg.png')"
                bgSize="cover"
                // bgPosition="center"
                bgRepeat="no-repeat"
                opacity={0.08}
                zIndex={0}
              />
              <Stack
                as="button"
                cursor={"pointer"}
                onClick={() => {
                  setshowChatList(true);
                }}
                display={{
                  base: "flex",
                  md: "flex",
                  lg: "none",
                  xl: "none",
                }}
                pos="absolute"
                left="0"
                top={"80"}
                bg="main_background"
                p="2"
                zIndex={1000}
                roundedRight="100%"
                color="text_primary"
                h="10"
                alignItems={"center"}
                justifyContent="center"
                w="8"
                borderWidth="2px"
                borderColor="button_border"
              >
                <BiMenuAltLeft />
              </Stack>
              <ChatList
                open={showChatList}
                onOpenChange={() => {
                  setshowChatList(false);
                }}
              />

              <Flex
                flex={1}
                flexDir="column"
                justifyContent="space-between"
                w="100%"
                h="95%"
                zIndex={1}
              >
                {/* <Box position="relative" zIndex={1} w="full" h="full">

                    </Box> */}
                <ChatHeader />
                {!isEmpty(messages) ? (
                  <VStack
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
                    py={24}
                    className={"scroll-on-hover-container"}
                    flexGrow={1}
                    flex={1}
                    zIndex="docked"
                  >
                    {messages.map((message) => (
                      <MessageCard message={message} key={message.id} />
                    ))}
                    <div ref={messageRef}></div>
                  </VStack>
                ) : (
                  <Text>Hello</Text>
                )}
                <VStack
                  w="full"
                  p="6"
                  alignItems={"center"}
                  pos="absolute"
                  bottom={"0"}
                  zIndex={"dropdown"}
                  bg="main_background"
                  // zIndex="max"
                  gap={3}
                >
                  {/* File Upload Component */}
                  {showFileUpload && (
                    <FileUploadComponent
                      onFileUploaded={handleFileUploaded}
                      onUploadComplete={handleUploadComplete}
                      disabled={false}
                      allowedTypes={uploadConfig?.allowedTypes}
                      capture={uploadConfig?.capture}
                      showButton={false}
                      autoOpen
                      variant="whatsapp"
                    />
                  )}

                  {/* Uploaded Files Preview */}
                  {uploadedFiles.length > 0 && (
                    <Box w="full" p={2} bg="bg_box" borderRadius="md">
                      <Text
                        fontSize="sm"
                        color="text_primary"
                        fontWeight="medium"
                        mb={2}
                      >
                        Files to send ({uploadedFiles.length}):
                      </Text>
                      <VStack gap={1} align="start">
                        {uploadedFiles.map((file, index) => (
                          <HStack key={index} gap={2}>
                            <Icon
                              as={
                                file.fileType.startsWith("image/")
                                  ? IoImage
                                  : file.fileType.startsWith("video/")
                                    ? IoVideocam
                                    : IoDocument
                              }
                              color="blue.500"
                            />
                            <Text
                              fontSize="xs"
                              color="text_primary"
                              overflow="hidden"
                              textOverflow="ellipsis"
                              whiteSpace="nowrap"
                            >
                              {file.fileName}
                            </Text>
                            <IconButton
                              size="xs"
                              aria-label="Remove file"
                              onClick={() => handleRemoveUploadedFile(index)}
                            >
                              <IoClose />
                            </IconButton>
                          </HStack>
                        ))}
                      </VStack>
                    </Box>
                  )}

                  <HStack w="full" alignItems={"center"} zIndex={"dropdown"}>
                    <Menu.Root>
                      <Menu.Trigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          border="none"
                          // borderColor={"grey.300"}
                          shadow={"md"}
                          disabled={isBlocked}
                        >
                          <Image
                            src="/icons/plus.svg"
                            alt="New Message"
                            h="3"
                            w="3"
                            // boxSize="30px"
                          />
                        </Button>
                      </Menu.Trigger>
                      <Portal>
                        <Menu.Positioner>
                          <Menu.Content
                            zIndex={"max"}
                            px="3"
                            py="3"
                            spaceY={"2"}
                          >
                            <Menu.Item
                              value="document"
                              _hover={{ bg: "primary." }}
                              roundedTop={"6px"}
                              color="text_primary"
                              fontSize="1rem"
                              onClick={() => {
                                const DOCUMENT_TYPES = [
                                  "application/pdf",
                                  "application/msword",
                                  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                                  "application/vnd.ms-excel",
                                  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                                  "text/plain",
                                  "application/zip",
                                  "application/rar",
                                ];
                                setUploadConfig({
                                  allowedTypes: DOCUMENT_TYPES,
                                });
                                setShowFileUpload(true);
                              }}
                              py="2"
                            >
                              <Menu.ItemCommand>
                                {" "}
                                <Image
                                  // onClick={open}
                                  alt="link Icon"
                                  src="/icons/docs.svg"
                                />
                              </Menu.ItemCommand>{" "}
                              Document
                            </Menu.Item>
                            <Menu.Item
                              value="photo"
                              _hover={{ bg: "primary." }}
                              roundedTop={"6px"}
                              color="text_primary"
                              fontSize="1rem"
                              py="2"
                              // onClick={manage}
                              onClick={() => {
                                // Allow both images and videos; multiple selection supported
                                const MEDIA_TYPES = [
                                  "image/*",
                                  "video/*",
                                ] as any;
                                setUploadConfig({ allowedTypes: MEDIA_TYPES });
                                setShowFileUpload(true);
                              }}
                            >
                              <Menu.ItemCommand>
                                <Image
                                  // onClick={open}
                                  alt="photos Icon"
                                  src="/icons/photos.svg"
                                />
                              </Menu.ItemCommand>{" "}
                              Photos & Video
                            </Menu.Item>
                            {isMobileDevice && (
                              <Menu.Item
                                value="camera"
                                _hover={{ bg: "primary." }}
                                roundedTop={"6px"}
                                color="text_primary"
                                fontSize="1rem"
                                py="2"
                                onClick={() => {
                                  setUploadConfig({
                                    allowedTypes: ["image/*", "video/*"] as any,
                                    capture: "environment",
                                  });
                                  setShowFileUpload(true);
                                }}
                              >
                                <Menu.ItemCommand>
                                  {" "}
                                  <Image
                                    // onClick={open}
                                    alt="link Icon"
                                    src="/icons/outlinecam.svg"
                                  />
                                </Menu.ItemCommand>{" "}
                                Camera
                              </Menu.Item>
                            )}
                          </Menu.Content>
                        </Menu.Positioner>
                      </Portal>
                    </Menu.Root>
                    {/* <Menu placement="top-start">
                    <MenuButton>
                      <IconButton
                        size="md"
                        bg={buttonBgColor}
                        shadow={"sm"}
                        borderWidth={0.5}
                        borderColor={"gray.50"}
                        rounded={"lg"}
                        aria-label="open menu"
                        color="black"
                        icon={<BiPlus size={29} />}
                      />
                    </MenuButton>
                    <Portal>
                      <MenuList
                        borderWidth={1}
                        borderColor={"gray.50"}
                        shadow={"md"}
                        minW={"170px"}
                        py={0}
                        maxW="170px"
                        rounded="lg"
                      >
                        <MenuItem
                          _hover={{ bg: "primary.400" }}
                          _focus={{ bg: "primary.400" }}
                          roundedTop="lg"
                          py={3}
                          icon={<Image src={flag} alt="flag icon" />}
                        >
                          Document
                        </MenuItem>
                        <MenuItem
                          _hover={{ bg: "primary.400" }}
                          _focus={{ bg: "primary.400" }}
                          py={3}
                          icon={<Image src={minus} alt="" />}
                        >
                          Photo & Video
                        </MenuItem>
                        <MenuItem
                          _hover={{ bg: "primary.400" }}
                          _focus={{ bg: "primary.400" }}
                          roundedBottom="lg"
                          py={3}
                          icon={<Image src={volume} alt="volume icon" />}
                        >
                          Camera
                        </MenuItem>
                      </MenuList>
                    </Portal>
                  </Menu> */}

                    <HStack
                      bg="chat_textbg"
                      px="3"
                      w="full"
                      //  zIndex={'dropdown'}
                      rounded={"lg"}
                      zIndex={"max"}
                      borderWidth={1}
                      borderColor={"gray.50"}
                      shadow={"xs"}
                      alignItems={"center"}
                    >
                      {/* Emoji Picker - Chakra v3 API with emoji-picker-react */}
                      <Popover.Root positioning={{ placement: "top-start" }}>
                        <Popover.Trigger asChild>
                          <IconButton
                            aria-label="emoji"
                            variant="ghost"
                            size="sm"
                            disabled={isBlocked}
                          >
                            <Smile size={18} />
                          </IconButton>
                        </Popover.Trigger>
                        <Portal>
                          <Popover.Positioner>
                            <Popover.Content w="320px" p={2}>
                              <Popover.Body p={0}>
                                <EmojiPicker
                                  // @ts-expect-error - emoji-picker-react is not typed
                                  theme={"dark"}
                                  onEmojiClick={(e) =>
                                    setchatText(
                                      (prev) => `${prev || ""}${e.emoji}`
                                    )
                                  }
                                  searchDisabled={false}
                                  // @ts-expect-error - emoji-picker-react is not typed
                                  emojiStyle="apple"
                                  lazyLoadEmojis
                                />
                              </Popover.Body>
                            </Popover.Content>
                          </Popover.Positioner>
                        </Portal>
                      </Popover.Root>
                      <Input
                        outline="none"
                        focusRing={"none"}
                        border={"none"}
                        shadow="none"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSendMessage();
                          }
                        }}
                        pl="3"
                        _focus={{
                          shadow: "none",
                          ring: 0,
                        }}
                        // shadow={"xs"}
                        placeholder="Type a message"
                        color={"grey.500"}
                        value={chatText}
                        onChange={(e) => {
                          // Limit input length to prevent extremely long messages
                          const value = e.target.value;
                          if (value.length <= 10000) {
                            // Match the sanitization limit
                            setchatText(value);
                          }
                        }}
                        fontSize={"14px"}
                        maxLength={10000}
                        disabled={isBlocked}
                      />
                      {/* <Icon>
                      <Image src={"/icons/msfsmiley.svg"} alt="smiley icon" />
                    </Icon> */}
                    </HStack>

                    <HStack spaceX="4" ml="2">
                      {/* <Image src={"/icons/mic.svg"} alt="mic icon" /> */}
                      
                      <Text
                        cursor="pointer"
                        onClick={() => !isBlocked && handleSendMessage()}
                        color="text_primary"
                        fontSize="18px"
                      >
                        <RiSendPlane2Fill />
                      </Text>
                      {/* <Image
                      onClick={handleSendMessage}
                      src={"/icons/send.svg"}
                      alt="send icon"
                    /> */}
                    </HStack>
                  </HStack>
                </VStack>
              </Flex>
            </Box>
          )}

          {/* <MessageFeedback />
            <MessageLeft />
            <ParticipantBox />
            <RoomChat />
            <MessageSession />
            <MessageReview /> */}

          {/* {users.map((user) => (
                <NewMessageItem
                  key={user.id}
                  item={user}
                  selected={selected}
                  onClick={() => setSelected(user)}
                />
              ))} */}
        </Box>
      </VStack>
      }
    </>
  );
};

export default ChatPage;
