import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axios-base-query";

export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: axiosBaseQuery({
    baseUrl: `${process.env.API_BASE_URL}/`,
  }),
  endpoints: (builder) => ({
    createPaymentIntent: builder.mutation({
      query: (formData) => ({
        url: `/payment/create-intent`,
        method: "POST",
        body: formData,
      }),
    }),
    getAvailability: builder.mutation({
      query: (formData) => ({
        url: `/availability?`,
        method: "GET",
        params: formData,
      }),
    }),
    createTransaction: builder.mutation({
      query: (transactionId) => ({
        url: `/transaction/{transactionId}`,
        method: "POST",
        body: transactionId,
      }),
    }),
    getTransaction: builder.mutation({
      query: () => ({
        url: `transaction`,
        method: "GET",
      
      }),
    }),
    getTransactionId: builder.mutation({
      query: (formData) => ({
        url: `/transaction/{transactionId}`,
        method: "GET",
        params: formData,
      }),
    }),
    updateTransaction: builder.mutation({
      query: (transactionId) => ({
        url: `/transaction/{transactionId}`,
        method: "PATCH",
        body: transactionId,
      }),
    }),
    deleteTransaction: builder.mutation({
      query: (transactionId) => ({
        url: `/transaction/{transactionId}`,
        method: "DELETE",
        body: transactionId,
      }),
    }),
  }),
});

// Export hooks for use in components
export const {
  useCreatePaymentIntentMutation,
  useGetAvailabilityMutation,
  useDeleteTransactionMutation,
  useGetTransactionIdMutation,
  useGetTransactionMutation,
  useUpdateTransactionMutation,
  useCreateTransactionMutation,
} = paymentApi;
