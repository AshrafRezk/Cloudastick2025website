# Salesforce Named Credential Troubleshooting

## Issue: "External Credential" Field is Required

If you see an error saying "Complete this field" on the External Credential field when creating a Named Credential, follow these steps:

## Solution: Create External Credential First

### Step 1: Create External Credential

1. In Salesforce Setup, search for **"External Credentials"**
2. Click **"New External Credential"**
3. Fill in:
   - **Label**: `No Auth Webhook`
   - **Name**: `No_Auth_Webhook` (auto-populated from Label)
   - **Authentication Protocol**: Select **"No Authentication"** from dropdown
4. Click **"Save"**

### Step 2: Use External Credential in Named Credential

Now when creating your Named Credential:

1. **Label**: `Push Notification Webhook`
2. **Name**: `Push_Notification_Webhook`
3. **URL**: `https://cloudastick.org/.netlify/functions/salesforceWebhook`
4. **External Credential**: Select `No_Auth_Webhook` from the dropdown
5. **Enabled for Callouts**: Toggle ON
6. **Generate Authorization Header**: Uncheck (not needed for no authentication)
7. Click **"Save"**

## Alternative: Use Direct URL (No Named Credential)

If you prefer not to use Named Credentials, you can use the direct URL in your Flow's HTTP Callout:

1. In Flow Builder, when creating the HTTP Callout:
   - **URL Type**: Select **"URL"** (not "Named Credential")
   - **URL**: Enter `https://cloudastick.org/.netlify/functions/salesforceWebhook`

This works the same way, but the URL is stored in the Flow instead of a Named Credential.

## Why External Credential is Required

Salesforce now requires an External Credential to be associated with Named Credentials for better security and management, even when using "No Authentication". This is a newer requirement in Salesforce.

## Benefits of Using Named Credential

- **Centralized Management**: Update URL in one place
- **Security**: Better credential management
- **Reusability**: Use same credential in multiple Flows
- **Easier Updates**: Change URL without editing each Flow

## Quick Reference

**External Credential:**
- Label: `No Auth Webhook`
- Name: `No_Auth_Webhook`
- Authentication: `No Authentication`

**Named Credential:**
- Label: `Push Notification Webhook`
- Name: `Push_Notification_Webhook`
- URL: `https://cloudastick.org/.netlify/functions/salesforceWebhook`
- External Credential: `No_Auth_Webhook`
- Generate Authorization Header: **Unchecked**

