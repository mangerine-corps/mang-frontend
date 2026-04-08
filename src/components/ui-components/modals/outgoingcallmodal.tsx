"use client";

import {
  Avatar,
  Box,
  Button,
  Dialog,
  Flex,
  Portal,
  Text,
  VStack,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { LuPhoneOff } from "react-icons/lu";
import type { OutgoingCall } from "../message/ChatProvider";

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
`;

const ripple = keyframes`
  0% { transform: scale(1); opacity: 0.5; }
  100% { transform: scale(1.9); opacity: 0; }
`;

type Props = {
  call: OutgoingCall;
  onCancel: () => void;
};

const OutgoingCallModal = ({ call, onCancel }: Props) => {
  const router = useRouter();

  useEffect(() => {
    if (call.status === "accepted") {
      router.push(
        `/message/videoconsultation?consultationId=${call.conversationId}`
      );
    }
  }, [call.status, call.conversationId, router]);

  const isRinging = call.status === "ringing";
  const isRejected = call.status === "rejected";

  return (
    <Dialog.Root
      open
      lazyMount
      placement="center"
      closeOnInteractOutside={false}
    >
      <Portal>
        <Dialog.Backdrop bg="blackAlpha.700" />
        <Dialog.Positioner>
          <Dialog.Content
            maxW="320px"
            borderRadius="28px"
            overflow="hidden"
            p={0}
          >
            <Box
              bg="linear-gradient(160deg, #1C275D 0%, #2D3E8A 100%)"
              px={8}
              py={10}
            >
              <VStack gap={7} align="center">
                {/* Avatar with ripple when ringing */}
                <Box position="relative" flexShrink={0}>
                  {isRinging && (
                    <>
                      <Box
                        position="absolute"
                        inset="-10px"
                        borderRadius="full"
                        bg="rgba(255,255,255,0.18)"
                        animation={`${ripple} 2s ease-out infinite`}
                      />
                      <Box
                        position="absolute"
                        inset="-10px"
                        borderRadius="full"
                        bg="rgba(255,255,255,0.10)"
                        animation={`${ripple} 2s ease-out infinite 0.7s`}
                      />
                    </>
                  )}
                  <Avatar.Root size="2xl" borderWidth="3px" borderColor="white">
                    <Avatar.Fallback
                      name={call.receiverName}
                      bg="#2D3E8A"
                      color="white"
                    />
                    <Avatar.Image src={call.receiverImage} />
                  </Avatar.Root>
                </Box>

                <VStack gap={1} align="center">
                  <Text
                    color="white"
                    fontSize="1.3rem"
                    fontWeight="700"
                    fontFamily="Outfit"
                    textAlign="center"
                  >
                    {call.receiverName}
                  </Text>
                  <Text
                    color={isRejected ? "red.300" : "rgba(255,255,255,0.65)"}
                    fontSize="0.9rem"
                    animation={
                      isRinging ? `${pulse} 1.8s ease-in-out infinite` : "none"
                    }
                  >
                    {isRinging ? "Calling..." : "Call declined"}
                  </Text>
                </VStack>

                {isRinging && (
                  <VStack gap={2}>
                    <Button
                      onClick={onCancel}
                      borderRadius="full"
                      w="60px"
                      h="60px"
                      p={0}
                      bg="red.500"
                      _hover={{ bg: "red.600", transform: "scale(1.05)" }}
                      transition="0.15s ease"
                    >
                      <LuPhoneOff size={22} color="white" />
                    </Button>
                    <Text fontSize="0.75rem" color="rgba(255,255,255,0.65)">
                      Cancel
                    </Text>
                  </VStack>
                )}
              </VStack>
            </Box>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default OutgoingCallModal;
