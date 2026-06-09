'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from 'react';
import { Socket } from 'socket.io-client';
import { useAuth } from 'mangarine/state/hooks/user.hook';
import { useAppointment } from 'mangarine/state/hooks/appointment.hook';
import { useDispatch } from 'react-redux';
import { addMessage, setMessages } from 'mangarine/state/reducers/chat.reducer';
import { updateConversationLastMessage } from 'mangarine/state/reducers/appointment.reducer';
import { uniqBy, sortBy } from 'es-toolkit/compat';
import { createSocket } from 'mangarine/state/services/socket.service';
import { toaster } from 'mangarine/components/ui/toaster';
import { useLazyGetChatHistoryQuery } from 'mangarine/state/services/chat.service';

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  isFlagged: boolean;
  isSeen: boolean;
  isEdit: boolean;
  isReply: boolean;
  isDeleted: boolean;
  parent: ChatMessage;
  conversationId: string;
  content: string;
  createdAt: string;
  attachments?: Array<{
    id: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    url: string;
    type: string;
    uploadedAt: string;
  }>;
}

export interface IncomingCall {
  conversationId: string;
  callerId: string;
  callerName: string;
  callerImage?: string;
}

export interface OutgoingCall {
  conversationId: string;
  receiverName: string;
  receiverImage?: string;
  status: 'ringing' | 'accepted' | 'rejected';
}

