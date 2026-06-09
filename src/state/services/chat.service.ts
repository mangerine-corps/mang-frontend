import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axios-base-query";

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: axiosBaseQuery({
    baseUrl: `${process.env.API_BASE_URL}/`,
  }),
  tagTypes: ["ChatHistory"],
  endpoints: (builder) => ({
    getChatToken: builder.mutation({
      query: () => ({
        url: `/chat/token`,
        method: "GET",
      }),
    }),
    saveMessage: builder.mutation({
      query: (credentials) => ({
        url: `/chat/save`,
        method: 'POST',
        body: credentials,
      }),
    }),
    getChatHistory: builder.query<any, { conversationId: string; page?: number; limit?: number }>({
      query: ({ conversationId, page = 1, limit = 50 }) => ({
        url: `/chat/history`,
        method: "GET",
        params: { conversationId, page, limit },
      }),
      providesTags: (result, error, { conversationId }) => [
        { type: "ChatHistory", id: conversationId },
      ],
    }),
    markAsSeen: builder.mutation<any, { conversationId: string }>({
      query: (body) => ({
        url: `/chat/seen`,
        method: "PATCH",
        body,
      }),
    }),
    editMessage: builder.mutation<any, { messageId: string; content: string }>({
      query: (body) => ({
        url: `/chat/edit`,
        method: "PATCH",
        body,
      }),
    }),
    deleteMessage: builder.mutation<any, { id: string; userId: string }>({
      query: ({ id, userId }) => ({
        url: `/chat/${id}/${userId}`,
        method: "DELETE",
      }),
    }),
    flagMessage: builder.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: `/chat/flag/${id}`,
        method: "PATCH",
      }),
    }),
  }),
});

// Export hooks for use in components
export const {
  useGetChatTokenMutation,
  useSaveMessageMutation,
  useGetChatHistoryQuery,
  useLazyGetChatHistoryQuery,
  useMarkAsSeenMutation,
  useEditMessageMutation,
  useDeleteMessageMutation,
  useFlagMessageMutation,
} = chatApi;
