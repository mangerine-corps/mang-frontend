import {
  Box,
  Text,
  VStack,
  Image,
  HStack,
  Icon,
  IconButton,
  Stack,
  Dialog,
  chakra,
} from "@chakra-ui/react";
import { useAuth } from "mangarine/state/hooks/user.hook";
import React, { useEffect, useState } from "react";
import { ChatMessage } from "./ChatProvider";
import { format } from "date-fns";
import { isEmpty } from "es-toolkit/compat";
import { IoDocument, IoImage, IoVideocam, IoDownload } from "react-icons/io5";
import { MdOutlineFileDownload } from "react-icons/md";

const MessageCard = ({ message }: { message: ChatMessage }) => {
  const { user } = useAuth();
  const [isUser, setIsUser] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewAttachment, setPreviewAttachment] = useState<any | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<Record<string, number>>({});
  const [downloading, setDownloading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (message.senderId === user.id) {
      setIsUser(true);
    }
  }, [message]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type === "image") return IoImage;
    if (type === "video") return IoVideocam;
    return IoDocument;
  };

  const handleDownload = (attachment: any) => {
    // Fallback instant download without progress
    const link = document.createElement("a");
    link.href = attachment.url;
    link.download = attachment.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openPreview = (attachment: any) => {
    setPreviewAttachment(attachment);
    setPreviewOpen(true);
  };

  const isPdf = (att: any) => {
    const ft = att?.fileType || att?.mimeType || '';
    const fn = att?.fileName || '';
    return ft.toLowerCase().includes('pdf') || fn.toLowerCase().endsWith('.pdf');
  };

  const isPreviewable = (att: any) => {
    return att?.type === 'image' || att?.type === 'video' || isPdf(att);
  };

  const getKey = (att: any, index: number) => att?.id || att?.url || `${index}`;

  const handleDownloadWithProgress = (attachment: any, key: string) => {
    try {
      const xhr = new XMLHttpRequest();
      setDownloading((prev) => ({ ...prev, [key]: true }));
      setDownloadProgress((prev) => ({ ...prev, [key]: 0 }));
      xhr.open('GET', attachment.url, true);
      xhr.responseType = 'blob';
      xhr.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded * 100) / event.total);
          setDownloadProgress((prev) => ({ ...prev, [key]: percent }));
        }
      };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const blob = xhr.response;
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = attachment.fileName || 'download';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }
        setDownloading((prev) => ({ ...prev, [key]: false }));
        setDownloadProgress((prev) => ({ ...prev, [key]: 100 }));
        setTimeout(() => {
          setDownloadProgress((prev) => {
            const { [key]: _, ...rest } = prev;
            return rest;
          });
        }, 1200);
      };
      xhr.onerror = () => {
        setDownloading((prev) => ({ ...prev, [key]: false }));
      };
      xhr.send();
    } catch (e) {
      setDownloading((prev) => ({ ...prev, [key]: false }));
      // Fallback to default download
      handleDownload(attachment);
    }
  };

  return (
    <VStack
      gap="3"
      alignSelf={isUser ? "flex-end" : "flex-start"}
      m={2}
      w="50%"
      alignItems={isUser ? "flex-end" : "flex-start"}
      position={"relative"}
      zIndex={"base"}
    >
      {message.isReply && (
        <Box
          borderLeftWidth={isUser ? 4 : 0}
          borderRightWidth={isUser ? 0 : 4}
          roundedRight={isUser ? "none" : "lg"}
          roundedLeft={isUser ? "lg" : "none"}
          borderColor={"primary.300"}
          w="full"
          p={2}
          bg="white"
        >
          <Text lineClamp={1} fontSize={"0.75rem"} fontFamily={"Outfit"}>
            {message?.parent.content}
          </Text>
        </Box>
      )}
      <VStack
        gap="0"
        shadow={"md"}
        p={3}
        bg="bg_box"
        roundedTop={"lg"}
        roundedBottomLeft={isUser ? "lg" : "none"}
        roundedBottomRight={isUser ? "none" : "lg"}
        maxW="100%"
      >
        {/* Message Content */}
        {message?.content && (
          <Text
            fontSize={"1rem"}
            fontFamily={"Outfit"}
            color={"text_primary"}
            textAlign={"justify"}
            mb={message.attachments && message.attachments.length > 0 ? 3 : 0}
          >
            {message.content}
          </Text>
        )}

        {/* Attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <VStack gap={2} align="stretch" w="full">
            {message.attachments.map((attachment, index) => {
              const key = getKey(attachment, index);
              const pct = downloadProgress[key] ?? 0;
              const isLoading = !!downloading[key];
              return (
              <Stack
                key={key}
                borderWidth={1}
                borderColor={"border_bg"}
                borderRadius="md"
                p={2}
                bg="bg_box"
                // bg={isUser ? "blue.50" : "white"}
                maxW="300px"
                // cursor={isPreviewable(attachment) ? 'pointer' : 'default'}
                // onClick={() => {
                //   if (isPreviewable(attachment)) openPreview(attachment);
                // }}
              >
                {/* Image Preview */}
                {attachment.type === "image" && (
                  <Image
                    src={attachment.url}
                    alt={attachment.fileName}
                    maxH="200px"
                    borderRadius="md"
                    objectFit="cover"
                    mb={2}
                    w="full"
                    cursor="pointer"
                    _hover={{ opacity: 0.8 }}
                  />
                )}

                {/* File Info */}
                  <HStack
                    justify="space-between"
                    align="center"
                    bg="bg_box"
                    p={2}
                    borderRadius="md"
                  >
                    <HStack
                      flex={1}
                      h="full"
                      alignItems={"flex-start"}
                      justifyContent={"flex-start"}
                      overflow={"hidden"}
                    >
                      <Icon
                        as={getFileIcon(attachment.type)}
                        color={"gray.500"}
                        boxSize={5}
                      />
                      <VStack align="start" gap={0} flex={1}>
                        <Text
                          fontSize="sm"
                          fontWeight="medium"
                          textWrap={"wrap"}
                          overflow="hidden"
                          textOverflow="ellipsis"
                          color="text_primary"
                        >
                          {attachment.fileName}
                        </Text>
                        <HStack justify="space-between" w="full">
                          <Text fontSize="xs" color={"gray.500"}>
                            {formatFileSize(attachment.fileSize)}
                          </Text>
                          <IconButton
                            size="sm"
                            aria-label={isLoading ? "Downloading..." : "Download file"}
                            onClick={(e) => { e.stopPropagation(); handleDownloadWithProgress(attachment, key); }}
                            variant="ghost"
                            color={"gray.500"}
                            disabled={isLoading}
                          >
                            <MdOutlineFileDownload />
                          </IconButton>
                        </HStack>
                      </VStack>
                    </HStack>
                  </HStack>

                  {/* Download progress bar */}
                  {isLoading || pct > 0 ? (
                    <Box w="full" h="6px" bg="gray.100" borderRadius="full">
                      <Box h="6px" w={`${pct}%`} bg="blue.500" borderRadius="full" transition="width 0.2s ease" />
                    </Box>
                  ) : null}
                </Stack>
              );
            })}
          </VStack>
        )}

        {/* Time */}
        <Text
          fontSize={"0.65rem"}
          fontFamily={"Outfit"}
          color={"grey.500"}
          w="full"
          textAlign={"right"}
          mt={2}
        >
          {!isEmpty(message.createdAt)
            ? format(new Date(message.createdAt), "HH:mm a")
            : format(new Date(), "HH:mm a")}
        </Text>
      </VStack>
      {/* Attachment Preview Modal */}
      <Dialog.Root open={previewOpen} onOpenChange={() => setPreviewOpen(false)}>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content maxW={{ base: "95vw", md: "80vw" }} bg="main_background">
            <Dialog.CloseTrigger />
            <Dialog.Header>
              <Text fontWeight="600" color="text_primary" fontSize="md">
                {previewAttachment?.fileName}
              </Text>
            </Dialog.Header>
            <Dialog.Body>
              {previewAttachment?.type === "image" && (
                <Image
                  src={previewAttachment.url}
                  alt={previewAttachment.fileName}
                  w="100%"
                  h="auto"
                  maxH={{ base: "70vh", md: "80vh" }}
                  objectFit="contain"
                  borderRadius="md"
                />
              )}
              {previewAttachment && previewAttachment.type === "video" && (
                <chakra.video controls w="100%" maxH={{ base: "70vh", md: "80vh" }} borderRadius="md">
                  <source src={previewAttachment.url} />
                </chakra.video>
              )}
              {previewAttachment && isPdf(previewAttachment) && (
                <Box w="100%" maxH={{ base: '70vh', md: '80vh' }}>
                  <chakra.iframe
                    src={previewAttachment.url}
                    w="100%"
                    h={{ base: '70vh', md: '80vh' }}
                    borderRadius="md"
                    border="none"
                  />
                </Box>
              )}
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </VStack>
  );
};

export default MessageCard;
