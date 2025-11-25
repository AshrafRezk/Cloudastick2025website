# Push Notifications Deployment Checklist

**IMPORTANT**: Deploy all code changes to Netlify **BEFORE** configuring Salesforce, otherwise the webhook endpoints won't exist!

## ✅ Pre-Deployment Checklist

### Files Created/Modified That Need Deployment

#### 1. Service Worker
- [x] `public/sw.js` - Service worker for handling push notifications
- **Location**: Will be deployed to `/sw.js` on your site

#### 2. Netlify Functions (Critical!)
- [x] `netlify/functions/salesforceWebhook.js` - Receives webhooks from Salesforce
- [x] `netlify/functions/sendPushNotification.js` - Sends push notifications to users
- [x] `netlify/functions/pushSubscribe.js` - Stores push subscriptions
- [x] `netlify/functions/pushUnsubscribe.js` - Removes push subscriptions

#### 3. Frontend Code
- [x] `src/services/pushNotificationService.ts` - Push notification service
- [x] `src/hooks/usePushNotifications.ts` - React hook
- [x] `src/components/PushNotificationSettings.tsx` - UI component
- [x] `src/main.tsx` - Service worker registration

#### 4. Configuration Files
- [x] `public/site.webmanifest` - Updated with notification support

## 🚀 Deployment Steps

### Step 1: Commit All Changes

```bash
git add .
git commit -m "Add push notifications system with Salesforce integration"
git push origin main
```

### Step 2: Deploy to Netlify

**Option A: Automatic Deployment (If Connected to Git)**
- Push to your main branch
- Netlify will automatically build and deploy
- Wait for deployment to complete

**Option B: Manual Deployment**
- Go to Netlify Dashboard
- Click "Deploys" → "Trigger deploy" → "Deploy site"
- Or use Netlify CLI: `netlify deploy --prod`

### Step 3: Verify Deployment

After deployment, verify these endpoints are accessible:

1. **Service Worker**:
   - Visit: `https://cloudastick.org/sw.js`
   - Should see the service worker JavaScript code

2. **Webhook Endpoint** (Critical for Salesforce):
   - Test with curl:
   ```bash
   curl -X POST https://cloudastick.org/.netlify/functions/salesforceWebhook \
     -H "Content-Type: application/json" \
     -d '{"objectType":"Push_Notification__c","recordId":"test123","recordName":"Test","action":"created"}'
   ```
   - Should return: `{"success":true,"message":"Webhook processed successfully"}`

3. **Push Subscription Endpoints**:
   - `https://cloudastick.org/.netlify/functions/pushSubscribe`
   - `https://cloudastick.org/.netlify/functions/pushUnsubscribe`

### Step 4: Set Environment Variables in Netlify

**Critical**: Set these in Netlify Dashboard → Site Settings → Environment Variables:

1. **VAPID_PUBLIC_KEY**
   - Your VAPID public key (for frontend)
   - Also set as `VITE_VAPID_PUBLIC_KEY` for build-time access

2. **VAPID_PRIVATE_KEY**
   - Your VAPID private key (keep secret!)
   - Used by `sendPushNotification.js`

3. **VAPID_SUBJECT**
   - Usually: `mailto:arezk@cloudastick.com`
   - Or your email address

4. **WEBHOOK_SECRET** (Optional)
   - For securing webhooks from Salesforce
   - If set, configure same value in Salesforce

5. **BACKEND_URL** (Optional)
   - Only if using separate backend for subscriptions
   - Usually not needed

### Step 5: Install Dependencies for Netlify Functions

The Netlify functions need the `web-push` package. 

**The `netlify/functions/package.json` file has been created** with the required dependency.

Netlify will automatically install dependencies during build. To verify locally:

```bash
cd netlify/functions
npm install
```

**Note**: Netlify should automatically install dependencies during build, but verify in build logs.

## ✅ Post-Deployment Verification

### 1. Check Netlify Function Logs

1. Go to Netlify Dashboard → Functions → Logs
2. Look for any errors
3. Test webhook endpoint (see Step 3 above)

### 2. Test Service Worker

1. Open your site: `https://cloudastick.org`
2. Open Browser DevTools → Application → Service Workers
3. Verify service worker is registered
4. Check for any errors

### 3. Test Push Subscription (Frontend)

1. Open your site
2. Navigate to a page with `PushNotificationSettings` component
3. Try to enable notifications
4. Check browser console for errors
5. Verify subscription is saved

## 🔧 Troubleshooting Deployment

### Functions Not Found (404)

**Problem**: `/.netlify/functions/salesforceWebhook` returns 404

**Solutions**:
- Verify functions are in `netlify/functions/` directory
- Check Netlify build logs for errors
- Ensure `netlify.toml` is configured correctly
- Redeploy if needed

### VAPID Keys Not Working

**Problem**: Push notifications fail with VAPID errors

**Solutions**:
- Verify environment variables are set in Netlify
- Check variable names match exactly (case-sensitive)
- Ensure `VITE_VAPID_PUBLIC_KEY` is set for frontend build
- Regenerate VAPID keys if needed

### Service Worker Not Registering

**Problem**: Service worker doesn't register

**Solutions**:
- Verify `sw.js` is in `public/` directory
- Check it's accessible at `/sw.js`
- Clear browser cache
- Check browser console for errors

## 📋 Deployment Order

1. ✅ **Deploy Code** → Push to Git / Deploy to Netlify
2. ✅ **Set Environment Variables** → In Netlify Dashboard
3. ✅ **Verify Endpoints** → Test webhook URLs
4. ✅ **Configure Salesforce** → Create Named Credential, External Service, Flow
5. ✅ **Test End-to-End** → Create record in Salesforce, verify notification

## ⚠️ Important Notes

- **Never configure Salesforce before deploying** - webhooks will fail
- **Always test endpoints after deployment** - verify they're accessible
- **Keep VAPID keys secure** - never commit private key to Git
- **Monitor Netlify logs** - check for errors after deployment

## 🎯 Quick Deployment Command

If using Netlify CLI:

```bash
# Build and deploy
npm run build
netlify deploy --prod

# Or if connected to Git, just push:
git push origin main
```

## Next Steps After Deployment

Once deployment is verified:

1. ✅ Proceed with Salesforce setup (Named Credential, External Service, Flow)
2. ✅ Test with a sample record
3. ✅ Monitor Netlify logs for webhook activity
4. ✅ Verify push notifications are received

---

**Remember**: The webhook endpoint must exist and be accessible before Salesforce can send data to it!

