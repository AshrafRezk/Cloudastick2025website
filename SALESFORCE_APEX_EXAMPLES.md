# Salesforce Apex Code Examples

Ready-to-use Apex code for implementing push notifications from Salesforce.

## Quick Start: Copy-Paste Implementation

### 1. PushNotificationService.cls

```apex
/**
 * Service class for sending push notifications via webhook
 * Webhook URL: https://cloudastick.org/.netlify/functions/salesforceWebhook
 * See DEPLOYMENT_URLS.md for all available URLs
 */
public class PushNotificationService {
    // Option 1: Use Named Credential (Recommended)
    private static final String NAMED_CREDENTIAL = 'callout:Push_Notification_Webhook';
    
    // Option 2: Direct URL (if not using Named Credential)
    // private static final String WEBHOOK_URL = 'https://cloudastick.org/.netlify/functions/salesforceWebhook';
    // private static final String WEBHOOK_SECRET = 'your-webhook-secret'; // Store in Custom Metadata
    
    /**
     * Send push notification asynchronously
     * @param objectType Salesforce object type (e.g., 'Case', 'Lead')
     * @param recordId Record ID
     * @param recordName Record name/subject
     * @param action 'created', 'updated', or 'deleted'
     * @param additionalData Map of additional fields to include
     */
    @future(callout=true)
    public static void sendNotificationAsync(
        String objectType, 
        String recordId, 
        String recordName, 
        String action, 
        String additionalDataJson
    ) {
        try {
            HttpRequest req = new HttpRequest();
            
            // Use Named Credential if available, otherwise use direct URL
            if (String.isNotBlank(NAMED_CREDENTIAL) && NAMED_CREDENTIAL.startsWith('callout:')) {
                req.setEndpoint(NAMED_CREDENTIAL);
            } else {
                // req.setEndpoint(WEBHOOK_URL);
                // req.setHeader('X-Webhook-Secret', WEBHOOK_SECRET);
                throw new PushNotificationException('Webhook URL not configured. Please set up Named Credential or update WEBHOOK_URL.');
            }
            
            req.setMethod('POST');
            req.setHeader('Content-Type', 'application/json');
            req.setTimeout(12000); // 12 seconds
            
            // Build payload
            Map<String, Object> payload = new Map<String, Object>{
                'objectType' => objectType,
                'recordId' => recordId,
                'recordName' => recordName,
                'action' => action,
                'additionalData' => (Map<String, Object>) JSON.deserializeUntyped(additionalDataJson)
            };
            
            req.setBody(JSON.serialize(payload));
            
            // Send request
            Http http = new Http();
            HttpResponse res = http.send(req);
            
            // Log response
            if (res.getStatusCode() == 200) {
                System.debug('✅ Push notification sent successfully');
            } else {
                System.debug('❌ Webhook error: ' + res.getStatusCode() + ' - ' + res.getBody());
                // Consider creating a Platform Event or custom object record for retry logic
            }
        } catch (Exception e) {
            System.debug('❌ Webhook exception: ' + e.getMessage());
            System.debug('Stack trace: ' + e.getStackTraceString());
            // Don't throw - we don't want to block the trigger
        }
    }
    
    /**
     * Helper method to build additional data map
     */
    public static Map<String, Object> buildAdditionalData(SObject record, List<String> fields) {
        Map<String, Object> data = new Map<String, Object>();
        for (String field : fields) {
            if (record.get(field) != null) {
                data.put(field, record.get(field));
            }
        }
        return data;
    }
    
    /**
     * Custom exception class
     */
    public class PushNotificationException extends Exception {}
}
```

### 2. CasePushNotification.trigger

```apex
/**
 * Trigger to send push notifications when Cases are created or updated
 */
trigger CasePushNotification on Case (after insert, after update) {
    // Collect all case IDs
    Set<Id> caseIds = new Set<Id>();
    for (Case c : Trigger.new) {
        caseIds.add(c.Id);
    }
    
    // Query for full record details (triggers have limited field access)
    Map<Id, Case> caseMap = new Map<Id, Case>([
        SELECT Id, CaseNumber, Subject, Status, Priority, Type, Origin, 
               CreatedDate, Owner.Name, Account.Name, Contact.Name
        FROM Case
        WHERE Id IN :caseIds
    ]);
    
    // Process each case
    for (Case c : Trigger.new) {
        Case fullCase = caseMap.get(c.Id);
        
        // Determine action
        String action = Trigger.isInsert ? 'created' : 'updated';
        
        // Get record name (Subject or CaseNumber)
        String recordName = String.isNotBlank(fullCase.Subject) 
            ? fullCase.Subject 
            : fullCase.CaseNumber;
        
        // Build additional data
        Map<String, Object> additionalData = new Map<String, Object>{
            'CaseNumber' => fullCase.CaseNumber,
            'Status' => fullCase.Status,
            'Priority' => fullCase.Priority,
            'Type' => fullCase.Type,
            'Origin' => fullCase.Origin,
            'CreatedDate' => String.valueOf(fullCase.CreatedDate),
            'Owner' => fullCase.Owner?.Name,
            'Account' => fullCase.Account?.Name,
            'Contact' => fullCase.Contact?.Name
        };
        
        // Send notification asynchronously
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

### 3. LeadPushNotification.trigger

```apex
/**
 * Trigger to send push notifications when Leads are created or updated
 */
