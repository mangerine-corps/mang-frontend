import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axios-base-query";

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: axiosBaseQuery({
    baseUrl: `${process.env.API_BASE_URL}/`,
  }),
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
        body: credentials
      }),
    }),
  }),
});

// Export hooks for use in components
export const { useGetChatTokenMutation, useSaveMessageMutation } = chatApi;
