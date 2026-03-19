import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axios-base-query";

export const UserAuthApi = createApi({
  reducerPath: "UserAuthApi",
  baseQuery: axiosBaseQuery({
    baseUrl: `${process.env.API_BASE_URL}`,
    headers: {
      type: "agent",
    },
  }),

  endpoints: (builder) => ({
    verifyEmail: builder.mutation({
      query: (credentials) => ({
        url: "auth/verify/email/otp",
        method: "POST",
        body: credentials,
      }),
    }),
    sendEmailOtp: builder.mutation({
      query: (credentials) => ({
        url: "auth/send/email/otp",
        method: "POST",
        body: credentials,
      }),
    }),
    createAccount: builder.mutation({
      query: (credentials) => ({
        url: "auth/create/account",
        method: "POST",
        body: credentials,
      }),
    }),
    preSignup: builder.mutation({
      query: (credentials) => ({
        url: "auth/pre/signup",
        method: "POST",
        body: credentials,
      }),
    }),
    getUserType: builder.mutation({
      query: () => ({
        url: "auth/get/user/types",
        method: 'GET'
      }),
      // providesTags: ["user"],
    }),
    getInterests: builder.mutation({
      query: () => ({
        url: "auth/get/user/interests",
        method: 'GET'
      }),
      // providesTags: ["user"],
    }),

    login: builder.mutation({
      query: (credentials) => ({
        url: `auth/login`,
        method: "POST",
        body: credentials,
      }),
    }),
    resetPassword: builder.mutation({
      query: (credentials) => ({
        url: "auth/change/password",
        method: "POST",
        body: credentials,
      }),
    }),
    forgotPassword: builder.mutation({
      query: (credentials) => ({
        url: "auth/forgot/password",
        method: "POST",
        body: credentials,
      }),
    }),
    googleAuth: builder.mutation({
      query: (access_token) => ({
        url: "auth/google",
        method: "POST",
        body: access_token,
      }),
    }),
    // onboarding endpoints
    updatePics: builder.mutation({
      query: (credentials) => ({
        url: "onboarding/update-profile/pics",
        method: "POST",
        body: credentials,
      }),
    }),
    updateDetails: builder.mutation({
      query: (credentials) => ({
        url: "onboarding/update-profile/details",
        method: "POST",
        body: credentials,
      }),
    }),
    uploadResume: builder.mutation({
      query: (credentials) => ({
        url: "onboarding/update-profile/resume",
        method: "POST",
        body: credentials,
      }),
    }),
    uploadVideo: builder.mutation({
      query: (credentials) => ({
        url: "onboarding/update-profile/video",
        method: "POST",
        body: credentials,
      }),
    }),
    selectPricing: builder.mutation({
      query: (credentials) => ({
        url: "onboarding/update-profile/pricing",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useVerifyEmailMutation,
  usePreSignupMutation,
  useLoginMutation,
  useSendEmailOtpMutation,
  useCreateAccountMutation,
  useUpdatePicsMutation,
  useUpdateDetailsMutation,
  useUploadResumeMutation,
  useUploadVideoMutation,
  useSelectPricingMutation,
  useGetInterestsMutation,
  useGetUserTypeMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGoogleAuthMutation,
} = UserAuthApi;
