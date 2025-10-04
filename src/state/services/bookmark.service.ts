import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

export const BookmarkApi = createApi({
  reducerPath: "BookmarkApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.API_BASE_URL}/bookmarks`,
    prepareHeaders: (headers, { getState }) => {
      // By default, if we have a token in the store, let's use that for authenticated requests
      const token =
        (getState() as RootState).userAuth.token ??
        (getState() as RootState).userAuth.preAuth.token;

      headers.set("type", "customer");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  tagTypes: ['collections','bookmarks'],

  endpoints: (builder) => ({
    addToBookmark: builder.mutation({
      query: (credentials) => ({
        url: "add",
        method: "POST",
        body: credentials,
        formData: true,
      }),
      invalidatesTags: ['bookmarks']
    }),
    removeFromBookmark: builder.mutation({
      query: (credentials) => ({
        url: "/remove",
        method: "POST",
        body: credentials,
        formData: true,
      }),
      invalidatesTags: ['bookmarks']
    }),
    getBookmarks: builder.query({
      query: () => ({
        url: "all",
      }),
      providesTags: ['bookmarks']
    }),
    createCollection: builder.mutation({
      query: (credentials) => ({
        url: "collection/create",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ['collections']
    }),
    getCollection: builder.query({
      query: () => ({
        url: "collections",
      }),
      providesTags: ['collections']
    }),
    getCollectionPost: builder.query({
      query: (id) => ({
        url: `collection/posts/${id}`,
      }),
    }),
    addPostToCollection: builder.mutation({
      query: (credentials) => ({
        url: "collection/add",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ['collections']
    }),
    removePostFromCollection: builder.mutation({
      query: (credentials) => ({
        url: "collection/remove",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ['collections']
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
 useAddToBookmarkMutation,
 useRemoveFromBookmarkMutation,
 useGetBookmarksQuery,
 useCreateCollectionMutation,
 useGetCollectionQuery,
 useGetCollectionPostQuery,
 useAddPostToCollectionMutation,
 useRemovePostFromCollectionMutation,
} = BookmarkApi;
