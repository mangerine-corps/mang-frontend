import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

// define the API service
export const postsApi = createApi({
  reducerPath: "postsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.API_BASE_URL}/`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).userAuth?.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Post", "User", "comments", "replies", "group"], // tags for cache invalidation
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => "/posts",
      providesTags: ["Post"], // tag for automatic invalidation on mutations
    }),
    getPostsCursor: builder.query<
      { data: { items: any[]; nextCursor: string | null; hasMore: boolean } },
      { cursor?: string; limit?: number }
    >({
      query: ({ cursor, limit } = {}) => ({
        url: `posts/cursor`,
        method: "GET",
        params: { cursor, limit },
      }),
      providesTags: ["Post"],
    }),
    incrementPostViews: builder.query({
      query: (postId) => `posts/${postId}/increment-views`,
      providesTags: (result, error, postId) => [{ type: "Post", id: postId }],
    }),
    getPostById: builder.query({
      query: (postId) => `posts/${postId}`,
      providesTags: (result, error, postId) => [{ type: "Post", id: postId }],
    }),
    getCommentReplies: builder.query({
      query: (credentials) => ({
        url: `posts/get/comment/replies/`,
        method: "GET",
        params: credentials,
      }),
      providesTags: (result, error, postId) => [{ type: "Post", id: postId }],
    }),

    getPostComments: builder.query({
      query: (credentials) => ({
        url: `posts/get/comments/`,
        method: "GET",
        params: credentials,
      }),

      providesTags: ["comments"],
    }),

    createPost: builder.mutation({
      query: (postDetails) => ({
        url: "posts",
        method: "POST",
        body: postDetails,
        formData: true,
      }),
      // invalidatesTags: ["Post"], // invalidate 'post' on creation
    }),

    likePost: builder.mutation({
      query: ({ postId, userId }) => ({
        url: `posts/like`,
        method: "POST",
        body: { postId, userId },
      }),
      // Transform the response to extract the data we need
      transformResponse: (response: any) => {
        if (response?.data) {
          return {
            postId: response.data.postId,
            likeCount: response.data.likeCount,
            isLiked: response.data.isLiked,
            message: response.data.message,
          };
        }
        return response;
      },
      // Invalidate the general posts list to trigger re-fetch
      invalidatesTags: ["Post"],
    }),

    unlikePost: builder.mutation({
      query: ({ postId, userId }) => ({
        url: `posts/unlike`,
        method: "POST",
        body: { postId, userId },
      }),
      // Transform the response to extract the data we need
      transformResponse: (response: any) => {
        if (response?.data) {
          return {
            postId: response.data.postId,
            likeCount: response.data.likeCount,
            unlikeCount: response.data.unlikeCount,
            isLiked: response.data.isLiked,
            isUnliked: response.data.isUnliked,
            message: response.data.message,
          };
        }
        return response;
      },
      // Invalidate the general posts list to trigger re-fetch
      invalidatesTags: ["Post"],
    }),

    reportGroup: builder.mutation({
      query: ({ groupId, userId, reportDetails, reason }) => ({
        url: `community/${groupId}/report`,
        method: "POST",
        body: { userId, groupId, reportDetails, reason },
      }),
      invalidatesTags: (result, error, { groupId }) => [
        { type: "group", id: groupId },
      ],
    }),
    reportPost: builder.mutation({
      query: ({ postId, userId, reportDetails }) => ({
        url: `posts/${postId}/report`,
        method: "POST",
        body: { userId, postId, reportDetails },
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: "Post", id: postId },
      ],
    }),
    reportComment: builder.mutation({
      query: ({ commentId, additionalContext, reportDetails, reportType }) => ({
        url: `posts/comment/report?commentId=${commentId}`,
        method: "POST",
        body: { additionalContext, reportDetails, reportType },
      }),
      invalidatesTags: (result, error, { commentId }) => [
        { type: "Post", id: commentId },
      ],
    }),

    addComment: builder.mutation({
      query: ({ postId, userId, comment }) => ({
        url: `posts/comment`,
        method: "POST",
        body: { postId, userId, comment },
      }),
      invalidatesTags: (result, error, { postId }) => [
        "comments",
        { type: "Post" as const, id: postId },
      ],
    }),

    sharePost: builder.mutation({
      query: (postId) => ({
        url: `posts/${postId}/share`,
        method: "POST",
      }),
      invalidatesTags: (result, error, postId) => [
        { type: "Post", id: postId },
      ],
    }),

    likeComment: builder.mutation({
      query: ({ commentId }) => ({
        url: `posts/comment/${commentId}/like`,
        method: "POST",
        body: { commentId },
      }),
      invalidatesTags: (result, error, { commentId }) => [
        { type: "Post", id: commentId },
      ],
    }),

    unlikeComment: builder.mutation({
      query: ({ commentId, userId }) => ({
        url: `/posts/comment/${commentId}/unlike`,
        method: "POST",
        body: { userId },
      }),
      invalidatesTags: (result, error, { commentId }) => [
        { type: "Post", id: commentId },
      ],
    }),

    deleteComment: builder.mutation({
      query: (commentId) => ({
        url: `posts/comment/${commentId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, commentId) => [
        { type: "Post", id: commentId },
        "Post",
        "comments",
      ],
    }),

    replyToComment: builder.mutation({
      query: ({ commentId, userId, reply }) => ({
        url: `posts/comment/${commentId}/reply`,
        method: "POST",
        body: { commentId, userId, replyContent: reply },
      }),
      invalidatesTags: (result, error, { commentId }) => [
        { type: "Post", id: commentId },
      ],
    }),

    deletePost: builder.mutation({
      query: (postId) => ({
        url: `posts/${postId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: "Post", id: postId },
      ],
    }),
    followUser: builder.mutation<
      {
        isFollowing: boolean;
        followerCount?: number;
        followingCount?: number;
        message?: string;
      },
      { targetUserId: string }
    >({
      query: ({ targetUserId }) => ({
        url: `users/follow`,
        method: "POST",
        body: { targetUserId },
      }),
      transformResponse: (response: any) => {
        const raw = response?.data ?? response;
        return {
          isFollowing: Boolean(raw?.isFollowing ?? true),
          followerCount: raw?.followerCount,
          followingCount: raw?.followingCount,
          message: response?.message ?? raw?.message,
        };
      },
      invalidatesTags: ["User"],
    }),

    // Legacy param-based endpoints (fallback for older backends)
    followUserLegacy: builder.mutation<
      { isFollowing: boolean; message?: string },
      { currentUserId: string; targetUserId: string }
    >({
      query: ({ currentUserId, targetUserId }) => ({
        url: `users/${currentUserId}/follow/${targetUserId}`,
        method: "POST",
      }),
      transformResponse: (response: any) => {
        const raw = response?.data ?? response;
        return {
          isFollowing: true,
          message: response?.message ?? raw?.message,
        };
      },
      invalidatesTags: ["User"],
    }),
    unfollowUserLegacy: builder.mutation<
      { isFollowing: boolean; message?: string },
      { currentUserId: string; targetUserId: string }
    >({
      query: ({ currentUserId, targetUserId }) => ({
        url: `users/${currentUserId}/unfollow/${targetUserId}`,
        method: "DELETE",
      }),
      transformResponse: (response: any) => {
        const raw = response?.data ?? response;
        return {
          isFollowing: false,
          message: response?.message ?? raw?.message,
        };
      },
      invalidatesTags: ["User"],
    }),

    unfollowUser: builder.mutation<
      {
        isFollowing: boolean;
        followerCount?: number;
        followingCount?: number;
        message?: string;
      },
      { targetUserId: string }
    >({
      query: ({ targetUserId }) => ({
        url: `users/unfollow`,
        method: "POST",
        body: { targetUserId },
      }),
      transformResponse: (response: any) => {
        const raw = response?.data ?? response;
        return {
          isFollowing: Boolean(raw?.isFollowing ?? false),
          followerCount: raw?.followerCount,
          followingCount: raw?.followingCount,
          message: response?.message ?? raw?.message,
        };
      },
      invalidatesTags: ["User"],
    }),
    getFollowing: builder.query({
      query: ({targetUserId}) => ({
        url: `users/is-following/${targetUserId}`,
        method: "GET",
        params: {targetUserId},
      }),

      providesTags: ["User"],
    }),

    getMyPostsInGroup: builder.query<
      { data: any[]; meta?: any } | { data?: { data: any[]; meta?: any } },
      { groupId: string; page?: number; limit?: number }
    >({
      query: ({ groupId, page = 1, limit = 10 }) => ({
        url: `posts/group/${groupId}/my-posts`,
        method: "GET",
        params: { page, limit },
      }),
      providesTags: ["Post", "group"],
    }),

    toggleAllowComments: builder.mutation<
      { data: any },
      { postId: string; allow: boolean }
    >({
      query: ({ postId, allow }) => ({
        url: `posts/${postId}/allow-comments`,
        method: "PATCH",
        body: { allow },
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: "Post" as const, id: postId },
        "Post",
      ],
    }),
  }),
});

// export hooks for usage in functional components
export const {
  useGetPostsQuery,
  useGetPostsCursorQuery,
  useLazyGetPostsCursorQuery,
  useGetPostByIdQuery,
  useCreatePostMutation,
  useLikePostMutation,
  useUnlikePostMutation,
  useFollowUserMutation,
  useUnfollowUserMutation,
  useFollowUserLegacyMutation,
  useUnfollowUserLegacyMutation,
  useLikeCommentMutation,
  useUnlikeCommentMutation,
  useIncrementPostViewsQuery,
  useReportCommentMutation,
  useReportPostMutation,
  useAddCommentMutation,
  useSharePostMutation,
  useReplyToCommentMutation,
  useDeletePostMutation,
  useGetCommentRepliesQuery,
  useGetPostCommentsQuery,
  useDeleteCommentMutation,
  useReportGroupMutation,
  useGetMyPostsInGroupQuery,
  useToggleAllowCommentsMutation,
  useGetFollowingQuery,
} = postsApi;
