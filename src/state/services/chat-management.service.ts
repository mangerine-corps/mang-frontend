import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

// Types for chat management
export interface BlockUserRequest {
  blockedUserId: string;
  conversationId: string;
  reason?: string;
}

export interface MuteUserRequest {
  mutedUserId: string;
  conversationId: string;
  muteUntil?: string;
  reason?: string;
}

export interface ReportUserRequest {
  reportedUserId: string;
  conversationId: string;
  reason: 'harassment' | 'spam' | 'inappropriate_content' | 'fake_profile' | 'scam' | 'violence' | 'other';
  description: string;
}

export interface DeleteConversationRequest {
  conversationId: string;
  reason?: string;
}

export interface ChatManagementResponse {
  success: boolean;
  message: string;
  data?: any;
}

// Create the API service
export const chatManagementApi = createApi({
  reducerPath: 'chatManagementApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
    prepareHeaders: (headers, { getState }) => {
      // Get the token from localStorage or state
      const token = (getState() as RootState).userAuth?.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['ChatManagement'],
  endpoints: (builder) => ({
    // Block a user
    blockUser: builder.mutation<ChatManagementResponse, BlockUserRequest>({
      query: (credentials) => ({
        url: '/chat-management/block',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['ChatManagement'],
    }),

    // Unblock a user
    unblockUser: builder.mutation<ChatManagementResponse, { blockedUserId: string; conversationId: string }>({
      query: (credentials) => ({
        url: '/chat-management/unblock',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['ChatManagement'],
    }),

    // Mute a user
    muteUser: builder.mutation<ChatManagementResponse, MuteUserRequest>({
      query: (credentials) => ({
        url: '/chat-management/mute',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['ChatManagement'],
    }),

    // Unmute a user
    unmuteUser: builder.mutation<ChatManagementResponse, { mutedUserId: string; conversationId: string }>({
      query: (credentials) => ({
        url: '/chat-management/unmute',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['ChatManagement'],
    }),

    // Report a user
    reportUser: builder.mutation<ChatManagementResponse, ReportUserRequest>({
      query: (credentials) => ({
        url: '/chat-management/report',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['ChatManagement'],
    }),

    // Delete a conversation
    deleteConversation: builder.mutation<ChatManagementResponse, DeleteConversationRequest>({
      query: (credentials) => ({
        url: '/chat-management/conversation',
        method: 'DELETE',
        body: credentials,
      }),
      invalidatesTags: ['ChatManagement'],
    }),

    // Check if user is blocked
    checkIfBlocked: builder.query<{ isBlocked: boolean }, { otherUserId: string; conversationId: string }>({
      query: ({ otherUserId, conversationId }) => ({
        url: `/chat-management/check-blocked/${otherUserId}/${conversationId}`,
        method: 'GET',
      }),
      providesTags: ['ChatManagement'],
    }),

    // Check if user is muted
    checkIfMuted: builder.query<{ isMuted: boolean }, { otherUserId: string; conversationId: string }>({
      query: ({ otherUserId, conversationId }) => ({
        url: `/chat-management/check-muted/${otherUserId}/${conversationId}`,
        method: 'GET',
      }),
      providesTags: ['ChatManagement'],
    }),

    // Check if conversation is deleted
    checkIfDeleted: builder.query<{ isDeleted: boolean }, { conversationId: string }>({
      query: ({ conversationId }) => ({
        url: `/chat-management/check-deleted/${conversationId}`,
        method: 'GET',
      }),
      providesTags: ['ChatManagement'],
    }),

    // Total unread messages for current user
    markConversationRead: builder.mutation<ChatManagementResponse, { conversationId: string }>({
      query: (body) => ({
        url: '/chat-management/unread/messages/mark-read',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['ChatManagement'],
    }),
    // Get total unread messages across all conversations
    getUnreadTotalMessages: builder.query<{ totalUnreadMessages: number }, void>({
      query: () => ({
        url: '/chat-management/unread/messages/total',
        method: 'GET',
      }),
      providesTags: ['ChatManagement'],
    }),

    // Get unread messages grouped by conversation
    getUnreadByConversation: builder.query<{ items: Array<{ conversationId: string | number; unread: number }> }, void>({
      query: () => ({
        url: '/chat-management/unread/messages/by-conversation',
        method: 'GET',
      }),
      providesTags: ['ChatManagement'],
    }),
    // Total unread notifications for current user
    getUnreadNotifications: builder.query<{ totalUnreadNotifications: number }, void>({
      query: () => ({
        url: '/notifications/unread-count',
        method: 'GET',
      }),
      transformResponse: (response: { count: number }) => ({
        totalUnreadNotifications: Number(response?.count || 0),
      }),
      providesTags: ['ChatManagement'],
    }),

    // Mark all notifications as read
    markAllNotificationsRead: builder.mutation<ChatManagementResponse, void>({
      query: () => ({
        url: '/notifications/mark-all-read',
        method: 'POST',
      }),
      invalidatesTags: ['ChatManagement'],
    }),
  }),
});
// Export hooks for use in components
export const {
  useBlockUserMutation,
  useUnblockUserMutation,
  useMuteUserMutation,
  useUnmuteUserMutation,
  useReportUserMutation,
  useDeleteConversationMutation,
  useCheckIfBlockedQuery,
  useCheckIfDeletedQuery,
  useGetUnreadTotalMessagesQuery,
  useGetUnreadByConversationQuery,
  useMarkConversationReadMutation,
  useGetUnreadNotificationsQuery,
  useMarkAllNotificationsReadMutation,
} = chatManagementApi;
