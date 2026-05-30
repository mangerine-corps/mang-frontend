import { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  CloseButton,
  Dialog,
  Flex,
  HStack,
  Image,
  Input,
  Portal,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { LuSearch } from "react-icons/lu";
import { useAppointment } from "mangarine/state/hooks/appointment.hook";
import { useAuth } from "mangarine/state/hooks/user.hook";
import { setCurrentConversation } from "mangarine/state/reducers/appointment.reducer";
import {
  getConversationSubtitle,
  isProfileVerified,
  resolveConversationProfile,
} from "mangarine/components/ui-components/message/helpers";

type Props = {
  open: boolean;
  onOpenChange: () => void;
};

const NewMessageDrawer = ({ open, onOpenChange }: Props) => {
  const [search, setSearch] = useState("");
  const [selectedConversationId, setSelectedConversationId] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();
  const { conversations, currentConversation } = useAppointment();
  const { user } = useAuth();
  const userId = user?.id ?? "";

  const contacts = useMemo(() => {
    return conversations.map((conversation: any) => {
      const profile = resolveConversationProfile(conversation, userId);

      return {
        conversation,
        id: String(conversation?.id),
        name: profile?.fullName || "Unknown user",
        avatar: profile?.profilePics || "",
        subtitle: profile?.isConsultant
          ? `${getConversationSubtitle(profile)} • Book to Message`
          : getConversationSubtitle(profile),
        verified: isProfileVerified(profile),
      };
    });
  }, [conversations, userId]);

  const filteredContacts = useMemo(() => {
    if (!search.trim()) {
      return contacts;
    }

    const query = search.trim().toLowerCase();

    return contacts.filter((contact) =>
      `${contact.name} ${contact.subtitle}`.toLowerCase().includes(query)
    );
  }, [contacts, search]);

  useEffect(() => {
    if (!open) {
      return;
    }

    setSearch("");
    setSelectedConversationId(currentConversation?.id ? String(currentConversation.id) : "");
    // Only seed the selection when the modal opens — not on every background conversation change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleStartConversation = () => {
    const selectedContact = contacts.find(
      (contact) => contact.id === selectedConversationId
    );

    if (!selectedContact) {
      return;
    }

    dispatch(setCurrentConversation({ conversation: selectedContact.conversation }));

    try {
      router.replace(
        {
          pathname: "/message",
          query: { conversationId: selectedContact.id },
        },
        undefined,
        { shallow: true }
      );
    } catch (_) {}

    onOpenChange();
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(details: any) => {
        if (!details?.open) {
          onOpenChange();
        }
      }}
      placement="center"
      size="xl"
    >
      <Portal>
        <Dialog.Backdrop bg="rgba(17, 29, 74, 0.18)" backdropFilter="blur(2px)" />
        <Dialog.Positioner px={4}>
          <Dialog.Content
            maxW="510px"
            w="full"
            maxH="80vh"
            p={{ base: 5, md: 7 }}
            borderRadius="18px"
            bg="white"
            boxShadow="0 24px 80px rgba(17, 29, 74, 0.16)"
          >
            <Dialog.CloseTrigger asChild>
              <CloseButton
                onClick={onOpenChange}
                position="absolute"
                top="20px"
                right="20px"
                size="sm"
                bg="white"
                borderWidth="1px"
                borderColor="#EEF0F4"
                borderRadius="12px"
                boxShadow="0 6px 18px rgba(17, 29, 74, 0.08)"
              />
            </Dialog.CloseTrigger>

            <Dialog.Body p={0}>
              <VStack align="stretch" gap={5}>
                <Text
                  fontFamily="Outfit"
                  fontSize={{ base: "2rem", md: "2.25rem" }}
                  fontWeight="700"
                  color="text_primary"
                  lineHeight="1"
                >
                  New Message
                </Text>

                <Box position="relative">
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
                    placeholder="Search contacts"
                    h="46px"
                    borderRadius="10px"
                    borderColor="#EEF0F4"
                    bg="#FCFCFD"
                    ps="42px"
                    _placeholder={{ color: "#B0B5C2", fontSize: "0.875rem" }}
                    _focusVisible={{ borderColor: "#1C275D", boxShadow: "none" }}
                  />
                </Box>

                <VStack
                  align="stretch"
                  gap={1}
                  maxH="420px"
                  overflowY="auto"
                  pr={1}
                >
                  {filteredContacts.length ? (
                    filteredContacts.map((contact) => {
                      const isSelected = selectedConversationId === contact.id;

                      return (
                        <Flex
                          key={contact.id}
                          align="center"
                          gap={3}
                          py={3}
                          px={1}
                          borderRadius="14px"
                          cursor="pointer"
                          onClick={() => setSelectedConversationId(contact.id)}
                          _hover={{ bg: "#F8F9FC" }}
                        >
                          <Avatar.Root size="md">
                            <Avatar.Fallback name={contact.name} />
                            <Avatar.Image src={contact.avatar} />
                          </Avatar.Root>

                          <VStack align="stretch" gap={0} flex={1} minW={0}>
                            <HStack gap={1.5}>
                              <Text
                                fontFamily="Outfit"
                                fontSize="1.05rem"
                                fontWeight="600"
                                color="text_primary"
                                lineClamp={1}
                              >
                                {contact.name}
                              </Text>
                              {contact.verified ? (
                                <Image
                                  src="/icons/verified.svg"
                                  alt="Verified"
                                  boxSize="14px"
                                  flexShrink={0}
                                />
                              ) : null}
                            </HStack>
                            <Text
                              fontSize="0.84rem"
                              color="#7B8190"
                              lineClamp={1}
                            >
                              {contact.subtitle}
                            </Text>
                          </VStack>

                          <Box
                            boxSize="12px"
                            borderRadius="full"
                            borderWidth="1px"
                            borderColor={isSelected ? "#1C275D" : "#C7CEDD"}
                            bg={isSelected ? "#1C275D" : "white"}
                            flexShrink={0}
                          />
                        </Flex>
                      );
                    })
                  ) : (
                    <Box py={10} textAlign="center">
                      <Text fontSize="0.92rem" color="#7B8190">
                        No conversations match your search.
                      </Text>
                    </Box>
                  )}
                </VStack>

                <Button
                  h="46px"
                  borderRadius="8px"
                  bg={selectedConversationId ? "#1C275D" : "#C9CEDD"}
                  color="white"
                  fontWeight="600"
                  onClick={handleStartConversation}
                  disabled={!selectedConversationId}
                  _hover={{
                    bg: selectedConversationId ? "#162255" : "#C9CEDD",
                  }}
                >
                  Message
                </Button>
              </VStack>
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default NewMessageDrawer;
