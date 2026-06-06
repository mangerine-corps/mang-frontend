import { Avatar, Box, Button, HStack, Spinner, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import TopRightDrawer from "mangarine/components/ui/top-right-drawer";
import { useGetFollowersListQuery, useGetFollowingListQuery } from "mangarine/state/services/profile.service";
import { useFollowUserMutation, useUnfollowUserMutation } from "mangarine/state/services/posts.service";

interface Props {
  open: boolean;
  onClose: () => void;
  type: "followers" | "following";
  profileId: string;
  count?: number;
}

const normalizeList = (data: any): any[] => {
  const arr = data?.data ?? data;
  return Array.isArray(arr) ? arr : [];
};

const FollowListItem = ({
  item,
  isFollowingInitial,
  onNavigate,
}: {
  item: any;
  isFollowingInitial: boolean;
  onNavigate?: () => void;
}) => {
  const [localFollowing, setLocalFollowing] = useState<boolean>(isFollowingInitial);
  const [followUser, { isLoading: following }] = useFollowUserMutation();
  const [unfollowUser, { isLoading: unfollowing }] = useUnfollowUserMutation();
  const isLoading = following || unfollowing;
  const router = useRouter();

  useEffect(() => {
    setLocalFollowing(isFollowingInitial);
  }, [isFollowingInitial]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const id = item?.id ?? item?._id;
    if (!id) return;

    const prev = localFollowing;
    setLocalFollowing(!prev); // optimistic

    const mutation = prev
      ? unfollowUser({ targetUserId: id })
      : followUser({ targetUserId: id });

    mutation.unwrap().then((res) => {
      const next = (res as any)?.data?.isFollowing ?? res?.isFollowing ?? !prev;
      setLocalFollowing(Boolean(next));
    }).catch(() => {
      setLocalFollowing(prev); // rollback
    });
  };

  const goToProfile = () => {
    const id = item?.id ?? item?._id;
    if (!id) return;
    onNavigate?.();
    router.push(`/profile/${id}`);
  };

  return (
    <HStack w="full" justifyContent="space-between" py={3}>
      <HStack
        gap={3}
        flex={1}
        minW={0}
        cursor="pointer"
        onClick={goToProfile}
        _hover={{ opacity: 0.8 }}
      >
        <Avatar.Root boxSize="40px" flexShrink={0}>
          <Avatar.Fallback name={item?.fullName} />
          <Avatar.Image src={item?.profilePics} />
        </Avatar.Root>
        <VStack alignItems="flex-start" gap={0} flex={1} minW={0}>
          <Text fontWeight="600" fontSize="0.9rem" color="text_primary" lineClamp={1}>
            {item?.fullName}
          </Text>
          {item?.occupation && (
            <Text fontSize="0.75rem" color="gray.500" lineClamp={1}>
              {item?.occupation}
            </Text>
          )}
        </VStack>
      </HStack>

      <Button
        size="sm"
        px={4}
        borderRadius="8px"
        onClick={handleToggle}
        disabled={isLoading}
        bg="transparent"
        color={localFollowing ? "red.500" : "primary.950"}
        borderWidth="2px"
        borderColor={localFollowing ? "red.400" : "primary.950"}
        flexShrink={0}
      >
        {isLoading ? <Spinner size="xs" /> : localFollowing ? "Unfollow" : "Follow +"}
      </Button>
    </HStack>
  );
};

const FollowersFollowingDrawer = ({ open, onClose, type, profileId, count }: Props) => {
  const isFollowers = type === "followers";

  const { data: followersData, isFetching: loadingFollowers } = useGetFollowersListQuery(
    { profileId },
    { skip: !open || !profileId }
  );
  const { data: followingData, isFetching: loadingFollowing } = useGetFollowingListQuery(
    { profileId },
    { skip: !open || !profileId }
  );

  const followersList = normalizeList(followersData);
  const followingList = normalizeList(followingData);

  // Build a set of IDs the current user is following for cross-reference
  const followingIds = new Set<string>(
    followingList.map((u: any) => u?.id ?? u?._id).filter(Boolean)
  );

  const list = isFollowers ? followersList : followingList;
  const isLoading = isFollowers ? loadingFollowers : loadingFollowing;

  const title = `${isFollowers ? "Followers" : "Following"}${count !== undefined ? ` (${count})` : ""}`;

  return (
    <TopRightDrawer open={open} onOpenChange={onClose} title={title}>
      {isLoading ? (
        <VStack py={8} w="full">
          <Spinner color="text_primary" />
        </VStack>
      ) : list.length === 0 ? (
        <VStack py={8} w="full">
          <Text color="grey.500" fontSize="0.875rem">
            No {isFollowers ? "followers" : "following"} yet
          </Text>
        </VStack>
      ) : (
        <VStack w="full" gap={0}>
          {list.map((item, i) => {
            const id = item?.id ?? item?._id;
            // Prefer followStatus from the item object; fallback to cross-referencing the following list
            const isFollowingInitial =
              item?.followStatus != null
                ? item.followStatus.isFollowing
                : isFollowers
                  ? followingIds.has(id)
                  : true;
            return (
              <Box key={id ?? i} w="full" borderBottomWidth="1px" borderColor="input_border">
                <FollowListItem
                  item={item}
                  isFollowingInitial={isFollowingInitial}
                  onNavigate={onClose}
                />
              </Box>
            );
          })}
        </VStack>
      )}
    </TopRightDrawer>
  );
};

export default FollowersFollowingDrawer;
