import {
  Avatar,
  Box,
  Button,
  HStack,
  Skeleton,
  SkeletonCircle,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useGetTrendingProfilesQuery } from "mangarine/state/services/profile-recommendations.service";
import { useFollowUserMutation, useUnfollowUserMutation } from "mangarine/state/services/posts.service";
import { toaster } from "mangarine/components/ui/toaster";

const SkeletonRow = () => (
  <HStack bg="bg_box" rounded="xl" p={4} gap={4} justify="space-between">
    <HStack gap={4} flex={1} minW={0}>
      <SkeletonCircle size="12" flexShrink={0} />
      <VStack align="flex-start" gap={2} flex={1}>
        <Skeleton h="3.5" w="45%" rounded="md" />
        <Skeleton h="3" w="30%" rounded="md" />
        <Skeleton h="2.5" w="65%" rounded="md" />
      </VStack>
    </HStack>
    <Skeleton h="9" w="24" rounded="lg" flexShrink={0} />
  </HStack>
);

function DiscoverPage() {
  const router = useRouter();

  const { data: trending, isFetching } = useGetTrendingProfilesQuery(50);
  const [followUser] = useFollowUserMutation();
  const [unfollowUser] = useUnfollowUserMutation();
  const [followedIds, setFollowedIds] = useState<Set<string>>(new Set());

  const people: any[] = Array.isArray(trending) ? trending : [];

  useEffect(() => {
    if (!people.length) return;
    setFollowedIds(new Set(people.filter((p: any) => p.followStatus?.isFollowing).map((p: any) => p.id)));
  }, [trending]);

  const handleToggleFollow = async (userId: string) => {
    const isFollowing = followedIds.has(userId);
    setFollowedIds((prev) => { const s = new Set(prev); isFollowing ? s.delete(userId) : s.add(userId); return s; });
    try {
      if (isFollowing) {
        await unfollowUser({ targetUserId: userId }).unwrap();
      } else {
        await followUser({ targetUserId: userId }).unwrap();
      }
    } catch {
      setFollowedIds((prev) => { const s = new Set(prev); isFollowing ? s.add(userId) : s.delete(userId); return s; });
      toaster.create({ description: "Failed to update follow state", type: "error", closable: true });
    }
  };

  return (
    <Box
      display="grid"
      gridTemplateColumns={{ base: "1fr", lg: "1fr 2fr" }}
      gap={4}
      w="full"
      alignItems="flex-start"
    >
      {/* Left info panel */}
      <Box display={{ base: "none", lg: "block" }}>
        <Box bg="bg_box" rounded="xl" p={6} position="sticky" top="100px">
          <Text fontSize="1.25rem" fontWeight="700" color="text_primary" fontFamily="Outfit" mb={2}>
            Discover People
          </Text>
          <Text fontSize="0.875rem" color="grey.500" fontFamily="Outfit" lineHeight="1.6">
            Trending profiles on the platform right now — the people everyone is connecting with.
          </Text>
        </Box>
      </Box>

      {/* People list */}
      <VStack align="stretch" gap={3}>
        <Text
          display={{ base: "block", lg: "none" }}
          fontSize="1.1rem"
          fontWeight="700"
          color="text_primary"
          fontFamily="Outfit"
        >
          Discover People
        </Text>

        {isFetching ? (
          [...Array(6)].map((_, i) => <SkeletonRow key={i} />)
        ) : people.length === 0 ? (
          <Box bg="bg_box" rounded="xl" p={10} textAlign="center">
            <Text color="grey.400" fontFamily="Outfit">No trending profiles right now.</Text>
          </Box>
        ) : (
          people.map((person, idx) => {
            const isFollowing = followedIds.has(person.id);
            return (
              <HStack key={person.id} bg="bg_box" rounded="xl" p={4} gap={4} justify="space-between" align="flex-start">
                <Text
                  fontSize="0.8rem"
                  fontWeight="700"
                  color="grey.300"
                  fontFamily="Outfit"
                  w="20px"
                  flexShrink={0}
                  pt={1}
                >
                  {idx + 1}
                </Text>

                <HStack
                  gap={4}
                  flex={1}
                  minW={0}
                  cursor="pointer"
                  onClick={() => router.push(`/profile/${person.id}`)}
                  _hover={{ opacity: 0.8 }}
                  align="flex-start"
                >
                  <Avatar.Root boxSize="48px" flexShrink={0}>
                    <Avatar.Fallback name={person.fullName} />
                    <Avatar.Image src={person.profilePics} />
                  </Avatar.Root>
                  <VStack align="flex-start" gap={0.5} flex={1} minW={0}>
                    <Text fontWeight="600" fontSize="0.95rem" color="text_primary" fontFamily="Outfit" truncate>
                      {person.fullName}
                    </Text>
                    {person.title ? (
                      <Text fontSize="0.8rem" color="grey.500" fontFamily="Outfit" truncate>
                        {person.title}
                      </Text>
                    ) : null}
                    {person.bio ? (
                      <Text fontSize="0.8rem" color="grey.500" fontFamily="Outfit" lineClamp={2} mt={1}>
                        {person.bio}
                      </Text>
                    ) : null}
                    <HStack gap={3} mt={1}>
                      <Text fontSize="0.72rem" color="grey.400" fontFamily="Outfit">
                        {person.followerCount ?? 0} followers
                      </Text>
                      {person.isConsultant && (
                        <Text fontSize="0.72rem" color="blue.500" fontWeight="600" fontFamily="Outfit">
                          Consultant
                        </Text>
                      )}
                    </HStack>
                  </VStack>
                </HStack>

                <Button
                  size="sm"
                  px={4}
                  h="36px"
                  borderRadius="8px"
                  fontFamily="Outfit"
                  fontWeight="600"
                  fontSize="0.8rem"
                  flexShrink={0}
                  bg="transparent"
                  color={isFollowing ? "red.500" : "primary.950"}
                  variant="outline"
                  borderColor={isFollowing ? "red.400" : "primary.950"}
                  borderWidth="2px"
                  onClick={() => handleToggleFollow(person.id)}
                >
                  {isFollowing ? "Unfollow" : "Follow +"}
                </Button>
              </HStack>
            );
          })
        )}
      </VStack>
    </Box>
  );
}

export default DiscoverPage;
