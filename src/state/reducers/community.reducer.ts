import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface Community {
  users: any;
  id: number;
  name: string;
  isPrivate: boolean;
  category: string;
  description: string;
  rules: string;
  image: string;
  createdAt: number | Date;
  updatedAt: number | Date;
  followers: any[];
  creator: any;
  questionnaire: string;
  updatedGroup: null;
  recommendedCommunities: Community[];
}

interface CommunityState {
  all: Community[];
  created: Community[];
  joined: Community[];
  trending: Community[];
  recommended: Community[];
  updatedGroup: Community[]; // Assuming updatedUser is an array of Community objects
  recommendedCommunities: Community[];
}

const slice = createSlice({
  name: "community",
  initialState: {
    all: [],
    created: [],
    joined: [],
    trending: [],
    recommended: [],
    recommendedCommunities: [],
    // recommended: Community[];
  } as CommunityState,
  reducers: {
    setAll: (state, action: PayloadAction<Community[]>) => {
      state.all = action.payload;
    },

    setJoined: (state, action: PayloadAction<Community[]>) => {
      state.joined = action.payload;
    },
    setrecommendedCommunities: (state, action: PayloadAction<Community[]>) => {
      state.recommendedCommunities = action.payload;
    },
    setCreated: (state, action: PayloadAction<Community[]>) => {
      state.created = action.payload;
    },
    // setUpdatedUser: (state, action: PayloadAction<Community>) => {
    //   state.updatedUser = action.payload;
    // },
 

 
    setTrending: (state, action: PayloadAction<Community[]>) => {
      state.trending = action.payload;
    },

    setRecommended: (state, action: PayloadAction<Community[]>) => {
      state.recommended = action.payload;
    },

    joinCommunity: (state, action: PayloadAction<Community>) => {
      const indx = state.joined.findIndex((c) => c.id == action.payload.id);
      if (indx == -1) {
        state.joined = [action.payload, ...state.joined];
        const cloneA = [...state.all];
        const indexA = cloneA.findIndex((c) => c.id == action.payload.id);
        if (indexA !== -1) {
          cloneA[indexA] = action.payload;
          state.all = cloneA;
        }
      }
    },

    leaveCommunity: (state, action: PayloadAction<Community>) => {
      state.joined = state.joined.filter((c) => action.payload.id !== c.id);
    },

    addCommunity: (state, { payload: { community } }) => {
      state.all = [community, ...state.all];
      state.joined = [community, ...state.joined];
      state.created = [community, ...state.created];
    },
  },
});

export const {
  setAll,
  setJoined,
  setCreated,
  setrecommendedCommunities,
  setTrending,
  joinCommunity,
  leaveCommunity,
  addCommunity,
} = slice.actions;
export default slice.reducer;

export const selectAll = (state: RootState) => state.community.all;
export const selectCreated = (state: RootState) => state.community.created;
export const selectJoined = (state: RootState) => state.community.joined;
export const selectRecommendedCommunities = (state: RootState) =>
  state.community.recommendedCommunities;
export const selectTrending = (state: RootState) => state.community.trending;
