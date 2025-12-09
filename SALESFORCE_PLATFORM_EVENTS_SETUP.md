# Salesforce Platform Events Setup for Cache Invalidation

## Overview

This guide provides detailed step-by-step instructions for setting up Platform Events in Salesforce to automatically invalidate the Netlify cache when data changes.

**Why Platform Events?**
- No CDC limits in your org
- More control over what gets published
- Can customize payload structure
- Better for custom objects

## Step 1: Create Platform Event Object

### 1.1 Navigate to Platform Events Setup

1. Log into Salesforce
2. Click the **Setup** gear icon (⚙️) in the top right
3. In Quick Find box, type: `Platform Events`
4. Click **Platform Events** under **Integrations**

### 1.2 Create New Platform Event

1. Click **New Platform Event** button
2. Fill in the details:
   - **Label**: `Cache Invalidation`
   - **Plural Label**: `Cache Invalidation Events`
   - **Object Name**: `Cache_Invalidation__e` (this is auto-generated from Label)
   - **Description**: `Platform event for invalidating Netlify cache when Salesforce records change`
   - Click **Next**

3. Review the settings:
   - Object Name should be: `Cache_Invalidation__e`
   - Click **Save**

### 1.3 Add Fields to Platform Event

1. After creating, you'll be on the Platform Event detail page
2. Scroll down to **Custom Fields & Relationships** section
3. Click **New** button
4. Create the following fields:

#### Field 1: Object Type
- **Field Label**: `Object Type`
- **Field Name**: `Object_Type__c` (auto-filled)
- **Data Type**: **Text**
- **Length**: 100
- **Required**: ✅ Yes
- Click **Next**
- **Field-Level Security**: 
  - ✅ Visible for all profiles
  - Click **Next**
- **Page Layout Assignment**: Default layout is fine, click **Save**

#### Field 2: Record ID
- **Field Label**: `Record ID`
- **Field Name**: `Record_ID__c` (auto-filled)
- **Data Type**: **Text**
- **Length**: 255 (to accommodate 18-character Salesforce IDs)
- **Required**: ✅ Yes
- Click **Next**
- **Field-Level Security**: 
  - ✅ Visible for all profiles
  - Click **Next**
- **Page Layout Assignment**: Default layout is fine, click **Save**

#### Field 3: Change Type
- **Field Label**: `Change Type`
- **Field Name**: `Change_Type__c` (auto-filled)
- **Data Type**: **Picklist**
- Click **Next**
- **Picklist Values**:
  - Click **New** to add values:
    1. **Value**: `CREATE` - **Display Order**: 1
    2. **Value**: `UPDATE` - **Display Order**: 2
    3. **Value**: `DELETE` - **Display Order**: 3
  - Click **Save** after each value
  - **Required**: ✅ Yes
  - **Default Value**: `UPDATE`
- Click **Next**
- **Field-Level Security**: 
  - ✅ Visible for all profiles
  - Click **Next**
- **Page Layout Assignment**: Default layout is fine, click **Save**

#### Field 4: Changed Fields (Optional)
- **Field Label**: `Changed Fields`
- **Field Name**: `Changed_Fields__c` (auto-filled)
- **Data Type**: **Long Text Area**
- **Length**: 32000
- **Required**: ❌ No
- Click **Next**
- **Field-Level Security**: 
  - ✅ Visible for all profiles
  - Click **Next**
- **Page Layout Assignment**: Default layout is fine, click **Save**

## Step 2: Create Named Credential for Netlify Webhook

### 2.1 Navigate to Named Credentials

1. In Setup, use Quick Find: `Named Credentials`
2. Click **Named Credentials** under **Integrations**

### 2.2 Create New Named Credential

