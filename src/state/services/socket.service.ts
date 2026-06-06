import { io, Socket } from 'socket.io-client';

const isBrowser = typeof window !== 'undefined';

/**
 * Creates a new authenticated socket connection.
 * extraHeaders are baked in at creation time (used during the HTTP upgrade
 * handshake) so we must pass the token here, not patch it afterwards.
 */
export function createSocket(token: string): Socket {
  return io(process.env.API_BASE_URL!, {
    autoConnect: false,
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 100000,
    extraHeaders: {
      Authorization: `Bearer ${token}`,
      token,
    },
    auth: { token },
  });
}

// Legacy singleton kept so any import that references it doesn't break.
// New code should call createSocket(token) instead.
export const socket: Socket = isBrowser
  ? io(process.env.API_BASE_URL!, {
      autoConnect: false,
      transports: ['websocket', 'polling'],
    })
  : ({} as Socket);
