import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

// define the API service
export const settingsApi = createApi({
  reducerPath: "settingsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.API_BASE_URL}/settings`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).userAuth?.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    "Settings",
    "PaymentMethods",
    "Feedback",
    "Issues",
    "NotificationSettings",
    "User",
  ],
  endpoints: (builder) => ({
    // update password
    updatePassword: builder.mutation({
      query: ({ currentPassword, newPassword, confirmPassword }) => ({
        url: "/password",
        method: "PATCH",
        body: { currentPassword, newPassword, confirmPassword },
      }),
      invalidatesTags: ["Settings"],
    }),

    // add secondary number
    addSecondaryNumber: builder.mutation({
      query: ({  secondaryNumber, confirmSecondaryNumber }) => ({
        url: `/secondary-number`,
        method: "POST",
        body: {  secondaryNumber, confirmSecondaryNumber },
      }),
      invalidatesTags: ["Settings", "User"],
    }),

    // edit secondary number
    editSecondaryNumber: builder.mutation({
      query: ({  secondaryNumber, confirmSecondaryNumber }) => ({
        url: `/secondary-number`,
        method: "PATCH",
        body: {  secondaryNumber, confirmSecondaryNumber },
      }),
      invalidatesTags: ["Settings"],
    }),

    // remove secondary number
    removeSecondaryNumber: builder.mutation({
      query: () => ({
        url: `/remove-secondary-number`,
        method: "DELETE",
      }),
      invalidatesTags: ["Settings"],
    }),

    // send message
    sendMessage: builder.mutation({
      query: ({  subject, messageBody }) => ({
        url: "/message",
        method: "POST",
        body: {  subject, messageBody },
      }),
      invalidatesTags: ["Settings"],
    }),

    // send feedback
    createFeedback: builder.mutation({
      query: ({  feedbackType, comment, rating }) => ({
        url: "/feedback",
        method: "POST",
        body: {  feedbackType, comment, rating },
      }),
      invalidatesTags: ["Feedback"],
    }),

    // report issue
    reportIssue: builder.mutation({
      query: ({  issueType, description }) => ({
        url: "/report-issue",
        method: "POST",
        body: {issueType, description},
      }),
      invalidatesTags: ["Issues"],
    }),

    // update user settings
    updateUserSettings: builder.mutation({
      query: ({  ...data }) => ({
        url: "",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Settings"],
    }),

    // cancel subscription for authenticated user
    cancelSubscription: builder.mutation({
      query: () => ({
        url: `/cancel`,
        method: "POST",
      }),
      invalidatesTags: ["Settings"],
    }),

    // payment methods
    getPaymentMethods: builder.query({
      query: () => "/payment-methods",
      providesTags: ["PaymentMethods"],
    }),

    createPaymentMethod: builder.mutation({
      query: (data) => ({
        url: "/payment-methods",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["PaymentMethods"],
    }),

    // update an existing payment method by ID
    updatePaymentMethod: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/payment-methods/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["PaymentMethods"],
    }),

    // delete a payment method by ID
    deletePaymentMethod: builder.mutation({
      query: (id) => ({
        url: `payment-methods/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PaymentMethods"],
    }),

    // fetch user notification settings
    getNotificationSettings: builder.query({
      query: () => ({
        url: "notification-settings",
        method: "GET",
      }),
      providesTags: ["NotificationSettings"],
    }),

    // update user notification settings
    updateNotificationSettings: builder.mutation({
      query: ({  ...data }) => ({
        url: "/notification-settings",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["NotificationSettings"],
    }),

    // enable email 2FA
    enableEmail2FA: builder.mutation({
      query: ( )=> ({
        url: "/enable-email",
        method: "POST",
      }),
      invalidatesTags: ["Settings"],
    }),

    // enable phone 2FA
    enablePhone2FA: builder.mutation({
      query: () => ({
        url: "/enable-phone",
        method: "POST",
      }),
      invalidatesTags: ["Settings"],
    }),

    // verify OTP
    verifyOtp: builder.mutation({
      query: ({  otp }) => ({
        url: "/verify-otp",
        method: "POST",
        body: { otp },
      }),
      invalidatesTags: ["Settings"],
    }),

    // setup app 2FA
    setupApp2FA: builder.mutation({
      query: ( )=> ({
        url: "/setup-app",
        method: "POST",
      }),
      invalidatesTags: ["Settings"],
    }),

    // enable app 2FA
    enableApp2FA: builder.mutation({
      query: ({  otp }) => ({
        url: "/enable-app",
        method: "POST",
        body: { otp },
      }),
      invalidatesTags: ["Settings"],
    }),

    // update Two-Factor Auth Settings
    updateTwoFactorAuthSettings: builder.mutation({
      query: ({  updateDto }) => ({
        url: "/update-settings",
        method: "PATCH",
        body: updateDto,
      }),
      invalidatesTags: ["Settings"],
    }),

    // deactivate app 2FA
    deactivateApp2FA: builder.mutation({
      query: ({  otp }) => ({
        url: "/deactivate-app",
        method: "POST",
        body: { otp },
      }),
      invalidatesTags: ["Settings"],
    }),

    fetchCurrentUser: builder.query({
      query: () => "/current",
      providesTags: ["User"],
    }),

    // get user privacy settings (messagingPreference, appearInSearchResults)
    getUserSettings: builder.query<{ data: { messagingPreference?: string; appearInSearchResults?: boolean } }, void>({
      query: () => "/user-settings",
      providesTags: ["Settings"],
    }),

    // general settings
    getGeneralSettings: builder.query<{ data: { uiLanguage?: string | null; timeZone?: string | null; interfaceTheme?: string | null } }, void>({
      query: () => "/general-settings",
      providesTags: ["Settings"],
    }),
    updateGeneralSettings: builder.mutation<{ message: string; data: any }, { uiLanguage?: string; timeZone?: string; interfaceTheme?: string }>({
      query: (body) => ({
        url: "/general-settings",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Settings"],
    }),

  }),
});

// export hooks for usage in functional components
export const {
    useUpdatePasswordMutation,
    useAddSecondaryNumberMutation,
    useEditSecondaryNumberMutation,
    useRemoveSecondaryNumberMutation,
    useCreateFeedbackMutation,
    useReportIssueMutation,
    useSendMessageMutation,
    useUpdateUserSettingsMutation,
    useCancelSubscriptionMutation,
    useGetPaymentMethodsQuery,
    useCreatePaymentMethodMutation,
    useUpdatePaymentMethodMutation,
    useDeletePaymentMethodMutation,
    useGetNotificationSettingsQuery,
    useUpdateNotificationSettingsMutation,
    useEnableEmail2FAMutation,
    useEnablePhone2FAMutation,
    useEnableApp2FAMutation,
    useVerifyOtpMutation,
    useSetupApp2FAMutation,
    useUpdateTwoFactorAuthSettingsMutation,
    useDeactivateApp2FAMutation,
    useFetchCurrentUserQuery,
    useGetUserSettingsQuery,
    useGetGeneralSettingsQuery,
    useUpdateGeneralSettingsMutation,
} = settingsApi;