import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axios-base-query";

export interface WalletTotalResponse {
  total: number;
  currency: string;
}

// --- Payment (user side) ---
export interface PaymentItem {
  id: string;
  intentId?: string;
  status: string;
  provider?: string;
  amount: string;
  currency: string;
  consultant?: { id: string; fullName: string; profilePics?: string };
  appointmentData?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

// --- Earning (consultant side) ---
export interface EarningItem {
  id: string;
  status: "PENDING" | "PAID";
  grossAmount: number;
  platformFeePercent: number;
  platformFeeAmount: number;
  netAmount: number;
  currency: string;
  payoutId: string | null;
  paidAt: string | null;
  consultantId: string;
  userId: string;
  paymentId: string;
  appointmentId: string;
  payer?: { id: string; fullName: string; profilePics?: string };
  createdAt?: string;
  updatedAt?: string;
}

export interface EarningsSummary {
  totalGrossEarned: number;
  totalPlatformFees: number;
  totalNetEarned: number;
  availableBalance: number;
  totalPaidOut: number;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface TransactionsResponse {
  payments: { payments: PaymentItem[]; pagination: Pagination };
  earnings: { earnings: EarningItem[]; pagination: Pagination };
}

export interface EarningsPage {
  earnings: EarningItem[];
  pagination: Pagination;
}

export const transactionApi = createApi({
  reducerPath: "transactionApi",
  baseQuery: axiosBaseQuery({
    baseUrl: `${process.env.API_BASE_URL}/`,
  }),
  tagTypes: ["transaction", "wallet", "earnings"],
  endpoints: (builder) => ({
    getWalletTotal: builder.query<WalletTotalResponse, void>({
      query: () => ({ url: `transaction/wallet/total`, method: "GET" }),
      transformResponse: (response: any): WalletTotalResponse => {
        const data = response?.data ?? response;
        return {
          total: Number(data?.total ?? data?.data?.total ?? 0),
          currency: String(data?.currency ?? data?.data?.currency ?? "USD"),
        };
      },
      providesTags: ["wallet"],
    }),

    getTransactions: builder.query<TransactionsResponse, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: `transaction`,
        method: "GET",
        params: { page, limit },
      }),
      transformResponse: (response: any): TransactionsResponse => {
        const raw = response?.data ?? response;
        const paymentsBlock = raw?.payments ?? {};
        const earningsBlock = raw?.earnings ?? {};
        const emptyPagination: Pagination = { page: 1, limit: 10, total: 0, totalPages: 1 };
        return {
          payments: {
            payments: Array.isArray(paymentsBlock?.payments) ? paymentsBlock.payments : [],
            pagination: paymentsBlock?.pagination ?? emptyPagination,
          },
          earnings: {
            earnings: Array.isArray(earningsBlock?.earnings) ? earningsBlock.earnings : [],
            pagination: earningsBlock?.pagination ?? emptyPagination,
          },
        };
      },
      providesTags: ["transaction"],
    }),

    getEarnings: builder.query<EarningsPage, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: `earnings`,
        method: "GET",
        params: { page, limit },
      }),
      transformResponse: (response: any): EarningsPage => {
        const raw = response?.data ?? response;
        const emptyPagination: Pagination = { page: 1, limit: 10, total: 0, totalPages: 1 };
        return {
          earnings: Array.isArray(raw?.earnings) ? raw.earnings : [],
          pagination: raw?.pagination ?? emptyPagination,
        };
      },
      providesTags: ["earnings"],
    }),

    getEarningsSummary: builder.query<EarningsSummary, void>({
      query: () => ({ url: `earnings/summary`, method: "GET" }),
      transformResponse: (response: any): EarningsSummary => {
        const d = response?.data ?? response;
        return {
          totalGrossEarned: Number(d?.totalGrossEarned ?? 0),
          totalPlatformFees: Number(d?.totalPlatformFees ?? 0),
          totalNetEarned: Number(d?.totalNetEarned ?? 0),
          availableBalance: Number(d?.availableBalance ?? 0),
          totalPaidOut: Number(d?.totalPaidOut ?? 0),
        };
      },
      providesTags: ["earnings"],
    }),

    getEarningById: builder.query<EarningItem, string>({
      query: (id) => ({ url: `earnings/${id}`, method: "GET" }),
      transformResponse: (response: any): EarningItem => response?.data ?? response,
    }),
  }),
});

export const {
  useGetWalletTotalQuery,
  useGetTransactionsQuery,
  useLazyGetTransactionsQuery,
  useGetEarningsQuery,
  useGetEarningsSummaryQuery,
  useGetEarningByIdQuery,
} = transactionApi;
