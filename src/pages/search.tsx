import {
  Avatar,
  Box,
  Button,
  HStack,
  Image,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useSubHeader } from "mangarine/layouts/LayoutContext";
import Biocard from "mangarine/components/ui-components/biocard";
import DashboardCard from "mangarine/components/ui-components/dashboardcard";
import ActivityBox from "mangarine/components/ui-components/activitybox";
import BookingCalendar from "mangarine/components/ui-components/bookingcalender";
import TrendingCommunities from "mangarine/components/ui-components/trendingcommunities";
import WhoToFollow from "mangarine/components/ui-components/whotofollow";
import ActivityEmptyState from "mangarine/components/ui-components/emptystate";
import TrendingEmptyState from "mangarine/components/ui-components/emptytrendingstate";
import NewsItem from "mangarine/components/ui-components/newsitem";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { isEmpty } from "es-toolkit/compat";
import {
  useSearchAllQuery,
  useSearchConsultantsQuery,
  useSearchPeopleQuery,
  useSearchPostsQuery,
} from "mangarine/state/services/search.service";
import { useConsultants } from "mangarine/state/hooks/consultant.hook";
import { useCommunity } from "mangarine/state/hooks/communities.hook";

const noScrollbar = {
  "&::-webkit-scrollbar": { width: "0px", height: "0px" },
  "&::-webkit-scrollbar-track": { width: "0px", background: "transparent", height: "0px" },
  "&::-webkit-scrollbar-thumb": { background: "transparent", borderRadius: "0px", height: "0px", width: 0 },
};

type FilterType = "all" | "posts" | "people" | "consultants" | "groups";

const MAIN_FILTERS: { label: string; value: FilterType }[] = [
  { label: "All", value: "all" },
  { label: "Post", value: "posts" },
  { label: "People", value: "people" },
  { label: "Consultant", value: "consultants" },
  // { label: "Groups", value: "groups" },
];

const SkeletonCard = () => (
  <Box padding="4" rounded="lg" bg="bg_box" w="full">
    <HStack gap={3} mb={3}>
      <SkeletonCircle size="10" />
      <VStack align="start" flex={1} gap={1}>
        <Skeleton h="3" w="40%" />
        <Skeleton h="3" w="25%" />
      </VStack>
    </HStack>
    <SkeletonText noOfLines={3} spaceY="3" />
  </Box>
);

const PersonCard = ({ person, onNavigate, listView = false }: { person: any; onNavigate: (id: string) => void; listView?: boolean }) => {
  const name = person.fullName ?? person.name ?? "";
  const title = person.title ?? person.businessName ?? "";
  const location = person.location ?? "";
  const dob = person.dateOfBirth ?? null;
  const bio = person.bio ?? "";
  const avatar = person.profilePics ?? null;

  const formattedDob = dob
    ? new Date(dob).toLocaleDateString("en-US", { day: "numeric", month: "long" })
    : null;

  if (listView) {
    return (
      <HStack
        bg="bg_box"
        rounded="xl"
        p={4}
        gap={4}
        cursor="pointer"
        _hover={{ shadow: "md" }}
        onClick={() => onNavigate(person.id)}
        align="flex-start"
        w="full"
      >
        <Avatar.Root boxSize="52px" flexShrink={0}>
          <Avatar.Fallback name={name} />
          <Avatar.Image src={avatar} />
        </Avatar.Root>
        <VStack align="start" gap={1} flex={1} minW={0}>
          <Text fontWeight="600" fontSize="0.9rem" color="text_primary" fontFamily="Outfit">
            {name}
          </Text>
          {title ? (
            <Text fontSize="0.75rem" color="grey.500" fontFamily="Outfit">
              {title}
            </Text>
          ) : null}
          {(location || formattedDob) ? (
            <HStack gap={3} flexWrap="wrap">
              {location ? (
                <HStack gap={1}>
                  <Image alt="location" src="/images/location.svg" boxSize="13px" />
                  <Text fontSize="0.72rem" color="text_primary" fontFamily="Outfit">{location}</Text>
                </HStack>
              ) : null}
              {formattedDob ? (
                <HStack gap={1}>
                  <Image alt="born" src="/images/usertag.svg" boxSize="13px" />
                  <Text fontSize="0.72rem" color="text_primary" fontFamily="Outfit">Born {formattedDob}</Text>
                </HStack>
              ) : null}
            </HStack>
          ) : null}
          {bio ? (
            <Text fontSize="0.8rem" color="grey.500" fontFamily="Outfit" lineClamp={2}>
              {bio}
            </Text>
          ) : null}
        </VStack>
      </HStack>
    );
  }

  return (
    <Box
      bg="bg_box"
      rounded="xl"
      p={4}
      cursor="pointer"
      _hover={{ shadow: "md" }}
      onClick={() => onNavigate(person.id)}
    >
      <HStack gap={3} mb={2} align="flex-start">
        <Avatar.Root boxSize="48px" flexShrink={0}>
          <Avatar.Fallback name={name} />
          <Avatar.Image src={avatar} />
        </Avatar.Root>
        <VStack gap={0} align="start">
          <Text fontWeight="600" fontSize="0.9rem" color="text_primary" fontFamily="Outfit">
            {name}
          </Text>
          {title ? (
            <Text fontSize="0.75rem" color="grey.500" fontFamily="Outfit">
              {title}
            </Text>
          ) : null}
        </VStack>
      </HStack>
      {(location || formattedDob) ? (
        <HStack gap={3} mb={bio ? 2 : 0} flexWrap="wrap">
          {location ? (
            <HStack gap={1}>
              <Image alt="location" src="/images/location.svg" boxSize="14px" />
              <Text fontSize="0.75rem" color="text_primary" fontFamily="Outfit">{location}</Text>
            </HStack>
          ) : null}
          {formattedDob ? (
            <HStack gap={1}>
              <Image alt="born" src="/images/usertag.svg" boxSize="14px" />
              <Text fontSize="0.75rem" color="text_primary" fontFamily="Outfit">Born {formattedDob}</Text>
            </HStack>
          ) : null}
        </HStack>
      ) : null}
      {bio ? (
        <Text fontSize="0.8rem" color="grey.500" fontFamily="Outfit" lineClamp={2}>
          {bio}
        </Text>
      ) : null}
    </Box>
  );
};

