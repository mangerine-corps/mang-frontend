import { Box, Text, HStack, VStack, Button, Image, Skeleton, SkeletonCircle } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useGetProfileRecommendationsQuery } from "mangarine/state/services/profile-recommendations.service";
import { useFollowUserMutation, useUnfollowUserMutation } from "mangarine/state/services/posts.service";
import { toaster } from "mangarine/components/ui/toaster";

const WhoToFollow = () => {
  const { data: recommendations, isLoading } = useGetProfileRecommendationsQuery({});
  const [followUser] = useFollowUserMutation();
  const [unfollowUser] = useUnfollowUserMutation();
  const [followedIds, setFollowedIds] = useState<Set<string>>(new Set());
  const router = useRouter();

  const recs: any[] = recommendations ?? [];

  useEffect(() => {
    if (!recs.length) return;
    setFollowedIds(new Set(recs.filter((p: any) => p.followStatus?.isFollowing).map((p: any) => p.id)));
  }, [recommendations]);

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

  const goToProfile = (userId: string) => {
    router.push(`/profile/${userId}`);
  };

  return (
    <Box
      bg="main_background"
      rounded="lg"
      shadow="sm"
      p={6}
      w="full"
      display={{ base: "none", md: "block", lg: "block" }}
    >
      <Text fontWeight="bold" color="text_primary" fontSize="1rem" mb={8}>
        Who to follow
      </Text>

      {isLoading ? (
        <VStack align="stretch" gap={4}>
          {[...Array(3)].map((_, i) => (
            <HStack key={i} justify="space-between">
              <HStack gap={3}>
                <SkeletonCircle size="9" />
                <VStack align="flex-start" gap={2}>
                  <Skeleton h="3" w="120px" rounded="md" />
                  <Skeleton h="2.5" w="80px" rounded="md" />
                </VStack>
              </HStack>
              <Skeleton h="8" w="72px" rounded="md" />
            </HStack>
          ))}
        </VStack>
      ) : (
        <VStack gap={4} align="stretch">
          {(recommendations ?? []).map((person) => {
            const isFollowing = followedIds.has(person.id);
            return (
              <HStack key={person.id} w="full" gap={2} align="center">
                <HStack
                  cursor="pointer"
                  onClick={() => goToProfile(person.id)}
                  _hover={{ opacity: 0.8 }}
                  flex={1}
                  minW={0}
                  gap={2}
                  overflow="hidden"
                >
                  <Image
                    src={person.profilePics || "/person.png"}
                    alt="profile-img"
                    rounded="full"
                    boxSize="36px"
                    objectFit="cover"
                    flexShrink={0}
                  />
                  <Box minW={0} flex={1} overflow="hidden">
                    <Text fontWeight="semibold" color="text_primary" fontSize="0.875rem" truncate>
                      {person.fullName}
                    </Text>
                    <Text color="gray.500" lineHeight="shorter" fontSize="0.75rem" truncate>
                      {person.title ?? person.bio ?? ""}
                    </Text>
                  </Box>
                </HStack>
                <Button
                  variant="outline"
                  size="xs"
                  px={2}
                  rounded="md"
                  colorPalette={isFollowing ? "red" : "blue"}
                  borderColor={isFollowing ? "red.400" : "primary.950"}
                  color={isFollowing ? "red.500" : "primary.950"}
                  bg="transparent"
                  borderWidth="2px"
                  onClick={() => handleToggleFollow(person.id)}
                  flexShrink={0}
                  minW="68px"
                >
                  {isFollowing ? "Unfollow" : (
                    <>
                      <Image alt="add-follower-icon" src="/icons/plus.svg" boxSize="10px" />
                      Follow
                    </>
                  )}
                </Button>
              </HStack>
            );
          })}
        </VStack>
      )}

      <Text
        mt={5}
        textAlign="center"
        fontWeight="medium"
        color="blue.900"
        cursor="pointer"
        _hover={{ textDecoration: "underline" }}
        onClick={() => router.push("/people")}
      >
        Show more
      </Text>
    </Box>
  );
};

export default WhoToFollow;
