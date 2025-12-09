# Salesforce Apex Code Templates

## 1. Netlify Cache Webhook Apex Class

**File**: Setup → Apex Classes → New → Class Name: `NetlifyCacheWebhookCallout`

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
            } else {
                System.debug('Webhook callout successful for ' + objectType + ':' + recordId);
            }
        } catch (Exception e) {
            System.debug('Webhook callout error: ' + e.getMessage());
            // Don't throw - we don't want to block the transaction
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

## 2. Contact Cache Invalidation Trigger

**File**: Setup → Apex Triggers → New → Trigger Name: `ContactCacheInvalidationTrigger`

```apex
trigger ContactCacheInvalidationTrigger on Contact (after insert, after update, after delete, after undelete) {
    List<NetlifyCacheWebhookCallout.WebhookRequest> webhookRequests = new List<NetlifyCacheWebhookCallout.WebhookRequest>();
    
    if (Trigger.isInsert) {
        for (Contact c : Trigger.new) {
            NetlifyCacheWebhookCallout.WebhookRequest req = new NetlifyCacheWebhookCallout.WebhookRequest();
            req.objectType = 'Contact';
            req.recordId = c.Id;
            req.changeType = 'CREATE';
            webhookRequests.add(req);
        }
    } else if (Trigger.isUpdate) {
        for (Contact c : Trigger.new) {
            NetlifyCacheWebhookCallout.WebhookRequest req = new NetlifyCacheWebhookCallout.WebhookRequest();
            req.objectType = 'Contact';
            req.recordId = c.Id;
            req.changeType = 'UPDATE';
            webhookRequests.add(req);
        }
    } else if (Trigger.isDelete) {
        for (Contact c : Trigger.old) {
            NetlifyCacheWebhookCallout.WebhookRequest req = new NetlifyCacheWebhookCallout.WebhookRequest();
            req.objectType = 'Contact';
            req.recordId = c.Id;
            req.changeType = 'DELETE';
            webhookRequests.add(req);
        }
    } else if (Trigger.isUndelete) {
        for (Contact c : Trigger.new) {
            NetlifyCacheWebhookCallout.WebhookRequest req = new NetlifyCacheWebhookCallout.WebhookRequest();
            req.objectType = 'Contact';
            req.recordId = c.Id;
            req.changeType = 'UPDATE'; // Treat undelete as update
            webhookRequests.add(req);
        }
    }
    
    // Send webhooks asynchronously (won't block transaction)
    if (!webhookRequests.isEmpty()) {
        NetlifyCacheWebhookCallout.sendWebhookInvocable(webhookRequests);
    }
}
```

## 3. User Cache Invalidation Trigger

**File**: Setup → Apex Triggers → New → Trigger Name: `UserCacheInvalidationTrigger`

```apex
trigger UserCacheInvalidationTrigger on User (after insert, after update, after delete, after undelete) {
    List<NetlifyCacheWebhookCallout.WebhookRequest> webhookRequests = new List<NetlifyCacheWebhookCallout.WebhookRequest>();
    
    if (Trigger.isInsert) {
        for (User u : Trigger.new) {
            NetlifyCacheWebhookCallout.WebhookRequest req = new NetlifyCacheWebhookCallout.WebhookRequest();
            req.objectType = 'User';
            req.recordId = u.Id;
            req.changeType = 'CREATE';
            webhookRequests.add(req);
        }
    } else if (Trigger.isUpdate) {
        for (User u : Trigger.new) {
            NetlifyCacheWebhookCallout.WebhookRequest req = new NetlifyCacheWebhookCallout.WebhookRequest();
            req.objectType = 'User';
            req.recordId = u.Id;
            req.changeType = 'UPDATE';
            webhookRequests.add(req);
        }
    } else if (Trigger.isDelete) {
        for (User u : Trigger.old) {
            NetlifyCacheWebhookCallout.WebhookRequest req = new NetlifyCacheWebhookCallout.WebhookRequest();
            req.objectType = 'User';
            req.recordId = u.Id;
            req.changeType = 'DELETE';
            webhookRequests.add(req);
        }
    } else if (Trigger.isUndelete) {
        for (User u : Trigger.new) {
            NetlifyCacheWebhookCallout.WebhookRequest req = new NetlifyCacheWebhookCallout.WebhookRequest();
            req.objectType = 'User';
            req.recordId = u.Id;
            req.changeType = 'UPDATE';
            webhookRequests.add(req);
        }
    }
    
    if (!webhookRequests.isEmpty()) {
        NetlifyCacheWebhookCallout.sendWebhookInvocable(webhookRequests);
    }
}
```

## 4. OKR__c Cache Invalidation Trigger

**File**: Setup → Apex Triggers → New → Trigger Name: `OKRCacheInvalidationTrigger`

```apex
trigger OKRCacheInvalidationTrigger on OKR__c (after insert, after update, after delete, after undelete) {
    List<NetlifyCacheWebhookCallout.WebhookRequest> webhookRequests = new List<NetlifyCacheWebhookCallout.WebhookRequest>();
    
    if (Trigger.isInsert) {
        for (OKR__c okr : Trigger.new) {
            NetlifyCacheWebhookCallout.WebhookRequest req = new NetlifyCacheWebhookCallout.WebhookRequest();
            req.objectType = 'OKR__c';
            req.recordId = okr.Id;
            req.changeType = 'CREATE';
            webhookRequests.add(req);
        }
    } else if (Trigger.isUpdate) {
        for (OKR__c okr : Trigger.new) {
            NetlifyCacheWebhookCallout.WebhookRequest req = new NetlifyCacheWebhookCallout.WebhookRequest();
            req.objectType = 'OKR__c';
            req.recordId = okr.Id;
            req.changeType = 'UPDATE';
            webhookRequests.add(req);
        }
    } else if (Trigger.isDelete) {
        for (OKR__c okr : Trigger.old) {
            NetlifyCacheWebhookCallout.WebhookRequest req = new NetlifyCacheWebhookCallout.WebhookRequest();
            req.objectType = 'OKR__c';
            req.recordId = okr.Id;
            req.changeType = 'DELETE';
            webhookRequests.add(req);
        }
    } else if (Trigger.isUndelete) {
        for (OKR__c okr : Trigger.new) {
            NetlifyCacheWebhookCallout.WebhookRequest req = new NetlifyCacheWebhookCallout.WebhookRequest();
            req.objectType = 'OKR__c';
            req.recordId = okr.Id;
            req.changeType = 'UPDATE';
            webhookRequests.add(req);
        }
    }
    
    if (!webhookRequests.isEmpty()) {
        NetlifyCacheWebhookCallout.sendWebhookInvocable(webhookRequests);
    }
}
```

## 5. Blog_Post__c Cache Invalidation Trigger

**File**: Setup → Apex Triggers → New → Trigger Name: `BlogPostCacheInvalidationTrigger`

```apex
trigger BlogPostCacheInvalidationTrigger on Blog_Post__c (after insert, after update, after delete, after undelete) {
    List<NetlifyCacheWebhookCallout.WebhookRequest> webhookRequests = new List<NetlifyCacheWebhookCallout.WebhookRequest>();
    
    if (Trigger.isInsert) {
        for (Blog_Post__c blog : Trigger.new) {
            NetlifyCacheWebhookCallout.WebhookRequest req = new NetlifyCacheWebhookCallout.WebhookRequest();
            req.objectType = 'Blog_Post__c';
            req.recordId = blog.Id;
            req.changeType = 'CREATE';
            webhookRequests.add(req);
        }
    } else if (Trigger.isUpdate) {
        for (Blog_Post__c blog : Trigger.new) {
            NetlifyCacheWebhookCallout.WebhookRequest req = new NetlifyCacheWebhookCallout.WebhookRequest();
            req.objectType = 'Blog_Post__c';
            req.recordId = blog.Id;
            req.changeType = 'UPDATE';
            webhookRequests.add(req);
        }
    } else if (Trigger.isDelete) {
        for (Blog_Post__c blog : Trigger.old) {
            NetlifyCacheWebhookCallout.WebhookRequest req = new NetlifyCacheWebhookCallout.WebhookRequest();
            req.objectType = 'Blog_Post__c';
            req.recordId = blog.Id;
            req.changeType = 'DELETE';
            webhookRequests.add(req);
        }
    } else if (Trigger.isUndelete) {
        for (Blog_Post__c blog : Trigger.new) {
            NetlifyCacheWebhookCallout.WebhookRequest req = new NetlifyCacheWebhookCallout.WebhookRequest();
            req.objectType = 'Blog_Post__c';
            req.recordId = blog.Id;
            req.changeType = 'UPDATE';
            webhookRequests.add(req);
        }
    }
    
    if (!webhookRequests.isEmpty()) {
        NetlifyCacheWebhookCallout.sendWebhookInvocable(webhookRequests);
    }
}
```

## 6. Requirement__c Cache Invalidation Trigger

**File**: Setup → Apex Triggers → New → Trigger Name: `RequirementCacheInvalidationTrigger`

```apex
trigger RequirementCacheInvalidationTrigger on Requirement__c (after insert, after update, after delete, after undelete) {
    List<NetlifyCacheWebhookCallout.WebhookRequest> webhookRequests = new List<NetlifyCacheWebhookCallout.WebhookRequest>();
    
    if (Trigger.isInsert) {
        for (Requirement__c req : Trigger.new) {
            NetlifyCacheWebhookCallout.WebhookRequest webhookReq = new NetlifyCacheWebhookCallout.WebhookRequest();
            webhookReq.objectType = 'Requirement__c';
            webhookReq.recordId = req.Id;
            webhookReq.changeType = 'CREATE';
            webhookRequests.add(webhookReq);
        }
    } else if (Trigger.isUpdate) {
        for (Requirement__c req : Trigger.new) {
            NetlifyCacheWebhookCallout.WebhookRequest webhookReq = new NetlifyCacheWebhookCallout.WebhookRequest();
            webhookReq.objectType = 'Requirement__c';
            webhookReq.recordId = req.Id;
            webhookReq.changeType = 'UPDATE';
            webhookRequests.add(webhookReq);
        }
    } else if (Trigger.isDelete) {
        for (Requirement__c req : Trigger.old) {
            NetlifyCacheWebhookCallout.WebhookRequest webhookReq = new NetlifyCacheWebhookCallout.WebhookRequest();
            webhookReq.objectType = 'Requirement__c';
            webhookReq.recordId = req.Id;
            webhookReq.changeType = 'DELETE';
            webhookRequests.add(webhookReq);
        }
    } else if (Trigger.isUndelete) {
        for (Requirement__c req : Trigger.new) {
            NetlifyCacheWebhookCallout.WebhookRequest webhookReq = new NetlifyCacheWebhookCallout.WebhookRequest();
            webhookReq.objectType = 'Requirement__c';
            webhookReq.recordId = req.Id;
            webhookReq.changeType = 'UPDATE';
            webhookRequests.add(webhookReq);
        }
    }
    
    if (!webhookRequests.isEmpty()) {
        NetlifyCacheWebhookCallout.sendWebhookInvocable(webhookRequests);
    }
}
```

## 7. SFDC_Project__c Cache Invalidation Trigger

**File**: Setup → Apex Triggers → New → Trigger Name: `ProjectCacheInvalidationTrigger`

```apex
trigger ProjectCacheInvalidationTrigger on SFDC_Project__c (after insert, after update, after delete, after undelete) {
    List<NetlifyCacheWebhookCallout.WebhookRequest> webhookRequests = new List<NetlifyCacheWebhookCallout.WebhookRequest>();
    
    if (Trigger.isInsert) {
        for (SFDC_Project__c proj : Trigger.new) {
            NetlifyCacheWebhookCallout.WebhookRequest req = new NetlifyCacheWebhookCallout.WebhookRequest();
            req.objectType = 'SFDC_Project__c';
            req.recordId = proj.Id;
            req.changeType = 'CREATE';
            webhookRequests.add(req);
        }
    } else if (Trigger.isUpdate) {
        for (SFDC_Project__c proj : Trigger.new) {
            NetlifyCacheWebhookCallout.WebhookRequest req = new NetlifyCacheWebhookCallout.WebhookRequest();
            req.objectType = 'SFDC_Project__c';
            req.recordId = proj.Id;
            req.changeType = 'UPDATE';
            webhookRequests.add(req);
        }
    } else if (Trigger.isDelete) {
        for (SFDC_Project__c proj : Trigger.old) {
            NetlifyCacheWebhookCallout.WebhookRequest req = new NetlifyCacheWebhookCallout.WebhookRequest();
            req.objectType = 'SFDC_Project__c';
            req.recordId = proj.Id;
            req.changeType = 'DELETE';
            webhookRequests.add(req);
        }
    } else if (Trigger.isUndelete) {
        for (SFDC_Project__c proj : Trigger.new) {
            NetlifyCacheWebhookCallout.WebhookRequest req = new NetlifyCacheWebhookCallout.WebhookRequest();
            req.objectType = 'SFDC_Project__c';
            req.recordId = proj.Id;
            req.changeType = 'UPDATE';
            webhookRequests.add(req);
        }
    }
    
    if (!webhookRequests.isEmpty()) {
        NetlifyCacheWebhookCallout.sendWebhookInvocable(webhookRequests);
    }
}
```

## Usage Instructions

1. **Create the Apex Class first** (NetlifyCacheWebhookCallout)
2. **Create Named Credential** named `Netlify_Cache_Webhook`
3. **Copy each trigger** for the objects you want to track
4. **Save and Activate** each trigger
5. **Test** by updating a record and checking Netlify logs

## Notes

- Triggers use `@future(callout=true)` which means webhooks are sent asynchronously
- Failed webhooks won't block Salesforce transactions
- All triggers follow the same pattern - just change the object name
- For custom objects, replace `OKR__c` with your custom object API name

