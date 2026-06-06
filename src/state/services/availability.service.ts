import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axios-base-query";
import { ProfileApi } from "./profile.service";

export const availabilityApi = createApi({
    reducerPath: "availabilityApi",
    baseQuery: axiosBaseQuery({
        baseUrl: `${process.env.API_BASE_URL}/`,
    }),
    endpoints: (builder) => ({

        createAvailability: builder.mutation({
            query: (formData) => ({
                url: `/availability/create`,
                method: "POST",
                body: formData,
            }),
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
        }),

        getAvailability: builder.mutation({
            query: (formData) => ({
                url: `/availability?`,
                method: "GET",
                params: formData,
            }),
        }),

        getCurrentAvailabilitySettings: builder.query({
            query: () => ({
                url: `/availability/current/settings`,
                method: "GET",
            }),
        }),
    }),
});

export const {
    useCreateAvailabilityMutation,
    useUpdateAvailabilityMutation,
    useDeleteAvailabilityMutation,
    useGetAvailabilityMutation,
    useGetCurrentAvailabilitySettingsQuery,
} = availabilityApi;
