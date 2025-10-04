import { NotificationData } from '../types/sse.types';

// Toast notification function type - adapt to your toast library
export type ToastFunction = (options: {
  title: string;
  description?: string;
  status: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  isClosable?: boolean;
}) => void;

/**
 * Converts SSE notification to toast notification
 */
export const convertNotificationToToast = (
  notification: NotificationData,
  showToast: ToastFunction
) => {
  const getToastStatus = (notification: NotificationData) => {
    // Determine toast status based on notification type or priority
    switch (notification.type) {
      case 'payment':
        return notification.data?.status === 'succeeded' ? 'success' : 'error';
      case 'appointment':
        return notification.data?.type === 'cancelled' ? 'warning' : 'info';
      case 'system':
        return notification.priority === 'urgent' || notification.priority === 'high' 
          ? 'warning' 
          : 'info';
      default:
        switch (notification.priority) {
          case 'urgent':
          case 'high':
            return 'warning';
          case 'medium':
            return 'info';
          case 'low':
            return 'success';
          default:
            return 'info';
        }
    }
  };

  const getDuration = (notification: NotificationData) => {
    // Duration based on priority
    switch (notification.priority) {
      case 'urgent':
        return 10000; // 10 seconds
      case 'high':
        return 8000;  // 8 seconds
      case 'medium':
        return 5000;  // 5 seconds
      case 'low':
        return 3000;  // 3 seconds
      default:
        return 5000;
    }
  };

  showToast({
    title: notification.title,
    description: notification.message,
    status: getToastStatus(notification),
    duration: getDuration(notification),
    isClosable: true
  });
};

/**
 * Create a toast handler for specific notification types
 */
export const createNotificationToastHandler = (
  showToast: ToastFunction,
  options: {
    enabledTypes?: string[];
    disabledTypes?: string[];
    priorityFilter?: ('low' | 'medium' | 'high' | 'urgent')[];
    customMessages?: Record<string, { title?: string; message?: string; status?: 'success' | 'error' | 'warning' | 'info' }>;
  } = {}
) => {
  const { enabledTypes, disabledTypes, priorityFilter, customMessages } = options;

  return (notification: NotificationData) => {
    // Filter by type
    if (enabledTypes && !enabledTypes.includes(notification.type)) {
      return;
    }
    if (disabledTypes && disabledTypes.includes(notification.type)) {
      return;
    }

    // Filter by priority
    if (priorityFilter && notification.priority && !priorityFilter.includes(notification.priority)) {
      return;
    }

    // Use custom message if available
    const customMessage = customMessages?.[notification.type];
    if (customMessage) {
      showToast({
        title: customMessage.title || notification.title,
        description: customMessage.message || notification.message,
        status: customMessage.status || 'info',
        duration: 5000,
        isClosable: true
      });
    } else {
      convertNotificationToToast(notification, showToast);
    }
  };
};

/**
 * Predefined toast handlers for common notification types
 */
export const createPaymentToastHandler = (showToast: ToastFunction) => {
  return createNotificationToastHandler(showToast, {
    enabledTypes: ['payment'],
    customMessages: {
      payment: {
        title: 'Payment Update',
        status: 'info'
      }
    }
  });
};

export const createAppointmentToastHandler = (showToast: ToastFunction) => {
  return createNotificationToastHandler(showToast, {
    enabledTypes: ['appointment'],
    customMessages: {
      appointment: {
        title: 'Appointment Update',
        status: 'info'
      }
    }
  });
};

export const createUrgentNotificationHandler = (showToast: ToastFunction) => {
  return createNotificationToastHandler(showToast, {
    priorityFilter: ['urgent', 'high'],
    customMessages: {
      system: {
        title: 'Important Notice',
        status: 'warning'
      }
    }
  });
};

/**
 * Browser notification integration (requires permission)
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission === 'denied') {
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === 'granted';
};

export const showBrowserNotification = (notification: NotificationData) => {
  if (Notification.permission !== 'granted') {
    return;
  }

  const browserNotification = new Notification(notification.title, {
    body: notification.message,
    icon: '/favicon.ico', // Adjust path as needed
    badge: '/favicon.ico',
    tag: notification.id,
    requireInteraction: notification.priority === 'urgent',
    silent: notification.priority === 'low'
  });

  // Auto close after 5 seconds unless it's urgent
  if (notification.priority !== 'urgent') {
    setTimeout(() => {
      browserNotification.close();
    }, 5000);
  }

  return browserNotification;
};

/**
 * Combined handler for both toast and browser notifications
 */
export const createCombinedNotificationHandler = (
  showToast: ToastFunction,
  options: {
    enableBrowserNotifications?: boolean;
    toastOptions?: Parameters<typeof createNotificationToastHandler>[1];
  } = {}
) => {
  const { enableBrowserNotifications = false, toastOptions } = options;
  const toastHandler = createNotificationToastHandler(showToast, toastOptions);

  return async (notification: NotificationData) => {
    // Show toast
    toastHandler(notification);

    // Show browser notification if enabled and permission granted
    if (enableBrowserNotifications) {
      const hasPermission = await requestNotificationPermission();
      if (hasPermission) {
        showBrowserNotification(notification);
      }
    }
  };
};