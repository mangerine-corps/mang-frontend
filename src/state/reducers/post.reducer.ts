import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { isEmpty } from "es-toolkit/compat";

// Post interface
export interface Post {
  id: string;
  content: string;
  images: string[];
  video?: string;
  creator: {
    id: string;
    fullName: string;
    businessName?: string;
    profilePics: string;
  };
  createdAt: string;
  likeCount: number;
  likes: [];
  reportCount?: number;
  commentCount: number;
  // Interaction toggles
  allowComments?: boolean;
  allowLikes?: boolean;
  views?: number;
  shareCount: number;
  isLiked?: boolean;
  unlikeCount?: number;
  isFollowingCreator?: boolean;
  isUnliked?: boolean;
  // New fields for better like handling
  likeStatus?: {
    isLiked: boolean;
    likeCount: number;
    lastUpdated: string;
  };
}

// New interface for like operation responses
export interface LikeOperationResponse {
  postId: string;
  likeCount: number;
  unlikeCount?: number;
  isLiked: boolean;
  isUnliked?: boolean;
  message: string;
}

interface PostState {
  posts: Post[];
  selectedPost: Post | null;
  likedPosts: string[];
  reports: Record<string, any>;
  comments: Record<string, any>;
  followers: Record<string, any>;
  following: any[];
  // Track optimistic updates to preserve them during cache invalidation
  optimisticUpdates: Record<
    string,
    {
      likeCount: number;
      unlikeCount: number;
      isLiked: boolean;
      isUnliked: boolean;
    }
  >;
}

// Initial state
const initialState: PostState = {
  posts: [],
  selectedPost: null,
  likedPosts: [],
  reports: {},
  comments: {},
  followers: {},
  following: [],
  optimisticUpdates: {},
};

