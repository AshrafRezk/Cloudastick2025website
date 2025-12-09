# Platform Events Quick Start Guide

## Quick Setup Summary

### 1. Create Platform Event (5 minutes)
1. Setup → Platform Events → New Platform Event
2. Label: `Cache Invalidation`
3. Add fields:
   - `Object_Type__c` (Text, 100, Required)
   - `Record_ID__c` (Text, 255, Required)
   - `Change_Type__c` (Picklist: CREATE, UPDATE, DELETE, Required)

### 2. Create Named Credential (2 minutes)
1. Setup → Named Credentials → New
2. Label: `Netlify Cache Webhook`
3. URL: `https://cloudastick.org/.netlify/functions/salesforceCacheWebhook`
4. Identity Type: Named Principal
5. Auth Protocol: No Authentication
6. Add Custom Header: `X-Webhook-Secret` = `[GENERATE_STRONG_SECRET_HERE]`

### 3. Create Apex Class (3 minutes)
1. Setup → Apex Classes → New
2. Class Name: `NetlifyCacheWebhookCallout`
3. Copy code from `SALESFORCE_PLATFORM_EVENTS_SETUP.md` Step 7
4. Save

### 4. Create Triggers (5 minutes per object)
1. Setup → Apex Triggers → New
2. For each object (Contact, User, OKR__c, Blog_Post__c, Requirement__c):
   - Copy trigger template from `SALESFORCE_PLATFORM_EVENTS_SETUP.md` Step 4
   - Replace `{Object}` and `{API_Name}` with actual values
   - Save and Activate

### 5. Set Netlify Environment Variable (1 minute)
1. Netlify Dashboard → Site Settings → Environment Variables
2. Add: `WEBHOOK_SECRET` = `[USE_SAME_SECRET_FROM_SALESFORCE_NAMED_CREDENTIAL]` (must match exactly)

### 6. Test (2 minutes)
1. Update a Contact in Salesforce
2. Check Netlify Function logs: `salesforceCacheWebhook`
3. Should see cache invalidation log entry

**Total Time: ~20-30 minutes**

## Objects to Track

Create triggers for:
- ✅ Contact
- ✅ User  
- ✅ OKR__c
- ✅ Blog_Post__c
- ✅ Requirement__c
- ✅ SFDC_Project__c

## Testing Checklist

- [ ] Platform Event object created
- [ ] Named Credential configured
- [ ] Apex Class created and saved
- [ ] At least one trigger created and activated
- [ ] Netlify environment variable set
- [ ] Test record update triggers webhook
- [ ] Netlify logs show successful cache invalidation
- [ ] Cache actually clears (test by fetching data)

## Troubleshooting

**Webhook not received?**
- Check Named Credential URL is correct
- Verify webhook secret matches in both places
- Check Netlify function is deployed
- Look at Netlify function logs

**Trigger not firing?**
- Check trigger is activated
- Verify object permissions
- Check debug logs in Salesforce
- Test with a simple record update

**Cache not clearing?**
- Verify webhook payload format in Netlify logs
- Check cache key format matches expected
- Use `manageSalesforceCache` function to manually clear
- Check cache statistics

## Next Steps After Setup

1. Run initial cache sync: `POST /.netlify/functions/syncSalesforceCache`
2. Monitor cache hit rates via `POST /.netlify/functions/manageSalesforceCache` with `{"action": "stats"}`
3. Update remaining fetch functions to use cache (see `SALESFORCE_CACHE_SYSTEM.md`)

