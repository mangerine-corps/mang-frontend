# SSE Integration Guide

This guide shows how to integrate the SSE notification system with your existing app structure.

## 1. App-Level Integration

### Update your main App component

```tsx
// pages/_app.tsx
import { SSENotificationProvider } from '../contexts/SSENotificationContext';
import { useAuth } from '../state/hooks/user.hook';
import { useToast } from '@chakra-ui/react';
import { createCombinedNotificationHandler } from '../utils/sseToastIntegration';

export default function App({ Component, pageProps }: AppProps) {
  const { user, token } = useAuth();
  const toast = useToast();

  // Create notification handler for app-wide notifications
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
        priorityFilter: ['high', 'urgent'] // Only show important notifications as toasts
      }
    }
  );

  return (
    <Providers>
      <SSENotificationProvider
        userId={user?.id}
        options={{
          mode: user ? 'secure' : 'broadcast', // Secure for logged in users, broadcast for anonymous
          token: token,
          autoReconnect: true
        }}
        onNotification={notificationHandler}
      >
        <Box bg="bd_background" h="100vh" as="main" className={`${outfit.className}`}>
          {loading && <PagesTopLoader />}
          <Component {...pageProps} />
          <Toaster />
        </Box>
      </SSENotificationProvider>
    </Providers>
  );
}
```

## 2. Header/Navbar Integration

Add a notification bell to your header:

```tsx
// layouts/Header.tsx
import { useSSENotificationContext } from '../contexts/SSENotificationContext';
import { Bell } from 'lucide-react'; // or your icon library

const NotificationBell = () => {
  const { unreadCount, notifications, markAsRead, isConnected } = useSSENotificationContext();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Box position="relative">
      <IconButton
        aria-label="Notifications"
        icon={<Bell />}
        onClick={() => setIsOpen(!isOpen)}
        variant="ghost"
        position="relative"
      >
        {unreadCount > 0 && (
          <Badge
            position="absolute"
            top="-1"
            right="-1"
            colorScheme="red"
            borderRadius="full"
            fontSize="xs"
            minW="5"
            h="5"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
        {/* Connection status indicator */}
        <Box
          position="absolute"
          bottom="0"
          right="0"
          w="2"
          h="2"
          borderRadius="full"
          bg={isConnected ? "green.400" : "red.400"}
        />
      </IconButton>

      {/* Dropdown menu */}
      {isOpen && (
        <Box
          position="absolute"
          top="100%"
          right="0"
          mt={2}
          w="320px"
          bg="white"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="md"
          shadow="lg"
          zIndex={1000}
        >
          <SSENotificationDisplay
            maxItems={5}
            allowDismiss={true}
            height="300px"
          />
        </Box>
      )}
    </Box>
  );
};

// Add to your Header component
export const Header = () => {
  // ... existing header code
  
  return (
    <Box>
      {/* ... existing header content */}
      <NotificationBell />
    </Box>
  );
};
```

## 3. Page-Specific Integrations

### Payment Pages

```tsx
// pages/payment/[...].tsx
import { usePaymentNotifications } from '../contexts/SSENotificationContext';

export default function PaymentPage() {
  const { user } = useAuth();
  const router = useRouter();

  // Listen for payment confirmations
  usePaymentNotifications({
    userId: user?.id,
    options: { mode: 'public' }, // Public mode for Stripe webhooks
    onNotification: (notification) => {
      if (notification.data?.status === 'succeeded') {
        // Payment successful - redirect to success page
        router.push('/payment/success?payment_intent=' + notification.data.paymentIntentId);
      } else if (notification.data?.status === 'failed') {
        // Payment failed - show error
        toast({
          title: 'Payment Failed',
          description: 'Your payment could not be processed. Please try again.',
          status: 'error',
          duration: 8000,
          isClosable: true
        });
      }
    }
  });

  return (
    <div>
      {/* Your payment form */}
    </div>
  );
}
```

### Appointment Pages

```tsx
// pages/appointments/[...].tsx
import { useAppointmentNotifications } from '../contexts/SSENotificationContext';

export default function AppointmentsPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);

  // Listen for appointment updates
  useAppointmentNotifications({
    userId: user?.id,
    options: { mode: 'public' },
    onNotification: (notification) => {
      const { appointmentId, type, appointmentData } = notification.data || {};
      
      if (type === 'cancelled') {
        // Update local state to reflect cancellation
        setAppointments(prev => 
          prev.map(apt => 
            apt.id === appointmentId 
              ? { ...apt, status: 'cancelled' }
              : apt
          )
        );
      } else if (type === 'updated') {
        // Refresh appointment data
        refetchAppointments();
      } else if (type === 'reminder') {
        // Show reminder notification (handled by global toast)
        console.log('Appointment reminder for:', appointmentData);
      }
    }
  });

  return (
    <div>
      {/* Your appointments list */}
    </div>
  );
}
```

## 4. Admin Dashboard Integration

