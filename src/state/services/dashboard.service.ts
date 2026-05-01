import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axios-base-query";

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: axiosBaseQuery({
    baseUrl: `${process.env.API_BASE_URL}/consultants/dashboard`,
  }),
  tagTypes: ["DashboardStats", "DashboardEarnings", "DashboardConsultations", "DashboardGauge"],
  endpoints: (builder) => ({
    getDashboardStats: builder.query<any, void>({
      query: () => ({ url: "/stats", method: "GET" }),
      providesTags: ["DashboardStats"],
    }),
    getDashboardEarnings: builder.query<any, { period: "day" | "week" | "month" | "year" }>({
      query: ({ period }) => ({ url: "/earnings", method: "GET", params: { period } }),
      providesTags: ["DashboardEarnings"],
    }),
    getDashboardConsultations: builder.query<any, { period?: string }>({
      query: ({ period = "monthly" }) => ({ url: "/consultations", method: "GET", params: { period } }),
      providesTags: ["DashboardConsultations"],
    }),
    getDashboardGauge: builder.query<any, void>({
      query: () => ({ url: "/gauge", method: "GET" }),
      providesTags: ["DashboardGauge"],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetDashboardEarningsQuery,
  useGetDashboardConsultationsQuery,
  useGetDashboardGaugeQuery,
} = dashboardApi;
