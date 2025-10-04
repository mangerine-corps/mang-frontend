import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';
import { ProfileRecommendationDto, GetProfileRecommendationsDto } from './types/profile-recommendations.types';

export const profileRecommendationsApi = createApi({
  reducerPath: 'profileRecommendationsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.API_BASE_URL}/`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).userAuth?.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['ProfileRecommendations'],
  endpoints: (builder) => ({
    getProfileRecommendations: builder.query<ProfileRecommendationDto[], GetProfileRecommendationsDto>({
      query: (params) => ({
        url: '/users/profile-recommendations',
        method: 'GET',
        params,
      }),
      providesTags: ['ProfileRecommendations'],
    }),

    getTrendingProfiles: builder.query<ProfileRecommendationDto[], number>({
      query: (limit = 10) => ({
        url: '/users/trending-profiles',
        method: 'GET',
        params: { limit },
      }),
      providesTags: ['ProfileRecommendations'],
    }),
  }),
});

export const {
  useGetProfileRecommendationsQuery,
  useGetTrendingProfilesQuery,
} = profileRecommendationsApi;
