# Push Notifications Setup Guide

This guide explains how to set up push notifications from Salesforce objects to your PWA.

## Overview

The push notification system allows your PWA to receive notifications from Salesforce objects (e.g., Cases, Leads, Opportunities) even when the app is closed. The system consists of:

1. **Service Worker** (`public/sw.js`) - Handles incoming push notifications
2. **Push Notification Service** (`src/services/pushNotificationService.ts`) - Manages subscriptions
3. **React Hook** (`src/hooks/usePushNotifications.ts`) - React integration
4. **UI Component** (`src/components/PushNotificationSettings.tsx`) - User settings
5. **Backend Endpoints** - Store subscriptions and send notifications
6. **Netlify Functions** - Handle webhooks and send notifications

## Prerequisites

1. **VAPID Keys** - Required for Web Push Protocol
2. **HTTPS** - Required for push notifications (automatically handled by Netlify)
3. **Service Worker Support** - Modern browsers only

## Step 1: Generate VAPID Keys

VAPID (Voluntary Application Server Identification) keys are required for push notifications. Generate them using:

```bash
npm install -g web-push
web-push generate-vapid-keys
```

This will output:
- **Public Key** - Used in the frontend
- **Private Key** - Used in the backend (keep secret!)

## Step 2: Configure Environment Variables

### For Local Development

Create a `.env` file in the root directory:

```env
VITE_VAPID_PUBLIC_KEY=your_public_key_here
```

Update `backend/config.js` or create `.env` in backend:

```env
VAPID_PUBLIC_KEY=your_public_key_here
VAPID_PRIVATE_KEY=your_private_key_here
VAPID_SUBJECT=mailto:arezk@cloudastick.com
```

### For Netlify Production

Go to Netlify Dashboard → Site Settings → Environment Variables and add:

- `VAPID_PUBLIC_KEY` - Your VAPID public key
- `VAPID_PRIVATE_KEY` - Your VAPID private key
- `VAPID_SUBJECT` - Usually `mailto:your-email@example.com`
- `WEBHOOK_SECRET` (optional) - For securing webhooks
- `BACKEND_URL` (optional) - If using separate backend for subscriptions

## Step 3: Install Dependencies

### For Netlify Functions

Create `netlify/functions/package.json`:

```json
{
  "name": "netlify-functions",
  "version": "1.0.0",
  "dependencies": {
    "web-push": "^3.6.5"
  }
}
```

Then run:

```bash
cd netlify/functions
npm install
```

### For Backend Server

```bash
cd backend
npm install web-push
```

## Step 4: Set Up Salesforce Webhook

You need to configure Salesforce to send webhooks when objects are created/updated. There are several approaches:

### Option A: Change Data Capture (CDC) - Recommended

1. In Salesforce Setup, go to **Change Data Capture**
2. Select the objects you want to monitor (e.g., Case, Lead)
3. Enable Change Data Capture for those objects
4. Create a Platform Event or use a Flow to send HTTP callouts

### Option B: Platform Events

1. Create a Platform Event in Salesforce
2. Create a Flow or Apex trigger that publishes to the Platform Event
3. Use a Flow with HTTP Callout action to send webhook

### Option C: Outbound Messages (SOAP)

1. Create a Workflow Rule or Process Builder
2. Add an Outbound Message action
3. Configure the endpoint URL to your webhook function

### Webhook URL Format

For Netlify:
```
https://cloudastick.org/.netlify/functions/salesforceWebhook
```
See `DEPLOYMENT_URLS.md` for all available URLs.

For local testing (using ngrok or similar):
```
https://your-ngrok-url.ngrok.io/.netlify/functions/salesforceWebhook
```

### Webhook Payload Format

The webhook function accepts various formats. For a custom format, send:

```json
{
  "objectType": "Case",
  "recordId": "500xx000000abc",
  "recordName": "Case Subject",
  "action": "created",
  "additionalData": {
    "Priority": "High",
    "Status": "New"
  }
}
```

## Step 5: Use Push Notifications in Your App

### Basic Usage