const ConsultantCard = ({ consultant, onNavigate, listView = false }: { consultant: any; onNavigate: (id: string) => void; listView?: boolean }) => {
  const name = consultant.fullName ?? consultant.name ?? "";
  const title = consultant.title ?? "";
  const bio = consultant.bio ?? "";
  const avatar = consultant.profilePics ?? null;

  if (listView) {
    return (
      <HStack
        bg="bg_box"
        rounded="xl"
        p={4}
        gap={4}
        cursor="pointer"
        _hover={{ shadow: "md" }}
        onClick={() => onNavigate(consultant.id)}
        align="flex-start"
        w="full"
      >
        <Avatar.Root boxSize="52px" flexShrink={0}>
          <Avatar.Fallback name={name} />
          <Avatar.Image src={avatar} />
        </Avatar.Root>
        <VStack align="start" gap={1} flex={1} minW={0}>
          <Text fontWeight="600" fontSize="0.9rem" color="text_primary" fontFamily="Outfit">
            {name}
          </Text>
          {title ? (
            <Text fontSize="0.75rem" color="grey.500" fontFamily="Outfit">
              {title}
            </Text>
          ) : null}
          {bio ? (
            <Text fontSize="0.8rem" color="grey.500" fontFamily="Outfit" lineClamp={2}>
              {bio}
            </Text>
          ) : null}
        </VStack>
      </HStack>
    );
  }

  return (
    <Box
      bg="bg_box"
      rounded="xl"
      p={4}
      cursor="pointer"
      _hover={{ shadow: "md" }}
      onClick={() => onNavigate(consultant.id)}
    >
      <HStack gap={3} mb={2}>
        <Avatar.Root boxSize="40px">
          <Avatar.Fallback name={name} />
          <Avatar.Image src={avatar} />
        </Avatar.Root>
        <VStack align="start" gap={0} flex={1} minW={0}>
          <Text fontWeight="600" fontSize="0.875rem" color="text_primary" fontFamily="Outfit" lineClamp={1}>
            {name}
          </Text>
          {title ? (
            <Text fontSize="0.75rem" color="grey.500" fontFamily="Outfit" lineClamp={1}>
              {title}
            </Text>
          ) : null}
        </VStack>
      </HStack>
      {bio ? (
        <Text fontSize="0.8rem" color="grey.500" fontFamily="Outfit" lineClamp={3}>
          {bio}
        </Text>
      ) : null}
    </Box>
  );
};

const EmptyState = ({ message }: { message: string }) => (
  <VStack py={12} gap={2} w="full">
    <Text fontSize="0.95rem" color="grey.400" fontFamily="Outfit" textAlign="center">
      {message}
    </Text>
  </VStack>
);

