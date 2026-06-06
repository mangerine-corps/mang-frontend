import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axios-base-query";

export const searchApi = createApi({
  reducerPath: "searchApi",
  baseQuery: axiosBaseQuery({
    baseUrl: `${process.env.API_BASE_URL}/search`,
  }),
  tagTypes: ["RecentSearch"],
  endpoints: (builder) => ({
    getRecentSearches: builder.query<any, void>({
      query: () => ({ url: "/recent", method: "GET" }),
      providesTags: ["RecentSearch"],
    }),
    getSuggestedSearches: builder.query<any, void>({
      query: () => ({ url: "/suggested", method: "GET" }),
    }),
    saveRecentSearch: builder.mutation<any, { query: string; type: "user" | "consultant"; targetId: string }>({
      query: (body) => ({ url: "/recent", method: "POST", body }),
      invalidatesTags: ["RecentSearch"],
    }),
    removeRecentSearch: builder.mutation<any, string>({
      query: (id) => ({ url: `/recent/${id}`, method: "DELETE" }),
      invalidatesTags: ["RecentSearch"],
    }),
    searchAll: builder.query<any, { query: string; page?: number; limit?: number }>({
      query: ({ query, page = 1, limit = 10 }) => ({
        url: "/all",
        method: "GET",
        params: { query, page, limit },
      }),
    }),
    searchPosts: builder.query<any, { query: string; page?: number; limit?: number; sortBy?: string }>({
      query: ({ query, page = 1, limit = 10, sortBy }) => ({
        url: "/posts",
        method: "GET",
        params: { query, page, limit, ...(sortBy ? { sortBy } : {}) },
      }),
    }),
    searchPeople: builder.query<any, { query: string; page?: number; limit?: number }>({
      query: ({ query, page = 1, limit = 10 }) => ({
        url: "/people",
        method: "GET",
        params: { query, page, limit },
      }),
    }),
    searchConsultants: builder.query<any, { query: string; page?: number; limit?: number; sortBy?: string }>({
      query: ({ query, page = 1, limit = 10, sortBy }) => ({
        url: "/consultants",
        method: "GET",
        params: { query, page, limit, ...(sortBy ? { sortBy } : {}) },
      }),
    }),
  }),
});

export const {
  useGetRecentSearchesQuery,
  useGetSuggestedSearchesQuery,
  useSaveRecentSearchMutation,
  useRemoveRecentSearchMutation,
  useSearchAllQuery,
  useLazySearchAllQuery,
  useSearchPostsQuery,
  useSearchPeopleQuery,
  useLazySearchPeopleQuery,
  useSearchConsultantsQuery,
} = searchApi;
