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
  Skeleton,
  SkeletonCircle,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { LuArrowRight, LuSearch } from "react-icons/lu";
import { useAppointment } from "mangarine/state/hooks/appointment.hook";
import { useAuth } from "mangarine/state/hooks/user.hook";
import { setCurrentConversation } from "mangarine/state/reducers/appointment.reducer";
import {
  getConversationSubtitle,
  isProfileVerified,
  resolveConversationProfile,
} from "mangarine/components/ui-components/message/helpers";
import { useLazySearchConsultantsQuery } from "mangarine/state/services/search.service";
import { useGetProfileRecommendationsQuery } from "mangarine/state/services/profile-recommendations.service";

type Props = {
  open: boolean;
  onOpenChange: () => void;
};

interface PersonItem {
  id: string;
  name: string;
  avatar: string;
  subtitle: string;
  verified: boolean;
  conversationId?: string;
  conversation?: any;
}

const PersonRowSkeleton = () => (
  <Flex align="center" gap={3} py={2} px={3}>
    <SkeletonCircle size="10" flexShrink={0} />
    <VStack align="stretch" gap={1.5} flex={1}>
      <Skeleton h="3.5" w="45%" rounded="md" />
      <Skeleton h="3" w="30%" rounded="md" />
    </VStack>
  </Flex>
);

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

  const [searchConsultants, { data: searchData, isFetching: isSearching }] = useLazySearchConsultantsQuery();
  const { data: recommendations, isFetching: isLoadingRecs } = useGetProfileRecommendationsQuery(
    {},
    { skip: !open }
  );

  // Only show conversations where the other party is a consultant
  const recentContacts = useMemo<PersonItem[]>(() => {
    return conversations
      .filter((conversation: any) => {
        const profile = resolveConversationProfile(conversation, userId);
        return Boolean(profile?.isConsultant);
      })
      .map((conversation: any) => {
        const profile = resolveConversationProfile(conversation, userId);
        return {
          id: String(profile?.id ?? ""),
          name: profile?.fullName || "Unknown",
          avatar: profile?.profilePics || "",
          subtitle: getConversationSubtitle(profile),
          verified: isProfileVerified(profile),
          conversationId: String(conversation?.id),
          conversation,
        };
      });
  }, [conversations, userId]);

  // Suggested consultants from recommendations
  const suggestedConsultants = useMemo<PersonItem[]>(() => {
    const recs: any[] = Array.isArray(recommendations) ? recommendations : [];
    const recentIds = new Set(recentContacts.map((c) => c.id));
    return recs
      .filter((p) => p.isConsultant && !recentIds.has(String(p.id)))
      .map((p) => ({
        id: String(p.id),
        name: p.fullName ?? p.name ?? "Unknown",
        avatar: p.profilePics ?? "",
        subtitle: p.title ?? p.businessName ?? "",
        verified: Boolean(p.isVerified ?? p.verified),
      }));
  }, [recommendations, recentContacts]);

  // Search results — consultants only endpoint
  const searchResults = useMemo<PersonItem[]>(() => {
    const items: any[] = searchData?.data?.items ?? searchData?.data ?? searchData?.items ?? [];
    return items.map((p: any) => ({
      id: String(p.id),
      name: p.fullName ?? p.name ?? "Unknown",
      avatar: p.profilePics ?? "",
      subtitle: p.title ?? p.businessName ?? "",
      verified: Boolean(p.isVerified ?? p.verified),
      conversationId: recentContacts.find((c) => c.id === String(p.id))?.conversationId,
      conversation: recentContacts.find((c) => c.id === String(p.id))?.conversation,
    }));
  }, [searchData, recentContacts]);

  const isSearchMode = search.trim().length > 0;
  const canMessage = Boolean(selectedUserId && selectedConversationId);
  const selectedButNoConversation = Boolean(selectedUserId && !selectedConversationId);

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
      searchConsultants({ query: search.trim(), limit: 20 });
    }, 350);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [search, searchConsultants]);

  const handleSelect = (person: PersonItem) => {
    setSelectedUserId(person.id);
    setSelectedConversationId(person.conversationId ?? "");
  };

  const handleMessage = () => {
    if (!canMessage) return;
    const contact = recentContacts.find((c) => c.conversationId === selectedConversationId);
    if (contact) dispatch(setCurrentConversation({ conversation: contact.conversation }));
    router.replace(
      { pathname: "/message", query: { conversationId: selectedConversationId } },
      undefined,
      { shallow: true }
    );
    onOpenChange();
  };

  const handleViewProfile = () => {
    router.push(`/consultant/${selectedUserId}`);
    onOpenChange();
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(details: any) => { if (!details?.open) onOpenChange(); }}
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
                <VStack align="stretch" gap={1}>
                  <Text
                    fontFamily="Outfit"
                    fontSize={{ base: "2rem", md: "2.25rem" }}
                    fontWeight="700"
                    color="text_primary"
                    lineHeight="1"
                  >
                    New Message
                  </Text>
                  <Text fontSize="0.84rem" color="#9CA3AF">
                    You can only message consultants you&apos;ve booked with.
                  </Text>
                </VStack>

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
                    placeholder="Search consultants"
                    h="46px"
                    borderRadius="10px"
                    borderColor="#EEF0F4"
                    bg="#FCFCFD"
                    ps="42px"
                    _placeholder={{ color: "#B0B5C2", fontSize: "0.875rem" }}
                    _focusVisible={{ borderColor: "#1C275D", boxShadow: "none" }}
                  />
                </Box>

                {/* List */}
                <VStack align="stretch" gap={0} maxH="360px" overflowY="auto" pr={1}>
                  {isSearchMode ? (
                    isSearching ? (
                      Array.from({ length: 5 }).map((_, i) => <PersonRowSkeleton key={i} />)
                    ) : searchResults.length ? (
                      searchResults.map((person) => (
                        <PersonRow
                          key={person.id}
                          person={person}
                          isSelected={selectedUserId === person.id}
                          onClick={() => handleSelect(person)}
                        />
                      ))
                    ) : (
                      <Box py={10} textAlign="center">
                        <Text fontSize="0.92rem" color="#7B8190">
                          No consultants found for &ldquo;{search}&rdquo;.
                        </Text>
                      </Box>
                    )
                  ) : (
                    <>
                      {recentContacts.length > 0 && (
                        <>
                          <SectionLabel>Recent</SectionLabel>
                          {recentContacts.map((person) => (
                            <PersonRow
                              key={person.conversationId}
                              person={person}
                              isSelected={selectedUserId === person.id}
                              onClick={() => handleSelect(person)}
                            />
                          ))}
                        </>
                      )}

                      {isLoadingRecs ? (
                        <>
                          <SectionLabel mt={recentContacts.length > 0 ? 3 : 0}>
                            Suggested
                          </SectionLabel>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <PersonRowSkeleton key={i} />
                          ))}
                        </>
                      ) : suggestedConsultants.length > 0 ? (
                        <>
                          <SectionLabel mt={recentContacts.length > 0 ? 3 : 0}>
                            Suggested
                          </SectionLabel>
                          {suggestedConsultants.map((person) => (
                            <PersonRow
                              key={person.id}
                              person={person}
                              isSelected={selectedUserId === person.id}
                              onClick={() => handleSelect(person)}
                            />
                          ))}
                        </>
                      ) : recentContacts.length === 0 ? (
                        <Box py={10} textAlign="center">
                          <Text fontSize="0.92rem" color="#7B8190">
                            Search for a consultant to message.
                          </Text>
                        </Box>
                      ) : null}
                    </>
                  )}
                </VStack>

                {/* Book-to-message banner with profile link */}
                {selectedButNoConversation && (
                  <Flex
                    align="center"
                    justify="space-between"
                    gap={3}
                    px={4}
                    py={3}
                    borderRadius="14px"
                    bg="#FFF8EC"
                    borderWidth="1px"
                    borderColor="#F6C960"
                  >
                    <VStack align="stretch" gap={0}>
                      <Text fontSize="0.84rem" fontWeight="600" color="#92620A">
                        No active conversation
                      </Text>
                      <Text fontSize="0.78rem" color="#B07C2A">
                        Book an appointment first to unlock messaging.
                      </Text>
                    </VStack>
                    <Button
                      size="sm"
                      bg="button_bg"
                      color="button_text"
                      borderRadius="10px"
                      fontWeight="600"
                      fontSize="0.82rem"
                      px={4}
                      py={5}
                      flexShrink={0}
                      onClick={handleViewProfile}
                      _hover={{ opacity: 0.9 }}
                    >
                      View Profile
                      <LuArrowRight size={13} />
                    </Button>
                  </Flex>
                )}

                <Button
                  h="46px"
                  borderRadius="8px"
                  bg={canMessage ? "#1C275D" : "#C9CEDD"}
                  color="white"
                  fontWeight="600"
                  onClick={handleMessage}
                  disabled={!canMessage}
                  _hover={{ bg: canMessage ? "#162255" : "#C9CEDD" }}
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

