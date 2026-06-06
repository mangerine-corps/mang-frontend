import { useEffect, useMemo, useRef, useState } from "react";
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
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { LuSearch } from "react-icons/lu";
import { useAppointment } from "mangarine/state/hooks/appointment.hook";
import { useAuth } from "mangarine/state/hooks/user.hook";
import { setConversations, setCurrentConversation } from "mangarine/state/reducers/appointment.reducer";
import {
  getConversationSubtitle,
  isProfileVerified,
  resolveConversationProfile,
} from "mangarine/components/ui-components/message/helpers";
import { useLazySearchPeopleQuery } from "mangarine/state/services/search.service";
import { useCreateConversationMutation } from "mangarine/state/services/apointment.service";
import { isEmpty, uniqBy } from "es-toolkit/compat";
import { toaster } from "mangarine/components/ui/toaster";

type Props = {
  open: boolean;
  onOpenChange: () => void;
};

interface SearchResult {
  id: string;
  fullName: string;
  profilePics?: string;
  title?: string;
  isConsultant?: boolean;
  isVerified?: boolean;
}

const NewMessageDrawer = ({ open, onOpenChange }: Props) => {
  const [search, setSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedConversationId, setSelectedConversationId] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const router = useRouter();
  const dispatch = useDispatch();
  const { conversations, currentConversation } = useAppointment();
  const { user } = useAuth();
  const userId = user?.id ?? "";

  const [searchPeople, { data: searchData, isFetching: isSearching }] = useLazySearchPeopleQuery();
  const [createConversation, { isLoading: isCreating }] = useCreateConversationMutation();

  const recentContacts = useMemo(() => {
    return conversations.map((conversation: any) => {
      const profile = resolveConversationProfile(conversation, userId);
      return {
        conversationId: String(conversation?.id),
        conversation,
        id: String(profile?.id ?? ""),
        name: profile?.fullName || "Unknown user",
        avatar: profile?.profilePics || "",
        subtitle: profile?.isConsultant
          ? `${getConversationSubtitle(profile)} • Consultant`
          : getConversationSubtitle(profile),
        verified: isProfileVerified(profile),
      };
    });
  }, [conversations, userId]);

  const searchResults: SearchResult[] = useMemo(() => {
    const items: any[] = searchData?.data?.items ?? searchData?.data ?? searchData?.items ?? [];
    return items.map((p: any) => ({
      id: String(p.id),
      fullName: p.fullName ?? p.name ?? "Unknown",
      profilePics: p.profilePics ?? "",
      title: p.title ?? p.businessName ?? "",
      isConsultant: Boolean(p.isConsultant),
      isVerified: Boolean(p.isVerified ?? p.verified),
    }));
  }, [searchData]);

  const isSearchMode = search.trim().length > 0;

  useEffect(() => {
    if (!open) return;
    setSearch("");
    setSelectedUserId("");
    setSelectedConversationId(
      currentConversation?.id ? String(currentConversation.id) : ""
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!search.trim()) return;
    debounceRef.current = setTimeout(() => {
      searchPeople({ query: search.trim(), limit: 20 });
    }, 350);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [search, searchPeople]);

  const handleSelectRecent = (conversationId: string, pUserId: string) => {
    setSelectedConversationId(conversationId);
    setSelectedUserId(pUserId);
  };

  const handleSelectSearchResult = (result: SearchResult) => {
    const existing = recentContacts.find((c) => c.id === result.id);
    if (existing) {
      setSelectedConversationId(existing.conversationId);
    } else {
      setSelectedConversationId("");
    }
    setSelectedUserId(result.id);
  };

  const hasSelection = Boolean(selectedUserId || selectedConversationId);

  const handleMessage = async () => {
    if (!hasSelection) return;

    if (selectedConversationId) {
      const contact = recentContacts.find((c) => c.conversationId === selectedConversationId);
      if (contact) {
        dispatch(setCurrentConversation({ conversation: contact.conversation }));
      }
      router.replace(
        { pathname: "/message", query: { conversationId: selectedConversationId } },
        undefined,
        { shallow: true }
      );
      onOpenChange();
      return;
    }

    // New conversation with a user found via search
    try {
      const payload = await createConversation({ participantId: selectedUserId }).unwrap();
      const newConv = payload?.data ?? payload;
      if (newConv?.id) {
        const updated = isEmpty(conversations) ? [newConv] : [...conversations, newConv];
        dispatch(setConversations({ conversations: uniqBy(updated, (c: any) => c.id) }));
        dispatch(setCurrentConversation({ conversation: newConv }));
        router.replace(
          { pathname: "/message", query: { conversationId: String(newConv.id) } },
          undefined,
          { shallow: true }
        );
      }
      onOpenChange();
    } catch (err: any) {
      toaster.create({
        description: err?.data?.message ?? "Could not start conversation",
        type: "error",
        closable: true,
      });
    }
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(details: any) => {
        if (!details?.open) onOpenChange();
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

                {/* Search input */}
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
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search people"
                    h="46px"
                    borderRadius="10px"
                    borderColor="#EEF0F4"
                    bg="#FCFCFD"
                    ps="42px"
                    _placeholder={{ color: "#B0B5C2", fontSize: "0.875rem" }}
                    _focusVisible={{ borderColor: "#1C275D", boxShadow: "none" }}
                  />
                </Box>

                {/* Results list */}
                <VStack align="stretch" gap={1} maxH="420px" overflowY="auto" pr={1}>

                  {/* Search mode */}
                  {isSearchMode ? (
                    isSearching ? (
                      <Flex justify="center" py={8}>
                        <Spinner color="#1C275D" />
                      </Flex>
                    ) : searchResults.length ? (
                      searchResults.map((person) => {
                        const isSelected = selectedUserId === person.id;
                        return (
                          <PersonRow
                            key={person.id}
                            id={person.id}
                            name={person.fullName}
                            avatar={person.profilePics ?? ""}
                            subtitle={person.title ?? ""}
                            verified={person.isVerified ?? false}
                            isSelected={isSelected}
                            onClick={() => handleSelectSearchResult(person)}
                          />
                        );
                      })
                    ) : (
                      <Box py={10} textAlign="center">
                        <Text fontSize="0.92rem" color="#7B8190">
                          No users found for &ldquo;{search}&rdquo;.
                        </Text>
                      </Box>
                    )
                  ) : (
                    /* Recent conversations mode */
                    <>
                      {recentContacts.length > 0 && (
                        <Text
                          fontSize="0.78rem"
                          fontWeight="600"
                          color="#9CA3AF"
                          textTransform="uppercase"
                          letterSpacing="0.06em"
                          px={1}
                          pb={1}
                        >
                          Recent
                        </Text>
                      )}
                      {recentContacts.length ? (
                        recentContacts.map((contact) => {
                          const isSelected = selectedConversationId === contact.conversationId;
                          return (
                            <PersonRow
                              key={contact.conversationId}
                              id={contact.conversationId}
                              name={contact.name}
                              avatar={contact.avatar}
                              subtitle={contact.subtitle}
                              verified={contact.verified}
                              isSelected={isSelected}
                              onClick={() => handleSelectRecent(contact.conversationId, contact.id)}
                            />
                          );
                        })
                      ) : (
                        <Box py={10} textAlign="center">
                          <Text fontSize="0.92rem" color="#7B8190">
                            Search for someone to message.
                          </Text>
                        </Box>
                      )}
                    </>
                  )}
                </VStack>

                <Button
                  h="46px"
                  borderRadius="8px"
                  bg={hasSelection ? "#1C275D" : "#C9CEDD"}
                  color="white"
                  fontWeight="600"
                  onClick={handleMessage}
                  disabled={!hasSelection || isCreating}
                  loading={isCreating}
                  _hover={{ bg: hasSelection ? "#162255" : "#C9CEDD" }}
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

interface PersonRowProps {
  id: string;
  name: string;
  avatar: string;
  subtitle: string;
  verified: boolean;
  isSelected: boolean;
  onClick: () => void;
}

const PersonRow = ({ name, avatar, subtitle, verified, isSelected, onClick }: PersonRowProps) => (
  <Flex
    align="center"
    gap={3}
    py={3}
    px={1}
    borderRadius="14px"
    cursor="pointer"
    onClick={onClick}
    _hover={{ bg: "#F8F9FC" }}
  >
    <Avatar.Root size="md">
      <Avatar.Fallback name={name} />
      <Avatar.Image src={avatar} />
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
          {name}
        </Text>
        {verified ? (
          <Image src="/icons/verified.svg" alt="Verified" boxSize="14px" flexShrink={0} />
        ) : null}
      </HStack>
      {subtitle ? (
        <Text fontSize="0.84rem" color="#7B8190" lineClamp={1}>
          {subtitle}
        </Text>
      ) : null}
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

export default NewMessageDrawer;
