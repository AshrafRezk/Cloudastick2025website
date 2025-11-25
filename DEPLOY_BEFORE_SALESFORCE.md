# ⚠️ IMPORTANT: Deploy Before Salesforce Setup

## Critical Order of Operations

**You MUST deploy the code to Netlify BEFORE configuring Salesforce!**

## Why?

Salesforce will try to send webhooks to these endpoints:
- `https://cloudastick.org/.netlify/functions/salesforceWebhook`
- `https://cloudastick.org/.netlify/functions/sendPushNotification`

**If these endpoints don't exist yet, Salesforce webhooks will fail!**

## ✅ Correct Order

### 1. Deploy Code First ✅

```bash
# Commit all changes
git add .
git commit -m "Add push notifications system"
git push origin main

# Netlify will auto-deploy, or manually deploy:
# netlify deploy --prod
```

### 2. Set Environment Variables ✅

In Netlify Dashboard → Site Settings → Environment Variables:
- `VAPID_PUBLIC_KEY`
- `VAPID_PRIVATE_KEY` 
- `VAPID_SUBJECT`
- `VITE_VAPID_PUBLIC_KEY` (same as VAPID_PUBLIC_KEY)

### 3. Verify Endpoints Work ✅

Test the webhook endpoint:
```bash
curl -X POST https://cloudastick.org/.netlify/functions/salesforceWebhook \
  -H "Content-Type: application/json" \
  -d '{"objectType":"Push_Notification__c","recordId":"test","recordName":"Test","action":"created"}'
```

Should return: `{"success":true,...}`

### 4. THEN Configure Salesforce ✅

Only after steps 1-3 are complete:
- Create Named Credential
- Create External Service  
- Create Flow
- Test with real records

## ❌ Wrong Order (Don't Do This!)

1. ❌ Configure Salesforce first
2. ❌ Create Flow with webhook
3. ❌ Try to test → **FAILS** because endpoints don't exist!

## Quick Deployment Checklist

- [ ] All code committed and pushed
- [ ] Netlify deployment successful
- [ ] Environment variables set
- [ ] Webhook endpoint tested and working
- [ ] Service worker accessible at `/sw.js`
- [ ] **THEN** proceed with Salesforce setup

## Files That Must Be Deployed

- ✅ `netlify/functions/salesforceWebhook.js`
- ✅ `netlify/functions/sendPushNotification.js`
- ✅ `netlify/functions/pushSubscribe.js`
- ✅ `netlify/functions/pushUnsubscribe.js`
- ✅ `netlify/functions/package.json` (for web-push dependency)
- ✅ `public/sw.js`
- ✅ All frontend code changes

## See Full Checklist

For complete deployment instructions, see:
**`PUSH_NOTIFICATIONS_DEPLOYMENT_CHECKLIST.md`**

---

**Remember**: Code first, Salesforce second! 🚀