1. Click **New Named Credential** button
2. Fill in the details:
   - **Label**: `Netlify Cache Webhook`
   - **Name**: `Netlify_Cache_Webhook` (auto-filled)
   - **URL**: `https://cloudastick.org/.netlify/functions/salesforceCacheWebhook`
   - **Identity Type**: **Named Principal**
   - **Authentication Protocol**: **No Authentication** (we'll use custom header for security)
   - **Enabled for Callouts**: ✅ **Yes** (check this box)
   - Click **Save**

**Note**: If you see "External Credential" showing "No Auth Webhook" after saving, that's fine - we're using a custom header for authentication instead.

### 2.3 Configure Custom Header (Required for Security)

1. After saving, you'll see the Named Credential detail page
2. Scroll to **Custom Headers** section
3. Click **New Header** button
4. Fill in:
   - **Header Name**: `X-Webhook-Secret`
   - **Header Value**: `YOUR_SECRET_KEY` (use a strong random string, e.g., `sk_live_abc123xyz789`)
   - Click **Save**

**Important Notes**:
- ✅ **Generate Authorization Header**: Can be checked or unchecked - doesn't matter since we're using custom header
- ✅ **Allow Formulas in HTTP Header**: Leave unchecked (we're using a static secret)
- ✅ **Allow Formulas in HTTP Body**: Leave unchecked
- **Copy the exact secret value** - you'll need to set it as `WEBHOOK_SECRET` in Netlify environment variables (same value, exact match)

### 2.4 Get Named Credential URL (for Flow)

1. On the Named Credential detail page
2. Note the **Callout URL** - it will be in the format:
   - `callout:Netlify_Cache_Webhook`
   - This is what you'll use in your Flow HTTP Callout

## Step 3: Create Flow to Publish Platform Events

We'll create a Flow for each object type you want to track. Here's how to create one for **Contact** as an example:

### 3.1 Create Record-Triggered Flow for Contact

1. In Setup, Quick Find: `Flows`
2. Click **Flows** under **Process Automation**
3. Click **New Flow** button
4. Select **Record-Triggered Flow** template
5. Click **Create**

### 3.2 Configure Flow Trigger

1. In the Flow Builder:
   - **Object**: Select `Contact`
   - **Trigger the Flow When**: Select `A record is created, updated, or deleted`
   - **Record Trigger**: Select `All record types` (or specific ones if needed)
   - **Optimize for**: Select `Actions and Related Records`
   - Click **Done**

### 3.3 Add Decision Element (Optional but Recommended)

If you only want to invalidate cache on certain conditions:

1. From the toolbox on the left, drag **Decision** element onto canvas
2. Name it: `Should Invalidate Cache?`
3. Click on the Decision element
4. In the right panel:
   - **Decision Outcome 1**:
     - **Outcome Name**: `Yes - Invalidate`
     - **Condition**: `{!$Record.Id}` → `Is Null` → `False` (always true for existing records)
   - **Decision Outcome 2**:
     - **Outcome Name**: `No - Skip`
     - Condition: Default Outcome
5. Click **Done**

### 3.4 Add Action to Publish Platform Event

1. From the toolbox, drag **Action** element onto canvas
2. Position it after the Decision element
3. Click on the Action element
4. In the right panel:
   - **Action Type**: Select `Publish Platform Event`
   - Click **Find an element** → Search for `Cache Invalidation`
   - Select the Platform Event: `Cache_Invalidation__e`

### 3.5 Configure Platform Event Fields

1. Click on the Action element to edit it
2. In the right panel, set the Platform Event fields:
   - **Object_Type__c**: 
     - Click in the field → Select `{!$Record}`
     - In the popup, find and select `ApiName` 
     - Actually, this won't work - use literal text instead:
     - Click the input → Select `Text` → Type: `Contact`
   
   - **Record_ID__c**: 
     - Click in the field → Select `{!$Record.Id}`
   
   - **Change_Type__c**: 
     - Click in the field → Select `Formula`
     - Enter formula:
     ```
     IF(
       {!$Record.Id} = null,
       "DELETE",
       IF(
         ISBLANK(PRIORVALUE({!$Record.Id})),
         "CREATE",
         "UPDATE"
       )
     )
     ```
     - Wait, Platform Events don't support PRIORVALUE in formulas
     - Instead, use a simpler approach:
     - Click in the field → Select `Text` → Type: `UPDATE`
     - We'll handle the logic differently (see alternative approach below)

3. Click **Done**

### 3.6 Alternative: Use Flow Variables for Change Type

Better approach - use Flow's built-in variables:

1. Delete the Change_Type__c assignment from above
2. Add a **Formula** element before the Action:
   - Name: `Determine Change Type`
   - Formula Output: 
   ```
   IF(
     {!$Flow.Interview.CurrentRecord.Id} = null,
     "DELETE",
     IF(
       ISBLANK({!$Flow.Interview.CurrentRecord.Id}),
       "CREATE",
       "UPDATE"
     )
   )
   ```
   - Actually, use this simpler approach with Flow variables:
   
   **Create a Formula Variable**:
   - In the Flow Builder, click **Manager** tab at the top
   - Click **New Resource** → **Variable**
   - **API Name**: `ChangeType`
   - **Data Type**: Text
   - **Available for Input**: ❌ No
   - **Available for Output**: ❌ No
   - Click **Done**
   
   **Set the Variable**:
   - Add an **Assignment** element before the Platform Event action
   - Name: `Set Change Type`
   - Click **Add Assignment**
   - **Variable**: Select `{!$Flow.ChangeType}`
   - **Operator**: Select `Equals`
   - **Value**: 
     - Since Flow variables don't have PRIORVALUE, we'll use `UPDATE` as default
     - You can create separate Flows for create/update/delete
     - Or use: `{!$Record.Id}` to determine (if null in trigger context = DELETE)
   
   **Simplest Solution**: Create 3 separate Flows:
   - Flow 1: Trigger on "A record is created" → Change Type = "CREATE"
   - Flow 2: Trigger on "A record is updated" → Change Type = "UPDATE"  
   - Flow 3: Trigger on "A record is deleted" → Change Type = "DELETE"

### 3.7 Configure Flow for Different Change Types

**For CREATE**:
1. Create new Flow
2. Trigger: `A record is created`
3. Platform Event Change_Type__c = `CREATE`

**For UPDATE**:
1. Create new Flow  
2. Trigger: `A record is updated`
3. Platform Event Change_Type__c = `UPDATE`

**For DELETE**:
1. Create new Flow
2. Trigger: `A record is deleted` (use "before delete" or "after delete")
3. Platform Event Change_Type__c = `DELETE`
4. Note: For delete, you need to capture the record ID before it's deleted
   - Use **Get Records** element to get the record before deletion
   - Or use `{!$Record.Id}` if using "before delete" trigger

### 3.8 Complete Flow Configuration

1. Connect all elements:
   - Decision → Action (if using Decision)
   - Start → Decision → Action (or Start → Action if no Decision)
2. Click **Save** button (top right)
3. Name the Flow: `Contact Cache Invalidation - CREATE` (or UPDATE/DELETE)
4. Click **Save**
5. Click **Activate** button
6. In the activation dialog, click **Activate**

### 3.9 Repeat for Other Objects

Create similar Flows for:
- **User** (object: `User`)
- **OKR__c** (object: `OKR__c`)
- **Blog_Post__c** (object: `Blog_Post__c`)
- **Requirement__c** (object: `Requirement__c`)
- **SFDC_Project__c** (object: `SFDC_Project__c`)

**Naming Convention**: `{ObjectName} Cache Invalidation - {ChangeType}`

Example:
- `Contact Cache Invalidation - CREATE`
- `Contact Cache Invalidation - UPDATE`
- `Contact Cache Invalidation - DELETE`
- `OKR__c Cache Invalidation - CREATE`
- etc.

## Step 4: Alternative - Use Apex Trigger (More Control)

If you prefer more control or need complex logic, use Apex Triggers:

### 4.1 Enable Apex Triggers in Setup

1. Setup → Quick Find: `Apex Triggers`
2. Click **Apex Triggers**

### 4.2 Create Trigger for Contact

1. Click **New Trigger**
2. Fill in:
   - **Name**: `ContactCacheInvalidationTrigger`
   - **sObject**: `Contact`
   - **Trigger Content**: Copy the code below

```apex
trigger ContactCacheInvalidationTrigger on Contact (after insert, after update, after delete, after undelete) {
    List<Cache_Invalidation__e> events = new List<Cache_Invalidation__e>();
    
    if (Trigger.isInsert) {
        for (Contact c : Trigger.new) {
            events.add(new Cache_Invalidation__e(
                Object_Type__c = 'Contact',
                Record_ID__c = c.Id,
                Change_Type__c = 'CREATE'
            ));
        }
    } else if (Trigger.isUpdate) {
        for (Contact c : Trigger.new) {
            events.add(new Cache_Invalidation__e(
                Object_Type__c = 'Contact',
                Record_ID__c = c.Id,
                Change_Type__c = 'UPDATE'
            ));
        }
    } else if (Trigger.isDelete || Trigger.isUndelete) {
        for (Contact c : Trigger.old) {
            events.add(new Cache_Invalidation__e(
                Object_Type__c = 'Contact',
                Record_ID__c = c.Id,
                Change_Type__c = Trigger.isDelete ? 'DELETE' : 'UPDATE'
            ));
        }
    }
    
    if (!events.isEmpty()) {
        List<Database.SaveResult> results = EventBus.publish(events);
        // Optional: Log errors
        for (Integer i = 0; i < results.size(); i++) {
            if (!results[i].isSuccess()) {
                System.debug('Failed to publish event: ' + results[i].getErrors());
            }
        }
    }
}
```

3. Click **Save**

### 4.3 Create Triggers for Other Objects

Create similar triggers for:
- **User** → `UserCacheInvalidationTrigger`
- **OKR__c** → `OKRCacheInvalidationTrigger`
- **Blog_Post__c** → `BlogPostCacheInvalidationTrigger`
- **Requirement__c** → `RequirementCacheInvalidationTrigger`
- **SFDC_Project__c** → `ProjectCacheInvalidationTrigger`

**Template Trigger Code** (replace `{Object}` and `{API_Name}`):

```apex
trigger {Object}CacheInvalidationTrigger on {API_Name} (after insert, after update, after delete, after undelete) {
    List<Cache_Invalidation__e> events = new List<Cache_Invalidation__e>();
    
    if (Trigger.isInsert) {
        for ({API_Name} obj : Trigger.new) {
            events.add(new Cache_Invalidation__e(
                Object_Type__c = '{API_Name}',
                Record_ID__c = obj.Id,
                Change_Type__c = 'CREATE'
            ));
        }
    } else if (Trigger.isUpdate) {
        for ({API_Name} obj : Trigger.new) {
            events.add(new Cache_Invalidation__e(
                Object_Type__c = '{API_Name}',
                Record_ID__c = obj.Id,
                Change_Type__c = 'UPDATE'
            ));
        }
    } else if (Trigger.isDelete || Trigger.isUndelete) {
        for ({API_Name} obj : Trigger.old) {
            events.add(new Cache_Invalidation__e(
                Object_Type__c = '{API_Name}',
                Record_ID__c = obj.Id,
                Change_Type__c = Trigger.isDelete ? 'DELETE' : 'UPDATE'
            ));
        }
    }
    
    if (!events.isEmpty()) {
        EventBus.publish(events);
    }
}
```

## Step 5: Create Flow to Send Platform Events to Netlify (Alternative Approach)

Instead of publishing Platform Events directly, you can create a Flow that subscribes to Platform Events and sends HTTP callouts:

### 5.1 Create Platform Event-Triggered Flow

1. Setup → Flows → New Flow
2. Select **Platform Event-Triggered Flow**
3. Click **Create**

### 5.2 Configure Platform Event Trigger

1. **Platform Event**: Select `Cache_Invalidation__e`
2. **Trigger the Flow When**: `A platform event message is received`
3. Click **Done**

### 5.3 Add HTTP Callout Action

1. From toolbox, drag **Action** element
2. Click on it
3. **Action Type**: `Apex Action` or `External Service`
4. Better: Use **HTTP Callout** (requires setting up first)

Actually, the simpler approach is to use the webhook handler that listens for Platform Events directly via Salesforce's outbound messaging or create a scheduled job.

**Recommended**: Use the Apex Trigger approach (Step 4) to publish Platform Events, then create a **Process Builder** or **Flow** that subscribes to these events and makes HTTP callouts.

## Step 6: Create Process Builder to Send HTTP Callout

### 6.1 Create Process Builder

1. Setup → Quick Find: `Process Builder`
2. Click **Process Builder**
3. Click **New** button

### 6.2 Configure Process

1. **Name**: `Send Cache Invalidation to Netlify`
2. **Description**: `Sends HTTP callout to Netlify when cache invalidation events are published`
3. Click **Save**

### 6.3 Add Object

1. Click **+ Add Object**
2. **Object**: Find and select `Cache_Invalidation__e` (Platform Event)
3. **Start the process**: `when a record is created`
4. Click **Save**

### 6.4 Add Action

1. Click **+ Add Action** (under the criteria)
2. **Action Type**: `Apex`
3. **Apex Class**: You'll need to create an Apex class for HTTP callout (see Step 7)

Actually, Process Builder doesn't directly support HTTP callouts. Use **Flow** instead.

## Step 7: Create Apex Class for HTTP Callout

### 7.1 Create Apex Class

1. Setup → Quick Find: `Apex Classes`
2. Click **Apex Classes**
3. Click **New** button
4. **Class Name**: `NetlifyCacheWebhookCallout`
5. Copy the code below:

```apex
public class NetlifyCacheWebhookCallout {
    
    @future(callout=true)
    public static void sendWebhook(String objectType, String recordId, String changeType) {
        HttpRequest req = new HttpRequest();
        req.setEndpoint('callout:Netlify_Cache_Webhook');
        req.setMethod('POST');
        req.setHeader('Content-Type', 'application/json');
        req.setTimeout(10000); // 10 second timeout
        
        // Build payload
        Map<String, Object> payload = new Map<String, Object>{
            'objectType' => objectType,
            'recordId' => recordId,
            'action' => changeType,
            'changeType' => changeType
        };
        
        req.setBody(JSON.serialize(payload));
        
        Http http = new Http();
        HttpResponse res;
        
        try {
            res = http.send(req);
            if (res.getStatusCode() != 200) {
                System.debug('Webhook callout failed: ' + res.getStatusCode() + ' - ' + res.getBody());
            }
        } catch (Exception e) {
            System.debug('Webhook callout error: ' + e.getMessage());
        }
    }
    
    // Invocable method for Flow/Process Builder
    @InvocableMethod(label='Send Cache Invalidation to Netlify' description='Sends cache invalidation webhook to Netlify')
    public static void sendWebhookInvocable(List<WebhookRequest> requests) {
        for (WebhookRequest req : requests) {
            sendWebhook(req.objectType, req.recordId, req.changeType);
        }
    }
    
    // Wrapper class for invocable method
    public class WebhookRequest {
        @InvocableVariable(label='Object Type' required=true)
        public String objectType;
        
        @InvocableVariable(label='Record ID' required=true)
        public String recordId;
        
        @InvocableVariable(label='Change Type' required=true)
        public String changeType;
    }
}
```

6. Click **Save**

### 7.2 Update Trigger to Call Apex Class

Modify your triggers to call the Apex class:

```apex
trigger ContactCacheInvalidationTrigger on Contact (after insert, after update, after delete, after undelete) {
    List<Cache_Invalidation__e> events = new List<Cache_Invalidation__e>();
    List<NetlifyCacheWebhookCallout.WebhookRequest> webhookRequests = new List<NetlifyCacheWebhookCallout.WebhookRequest>();
    
    if (Trigger.isInsert) {
        for (Contact c : Trigger.new) {
            events.add(new Cache_Invalidation__e(
                Object_Type__c = 'Contact',
                Record_ID__c = c.Id,
                Change_Type__c = 'CREATE'
            ));
            
            // Also call webhook directly
            NetlifyCacheWebhookCallout.WebhookRequest req = new NetlifyCacheWebhookCallout.WebhookRequest();
            req.objectType = 'Contact';
            req.recordId = c.Id;
            req.changeType = 'CREATE';
            webhookRequests.add(req);
        }
    } else if (Trigger.isUpdate) {
        for (Contact c : Trigger.new) {
            events.add(new Cache_Invalidation__e(
                Object_Type__c = 'Contact',
                Record_ID__c = c.Id,
                Change_Type__c = 'UPDATE'
            ));
            
            NetlifyCacheWebhookCallout.WebhookRequest req = new NetlifyCacheWebhookCallout.WebhookRequest();
            req.objectType = 'Contact';
            req.recordId = c.Id;
            req.changeType = 'UPDATE';
            webhookRequests.add(req);
        }
    } else if (Trigger.isDelete || Trigger.isUndelete) {
        for (Contact c : Trigger.old) {
            events.add(new Cache_Invalidation__e(
                Object_Type__c = 'Contact',
                Record_ID__c = c.Id,
                Change_Type__c = Trigger.isDelete ? 'DELETE' : 'UPDATE'
            ));
            
            NetlifyCacheWebhookCallout.WebhookRequest req = new NetlifyCacheWebhookCallout.WebhookRequest();
            req.objectType = 'Contact';
            req.recordId = c.Id;
            req.changeType = Trigger.isDelete ? 'DELETE' : 'UPDATE';
            webhookRequests.add(req);
        }
    }
    
    // Publish Platform Events (optional - for auditing)
    if (!events.isEmpty()) {
        EventBus.publish(events);
    }
    
    // Send webhooks to Netlify
    if (!webhookRequests.isEmpty()) {
        NetlifyCacheWebhookCallout.sendWebhookInvocable(webhookRequests);
    }
}
```

## Step 8: Set Webhook Secret in Netlify

1. Log into Netlify Dashboard
2. Go to your site
3. **Site settings** → **Environment variables**
4. Click **Add variable**
5. **Key**: `WEBHOOK_SECRET`
6. **Value**: The same secret you used in the Named Credential custom header
7. Click **Save**

## Step 9: Test the Setup

### 9.1 Test Platform Event Publishing

1. Go to any Contact record
2. Edit the record (change any field)
3. Save
4. Check Debug Logs:
   - Setup → Debug Logs
   - Look for entries from your trigger
   - Should see Platform Event published

### 9.2 Test Webhook

1. In Salesforce, create a test Platform Event manually:
   - Setup → Platform Events
   - Click on `Cache_Invalidation__e`
   - Click **Publish Event** (if available) or use Developer Console
2. Check Netlify Function logs:
   - Netlify Dashboard → Functions → `salesforceCacheWebhook`
   - Should see webhook received

### 9.3 Test Cache Invalidation

1. Create/update a Contact in Salesforce
2. Check Netlify Function logs for cache invalidation
3. Verify cache is cleared for that Contact

## Step 10: Monitor and Troubleshoot

### 10.1 Monitor Platform Events

- Setup → Platform Events → `Cache_Invalidation__e` → **Event Monitoring**
- View published events and their status

### 10.2 Monitor Webhooks

- Netlify Dashboard → Functions → `salesforceCacheWebhook` → **Logs**
- Check for errors or failed requests

### 10.3 Common Issues

**Issue**: Webhook not received
- Check Named Credential configuration
- Verify webhook URL is correct
- Check firewall/network settings
- Verify webhook secret matches

**Issue**: Platform Event not publishing
- Check trigger/flow is activated
- Verify object permissions
- Check debug logs for errors

**Issue**: Cache not invalidating
- Verify webhook payload format
- Check Netlify function logs
- Verify cache keys match expected format

## Summary

You now have:
1. ✅ Platform Event object created (`Cache_Invalidation__e`)
2. ✅ Named Credential configured for Netlify webhook
3. ✅ Triggers/Flows to publish Platform Events on data changes
4. ✅ Apex class to send HTTP callouts to Netlify
5. ✅ Webhook secret configured in Netlify
6. ✅ Cache invalidation system ready to use

When any tracked object (Contact, User, OKR__c, etc.) is created, updated, or deleted, it will automatically invalidate the corresponding cache in Netlify Blobs!