trigger LeadPushNotification on Lead (after insert, after update) {
    Set<Id> leadIds = new Set<Id>();
    for (Lead l : Trigger.new) {
        leadIds.add(l.Id);
    }
    
    Map<Id, Lead> leadMap = new Map<Id, Lead>([
        SELECT Id, Name, Company, Status, Rating, LeadSource, 
               CreatedDate, Owner.Name, Email, Phone
        FROM Lead
        WHERE Id IN :leadIds
    ]);
    
    for (Lead l : Trigger.new) {
        Lead fullLead = leadMap.get(l.Id);
        String action = Trigger.isInsert ? 'created' : 'updated';
        String recordName = fullLead.Name;
        
        Map<String, Object> additionalData = new Map<String, Object>{
            'Company' => fullLead.Company,
            'Status' => fullLead.Status,
            'Rating' => fullLead.Rating,
            'LeadSource' => fullLead.LeadSource,
            'CreatedDate' => String.valueOf(fullLead.CreatedDate),
            'Owner' => fullLead.Owner?.Name,
            'Email' => fullLead.Email,
            'Phone' => fullLead.Phone
        };
        
        PushNotificationService.sendNotificationAsync(
            'Lead',
            fullLead.Id,
            recordName,
            action,
            JSON.serialize(additionalData)
        );
    }
}
```

### 4. OpportunityPushNotification.trigger

```apex
/**
 * Trigger to send push notifications when Opportunities are created or updated
 */
trigger OpportunityPushNotification on Opportunity (after insert, after update) {
    Set<Id> oppIds = new Set<Id>();
    for (Opportunity o : Trigger.new) {
        oppIds.add(o.Id);
    }
    
    Map<Id, Opportunity> oppMap = new Map<Id, Opportunity>([
        SELECT Id, Name, StageName, Amount, CloseDate, Type,
               CreatedDate, Owner.Name, Account.Name, Probability
        FROM Opportunity
        WHERE Id IN :oppIds
    ]);
    
    for (Opportunity o : Trigger.new) {
        Opportunity fullOpp = oppMap.get(o.Id);
        String action = Trigger.isInsert ? 'created' : 'updated';
        String recordName = fullOpp.Name;
        
        Map<String, Object> additionalData = new Map<String, Object>{
            'StageName' => fullOpp.StageName,
            'Amount' => fullOpp.Amount,
            'CloseDate' => String.valueOf(fullOpp.CloseDate),
            'Type' => fullOpp.Type,
            'Probability' => fullOpp.Probability,
            'CreatedDate' => String.valueOf(fullOpp.CreatedDate),
            'Owner' => fullOpp.Owner?.Name,
            'Account' => fullOpp.Account?.Name
        };
        
        PushNotificationService.sendNotificationAsync(
            'Opportunity',
            fullOpp.Id,
            recordName,
            action,
            JSON.serialize(additionalData)
        );
    }
}
```

## Setup Instructions

### Step 1: Create Named Credential

1. In Salesforce Setup, search for **"Named Credentials"**
2. Click **"New Named Credential"**
3. Fill in:
   - **Label**: `Push Notification Webhook`
   - **Name**: `Push_Notification_Webhook` (must match the constant in Apex)
   - **URL**: `https://cloudastick.org/.netlify/functions/salesforceWebhook`
   - **Identity Type**: "Named Principal"
   - **Authentication Protocol**: "No Authentication"
4. Click **"Save"**

### Step 2: Deploy Apex Classes

1. In Developer Console or VS Code with Salesforce Extensions:
   - Create `PushNotificationService` class
   - Copy the code from above
   - Save and deploy

### Step 3: Deploy Triggers

1. Create triggers for each object you want to monitor:
   - `CasePushNotification` for Cases
   - `LeadPushNotification` for Leads
   - `OpportunityPushNotification` for Opportunities
   - Or create your own for other objects

### Step 4: Test

