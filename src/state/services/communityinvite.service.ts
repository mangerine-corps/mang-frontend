import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

export const CommunityInviteApi = createApi({
    reducerPath: 'CommunityInviteApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.API_BASE_URL + "/invites/community-invites",
        prepareHeaders: (headers, { getState }) => {
          // By default, if we have a token in the store, let's use that for authenticated requests
          const token =
            (getState() as RootState).userAuth.token ??
            (getState() as RootState).userAuth.preAuth.token;
    
          headers.set("type", "customer");
          if (token) {
            headers.set("Authorization", `Bearer ${token}`);
          }
          return headers;
        },
      }),
      endpoints: (builder)=>({
        getInviteRequests: builder.query({
            query: ({id}: {id: number})=>({
                url: '/requests',
                method: 'GET',
                params: {communityId: id}
            })
        }),
        getInviteRequest: builder.query({
            query: ({ id }: {id: number | string})=>({
                url: `/${id}`,
                method: 'GET'
            })
        }),
        acceptInviteRequest: builder.mutation({
            query: ({ id }: {id: number | string})=>({
                url: `/${id}`,
                method: 'PATCH'
            })
        }),
        deleteInviteRequest: builder.mutation({
            query: ({ id }: {id: number | string})=>({
                url: `/${id}`,
                method: 'DELETE'
            })
        }),
      createInviteRequest: builder.mutation({
        query: (body: {communityId: number, note: string, userId: string})=>({
            url: '/',
            body,
            method: 'POST'
        })
      })
      })
})

export const {useGetInviteRequestsQuery, useGetInviteRequestQuery, useAcceptInviteRequestMutation, useDeleteInviteRequestMutation, useCreateInviteRequestMutation} = CommunityInviteApi