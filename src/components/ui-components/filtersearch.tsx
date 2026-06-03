import { Avatar, Box, Button, HStack, Icon, Skeleton, SkeletonCircle, Text, VStack } from "@chakra-ui/react";
import { Clock, X } from "lucide-react";
import { useState, useEffect } from "react";
import {
  useGetRecentSearchesQuery,
  useGetSuggestedSearchesQuery,
  useRemoveRecentSearchMutation,
} from "mangarine/state/services/search.service";
import { useFollowUserMutation, useUnfollowUserMutation } from "mangarine/state/services/posts.service";
import { useGetFollowingListQuery } from "mangarine/state/services/profile.service";
import { useAuth } from "mangarine/state/hooks/user.hook";

interface FilterSearchProps {
  onSelect?: (item: { id: string; name: string; type: "user" | "consultant" }) => void;
}

const FilterSearch = ({ onSelect }: FilterSearchProps) => {
  const { user } = useAuth();
  const { data: recentData, isLoading: recentLoading } = useGetRecentSearchesQuery();
  const { data: suggestedData, isLoading: suggestedLoading } = useGetSuggestedSearchesQuery();
  const [removeRecent] = useRemoveRecentSearchMutation();
  const { data: followingData } = useGetFollowingListQuery(
    { profileId: user?.id, limit: 200 },
    { skip: !user?.id }
  );
  const [followUser] = useFollowUserMutation();
  const [unfollowUser] = useUnfollowUserMutation();
  const [followedIds, setFollowedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const items: any[] = followingData?.data?.items ?? followingData?.data ?? [];
    setFollowedIds(new Set(items.map((u: any) => u.id)));
  }, [followingData]);

  const handleToggleFollow = async (e: React.MouseEvent, userId: string) => {
    e.stopPropagation();
    const isFollowing = followedIds.has(userId);
    // optimistic update
    setFollowedIds((prev) => {
      const s = new Set(prev);
      isFollowing ? s.delete(userId) : s.add(userId);
      return s;
    });
    try {
      if (isFollowing) {
        await unfollowUser({ targetUserId: userId }).unwrap();
      } else {
        await followUser({ targetUserId: userId }).unwrap();
      }
    } catch (_) {
      // revert on failure
      setFollowedIds((prev) => {
        const s = new Set(prev);
        isFollowing ? s.add(userId) : s.delete(userId);
        return s;
      });
    }
  };

  const recentSearches: any[] = (recentData?.data ?? []).slice(0, 3);
  const suggested: any[] = (suggestedData?.data ?? []).slice(0, 5);

  const handleRemove = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    removeRecent(id);
  };

  const handleSelect = (item: any) => {
    const resolved = item.profile ?? item;
    onSelect?.({
      id: resolved.id ?? item.targetId,
      name: resolved.fullName ?? resolved.name ?? "",
      type: item.type ?? "user",
    });
  };

  return (
    <Box bg="bg_box" rounded="lg" shadow="sm" p={4} w="full">
      {/* Recent Searches */}
      {recentLoading ? (
        <VStack align="stretch" gap={2} mb={3}>
          {[1, 2].map((i) => (
            <HStack key={i} gap={3} py={1}>
              <SkeletonCircle size="8" flexShrink={0} />
              <Skeleton h="3" flex={1} rounded="md" />
            </HStack>
          ))}
        </VStack>
      ) : recentSearches.length > 0 ? (
        <VStack align="stretch" gap={0} mb={3}>
          <Text
            fontSize="0.75rem"
            fontFamily="Outfit"
            fontWeight="600"
            color="grey.500"
            mb={2}
            textTransform="uppercase"
            letterSpacing="0.05em"
          >
            Recent
          </Text>
          {recentSearches.map((item: any, idx: number) => {
            const profile = item.profile ?? item;
            const name = profile.fullName ?? profile.name ?? item.query ?? "";
            const title = profile.businessName ?? profile.title ?? "";
            const avatar = profile.profilePics ?? null;
            const id = item.id ?? item.targetId;

            return (
              <HStack
                key={idx}
                justify="space-between"
                py={2}
                px={1}
                rounded="md"
                cursor="pointer"
                _hover={{ bg: "main_background" }}
                onClick={() => handleSelect(item)}
              >
                <HStack gap={3}>
                  <Icon color="grey.400">
                    <Clock size={14} />
                  </Icon>
                  {avatar ? (
                    <Avatar.Root w={8} h={8}>
                      <Avatar.Fallback name={name} />
                      <Avatar.Image src={avatar} />
                    </Avatar.Root>
                  ) : null}
                  <Box>
                    <Text fontWeight="500" color="text_primary" fontSize="0.875rem" fontFamily="Outfit">
                      {name}
                    </Text>
                    {title ? (
                      <Text color="grey.500" fontSize="0.75rem" fontFamily="Outfit">
                        {title}
                      </Text>
                    ) : null}
                  </Box>
                </HStack>
                <Box
                  as="button"
                  onClick={(e: React.MouseEvent) => handleRemove(e, id)}
                  p={1}
                  rounded="full"
                  _hover={{ bg: "gray.100" }}
                  color="grey.400"
                >
                  <X size={12} />
                </Box>
              </HStack>
            );
          })}
        </VStack>
      ) : null}

      {/* Suggested */}
      {suggestedLoading ? (
        <VStack align="stretch" gap={2}>
          {[1, 2, 3].map((i) => (
            <HStack key={i} justify="space-between" py={1}>
              <HStack gap={3}>
                <SkeletonCircle size="8" flexShrink={0} />
                <VStack align="flex-start" gap={1.5}>
                  <Skeleton h="3" w="100px" rounded="md" />
                  <Skeleton h="2.5" w="60px" rounded="md" />
                </VStack>
              </HStack>
              <Skeleton h="7" w="72px" rounded="md" />
            </HStack>
          ))}
        </VStack>
      ) : suggested.length > 0 ? (
        <VStack align="stretch" gap={0}>
          <Text
            fontSize="0.75rem"
            fontFamily="Outfit"
            fontWeight="600"
            color="grey.500"
            mb={2}
            textTransform="uppercase"
            letterSpacing="0.05em"
          >
            Suggested
          </Text>
          {suggested.map((item: any, idx: number) => {
            const name = item.fullName ?? item.name ?? "";
            const title = item.businessName ?? item.title ?? "";
            const avatar = item.profilePics ?? null;
            const isFollowing = followedIds.has(item.id);

            return (
              <HStack
                key={idx}
                py={2}
                px={1}
                rounded="md"
                cursor="pointer"
                justify="space-between"
                _hover={{ bg: "main_background" }}
                onClick={() => onSelect?.({ id: item.id, name, type: item.type ?? "user" })}
              >
                <HStack gap={3} flex={1} minW={0}>
                  <Avatar.Root w={8} h={8} flexShrink={0}>
                    <Avatar.Fallback name={name} />
                    <Avatar.Image src={avatar} />
                  </Avatar.Root>
                  <Box minW={0}>
                    <Text fontWeight="500" color="text_primary" fontSize="0.875rem" fontFamily="Outfit" truncate>
                      {name}
                    </Text>
                    {title ? (
                      <Text color="grey.500" fontSize="0.75rem" fontFamily="Outfit" truncate>
                        {title}
                      </Text>
                    ) : null}
                  </Box>
                </HStack>
                <Button
                  size="xs"
                  px={3}
                  variant="outline"
                  rounded="md"
                  colorPalette={isFollowing ? "gray" : "blue"}
                  flexShrink={0}
                  onClick={(e) => handleToggleFollow(e, item.id)}
                >
                  {isFollowing ? "Following" : "+ Follow"}
                </Button>
              </HStack>
            );
          })}
        </VStack>
      ) : null}

      {!recentLoading && !suggestedLoading && recentSearches.length === 0 && suggested.length === 0 && (
        <Text fontSize="0.875rem" color="grey.400" textAlign="center" py={3} fontFamily="Outfit">
          No recent or suggested searches
        </Text>
      )}
    </Box>
  );
};

export default FilterSearch;
