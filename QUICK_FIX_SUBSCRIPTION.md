# Quick Fix: Re-subscribe to Push Notifications

If you enabled notifications before but they're not working, try this:

## Step 1: Check Browser Console for Errors

Open browser console (F12) and look for:
- ❌ VAPID key errors
- ❌ Subscription errors
- ❌ Service worker errors

## Step 2: Manual Re-subscription

Run this in browser console:

```javascript
// Check current status
navigator.serviceWorker.ready.then(async (reg) => {
  console.log('Service Worker ready');
  
  // Check permission
  console.log('Permission:', Notification.permission);
  
  // Check existing subscription
  const sub = await reg.pushManager.getSubscription();
  if (sub) {
    console.log('✅ Already subscribed:', sub.endpoint);
  } else {
    console.log('❌ Not subscribed - need to subscribe');
    
    // Get VAPID key (you'll need to set this)
    const vapidKey = 'YOUR_VAPID_PUBLIC_KEY_HERE'; // Get from Netlify env vars
    
    if (!vapidKey || vapidKey === 'YOUR_VAPID_PUBLIC_KEY_HERE') {
      console.error('❌ VAPID key not set! Set VITE_VAPID_PUBLIC_KEY in Netlify');
      return;
    }
    
    // Convert VAPID key
    function urlBase64ToUint8Array(base64String) {
      const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
      const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);
      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    }
    
    try {
      // Subscribe
      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey)
      });
      
      console.log('✅ Subscription created:', subscription.endpoint);
      
      // Save to backend
      const subData = {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('p256dh')))),
          auth: btoa(String.fromCharCode(...new Uint8Array(subscription.getKey('auth'))))
        }
      };
      
      const response = await fetch('/.netlify/functions/pushSubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscription: subData,
          salesforceObjectType: 'Push_Notification__c'
        })
      });
      
      if (response.ok) {
        console.log('✅ Subscription saved to backend!');
      } else {
        console.error('❌ Failed to save:', await response.text());
      }
    } catch (err) {
      console.error('❌ Subscription error:', err);
    }
  }
});
```

## Step 3: Check VAPID Keys

**Most likely issue:** VAPID keys not set in Netlify!

1. Go to Netlify Dashboard → Site Settings → Environment Variables
2. Check if these are set:
   - `VAPID_PUBLIC_KEY`
   - `VAPID_PRIVATE_KEY`
   - `VITE_VAPID_PUBLIC_KEY` (same as VAPID_PUBLIC_KEY)

If missing, generate them:
```bash
npm install -g web-push
web-push generate-vapid-keys
```

Then set in Netlify and **redeploy**.

## Step 4: Enable from Home Page

1. Visit home page
2. Wait 3 seconds for prompt
3. Click "Enable Notifications"
4. Grant permission
5. Check browser console for success messages

## Step 5: Check Netlify Logs

After subscribing, check Netlify → Functions → Logs for:
- `📱 Push subscription saved`
- Any errors

## Common Issues

1. **VAPID key missing** → Set in Netlify env vars
2. **Permission denied** → Check browser notification settings
3. **Service worker not registered** → Check if `/sw.js` is accessible
4. **Subscription not saved** → Check Netlify function logs

