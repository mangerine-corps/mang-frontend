import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axios-base-query";
import { ProfileApi } from "./profile.service";

export const availabilityApi = createApi({
    reducerPath: "availabilityApi",
    baseQuery: axiosBaseQuery({
        baseUrl: `${process.env.API_BASE_URL}/`,
    }),
    tagTypes: ["Availability"],
    endpoints: (builder) => ({

        createAvailability: builder.mutation({
            query: (formData) => ({
                url: `/availability/create`,
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["Availability"],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(ProfileApi.util.invalidateTags(["profileMetrics", "userInfo"]));
                } catch {}
            },
        }),

        updateAvailability: builder.mutation({
            query: (formData) => ({
                url: `/availability`,
                method: "PATCH",
                body: formData,
            }),
            invalidatesTags: ["Availability"],
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(ProfileApi.util.invalidateTags(["profileMetrics", "userInfo"]));
                } catch {}
            },
        }),

        deleteAvailability: builder.mutation<any, { availabilityId: string }>({
            query: ({ availabilityId }) => ({
                url: `/availability/${availabilityId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Availability"],
        }),

        getAvailability: builder.query<any, Record<string, any> | void>({
            query: (params) => ({
                url: `/availability`,
                method: "GET",
                params: params ?? {},
            }),
            providesTags: ["Availability"],
        }),

        getCurrentAvailabilitySettings: builder.query({
            query: () => ({
                url: `/availability/current/settings`,
                method: "GET",
            }),
            providesTags: ["Availability"],
        }),
    }),
});

export const {
    useCreateAvailabilityMutation,
    useUpdateAvailabilityMutation,
    useDeleteAvailabilityMutation,
    useGetAvailabilityQuery,
    useLazyGetAvailabilityQuery,
    useGetCurrentAvailabilitySettingsQuery,
} = availabilityApi;