1. Create a test Case in Salesforce
2. Check Debug Logs for any errors
3. Verify webhook is received in Netlify logs
4. Check if push notification appears in your PWA

## Advanced: Using Custom Metadata for Configuration

### 1. Create Custom Metadata Type

1. Setup → Custom Metadata Types → New
2. Label: `Push Notification Config`
3. API Name: `Push_Notification_Config`
4. Add fields:
   - `Webhook_URL__c` (URL, 255)
   - `Webhook_Secret__c` (Text, 255, Encrypted)
   - `Enabled__c` (Checkbox)

### 2. Update Service Class

```apex
public class PushNotificationService {
    private static Push_Notification_Config__mdt config {
        get {
            if (config == null) {
                config = [SELECT Webhook_URL__c, Webhook_Secret__c, Enabled__c 
                         FROM Push_Notification_Config__mdt 
                         LIMIT 1];
            }
            return config;
        }
        set;
    }
    
    @future(callout=true)
    public static void sendNotificationAsync(
        String objectType, String recordId, String recordName, 
        String action, String additionalDataJson
    ) {
        // Check if enabled
        if (config == null || !config.Enabled__c) {
            System.debug('Push notifications are disabled');
            return;
        }
        
        try {
            HttpRequest req = new HttpRequest();
            req.setEndpoint(config.Webhook_URL__c);
            req.setMethod('POST');
            req.setHeader('Content-Type', 'application/json');
            if (String.isNotBlank(config.Webhook_Secret__c)) {
                req.setHeader('X-Webhook-Secret', config.Webhook_Secret__c);
            }
            req.setTimeout(12000);
            
            // ... rest of the code ...
        } catch (Exception e) {
            System.debug('Error: ' + e.getMessage());
        }
    }
}
```

## Error Handling & Retry Logic

### Enhanced Service with Retry

```apex
public class PushNotificationService {
    private static final Integer MAX_RETRIES = 3;
    
    @future(callout=true)
    public static void sendNotificationAsync(
        String objectType, String recordId, String recordName, 
        String action, String additionalDataJson, Integer retryCount
    ) {
        if (retryCount == null) retryCount = 0;
        
        try {
            // ... send webhook code ...
            
            if (res.getStatusCode() != 200 && retryCount < MAX_RETRIES) {
                // Retry after delay
                System.enqueueJob(new RetryNotificationJob(
                    objectType, recordId, recordName, action, 
                    additionalDataJson, retryCount + 1
                ));
            }
        } catch (Exception e) {
            if (retryCount < MAX_RETRIES) {
                System.enqueueJob(new RetryNotificationJob(
                    objectType, recordId, recordName, action, 
                    additionalDataJson, retryCount + 1
                ));
            }
        }
    }
}

// Queueable class for retries
public class RetryNotificationJob implements Queueable {
    private String objectType, recordId, recordName, action, additionalDataJson;
    private Integer retryCount;
    
    public RetryNotificationJob(String objectType, String recordId, 
                               String recordName, String action, 
                               String additionalDataJson, Integer retryCount) {
        this.objectType = objectType;
        this.recordId = recordId;
        this.recordName = recordName;
        this.action = action;
        this.additionalDataJson = additionalDataJson;
        this.retryCount = retryCount;
    }
    
    public void execute(QueueableContext context) {
        // Wait before retry (simulated with a delay)
        PushNotificationService.sendNotificationAsync(
            objectType, recordId, recordName, action, 
            additionalDataJson, retryCount
        );
    }
}
```

## Testing in Salesforce

### Test Class Example

```apex
@isTest
private class PushNotificationServiceTest {
    @isTest
    static void testSendNotification() {
        // Create test case
        Case testCase = new Case(
            Subject = 'Test Case',
            Status = 'New',
            Priority = 'High'
        );
        insert testCase;
        
        // Verify webhook was called (mock HTTP callout)
        Test.setMock(HttpCalloutMock.class, new PushNotificationMock());
        
        // Update case to trigger notification
        testCase.Status = 'Working';
        update testCase;
        
        // Assertions would go here
        System.assert(true);
    }
    
    // Mock HTTP response
    private class PushNotificationMock implements HttpCalloutMock {
        public HTTPResponse respond(HTTPRequest req) {
            HttpResponse res = new HttpResponse();
            res.setStatusCode(200);
            res.setBody('{"success": true}');
            return res;
        }
    }
}
```

## Notes

- Replace `YOUR_DOMAIN` with your actual Netlify domain
- The `@future(callout=true)` annotation allows async HTTP callouts
- Triggers query for full records because trigger context has limited field access
- Always handle exceptions to prevent blocking triggers
- Consider using Platform Events for more complex scenarios
- Test thoroughly in a sandbox before deploying to production

