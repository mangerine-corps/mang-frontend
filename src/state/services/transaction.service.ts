import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axios-base-query";

export interface WalletTotalResponse {
  total: number;
  currency: string;
}

export interface TransactionItem {
  id: string;
  consultantId: string;
  appointmentId?: string;
  paymentId?: string;
  amount: string | number;
  currency: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TransactionsPage {
  data: TransactionItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const transactionApi = createApi({
  reducerPath: "transactionApi",
  baseQuery: axiosBaseQuery({
    baseUrl: `${process.env.API_BASE_URL}/`,
  }),
  tagTypes: ["transaction", "wallet"],
  endpoints: (builder) => ({
    getWalletTotal: builder.query<WalletTotalResponse, void>({
      query: () => ({ url: `transaction/wallet/total`, method: "GET" }),
      transformResponse: (response: any): WalletTotalResponse => {
        const data = response?.data ?? response;
        return {
          total: Number(data?.total ?? data?.data?.total ?? 0),
          currency: (data?.currency ?? data?.data?.currency ?? "USD").toString(),
        };
      },
      providesTags: ["wallet"],
    }),

    getTransactions: builder.query<TransactionsPage, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: `transaction`,
        method: "GET",
        params: { page, limit },
      }),
      transformResponse: (response: any): TransactionsPage => {
        const raw = response?.data ?? response;
        return {
          data: raw?.data ?? raw?.items ?? [],
          total: Number(raw?.total ?? 0),
          page: Number(raw?.page ?? 1),
          limit: Number(raw?.limit ?? 10),
          totalPages: Number(raw?.totalPages ?? 1),
        };
      },
      providesTags: ["transaction"],
    }),
  }),
});

export const { useGetWalletTotalQuery, useGetTransactionsQuery, useLazyGetTransactionsQuery } = transactionApi;
