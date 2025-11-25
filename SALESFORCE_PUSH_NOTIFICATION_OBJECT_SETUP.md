# Push Notification Object Flow Setup

Complete guide to set up push notifications for the **Push_Notification__c** custom object.

## Overview

When a record is created or updated in the `Push_Notification__c` object, a push notification will be sent to subscribed users in your PWA.

## Step 1: Create External Credential (If Not Done)

1. Setup → **External Credentials** → **New External Credential**
2. **Label**: `No Auth Webhook`
3. **Name**: `No_Auth_Webhook`
4. **Authentication Protocol**: **"No Authentication"**
5. **Save**

## Step 2: Create Named Credential

1. Setup → **Named Credentials** → **New Named Credential**
2. **Label**: `Push Notification Webhook`
3. **Name**: `Push_Notification_Webhook`
4. **URL**: `https://cloudastick.org/.netlify/functions/salesforceWebhook`
5. **External Credential**: Select `No_Auth_Webhook`
6. **Enabled for Callouts**: Toggle ON
7. **Generate Authorization Header**: Uncheck
8. **Save**

## Step 3: Create Record-Triggered Flow

### 3.1 Create the Flow

1. Setup → **Flows** → **New Flow**
2. Choose **"Record-Triggered Flow"**
3. Click **"Create"**

### 3.2 Configure Start Element

1. **Object**: Select `Push_Notification__c`
2. **Trigger the Flow When**: "A record is created or updated"
3. **Entry Conditions**: (Optional) Add filters if needed
   - Example: Only trigger when `Status__c` equals "Active"
4. **Optimize for**: "Actions and Related Records"

### 3.3 Add Assignment Element (Prepare Data)

1. Click **"+"** → **"Assignment"**
2. **Name**: `Prepare Notification Data`

**Create Variables:**

| Variable API Name | Data Type | Value/Formula |
|------------------|-----------|---------------|
| `action` | Text | `IF({!$Record.IsNew}, "created", "updated")` |
| `objectType` | Text | `Push_Notification__c` |
| `recordId` | Text | `{!$Record.Id}` |
| `recordName` | Text | `IF(ISBLANK({!$Record.Name}), "Push Notification", {!$Record.Name})` |
| `jsonPayload` | Text | See formula below |

**JSON Payload Formula** (for `jsonPayload` variable):

```
"{ \"objectType\": \"Push_Notification__c\", \"recordId\": \"" + {!$Record.Id} + "\", \"recordName\": \"" + SUBSTITUTE(SUBSTITUTE(IF(ISBLANK({!$Record.Name}), "Push Notification", {!$Record.Name}), "\"", "\\\""), "\n", "\\n") + "\", \"action\": \"" + IF({!$Record.IsNew}, "created", "updated") + "\", \"additionalData\": { \"Title\": \"" + IF(ISBLANK({!$Record.Name}), "", SUBSTITUTE({!$Record.Name}, "\"", "\\\"")) + "\", \"Body\": \"" + IF(ISBLANK({!$Record.Body__c}), "", SUBSTITUTE({!$Record.Body__c}, "\"", "\\\"")) + "\" } }"
```

**Simpler Alternative** (if formula is too complex):

Instead of building JSON in a formula, create the HTTP Callout with this body directly:

```json
{
  "objectType": "Push_Notification__c",
  "recordId": "{!$Record.Id}",
  "recordName": "{!$Record.Name}",
  "action": "{!$Record.IsNew}",
  "additionalData": {
    "Title": "{!$Record.Name}",
    "Body": "{!$Record.Body__c}"
  }
}
```

**Note**: For the `action` field, you'll need to use the `action` variable created in the Assignment step, or use a formula in the HTTP Callout.

### 3.4 Create External Service (Required First)

Before creating the HTTP Callout, you need to create an External Service:

1. Setup → **External Services** → **New External Service**
2. Fill in:
   - **External Service Name**: `PushNotificationCallout`
   - **Description**: `External service for push notification webhooks`
   - **Service Schema**: Select **"Relative URL"**
   - **Select a Named Credential**: `Push_Notification_Webhook`
   - **URL**: `/salesforceWebhook` (relative path, must start with `/`)
3. Click **Save**

**Note**: The relative URL `/salesforceWebhook` gets appended to your Named Credential base URL (`https://cloudastick.org/.netlify/functions/`) to create the full endpoint.

### 3.5 Add HTTP Callout Action

1. Click **"+"** → **"Action"** → **"HTTP Callout"**
2. Click **"New"** to create new callout

