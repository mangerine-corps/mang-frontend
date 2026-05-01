import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axios-base-query";

export const ratingsApi = createApi({
  reducerPath: "ratingsApi",
  baseQuery: axiosBaseQuery({
    baseUrl: `${process.env.API_BASE_URL}`,
  }),
  tagTypes: ["Reviews", "Ratings"],
  endpoints: (builder) => ({
    // ── Reviews ──────────────────────────────────────────────
    getConsultantReviews: builder.query<any, { consultantId: string; page?: number; limit?: number }>({
      query: ({ consultantId, page = 1, limit = 10 }) => ({
        url: `/reviews/consultant/${consultantId}`,
        method: "GET",
        params: { page, limit },
      }),
      providesTags: (result, error, { consultantId }) => [{ type: "Reviews", id: consultantId }],
    }),
    replyToReview: builder.mutation<any, { reviewId: string; reply: string }>({
      query: ({ reviewId, reply }) => ({
        url: `/reviews/${reviewId}/reply`,
        method: "POST",
        body: { reply },
      }),
      invalidatesTags: (result, error, { reviewId }) => [{ type: "Reviews", id: "LIST" }],
    }),
    getReviewSummary: builder.query<any, { consultantId: string }>({
      query: ({ consultantId }) => ({
        url: `/reviews/consultant/${consultantId}/summary`,
        method: "GET",
      }),
      providesTags: (result, error, { consultantId }) => [{ type: "Reviews", id: `SUMMARY-${consultantId}` }],
    }),
    // ── Ratings ──────────────────────────────────────────────
    getRatingBreakdown: builder.query<any, { consultantId: string }>({
      query: ({ consultantId }) => ({
        url: `/ratings/consultant/${consultantId}/breakdown`,
        method: "GET",
      }),
      providesTags: (result, error, { consultantId }) => [{ type: "Ratings", id: consultantId }],
    }),
  }),
});

export const {
  useGetConsultantReviewsQuery,
  useReplyToReviewMutation,
  useGetReviewSummaryQuery,
  useGetRatingBreakdownQuery,
} = ratingsApi;
