# SSE (Server-Sent Events) Notification System

This guide explains how to use the Server-Sent Events notification system in the frontend to receive real-time notifications from the backend.

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Available Hooks](#available-hooks)
3. [Connection Modes](#connection-modes)
4. [Components](#components)
5. [Toast Integration](#toast-integration)
6. [Examples](#examples)
7. [Best Practices](#best-practices)

## 🚀 Quick Start

### Basic Usage

```tsx
import { useSSENotifications } from '../state/hooks/useSSENotifications';
import { useAuth } from '../state/hooks/user.hook';

function MyComponent() {
  const { user, token } = useAuth();
  
  const {
    notifications,
    unreadCount,
    isConnected,
    connect,
    disconnect
  } = useSSENotifications({
    userId: user?.id,
    options: {
      mode: 'secure',
      token: token
    },
    onNotification: (notification) => {
      console.log('New notification:', notification);
    }
  });

  return (
    <div>
      <p>Connection: {isConnected ? 'Connected' : 'Disconnected'}</p>
      <p>Unread notifications: {unreadCount}</p>
    </div>
  );
}
```

### Using the Context Provider

```tsx
import { SSENotificationProvider } from '../contexts/SSENotificationContext';
import { SSENotificationDisplay } from '../components/SSENotificationDisplay';

function App() {
  const { user, token } = useAuth();

  return (
    <SSENotificationProvider
      userId={user?.id}
      options={{ mode: 'secure', token }}
    >
      <SSENotificationDisplay />
    </SSENotificationProvider>
  );
}
```

## 🔧 Available Hooks

### 1. `useSSENotifications` - Main Hook

The primary hook for SSE connections with full control:

```tsx
const {
  // State
  status,
  notifications,
  error,
  reconnectAttempts,
  lastHeartbeat,
  totalReceived,
  
  // Computed
  isConnected,
  isConnecting,
  hasError,
  unreadCount,
  
  // Actions
  connect,
  disconnect,
  reconnect,
  clearNotifications,
  markAsRead,
  
  // Getters
  getUnreadNotifications,
  getNotificationsByType
} = useSSENotifications(params);
```

### 2. `usePaymentNotifications` - Payment Specific

For payment-related notifications (Stripe webhooks):

```tsx
const paymentHook = usePaymentNotifications({
  userId: user?.id,
  options: { mode: 'public' }, // Public mode for webhooks
  onNotification: (notification) => {
    if (notification.data?.status === 'succeeded') {
      showSuccessToast('Payment successful!');
    }
  }
});
```

### 3. `useAppointmentNotifications` - Appointment Specific

For appointment updates and reminders:

```tsx
const appointmentHook = useAppointmentNotifications({
  userId: user?.id,
  options: { mode: 'public' },
  onNotification: (notification) => {
    if (notification.data?.type === 'reminder') {
      showReminderToast(notification);
    }
  }
});
```

### 4. `useBroadcastNotifications` - System Announcements

For system-wide announcements:

```tsx
const broadcastHook = useBroadcastNotifications({
  onNotification: (notification) => {
    showSystemAnnouncement(notification);
  }
});
```

### 5. `useSSEWithToast` - With Toast Integration

Automatically shows toast notifications:

```tsx
const sseHook = useSSEWithToast({
  userId: user?.id,
  options: { mode: 'secure', token },
  showToast: (notification) => {
    toast({
      title: notification.title,
      description: notification.message,
      status: 'info'
    });
  },
  autoMarkAsRead: true
});
```

## 🔐 Connection Modes

### 1. Public Mode (`'public'`)
- **Use case**: Webhook-triggered notifications (Stripe, system reminders)
- **Authentication**: Optional (token can be provided)
- **Endpoint**: `/notifications/stream/:userId`

```tsx
options: {
  mode: 'public',
  token: token // optional
}
```

### 2. Secure Mode (`'secure'`)
- **Use case**: Authenticated user sessions
- **Authentication**: Required (JWT token)
- **Endpoint**: `/notifications/stream/secure/:userId`

```tsx
options: {
  mode: 'secure',
  token: token // required
}
```

### 3. Admin Mode (`'admin'`)
- **Use case**: Admin monitoring of all notifications
- **Authentication**: Required (Admin JWT token)
- **Endpoint**: `/notifications/stream/admin/all`

```tsx
options: {
  mode: 'admin',
  token: adminToken // required
}
```

### 4. Broadcast Mode (`'broadcast'`)
- **Use case**: System announcements for all users
- **Authentication**: None required
- **Endpoint**: `/notifications/stream/broadcast`

```tsx
options: {
  mode: 'broadcast'
}
```

## 🎨 Components

### SSENotificationDisplay

A complete notification display component:

```tsx
<SSENotificationDisplay
  maxItems={10}           // Maximum notifications to show
  showOnlyUnread={false}  // Show only unread notifications
  allowDismiss={true}     // Allow dismissing notifications
  height="400px"          // Height of the scrollable area
/>
```

### Using with Context

```tsx
import { useSSENotificationContext } from '../contexts/SSENotificationContext';

function MyNotificationComponent() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    isConnected
  } = useSSENotificationContext();

  return (
    <div>
      <h3>Notifications ({unreadCount} unread)</h3>
      <div>Status: {isConnected ? '🟢' : '🔴'}</div>
      {notifications.map(notification => (
        <div key={notification.id}>
          <h4>{notification.title}</h4>
          <p>{notification.message}</p>
          {!notification.read && (
            <button onClick={() => markAsRead(notification.id)}>
              Mark as Read
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
```

## 🍞 Toast Integration

### Basic Toast Integration

```tsx
import { createCombinedNotificationHandler } from '../utils/sseToastIntegration';
import { useToast } from '@chakra-ui/react';

function MyComponent() {
  const toast = useToast();
  
  const notificationHandler = createCombinedNotificationHandler(
    (options) => {
      toast({
        title: options.title,
        description: options.description,
        status: options.status,
        duration: options.duration,
        isClosable: options.isClosable
      });
    },
    {
      enableBrowserNotifications: true,
      toastOptions: {
        priorityFilter: ['high', 'urgent'] // Only show high priority as toasts
      }
    }
  );

  const sseHook = useSSENotifications({
    userId: user?.id,
    options: { mode: 'secure', token },
    onNotification: notificationHandler
  });
}
```

### Custom Toast Handlers

```tsx
import { 
  createPaymentToastHandler,
  createAppointmentToastHandler,
  createUrgentNotificationHandler
} from '../utils/sseToastIntegration';

// Payment-specific toasts
const paymentHandler = createPaymentToastHandler(showToast);

// Appointment-specific toasts
const appointmentHandler = createAppointmentToastHandler(showToast);

// Only urgent notifications
const urgentHandler = createUrgentNotificationHandler(showToast);
```

## 📱 Browser Notifications

Enable native browser notifications:

```tsx
import { 
  requestNotificationPermission,
  showBrowserNotification 
} from '../utils/sseToastIntegration';

// Request permission
const hasPermission = await requestNotificationPermission();

// Show browser notification
if (hasPermission) {
  showBrowserNotification(notification);
}
```

## 🎯 Real-World Examples

### 1. Payment Confirmation Flow

```tsx
function PaymentPage() {
  const { user } = useAuth();
  
  // Listen for payment webhooks (public mode)
  usePaymentNotifications({
    userId: user?.id,
    options: { mode: 'public' },
    onNotification: (notification) => {
      if (notification.data?.status === 'succeeded') {
        // Redirect to success page
        router.push('/payment-success');
      } else if (notification.data?.status === 'failed') {
        // Show error message
        showErrorMessage('Payment failed');
      }
    }
  });
}
```

### 2. Appointment Reminders

```tsx
function AppointmentDashboard() {
  const { user } = useAuth();
  
  useAppointmentNotifications({
    userId: user?.id,
    options: { mode: 'public' },
    onNotification: (notification) => {
      if (notification.data?.type === 'reminder') {
        // Show reminder popup
        showAppointmentReminder(notification.data.appointmentData);
      } else if (notification.data?.type === 'cancelled') {
        // Update UI to reflect cancellation
        updateAppointmentStatus(notification.data.appointmentId, 'cancelled');
      }
    }
  });
}
```

### 3. Admin Monitoring

```tsx
function AdminDashboard() {
  const { adminToken } = useAdminAuth();
  
  const {
    notifications,
    totalReceived
  } = useAdminNotifications(adminToken, {
    onNotification: (notification) => {
      // Log all notifications for monitoring
      console.log('System notification:', notification);
      
      // Alert on critical notifications
      if (notification.priority === 'urgent') {
        showCriticalAlert(notification);
      }
    }
  });

  return (
    <div>
      <h2>System Monitoring</h2>
      <p>Total notifications processed: {totalReceived}</p>
      <SSENotificationDisplay maxItems={50} />
    </div>
  );
}
```

## ✅ Best Practices

### 1. Connection Management

```tsx
// ✅ Good: Use appropriate mode for use case
useSSENotifications({
  userId: user?.id,
  options: {
    mode: 'public',  // For webhook notifications
    autoReconnect: true,
    maxReconnectAttempts: 5
  }
});

// ❌ Bad: Using secure mode for webhook notifications
options: { mode: 'secure' } // Won't work for webhooks
```

### 2. Error Handling

```tsx
// ✅ Good: Handle connection errors
const sseHook = useSSENotifications({
  // ... other options
  onError: (error) => {
    console.error('SSE Error:', error);
    // Show user-friendly error message
    showErrorToast('Connection lost. Retrying...');
  }
});
```

### 3. Performance

```tsx
// ✅ Good: Limit notification history
<SSENotificationDisplay 
  maxItems={20}  // Reasonable limit
  height="400px" // Fixed height for scrolling
/>

// ✅ Good: Filter notifications appropriately
options: {
  filters: {
    type: 'payment',      // Only payment notifications
    priority: 'high'      // Only high priority
  }
}
```

### 4. User Experience

```tsx
// ✅ Good: Progressive enhancement
const [enableNotifications, setEnableNotifications] = useState(false);

// Ask user permission before enabling
const handleEnableNotifications = async () => {
  const hasPermission = await requestNotificationPermission();
  if (hasPermission) {
    setEnableNotifications(true);
  }
};
```

### 5. Cleanup

```tsx
// ✅ Good: Hooks automatically clean up connections
useEffect(() => {
  // Hooks handle cleanup automatically
  return () => {
    // No manual cleanup needed
  };
}, []);
```

## 🐛 Troubleshooting

### Connection Issues

1. **Check backend URL**: Ensure `NEXT_PUBLIC_API_BASE_URL` is set correctly
2. **CORS settings**: Backend must allow SSE connections from your domain
3. **Token validity**: Ensure JWT tokens are valid and not expired
4. **Network**: Check browser network tab for SSE connection errors

### No Notifications Received

1. **User ID**: Ensure correct user ID is being used
2. **Filters**: Check if filters are too restrictive
3. **Backend**: Verify backend is actually sending notifications
4. **Connection mode**: Use correct mode for your use case

### Performance Issues

1. **Limit notifications**: Use `maxItems` prop to limit displayed notifications
2. **Clear old notifications**: Regularly call `clearNotifications()`
3. **Optimize handlers**: Avoid heavy operations in notification handlers

## 🔧 Environment Setup

Add to your `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

For production:

```env
NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com
```