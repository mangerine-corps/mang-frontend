import { useCallback, useMemo, useState, useEffect } from "react";
import { useAuth } from "mangarine/state/hooks/user.hook";
import {
  useFollowUserMutation,
  useUnfollowUserMutation,
  useGetFollowingQuery,
} from "mangarine/state/services/posts.service";
import { toaster } from "mangarine/components/ui/toaster";

interface UseFollowOptions {
  targetUserId?: string | null;
  // If provided (true/false), skip the API check. If undefined, fall back to API.
  initialIsFollowing?: boolean;
  postIdContext?: string;
}

export const useFollow = ({ targetUserId, initialIsFollowing, postIdContext }: UseFollowOptions) => {
  const { user } = useAuth();
  const [mutateFollow, { isLoading: isFollowLoading }] = useFollowUserMutation();
  const [mutateUnfollow, { isLoading: isUnfollowLoading }] = useUnfollowUserMutation();

  const [isFollowing, setIsFollowing] = useState<boolean>(Boolean(initialIsFollowing));

  const skipApiCheck = initialIsFollowing !== undefined;

  // Only hit API when followStatus is not provided on the object
  const { data } = useGetFollowingQuery(
    { targetUserId },
    { skip: !targetUserId || skipApiCheck }
  );

  useEffect(() => {
    if (!skipApiCheck) {
      const val = data?.data?.isFollowing;
      if (val !== undefined) setIsFollowing(val);
    }
  }, [data, skipApiCheck]);

  useEffect(() => {
    if (initialIsFollowing !== undefined) setIsFollowing(Boolean(initialIsFollowing));
  }, [initialIsFollowing]);

  const canFollow = useMemo(
    () => Boolean(user?.id) && Boolean(targetUserId) && user?.id !== targetUserId,
    [user?.id, targetUserId]
  );

  const label = isFollowing ? "Unfollow" : "Follow";

  const toggleFollow = useCallback(async () => {
    if (!canFollow) return;

    const prev = isFollowing;
    setIsFollowing(!prev); // optimistic

    try {
      const result = prev
        ? await mutateUnfollow({ targetUserId: targetUserId! }).unwrap()
        : await mutateFollow({ targetUserId: targetUserId! }).unwrap();

      const nextState = (result as any)?.data?.isFollowing ?? result?.isFollowing;
      if (nextState !== undefined) setIsFollowing(Boolean(nextState));

      toaster.create({
        description: !prev ? "User followed successfully" : "User unfollowed successfully",
        type: !prev ? "success" : "info",
        closable: true,
      });
    } catch {
      setIsFollowing(prev); // rollback
      toaster.create({ description: "Failed to update follow state", type: "error", closable: true });
    }
  }, [canFollow, isFollowing, targetUserId, mutateFollow, mutateUnfollow]);

  return { isFollowing, isLoading: isFollowLoading || isUnfollowLoading, label, toggleFollow, canFollow };
};
