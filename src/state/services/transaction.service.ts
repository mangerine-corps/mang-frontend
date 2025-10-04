import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

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
