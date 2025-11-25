# Salesforce Push Notifications Setup Guide

This guide explains how to configure Salesforce to send webhooks that trigger push notifications in your PWA.

## Overview

When a Salesforce object (Case, Lead, Opportunity, etc.) is created or updated, Salesforce needs to send a webhook to your Netlify function, which then sends push notifications to subscribed users.

## Prerequisites

1. Salesforce org with appropriate permissions
2. Your webhook URL: `https://cloudastick.org/.netlify/functions/salesforceWebhook`
   - See `DEPLOYMENT_URLS.md` for all available URLs
3. (Optional) Webhook secret for authentication

## Method 1: Change Data Capture (CDC) + Flow (Recommended)

Change Data Capture automatically tracks changes to Salesforce objects and can trigger Flows.

### Step 1: Enable Change Data Capture

1. In Salesforce Setup, search for **"Change Data Capture"**
2. Click **"Change Data Capture"** under Platform Integrations
3. Select the objects you want to monitor (e.g., Case, Lead, Opportunity)
4. Click **"Save"**

### Step 2: Create a Platform Event (Optional but Recommended)

Platform Events provide a more flexible way to handle CDC events.

1. In Setup, search for **"Platform Events"**
2. Click **"Platform Events"** → **"New Platform Event"**
3. Create an event called `Push_Notification_Event__e`
4. Add fields:
   - `Object_Type__c` (Text, 255)
   - `Record_Id__c` (Text, 255)
   - `Record_Name__c` (Text, 255)
   - `Action__c` (Text, 50) - Values: "created", "updated", "deleted"
   - `Additional_Data__c` (Long Text Area) - JSON string

### Step 3: Create a Flow to Handle CDC Events

1. In Setup, search for **"Flows"**
2. Click **"New Flow"**
3. Choose **"Record-Triggered Flow"**
4. Configure:
   - **Object**: Select your object (e.g., Case)
   - **Trigger**: "A record is created or updated"
   - **Entry Conditions**: (Optional) Add filters if needed

5. Add an **"Action"** element:
   - Choose **"Apex"** or **"HTTP Callout"**

#### Option A: HTTP Callout (Easier)

1. Add **"Action"** → **"HTTP Callout"**
2. Create a new HTTP Callout:
   - **Name**: `Send_Push_Notification`
   - **Endpoint URL**: `https://cloudastick.org/.netlify/functions/salesforceWebhook`
   - **Method**: `POST`
   - **Headers**:
     - `Content-Type`: `application/json`
     - `X-Webhook-Secret`: `your-webhook-secret` (if configured)
   - **Request Body** (JSON):
   ```json
   {
     "objectType": "{!$Record.Type}",
     "recordId": "{!$Record.Id}",
     "recordName": "{!$Record.Name}",
     "action": "{!$Record.IsNew}",
     "additionalData": {
       "Status": "{!$Record.Status}",
       "Priority": "{!$Record.Priority}",
       "Subject": "{!$Record.Subject}"
     }
   }
   ```

3. For the `action` field, use a formula:
   - If `{!$Record.IsNew}` = true → "created"
   - Else → "updated"

#### Option B: Platform Event + Apex (More Flexible)

1. Create an Apex class to publish Platform Events:

```apex
public class PushNotificationPublisher {
    public static void publishEvent(String objectType, String recordId, String recordName, String action, Map<String, Object> additionalData) {
        Push_Notification_Event__e event = new Push_Notification_Event__e();
        event.Object_Type__c = objectType;
        event.Record_Id__c = recordId;
        event.Record_Name__c = recordName;
        event.Action__c = action;
        
        if (additionalData != null) {
            event.Additional_Data__c = JSON.serialize(additionalData);
        }
        
        List<Database.SaveResult> results = EventBus.publish(new List<Push_Notification_Event__e>{ event });
        
        for (Database.SaveResult result : results) {
            if (!result.isSuccess()) {
                System.debug('Error publishing event: ' + result.getErrors());
            }
        }
    }
}
```

2. In your Flow, add an **"Apex"** action:
   - **Apex Class**: `PushNotificationPublisher`
   - **Method**: `publishEvent`
   - **Parameters**:
     - `objectType`: `{!$Record.Type}`
     - `recordId`: `{!$Record.Id}`
     - `recordName`: `{!$Record.Name}`
     - `action`: Formula `IF({!$Record.IsNew}, "created", "updated")`
     - `additionalData`: Create a Map variable with record fields

3. Create another Flow triggered by Platform Event:
   - **Trigger**: Platform Event
   - **Event**: `Push_Notification_Event__e`
   - Add **HTTP Callout** action to send webhook

### Step 4: Activate the Flow

1. Click **"Activate"** on your Flow
2. Test by creating/updating a record

## Method 2: Process Builder + HTTP Callout

### Step 1: Create a Process Builder

1. In Setup, search for **"Process Builder"**
2. Click **"New"**
3. Configure:
   - **Name**: `Send Push Notification on Case Update`
   - **Object**: Case (or your object)
   - **Start the process**: "When a record is created or edited"

