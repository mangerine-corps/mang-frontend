import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axios-base-query";

export const CommunityApi = createApi({
  reducerPath: "CommunityApi",
  baseQuery: axiosBaseQuery({
    baseUrl: process.env.API_BASE_URL + "/community",
    headers: {
      type: "customer",
    },
  }),
  endpoints: (builder) => ({
    getAllCommunities: builder.mutation({
      query: (opts?: { page?: number; limit?: number; category?: string }) => ({
        url: "/",
        method: "GET",
        params: {
          ...(opts?.page ? { page: opts.page } : {}),
          ...(opts?.limit ? { limit: opts.limit } : {}),
          ...(opts?.category ? { category: opts.category } : {}),
        },
      }),
    }),
    getJoinedCommunities: builder.mutation({
      query: () => ({
        url: "/joined-communities",
        method: "GET",
      }),
    }),

    getCreatedCommunities: builder.mutation({
      query: () => ({
        url: "/created-communities",
        method: "GET",
      }),
    }),

    createCommunity: builder.mutation({
      query: (data) => ({
        url: "/create-community",
        method: "POST",
        body: data,
        formData: true,
      }),
    }),

    updateCommunity: builder.mutation({
      query: ({ id, data }: { id: string; data: FormData }) => ({
        url: `update/${id}`,
        method: "PATCH",
        body: data,
        formData: true,
      }),
    }),

    getTrendingCommunities: builder.mutation({
      query: (paginateOption: { page?: number; limit?: number }) => ({
        url: "/trending",
        method: "GET",
        params: paginateOption,
      }),
    }),

    getTrendingCommunitiesByCategory: builder.mutation({
      query: ({
        category,
        page,
        limit,
      }: {
        category: string;
        page?: number;
        limit?: number;
      }) => ({
        url: `/trending/${category}`,
        method: "GET",
        params: { page, limit },
      }),
    }),

    getRisingCommunities: builder.mutation({
      query: (paginateOption: { page?: number; limit?: number }) => ({
        url: "/rising",
        method: "GET",
        params: paginateOption,
      }),
    }),

    getRecommendedCommunities: builder.mutation({
      query: () => ({
        url: "/recommended",
        method: "GET",
      }),
    }),

    getCommunities: builder.mutation({
      query: ({
        url,
        page = 1,
        limit = 10,
      }: {
        page?: number;
        limit?: number;
        url: string;
      }) => ({
        method: "GET",
        url: `${url}?page=${page}&limit=${limit}`,
      }),
    }),
    getCommunity: builder.query({
      query: ({ id }: { id: string }) => ({
        url: `/${id}`,
        method: "GET",
      }),
    }),
    joinOrLeaveCommunity: builder.mutation({
      query: (communityId: string) => ({
        method: "PUT",
        url: `join_or_leave/${communityId}`,
      }),
    }),
    getCommunityPost: builder.mutation({
      query: ({ page = 1, limit = 10, groupId }) => ({
        url: `/post?&groupId=${groupId}&page=${page}&limit=${limit}`,
        method: "GET",
      }),
    }),
    deleteCommunity: builder.mutation({
      query: (communityId: string) => ({
        url: `/${communityId}`,
        method: "DELETE",
      }),
    }),
    pinCommunity: builder.mutation({
      query: (communityId: string) => ({
        url: `/${communityId}/pin`,
        method: "POST",
      }),
    }),
    unPinCommunity: builder.mutation({
      query: (communityId: string) => ({
        url: `community/${communityId}/pin`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useCreateCommunityMutation,
  useGetAllCommunitiesMutation,
  useGetJoinedCommunitiesMutation,
  useGetCreatedCommunitiesMutation,
  useGetRecommendedCommunitiesMutation,
  useGetTrendingCommunitiesMutation,
  useGetTrendingCommunitiesByCategoryMutation,
  useGetRisingCommunitiesMutation,
  useGetCommunitiesMutation,
  useJoinOrLeaveCommunityMutation,
  useGetCommunityQuery,
  useGetCommunityPostMutation,
  usePinCommunityMutation,
  useUnPinCommunityMutation,
  useDeleteCommunityMutation,
  useUpdateCommunityMutation,
} = CommunityApi;
