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
      state.upcomingAppointments = {
        appointments,
        pagination,
      };
    },
    setConversations: (state, { payload: { conversations } }) => {
      state.conversations = conversations;
    },
    setCurrentConversation: (state, { payload: { conversation } }) => {
      state.currentConversation = conversation;
    },
    updateConversationLastMessage: (state, { payload: { conversationId, message } }) => {
      const idx = state.conversations.findIndex(
        (c: any) => String(c.id) === String(conversationId)
      );
      if (idx !== -1) {
        // Direct Immer mutation — avoids draft-spread issues and does NOT touch
        // currentConversation (changing that ref would trigger ChatProvider's
        // useEffect([currentConversation]) which clears messages + re-fetches history)
        state.conversations[idx].lastMessage = message;
      }
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
  updateConversationLastMessage,
} = slice.actions;

export default slice.reducer;

export const selectAppointments = (state: RootState) =>
  state.appointments.upcomingAppointments;
export const selectConversations = (state: RootState) =>
  state.appointments.conversations;
export const selectCurrentConversations = (state: RootState) =>
  state.appointments.currentConversation;
export const selectBookmarks = (state: RootState) => state.bookmark.bookmarks;
