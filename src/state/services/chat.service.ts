import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

export const chatApi = createApi({
  reducerPath: "chatApi",
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
