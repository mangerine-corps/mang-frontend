import {
  Box,
  EmptyState,
  Flex,
  HStack,
  Icon,
  Input,
  InputGroup,
  NativeSelect,
  SimpleGrid,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { LuSearch, LuSlidersHorizontal } from "react-icons/lu";
import GeneralFeed from "mangarine/components/ui-components/generalfeed";
import ConsultantTabs from "mangarine/components/ui-components/consultanttab";

import ScheduledConsultation from "mangarine/components/ui-components/scheduledconsultation";
import { useEffect, useState } from "react";
import FavouriteConsultantsComp from "mangarine/components/ui-components/favourite_consultants_card";
import { useRouter } from "next/router";
import { useGetConsultantsQuery } from "mangarine/state/services/consultant.service";
import { useDispatch } from "react-redux";
import {
  selectConsultant,
  setConsultants,
} from "mangarine/state/reducers/consultant.reducer";
import UpcomingConsultations from "mangarine/components/ui-components/upcomingconsultation";
import { isEmpty } from "es-toolkit/compat";
import { useConsultants } from "mangarine/state/hooks/consultant.hook";

const Index = () => {
  // Normalize various possible backend representations of favorited flag
  const normalizeIsFavorited = (value: any): boolean => {
    if (typeof value === "boolean") return value;
    if (typeof value === "number") return value === 1;
    if (typeof value === "string") return value.toLowerCase() === "true" || value === "1";
    return false;
  };
 const { upcomingConsultation, favorite } = useConsultants();
  const [showFavs, setShowFavs] = useState<boolean>(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const {
    data: consultantData,
    isLoading,
    isError,
  } = useGetConsultantsQuery(undefined);
  const myConsultdata = consultantData?.data?.consultants;
  const [consultants, setLConsultants] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name-az");

  useEffect(() => {
    if (consultantData) {
      const { data } = consultantData;
      setLConsultants(data.consultants);
      dispatch(setConsultants(data.consultants));
    }
  }, [consultantData, dispatch]);

  const filteredConsultants = (() => {
    let list: any[] = Array.isArray(consultants) ? consultants : [];
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter((c: any) =>
        [c.fullName, c.businessName, c.bio, c.location]
          .filter(Boolean)
          .some((field: string) => field.toLowerCase().includes(q))
      );
    }
    switch (sortBy) {
      case "name-az":
        return [...list].sort((a, b) => (a.fullName ?? "").localeCompare(b.fullName ?? ""));
      case "name-za":
        return [...list].sort((a, b) => (b.fullName ?? "").localeCompare(a.fullName ?? ""));
      case "followers":
        return [...list].sort((a, b) => (b.followerCount ?? 0) - (a.followerCount ?? 0));
      default:
        return list;
    }
  })();

  const handleConsultantClick = (consultantId: string) => {
    dispatch(selectConsultant(consultantId));
    router.push(`/profile/${consultantId}`);
  };
  const noScrollbar = {
    "&::-webkit-scrollbar": { width: "0px", height: "0px" },
    "&::-webkit-scrollbar-track": { width: "0px", background: "transparent", height: "0px" },
    "&::-webkit-scrollbar-thumb": { background: "transparent", borderRadius: "0px", height: "0px", width: 0 },
  };

  return (
    <Flex gap={4} w="full" h={{ base: "auto", md: "full" }} overflow={{ base: "visible", md: "hidden" }}>
      {/* Center content */}
      <Box
        h={{ base: "auto", md: "full" }}
        w="full"
        overflowY="auto"
        overflowX="hidden"
        rounded="xl"
        css={noScrollbar}
      >
          <ConsultantTabs
            consultant={
              <VStack align="stretch" gap={4}>
                {/* Search + Sort controls — commented out
                <Flex
                  direction={{ base: "column", sm: "row" }}
                  gap={2}
                  align={{ base: "stretch", sm: "center" }}
                >
                  <InputGroup
                    flex={1}
                    startElement={
                      <Icon color="gray.400" boxSize="18px">
                        <LuSearch />
                      </Icon>
                    }
                    startElementProps={{ ps: "3" }}
                  >
                    <Input
                      placeholder="Search by name, specialty or location…"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      bg="bg_box"
                      borderColor="border_background"
                      rounded="10px"
                      size="md"
                      fontSize="0.875rem"
                      color="text_primary"
                      _placeholder={{ color: "text_muted" }}
                      _focusVisible={{ borderColor: "#1C275D", boxShadow: "none" }}
                    />
                  </InputGroup>

                  <HStack gap={2} flexShrink={0}>
                    <Icon color="text_muted" boxSize={4} display={{ base: "none", sm: "flex" }}>
                      <LuSlidersHorizontal />
                    </Icon>
                    <NativeSelect.Root w={{ base: "full", sm: "160px" }} size="sm">
                      <NativeSelect.Field
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        bg="bg_box"
                        borderColor="border_background"
                        color="text_primary"
                        rounded="10px"
                        fontSize="0.875rem"
                        px={3}
                      >
                        <option value="name-az">Name (A – Z)</option>
                        <option value="name-za">Name (Z – A)</option>
                        <option value="followers">Most Followers</option>
                      </NativeSelect.Field>
                    </NativeSelect.Root>
                  </HStack>
                </Flex>
                */}

                <SimpleGrid
                  alignItems="stretch"
                  columns={{ base: 1, sm: 2, md: 2, lg: 3 }}
                  gap={{ base: 3, sm: 4 }}
                >
                {/* render consultants data */}
                {isLoading ? (
                  // <Box>
                  //   <Text color="text_primary" textAlign={"center"}>
                  //     Loading consultants...
                  //   </Text>
                  // </Box>
                  <>
                    <Stack gap="6" maxW="xs">
                      <Skeleton height="200px" />
                      <Skeleton w="100px" h="16px" />
                      <VStack width="full">
                        <SkeletonText noOfLines={2} />
                      </VStack>
                      <HStack
                        width="full"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Skeleton w="100px" h="16px" />
                        <SkeletonCircle size="12" />
                      </HStack>
                    </Stack>
                    <Stack gap="6" maxW="xs">
                      <Skeleton height="200px" />
                      <Skeleton w="100px" h="16px" />
                      <VStack width="full">
                        <SkeletonText noOfLines={2} />
                      </VStack>
                      <HStack
                        width="full"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Skeleton w="100px" h="16px" />
                        <SkeletonCircle size="12" />
                      </HStack>
                    </Stack>
                    <Stack gap="6" maxW="xs">
                      <Skeleton height="200px" />
                      <Skeleton w="100px" h="16px" />
                      <VStack width="full">
                        <SkeletonText noOfLines={2} />
                      </VStack>
                      <HStack
                        width="full"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Skeleton w="100px" h="16px" />
                        <SkeletonCircle size="12" />
                      </HStack>
                    </Stack>
                    <Stack gap="6" maxW="xs">
                      <Skeleton height="200px" />
                      <Skeleton w="100px" h="16px" />
                      <VStack width="full">
                        <SkeletonText noOfLines={2} />
                      </VStack>
                      <HStack
                        width="full"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Skeleton w="100px" h="16px" />
                        <SkeletonCircle size="12" />
                      </HStack>
                    </Stack>
                  </>
                ) : isError ? (
                  <Box>
                    Oops!! Error fetching consultants. Please try again later.
                  </Box>
                ) : filteredConsultants.length > 0 ? (
                  filteredConsultants.map((consultant: any) => (
                    <Box key={consultant.id} cursor="pointer" h={"full"}>
                      <GeneralFeed
                        imageSrc={consultant.profilePics}
                        imageAlt={consultant.fullName}
                        name={consultant.fullName}
                        language={consultant.language}
                        profession={consultant.businessName}
                        about={consultant.bio}
                        location={consultant.location}
                        id={consultant?.id}
                        isFavorited={
                          normalizeIsFavorited(consultant?.isFavorited) ||
                          favorite.some((fav: any) => fav?.consultant?.id === consultant.id)
                        }
                        onClick={() => handleConsultantClick(consultant.id)}
                      />
                    </Box>
                  ))
                ) : (
                  <Box gridColumn="1 / -1" py={10} textAlign="center">
                    <Text color="text_muted" fontSize="0.9rem">
                      {searchQuery.trim() ? `No consultants found for "${searchQuery}"` : "No consultants available"}
                    </Text>
                  </Box>
                )}
              </SimpleGrid>
              </VStack>
            }
            specified={""}
          />
      </Box>

      {/* Right sidebar */}
      <VStack
        display={{ base: "none", lg: "flex" }}
        alignItems="stretch"
        w="260px"
        flexShrink={0}
        spaceY={2}
        h="full"
        overflowY="auto"
        css={noScrollbar}
      >
        <ScheduledConsultation />
        <FavouriteConsultantsComp />
      </VStack>
    </Flex>
  );
};

export default Index;
