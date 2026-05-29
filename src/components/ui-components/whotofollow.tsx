import { Box, Text, HStack, VStack, Button, Image, Skeleton, SkeletonCircle } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useGetProfileRecommendationsQuery } from "mangarine/state/services/profile-recommendations.service";
import { useFollowUserMutation } from "mangarine/state/services/posts.service";

const WhoToFollow = () => {
  const { data: recommendations, isLoading } = useGetProfileRecommendationsQuery({});
  const [followUser] = useFollowUserMutation();
  const [followedIds, setFollowedIds] = useState<Set<string>>(new Set());
  const router = useRouter();

  useEffect(() => {
    if (recommendations) {
      const alreadyFollowed = recommendations
        .filter((p) => p.isFollowing)
        .map((p) => p.id);
      if (alreadyFollowed.length > 0) {
        setFollowedIds((prev) => new Set([...prev, ...alreadyFollowed]));
      }
    }
  }, [recommendations]);

  const handleFollow = async (userId: string) => {
    try {
      await followUser({ targetUserId: userId }).unwrap();
      setFollowedIds((prev) => new Set(prev).add(userId));
    } catch (_) {}
  };

  const goToProfile = (userId: string) => {
    router.push(`/profile?profileId=${userId}`);
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
        <VStack wordSpacing={8} align="stretch">
          {(recommendations ?? []).map((person) => (
            <HStack key={person.id} justify="space-between">
              <HStack
                cursor="pointer"
                onClick={() => goToProfile(person.id)}
                _hover={{ opacity: 0.8 }}
                flex={1}
                minW={0}
              >
                <Image
                  src={person.profilePics || "/person.png"}
                  alt="profile-img"
                  rounded="full"
                  boxSize="36px"
                  objectFit="cover"
                  flexShrink={0}
                />
                <Box display="flex" flexDir="column" alignItems="flex-start" justifyContent="flex-start" minW={0}>
                  <Text fontWeight="semibold" color="text_primary" fontSize="1rem" truncate>
                    {person.fullName}
                  </Text>
                  <Text color="gray.500" lineHeight="shorter" fontSize="0.875rem" truncate>
                    {person.title ?? person.bio ?? ""}
                  </Text>
                </Box>
              </HStack>
              <Button
                variant="outline"
                size="sm"
                px="2"
                py="2"
                rounded="md"
                colorPalette={followedIds.has(person.id) ? "gray" : "blue"}
                disabled={followedIds.has(person.id)}
                onClick={() => handleFollow(person.id)}
                flexShrink={0}
              >
                {followedIds.has(person.id) ? (
                  <Text fontSize="0.875rem">Following</Text>
                ) : (
                  <>
                    <Image alt="add-follower-icon" src="/icons/plus.svg" />
                    <Text fontSize="0.875rem">Follow</Text>
                  </>
                )}
              </Button>
            </HStack>
          ))}
        </VStack>
      )}

      <Text
        mt={5}
        textAlign="center"
        fontWeight="medium"
        color="blue.900"
        cursor="pointer"
        _hover={{ textDecoration: "underline" }}
      >
        Show more
      </Text>
    </Box>
  );
};

export default WhoToFollow;