const SectionLabel = ({ children, mt = 0 }: { children: React.ReactNode; mt?: number }) => (
  <Text
    fontSize="0.75rem"
    fontWeight="600"
    color="#9CA3AF"
    textTransform="uppercase"
    letterSpacing="0.06em"
    px={3}
    pt={mt ? 2 : 0}
    pb={2}
  >
    {children}
  </Text>
);

const PersonRow = ({
  person,
  isSelected,
  onClick,
}: {
  person: PersonItem;
  isSelected: boolean;
  onClick: () => void;
}) => (
  <Flex
    align="center"
    gap={3}
    py={3}
    px={3}
    borderRadius="14px"
    cursor="pointer"
    onClick={onClick}
    bg={isSelected ? "#F0F2FA" : "transparent"}
    _hover={{ bg: isSelected ? "#F0F2FA" : "#F8F9FC" }}
  >
    <Avatar.Root size="md" flexShrink={0}>
      <Avatar.Fallback name={person.name} />
      <Avatar.Image src={person.avatar} />
    </Avatar.Root>

    <VStack align="stretch" gap={0.5} flex={1} minW={0}>
      <HStack gap={1.5}>
        <Text
          fontFamily="Outfit"
          fontSize="0.95rem"
          fontWeight="600"
          color="text_primary"
          lineClamp={1}
        >
          {person.name}
        </Text>
        {person.verified ? (
          <Image src="/icons/verified.svg" alt="Verified" boxSize="14px" flexShrink={0} />
        ) : null}
      </HStack>
      {person.subtitle ? (
        <Text fontSize="0.82rem" color="#9CA3AF" lineClamp={1}>
          {person.subtitle}
        </Text>
      ) : null}
    </VStack>

    <Box
      boxSize="18px"
      borderRadius="full"
      borderWidth="1.5px"
      borderColor={isSelected ? "#1C275D" : "#D1D5DB"}
      bg={isSelected ? "#1C275D" : "white"}
      flexShrink={0}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      {isSelected && <Box boxSize="7px" borderRadius="full" bg="white" />}
    </Box>
  </Flex>
);

export default NewMessageDrawer;
