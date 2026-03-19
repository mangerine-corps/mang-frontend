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
                    // Invalidate profile metrics so missing-fields and completion percent update
                    dispatch(ProfileApi.util.invalidateTags(["profileMetrics", "userInfo"]));
                } catch {}
            },
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

// Export hooks for use in components
export const {
    useCreateAvailabilityMutation,
    useGetAvailabilityMutation,
    useGetCurrentAvailabilitySettingsQuery,
} = availabilityApi;