```tsx
// pages/admin/dashboard.tsx
import { useAdminNotifications } from '../contexts/SSENotificationContext';

export default function AdminDashboard() {
  const { adminToken } = useAdminAuth(); // Your admin auth hook
  const [systemHealth, setSystemHealth] = useState('good');

  const {
    notifications,
    totalReceived,
    getNotificationsByType
  } = useAdminNotifications(adminToken, {
    onNotification: (notification) => {
      // Log all system notifications
      console.log('System notification:', notification);
      
      // Update system health based on notifications
      if (notification.priority === 'urgent') {
        setSystemHealth('critical');
      } else if (notification.priority === 'high') {
        setSystemHealth('warning');
      }
    }
  });

  const errorNotifications = getNotificationsByType('error');
  const paymentNotifications = getNotificationsByType('payment');

  return (
    <div>
      <h1>Admin Dashboard</h1>
      
      <div>
        <h2>System Health: {systemHealth}</h2>
        <p>Total notifications processed: {totalReceived}</p>
        <p>Error notifications: {errorNotifications.length}</p>
        <p>Payment notifications: {paymentNotifications.length}</p>
      </div>

      <SSENotificationDisplay
        maxItems={50}
        height="500px"
        allowDismiss={false}
      />
    </div>
  );
}
```

## 5. Environment Configuration

Update your environment variables:

```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000

# .env.production
NEXT_PUBLIC_API_BASE_URL=https://your-production-api.com
```

## 6. TypeScript Integration

Add SSE types to your global types:

```typescript
// types.ts (your existing types file)
export * from './types/sse.types';

// Or if you prefer, add SSE notifications to your existing notification types
export interface AppNotification extends NotificationData {
  // Add any app-specific notification properties
  actionUrl?: string;
  actionText?: string;
}
```

## 7. Redux Integration (if needed)

If you want to store SSE notifications in Redux:

```typescript
// state/reducers/notifications.reducer.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NotificationData } from '../../types/sse.types';

interface NotificationsState {
  notifications: NotificationData[];
  unreadCount: number;
  connectionStatus: 'connected' | 'disconnected' | 'connecting';
}

const initialState: NotificationsState = {
  notifications: [],
  unreadCount: 0,
  connectionStatus: 'disconnected'
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<NotificationData>) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.read) {
        state.unreadCount += 1;
      }
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount -= 1;
      }
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
    setConnectionStatus: (state, action: PayloadAction<NotificationsState['connectionStatus']>) => {
      state.connectionStatus = action.payload;
    }
  }
});

export const { addNotification, markAsRead, clearNotifications, setConnectionStatus } = notificationsSlice.actions;
export default notificationsSlice.reducer;
```

Then use it in your SSE hook:

```tsx
import { useDispatch } from 'react-redux';
import { addNotification, setConnectionStatus } from '../state/reducers/notifications.reducer';

const dispatch = useDispatch();

const sseHook = useSSENotifications({
  userId: user?.id,
  options: { mode: 'secure', token },
  onNotification: (notification) => {
    dispatch(addNotification(notification));
  },
  onStatusChange: (status) => {
    dispatch(setConnectionStatus(status === 'connected' ? 'connected' : 'disconnected'));
  }
});
```

## 8. Testing Integration

For testing SSE functionality:

```tsx
// __tests__/sse-integration.test.tsx
import { render, screen } from '@testing-library/react';
import { SSENotificationProvider } from '../contexts/SSENotificationContext';

// Mock EventSource for testing
global.EventSource = jest.fn(() => ({
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  close: jest.fn(),
  onmessage: null,
  onerror: null,
  onopen: null,
  readyState: 1,
  url: '',
  dispatchEvent: jest.fn()
}));

describe('SSE Integration', () => {
  it('should connect to SSE when user is authenticated', () => {
    render(
      <SSENotificationProvider userId="user123" options={{ mode: 'secure', token: 'token123' }}>
        <TestComponent />
      </SSENotificationProvider>
    );

    expect(global.EventSource).toHaveBeenCalledWith(
      expect.stringContaining('/notifications/stream/secure/user123')
    );
  });
});
```

## 9. Monitoring and Analytics

Add monitoring for SSE connections:

```tsx
// utils/sseMonitoring.ts
export const trackSSEConnection = (userId: string, status: string) => {
  // Track connection events for monitoring
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'sse_connection', {
      custom_parameter_1: userId,
      custom_parameter_2: status
    });
  }
};

export const trackNotificationReceived = (notification: NotificationData) => {
  // Track notification types for analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'notification_received', {
      custom_parameter_1: notification.type,
      custom_parameter_2: notification.priority
    });
  }
};
```

Use in your SSE hooks:

```tsx
const sseHook = useSSENotifications({
  userId: user?.id,
  options: { mode: 'secure', token },
  onNotification: (notification) => {
    trackNotificationReceived(notification);
  },
  onStatusChange: (status) => {
    trackSSEConnection(user?.id || 'anonymous', status);
  }
});
```

This integration guide should help you seamlessly incorporate the SSE notification system into your existing application structure!