// import { UserTypeApi } from "./user.service";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

export const UserTypeApi = createApi({
  reducerPath: "UserTypeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.API_BASE_URL}/users`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).userAuth?.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  tagTypes: ["User"],
 
  endpoints: (builder) => ({
    // verifyEmail: builder.mutation({
    //   query: (credentials) => ({
    //     url: "auth/verify/email/otp",
    //     method: "POST",
    //     body: credentials,
    //   }),
    // }),
    // sendEmailOtp: builder.mutation({
    //   query: (credentials) => ({
    //     url: "auth/send/email/otp",
    //     method: "POST",
    //     body: credentials,
    //   }),
    // }),
    // createAccount: builder.mutation({
    //   query: (credentials) => ({
    //     url: "auth/create/account",
    //     method: "POST",
    //     body: credentials,
    //   }),
    // }),
    // preSignup: builder.mutation({
    //   query: (credentials) => ({
    //     url: "auth/pre/signup",
    //     method: "POST",
    //     body: credentials,
    //   }),
    // }),

    login: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
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
     becomeConsultant : builder.mutation({
      query:(credentials)=>({
        url:"/become/consultant",
        method:"PATCH",
        body:credentials
      })
     })
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
useBecomeConsultantMutation,
} = UserTypeApi;