function SearchPage() {
  const router = useRouter();
  const q = (router.query.q as string) ?? "";
  const filterParam = (router.query.filter as FilterType) ?? "all";
  const [activeFilter, setActiveFilter] = useState<FilterType>(filterParam);

  const { upcomingConsultation } = useConsultants();
  const { trending } = useCommunity();

  const skip = !q.trim();

  const { data: allData, isFetching: allLoading } = useSearchAllQuery(
    { query: q, limit: 10 },
    { skip: skip || activeFilter !== "all" }
  );
  const { data: postsData, isFetching: postsLoading } = useSearchPostsQuery(
    { query: q, limit: 10 },
    { skip: skip || activeFilter !== "posts" }
  );
  const { data: peopleData, isFetching: peopleLoading } = useSearchPeopleQuery(
    { query: q, limit: 10 },
    { skip: skip || activeFilter !== "people" }
  );
  const { data: consultantsData, isFetching: consultantsLoading } = useSearchConsultantsQuery(
    { query: q, limit: 10 },
    { skip: skip || activeFilter !== "consultants" }
  );

  const allPosts = useMemo(() => allData?.data?.posts ?? [], [allData]);
  const allPeople = useMemo(() => allData?.data?.people ?? [], [allData]);
  const allConsultants = useMemo(() => allData?.data?.consultants ?? [], [allData]);

  const posts = useMemo(() => postsData?.data?.items ?? postsData?.data ?? [], [postsData]);
  const people = useMemo(() => peopleData?.data?.items ?? peopleData?.data ?? [], [peopleData]);
  const consultants = useMemo(() => consultantsData?.data?.items ?? consultantsData?.data ?? [], [consultantsData]);

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
    router.replace({ pathname: "/search", query: { q, filter } }, undefined, { shallow: true });
  };

  const navigateToProfile = (id: string) => {
    router.push(`/profile?profileId=${id}`);
  };

  const filterBar = (
    <HStack gap={2} py={2} alignItems="center">
      {MAIN_FILTERS.map((f) => (
        <Button
          key={f.value}
          size="xs"
          px={3}
          h="26px"
          rounded="full"
          fontFamily="Outfit"
          fontSize="0.72rem"
          fontWeight="500"
          variant={activeFilter === f.value ? "solid" : "outline"}
          bg={activeFilter === f.value ? "#111D4A" : "transparent"}
          color={activeFilter === f.value ? "white" : "#111D4A"}
          borderColor={activeFilter === f.value ? "#111D4A" : "#B5B9C7"}
          _hover={{
            bg: activeFilter === f.value ? "#111D4A" : "transparent",
            opacity: activeFilter === f.value ? 1 : 0.8,
          }}
          onClick={() => handleFilterChange(f.value)}
        >
          {f.label}
        </Button>
      ))}
      {/* Pipe divider */}
      <Box w="1px" h="18px" bg="#B5B9C7" mx={2} flexShrink={0} />
      <Button
        size="xs"
        px={3}
        h="26px"
        rounded="full"
        fontFamily="Outfit"
        fontSize="0.72rem"
        fontWeight="500"
        variant="outline"
        color="#111D4A"
        borderColor="#B5B9C7"
        _hover={{ bg: "transparent", opacity: 0.8 }}
      >
        All filters
      </Button>
    </HStack>
  );

  useSubHeader(filterBar);

  return (
      <Box
        display="grid"
        gridTemplateColumns={{ base: "1fr", md: "1fr 2fr", lg: "1fr 2fr 1fr" }}
        gap={4}
        w="full"
        h="full"
        css={noScrollbar}
      >
        {/* Left sidebar */}
        <VStack
          display={{ base: "none", md: "flex" }}
          alignItems="stretch"
          spaceY={2}
          h="full"
          overflowY="auto"
          css={noScrollbar}
        >
          <Biocard />
          <DashboardCard />
        </VStack>

        {/* Center — search results */}
        <Stack gap={4} h="full" w="full" overflowY="auto" css={noScrollbar}>
          {/* No query state */}
          {!q.trim() && (
            <Box bg="bg_box" rounded="xl" px={4} py={12}>
              <EmptyState message="Type something to search" />
            </Box>
          )}

          {/* Groups nav hidden
          {activeFilter === "groups" && q.trim() && (
            <Box bg="bg_box" rounded="xl" px={4} py={12}>
              <EmptyState message="Group search is not available yet" />
            </Box>
          )} */}

          {/* ALL filter */}
          {activeFilter === "all" && q.trim() && (
            <Stack gap={4}>
              {allLoading ? (
                <Box bg="bg_box" rounded="xl" px={4} pb={4}>
                  <SkeletonCard />
                  <SkeletonCard />
                </Box>
              ) : (
                <>
                  {allPosts.length > 0 && (
                    <Stack bg="bg_box" rounded="xl" px={4} pb={4} gap={3}>
                      <Text fontWeight="700" fontSize="1rem" color="text_primary" fontFamily="Outfit" pt={4}>
                        Posts
                      </Text>
                      {allPosts.map((post: any) => (
                        <NewsItem key={post.id} post={post} />
                      ))}
                    </Stack>
                  )}

                  {allConsultants.length > 0 && (
                    <Stack bg="bg_box" rounded="xl" px={4} pb={4} gap={3}>
                      <Text fontWeight="700" fontSize="1rem" color="text_primary" fontFamily="Outfit" pt={4}>
                        Consultants
                      </Text>
                      <Box
                        display="grid"
                        gridTemplateColumns={{ base: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" }}
                        gap={3}
                      >
                        {allConsultants.map((c: any) => (
                          <ConsultantCard key={c.id} consultant={c} onNavigate={navigateToProfile} />
                        ))}
                      </Box>
                    </Stack>
                  )}

                  {allPeople.length > 0 && (
                    <Stack bg="bg_box" rounded="xl" px={4} pb={4} gap={3}>
                      <Text fontWeight="700" fontSize="1rem" color="text_primary" fontFamily="Outfit" pt={4}>
                        People
                      </Text>
                      <Box
                        display="grid"
                        gridTemplateColumns={{ base: "1fr", sm: "1fr 1fr" }}
                        gap={3}
                      >
                        {allPeople.map((p: any) => (
                          <PersonCard key={p.id} person={p} onNavigate={navigateToProfile} />
                        ))}
                      </Box>
                    </Stack>
                  )}

                  {allPosts.length === 0 && allPeople.length === 0 && allConsultants.length === 0 && (
                    <Box bg="bg_box" rounded="xl" px={4} py={12}>
                      <EmptyState message={`No results found for "${q}"`} />
                    </Box>
                  )}
                </>
              )}
            </Stack>
          )}

          {/* POSTS filter */}
          {activeFilter === "posts" && q.trim() && (
            <Stack bg="bg_box" rounded="xl" px={4} pb={4} gap={3}>
              {postsLoading ? (
                <>
                  <SkeletonCard />
                  <SkeletonCard />
                </>
              ) : posts.length > 0 ? (
                posts.map((post: any) => <NewsItem key={post.id} post={post} />)
              ) : (
                <EmptyState message={`No posts found for "${q}"`} />
              )}
            </Stack>
          )}

          {/* PEOPLE filter */}
          {activeFilter === "people" && q.trim() && (
            <Stack bg="bg_box" rounded="xl" px={4} pb={4} gap={2}>
              <Text fontWeight="700" fontSize="1rem" color="text_primary" fontFamily="Outfit" pt={4}>
                People
              </Text>
              {peopleLoading ? (
                <VStack gap={2} align="stretch">
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </VStack>
              ) : people.length > 0 ? (
                <VStack gap={2} align="stretch">
                  {people.map((p: any) => (
                    <PersonCard key={p.id} person={p} onNavigate={navigateToProfile} listView />
                  ))}
                </VStack>
              ) : (
                <EmptyState message={`No people found for "${q}"`} />
              )}
            </Stack>
          )}

          {/* CONSULTANTS filter */}
          {activeFilter === "consultants" && q.trim() && (
            <Stack bg="bg_box" rounded="xl" px={4} pb={4} gap={2}>
              <Text fontWeight="700" fontSize="1rem" color="text_primary" fontFamily="Outfit" pt={4}>
                Consultants
              </Text>
              {consultantsLoading ? (
                <VStack gap={2} align="stretch">
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </VStack>
              ) : consultants.length > 0 ? (
                <VStack gap={2} align="stretch">
                  {consultants.map((c: any) => (
                    <ConsultantCard key={c.id} consultant={c} onNavigate={navigateToProfile} listView />
                  ))}
                </VStack>
              ) : (
                <EmptyState message={`No consultants found for "${q}"`} />
              )}
            </Stack>
          )}
        </Stack>

        {/* Right sidebar */}
        <VStack
          display={{ base: "none", md: "flex" }}
          alignItems="stretch"
          spaceY={2}
          h="full"
          overflowY="auto"
          css={noScrollbar}
        >
          <Box w="full" cursor="pointer">
            {!isEmpty(upcomingConsultation) ? <ActivityBox /> : <ActivityEmptyState />}
          </Box>
          <BookingCalendar />
          {/* <Stack display={{ base: "none", lg: "flex" }} w="full">
            {!isEmpty(trending) ? <TrendingCommunities /> : <TrendingEmptyState />}
          </Stack> */}
          <WhoToFollow />
        </VStack>
      </Box>
  );
}

export default SearchPage;
