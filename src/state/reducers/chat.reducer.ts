import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { isEmpty } from "lodash";
import { ChatMessage } from "mangarine/components/ui-components/message/ChatProvider";
import { size } from "es-toolkit/compat";

type MessageState = {
  messages: ChatMessage[];
  lastMessage: ChatMessage | any;
};

const slice = createSlice({
  name: "chats",
  initialState: {
    messages: [],
    lastMessage: {},
  } as unknown as MessageState,
  reducers: {
    setMessages: (state, { payload: { messages } }) => {
      state.messages = messages;
    },
    addMessage: (state, { payload: { message, userId, from } }) => {
      console.log('Adding message:', { message, userId, from });
      
      if (from === "frontend") {
        // Add message from frontend (user's own message)
        state.messages = !isEmpty(state.messages)
          ? [...state.messages, message]
          : [message];
        state.lastMessage = message;
      } else if (from === "backend-update") {
        // Update the last message from the current user with backend data (includes attachments)
        if (!isEmpty(state.messages)) {
          const lastMessageIndex = state.messages.length - 1;
          if (lastMessageIndex >= 0) {
            state.messages[lastMessageIndex] = message;
          }
        }
        state.lastMessage = message;
      } else if (from === "backend") {
        // Add message from backend (other user's message)
        state.messages = !isEmpty(state.messages)
          ? [...state.messages, message]
          : [message];
        state.lastMessage = message;
      }
    },
    clearLastMessage: (state) => {
      state.lastMessage = {};
    },
  },
});

export const { setMessages, addMessage, clearLastMessage } = slice.actions;

export default slice.reducer;

export const selectMessages = (state: RootState) => state.chats.messages;
export const selectLastMessage = (state: RootState) => state.chats.lastMessage;
