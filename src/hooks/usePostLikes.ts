import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLikePostMutation, useUnlikePostMutation } from 'mangarine/state/services/posts.service';
import {
  updateSinglePost,
  handleLikeSuccess,
  handleUnlikeSuccess,
  LikeOperationResponse
} from 'mangarine/state/reducers/post.reducer';
import { Post } from 'mangarine/state/reducers/post.reducer';

interface UsePostLikesProps {
  post: Post;
  userId: string;
  posts: Post[];
}

export const usePostLikes = ({ post, userId, posts }: UsePostLikesProps) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [likePost] = useLikePostMutation();
  const [unlikePost] = useUnlikePostMutation();

  // Use the like status that comes with the post from the initial fetch
  const currentIsLiked = post.isLiked ?? false;
  const currentLikeCount = post.likeCount ?? 0;
  const currentIsUnliked = post.isUnliked ?? false;

  // Handler for liking/unliking a post
  const handleLikeClick = useCallback(async () => {
    if (!userId || !post.id) {
      setError('User ID or Post ID is not defined');
      return;
    }

    console.log('Like button clicked!', {
      postId: post.id,
      currentIsLiked,
      currentLikeCount,
      userId
    });

    setIsLoading(true);
    setError(null);

    // Store the current state for potential rollback
    const currentPost = posts.find(p => p.id === post.id);
    if (!currentPost) {
      setError('Post not found for like operation');
      setIsLoading(false);
      return;
    }

    // Simple toggle logic: if liked, unlike; if not liked, like
    const willLike = !currentIsLiked;
    const newLikeCount = willLike ? currentLikeCount + 1 : Math.max(currentLikeCount - 1, 0);

    console.log('Performing like operation:', {
      currentLikeCount,
      newLikeCount,
      currentIsLiked,
      willLike
    });

    // Optimistic update for immediate feedback
    dispatch(updateSinglePost({
      postId: post.id,
      updates: {
        likeCount: newLikeCount,
        isLiked: willLike
      }
    }));

    // Small delay to make optimistic update smoother
    await new Promise(resolve => setTimeout(resolve, 50));

    try {
      let response: LikeOperationResponse;

      // Simple like/unlike toggle
      if (currentIsLiked) {
        // Post is already liked, so unlike it
        console.log('Unliking post (toggle off):', post.id);
        response = await likePost({ postId: post.id, userId }).unwrap();
        dispatch(handleLikeSuccess(response));
      } else {
        // Post is not liked, so like it
        console.log('Liking post:', post.id);
        response = await likePost({ postId: post.id, userId }).unwrap();
        dispatch(handleLikeSuccess(response));
      }

      console.log('Like operation successful:', response);

      // Success - clear any previous errors
      setError(null);
      console.log('Like operation completed successfully:', response.message);
      
    } catch (error: any) {
      console.error('Like operation failed:', error);

      // Revert optimistic update on error
      dispatch(updateSinglePost({
        postId: post.id,
        updates: {
          likeCount: currentLikeCount,
          isLiked: currentIsLiked
        }
      }));

      // Set error message
      const errorMessage = error?.data?.message || error?.message || 'Like operation failed. Please try again.';
      setError(errorMessage);
      console.error('Error details:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [post.id, userId, posts, dispatch, likePost, currentIsLiked, currentLikeCount]);

  // Separate handler for unliking a post
  const handleUnlikeClick = useCallback(async () => {
    if (!userId || !post.id) {
      setError('User ID or Post ID is not defined');
      return;
    }

    console.log('Unlike button clicked!', {
      postId: post.id,
      currentIsUnliked,
      currentUnlikeCount: post.unlikeCount || 0,
      userId
    });

    setIsLoading(true);
    setError(null);

    // Store the current state for potential rollback
    const currentPost = posts.find(p => p.id === post.id);
    if (!currentPost) {
      setError('Post not found for unlike operation');
      setIsLoading(false);
      return;
    }

    // Simple toggle logic: if unliked, remove unlike; if not unliked, add unlike
    const willUnlike = !currentIsUnliked;
    const newUnlikeCount = willUnlike ? (post.unlikeCount || 0) + 1 : Math.max((post.unlikeCount || 0) - 1, 0);

    console.log('Performing unlike operation:', {
      currentUnlikeCount: post.unlikeCount || 0,
      newUnlikeCount,
      currentIsUnliked,
      willUnlike
    });

    // Optimistic update for immediate feedback
    dispatch(updateSinglePost({
      postId: post.id,
      updates: {
        unlikeCount: newUnlikeCount,
        isUnliked: willUnlike
      }
    }));

    // Small delay to make optimistic update smoother
    await new Promise(resolve => setTimeout(resolve, 50));

    try {
      let response: LikeOperationResponse;

      // Simple unlike toggle
      if (currentIsUnliked) {
        // Post is already unliked, so remove the unlike (toggle off)
        console.log('Removing unlike (toggle off):', post.id);
        response = await unlikePost({ postId: post.id, userId }).unwrap();
        dispatch(handleUnlikeSuccess(response));
      } else {
        // Post is not unliked, so add unlike
        console.log('Adding unlike to post:', post.id);
        response = await unlikePost({ postId: post.id, userId }).unwrap();
        dispatch(handleUnlikeSuccess(response));
      }

      console.log('Unlike operation successful:', response);

      // Success - clear any previous errors
      setError(null);
      console.log('Unlike operation completed successfully:', response.message);
      
    } catch (error: any) {
      console.error('Unlike operation failed:', error);

      // Revert optimistic update on error
      dispatch(updateSinglePost({
        postId: post.id,
        updates: {
          unlikeCount: post.unlikeCount || 0,
          isUnliked: currentIsUnliked
        }
      }));

      // Set error message
      const errorMessage = error?.data?.message || error?.message || 'Unlike operation failed. Please try again.';
      setError(errorMessage);
      console.error('Error details:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [post.id, userId, posts, dispatch, unlikePost, currentIsUnliked, post.unlikeCount]);

  // Update post like status from backend response
  const updateLikeStatus = useCallback((likeStatus: LikeOperationResponse) => {
    dispatch(handleLikeSuccess(likeStatus));
  }, [dispatch]);

  return {
    isLoading,
    error,
    handleLikeClick,
    handleUnlikeClick,
    likeCount: post.likeCount || 0,
    unlikeCount: post.unlikeCount || 0,
    isLiked: post.isLiked || false,
    isUnliked: post.isUnliked || false
  };
};
