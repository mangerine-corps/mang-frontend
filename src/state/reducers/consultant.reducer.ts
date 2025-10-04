import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

// consultant interface
export interface Consultant {
  id: string;
  fullName: string;
  businessName?: string;
  profilePics: string;
  profession: string;
  language: string;
  location: string;
  bio: string;
  isFavorited?: boolean;
  isBlocked?: boolean;
  reportCount?: number;
  status?: boolean;
  followerCount?: number;
  followingCount?: number;
  timeRangeDisplay?: string;
  dateDisplay?: string;
}

// state interface
interface ConsultantState {
  consultants: Consultant[];
  selectedConsultant: Consultant | null;
  favoriteConsultant: Consultant[]; // ✅ only full consultant objects
  reports: Record<string, any>;
  blockedConsultant: boolean;
  isStateBlocked: boolean;
  upcomingConsultation: Consultant[];
}

// initial state
const initialState: ConsultantState = {
  consultants: [],
  selectedConsultant: null,
  favoriteConsultant: [],
  reports: {},
  blockedConsultant: false,
  isStateBlocked: false,
  upcomingConsultation: [],
};

// slice definition
const consultantSlice = createSlice({
  name: "consultants",
  initialState,
  reducers: {
    setUpcomingConsultation: (state, action: PayloadAction<Consultant[]>) => {
      state.upcomingConsultation = action.payload;
    },

    setConsultants: (state, action: PayloadAction<Consultant[]>) => {
      state.consultants = action.payload;
    },

    selectConsultant: (state, action: PayloadAction<string>) => {
      state.selectedConsultant =
        state.consultants.find((c) => c.id === action.payload) || null;
    },

    setIsStateBlocked: (state, action: PayloadAction<boolean>) => {
      state.isStateBlocked = action.payload;
    },

    setBlockedConsultant: (
      state,
      action: PayloadAction<{ id: string; isBlocked: boolean }>
    ) => {
      const { id, isBlocked } = action.payload;
      const consultant = state.consultants.find((c) => c.id === id);
      if (consultant) {
        consultant.isBlocked = isBlocked;
        if (isBlocked) {
          consultant.isFavorited = false;
          // also remove from favorites if present
          state.favoriteConsultant = state.favoriteConsultant.filter(
            (fav) => fav.id !== id
          );
        }
      }
    },

    // ✅ set favorites from API query
    setFavoriteConsultant: (state, action: PayloadAction<Consultant[]>) => {
      state.favoriteConsultant = action.payload;
    },

    // optional manual add/remove (if you want local updates too)
    addFavoriteConsultant: (state, action: PayloadAction<Consultant>) => {
      if (!state.favoriteConsultant.find((c) => c.id === action.payload.id)) {
        state.favoriteConsultant.push({ ...action.payload, isFavorited: true });
      }
    },

    unfavoriteConsultant: (state, action: PayloadAction<string>) => {
      state.favoriteConsultant = state.favoriteConsultant.filter(
        (c) => c.id !== action.payload
      );
      const consultant = state.consultants.find((c) => c.id === action.payload);
      if (consultant) consultant.isFavorited = false;
    },

    reportConsultant: (
      state,
      action: PayloadAction<{ consultantId: string; reportDetails: any }>
    ) => {
      state.reports[action.payload.consultantId] = action.payload.reportDetails;
      const consultant = state.consultants.find(
        (c) => c.id === action.payload.consultantId
      );
      if (consultant) {
        consultant.reportCount = (consultant.reportCount || 0) + 1;
      }
    },
  },
});

// Actions
export const {
  setConsultants,
  selectConsultant,
  addFavoriteConsultant,
  unfavoriteConsultant,
  reportConsultant,
  setBlockedConsultant,
  setIsStateBlocked,
  setUpcomingConsultation,
  setFavoriteConsultant, // ✅ expose API-driven favorite setter
} = consultantSlice.actions;

export default consultantSlice.reducer;

// Selectors
export const selectConsultants = (state: RootState) =>
  state.consultants.consultants;

export const selectFavoriteConsultant = (state: RootState) =>
  state.consultants.favoriteConsultant;

export const selectSelectedConsultant = (state: RootState) =>
  state.consultants.selectedConsultant;

export const selectConsultantReports = (state: RootState) =>
  state.consultants.reports;

export const selectIsStateBlocked = (state: RootState) =>
  state.consultants.isStateBlocked;

export const selectBlockedConsultant = (state: RootState) =>
  state.consultants.blockedConsultant;

export const selectUpcomingConsultation = (state: RootState) =>
  state.consultants.upcomingConsultation;