### Step 2: Add Criteria

1. Add **"Criteria"** node
2. Set conditions (or leave blank for all records)
3. Click **"Save"**

### Step 3: Add Action

1. Add **"Action"** → **"Apex"** or **"Callout"**
2. If using Callout:
   - Create an **"Outbound Message"** or use **"HTTP Callout"** (requires Flow)
   - For HTTP Callout, you'll need to use a Flow (see Method 1)

## Method 3: Apex Trigger (Most Control)

Create an Apex trigger that sends HTTP callouts directly.

### Step 1: Create Apex Class for HTTP Callout

```apex
public class PushNotificationService {
    private static final String WEBHOOK_URL = 'https://cloudastick.org/.netlify/functions/salesforceWebhook';
    private static final String WEBHOOK_SECRET = 'your-webhook-secret'; // Store in Custom Metadata or Named Credential
    
    public static void sendNotification(String objectType, String recordId, String recordName, String action, Map<String, Object> additionalData) {
        HttpRequest req = new HttpRequest();
        req.setEndpoint(WEBHOOK_URL);
        req.setMethod('POST');
        req.setHeader('Content-Type', 'application/json');
        req.setHeader('X-Webhook-Secret', WEBHOOK_SECRET);
        req.setTimeout(12000);
        
        Map<String, Object> payload = new Map<String, Object>{
            'objectType' => objectType,
            'recordId' => recordId,
            'recordName' => recordName,
            'action' => action,
            'additionalData' => additionalData
        };
        
        req.setBody(JSON.serialize(payload));
        
        Http http = new Http();
        HttpResponse res;
        
        try {
            res = http.send(req);
            if (res.getStatusCode() != 200) {
                System.debug('Webhook error: ' + res.getStatusCode() + ' - ' + res.getBody());
            }
        } catch (Exception e) {
            System.debug('Webhook exception: ' + e.getMessage());
        }
    }
}
```

### Step 2: Create Apex Trigger

```apex
trigger CasePushNotification on Case (after insert, after update) {
    for (Case c : Trigger.new) {
        String action = Trigger.isInsert ? 'created' : 'updated';
        String recordName = c.Subject != null ? c.Subject : c.CaseNumber;
        
        Map<String, Object> additionalData = new Map<String, Object>{
            'Status' => c.Status,
            'Priority' => c.Priority,
            'Type' => c.Type,
            'Origin' => c.Origin
        };
        
        // Call asynchronously to avoid blocking
        PushNotificationService.sendNotification(
            'Case',
            c.Id,
            recordName,
            action,
            additionalData
        );
    }
}
```

### Step 3: Use @future or Queueable for Async Calls

For better performance, make the callout asynchronous:

```apex
public class PushNotificationService {
    // ... existing code ...
    
    @future(callout=true)
    public static void sendNotificationAsync(String objectType, String recordId, String recordName, String action, String additionalDataJson) {
        Map<String, Object> additionalData = (Map<String, Object>) JSON.deserializeUntyped(additionalDataJson);
        sendNotification(objectType, recordId, recordName, action, additionalData);
    }
}
```

Then in your trigger:
```apex
PushNotificationService.sendNotificationAsync(
    'Case',
    c.Id,
    recordName,
    action,
    JSON.serialize(additionalData)
);
```

## Method 4: Named Credentials (Recommended for Production)

Use Named Credentials for secure, managed authentication.

### Step 1: Create Named Credential

1. In Setup, search for **"Named Credentials"**
2. Click **"New Named Credential"**
3. Configure:
   - **Label**: `Push Notification Webhook`
   - **Name**: `Push_Notification_Webhook`
   - **URL**: `https://cloudastick.org/.netlify/functions/salesforceWebhook`
   - **Identity Type**: "Named Principal"
   - **Authentication Protocol**: "No Authentication" (or OAuth if you implement it)
   - **Generate Authorization Header**: Unchecked (unless using auth)

### Step 2: Update Apex Code to Use Named Credential

```apex
public class PushNotificationService {
    private static final String NAMED_CREDENTIAL = 'callout:Push_Notification_Webhook';
    
    public static void sendNotification(String objectType, String recordId, String recordName, String action, Map<String, Object> additionalData) {
        HttpRequest req = new HttpRequest();
        req.setEndpoint(NAMED_CREDENTIAL);
        req.setMethod('POST');
        req.setHeader('Content-Type', 'application/json');
        req.setTimeout(12000);
        
        // ... rest of the code ...
    }
}
```

## Webhook Payload Format

Your Salesforce implementation should send JSON in this format:

```json
{
  "objectType": "Case",
  "recordId": "500xx000000abc",
  "recordName": "Case Subject or Name",
  "action": "created",
  "additionalData": {
    "Status": "New",
    "Priority": "High",
    "Subject": "Case Subject",
    "Type": "Technical"
  }
}
```

## Testing Your Implementation

