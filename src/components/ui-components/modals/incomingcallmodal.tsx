"use client";

import {
  Avatar,
  Box,
  Button,
  Dialog,
  Flex,
  HStack,
  Portal,
  Text,
  VStack,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { LuPhoneCall, LuPhoneOff } from "react-icons/lu";
import type { IncomingCall } from "../message/ChatProvider";

const ripple = keyframes`
  0% { transform: scale(1); opacity: 0.6; }
  100% { transform: scale(1.9); opacity: 0; }
`;

type Props = {
  call: IncomingCall;
  onAccept: () => void;
  onReject: () => void;
};

const IncomingCallModal = ({ call, onAccept, onReject }: Props) => {
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
                {/* Pulsing avatar */}
                <Box position="relative" flexShrink={0}>
                  <Box
                    position="absolute"
                    inset="-10px"
                    borderRadius="full"
                    bg="rgba(255,255,255,0.18)"
                    animation={`${ripple} 1.8s ease-out infinite`}
                  />
                  <Box
                    position="absolute"
                    inset="-10px"
                    borderRadius="full"
                    bg="rgba(255,255,255,0.10)"
                    animation={`${ripple} 1.8s ease-out infinite 0.6s`}
                  />
                  <Avatar.Root size="2xl" borderWidth="3px" borderColor="white">
                    <Avatar.Fallback
                      name={call.callerName}
                      bg="#2D3E8A"
                      color="white"
                    />
                    <Avatar.Image src={call.callerImage} />
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
                    {call.callerName}
                  </Text>
                  <Text color="rgba(255,255,255,0.65)" fontSize="0.9rem">
                    Incoming video call...
                  </Text>
                </VStack>

                <HStack gap={10} justify="center">
                  <VStack gap={2}>
                    <Button
                      onClick={onReject}
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
                      Decline
                    </Text>
                  </VStack>

                  <VStack gap={2}>
                    <Button
                      onClick={onAccept}
                      borderRadius="full"
                      w="60px"
                      h="60px"
                      p={0}
                      bg="green.500"
                      _hover={{ bg: "green.600", transform: "scale(1.05)" }}
                      transition="0.15s ease"
                    >
                      <LuPhoneCall size={22} color="white" />
                    </Button>
                    <Text fontSize="0.75rem" color="rgba(255,255,255,0.65)">
                      Accept
                    </Text>
                  </VStack>
                </HStack>
              </VStack>
            </Box>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default IncomingCallModal;
