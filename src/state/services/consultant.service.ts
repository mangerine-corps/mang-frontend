import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ProfileApi } from "./profile.service";
import { RootState } from "../store";

export const consultantsApi = createApi({
  reducerPath: "consultantsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.API_BASE_URL}/consultants`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).userAuth?.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Consultant", "FavoriteConsultant", "User"], // cache invalidation tags
  endpoints: (builder) => ({
    // get all consultants
    getConsultants: builder.query({
      query: () => "/",
      providesTags: ["Consultant"],
    }),

    // get consultant by ID
    getConsultantById: builder.query({
      query: (id: string) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "Consultant", id }],
    }),
    // on-demand get consultant by ID (imperative trigger)
    getConsultantByIdOnDemand: builder.mutation({
      query: (id: string) => ({
        url: `/${id}`,
        method: "GET",
      }),
    }),
   

    // get the list of favorited consultants
    getFavoriteConsultants: builder.query({
      query: () => `/favorites`,
      providesTags: ["FavoriteConsultant"],
    }),

    // favorite a consultant (like action)
    favoriteConsultant: builder.mutation({
      query: (credentials) => ({
        url: `/favorite`,
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["FavoriteConsultant", "Consultant"],
    }),
     postRatings: builder.mutation({
      query: (consultantId) => ({
        url: `/rat`,
        method: "POST",
        body: { consultantId },
      }),
      invalidatesTags: ["FavoriteConsultant", "Consultant"],
    }),

    // unfavorite a consultant (unlike action)
    unfavoriteConsultant: builder.mutation({
      query: (consultantId) => ({
        url: `/unfavorite`,
        method: "POST",
        body: { consultantId },
      }),
      invalidatesTags: ["FavoriteConsultant", "Consultant"],
    }),

    // report a consultant
    reportConsultant: builder.mutation({
      query: ({ consultantId, reportDetails }) => ({
        url: `/${consultantId}/report`,
        method: "POST",
        body: reportDetails,
      }),
      invalidatesTags: (result, error, { consultantId }) => [
        { type: "Consultant", id: consultantId },
      ],
    }),
    consultantPricing: builder.mutation({
      query: (credentials) => ({
        url: "/pricing",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Invalidate profile metrics so missing-fields and completion percent update
          dispatch(ProfileApi.util.invalidateTags(["profileMetrics", "userInfo"]));
        } catch {}
      },
    }),
    getPricing: builder.query({
      query: () => ({
        url: "/pricing/get",
        method: "GET",
      }),
    }),
    getConsultantPricing: builder.query({
      query: (consultantId: string) => `/${consultantId}/pricing`,
      providesTags: (result, error, consultantId) => [{ type: "Consultant", id: consultantId }],
    }),
    // On-demand pricing fetch as a mutation (imperative trigger)
    getConsultantPricingOnDemand: builder.mutation({
      query: (consultantId: string) => ({
        url: `/${consultantId}/pricing`,
        method: "GET",
      }),
    }),
  }),
});

// Export hooks for use in components
export const {
  useGetConsultantsQuery,
  useGetConsultantByIdQuery,
  useGetConsultantByIdOnDemandMutation,
  useGetFavoriteConsultantsQuery,
  useFavoriteConsultantMutation,
  useUnfavoriteConsultantMutation,
  useReportConsultantMutation,
  useConsultantPricingMutation,
  useGetPricingQuery,
  useGetConsultantPricingQuery,
  useGetConsultantPricingOnDemandMutation
} = consultantsApi;