### Test 1: Create a Test Record

1. Create a new Case (or your object) in Salesforce
2. Check Netlify function logs for the webhook
3. Verify push notification is sent to subscribed users

### Test 2: Update a Record

1. Update an existing Case
2. Verify webhook is triggered
3. Check notification is received

### Test 3: Debug in Salesforce

Add debug logs in your Apex code:
```apex
System.debug('Sending push notification: ' + JSON.serialize(payload));
```

View logs in Setup → Debug Logs

## Security Best Practices

### 1. Use Named Credentials
- Centralized URL management
- Better security
- Easier to update

### 2. Store Secrets Securely
- Use Custom Metadata Types for configuration
- Use Protected Custom Settings
- Never hardcode secrets in code

### 3. Add Authentication
- Implement webhook secret validation
- Use OAuth if needed
- Validate payloads

### 4. Error Handling
- Implement retry logic
- Log failures
- Notify admins of issues

## Example: Complete Case Trigger Implementation

```apex
// PushNotificationService.cls
public class PushNotificationService {
    private static final String NAMED_CREDENTIAL = 'callout:Push_Notification_Webhook';
    
    @future(callout=true)
    public static void sendNotificationAsync(String objectType, String recordId, String recordName, String action, String additionalDataJson) {
        try {
            HttpRequest req = new HttpRequest();
            req.setEndpoint(NAMED_CREDENTIAL);
            req.setMethod('POST');
            req.setHeader('Content-Type', 'application/json');
            req.setTimeout(12000);
            
            Map<String, Object> payload = new Map<String, Object>{
                'objectType' => objectType,
                'recordId' => recordId,
                'recordName' => recordName,
                'action' => action,
                'additionalData' => (Map<String, Object>) JSON.deserializeUntyped(additionalDataJson)
            };
            
            req.setBody(JSON.serialize(payload));
            
            Http http = new Http();
            HttpResponse res = http.send(req);
            
            if (res.getStatusCode() != 200) {
                System.debug('Webhook error: ' + res.getStatusCode() + ' - ' + res.getBody());
                // Optionally, create a Platform Event or log to custom object for retry
            }
        } catch (Exception e) {
            System.debug('Webhook exception: ' + e.getMessage());
            System.debug('Stack trace: ' + e.getStackTraceString());
        }
    }
}

// CasePushNotification.trigger
trigger CasePushNotification on Case (after insert, after update) {
    List<Id> caseIds = new List<Id>();
    
    for (Case c : Trigger.new) {
        caseIds.add(c.Id);
    }
    
    // Query for full record details
    Map<Id, Case> caseMap = new Map<Id, Case>([
        SELECT Id, CaseNumber, Subject, Status, Priority, Type, Origin, CreatedDate
        FROM Case
        WHERE Id IN :caseIds
    ]);
    
    for (Case c : Trigger.new) {
        Case fullCase = caseMap.get(c.Id);
        String action = Trigger.isInsert ? 'created' : 'updated';
        String recordName = fullCase.Subject != null ? fullCase.Subject : fullCase.CaseNumber;
        
        Map<String, Object> additionalData = new Map<String, Object>{
            'CaseNumber' => fullCase.CaseNumber,
            'Status' => fullCase.Status,
            'Priority' => fullCase.Priority,
            'Type' => fullCase.Type,
            'Origin' => fullCase.Origin,
            'CreatedDate' => String.valueOf(fullCase.CreatedDate)
        };
        
        PushNotificationService.sendNotificationAsync(
            'Case',
            fullCase.Id,
            recordName,
            action,
            JSON.serialize(additionalData)
        );
    }
}
```

## Troubleshooting

### Webhook Not Received

1. **Check Named Credential URL** - Verify it's correct
2. **Check Debug Logs** - Look for errors in Salesforce
3. **Check Netlify Logs** - Verify webhook is received
4. **Test with Postman** - Manually send webhook to verify endpoint works

### Notifications Not Sent

1. **Check Subscriptions** - Verify users are subscribed
2. **Check VAPID Keys** - Ensure they're configured correctly
3. **Check Service Worker** - Verify it's registered in browser
4. **Check Browser Console** - Look for errors

### Performance Issues

1. **Use @future or Queueable** - Don't block triggers
2. **Batch Processing** - Process multiple records together
3. **Error Handling** - Don't let failures block other operations

## Next Steps

1. Choose your implementation method (recommended: Method 1 or Method 3)
2. Set up Named Credential
3. Create Apex classes and triggers
4. Test with a few records
5. Monitor logs and adjust as needed
6. Deploy to production

## Additional Resources

- [Salesforce Change Data Capture](https://developer.salesforce.com/docs/atlas.en-us.change_data_capture.meta/change_data_capture/)
- [Platform Events](https://developer.salesforce.com/docs/atlas.en-us.platform_events.meta/platform_events/)
- [Apex HTTP Callouts](https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_callouts_http.htm)
- [Named Credentials](https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_callouts_named_credentials.htm)

