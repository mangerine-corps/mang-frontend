import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

export const appointmentApi = createApi({
  reducerPath: "appointmentApi",
  tagTypes: ["Appointments", "Appointment"],
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
    getConversation: builder.mutation({
      query: () => ({
        url: `/appointment/get/conversations`,
        method: "GET",
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
  useGetUpcomingConsultationQuery,
  useFetchUpcomingConsultationsMutation,
  useGetAppointmentByIdQuery,
  useGetAppointmentByPaymentIntentQuery,
  useCancelAppointmentMutation,
  useGetMyPaymentsQuery,
} = appointmentApi;
