# Salesforce External Service Setup for HTTP Callouts

Salesforce now requires an **External Service** to be created before you can use HTTP Callouts in Flows. Here's how to set it up.

## Step 1: Create External Service

### 1.1 Navigate to External Services

1. Setup → Search **"External Services"**
2. Click **"New External Service"**

### 1.2 Fill in the Form

**Provide Registration Details:**

1. **External Service Name**: 
   - Enter: `PushNotificationCallout`
   - (This is just a name for the service)

2. **Description** (Optional):
   - Enter: `External service for push notification webhook callouts`

3. **Service Schema**: 
   - Select **"Relative URL"** (this is correct)

4. **Select a Named Credential**: 
   - Select **"Push_Notification_Webhook"** (the one you created earlier)

5. **URL**: 
   - Enter: `/salesforceWebhook`
   - ⚠️ **Important**: This is a **relative path**, not the full URL
   - Format: Start with `/` followed by the endpoint path
   - Since your Named Credential URL is: `https://cloudastick.org/.netlify/functions/salesforceWebhook`
   - The relative URL should be: `/salesforceWebhook` (just the endpoint part)

6. Click **"Save"**

## Understanding the URL Format

### Named Credential URL Structure

Your Named Credential has:
- **Base URL**: `https://cloudastick.org/.netlify/functions/`
- **Full Endpoint**: `https://cloudastick.org/.netlify/functions/salesforceWebhook`

### External Service Relative URL

The External Service uses a **relative path** from the Named Credential's base URL:

- **Relative URL**: `/salesforceWebhook`
- This gets appended to the Named Credential base URL
- Final URL: `https://cloudastick.org/.netlify/functions/` + `salesforceWebhook` = Full endpoint

### Alternative: If Base URL is Different

If your Named Credential URL is set to just the domain:
- **Named Credential URL**: `https://cloudastick.org`
- **External Service Relative URL**: `/.netlify/functions/salesforceWebhook`

## Step 2: Use External Service in Flow

### 2.1 Create HTTP Callout in Flow

1. In your Flow, add **HTTP Callout** action
2. Click **"New"** to create new callout

### 2.2 Configure HTTP Callout

1. **Name**: `Send_Push_Notification`
2. **Method**: `POST`
3. **URL Type**: Select **"External Service"** (not "Named Credential" or "URL")
4. **External Service**: Select `PushNotificationCallout` (the one you just created)
5. **Headers**: 
   - Add: `Content-Type` = `application/json`
6. **Request Body**:
   - **Body Type**: `JSON`
   - **Body**: Your JSON payload

### 2.3 Save and Use

1. Click **"Save"** on HTTP Callout
2. The callout is now ready to use in your Flow

## Complete Setup Checklist

- [ ] Named Credential created (`Push_Notification_Webhook`)
- [ ] External Service created (`PushNotificationCallout`)
- [ ] External Service linked to Named Credential
- [ ] Relative URL configured correctly
- [ ] HTTP Callout created in Flow using External Service
- [ ] Flow activated and tested

## Troubleshooting

### Error: "Not a valid relative URL"

**Problem**: The URL format is incorrect.

**Solution**: 
- Make sure it starts with `/`
- Use only the endpoint path, not the full URL
- Example: `/salesforceWebhook` ✅
- Not: `https://cloudastick.org/.netlify/functions/salesforceWebhook` ❌

### Error: "External Service not found"

**Problem**: The External Service wasn't saved or isn't available.

**Solution**:
- Go back to External Services
- Verify it was saved successfully
- Check it's linked to the correct Named Credential

### Callout Failing

**Problem**: HTTP callout returns error.

**Solution**:
1. Check Named Credential URL is correct
2. Verify External Service relative URL matches the endpoint
3. Test the full URL manually: `https://cloudastick.org/.netlify/functions/salesforceWebhook`
4. Check Netlify function logs for errors

## Quick Reference

**Named Credential:**
- Name: `Push_Notification_Webhook`
- URL: `https://cloudastick.org/.netlify/functions/`

**External Service:**
- Name: `PushNotificationCallout`
- Schema: Relative URL
- Named Credential: `Push_Notification_Webhook`
- Relative URL: `/salesforceWebhook`

**Final Endpoint:**
- `https://cloudastick.org/.netlify/functions/salesforceWebhook`

## Alternative: Direct URL (If External Service Not Available)

If you can't create an External Service, you can use the direct URL approach:

1. In HTTP Callout, select **"URL"** instead of **"External Service"**
2. Enter full URL: `https://cloudastick.org/.netlify/functions/salesforceWebhook`
3. This bypasses the External Service requirement

However, using External Service is recommended for:
- Better management
- Easier updates
- Centralized configuration