// Create the slice
const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    // Initialize optimisticUpdates if it doesn't exist (for rehydration safety)
    initializeOptimisticUpdates: (state) => {
      if (!state.optimisticUpdates) {
        state.optimisticUpdates = {};
      }
    },

    // Increment comment count for a post
    incrementCommentCount: (
      state,
      { payload: { postId } }: PayloadAction<{ postId: string }>
    ) => {
      const postIndex = state.posts.findIndex((p) => p.id === postId);
      if (postIndex !== -1) {
        const current = state.posts[postIndex];
        state.posts[postIndex] = {
          ...current,
          commentCount: (current.commentCount || 0) + 1,
        };
      }
    },
    addPost: (state, { payload: { post } }: PayloadAction<{ post: any }>) => {
      // Ensure optimisticUpdates is initialized
      if (!state.optimisticUpdates) {
        state.optimisticUpdates = {};
      }

      // Insert new post at the beginning without reversing the entire array
      state.posts = isEmpty(state.posts) ? [post] : [post, ...state.posts];
    },
    setPosts: (
      state,
      { payload: { posts } }: PayloadAction<{ posts: Post[] }>
    ) => {
      // Ensure optimisticUpdates object exists
      if (!state.optimisticUpdates) {
        state.optimisticUpdates = {};
      }

      // Initialize like status for posts if not already set
      const postsWithLikeStatus = posts.map((post) => {
        // If isLiked is undefined, set it to false as default
        if (post.isLiked === undefined) {
          return {
            ...post,
            isLiked: false,
          };
        }
        return post;
      });

      // Apply any pending optimistic updates to the re-fetched posts and preserve non-decreasing fields (e.g., views)
      const postsWithOptimisticUpdates = postsWithLikeStatus.map((incoming) => {
        let merged: Post = { ...incoming } as any;

        // Preserve the highest view count so it never decrements on navigation
        const existing = state.posts.find((p) => p.id === incoming.id);
        if (existing && typeof existing.views === 'number') {
          const incomingViews = (incoming as any).views ?? 0;
          merged = { ...merged, views: Math.max(existing.views || 0, incomingViews || 0) } as any;
        }

        // Double-check that optimisticUpdates exists and has the post
        if (state.optimisticUpdates && state.optimisticUpdates[incoming.id]) {
          const optimisticUpdate = state.optimisticUpdates[incoming.id];
          merged = {
            ...merged,
            likeCount: optimisticUpdate.likeCount,
            unlikeCount: optimisticUpdate.unlikeCount || incoming.unlikeCount || 0,
            isLiked: optimisticUpdate.isLiked,
            isUnliked: optimisticUpdate.isUnliked || incoming.isUnliked || false,
          } as any;
        }
        return merged;
      });

      // Sort posts newest-first by createdAt to ensure latest posts appear first
      state.posts = postsWithOptimisticUpdates.slice().sort((a, b) => {
        const aTime = new Date(a.createdAt).getTime();
        const bTime = new Date(b.createdAt).getTime();
        return bTime - aTime;
      });
    },
    setSelectedPost: (state, action: PayloadAction<Post | null>) => {
      state.selectedPost = action.payload;
    },
    setLikedPosts: (state, action: PayloadAction<string[]>) => {
      state.likedPosts = action.payload;
    },
    likePost: (state, action: PayloadAction<string>) => {
      if (!state.likedPosts.includes(action.payload)) {
        state.likedPosts.push(action.payload);
      }
    },
    incrementPostLike: (state, { payload: { postId, isLiked } }) => {
      state.posts = state.posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            isLiked: !isLiked, // Ensure final state is updated based on response
            isLikeLoading: false,
          };
        }
        return post;
      });
    },
    decrementPostLike: (state, { payload: { postId, isLiked } }) => {
      state.posts = state.posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            isLiked: !isLiked, // Ensure final state is updated based on response
            isLikeLoading: false,
          };
        }
        return post;
      });
    },
    // Optimistic update for like count and status without affecting order
    optimisticLikeUpdate: (state, { payload: { postId, isLiked } }) => {
      // Ensure optimisticUpdates object exists
      if (!state.optimisticUpdates) {
        state.optimisticUpdates = {};
      }

      const postIndex = state.posts.findIndex((p) => p.id === postId);
      if (postIndex !== -1) {
        const post = state.posts[postIndex];
        const newLikeCount = isLiked ? post.likeCount - 1 : post.likeCount + 1;
        const newIsLiked = !isLiked;

        // Create new post object instead of mutating
        state.posts[postIndex] = {
          ...post,
          likeCount: newLikeCount,
          isLiked: newIsLiked,
        };

        // Store the optimistic update to preserve it during cache invalidation
        state.optimisticUpdates[postId] = {
          likeCount: newLikeCount,
          unlikeCount: post.unlikeCount || 0, // Preserve existing unlikeCount
          isLiked: newIsLiked,
          isUnliked: post.isUnliked || false, // Preserve existing isUnliked
        };
      }
    },
    // Optimistic update for like count and status without affecting order
    optimisticUnlikeUpdate: (state, { payload: { postId, isLiked } }) => {
      // Ensure optimisticUpdates object exists
      if (!state.optimisticUpdates) {
        state.optimisticUpdates = {};
      }

      const postIndex = state.posts.findIndex((p) => p.id === postId);
      if (postIndex !== -1) {
        const post = state.posts[postIndex];
        const newLikeCount = isLiked ? post.likeCount - 1 : post.likeCount + 1;
        const newIsLiked = !isLiked;

        // Create new post object instead of mutating
        state.posts[postIndex] = {
          ...post,
          likeCount: newLikeCount,
          isLiked: newIsLiked,
        };

        // Store the optimistic update to preserve it during cache invalidation
        state.optimisticUpdates[postId] = {
          likeCount: newLikeCount,
          unlikeCount: post.unlikeCount || 0, // Preserve existing unlikeCount
          isLiked: newIsLiked,
          isUnliked: post.isUnliked || false, // Preserve existing isUnliked
        };
      }
    },
    // Clear optimistic updates for a specific post (called after successful API response)
    clearOptimisticUpdate: (
      state,
      { payload: { postId } }: PayloadAction<{ postId: string }>
    ) => {
      // Ensure optimisticUpdates object exists before trying to delete
      if (state.optimisticUpdates && state.optimisticUpdates[postId]) {
        delete state.optimisticUpdates[postId];
      }
    },
    // Update a single post without affecting the order of other posts
    updateSinglePost: (
      state,
      {
        payload: { postId, updates },
      }: PayloadAction<{
        postId: string;
        updates: Partial<Post>;
      }>
    ) => {
      const postIndex = state.posts.findIndex((p) => p.id === postId);
      if (postIndex !== -1) {
        state.posts[postIndex] = {
          ...state.posts[postIndex],
          ...updates,
        };

        // Also update the optimisticUpdates to preserve state during refetches
        if (state.optimisticUpdates && state.optimisticUpdates[postId]) {
          state.optimisticUpdates[postId] = {
            ...state.optimisticUpdates[postId],
            ...updates,
          };
        }
      }
    },

    // Handle successful like operation response from backend
    handleLikeSuccess: (
      state,
      { payload }: PayloadAction<LikeOperationResponse>
    ) => {
      const postIndex = state.posts.findIndex((p) => p.id === payload.postId);
      if (postIndex !== -1) {
        const currentPost = state.posts[postIndex];

        // Only update if the response differs from current state to prevent flickering
        const needsUpdate =
          currentPost.likeCount !== payload.likeCount ||
          currentPost.unlikeCount !== (payload.unlikeCount || 0) ||
          currentPost.isLiked !== payload.isLiked ||
          currentPost.isUnliked !== (payload.isUnliked || false);

        if (needsUpdate) {
          state.posts[postIndex] = {
            ...currentPost,
            likeCount: payload.likeCount,
            unlikeCount: payload.unlikeCount || 0,
            isLiked: payload.isLiked,
            isUnliked: payload.isUnliked || false,
            likeStatus: {
              isLiked: payload.isLiked,
              likeCount: payload.likeCount,
              lastUpdated: new Date().toISOString(),
            },
          };

          // Clear optimistic update for this post
          if (
            state.optimisticUpdates &&
            state.optimisticUpdates[payload.postId]
          ) {
            delete state.optimisticUpdates[payload.postId];
          }
        }
      }
    },

    // Handle successful unlike operation response from backend
    handleUnlikeSuccess: (
      state,
      { payload }: PayloadAction<LikeOperationResponse>
    ) => {
      const postIndex = state.posts.findIndex((p) => p.id === payload.postId);
      if (postIndex !== -1) {
        const currentPost = state.posts[postIndex];

        // Only update if the response differs from current state to prevent flickering
        const needsUpdate =
          currentPost.likeCount !== payload.likeCount ||
          currentPost.unlikeCount !== (payload.unlikeCount || 0) ||
          currentPost.isLiked !== payload.isLiked ||
          currentPost.isUnliked !== (payload.isUnliked || false);

        if (needsUpdate) {
          state.posts[postIndex] = {
            ...currentPost,
            likeCount: payload.likeCount,
            unlikeCount: payload.unlikeCount || 0,
            isLiked: payload.isLiked,
            isUnliked: payload.isUnliked || false,
            likeStatus: {
              isLiked: payload.isLiked,
              likeCount: payload.likeCount,
              lastUpdated: new Date().toISOString(),
            },
          };

          // Clear optimistic update for this post
          if (
            state.optimisticUpdates &&
            state.optimisticUpdates[payload.postId]
          ) {
            delete state.optimisticUpdates[payload.postId];
          }
        }
      }
    },

    // Update post like status from backend check
    updatePostLikeStatus: (
      state,
      { payload }: PayloadAction<LikeOperationResponse>
    ) => {
      const postIndex = state.posts.findIndex((p) => p.id === payload.postId);
      if (postIndex !== -1) {
        state.posts[postIndex] = {
          ...state.posts[postIndex],
          likeCount: payload.likeCount,
          isLiked: payload.isLiked,
          likeStatus: {
            isLiked: payload.isLiked,
            likeCount: payload.likeCount,
            lastUpdated: new Date().toISOString(),
          },
        };
      }
    },

    // Initialize like status for a specific post
    initializePostLikeStatus: (
      state,
      {
        payload: { postId, isLiked, likeCount, unlikeCount, isUnliked },
      }: PayloadAction<{
        postId: string;
        isLiked: boolean;
        likeCount: number;
        unlikeCount?: number;
        isUnliked?: boolean;
      }>
    ) => {
      const postIndex = state.posts.findIndex((p) => p.id === postId);
      if (postIndex !== -1) {
        state.posts[postIndex] = {
          ...state.posts[postIndex],
          isLiked: isLiked,
          likeCount: likeCount,
          unlikeCount: unlikeCount || 0,
          isUnliked: isUnliked || false,
        };
      }
    },
    unlikePost: (state, action: PayloadAction<string>) => {
      state.likedPosts = state.likedPosts.filter((id) => id !== action.payload);
    },
    reportPost: (
      state,
      action: PayloadAction<{ postId: string; reportDetails: any }>
    ) => {
      state.reports[action.payload.postId] = action.payload.reportDetails;
    },
    commentOnPost: (
      state,
      action: PayloadAction<{ postId: number; comment: any }>
    ) => {
      if (!state.comments[action.payload.postId]) {
        state.comments[action.payload.postId] = [];
      }
      state.comments[action.payload.postId].push(action.payload.comment);
    },
    deleteCommentOnPost: (
      state,
      action: PayloadAction<{ postId: string; commentId: number }>
    ) => {
      const { postId, commentId } = action.payload;
      if (state.comments[postId]) {
        state.comments[postId] = state.comments[postId].filter(
          (c) => c.id !== commentId
        );
      }
    },

    likeComment: (
      state,
      action: PayloadAction<{ postId: string; commentId: string }>
    ) => {
      const postComments = state.comments[action.payload.postId];
      if (postComments) {
        const comment = postComments.find(
          (c: { id: string }) => c.id === action.payload.commentId
        );
        if (comment) {
          comment.likes = (comment.likes || 0) + 1;
        }
      }
    },
    unlikeComment: (
      state,
      action: PayloadAction<{ postId: string; commentId: string }>
    ) => {
      const postComments = state.comments[action.payload.postId];
      if (postComments) {
        const comment = postComments.find(
          (c: { id: string }) => c.id === action.payload.commentId
        );
        if (comment) {
          comment.likes = (comment.likes || 0) - 1;
        }
      }
    },
    replyToComment: (
      state,
      action: PayloadAction<{ postId: string; commentId: string; reply: any }>
    ) => {
      const postComments = state.comments[action.payload.postId];
      if (postComments) {
        const comment = postComments.find(
          (c: { id: string }) => c.id === action.payload.commentId
        );
        if (comment) {
          comment.replies = comment.replies || [];
          comment.replies.push(action.payload.reply);
        }
      }
    },
    followCreator: (
      state,
      action: PayloadAction<{ postId: string; creatorId: string }>
    ) => {
      if (!state.followers[action.payload.creatorId]) {
        state.followers[action.payload.creatorId] = [];
      }
      state.followers[action.payload.creatorId].push(action.payload.postId);
    },
    unfollowCreator: (
      state,
      action: PayloadAction<{ postId: string; creatorId: string }>
    ) => {
      const followers = state.followers[action.payload.creatorId];
      if (followers) {
        state.followers[action.payload.creatorId] = followers.filter(
          (id: string) => id !== action.payload.postId
        );
      }
    },
    addFollowing: (state, action: PayloadAction<any[]>) => {
      state.following = action.payload;
    },
    deletePost: (state, action: PayloadAction<string>) => {
      // Ensure optimisticUpdates is initialized
      if (!state.optimisticUpdates) {
        state.optimisticUpdates = {};
      }

      // Clean up any optimistic updates for the deleted post
      if (state.optimisticUpdates[action.payload]) {
        delete state.optimisticUpdates[action.payload];
      }

      state.posts = state.posts.filter((post) => post.id !== action.payload);
    },
  },
});

export const {
  incrementCommentCount,
  addPost,
  setPosts,
  setSelectedPost,
  setLikedPosts,
  likePost,
  unlikePost,
  reportPost,
  commentOnPost,
  likeComment,
  unlikeComment,
  replyToComment,
  followCreator,
  unfollowCreator,
  addFollowing,
  deletePost,
  deleteCommentOnPost,
  incrementPostLike,
  decrementPostLike,
  optimisticLikeUpdate,
  optimisticUnlikeUpdate,
  clearOptimisticUpdate,
  initializeOptimisticUpdates,
  updateSinglePost,
  handleLikeSuccess,
  handleUnlikeSuccess,
  updatePostLikeStatus,
  initializePostLikeStatus,
} = postSlice.actions;

export default postSlice.reducer;

export const selectSelectedPost = (state: RootState) =>
  state.posts.selectedPost;
export const selectPosts = (state: RootState) => state.posts.posts;
export const selectLikedPosts = (state: RootState) => state.posts.likedPosts;
export const selectReports = (state: RootState) => state.posts.reports;
export const selectComments = (state: RootState) => state.posts.comments;
export const selectFollowers = (state: RootState) => state.posts.followers;
export const selectFollowing = (state: RootState) => state.posts.following;
