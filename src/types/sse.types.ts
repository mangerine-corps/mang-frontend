// SSE Types based on backend implementation

export interface NotificationData {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: any;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  category?: string;
  timestamp: Date | string;
  read?: boolean;
  metadata?: Record<string, any>;
}

export interface SSEEvent {
  type: 'connection' | 'notification' | 'heartbeat' | 'error';
  message?: string;
  data?: NotificationData;
  timestamp?: string;
}

export interface NotificationFilter {
  type?: string;
  category?: string;
  priority?: string;
}

export interface SSEConnectionOptions {
  /**
   * Connection mode:
   * - 'public': Public access (webhook-friendly, no auth required)
   * - 'secure': Authenticated access (requires token)
   * - 'admin': Admin access (requires admin token)
   * - 'broadcast': Broadcast notifications (no auth required)
   */
  mode?: 'public' | 'secure' | 'admin' | 'broadcast';
  
  /** JWT token for authentication (required for secure/admin modes) */
  token?: string;
  
  /** Filters for notifications */
  filters?: NotificationFilter;
  
  /** Auto-reconnect on connection loss */
  autoReconnect?: boolean;
  
  /** Reconnection delay in milliseconds */
  reconnectDelay?: number;
  
  /** Maximum number of reconnection attempts */
  maxReconnectAttempts?: number;
  
  /** Base URL for SSE endpoints */
  baseUrl?: string;
}

export interface SSEConnectionState {
  /** Current connection status */
  status: 'disconnected' | 'connecting' | 'connected' | 'reconnecting' | 'error';
  
  /** Latest notifications received */
  notifications: NotificationData[];
  
  /** Connection error if any */
  error?: string;
  
  /** Number of reconnection attempts made */
  reconnectAttempts: number;
  
  /** Last heartbeat timestamp */
  lastHeartbeat?: Date;
  
  /** Total notifications received in this session */
  totalReceived: number;
}

export type SSEEventHandler = (event: SSEEvent) => void;
export type NotificationHandler = (notification: NotificationData) => void;
export type ConnectionStatusHandler = (status: SSEConnectionState['status']) => void;
export type ErrorHandler = (error: string) => void;