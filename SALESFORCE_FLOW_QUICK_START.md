# Salesforce Flow Quick Start - 5 Minute Setup

The fastest way to set up push notifications using only Flows!

## 🚀 Quick Setup (5 Minutes)

### Step 1: Create Named Credential (2 minutes)

**Option A: Using External Credential (Recommended for newer Salesforce versions)**

1. First, create an External Credential:
   - Setup → **External Credentials** → **New**
   - **Label**: `No Auth Webhook`
   - **Name**: `No_Auth_Webhook`
   - **Authentication Protocol**: Select **"No Authentication"**
   - **Save**

2. Then create Named Credential:
   - Setup → **Named Credentials** → **New**
   - **Label**: `Push Notification Webhook`
   - **Name**: `Push_Notification_Webhook`
   - **URL**: `https://cloudastick.org/.netlify/functions/salesforceWebhook`
     - Alternative: `https://cloudastick.netlify.app/.netlify/functions/salesforceWebhook`
     - See `DEPLOYMENT_URLS.md` for all available URLs
   - **External Credential**: Select `No_Auth_Webhook` (the one you just created)
   - **Enabled for Callouts**: Toggle ON
   - **Generate Authorization Header**: Uncheck (not needed for no auth)
   - **Save**

**Option B: Direct URL (Simpler, if External Credential is not available)**

If you can't create an External Credential, you can use the direct URL in the Flow's HTTP Callout instead of a Named Credential. See Step 2 for details.

### Step 2: Create Flow (3 minutes)

1. Setup → **Flows** → **New Flow**
2. Choose **"Record-Triggered Flow"**
3. Click **"Create"**

#### Configure Start:
- **Object**: `Case` (or your object)
- **Trigger**: "A record is created or updated"
- **Entry Conditions**: None (or add if needed)

#### Add HTTP Callout:
1. Click **"+"** → **"Action"** → **"HTTP Callout"**
2. Click **"New"** to create new callout

**First, create External Service (Required):**
- Setup → **External Services** → **New External Service**
- **External Service Name**: `PushNotificationCallout`
- **Service Schema**: `Relative URL`
- **Select a Named Credential**: `Push_Notification_Webhook`
- **URL**: `/salesforceWebhook` (relative path, starts with `/`)
- **Save**

**Then configure HTTP Callout:**
- **Name**: `Send_Push_Notification`
- **Method**: `POST`
- **URL Type**: **External Service** → Select `PushNotificationCallout`
- **Headers**: 
  - Add: `Content-Type` = `application/json`

**Alternative (if External Service not available):**
- **URL Type**: **URL** → Enter `https://cloudastick.org/.netlify/functions/salesforceWebhook`
- **Request Body**:
  - **Body Type**: `JSON`
  - **Body**: Copy the JSON below

```json
{
  "objectType": "Case",
  "recordId": "{!$Record.Id}",
  "recordName": "{!$Record.Subject}",
  "action": "updated",
  "additionalData": {
    "CaseNumber": "{!$Record.CaseNumber}",
    "Status": "{!$Record.Status}",
    "Priority": "{!$Record.Priority}"
  }
}
```

**Important**: Replace `{!$Record.FieldName}` with actual field API names if different.

3. Click **"Save"** on HTTP Callout
4. Back in Flow, the action is now added

### Step 3: Differentiate Created vs Updated (1 minute)

To send "created" vs "updated", add an Assignment before HTTP Callout:

1. Click **"+"** → **"Assignment"**
2. **Name**: `Set Action`
3. **Add Variable**:
   - **Variable API Name**: `action`
   - **Data Type**: Text
   - **Value**: `IF({!$Record.IsNew}, "created", "updated")`
4. **Save**

5. In HTTP Callout body, change:
   ```json
   "action": "{!action}"
   ```

### Step 4: Activate (30 seconds)

1. Click **"Save"** → Name it: `Case Push Notification`
2. Click **"Activate"**
3. ✅ Done!

## 🧪 Test It

1. Create a new Case in Salesforce
2. Check Netlify function logs
3. Verify webhook received
4. Check if push notification appears in PWA

## 📋 Complete Flow Structure

```
Start (Case created/updated)
  ↓
Assignment (Set action = created/updated) [Optional]
  ↓
HTTP Callout (Send to webhook)
  ↓
End
```

## 🎯 For Other Objects

Same process, just change:
- **Object**: Lead, Opportunity, Push_Notification__c, etc.
- **recordName**: Use appropriate name field
- **additionalData**: Include relevant fields

### Example: Push_Notification__c Object

For the custom `Push_Notification__c` object:
- **Object**: `Push_Notification__c`
- **recordName**: `{!$Record.Name}` (Title field)
- **additionalData**: Include `Body__c` and other fields

See `SALESFORCE_PUSH_NOTIFICATION_OBJECT_SETUP.md` for complete setup guide.

## ⚠️ Common Issues

**Issue**: Flow not triggering
- ✅ Check Flow is **Activated**
- ✅ Verify Entry Conditions

**Issue**: HTTP Callout failing
- ✅ Check Named Credential URL
- ✅ Verify JSON format is valid
- ✅ Check Debug Logs

**Issue**: JSON errors
- ✅ Escape quotes: Use `\"`
- ✅ Test JSON in validator

## 🎉 That's It!

No Apex code needed - just Flow! 🚀

For more details, see `SALESFORCE_FLOW_IMPLEMENTATION.md`

