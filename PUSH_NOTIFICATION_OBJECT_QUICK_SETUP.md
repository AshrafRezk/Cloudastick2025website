# Quick Setup: Push_Notification__c Object

## 5-Minute Setup for Your Custom Object

### Step 1: Create Flow (3 minutes)

1. Setup → **Flows** → **New Flow** → **Record-Triggered Flow**
2. **Object**: `Push_Notification__c`
3. **Trigger**: "A record is created or updated"

### Step 2: Create External Service (1 minute)

**Required before creating HTTP Callout:**

1. Setup → **External Services** → **New External Service**
2. Fill in:
   - **External Service Name**: `PushNotificationCallout`
   - **Service Schema**: `Relative URL`
   - **Select a Named Credential**: `Push_Notification_Webhook`
   - **URL**: `/salesforceWebhook` (must start with `/`)
3. **Save**

### Step 3: Add HTTP Callout (2 minutes)

1. Click **"+"** → **"Action"** → **"HTTP Callout"**
2. Click **"New"**
3. Configure:
   - **Name**: `Send_Push_Notification`
   - **Method**: `POST`
   - **URL Type**: **External Service** → `PushNotificationCallout`
   - **Headers**: `Content-Type` = `application/json`
   - **Body Type**: `JSON`
   - **Body**:
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

4. **Save** HTTP Callout
5. Back in Flow, the action is added

### Step 4: Differentiate Created vs Updated (Optional)

Add Assignment before HTTP Callout:
- **Variable**: `action` (Text)
- **Value**: `IF({!$Record.IsNew}, "created", "updated")`

Then in HTTP Callout body, use: `"action": "{!action}"`

### Step 5: Activate

1. **Save** Flow → Name: `Push Notification Flow`
2. **Activate**
3. ✅ Done!

## Test It

1. Create a new `Push_Notification__c` record
2. Fill in Title and Body
3. Save
4. Check if push notification appears in your PWA!

## What Happens

When you create/update a `Push_Notification__c` record:
- **Notification Title**: Uses the `Name` field (Title)
- **Notification Body**: Uses the `Body__c` field
- **Action**: Shows "created" or "updated"
- **Click**: Opens the notification detail page

## Full Documentation

See `SALESFORCE_PUSH_NOTIFICATION_OBJECT_SETUP.md` for complete details.

