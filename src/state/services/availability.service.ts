import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { ProfileApi } from "./profile.service";

export const availabilityApi = createApi({
    reducerPath: "availabilityApi",
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
