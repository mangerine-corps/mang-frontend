"use client";
import React from "react";
import {
  Box,
  Flex,
  Text,
  Image,
  Icon,
  IconButton,
  Link,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { IoDocument, IoImage, IoVideocam, IoDownload } from "react-icons/io5";

interface Attachment {
  id?: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  url: string;
  type: string;
  uploadedAt: string;
}

interface MessageWithAttachmentProps {
  message: {
    id: string;
    content: string;
    senderId: string;
    receiverId: string;
    attachments?: Attachment[];
    createdAt: string;
  };
  isOwnMessage: boolean;
}

const MessageWithAttachment: React.FC<MessageWithAttachmentProps> = ({
  message,
  isOwnMessage,
}) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type === 'image') return IoImage;
    if (type === 'video') return IoVideocam;
    return IoDocument;
  };

  const handleDownload = (attachment: Attachment) => {
    const link = document.createElement('a');
    link.href = attachment.url;
    link.download = attachment.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box
      alignSelf={isOwnMessage ? "flex-end" : "flex-start"}
      maxW="70%"
      mb={4}
    >
      <Box
        bg={isOwnMessage ? "blue.500" : "gray.100"}
        color={isOwnMessage ? "white" : "black"}
        p={3}
        borderRadius="lg"
        boxShadow="sm"
      >
        {/* Message Content */}
        {message.content && (
          <Text mb={message.attachments && message.attachments.length > 0 ? 3 : 0}>
            {message.content}
          </Text>
        )}

        {/* Attachments */}
        {message.attachments && message.attachments.length > 0 && (
          <VStack gap={2} align="stretch">
            {message.attachments.map((attachment, index) => (
              <Box
                key={attachment.id || index}
                borderWidth={1}
                borderColor={isOwnMessage ? "blue.200" : "gray.200"}
                borderRadius="md"
                p={2}
                bg={isOwnMessage ? "blue.50" : "white"}
              >
                {/* Image Preview */}
                {attachment.type === 'image' && (
                  <Image
                    src={attachment.url}
                    alt={attachment.fileName}
                    maxH="200px"
                    borderRadius="md"
                    objectFit="cover"
                    mb={2}
                  />
                )}

                {/* File Info */}
                <HStack justify="space-between" align="center">
                  <HStack gap={2} flex={1}>
                    <Icon
                      as={getFileIcon(attachment.type)}
                      color={isOwnMessage ? "blue.500" : "gray.500"}
                      boxSize={5}
                    />
                    <VStack align="start" gap={0} flex={1}>
                      <Text fontSize="sm" fontWeight="medium" lineClamp={1}>
                        {attachment.fileName}
                      </Text>
                      <Text fontSize="xs" color={isOwnMessage ? "blue.400" : "gray.500"}>
                        {formatFileSize(attachment.fileSize)}
                      </Text>
                    </VStack>
                  </HStack>

                  <Icon
                    size="sm"
                    aria-label="Download file"
                    onClick={() => handleDownload(attachment)}
                    color={isOwnMessage ? "blue.500" : "gray.500"}
                  ><IoDownload /></Icon>
                </HStack>
              </Box>
            ))}
          </VStack>
        )}
      </Box>
    </Box>
  );
};

export default MessageWithAttachment;
