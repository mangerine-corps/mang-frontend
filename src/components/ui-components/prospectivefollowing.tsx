import { Avatar, Box, Button, Flex, HStack, Skeleton, SkeletonCircle, Text, VStack } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useGetTrendingProfilesQuery } from "mangarine/state/services/profile-recommendations.service";
import { useFollowUserMutation, useUnfollowUserMutation } from "mangarine/state/services/posts.service";
import { useGetFollowingListQuery } from "mangarine/state/services/profile.service";
import { useAuth } from "mangarine/state/hooks/user.hook";

const ProspectiveFollowing = () => {
  const { user } = useAuth();
  const { data: trending, isLoading } = useGetTrendingProfilesQuery(6);
  const { data: followingData } = useGetFollowingListQuery(
    { profileId: user?.id, limit: 200 },
    { skip: !user?.id }
  );
  const router = useRouter();
  const [followUser] = useFollowUserMutation();
  const [unfollowUser] = useUnfollowUserMutation();
  const [followedIds, setFollowedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const items: any[] = followingData?.data?.items ?? followingData?.data ?? [];
    if (items.length > 0) {
      setFollowedIds(new Set(items.map((u: any) => u.id)));
    }
  }, [followingData]);

  const users: any[] = Array.isArray(trending) ? trending : [];

  const handleToggleFollow = async (userId: string) => {
    const isFollowing = followedIds.has(userId);
    try {
      if (isFollowing) {
        await unfollowUser({ targetUserId: userId }).unwrap();
        setFollowedIds((prev) => { const s = new Set(prev); s.delete(userId); return s; });
      } else {
        await followUser({ targetUserId: userId }).unwrap();
        setFollowedIds((prev) => new Set(prev).add(userId));
      }
    } catch (_) {}
  };

  return (
    <Box
      w="100%"
      display={{ base: "none", md: "flex" }}
      p={6}
      bg="bg_box"
      borderRadius="lg"
      boxShadow="sm"
      flexDirection="column"
      mt={4}
    >
      <Flex justify="space-between" align="center" mb={4}>
        <Box>
          <Text fontSize="xl" fontWeight="700" color="text_primary" fontFamily="Outfit">
            Discover People
          </Text>
          <Text fontSize="0.75rem" color="grey.500" fontFamily="Outfit" mt={0.5}>
            Trending on the platform
          </Text>
        </Box>
        {users.length > 0 && (
          <Text
            fontSize="sm"
            color="text_primary"
            fontFamily="Outfit"
            fontWeight="600"
            cursor="pointer"
            _hover={{ textDecoration: "underline" }}
            onClick={() => router.push("/discover")}
          >
            See all
          </Text>
        )}
      </Flex>

      {isLoading ? (
        <VStack gap={4} align="stretch">
          {[...Array(4)].map((_, i) => (
            <Flex key={i} justify="space-between" align="center">
              <HStack gap={3}>
                <SkeletonCircle size="10" />
                <VStack align="flex-start" gap={1.5}>
                  <Skeleton h="3" w="110px" rounded="md" />
                  <Skeleton h="2.5" w="70px" rounded="md" />
                </VStack>
              </HStack>
              <Skeleton h="8" w="80px" rounded="md" />
            </Flex>
          ))}
        </VStack>
      ) : users.length === 0 ? (
        <VStack py={4} gap={1}>
          <Text fontSize="sm" color="gray.400" fontFamily="Outfit" textAlign="center">
            Nothing trending right now.
          </Text>
        </VStack>
      ) : (
        <VStack gap={4} align="stretch">
          {users.map((person: any) => {
            const isFollowing = followedIds.has(person.id);
            return (
              <Flex key={person.id} justify="space-between" align="center">
                <HStack
                  gap={3}
                  flex={1}
                  minW={0}
                  cursor="pointer"
                  onClick={() => router.push(`/profile?profileId=${person.id}`)}
                >
                  <Avatar.Root boxSize="40px" flexShrink={0}>
                    <Avatar.Fallback name={person.fullName} />
                    <Avatar.Image src={person.profilePics} />
                  </Avatar.Root>
                  <Box minW={0}>
                    <Text fontWeight="600" fontSize="0.875rem" color="text_primary" fontFamily="Outfit" truncate>
                      {person.fullName || "—"}
                    </Text>
                    <HStack gap={2}>
                      {person.title ? (
                        <Text fontSize="xs" color="grey.500" fontFamily="Outfit" truncate>
                          {person.title}
                        </Text>
                      ) : null}
                      {person.isConsultant ? (
                        <Text fontSize="xs" color="blue.500" fontWeight="600" fontFamily="Outfit" flexShrink={0}>
                          Consultant
                        </Text>
                      ) : null}
                    </HStack>
                    <Text fontSize="xs" color="grey.400" fontFamily="Outfit">
                      {person.followerCount ?? 0} followers
                    </Text>
                  </Box>
                </HStack>

                <Button
                  variant={isFollowing ? "outline" : "solid"}
                  bg={isFollowing ? "transparent" : "#111D4A"}
                  borderColor={isFollowing ? "gray.300" : "transparent"}
                  color={isFollowing ? "text_primary" : "white"}
                  size="sm"
                  borderRadius="8px"
                  fontFamily="Outfit"
                  fontWeight="600"
                  fontSize="0.8rem"
                  px={4}
                  h="32px"
                  flexShrink={0}
                  _hover={{ opacity: 0.85 }}
                  onClick={() => handleToggleFollow(person.id)}
                >
                  {isFollowing ? "Following" : "Follow +"}
                </Button>
              </Flex>
            );
          })}
        </VStack>
      )}
    </Box>
  );
};

export default ProspectiveFollowing;