interface ChatContextType {
  socket: Socket | null;
  chatClient: any;
  joinChatRoom: (roomId: string) => Promise<void>;
  pagination: Record<string, any>;
  incomingCall: IncomingCall | null;
  outgoingCall: OutgoingCall | null;
  initiateCall: (conversationId: string, receiverId: string, receiverName: string, receiverImage?: string) => void;
  cancelCall: () => void;
  acceptCall: () => void;
  rejectCall: () => void;
  clearOutgoingCall: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, token: authToken } = useAuth();
  const { currentConversation } = useAppointment();
  const dispatch = useDispatch();

  const socketRef = useRef<Socket | null>(null);
  const currentRoomRef = useRef<string | null>(null);
  const callTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const historyFallbackRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [fetchChatHistory] = useLazyGetChatHistoryQuery();

  const [pagination, setPagination] = useState<Record<string, any>>({});
  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
  const [outgoingCall, setOutgoingCall] = useState<OutgoingCall | null>(null);

  // ── Socket lifecycle — recreate whenever the auth token changes ──────────
  useEffect(() => {
    if (typeof window === 'undefined' || !authToken) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      return;
    }

    // Always create a fresh socket with the current token so extraHeaders are correct
    socketRef.current?.disconnect();
    const sock = createSocket(authToken);
    socketRef.current = sock;

    // ── Chat message events ───────────────────────────────────────────────
    const handleMessageSent = (msg: ChatMessage) => {
      // Server confirmed our own message — update the optimistic entry
      if (msg.conversationId === currentRoomRef.current) {
        dispatch(addMessage({ message: msg, userId: user?.id, from: 'backend-update' }));
      }
      dispatch(updateConversationLastMessage({ conversationId: msg.conversationId, message: msg }));
    };

    const handleNewMessage = (msg: ChatMessage) => {
      // Incoming message from the other participant
      if (msg.conversationId === currentRoomRef.current) {
        dispatch(addMessage({ message: msg, userId: user?.id, from: 'backend' }));
      }
      dispatch(updateConversationLastMessage({ conversationId: msg.conversationId, message: msg }));
    };

    // Legacy event name — keep listening so old server builds still work
    const handleNewChatMessage = (msg: ChatMessage) => {
      if (msg.conversationId === currentRoomRef.current) {
        if (msg.senderId === user?.id) {
          dispatch(addMessage({ message: msg, userId: user?.id, from: 'backend-update' }));
        } else {
          dispatch(addMessage({ message: msg, userId: user?.id, from: 'backend' }));
        }
      }
      dispatch(updateConversationLastMessage({ conversationId: msg.conversationId, message: msg }));
    };

    const handleMessageError = (err: { message?: string }) => {
      toaster.create({
        description: err?.message ?? 'Message failed to send',
        type: 'error',
        closable: true,
      });
    };

    const handleMessageHistory = (history: any) => {
      // Cancel REST fallback since socket delivered the history
      if (historyFallbackRef.current) {
        clearTimeout(historyFallbackRef.current);
        historyFallbackRef.current = null;
      }

      // Handle multiple response shapes from socket:
      // history = [...] | { data: [...] } | { data: { data: [...], ...pagination } }
      let msgs: any[];
      let paginationData: Record<string, any> = {};

      if (Array.isArray(history)) {
        msgs = history;
      } else if (Array.isArray(history?.data)) {
        msgs = history.data;
        const { data: _, ...rest } = history;
        paginationData = rest;
      } else if (Array.isArray(history?.data?.data)) {
        const { data: innerData, ...rest } = history.data;
        msgs = innerData;
        paginationData = rest;
      } else if (Array.isArray(history?.messages)) {
        msgs = history.messages;
      } else {
        msgs = [];
      }

      setPagination(paginationData);
      const sorted = sortBy(uniqBy(msgs, (m: any) => m.id), (m: any) => m.createdAt);
      dispatch(setMessages({ messages: sorted }));
    };

    // ── Call signaling events ─────────────────────────────────────────────
    const handleIncomingCall = (data: IncomingCall) => setIncomingCall(data);

    const handleCallAccepted = () => {
      if (callTimeoutRef.current) clearTimeout(callTimeoutRef.current);
      setOutgoingCall((prev) => prev ? { ...prev, status: 'accepted' } : null);
    };

    const handleCallRejected = () => {
      if (callTimeoutRef.current) clearTimeout(callTimeoutRef.current);
      setOutgoingCall((prev) => prev ? { ...prev, status: 'rejected' } : null);
      setTimeout(() => setOutgoingCall(null), 2500);
    };

    const handleCallCancelled = () => setIncomingCall(null);

    sock.on('messageSent', handleMessageSent);
    sock.on('newMessage', handleNewMessage);
    sock.on('newChatMessage', handleNewChatMessage);
    sock.on('messageError', handleMessageError);
    sock.on('messageHistory', handleMessageHistory);
    sock.on('incoming-video-call', handleIncomingCall);
    sock.on('video-call-accepted', handleCallAccepted);
    sock.on('video-call-rejected', handleCallRejected);
    sock.on('video-call-cancelled', handleCallCancelled);

    sock.connect();

    return () => {
      sock.off('messageSent', handleMessageSent);
      sock.off('newMessage', handleNewMessage);
      sock.off('newChatMessage', handleNewChatMessage);
      sock.off('messageError', handleMessageError);
      sock.off('messageHistory', handleMessageHistory);
      sock.off('incoming-video-call', handleIncomingCall);
      sock.off('video-call-accepted', handleCallAccepted);
      sock.off('video-call-rejected', handleCallRejected);
      sock.off('video-call-cancelled', handleCallCancelled);
      sock.disconnect();
    };
    // Intentionally only on token/user change — conversation change is handled below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authToken, user?.id]);

  // ── Room change — load history for the newly selected conversation ───────
  useEffect(() => {
    const convId = currentConversation?.id ?? null;
    currentRoomRef.current = convId;

    if (historyFallbackRef.current) {
      clearTimeout(historyFallbackRef.current);
      historyFallbackRef.current = null;
    }

    if (!convId || !socketRef.current) return;

    dispatch(setMessages({ messages: [] }));

    const sock = socketRef.current;
    const emitHistory = () => {
      // Guard: conversation may have changed while we were waiting for connect
      if (currentRoomRef.current !== convId) return;
      sock.emit('getHistory', { conversationId: convId });

      // REST fallback: if socket doesn't deliver messageHistory within 3 s, fetch via REST
      historyFallbackRef.current = setTimeout(async () => {
        if (currentRoomRef.current !== convId) return;
        try {
          const result = await fetchChatHistory({ conversationId: convId, page: 1, limit: 50 }).unwrap();
          if (currentRoomRef.current !== convId) return;
          // Normalize to array
          const raw = result?.data ?? result;
          const msgs = Array.isArray(raw) ? raw : Array.isArray(raw?.data) ? raw.data : [];
          if (msgs.length > 0) {
            const sorted = sortBy(uniqBy(msgs, (m: any) => m.id), (m: any) => m.createdAt);
            dispatch(setMessages({ messages: sorted }));
          }
        } catch {
          // REST fallback failed — leave messages empty
        }
      }, 3000);
    };

    if (sock.connected) {
      emitHistory();
    } else {
      sock.once('connect', emitHistory);
    }

    return () => {
      if (historyFallbackRef.current) {
        clearTimeout(historyFallbackRef.current);
        historyFallbackRef.current = null;
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentConversation?.id, dispatch]);

  // ── Call actions ──────────────────────────────────────────────────────────
  const initiateCall = (
    conversationId: string,
    receiverId: string,
    receiverName: string,
    receiverImage?: string,
  ) => {
    if (!user?.id || !socketRef.current) return;
    socketRef.current.emit('initiate-video-call', {
      conversationId,
      receiverId,
      callerId: user.id,
      callerName: user.fullName,
      callerImage: user.profilePics,
    });
    setOutgoingCall({ conversationId, receiverName, receiverImage, status: 'ringing' });
  };

  const cancelCall = () => {
    if (callTimeoutRef.current) clearTimeout(callTimeoutRef.current);
    if (outgoingCall && socketRef.current) {
      socketRef.current.emit('cancel-video-call', { conversationId: outgoingCall.conversationId });
    }
    setOutgoingCall(null);
  };

  const acceptCall = () => {
    if (incomingCall && socketRef.current) {
      socketRef.current.emit('accept-video-call', { conversationId: incomingCall.conversationId });
    }
    setIncomingCall(null);
  };

  const rejectCall = () => {
    if (incomingCall && socketRef.current) {
      socketRef.current.emit('reject-video-call', { conversationId: incomingCall.conversationId });
    }
    setIncomingCall(null);
  };

  const clearOutgoingCall = () => setOutgoingCall(null);

  const joinChatRoom = async (roomId: string) => {
    socketRef.current?.emit('joinRoom', roomId);
  };

  return (
    <ChatContext.Provider
      value={{
        pagination,
        socket: socketRef.current,
        chatClient: null,
        joinChatRoom,
        incomingCall,
        outgoingCall,
        initiateCall,
        cancelCall,
        acceptCall,
        rejectCall,
        clearOutgoingCall,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within a ChatProvider');
  return context;
};
