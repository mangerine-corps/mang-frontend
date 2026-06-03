import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axios-base-query";

export const jobsApi = createApi({
  reducerPath: "jobsApi",
  baseQuery: axiosBaseQuery({
    baseUrl: `${process.env.API_BASE_URL}/`,
  }),
  tagTypes: ["Job", "SavedJob", "Application"],
  endpoints: (builder) => ({
    createJob: builder.mutation({
      query: (body) => ({
        url: "jobs",
        method: "POST",
        data: body,
      }),
      invalidatesTags: ["Job"],
    }),
    updateJob: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({
        url: `jobs/${id}`,
        method: "PATCH",
        data: body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Job", id }],
    }),
    deleteJob: builder.mutation<any, string>({
      query: (id) => ({
        url: `jobs/${id}`,
        method: "DELETE",
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
    getJobs: builder.query<any, { search?: string; page?: number; limit?: number; jobType?: string; workplaceType?: string; experienceLevel?: string; educationLevel?: string; country?: string; state?: string } | void>({
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
    getJobMeta: builder.query<any, void>({
      query: () => ({
        url: "jobs/meta",
        method: "GET",
      }),
    }),
    applyToJob: builder.mutation<any, { id: string; coverLetter?: string; resumeUrl?: string }>({
      query: ({ id, ...body }) => ({
        url: `jobs/${id}/apply`,
        method: "POST",
        data: body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Job", id }, "Application"],
    }),
    withdrawApplication: builder.mutation<any, string>({
      query: (id) => ({
        url: `jobs/${id}/apply`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Job", id }, "Application"],
    }),
    saveJob: builder.mutation<any, string>({
      query: (id) => ({
        url: `jobs/${id}/save`,
        method: "POST",
      }),
      invalidatesTags: ["SavedJob"],
    }),
    unsaveJob: builder.mutation<any, string>({
      query: (id) => ({
        url: `jobs/${id}/save`,
        method: "DELETE",
      }),
      invalidatesTags: ["SavedJob"],
    }),
    getSavedJobs: builder.query<any, { page?: number; limit?: number } | void>({
      query: (params) => ({
        url: "jobs/saved",
        method: "GET",
        params: params ?? {},
      }),
      providesTags: ["SavedJob"],
    }),
    getMyApplications: builder.query<any, { page?: number; limit?: number } | void>({
      query: (params) => ({
        url: "jobs/applications/mine",
        method: "GET",
        params: params ?? {},
      }),
      providesTags: ["Application"],
    }),
    getJobApplicants: builder.query<any, { id: string; page?: number; limit?: number }>({
      query: ({ id, ...params }) => ({
        url: `jobs/${id}/applications`,
        method: "GET",
        params,
      }),
      providesTags: (result, error, { id }) => [{ type: "Job", id }],
    }),
  }),
});

export const {
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
  useGetJobsQuery,
  useGetMyJobsQuery,
  useGetJobByIdQuery,
  useGetJobMetaQuery,
  useApplyToJobMutation,
  useWithdrawApplicationMutation,
  useSaveJobMutation,
  useUnsaveJobMutation,
  useGetSavedJobsQuery,
  useGetMyApplicationsQuery,
  useGetJobApplicantsQuery,
} = jobsApi;
