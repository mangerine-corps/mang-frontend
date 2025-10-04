import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";

export const ProfileApi = createApi({
  reducerPath: "ProfileApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.API_BASE_URL}`,
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
  tagTypes: [
    "skills",
    "languages",
    "education",
    "experience",
    "works",
    "consultancy",
    "userInfo",
    "profileMetrics",
  ],

  endpoints: (builder) => ({
    updateProfilePicture: builder.mutation({
      query: (credentials) => ({
        url: "users/update/profile/pics",
        method: "POST",
        body: credentials,
        formData: true,
      }),
      invalidatesTags: ["userInfo", "profileMetrics"],
    }),
    updateProfileBanner: builder.mutation({
      query: (credentials) => ({
        url: "users/update/profile/banner",
        method: "POST",
        body: credentials,
        formData: true,
      }),
      invalidatesTags: ["userInfo", "profileMetrics"],
    }),
    updateProfileInfo: builder.mutation({
      query: (credentials) => ({
        url: "users/update/profile/info",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["userInfo", "profileMetrics"],
    }),
    updateContactInfo: builder.mutation({
      query: (credentials) => ({
        url: "users/update/contact/info",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["userInfo", "profileMetrics"],
    }),
    blockUser: builder.mutation({
      query: (credentials) => ({
        url: "users/block",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["userInfo"],
    }),
    unblockUser: builder.mutation({
      query: (credentials) => ({
        url: "users/unblock",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["userInfo"],
    }),

    reportUser: builder.mutation({
      query: ({ postId, userId, reportDetails }) => ({
        url: `users/${userId}/report`,
        method: "POST",
        body: { userId, postId, reportDetails },
      }),
      // invalidatesTags: (result, error, { postId }) => [
      //   { type: "Post", id: postId },
      // ],
    }),
    updateProfileVideo: builder.mutation({
      query: (credentials) => ({
        url: "users/update/profile/video",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["userInfo", "profileMetrics"],
    }),
    addOnboardingInfo: builder.mutation({
      query: (credentials) => ({
        url: "users/customer/onboarding",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["userInfo", "profileMetrics"],
    }),
    addSkill: builder.mutation({
      query: (credentials) => ({
        url: "users/add/skill",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["skills", "userInfo"],
    }),
    deleteSkill: builder.mutation({
      query: (id) => ({
        url: `users/delete/skill/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["skills", "userInfo"],
    }),
    getSkills: builder.query({
      query: ({ profileId }: { profileId?: string } = {}) => ({
        url: `users/get/skills${profileId ? `?profileId=${profileId}` : ""}`,
      }),
      providesTags: ["skills"],
    }),
    addLanguage: builder.mutation({
      query: (credentials) => ({
        url: "users/add/language",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["languages", "userInfo"],
    }),
    deleteLanguage: builder.mutation({
      query: (id) => ({
        url: `users/delete/language/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["languages", "userInfo"],
    }),
    getLanguages: builder.query({
      query: ({ profileId }: { profileId?: string } = {}) => ({
        url: `users/get/languages${profileId ? `?profileId=${profileId}` : ""}`,
      }),
      providesTags: ["languages"],
    }),
    getUserInfo: builder.query({
      query: ({ profileId }: { profileId?: string } = {}) => ({
        url: profileId ? `users/get/info/?id=${profileId}` : `users/get/`,
      }),
      providesTags: ["userInfo"],
    }),
    getBlockedUser: builder.query({
      query: ({ userId }: { userId?: string } = {}) => ({
        url: userId ? `users/get/is-blocked/?id=${userId}` : `users/get/`,
      }),
      providesTags: ["userInfo"],
    }),
    getMissingFields: builder.query({
      query: () => ({
        url: `auth/profile/missing-fields`,
      }),
      // Provide a dedicated tag to guarantee refetch after relevant mutations
      providesTags: ["profileMetrics", "userInfo"],
    }),
    getProfileCompletion: builder.query({
      query: () => ({
        url: `auth/profile/completion`,
      }),
      providesTags: ["profileMetrics", "userInfo"],
    }),
    getblockedUser: builder.query({
      query: (id) => ({
        url: `users/is-blocked/${id}`,
      }),
      providesTags: ["userInfo"],
    }),
    addConsultingService: builder.mutation({
      query: (credentials) => ({
        url: "users/add/consultancy",
        method: "POST",
        body: credentials,
        formData: true,
      }),
      invalidatesTags: ["consultancy"],
    }),
    editConsultingService: builder.mutation({
      query: ({ id, credentials }: { id: string; credentials: FormData }) => ({
        url: `users/edit/consultancy/${id}`,
        method: "PATCH",
        body: credentials,
        formData: true,
      }),
      invalidatesTags: ["consultancy", "userInfo"],
    }),
    deleteConsultingService: builder.mutation({
      query: (id) => ({
        url: `users/delete/consultancy/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["consultancy"],
    }),
    getConsultingServices: builder.query({
      query: ({ profileId }: { profileId?: string } = {}) => ({
        url: `users/get/consultancy${profileId ? `?profileId=${profileId}` : ""}`,
      }),
      providesTags: ["consultancy"],
    }),
    addEducation: builder.mutation({
      query: (credentials) => ({
        url: "education/create/",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["education", "userInfo"],
    }),
    deleteEducation: builder.mutation({
      query: (id) => ({
        url: `education/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["education", "userInfo"],
    }),
    getEducation: builder.query({
      query: ({ profileId }: { profileId?: string } = {}) => ({
        url: `education/get${profileId ? `?profileId=${profileId}` : ""}`,
      }),
      providesTags: ["education"],
    }),
    addExperience: builder.mutation({
      query: (credentials) => ({
        url: "experience/create/",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["experience", "userInfo"],
    }),
    deleteExperience: builder.mutation({
      query: (id) => ({
        url: `experience/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["experience", "userInfo"],
    }),
    getExperience: builder.query({
      query: ({ profileId }: { profileId?: string } = {}) => ({
        url: `experience/get${profileId ? `?profileId=${profileId}` : ""}`,
      }),
      providesTags: ["experience"],
    }),
    addWork: builder.mutation({
      query: (credentials) => ({
        url: "work/create/",
        method: "POST",
        body: credentials,
        formData: true,
      }),
      invalidatesTags: ["works", "userInfo"],
    }),
    editWork: builder.mutation({
      query: ({ workId, credentials }) => ({
        url: `work/edit/${workId}`,
        method: "PATCH",
        body: credentials,
        formData: true,
      }),
      invalidatesTags: ["works", "userInfo"],
    }),
    deleteWork: builder.mutation({
      query: (id) => ({
        url: `work/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["works", "userInfo"],
    }),
    getWork: builder.query({
      query: ({ profileId }: { profileId?: string } = {}) => ({
        url: `work/get${profileId ? `?profileId=${profileId}` : ""}`,
      }),
      providesTags: ["works"],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetUserInfoQuery,
  useLazyGetUserInfoQuery,
  useGetMissingFieldsQuery,
  useUpdateProfileBannerMutation,
  useUpdateProfilePictureMutation,
  useUpdateProfileVideoMutation,
  useUpdateProfileInfoMutation,
  useAddOnboardingInfoMutation,
  useAddSkillMutation,
  useDeleteSkillMutation,
  useGetSkillsQuery,
  useAddLanguageMutation,
  useDeleteLanguageMutation,
  useGetLanguagesQuery,
  useAddEducationMutation,
  useDeleteEducationMutation,
  useGetEducationQuery,
  useAddExperienceMutation,
  useDeleteExperienceMutation,
  useGetExperienceQuery,
  useAddWorkMutation,
  useDeleteWorkMutation,
  useGetWorkQuery,
  useEditWorkMutation,
  useAddConsultingServiceMutation,
  useEditConsultingServiceMutation,
  useDeleteConsultingServiceMutation,
  useGetConsultingServicesQuery,
  useUpdateContactInfoMutation,
  useBlockUserMutation,
  useUnblockUserMutation,
  useGetProfileCompletionQuery,
  useReportUserMutation,
  useGetblockedUserQuery,
  
} = ProfileApi;
