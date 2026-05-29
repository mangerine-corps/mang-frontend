import { Box, Button, Flex, HStack, Image, Spinner, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/router";
import { useGetSuggestedSearchesQuery } from "mangarine/state/services/search.service";
import { useFollowUserMutation } from "mangarine/state/services/posts.service";

const ProspectiveFollowing = () => {
  const { data, isLoading } = useGetSuggestedSearchesQuery();
  const router = useRouter();
  const [followUser] = useFollowUserMutation();
  const [followed, setFollowed] = useState<Record<string, boolean>>({});

  const users: any[] = Array.isArray((data as any)?.data)
    ? (data as any).data.slice(0, 6)
    : [];

  const handleFollow = async (userId: string) => {
    setFollowed((prev) => ({ ...prev, [userId]: true }));
    try {
      await followUser({ targetUserId: userId }).unwrap();
    } catch {
      setFollowed((prev) => ({ ...prev, [userId]: false }));
    }
  };

  return (
    <Box
      w={{ base: "100%", md: "100%" }}
      display={{ base: "none", md: "flex" }}
      p={6}
      bg="bg_box"
      borderRadius="lg"
      boxShadow="sm"
      flexDirection="column"
      mt={4}
    >
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="xl" fontWeight="700" color="text_primary" fontFamily="Outfit">
          Prospective Following
        </Text>
        {users.length > 0 && (
          <Text
            fontSize="sm"
            color="text_primary"
            fontFamily="Outfit"
            fontWeight="600"
            cursor="pointer"
            _hover={{ textDecoration: "underline" }}
            onClick={() => router.push("/search?tab=people")}
          >
            See all
          </Text>
        )}
      </Flex>

      {isLoading ? (
        <HStack justify="center" py={6}>
          <Spinner size="sm" />
          <Text fontSize="sm" color="gray.500" fontFamily="Outfit">Loading...</Text>
        </HStack>
      ) : users.length === 0 ? (
        <VStack py={4} gap={1}>
          <Text fontSize="sm" color="gray.400" fontFamily="Outfit" textAlign="center">
            No suggestions available.
          </Text>
        </VStack>
      ) : (
        <VStack gap={4} align="stretch">
          {users.map((person: any) => {
            const isFollowed = followed[person.id];
            return (
              <Flex key={person.id} justify="space-between" align="center">
                <HStack gap={3}>
                  <Image
                    src={person.profilePics || "/person.png"}
                    alt={person.name || "User"}
                    boxSize="40px"
                    borderRadius="full"
                    objectFit="cover"
                  />
                  <Box>
                    <Text
                      fontWeight="600"
                      fontSize="0.875rem"
                      color="text_primary"
                      fontFamily="Outfit"
                    >
                      {person.name || "—"}
                    </Text>
                    <Text fontSize="xs" color="grey.500" fontFamily="Outfit">
                      {person.title || person.type || ""}
                    </Text>
                  </Box>
                </HStack>

                {!isFollowed ? (
                  <Button
                    bg="#111D4A"
                    color="white"
                    size="sm"
                    borderRadius="8px"
                    fontFamily="Outfit"
                    fontWeight="600"
                    fontSize="0.8rem"
                    px={4}
                    h="32px"
                    _hover={{ bg: "#111D4A" }}
                    onClick={() => handleFollow(person.id)}
                  >
                    Follow +
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    borderColor="gray.300"
                    color="text_primary"
                    size="sm"
                    borderRadius="8px"
                    fontFamily="Outfit"
                    fontWeight="600"
                    fontSize="0.8rem"
                    px={4}
                    h="32px"
                  >
                    Following
                  </Button>
                )}
              </Flex>
            );
          })}
        </VStack>
      )}
    </Box>
  );
};

export default ProspectiveFollowing;
