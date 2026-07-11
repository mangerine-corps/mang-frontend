import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axios-base-query";

export const appointmentApi = createApi({
  reducerPath: "appointmentApi",
  tagTypes: ["Appointments", "Appointment"],
  baseQuery: axiosBaseQuery({
    baseUrl: `${process.env.API_BASE_URL}/`,
  }),
  endpoints: (builder) => ({
    bookAppointment: builder.mutation({
      query: (formData) => ({
        url: `/appointment/book`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Appointments", id: "UPCOMING" },
      ],
    }),
    intiateTransaction: builder.mutation({
      query: (formData) => ({
        url: `/payment/create-intent`,
        method: "POST",
        body: formData,
      }),
    }),
    initializePaystackPayment: builder.mutation({
      query: (formData) => ({
        url: `/payment/paystack/initialize`,
        method: "POST",
        body: formData,
      }),
    }),
    createPaypalOrder: builder.mutation({
      query: (formData) => ({
        url: `/payment/paypal/create-order`,
        method: "POST",
        body: formData,
      }),
    }),
    capturePaypalOrder: builder.mutation({
      query: (orderId: string) => ({
        url: `/payment/paypal/capture/${orderId}`,
        method: "POST",
      }),
    }),
    requestTimeExtension: builder.mutation({
      query: ({ appointmentId, extraMinutes }: { appointmentId: string; extraMinutes: number }) => ({
        url: `/appointment/${appointmentId}/request-extension`,
        method: "POST",
        body: { extraMinutes },
      }),
    }),
    rescheduleAppointment: builder.mutation({
      query: (formData: { consultationId: string; consultantId: string; availabilityId: string; timeslots: string[] }) => ({
        url: `/appointment/reschedule`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Appointments", id: "UPCOMING" },
        ...(arg?.consultationId ? [{ type: "Appointment", id: arg.consultationId }] as const : []),
      ],
    }),
    getMyAppointments: builder.query({
      query: (formData) => ({
        url: `/appointment/my-appointments`,
        method: "GET",
        params: formData,
      }),
      providesTags: (result) => [{ type: "Appointments", id: "MINE" }],
    }),
    createConversation: builder.mutation({
      query: (formData) => ({
        url: `/appointment/create/conversation`,
        method: "POST",
        params: formData,
      }),
    }),
    // Supports pagination: { page, take, order }
    getConversation: builder.mutation<any, { page?: number; take?: number; order?: string } | void>({
      query: (params) => ({
        url: `/appointment/get/conversations`,
        method: "GET",
        params: params ?? {},
      }),
    }),
    getChatToken: builder.mutation({
      query: () => ({
        url: `/chat/token`,
        method: "GET",
      }),
    }),
    getVideoToken: builder.mutation({
      query: (channelName) => ({
        url: `/video/rtc-token/${channelName}`,
        method: "GET",
      }),
    }),
    getUpcomingConsultation: builder.query({
      query: (formData) => ({
        url: `/appointment/upcoming/consultations`,
        method: "GET",
        params: formData,
      }),
      providesTags: (result) => [{ type: "Appointments", id: "UPCOMING" }],
    }),
    // Mutation variant to allow imperative fetching on component load or manual pagination
    fetchUpcomingConsultations: builder.mutation({
      query: (formData) => ({
        url: `/appointment/upcoming/consultations`,
        method: "GET",
        params: formData,
      }),
      // No cache tags provided to avoid unintended invalidations; this is for imperative fetches
    }),
    getAppointmentById: builder.query<any, string>({
      query: (appointmentId) => ({
        url: `/appointment/${appointmentId}`,
        method: "GET",
      }),
      providesTags: (result, error, appointmentId) => [
        { type: "Appointment", id: appointmentId },
      ],
    }),
    getAppointmentByPaymentIntent: builder.query<any, string>({
      query: (intentId) => ({
        url: `/appointment/by-payment-intent/${intentId}`,
        method: "GET",
      }),
    }),
    cancelAppointment: builder.mutation<any, { appointmentId: string; reason?: string }>({
      query: ({ appointmentId, reason }) => ({
        url: `/appointment/${appointmentId}/cancel`,
        method: "POST",
        body: typeof reason === 'string' ? { reason } : undefined,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Appointments", id: "UPCOMING" },
        { type: "Appointments", id: "MINE" },
        ...(arg?.appointmentId ? [{ type: "Appointment", id: arg.appointmentId }] as const : []),
      ],
    }),
    getMyPayments: builder.query<any, { page?: number; limit?: number; status?: string }>({
      query: (params) => ({
        url: `/payment/history`,
        method: "GET",
        params,
      }),
    }),
    getMeetingSession: builder.mutation<any, { appointmentId: string }>({
      query: ({ appointmentId }) => ({
        url: `/appointment/${appointmentId}/meeting/session`,
        method: "POST",
        body: {},
      }),
    }),
    getMeetingDetails: builder.query<any, string>({
      query: (appointmentId) => ({
        url: `/appointment/${appointmentId}/meeting`,
        method: "GET",
      }),
    }),
    joinMeetingPresence: builder.mutation<any, { appointmentId: string; uid: number }>({
      query: ({ appointmentId, uid }) => ({
        url: `/appointment/${appointmentId}/meeting/join`,
        method: "POST",
        body: { uid },
      }),
    }),
    leaveMeetingPresence: builder.mutation<any, { appointmentId: string; uid: number }>({
      query: ({ appointmentId, uid }) => ({
        url: `/appointment/${appointmentId}/meeting/leave`,
        method: "POST",
        body: { uid },
      }),
    }),
    endMeeting: builder.mutation<any, { appointmentId: string }>({
      query: ({ appointmentId }) => ({
        url: `/appointment/${appointmentId}/meeting/end`,
        method: "POST",
      }),
    }),
    meetingHeartbeat: builder.mutation<any, { appointmentId: string; uid: number }>({
      query: ({ appointmentId, uid }) => ({
        url: `/appointment/${appointmentId}/meeting/heartbeat`,
        method: "POST",
        body: { uid },
      }),
    }),
    submitConsultationReview: builder.mutation<any, { appointmentId: string; rating: number; comment?: string }>({
      query: ({ appointmentId, rating, comment }) => ({
        url: `/appointment/${appointmentId}/review`,
        method: "POST",
        body: { rating, ...(comment ? { comment } : {}) },
      }),
    }),
    submitMeetingQualityFeedback: builder.mutation<any, { appointmentId: string; score: number; label: string }>({
      query: ({ appointmentId, score, label }) => ({
        url: `/appointment/${appointmentId}/complete`,
        method: "POST",
        body: { score, label },
      }),
    }),
    getRejoinStatus: builder.query<any, string>({
      query: (appointmentId) => ({
        url: `/appointment/${appointmentId}/meeting/rejoin-status`,
        method: "GET",
      }),
    }),
    getConsultationHistory: builder.query<any, {
      page?: number;
      limit?: number;
      fromDate?: string;
      toDate?: string;
      status?: string;
      name?: string;
      sortBy?: string;
    }>({
      query: (params) => ({
        url: `/appointment/consultation-history`,
        method: "GET",
        params: {
          page:     params.page     ?? 1,
          limit:    params.limit    ?? 10,
          fromDate: params.fromDate || undefined,
          toDate:   params.toDate   || undefined,
          status:   params.status   || undefined,
          name:     params.name     || undefined,
          sortBy:   params.sortBy   || undefined,
        },
      }),
      providesTags: (result, error, params) => [
        { type: "Appointments", id: `HISTORY-${params.page}` },
      ],
    }),
  }),
});

// Export hooks for use in components
export const {
  useBookAppointmentMutation,
  useRescheduleAppointmentMutation,
  useGetMyAppointmentsQuery,
  useCreateConversationMutation,
  useGetConversationMutation,
  useGetVideoTokenMutation,
  useIntiateTransactionMutation,
  useInitializePaystackPaymentMutation,
  useCreatePaypalOrderMutation,
  useCapturePaypalOrderMutation,
  useRequestTimeExtensionMutation,
  useGetUpcomingConsultationQuery,
  useFetchUpcomingConsultationsMutation,
  useGetAppointmentByIdQuery,
  useGetAppointmentByPaymentIntentQuery,
  useCancelAppointmentMutation,
  useGetMyPaymentsQuery,
  useGetConsultationHistoryQuery,
  useGetMeetingSessionMutation,
  useGetMeetingDetailsQuery,
  useJoinMeetingPresenceMutation,
  useLeaveMeetingPresenceMutation,
  useEndMeetingMutation,
  useMeetingHeartbeatMutation,
  useSubmitConsultationReviewMutation,
  useSubmitMeetingQualityFeedbackMutation,
  useLazyGetRejoinStatusQuery,
} = appointmentApi;
