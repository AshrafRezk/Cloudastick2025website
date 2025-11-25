# Cloudastick Deployment URLs

## Production URLs

### Primary Domains
- **Netlify App**: `https://cloudastick.netlify.app`
- **Custom Domain**: `https://cloudastick.org`
- **WWW Domain**: `https://www.cloudastick.org`

### Webhook Endpoints

All domains point to the same Netlify deployment, so webhooks work from any of these URLs:

- **Salesforce Webhook**: 
  - `https://cloudastick.netlify.app/.netlify/functions/salesforceWebhook`
  - `https://cloudastick.org/.netlify/functions/salesforceWebhook`
  - `https://www.cloudastick.org/.netlify/functions/salesforceWebhook`

- **Push Notification API**:
  - `https://cloudastick.netlify.app/.netlify/functions/sendPushNotification`
  - `https://cloudastick.org/.netlify/functions/sendPushNotification`
  - `https://www.cloudastick.org/.netlify/functions/sendPushNotification`

- **Push Subscription Management**:
  - `https://cloudastick.netlify.app/.netlify/functions/pushSubscribe`
  - `https://cloudastick.netlify.app/.netlify/functions/pushUnsubscribe`

## Usage in Salesforce

When configuring Named Credentials or HTTP Callouts in Salesforce, use:

**Recommended**: `https://cloudastick.org/.netlify/functions/salesforceWebhook`

This uses the custom domain and will continue to work even if the Netlify app URL changes.

## Notes

- All three domains point to the same Netlify deployment
- Use the custom domain (`cloudastick.org`) for production configurations
- The `.netlify.app` domain is useful for testing and development
- All endpoints are accessible from any of these domains

