# Push Notification Troubleshooting Guide

## Issue: Not Receiving Push Notifications

Follow these steps to diagnose and fix the issue:

## Step 1: Verify User is Subscribed ✅

### Check Browser Console:
1. Open your website: `https://cloudastick.org`
2. Open Browser DevTools (F12) → Console
3. Check for subscription messages:
   - Look for: "Subscription saved to backend"
   - Look for: "Push subscription created"

### Check if Subscribed:
1. Open Browser DevTools → Application → Service Workers
2. Check if service worker is registered
3. Go to Application → Notifications
4. Check if permission is "granted"

### Test Subscription:
Open browser console and run:
```javascript
navigator.serviceWorker.ready.then(reg => {
  reg.pushManager.getSubscription().then(sub => {
    console.log('Current subscription:', sub);
  });
});
```

If `null`, you're not subscribed. Enable notifications from the home page prompt.

## Step 2: Check Netlify Function Logs 🔍

1. Go to Netlify Dashboard → Functions → Logs
2. Look for these messages when you create a record:

**Expected logs:**
- `📥 Salesforce webhook received`
- `📥 Processing webhook:`
- `📱 Push notification request received`
- `📱 Push notifications sent: X successful`

**If you see:**
- `No subscriptions found for object type: Push_Notification__c` → User not subscribed
- `VAPID keys not configured` → Environment variables missing
- `Error sending notification` → Check VAPID keys

## Step 3: Verify Salesforce Flow is Working ✅

1. In Salesforce, go to Setup → Flows
2. Find your Flow (e.g., "Push Notification Flow")
3. Check if it's **Activated**
4. Click "View Details" → Check "Flow Interviews" for recent runs
5. Look for errors in Flow Interview logs

### Test Flow Manually:
1. In Flow Builder, click "Debug"
2. Select a test `Push_Notification__c` record
3. Run the Flow
4. Check if HTTP Callout executes successfully

## Step 4: Check Webhook is Received 🌐

### Test Webhook Manually:
```bash
curl -X POST https://cloudastick.org/.netlify/functions/salesforceWebhook \
  -H "Content-Type: application/json" \
  -d '{
    "objectType": "Push_Notification__c",
    "recordId": "test123",
    "recordName": "Test Notification",
    "action": "created",
    "additionalData": {
      "Title": "Test Title",
      "Body": "Test Body"
    }
  }'
```

**Expected response:**
```json
{
  "success": true,
  "message": "Webhook processed successfully",
  "notificationResult": {
    "sent": 1,
    "failed": 0
  }
}
```

If you get an error, check Netlify function logs.

## Step 5: Verify Environment Variables 🔑

In Netlify Dashboard → Site Settings → Environment Variables, check:

- ✅ `VAPID_PUBLIC_KEY` - Must be set
- ✅ `VAPID_PRIVATE_KEY` - Must be set
- ✅ `VAPID_SUBJECT` - Usually `mailto:arezk@cloudastick.com`
- ✅ `VITE_VAPID_PUBLIC_KEY` - Same as VAPID_PUBLIC_KEY (for frontend)

**To generate VAPID keys:**
```bash
npm install -g web-push
web-push generate-vapid-keys
```

## Step 6: Check Service Worker 📱

1. Open Browser DevTools → Application → Service Workers
2. Verify:
   - Service Worker is registered
   - Status is "activated and running"
   - No errors in console

3. Check `sw.js` is accessible:
   - Visit: `https://cloudastick.org/sw.js`
   - Should see service worker code (not 404)

## Step 7: Check Browser Permissions 🔔

1. Browser Settings → Notifications
2. Check if `cloudastick.org` is allowed
3. If blocked, enable it

## Step 8: Verify Subscription Storage 💾

The subscription might not be persisting. Check:

1. Netlify Dashboard → Functions → Logs
2. Look for: `📱 Subscription saved to Netlify Blobs` or `using in-memory storage`

**Issue:** If using in-memory storage, subscriptions are lost on function restart.

**Solution:** Ensure Netlify Blobs is working or subscriptions won't persist.

## Common Issues & Solutions

### Issue 1: "No subscriptions found"
**Cause:** User not subscribed or subscription not saved
**Solution:** 
- Enable notifications from home page
- Check browser console for subscription errors
- Verify subscription is saved in Netlify logs

### Issue 2: "VAPID keys not configured"
**Cause:** Environment variables not set in Netlify
**Solution:**
- Set VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT in Netlify
- Redeploy after setting variables

### Issue 3: Webhook not received
**Cause:** Salesforce Flow not triggering or External Service misconfigured
**Solution:**
- Verify Flow is activated
- Check Flow Interview logs in Salesforce
- Test External Service manually
- Verify webhook URL is correct

### Issue 4: Notification appears but doesn't show
**Cause:** Browser notification permission denied or service worker issue
**Solution:**
- Check browser notification settings
- Verify service worker is registered
- Check browser console for errors

### Issue 5: Subscription saved but notifications not sent
**Cause:** Subscription storage issue or VAPID key mismatch
**Solution:**
- Check if subscription is in Netlify Blobs
- Verify VAPID keys match between frontend and backend
- Check Netlify function logs for errors

## Quick Test Checklist

- [ ] User is subscribed (check browser console)
- [ ] Service worker is registered
- [ ] Browser notification permission is granted
- [ ] VAPID keys are set in Netlify
- [ ] Salesforce Flow is activated
- [ ] Webhook is received (check Netlify logs)
- [ ] Subscription is stored (check Netlify logs)
- [ ] No errors in browser console
- [ ] No errors in Netlify function logs

## Debug Commands

### Check Subscription (Browser Console):
```javascript
navigator.serviceWorker.ready.then(reg => {
  reg.pushManager.getSubscription().then(sub => {
    if (sub) {
      console.log('Subscribed:', sub.endpoint);
    } else {
      console.log('Not subscribed');
    }
  });
});
```

### Test Service Worker:
```javascript
navigator.serviceWorker.getRegistrations().then(regs => {
  console.log('Service Workers:', regs);
});
```

### Check Notification Permission:
```javascript
console.log('Notification permission:', Notification.permission);
```

## Still Not Working?

1. Check all Netlify function logs for errors
2. Verify Salesforce Flow is actually triggering
3. Test webhook manually with curl
4. Check browser console for JavaScript errors
5. Verify VAPID keys are correct
6. Ensure user is actually subscribed

