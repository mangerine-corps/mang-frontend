'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
// import AgoraChat from 'agora-chat';
import { io, Socket } from 'socket.io-client'; // If using Socket.IO
import { useGetChatTokenMutation } from 'mangarine/state/services/chat.service';
import { useAuth } from 'mangarine/state/hooks/user.hook';
import { socket as globalSocketInstance } from 'mangarine/state/services/socket.service';
import { useAppointment } from 'mangarine/state/hooks/appointment.hook';
import { useDispatch } from 'react-redux';
import { addMessage, clearLastMessage, setMessages } from 'mangarine/state/reducers/chat.reducer';
import { useUpdateEffect } from 'react-use';
import { isEmpty, uniqBy, sortBy, size } from 'es-toolkit/compat';



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
    createdAt: string; // From backend
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
    chatClient: any | null;
    joinChatRoom: (roomId: string) => Promise<void>;
    pagination: {};
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
    const chatClient = useRef(null);
    const { user, token: authToken } = useAuth()
    const { currentConversation, messages, lastMessage } = useAppointment()
    const [socket, setSocket] = useState<any>(null); // For Socket.IO
    const [getToken] = useGetChatTokenMutation()
    const socketRef = useRef<Socket | null>(null);
    const dispatch = useDispatch();
    const currentRoomRef = useRef<string | null>(null);
    const [pagination, setPagination] = useState({})
    const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
    const [outgoingCall, setOutgoingCall] = useState<OutgoingCall | null>(null);
    const callTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);


    useEffect(() => {
        const initializeChat = async () => {
            // 1. Get Agora Token from your NestJS backend


            // // 2. Initialize Agora Chat Client
            // console.log(process.env.AGORA_MESSAGE_KEY)
            // chatClient.current = new AgoraChat.connection({
            //     appKey: process.env.AGORA_MESSAGE_KEY,
            // });


            // chatClient.current.addEventHandler('connection&message', {

            //     onConnected: () => {
            //         console.log('Agora Chat connected');
            //         // Login to Agora Chat with the token
            //     },
            //     onDisconnected: () => {
            //         console.log('Agora Chat disconnected');
            //     },
            //     onTextMessage: (message) => {
            //         console.log('Received text message:', message);
            //         setMessages((prevMessages) => [...prevMessages, message]);
            //     },
            //     // Add other event handlers (onReceivedMessage, onPresenceChanged, etc.)
            // });
            // 3. Initialize Socket.IO (Optional)
            // const newSocket = io('http://localhost:3000'); // Your NestJS Socket.IO URL
            // setSocket(newSocket);

            // newSocket.on('receiveMessage', (message) => {
            //     console.log('Socket.IO received message:', message);
            //     // Handle messages from your NestJS backend (if you're using Socket.IO for message relay)
            // });

            return () => {
                chatClient.current.close(); // Clean up Agora Chat client on unmount
                // newSocket.disconnect(); // Disconnect Socket.IO
            };
        };

        // initializeChat();
    }, []);

    useEffect(() => {
        if (chatClient.current) {
            getToken({}).unwrap().then((payload) => {
                console.log(user.agoraId)
                const { token } = payload
                chatClient.current.open({ user: user.agoraId, accessToken: token }).then(() => {
                    console.log('Agora Chat logged in');
                }).catch(error => {
                    console.error('Agora Chat login failed:', error);
                });
            }) // Or directly call your NestJS backend
        }
    }, [chatClient.current])

    useEffect(() => {

    }, [messages])


    useEffect(() => {
        if (typeof window === 'undefined') return;

        if (!authToken) {
            if (socketRef.current?.connected) {
                socketRef.current.disconnect();
            }
            socketRef.current = null;
            return;
        }

        socketRef.current = globalSocketInstance;
        const currentSocket = socketRef.current;
        currentRoomRef.current = currentConversation?.id


        currentSocket.auth = { token: authToken, roomId: currentConversation?.id }; // Send token for backend authentication
        currentSocket.connect();

        const onConnect = () => {
            console.log('Socket.IO Connected');
            //   setIsConnected(true);
        };

        const onDisconnect = () => {
            console.log('Socket.IO Disconnected');
            //   setIsConnected(false);
            dispatch(setMessages([])); // Clear messages on disconnect
            //   currentRoomRef.current = null;
        };

        const onConnectError = (error: Error) => {
            console.error('Socket.IO Connection Error:', error);
            //   setIsConnected(false);
        };

        const onNewChatMessage = (msg: ChatMessage) => {
            console.log('Received message from backend:', msg);
            console.log('Message attachments:', msg.attachments);
            if (msg.conversationId === currentRoomRef.current) { // Only add if it's for the current room
                // Check if this is a message from the current user (sender)
                if (msg.senderId === user.id) {
                    // This is a message sent by the current user, update the existing message
                    dispatch(addMessage({ message: msg, userId: user.id, from: 'backend-update' }));
                } else {
                    // This is a message from another user, add as new message
                    dispatch(addMessage({ message: msg, userId: user.id, from: 'backend' }));
                }
            }
        };

        // Listen for message history when joining a room
        const onMessageHistory = (history: any) => {
            console.log('Message history received:', history)
            const { data, ...rest } = history.data;
            setPagination(rest);
            const newMessage = data
            const uniqueMessage = uniqBy(newMessage, (message: any) => message.id);
            const sorted = sortBy(uniqueMessage, (message) => message.createdAt)
            console.log('Sorted messages:', sorted)
            console.log('Messages with attachments:', sorted.filter(msg => msg.attachments && msg.attachments.length > 0))
            dispatch(setMessages({ messages: sorted }))
        };



        currentSocket.on('connect', onConnect);
        currentSocket.on('disconnect', onDisconnect);
        currentSocket.on('connect_error', onConnectError);
        currentSocket.on('newChatMessage', onNewChatMessage);
        currentSocket.on('messageHistory', onMessageHistory);


        return () => {
            currentSocket.off('connect', onConnect);
            currentSocket.off('disconnect', onDisconnect);
            currentSocket.off('connect_error', onConnectError);
            currentSocket.off('newChatMessage', onNewChatMessage);
            currentSocket.off('messageHistory', onMessageHistory);
            // Do not disconnect globalSocketInstance unless it's app shutdown
        };
    }, [authToken, user, currentConversation]);


    useEffect(() => {
        if (currentConversation) {
            dispatch(setMessages({ messages: [] }))
            socketRef.current.emit('getHistory', { conversationId: currentConversation.id })
        }
    }, [currentConversation])


    // Call signaling — separate from chat message lifecycle
    useEffect(() => {
        if (!user?.id || !socketRef.current) return;

        const currentSocket = socketRef.current;

        const onIncomingCall = (data: IncomingCall) => {
            setIncomingCall(data);
        };

        const onCallAccepted = (data: { conversationId: string }) => {
            if (callTimeoutRef.current) clearTimeout(callTimeoutRef.current);
            setOutgoingCall((prev) =>
                prev ? { ...prev, status: 'accepted' } : null
            );
        };

        const onCallRejected = () => {
            if (callTimeoutRef.current) clearTimeout(callTimeoutRef.current);
            setOutgoingCall((prev) =>
                prev ? { ...prev, status: 'rejected' } : null
            );
            setTimeout(() => setOutgoingCall(null), 2500);
        };

        const onCallCancelled = () => {
            setIncomingCall(null);
        };

        currentSocket.on('incoming-video-call', onIncomingCall);
        currentSocket.on('video-call-accepted', onCallAccepted);
        currentSocket.on('video-call-rejected', onCallRejected);
        currentSocket.on('video-call-cancelled', onCallCancelled);

        return () => {
            currentSocket.off('incoming-video-call', onIncomingCall);
            currentSocket.off('video-call-accepted', onCallAccepted);
            currentSocket.off('video-call-rejected', onCallRejected);
            currentSocket.off('video-call-cancelled', onCallCancelled);
        };
    }, [user?.id]);

    const initiateCall = (
        conversationId: string,
        receiverId: string,
        receiverName: string,
        receiverImage?: string,
    ) => {
        if (!user?.id || !socketRef.current) return;
        // Notify the other user — caller goes straight to the room
        socketRef.current.emit('initiate-video-call', {
            conversationId,
            receiverId,
            callerId: user.id,
            callerName: user.fullName,
            callerImage: user.profilePics,
        });
    };

    const cancelCall = () => {
        if (callTimeoutRef.current) clearTimeout(callTimeoutRef.current);
        setOutgoingCall(null);
    };

    const acceptCall = () => {
        if (incomingCall) {
            socketRef.current?.emit('accept-video-call', {
                conversationId: incomingCall.conversationId,
            });
        }
        setIncomingCall(null);
    };

    const rejectCall = () => {
        if (incomingCall) {
            socketRef.current?.emit('reject-video-call', {
                conversationId: incomingCall.conversationId,
            });
        }
        setIncomingCall(null);
    };

    const clearOutgoingCall = () => {
        setOutgoingCall(null);
    };

    const joinChatRoom = async (roomId: string) => {
        if (!chatClient) return;
        try {
            await chatClient.current.joinGroup(roomId); // For group chats
            console.log(`Joined group chat: ${roomId}`);
        } catch (error) {
            console.error(`Failed to join group chat ${roomId}:`, error);
        }
        // If using Socket.IO, also join the room on the backend
        socket?.emit('joinRoom', roomId);
    };


    return (
        <ChatContext.Provider
            value={{
                pagination,
                socket: socketRef.current,
                chatClient,
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
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};