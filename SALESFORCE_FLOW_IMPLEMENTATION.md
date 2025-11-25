# Salesforce Flow Implementation for Push Notifications

Complete guide to implement push notifications using **only Flows** - no Apex code required! 🎉

## Overview

This implementation uses Salesforce Flow Builder to:
1. Detect when records are created/updated
2. Make HTTP callouts to your webhook
3. Send push notifications to your PWA

## Prerequisites

1. Salesforce org with Flow Builder access
2. Your webhook URL: `https://cloudastick.org/.netlify/functions/salesforceWebhook`
   - See `DEPLOYMENT_URLS.md` for all available URLs
3. (Optional) Named Credential for secure URL management

## Method 1: Record-Triggered Flow (Recommended)

### Step 1: Create Named Credential (Optional but Recommended)

**For newer Salesforce versions, you need to create an External Credential first:**

1. **Create External Credential**:
   - Setup → **External Credentials** → **New External Credential**
   - **Label**: `No Auth Webhook`
   - **Name**: `No_Auth_Webhook`
   - **Authentication Protocol**: Select **"No Authentication"**
   - Click **Save**

2. **Create Named Credential**:
   - Setup → **Named Credentials** → **New Named Credential**
   - **Label**: `Push Notification Webhook`
   - **Name**: `Push_Notification_Webhook`
   - **URL**: `https://cloudastick.org/.netlify/functions/salesforceWebhook`
   - **External Credential**: Select `No_Auth_Webhook` (the one you just created)
   - **Enabled for Callouts**: Toggle ON
   - **Generate Authorization Header**: Uncheck (not needed for no authentication)
   - Click **Save**

**Alternative**: If External Credentials are not available, you can use the direct URL in the HTTP Callout instead of a Named Credential.

### Step 2: Create Record-Triggered Flow for Cases

1. Setup → **Flows** → **New Flow**
2. Choose **"Record-Triggered Flow"**
3. Click **"Create"**

#### Configure Flow Properties

1. **Object**: Select `Case` (or your object)
2. **Trigger the Flow When**: "A record is created or updated"
3. **Entry Conditions**: (Optional) Add filters if needed
   - Example: Only trigger when `Status` changes
4. **Optimize for**: "Actions and Related Records"

#### Add Decision Element (Optional - for filtering)

1. Click **"+"** → **"Decision"**
2. Name: `Check if Notification Needed`
3. Add outcome conditions (optional):
   - **Outcome 1**: `Status Changed`
     - Condition: `{!$Record.Status}` does not equal `{!$Record__Prior.Status}`
   - **Outcome 2**: `Default Outcome` (always true)

#### Add Assignment Element (Prepare Data)

1. Click **"+"** → **"Assignment"**
2. Name: `Prepare Notification Data`
3. Create variables:
   - **Variable 1**: `action` (Text)
     - Formula: `IF({!$Record.IsNew}, "created", "updated")`
   - **Variable 2**: `recordName` (Text)
     - Formula: `IF(ISBLANK({!$Record.Subject}), {!$Record.CaseNumber}, {!$Record.Subject})`
   - **Variable 3**: `objectType` (Text)
     - Value: `Case`
   - **Variable 4**: `recordId` (Text)
     - Value: `{!$Record.Id}`
   - **Variable 5**: `additionalData` (Text - Long Text Area)
     - Formula: Build JSON string (see below)

#### Build JSON for Additional Data

For the `additionalData` variable, use this formula:

```
"{ \"CaseNumber\": \"" + {!$Record.CaseNumber} + "\", \"Status\": \"" + {!$Record.Status} + "\", \"Priority\": \"" + IF(ISBLANK({!$Record.Priority}), "", {!$Record.Priority}) + "\", \"Type\": \"" + IF(ISBLANK({!$Record.Type}), "", {!$Record.Type}) + "\", \"Origin\": \"" + IF(ISBLANK({!$Record.Origin}), "", {!$Record.Origin}) + "\" }"
```

**Note**: This is a simplified version. For complex JSON, see the advanced section below.

#### Add HTTP Callout Action

1. Click **"+"** → **"Action"** → **"Apex"** → Change to **"HTTP Callout"**
2. Click **"New"** to create a new HTTP Callout
3. Configure HTTP Callout:

   **Basic Information:**
   - **Name**: `Send_Push_Notification`
   - **Description**: `Send push notification to webhook`

   **Endpoint:**
   - **Method**: `POST`
   - **URL Type**: 
     - Select **"External Service"** → `PushNotificationCallout` (recommended)
     - OR **"URL"** → `https://cloudastick.org/.netlify/functions/salesforceWebhook` (alternative)

   **Headers:**
   - Click **"Add Header"**
   - **Name**: `Content-Type`
   - **Value**: `application/json`
   - (Optional) Add `X-Webhook-Secret` if you configured one

   **Request Body:**
   - **Body Type**: `JSON`
   - **JSON Body**: Use this template:

```json
{
  "objectType": "{!objectType}",
  "recordId": "{!recordId}",
  "recordName": "{!recordName}",
  "action": "{!action}",
  "additionalData": {!additionalData}
}
```

   **Note**: Replace `{!variableName}` with your actual variable API names.

