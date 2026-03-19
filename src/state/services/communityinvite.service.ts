import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axios-base-query";

export const CommunityInviteApi = createApi({
    reducerPath: 'CommunityInviteApi',
    baseQuery: axiosBaseQuery({
        baseUrl: process.env.API_BASE_URL + "/invites/community-invites",
        headers: {
          type: "customer",
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