```tsx
import { PushNotificationSettings } from '@/components/PushNotificationSettings';

function SettingsPage() {
  return (
    <PushNotificationSettings
      userId="user123"
      salesforceObjectType="Case"
    />
  );
}
```

### Advanced Usage with Hook

```tsx
import { usePushNotifications } from '@/hooks/usePushNotifications';

function MyComponent() {
  const {
    isSupported,
    permission,
    isSubscribed,
    subscribe,
    unsubscribe
  } = usePushNotifications({
    userId: 'user123',
    salesforceObjectType: 'Case',
    autoSubscribe: false
  });

  return (
    <div>
      {isSupported && (
        <button onClick={isSubscribed ? unsubscribe : subscribe}>
          {isSubscribed ? 'Disable' : 'Enable'} Notifications
        </button>
      )}
    </div>
  );
}
```

## Step 6: Testing

### Test Push Subscription

1. Open your PWA in a browser
2. Navigate to a page with `PushNotificationSettings`
3. Click "Enable Notifications"
4. Grant permission when prompted
5. Check browser console for subscription details

### Test Webhook

You can test the webhook manually:

```bash
curl -X POST https://cloudastick.org/.netlify/functions/salesforceWebhook \
  -H "Content-Type: application/json" \
  -d '{
    "objectType": "Case",
    "recordId": "500xx000000abc",
    "recordName": "Test Case",
    "action": "created"
  }'
```

### Test Notification Sending

```bash
curl -X POST https://cloudastick.org/.netlify/functions/sendPushNotification \
  -H "Content-Type: application/json" \
  -d '{
    "salesforceObjectType": "Case",
    "recordId": "500xx000000abc",
    "recordName": "Test Case",
    "action": "created"
  }'
```

## Troubleshooting

### Notifications Not Appearing

1. **Check Service Worker**: Open DevTools → Application → Service Workers
2. **Check Permissions**: DevTools → Application → Notifications
3. **Check Console**: Look for errors in browser console
4. **Check VAPID Keys**: Ensure they're correctly set in environment variables
5. **Check HTTPS**: Push notifications require HTTPS (automatic on Netlify)

### Service Worker Not Registering

1. Clear browser cache
2. Unregister old service workers in DevTools
3. Check that `sw.js` is accessible at `/sw.js`
4. Check browser console for errors

### Webhook Not Receiving Data

1. Check Netlify function logs
2. Verify webhook URL is correct in Salesforce
3. Check webhook secret if configured
4. Verify Salesforce can reach your webhook URL (not blocked by firewall)

### Subscriptions Not Persisting

The current implementation uses in-memory storage for Netlify functions, which will be lost on function restart. For production:

1. Use Netlify Blobs for storage
2. Use a database (MongoDB, PostgreSQL, etc.)
3. Use a key-value store (Redis, etc.)

## Production Considerations

1. **Database Storage**: Replace in-memory storage with a database
2. **Error Handling**: Add retry logic for failed notifications
3. **Rate Limiting**: Implement rate limiting for webhooks
4. **Authentication**: Secure webhooks with authentication
5. **Monitoring**: Set up monitoring and alerts
6. **User Management**: Link subscriptions to user accounts
7. **Notification Preferences**: Allow users to customize notification types

## Security

1. **Keep VAPID Private Key Secret**: Never commit to version control
2. **Secure Webhooks**: Use webhook secrets or OAuth
3. **Validate Payloads**: Always validate incoming webhook data
4. **HTTPS Only**: Push notifications require HTTPS

## Browser Support

- ✅ Chrome/Edge (Desktop & Mobile)
- ✅ Firefox (Desktop & Mobile)
- ✅ Safari (iOS 16.4+, macOS)
- ❌ Safari (iOS < 16.4) - Limited support

## Resources

- [Web Push Protocol](https://web.dev/push-notifications-overview/)
- [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Salesforce Change Data Capture](https://developer.salesforce.com/docs/atlas.en-us.change_data_capture.meta/change_data_capture/)
- [web-push library](https://github.com/web-push-libs/web-push)

