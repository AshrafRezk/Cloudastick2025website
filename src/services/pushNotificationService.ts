/**
 * Push Notification Service
 * Handles push notification subscription and management
 */

export interface PushSubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  url?: string;
  data?: Record<string, unknown>;
}

/**
 * Convert VAPID key from base64 URL-safe to Uint8Array
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Get VAPID public key from environment or use a placeholder
 * In production, this should be set as an environment variable
 */
function getVapidPublicKey(): string {
  // You'll need to set this in your environment variables
  // For now, using a placeholder - replace with actual VAPID key
  const vapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY || '';
  
  if (!vapidKey) {
    console.warn('VAPID public key not set. Push notifications may not work.');
  }
  
  return vapidKey;
}

/**
 * Check if push notifications are supported
 */
export function isPushNotificationSupported(): boolean {
  return (
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  );
}

/**
 * Check if notifications are permitted
 */
export async function getNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    return 'denied';
  }
  return Notification.permission;
}

/**
 * Request notification permission
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    throw new Error('Notifications are not supported in this browser');
  }

  const permission = await Notification.requestPermission();
  return permission;
}

/**
 * Register service worker
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service workers are not supported');
    return null;
  }

  try {
    // Check if service worker is already registered
    const existingRegistration = await navigator.serviceWorker.getRegistration();
    if (existingRegistration) {
      console.log('Service Worker already registered:', existingRegistration);
      await navigator.serviceWorker.ready;
      return existingRegistration;
    }

    // Register new service worker
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/'
    });
    
    console.log('Service Worker registered:', registration);
    
    // Wait for service worker to be ready
    await navigator.serviceWorker.ready;
    
    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
}

/**
 * Subscribe to push notifications
 */
export async function subscribeToPushNotifications(
  registration: ServiceWorkerRegistration
): Promise<PushSubscription | null> {
  try {
    const vapidPublicKey = getVapidPublicKey();
    
    if (!vapidPublicKey) {
      const error = 'VAPID public key is not configured. Please set VITE_VAPID_PUBLIC_KEY in environment variables.';
      console.error('❌', error);
      throw new Error(error);
    }

    console.log('🔑 Using VAPID key:', vapidPublicKey.substring(0, 20) + '...');
    
    // Check if already subscribed
    const existingSubscription = await registration.pushManager.getSubscription();
    if (existingSubscription) {
      console.log('✅ Already have a subscription, using existing one');
      return existingSubscription;
    }

    console.log('🔄 Creating new push subscription...');
    const keyArray = urlBase64ToUint8Array(vapidPublicKey);
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: keyArray as unknown as ArrayBuffer
    });

    const p256dhKey = subscription.getKey('p256dh');
    console.log('✅ Push subscription created successfully:', {
      endpoint: subscription.endpoint.substring(0, 50) + '...',
      hasKeys: !!p256dhKey
    });
    return subscription;
  } catch (error) {
    console.error('❌ Push subscription failed:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    throw error;
  }
}

/**
 * Get current push subscription
 */
export async function getPushSubscription(
  registration: ServiceWorkerRegistration
): Promise<PushSubscription | null> {
  try {
    const subscription = await registration.pushManager.getSubscription();
    return subscription;
  } catch (error) {
    console.error('Failed to get push subscription:', error);
    return null;
  }
}

/**
 * Unsubscribe from push notifications
 */
export async function unsubscribeFromPushNotifications(
  registration: ServiceWorkerRegistration
): Promise<boolean> {
  try {
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      const result = await subscription.unsubscribe();
      console.log('Unsubscribed from push notifications');
      return result;
    }
    return true;
  } catch (error) {
    console.error('Failed to unsubscribe:', error);
    return false;
  }
}

/**
 * Convert PushSubscription to a serializable format
 */
export function subscriptionToJSON(subscription: PushSubscription): PushSubscriptionData {
  const key = subscription.getKey('p256dh');
  const auth = subscription.getKey('auth');

  return {
    endpoint: subscription.endpoint,
    keys: {
      p256dh: key ? btoa(String.fromCharCode(...new Uint8Array(key))) : '',
      auth: auth ? btoa(String.fromCharCode(...new Uint8Array(auth))) : ''
    }
  };
}

/**
 * Get API base URL (works for both local dev and production)
 */
function getApiBaseUrl(): string {
  // In production (Netlify), use Netlify functions
  if (window.location.hostname.includes('netlify.app') || window.location.hostname.includes('cloudastick.com')) {
    return '/.netlify/functions';
  }
  // In local development, use backend server
  return '/api';
}

/**
 * Save subscription to backend
 */
export async function saveSubscriptionToBackend(
  subscription: PushSubscription,
  userId?: string,
  salesforceObjectType?: string
): Promise<void> {
  try {
    const subscriptionData = subscriptionToJSON(subscription);
    const apiBase = getApiBaseUrl();
    const endpoint = apiBase === '/.netlify/functions' 
      ? '/.netlify/functions/pushSubscribe'
      : '/api/push/subscribe';
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        subscription: subscriptionData,
        userId,
        salesforceObjectType // e.g., 'Case', 'Lead', 'Opportunity', etc.
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to save subscription: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('✅ Subscription saved to backend:', result);
  } catch (error) {
    console.error('❌ Failed to save subscription:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    throw error;
  }
}

/**
 * Remove subscription from backend
 */
export async function removeSubscriptionFromBackend(
  subscription: PushSubscription
): Promise<void> {
  try {
    const subscriptionData = subscriptionToJSON(subscription);
    const apiBase = getApiBaseUrl();
    const endpoint = apiBase === '/.netlify/functions'
      ? '/.netlify/functions/pushUnsubscribe'
      : '/api/push/unsubscribe';
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        subscription: subscriptionData
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to remove subscription: ${response.statusText}`);
    }

    console.log('Subscription removed from backend');
  } catch (error) {
    console.error('Failed to remove subscription:', error);
    throw error;
  }
}

