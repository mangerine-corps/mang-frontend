import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { toaster } from "mangarine/components/ui/toaster";
import { useAuth } from "mangarine/state/hooks/user.hook";
import {
  useFollowUserMutation,
  useUnfollowUserMutation,
  useFollowUserLegacyMutation,
  useUnfollowUserLegacyMutation,
  useGetFollowingQuery,
} from "mangarine/state/services/posts.service";
import {
  followCreator,
  unfollowCreator,
} from "mangarine/state/reducers/post.reducer";

interface UseFollowOptions {
  // Target user to follow/unfollow
  targetUserId?: string | null;
  // Optional initial state if known from server
  initialIsFollowing?: boolean;
  // Optional postId context for reducers that expect it
  postIdContext?: string;
}

export const useFollow = ({
  targetUserId,
  initialIsFollowing = false,
  postIdContext,
}: UseFollowOptions) => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [mutateFollow, { isLoading: isFollowLoading }] =
    useFollowUserMutation();
  const [mutateUnfollow, { isLoading: isUnfollowLoading }] =
    useUnfollowUserMutation();
  const [isFollowing, setIsFollowing] = useState<boolean>(
    Boolean(initialIsFollowing)
  );
  const [followLegacy] = useFollowUserLegacyMutation();
  const [unfollowLegacy] = useUnfollowUserLegacyMutation();
  const { data, error , refetch} = useGetFollowingQuery(
    { targetUserId },
    {
      skip: !targetUserId,
    }
  );

  const canFollow = useMemo(
    () =>
      Boolean(user?.id) && Boolean(targetUserId) && user?.id !== targetUserId,
    [user?.id, targetUserId]
  );
  // console.log(data?.data.isFollowing, error, targetUserId, "isfollo")
  const label = isFollowing ? "Unfollow" : "Follow";
  const isFollow = data?.data.isFollowing;
  useEffect(() => {
    if (isFollow !== undefined) {
      setIsFollowing(isFollow);
    }
  }, [isFollow]);

  const toggleFollow = useCallback(async () => {
    if (!canFollow) return;

    try {
      const mode = (
        process.env.NEXT_PUBLIC_FOLLOW_API_MODE || "auto"
      ).toLowerCase();
      let result: any;

      if (mode === "legacy") {
        // Use only legacy routes
        result = isFollowing
          ? await unfollowLegacy({
              currentUserId: user!.id,
              targetUserId: targetUserId!,
            }).unwrap()
          : await followLegacy({
              currentUserId: user!.id,
              targetUserId: targetUserId!,
            }).unwrap();
      } else if (mode === "generic") {
        // Use only generic routes
        result = isFollowing
          ? await mutateUnfollow({ targetUserId: targetUserId! }).unwrap()
          : await mutateFollow({ targetUserId: targetUserId! }).unwrap();

    await refetch();
      } else {
        // Auto: try generic then fallback to legacy on 404
        try {
          result = isFollowing
            ? await mutateUnfollow({ targetUserId: targetUserId! }).unwrap()
            : await mutateFollow({ targetUserId: targetUserId! }).unwrap();
        } catch (err: any) {
          const status =
            err?.status || err?.originalStatus || err?.data?.statusCode;
          if (status === 404 && user?.id) {
            result = isFollowing
              ? await unfollowLegacy({
                  currentUserId: user.id,
                  targetUserId: targetUserId!,
                }).unwrap()
              : await followLegacy({
                  currentUserId: user.id,
                  targetUserId: targetUserId!,
                }).unwrap();
          } else {
            throw err;
          }
        }
      }

      const { isFollowing: nextState, message } = result?.data ?? result ?? {};

      setIsFollowing(Boolean(nextState));

      if (postIdContext && targetUserId) {
        if (nextState) {
          dispatch(
            followCreator({ postId: postIdContext, creatorId: targetUserId })
          );
        } else {
          dispatch(
            unfollowCreator({ postId: postIdContext, creatorId: targetUserId })
          );
        }
      }

      toaster.create({
        description:
          message ||
          (nextState
            ? "User followed successfully"
            : "User unfollowed successfully"),
        type: nextState ? "success" : "info",
        closable: true,
      });
    } catch (error) {
      toaster.create({
        description: "Failed to update follow state",
        type: "error",
        closable: true,
      });
    }
  }, [canFollow, user, targetUserId, mutateFollow, dispatch, postIdContext]);

  return {
    isFollowing,
    isLoading: isFollowLoading || isUnfollowLoading,
    label,
    toggleFollow,
    canFollow,
  };
};
