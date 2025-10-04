// src/services/socket.ts
import { io, Socket } from 'socket.io-client';

const isBrowser = typeof window !== 'undefined';

export const socket: Socket = isBrowser
  ? io(process.env.API_BASE_URL, {
      autoConnect: false, // Important: control connection manually
      transports: ['websocket', 'polling'],
    })
  : ({} as Socket);