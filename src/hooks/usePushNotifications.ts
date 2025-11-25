/**
 * React Hook for Push Notifications
 * Manages push notification subscription state and provides methods to enable/disable
 */

import { useState, useEffect, useCallback } from 'react';
import {
  isPushNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission,
  registerServiceWorker,
  subscribeToPushNotifications,
  getPushSubscription,
  unsubscribeFromPushNotifications,
  saveSubscriptionToBackend,
  removeSubscriptionFromBackend,
  type PushSubscription
} from '../services/pushNotificationService';

export interface UsePushNotificationsOptions {
  userId?: string;
  salesforceObjectType?: string; // e.g., 'Case', 'Lead', 'Opportunity'
  autoSubscribe?: boolean;
}

export interface UsePushNotificationsReturn {
  isSupported: boolean;
  permission: NotificationPermission | null;
  isSubscribed: boolean;
  isLoading: boolean;
  error: string | null;
  registration: ServiceWorkerRegistration | null;
  subscribe: () => Promise<void>;
  unsubscribe: () => Promise<void>;
  requestPermission: () => Promise<void>;
}

export function usePushNotifications(
  options: UsePushNotificationsOptions = {}
): UsePushNotificationsReturn {
  const { userId, salesforceObjectType, autoSubscribe = false } = options;

  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  // Check support and permission on mount
  useEffect(() => {
    const checkSupport = async () => {
      try {
        const supported = isPushNotificationSupported();
        setIsSupported(supported);

        if (supported) {
          const perm = await getNotificationPermission();
          setPermission(perm);

          // Register service worker
          const reg = await registerServiceWorker();
          setRegistration(reg);

          if (reg) {
            // Check if already subscribed
            const subscription = await getPushSubscription(reg);
            setIsSubscribed(!!subscription);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to check push notification support');
      } finally {
        setIsLoading(false);
      }
    };

    checkSupport();
  }, []);

  // Auto-subscribe if enabled and permission is granted
  useEffect(() => {
    if (autoSubscribe && permission === 'granted' && registration && !isSubscribed && !isLoading) {
      subscribe();
    }
  }, [autoSubscribe, permission, registration, isSubscribed, isLoading]);

  const requestPermission = useCallback(async () => {
    try {
      setError(null);
      const perm = await requestNotificationPermission();
      setPermission(perm);
      
      if (perm !== 'granted') {
        setError('Notification permission was denied');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to request permission';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const subscribe = useCallback(async () => {
    if (!isSupported) {
      setError('Push notifications are not supported');
      return;
    }

    if (!registration) {
      setError('Service worker is not registered');
      return;
    }

    if (permission !== 'granted') {
      await requestPermission();
      if (permission !== 'granted') {
        return;
      }
    }

    try {
      setError(null);
      setIsLoading(true);

      const subscription = await subscribeToPushNotifications(registration);
      
      if (subscription) {
        await saveSubscriptionToBackend(subscription, userId, salesforceObjectType);
        setIsSubscribed(true);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to subscribe';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported, registration, permission, userId, salesforceObjectType, requestPermission]);

  const unsubscribe = useCallback(async () => {
    if (!registration) {
      return;
    }

    try {
      setError(null);
      setIsLoading(true);

      const subscription = await getPushSubscription(registration);
      
      if (subscription) {
        await removeSubscriptionFromBackend(subscription);
        await unsubscribeFromPushNotifications(registration);
        setIsSubscribed(false);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to unsubscribe';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [registration]);

  return {
    isSupported,
    permission,
    isSubscribed,
    isLoading,
    error,
    registration,
    subscribe,
    unsubscribe,
    requestPermission
  };
}

