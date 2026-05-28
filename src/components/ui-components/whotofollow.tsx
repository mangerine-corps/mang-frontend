import { Box, Text, HStack, VStack, Button, Image, Skeleton, SkeletonCircle } from "@chakra-ui/react";
import { useState } from "react";
import { useGetProfileRecommendationsQuery } from "mangarine/state/services/profile-recommendations.service";
import { useFollowUserMutation } from "mangarine/state/services/posts.service";

const WhoToFollow = () => {
  const { data: recommendations, isLoading } = useGetProfileRecommendationsQuery({});
  const [followUser] = useFollowUserMutation();
  const [followedIds, setFollowedIds] = useState<Set<string>>(new Set());

  const handleFollow = async (userId: string) => {
    try {
      await followUser({ targetUserId: userId }).unwrap();
      setFollowedIds((prev) => new Set(prev).add(userId));
    } catch (_) {}
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
              <HStack>
                <Image
                  src={person.profilePics || "/person.png"}
                  alt="profile-img"
                  rounded="full"
                  boxSize="36px"
                  objectFit="cover"
                />
                <Box display="flex" flexDir="column" alignItems="flex-start" justifyContent="flex-start">
                  <Text fontWeight="semibold" color="text_primary" fontSize="1rem">
                    {person.fullName}
                  </Text>
                  <Text color="grey.500" lineHeight="shorter" fontSize="0.875rem">
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
                color="grey.500"
                disabled={followedIds.has(person.id)}
                onClick={() => handleFollow(person.id)}
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