4. Click **"Save"** to save the HTTP Callout
5. Back in the Flow, the HTTP Callout action should now be available

#### Configure HTTP Callout in Flow

1. Select the HTTP Callout action you just created
2. Map the variables:
   - The variables you created will automatically be available
   - Make sure the JSON body references them correctly

#### Add Error Handling (Optional but Recommended)

1. After the HTTP Callout, add a **Decision** element
2. Check if the callout was successful
3. Add actions for success/failure (e.g., create a log record)

### Step 3: Activate the Flow

1. Click **"Save"** → Give it a name: `Case Push Notification`
2. Click **"Activate"**
3. The flow is now live!

## Method 2: Platform Event + Flow (For Complex Scenarios)

If you need more flexibility or want to handle multiple objects:

### Step 1: Create Platform Event

1. Setup → **Platform Events** → **New Platform Event**
2. API Name: `Push_Notification_Event__e`
3. Add fields:
   - `Object_Type__c` (Text, 255)
   - `Record_Id__c` (Text, 255)
   - `Record_Name__c` (Text, 255)
   - `Action__c` (Text, 50)
   - `Additional_Data__c` (Long Text Area)

### Step 2: Create Record-Triggered Flow (Publisher)

1. Create a Record-Triggered Flow for your object
2. Add **"Action"** → **"Publish Platform Event"**
3. Map fields from record to platform event

### Step 3: Create Platform Event-Triggered Flow (Subscriber)

1. Create new Flow → **"Platform Event-Triggered Flow"**
2. Select your Platform Event
3. Add HTTP Callout action (same as Method 1)

## Complete Flow Example: Case Push Notification

Here's a step-by-step walkthrough for a complete Case flow:

### Flow Structure

```
Start → Decision (Optional Filter) → Assignment (Prepare Data) → HTTP Callout → End
```

### Detailed Steps

#### 1. Start Element
- **Object**: Case
- **Trigger**: "A record is created or updated"
- **Entry Conditions**: None (or add filters)

#### 2. Decision Element (Optional)
- **Name**: `Should Send Notification?`
- **Outcome 1**: `Yes` (Default)
- **Outcome 2**: `No` (if you want to skip certain cases)
  - Condition: `{!$Record.Status}` equals `Closed`

#### 3. Assignment Element
- **Name**: `Prepare Notification Payload`
- **Variables to Create**:

| Variable API Name | Data Type | Value/Formula |
|------------------|-----------|---------------|
| `action` | Text | `IF({!$Record.IsNew}, "created", "updated")` |
| `objectType` | Text | `Case` |
| `recordId` | Text | `{!$Record.Id}` |
| `recordName` | Text | `IF(ISBLANK({!$Record.Subject}), {!$Record.CaseNumber}, {!$Record.Subject})` |
| `jsonPayload` | Text | See formula below |

**JSON Payload Formula** (for `jsonPayload` variable):

```
"{ \"objectType\": \"Case\", \"recordId\": \"" + {!$Record.Id} + "\", \"recordName\": \"" + SUBSTITUTE(SUBSTITUTE(IF(ISBLANK({!$Record.Subject}), {!$Record.CaseNumber}, {!$Record.Subject}), "\"", "\\\""), "\n", "\\n") + "\", \"action\": \"" + IF({!$Record.IsNew}, "created", "updated") + "\", \"additionalData\": { \"CaseNumber\": \"" + {!$Record.CaseNumber} + "\", \"Status\": \"" + {!$Record.Status} + "\", \"Priority\": \"" + IF(ISBLANK({!$Record.Priority}), "", {!$Record.Priority}) + "\" } }"
```

**Note**: This formula escapes quotes and newlines. For simpler version, see below.

#### 4. HTTP Callout Action

**Create New HTTP Callout:**

1. **Name**: `Send_Push_Notification`
2. **Method**: POST
3. **URL**: Use Named Credential `Push_Notification_Webhook` OR direct URL
4. **Headers**:
   - `Content-Type`: `application/json`
5. **Request Body** (JSON):
```json
{!jsonPayload}
```

**Simpler Alternative** (if JSON formula is too complex):

Instead of building JSON in a formula, create the HTTP Callout with this body:

```json
{
  "objectType": "Case",
  "recordId": "{!$Record.Id}",
  "recordName": "{!$Record.Subject}",
  "action": "{!$Record.IsNew}",
  "additionalData": {
    "CaseNumber": "{!$Record.CaseNumber}",
    "Status": "{!$Record.Status}",
    "Priority": "{!$Record.Priority}"
  }
}
```

**Note**: For the `action` field, you'll need to use a formula in the HTTP Callout body builder, or create a variable first.

## Simplified Flow (Easiest Method)

### Quick Setup (5 minutes)

1. **Create Flow**: Record-Triggered Flow on Case
2. **Add HTTP Callout**: 
   - URL: Your webhook URL
   - Method: POST
   - Body Type: JSON
   - Body:
