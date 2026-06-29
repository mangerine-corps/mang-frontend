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
  Text,
  VStack,
  Popover,
} from "@chakra-ui/react";
import { isEmpty } from "es-toolkit/compat";
import { useAppointment } from "mangarine/state/hooks/appointment.hook";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { IoClose, IoDocument, IoImage, IoVideocam } from "react-icons/io5";
import { Smile, Mic, SendHorizonal, Plus } from "lucide-react";
import dynamic from "next/dynamic";
const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false, loading: () => null });
import { ChatHeader } from "mangarine/pages/message";
import { useChat } from "./ChatProvider";
import { useAuth } from "mangarine/state/hooks/user.hook";
import MessageCard from "./MessageCard";
import ConversationItem from "./ConversationItem";
import { generateMessageObject } from "mangarine/utils/message";
import { deleteCloudinaryResources } from "mangarine/utils/cloudinaryUpload";
import {
  sanitizeFilename,
  sanitizeMessageContent,
} from "mangarine/utils/sanitize";
import { useDispatch } from "react-redux";
import { addMessage } from "mangarine/state/reducers/chat.reducer";
import { updateConversationLastMessage } from "mangarine/state/reducers/appointment.reducer";
import FileUploadComponent from "./FileUploadComponent";
import ChatList from "./chatlist";
import MessageEmpty from "../messageempty";
import { useCheckIfBlockedQuery } from "mangarine/state/services/chat-management.service";
import {
  getConversationTimestamp,
  hasConversationActivity,
} from "./helpers";
import { format, isToday, isYesterday, parseISO } from "date-fns";

type Props = {
  onNewMessage: () => void;
};