**Configure HTTP Callout:**

- **Name**: `Send_Push_Notification`
- **Method**: `POST`
- **URL Type**: **External Service** → Select `PushNotificationCallout`
- **Headers**: 
  - Add: `Content-Type` = `application/json`
- **Request Body**:
  - **Body Type**: `JSON`
  - **Body**: Use one of these options:

**Option A: Using Variables (Recommended)**

```json
{
  "objectType": "Push_Notification__c",
  "recordId": "{!recordId}",
  "recordName": "{!recordName}",
  "action": "{!action}",
  "additionalData": {
    "Title": "{!$Record.Name}",
    "Body": "{!$Record.Body__c}"
  }
}
```

**Option B: Direct Field References**

```json
{
  "objectType": "Push_Notification__c",
  "recordId": "{!$Record.Id}",
  "recordName": "{!$Record.Name}",
  "action": "updated",
  "additionalData": {
    "Title": "{!$Record.Name}",
    "Body": "{!$Record.Body__c}"
  }
}
```

**Note**: If using Option B, you'll need to add an Assignment element before the HTTP Callout to set the `action` variable to differentiate between "created" and "updated".

3. Click **"Save"** on HTTP Callout
4. Back in Flow, the action is now added

### 3.5 Add Error Handling (Optional)

1. After HTTP Callout, add a **Decision** element
2. Check if callout was successful
3. Add actions for success/failure logging

### 3.6 Activate the Flow

1. Click **"Save"** → Name it: `Push Notification Object Flow`
2. Click **"Activate"**
3. ✅ Done!

## Complete Flow Structure

```
Start (Push_Notification__c created/updated)
  ↓
Assignment (Set action, recordName, etc.)
  ↓
HTTP Callout (Send to webhook)
  ↓
End
```

## Testing

1. **Create a test record**:
   - Go to Push Notification tab
   - Click "New"
   - Fill in Title and Body
   - Save

2. **Check Netlify logs**:
   - Go to Netlify Dashboard → Functions → Logs
   - Verify webhook was received

3. **Verify push notification**:
   - Ensure a user is subscribed in your PWA
   - Check if notification appears

## Field Mapping

Based on your object structure:

| Salesforce Field | API Name | Usage |
|-----------------|----------|-------|
| Title | `Name` | Used as `recordName` in notification |
| Body | `Body__c` | Included in `additionalData` |
| Owner | `OwnerId` | Can be included in `additionalData` if needed |
| Created Date | `CreatedDate` | Can be included in `additionalData` if needed |

## Customizing Additional Data

To include more fields in the notification, add them to the `additionalData` object in the JSON:

```json
{
  "objectType": "Push_Notification__c",
  "recordId": "{!$Record.Id}",
  "recordName": "{!$Record.Name}",
  "action": "{!action}",
  "additionalData": {
    "Title": "{!$Record.Name}",
    "Body": "{!$Record.Body__c}",
    "Owner": "{!$Record.Owner.Name}",
    "CreatedDate": "{!$Record.CreatedDate}",
    "Currency": "{!$Record.CurrencyIsoCode}"
  }
}
```

## Notification Display

When a Push_Notification__c record is created/updated:

- **Title**: Will show the `Name` field from the record
- **Body**: Will show the `Body__c` field content
- **Action**: Will show "created" or "updated"
- **URL**: Will link to the record (you can customize this in the webhook function)

## Troubleshooting

### Flow Not Triggering
- ✅ Check Flow is **Activated**
- ✅ Verify Entry Conditions aren't too restrictive
- ✅ Check Flow Interview logs in Setup → Debug Logs

### HTTP Callout Failing
- ✅ Check Named Credential URL is correct
- ✅ Verify JSON format is valid
- ✅ Check Debug Logs for error messages
- ✅ Test webhook URL manually with Postman/curl

### Notification Not Appearing
- ✅ Verify user is subscribed to push notifications in PWA
- ✅ Check browser console for errors
- ✅ Verify service worker is registered
- ✅ Check VAPID keys are configured

## Next Steps

1. Test with a few records
2. Monitor Netlify function logs
3. Adjust notification content as needed
4. Add more fields to `additionalData` if desired
5. Customize notification display in the webhook function

## Quick Reference

**Object**: `Push_Notification__c`
**Webhook URL**: `https://cloudastick.org/.netlify/functions/salesforceWebhook`
**Named Credential**: `Push_Notification_Webhook`
**Flow Name**: `Push Notification Object Flow`

