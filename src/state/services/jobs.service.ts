import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axios-base-query";

export const jobsApi = createApi({
  reducerPath: "jobsApi",
  baseQuery: axiosBaseQuery({
    baseUrl: `${process.env.API_BASE_URL}/`,
  }),
  tagTypes: ["Job"],
  endpoints: (builder) => ({
    createJob: builder.mutation({
      query: (body) => ({
        url: "jobs",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Job"],
    }),
    getMyJobs: builder.query<any, { status?: string; page?: number; limit?: number } | void>({
      query: (params) => ({
        url: "jobs/my",
        method: "GET",
        params: params ?? {},
      }),
      providesTags: ["Job"],
    }),
    getJobs: builder.query<any, { search?: string; page?: number; limit?: number } | void>({
      query: (params) => ({
        url: "jobs/search",
        method: "GET",
        params: params ?? {},
      }),
      providesTags: ["Job"],
    }),
    getJobById: builder.query<any, string>({
      query: (jobId) => ({
        url: `jobs/${jobId}`,
        method: "GET",
      }),
      providesTags: (result, error, jobId) => [{ type: "Job", id: jobId }],
    }),
  }),
});

export const { useCreateJobMutation, useGetJobsQuery, useGetMyJobsQuery, useGetJobByIdQuery } = jobsApi;