const ChatPage = ({ onNewMessage }: Props) => {
  const { conversations, currentConversation, messages } = useAppointment();
  const { socket } = useChat();
  const messageRef = useRef<HTMLDivElement | null>(null);
  const [chatText, setchatText] = useState("");
  const { user, token } = useAuth();
  const userId = user?.id ?? "";
  const [showChatList, setshowChatList] = useState(false);
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

  const peer = useMemo(() => {
    if (!currentConversation?.id) {
      return null;
    }

    return userId === currentConversation?.user?.id
      ? currentConversation?.consultant
      : currentConversation?.user;
  }, [currentConversation, userId]);

  const isMobileDevice = React.useMemo(() => {
    if (typeof navigator === "undefined") {
      return false;
    }

    const ua = navigator.userAgent || "";
    const platform = (navigator as any).platform || "";
    const maxTouch = (navigator as any).maxTouchPoints || 0;
    const coarse =
      typeof window !== "undefined" &&
      (window as any).matchMedia &&
      (window as any).matchMedia("(pointer: coarse)").matches;

    return (
      /Mobi|Android|iPhone|iPad|iPod|Mobile/i.test(ua) ||
      (platform === "MacIntel" && maxTouch > 1) ||
      coarse
    );
  }, []);

  const otherUserId = useMemo(() => {
    if (!currentConversation?.id) {
      return undefined as string | undefined;
    }

    return userId === currentConversation?.user?.id
      ? currentConversation?.consultant?.id
      : currentConversation?.user?.id;
  }, [currentConversation, userId]);

  const conversationId = currentConversation?.id as string | undefined;

  const { data: blockedInfo } = useCheckIfBlockedQuery(
    {
      otherUserId: String(otherUserId || ""),
      conversationId: String(conversationId || ""),
    },
    { skip: !otherUserId || !conversationId }
  );

  const isBlocked = !!blockedInfo?.isBlocked;

  const handleSendMessage = () => {
    if (isBlocked || !currentConversation?.id || !peer?.id || !userId) {
      return;
    }

    if (!chatText.trim() && uploadedFiles.length === 0) {
      return;
    }

    const sanitizedContent = sanitizeMessageContent(chatText);

    if (!sanitizedContent.trim() && uploadedFiles.length === 0) {
      return;
    }

    const messagePayload = {
      conversationId: currentConversation.id,
      senderId: userId,
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

    const message = generateMessageObject(messagePayload, userId);
    dispatch(addMessage({ message, userId, from: "frontend" }));
    dispatch(updateConversationLastMessage({ conversationId: currentConversation.id, message }));
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
    setUploadedFiles((prev) => [
      ...prev,
      {
        ...fileData,
        fileName: sanitizeFilename(fileData.fileName),
      },
    ]);
  };

  const handleUploadComplete = () => {
    setShowFileUpload(false);
  };

  const handleRemoveUploadedFile = async (index: number) => {
    const file = uploadedFiles[index];

    if (!file) {
      return;
    }

    try {
      if (file.publicId) {
        await deleteCloudinaryResources([file.publicId], token);
      }
    } catch (error) {
      console.error("Failed to delete Cloudinary resource:", error);
    } finally {
      setUploadedFiles((prev) => prev.filter((_, currentIndex) => currentIndex !== index));
    }
  };

  useEffect(() => {
    messageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    setchatText("");
    setUploadedFiles([]);
    setShowFileUpload(false);
  }, [currentConversation?.id]);

  if (!currentConversation?.id || isEmpty(currentConversation)) {
    return (
      <Flex flex={1} minW={0} h="full" direction="column">
        {/* Mobile-only header bar with conversation list button */}
        <HStack
          display={{ base: "flex", lg: "none" }}
          px={4}
          py={3}
          borderBottomWidth="1px"
          borderColor="border_background"
          bg="bg_box"
          gap={3}
          borderTopRadius="24px"
        >
          <IconButton
            aria-label="View conversations"
            variant="ghost"
            borderRadius="12px"
            borderWidth="1px"
            borderColor="border_background"
            onClick={() => setshowChatList(true)}
          >
            <Plus size={18} />
          </IconButton>
          <Box flex={1} />
        </HStack>

        <ChatList
          open={showChatList}
          onOpenChange={() => {
            setshowChatList(false);
          }}
        />
        <MessageEmpty onClick={onNewMessage} />
      </Flex>
    );
  }

  return (
    <Flex
      flex={1}
      minW={0}
      h="full"
      bg="bg_box"
      borderRadius="24px"
      borderWidth="1px"
      borderColor="border_background"
      overflow="hidden"
      position="relative"
    >
      <ChatList
        open={showChatList}
        onOpenChange={() => {
          setshowChatList(false);
        }}
      />

      <Box
        position="absolute"
        inset={0}
        bgImage="url('/doodle.webp')"
        bgSize="420px"
        bgRepeat="repeat"
        opacity={0.05}
        pointerEvents="none"
      />

      <Flex direction="column" w="full" h="full" position="relative" zIndex={1}>
        <ChatHeader onOpenList={() => setshowChatList(true)} />

        <VStack
          align="stretch"
          flex={1}
          minH={0}
          overflowY="auto"
          px={{ base: 4, md: 5, xl: 6 }}
          py={5}
          gap={4}
        >
          {!isEmpty(messages) ? (
            (() => {
              const getDateLabel = (iso: string): string => {
                try {
                  const d = parseISO(iso);
                  if (isToday(d)) return "Today";
                  if (isYesterday(d)) return "Yesterday";
                  return format(d, "MMMM d, yyyy");
                } catch {
                  return "";
                }
              };

              const nodes: React.ReactNode[] = [];
              let lastLabel = "";
              messages.forEach((message) => {
                const label = getDateLabel(message.createdAt ?? "");
                if (label && label !== lastLabel) {
                  lastLabel = label;
                  nodes.push(
                    <Box key={`sep-${label}`} display="flex" alignItems="center" gap={3} my={2}>
                      <Box flex={1} h="1px" bg="border_background" />
                      <Text
                        fontSize="0.72rem"
                        fontWeight="600"
                        color="text_muted"
                        whiteSpace="nowrap"
                        px={2}
                        py={0.5}
                        bg="chat_surface"
                        borderRadius="full"
                        borderWidth="1px"
                        borderColor="border_background"
                      >
                        {label}
                      </Text>
                      <Box flex={1} h="1px" bg="border_background" />
                    </Box>
                  );
                }
                nodes.push(<MessageCard message={message} key={message.id} />);
              });
              return nodes;
            })()
          ) : (
            <Flex flex={1} align="center" justify="center" py={12}>
              <VStack gap={3} textAlign="center" maxW="340px">
                <Image
                  src="/icons/messageicon.svg"
                  alt="Conversation"
                  boxSize="54px"
                  opacity={0.9}
                />
                <Text
                  fontFamily="Outfit"
                  fontSize="1.35rem"
                  fontWeight="700"
                  color="text_primary"
                >
                  Start the conversation
                </Text>
                <Text fontSize="0.92rem" color="text_muted">
                  Send a message to begin chatting here.
                </Text>
              </VStack>
            </Flex>
          )}

          <div ref={messageRef} />
        </VStack>

        <VStack
          align="stretch"
          gap={3}
          px={{ base: 4, md: 5, xl: 6 }}
          py={4}
          borderTopWidth="1px"
          borderColor="border_background"
          bg="bg_box"
          backdropFilter="blur(8px)"
        >
          {isBlocked ? (
            <Box
              px={4}
              py={3}
              borderRadius="14px"
              bg="red.50"
              _dark={{ bg: "red.900" }}
              borderWidth="1px"
              borderColor="red.200"
            >
              <Text fontSize="0.88rem" color="red.600" _dark={{ color: "red.300" }}>
                Messaging is unavailable because this conversation is blocked.
              </Text>
            </Box>
          ) : null}

          {showFileUpload ? (
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
          ) : null}

          {uploadedFiles.length > 0 ? (
            <Box
              p={3}
              bg="bd_background"
              borderRadius="16px"
              borderWidth="1px"
              borderColor="border_background"
            >
              <Text
                fontSize="0.82rem"
                color="text_muted"
                fontWeight="600"
                mb={2}
              >
                Files to send ({uploadedFiles.length})
              </Text>
              <VStack gap={2} align="stretch">
                {uploadedFiles.map((file, index) => (
                  <HStack
                    key={`${file.publicId}-${index}`}
                    justify="space-between"
                    align="center"
                    p={2}
                    bg="bg_box"
                    borderRadius="12px"
                    borderWidth="1px"
                    borderColor="border_background"
                  >
                    <HStack gap={2} minW={0}>
                      <Icon
                        as={
                          file.fileType.startsWith("image/")
                            ? IoImage
                            : file.fileType.startsWith("video/")
                              ? IoVideocam
                              : IoDocument
                        }
                        color="button_bg"
                      />
                      <Text
                        fontSize="0.82rem"
                        color="text_primary"
                        lineClamp={1}
                      >
                        {file.fileName}
                      </Text>
                    </HStack>
                    <IconButton
                      aria-label="Remove file"
                      size="xs"
                      variant="ghost"
                      borderRadius="10px"
                      onClick={() => handleRemoveUploadedFile(index)}
                    >
                      <IoClose />
                    </IconButton>
                  </HStack>
                ))}
              </VStack>
            </Box>
          ) : null}

          <HStack align="center" gap={3}>
            <Menu.Root positioning={{ placement: "top-start" }}>
              <Menu.Trigger asChild>
                <IconButton
                  aria-label="Attachments"
                  bg="bg_box"
                  borderWidth="1px"
                  borderColor="border_background"
                  borderRadius="12px"
                  boxShadow="0 8px 24px rgba(17, 29, 74, 0.04)"
                  disabled={isBlocked}
                >
                  <Plus size={18} />
                </IconButton>
              </Menu.Trigger>
              <Portal>
                <Menu.Positioner>
                  <Menu.Content
                    minW="220px"
                    p="8px"
                    borderRadius="14px"
                    bg="bg_box"
                    borderColor="border_background"
                    boxShadow="0 20px 48px rgba(17, 29, 74, 0.14)"
                  >
                    <Menu.Item
                      value="document"
                      borderRadius="10px"
                      px="12px"
                      py="10px"
                      onClick={() => {
                        setUploadConfig({
                          allowedTypes: [
                            "application/pdf",
                            "application/msword",
                            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                            "application/vnd.ms-excel",
                            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                            "text/plain",
                            "application/zip",
                            "application/rar",
                          ],
                        });
                        setShowFileUpload(true);
                      }}
                    >
                      <IoDocument />
                      Document
                    </Menu.Item>
                    <Menu.Item
                      value="media"
                      borderRadius="10px"
                      px="12px"
                      py="10px"
                      onClick={() => {
                        setUploadConfig({ allowedTypes: ["image/*", "video/*"] as any });
                        setShowFileUpload(true);
                      }}
                    >
                      <IoImage />
                      Photos & Video
                    </Menu.Item>
                    {isMobileDevice ? (
                      <Menu.Item
                        value="camera"
                        borderRadius="10px"
                        px="12px"
                        py="10px"
                        onClick={() => {
                          setUploadConfig({
                            allowedTypes: ["image/*", "video/*"] as any,
                            capture: "environment",
                          });
                          setShowFileUpload(true);
                        }}
                      >
                        <IoVideocam />
                        Camera
                      </Menu.Item>
                    ) : null}
                  </Menu.Content>
                </Menu.Positioner>
              </Portal>
            </Menu.Root>

            <HStack
              flex={1}
              minW={0}
              px={2}
              py={1.5}
              borderRadius="14px"
              bg="chat_inputbg"
              borderWidth="1px"
              borderColor="border_background"
            >
              <Popover.Root positioning={{ placement: "top-start" }}>
                <Popover.Trigger asChild>
                  <IconButton
                    aria-label="Emoji"
                    variant="ghost"
                    borderRadius="12px"
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
                          // @ts-expect-error library typing mismatch
                          theme="light"
                          onEmojiClick={(event) =>
                            setchatText((prev) => `${prev || ""}${event.emoji}`)
                          }
                          searchDisabled={false}
                          // @ts-expect-error library typing mismatch
                          emojiStyle="apple"
                          lazyLoadEmojis
                        />
                      </Popover.Body>
                    </Popover.Content>
                  </Popover.Positioner>
                </Portal>
              </Popover.Root>

              <Input
                value={chatText}
                onChange={(event) => {
                  const value = event.target.value;
                  if (value.length <= 10000) {
                    setchatText(value);
                  }
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Write a message"
                bg="transparent"
                border="none"
                color="text_primary"
                px={1}
                _focusVisible={{ boxShadow: "none", borderColor: "transparent" }}
                _placeholder={{ color: "text_subtle" }}
                disabled={isBlocked}
              />

              <IconButton
                aria-label="Voice note"
                variant="ghost"
                borderRadius="12px"
                disabled={isBlocked}
              >
                <Mic size={18} />
              </IconButton>
            </HStack>

            <Button
              aria-label="Send"
              h="44px"
              minW="44px"
              px={0}
              borderRadius="12px"
              bg="button_bg"
              color="button_text"
              onClick={handleSendMessage}
              disabled={isBlocked || (!chatText.trim() && uploadedFiles.length === 0)}
              _hover={{ bg: "primary.700" }}
            >
              <SendHorizonal size={18} />
            </Button>
          </HStack>
        </VStack>
      </Flex>
    </Flex>
  );
};

export default ChatPage;
