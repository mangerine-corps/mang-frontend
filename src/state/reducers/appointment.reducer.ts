import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { isEmpty } from "lodash";

type BookmarkState = {
  bookmarks: any[];
  upcomingAppointments: {
    appointments: any[];
    pagination: {};
  };
  conversations: any[];
  currentConversation: any;
};

const slice = createSlice({
  name: "appointments",
  initialState: {
    bookmarks: [],
    upcomingAppointments: { appointments: [], pagination: {} },
    conversations: [],
    currentConversation: {},
  } as unknown as BookmarkState,
  reducers: {
    setAppointments: (state, { payload: { appointments, pagination } }) => {
      console.log(appointments, pagination);
      state.upcomingAppointments = {
        appointments,
        pagination,
      };
    },
    setConversations: (state, { payload: { conversations } }) => {
      console.log(conversations,'inside state')
      state.conversations = conversations;
    },
    setCurrentConversation: (state, { payload: { conversation } }) => {
      state.currentConversation = conversation;
    },

    setBookmarks: (state, { payload: { bookmarks } }) => {
      state.bookmarks = bookmarks;
    },
  },
});

export const {
  setAppointments,
  setBookmarks,
  setConversations,
  setCurrentConversation,
} = slice.actions;

export default slice.reducer;

export const selectAppointments = (state: RootState) =>
  state.appointments.upcomingAppointments;
export const selectConversations = (state: RootState) =>
  state.appointments.conversations;
export const selectCurrentConversations = (state: RootState) =>
  state.appointments.currentConversation;
export const selectBookmarks = (state: RootState) => state.bookmark.bookmarks;
