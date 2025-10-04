export interface ProfileRecommendationDto {
  id: string;
  fullName: string;
  title?: string;
  bio?: string;
  profilePics?: string;
  profileBanner?: string;
  interests?: string[];
  skills?: string[];
  languages?: string[];
  followerCount: number;
  followingCount: number;
  isConsultant?: boolean;
  recommendationScore: number;
  reason?: string;
  commonInterestsCount?: number;
  commonGroupsCount?: number;
  commonPostLikesCount?: number;
}

export interface GetProfileRecommendationsDto {
  limit?: number;
  offset?: number;
  userType?: string;
  isConsultant?: boolean;
}
