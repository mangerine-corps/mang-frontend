"use client";

import {
  Box,
  Drawer,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { LuSearch } from "react-icons/lu";
import { useAppointment } from "mangarine/state/hooks/appointment.hook";
import { useAuth } from "mangarine/state/hooks/user.hook";
import { ConversationItem } from "mangarine/pages/message";
import {
  getConversationPreview,
  getConversationSubtitle,
  hasConversationActivity,
  resolveConversationProfile,
} from "./helpers";

const ChatList = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: () => void;
}) => {
  const [search, setSearch] = useState("");
  const { conversations } = useAppointment();
  const { user } = useAuth();
  const userId = user?.id ?? "";

  const filteredConversations = useMemo(() => {
    return conversations.filter((conversation: any) => {
      if (!hasConversationActivity(conversation)) {
        return false;
      }

      const profile = resolveConversationProfile(conversation, userId);
      const haystack = `${profile?.fullName || ""} ${getConversationSubtitle(
        profile
      )} ${getConversationPreview(conversation)}`.toLowerCase();

      return !search.trim() || haystack.includes(search.trim().toLowerCase());
    });
  }, [conversations, search, userId]);

  return (
    <Drawer.Root
      size="md"
      open={open}
      onOpenChange={(details: any) => {
        if (!details?.open) {
          onOpenChange();
        }
      }}
      placement="start"
    >
      <Drawer.Backdrop />
      <Drawer.Positioner>
        <Drawer.Content
          bg="white"
          p={4}
          borderTopRightRadius="24px"
          borderBottomRightRadius="24px"
        >
          <Drawer.Header px={0} pt={0}>
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
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search messages"
                h="44px"
                borderRadius="10px"
                borderColor="#EEF0F4"
                bg="#FCFCFD"
                ps="42px"
                _placeholder={{ color: "#B0B5C2", fontSize: "0.875rem" }}
                _focusVisible={{ borderColor: "#1C275D", boxShadow: "none" }}
              />
            </Box>
          </Drawer.Header>

          <Drawer.Body px={0} pb={0}>
            <VStack align="stretch" gap={2} pt={3}>
              {filteredConversations.length ? (
                filteredConversations.map((conversation: any) => (
                  <ConversationItem
                    key={conversation.id}
                    conversation={conversation}
                  />
                ))
              ) : (
                <Box py={10} textAlign="center">
                  <Text fontSize="0.92rem" color="#7E8495">
                    No conversations found.
                  </Text>
                </Box>
              )}
            </VStack>
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
};

export default ChatList;