```json
{
  "objectType": "Case",
  "recordId": "{!$Record.Id}",
  "recordName": "{!$Record.Subject}",
  "action": "updated",
  "additionalData": {
    "Status": "{!$Record.Status}"
  }
}
```

3. **Activate** - Done!

**Note**: This sends "updated" for all triggers. To differentiate created vs updated, add an Assignment element first to set the action variable.

## Advanced: Building Complex JSON in Flow

### Method 1: Use Text Template Resource

1. Setup → **Flows** → **Manager** → **Resources** tab
2. Create **"Text Template"** resource
3. Use merge fields: `{!$Record.FieldName}`
4. Reference in Flow: `{!TextTemplateResource}`

### Method 2: Use Multiple Assignment Elements

Build JSON piece by piece:

1. **Assignment 1**: Create base JSON
   ```
   jsonPayload = "{ \"objectType\": \"Case\", \"recordId\": \"" + {!$Record.Id} + "\", "
   ```

2. **Assignment 2**: Append more fields
   ```
   jsonPayload = {!jsonPayload} + "\"recordName\": \"" + {!$Record.Subject} + "\", "
   ```

3. Continue building...

### Method 3: Use Apex Action (If Needed)

If JSON becomes too complex, create a simple Apex action that builds JSON:

```apex
public class BuildNotificationPayload {
    @InvocableMethod(label='Build Push Notification Payload')
    public static List<String> buildPayload(List<Request> requests) {
        List<String> results = new List<String>();
        for (Request req : requests) {
            Map<String, Object> payload = new Map<String, Object>{
                'objectType' => req.objectType,
                'recordId' => req.recordId,
                'recordName' => req.recordName,
                'action' => req.action,
                'additionalData' => (Map<String, Object>) JSON.deserializeUntyped(req.additionalData)
            };
            results.add(JSON.serialize(payload));
        }
        return results;
    }
    
    public class Request {
        @InvocableVariable public String objectType;
        @InvocableVariable public String recordId;
        @InvocableVariable public String recordName;
        @InvocableVariable public String action;
        @InvocableVariable public String additionalData;
    }
}
```

Then use this in Flow as an Apex action.

## Testing Your Flow

### Step 1: Use Flow Debug

1. In Flow Builder, click **"Debug"**
2. Select a test Case record
3. Run the flow
4. Check the HTTP Callout result

### Step 2: Check Netlify Logs

1. Go to Netlify Dashboard → Functions → Logs
2. Create/update a Case in Salesforce
3. Verify webhook is received

### Step 3: Verify Push Notification

1. Ensure a user is subscribed to push notifications in your PWA
2. Create/update a Case
3. Check if notification appears

## Flow Examples for Other Objects

### Lead Push Notification Flow

Same structure, but:
- **Object**: Lead
- **recordName**: `{!$Record.Name}`
- **additionalData**: Include Lead-specific fields

### Opportunity Push Notification Flow

- **Object**: Opportunity
- **recordName**: `{!$Record.Name}`
- **additionalData**: Include Amount, StageName, CloseDate, etc.

## Troubleshooting

### Flow Not Triggering

1. Check Flow is **Activated**
2. Verify **Entry Conditions** aren't too restrictive
3. Check **Flow Interview** logs in Setup → Debug Logs

### HTTP Callout Failing

1. Check **Named Credential** URL is correct
2. Verify webhook URL is accessible
3. Check **Request Body** format is valid JSON
4. Review **Debug Logs** for error messages

### JSON Format Issues

1. Escape quotes: Use `\"` instead of `"`
2. Escape newlines: Use `\\n`
3. Test JSON in a validator before using in Flow
4. Consider using Text Template resource for complex JSON

## Best Practices

1. **Use Named Credentials** - Easier to update URLs
2. **Add Entry Conditions** - Only trigger when needed
3. **Handle Errors** - Add decision after HTTP Callout
4. **Test Thoroughly** - Use Flow Debug before activating
5. **Monitor Performance** - Check Flow Interview limits
6. **Document** - Add descriptions to each element

## Flow Limitations & Workarounds

### Limitation: Complex JSON Building

**Workaround**: Use Text Template resource or simple Apex action

### Limitation: Async Processing

**Workaround**: Flows run synchronously, but HTTP callouts are async. For heavy processing, use Platform Events.

### Limitation: Error Handling

**Workaround**: Add Decision elements after HTTP Callout to check response status

## Quick Reference: HTTP Callout Configuration

```
Name: Send_Push_Notification
Method: POST
URL: callout:Push_Notification_Webhook (or direct URL)
Headers:
  - Content-Type: application/json
Body Type: JSON
Body:
{
  "objectType": "Case",
  "recordId": "{!$Record.Id}",
  "recordName": "{!$Record.Subject}",
  "action": "{!actionVariable}",
  "additionalData": {
    "Status": "{!$Record.Status}"
  }
}
```

## Summary

✅ **No Apex Code Required!**
✅ **100% Flow-Based Solution**
✅ **Easy to Maintain and Update**
✅ **Visual and User-Friendly**

Just create a Record-Triggered Flow, add an HTTP Callout, and you're done! 🎉

