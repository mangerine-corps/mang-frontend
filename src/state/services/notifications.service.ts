import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";

export interface NotificationItem {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  category?: string;
  status: 'unread' | 'read' | 'archived';
  data?: any;
  metadata?: any;
  createdAt?: string;
  readAt?: string | null;
}

export interface PaginatedNotifications {
  data: NotificationItem[];
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export const notificationsApi = createApi({
  reducerPath: "notificationsApi",
  tagTypes: ["Notifications", "Notification"],
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
    getNotifications: builder.query<PaginatedNotifications, { page?: number; limit?: number; status?: string; type?: string; priority?: string; category?: string; search?: string }>({
      query: (params) => ({
        url: `/notifications`,
        method: "GET",
        params,
      }),
      providesTags: (result) => [{ type: "Notifications", id: "LIST" }],
    }),
    markAsRead: builder.mutation<NotificationItem, { notificationId: string }>({
      query: ({ notificationId }) => ({
        url: `/notifications/mark-read`,
        method: "POST",
        body: { notificationId },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Notifications", id: "LIST" },
        { type: "Notification", id: arg.notificationId },
      ],
    }),
    markAllAsRead: builder.mutation<{ affected: number }, void>({
      query: () => ({
        url: `/notifications/mark-all-read`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "Notifications", id: "LIST" }],
    }),
    deleteNotification: builder.mutation<{ message: string }, { id: string }>({
      query: ({ id }) => ({
        url: `/notifications/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Notifications", id: "LIST" },
        { type: "Notification", id: arg.id },
      ],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
  useDeleteNotificationMutation,
} = notificationsApi;
