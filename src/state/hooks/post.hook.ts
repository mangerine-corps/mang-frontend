import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import { selectLikedPosts, selectPosts, selectFollowing } from '../reducers/post.reducer';

// custom hook for accessing post details and liked posts
export const usePosts = () => {
  const likedPosts = useSelector(selectLikedPosts);
  const posts = useSelector(selectPosts);
  const following = useSelector(selectFollowing);
  return useMemo(
    () => ({ likedPosts, posts, following, }), 
    [likedPosts, posts, following,]
  );
};
