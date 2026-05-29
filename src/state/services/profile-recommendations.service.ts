import { createApi } from '@reduxjs/toolkit/query/react';
import { ProfileRecommendationDto, GetProfileRecommendationsDto } from './types/profile-recommendations.types';
import { axiosBaseQuery } from './axios-base-query';

export const profileRecommendationsApi = createApi({
  reducerPath: 'profileRecommendationsApi',
  baseQuery: axiosBaseQuery({
    baseUrl: `${process.env.API_BASE_URL}/`,
  }),
  tagTypes: ['ProfileRecommendations'],
  endpoints: (builder) => ({
    getProfileRecommendations: builder.query<ProfileRecommendationDto[], GetProfileRecommendationsDto>({
      query: (params = {}) => ({
        url: '/users/profile-recommendations',
        method: 'GET',
        params,
      }),
      transformResponse: (response: { data: ProfileRecommendationDto[] } | ProfileRecommendationDto[]) =>
        Array.isArray(response) ? response : response.data ?? [],
      providesTags: ['ProfileRecommendations'],
    }),

    getTrendingProfiles: builder.query<ProfileRecommendationDto[], number>({
      query: (limit = 10) => ({
        url: '/users/trending-profiles',
        method: 'GET',
        params: { limit },
      }),
      transformResponse: (response: { data: ProfileRecommendationDto[] } | ProfileRecommendationDto[]) =>
        Array.isArray(response) ? response : (response as any).data ?? [],
      providesTags: ['ProfileRecommendations'],
    }),
  }),
});

export const {
  useGetProfileRecommendationsQuery,
  useGetTrendingProfilesQuery,
} = profileRecommendationsApi;

