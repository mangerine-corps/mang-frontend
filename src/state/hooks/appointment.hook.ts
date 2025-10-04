import { useSelector } from "react-redux";
import { useMemo } from "react";
import { selectBookmarks } from "../reducers/bookmark.reducer";
import {
  selectAppointments,
  selectConversations,
  selectCurrentConversations,
} from "mangarine/state/reducers/appointment.reducer";
import { selectLastMessage, selectMessages } from "../reducers/chat.reducer";

// custom hook for accessing collections and bookmarks
export const useAppointment = () => {
  const appointments = useSelector(selectAppointments);
  const bookmarks = useSelector(selectBookmarks);
  const conversations = useSelector(selectConversations);
  const currentConversation = useSelector(selectCurrentConversations);
  const messages = useSelector(selectMessages);
  const lastMessage = useSelector(selectLastMessage)

  return useMemo(
    () => ({
      appointments,
      bookmarks,
      conversations,
      currentConversation,
      messages,
      lastMessage
    }),
    [appointments, bookmarks, conversations, currentConversation, messages,lastMessage]
  );
};
