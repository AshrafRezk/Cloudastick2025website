# Named Credential Setup Confirmation Checklist

Based on your setup, here's what to verify:

## ✅ What Looks Good

1. **Label**: `Netlify Cache Webhook` ✅
2. **Name**: `Netlify_Cache_Webhook` ✅
3. **URL**: `https://cloudastick.org/.netlify/functions/salesforceCacheWebhook` ✅
4. **Enabled for Callouts**: ON ✅
5. **Custom Header**: `X-Webhook-Secret` with value set ✅

## ⚠️ Important Next Steps

### 1. Set Secret in Netlify

The custom header value (`YOUR_SECRET_KEY_RANDOM_STRING`) must be **exactly the same** in Netlify:

1. Go to Netlify Dashboard
2. Your site → **Site settings** → **Environment variables**
3. Add variable:
   - **Key**: `WEBHOOK_SECRET`
   - **Value**: `YOUR_SECRET_KEY_RANDOM_STRING` (exact same value from Salesforce custom header)
4. Click **Save**
5. **Redeploy** your site for the environment variable to take effect

### 2. Callout Options Configuration

Your current settings are fine:
- ✅ **Generate Authorization Header**: Checked (doesn't affect custom headers)
- ✅ **Allow Formulas in HTTP Header**: Unchecked (correct - we use static value)
- ✅ **Allow Formulas in HTTP Body**: Unchecked (correct)

### 3. Authentication

Seeing "No Auth Webhook" under External Credential is **expected** and **correct**:
- We're using **No Authentication** protocol
- Security is handled via the custom `X-Webhook-Secret` header
- The webhook handler validates this header

## Next Steps

1. ✅ Named Credential configured
2. ⏳ Set `WEBHOOK_SECRET` in Netlify (critical!)
3. ⏳ Create Apex Class (`NetlifyCacheWebhookCallout`) - see `SALESFORCE_APEX_TEMPLATES.md`
4. ⏳ Create Triggers for each object - see `SALESFORCE_APEX_TEMPLATES.md`
5. ⏳ Test the setup

## Testing the Named Credential

After setting up the Apex class, you can test the Named Credential works:

1. In Developer Console or VS Code with Salesforce extension
2. Execute Anonymous Apex:
```apex
NetlifyCacheWebhookCallout.sendWebhook('Contact', '003000000000000AAA', 'UPDATE');
```
3. Check Netlify Function logs for the webhook
4. Verify the `X-Webhook-Secret` header is received and validated

## Troubleshooting

**If webhook fails with 401 Unauthorized:**
- Check that `WEBHOOK_SECRET` in Netlify matches the custom header value exactly
- Verify the site has been redeployed after adding the environment variable
- Check Netlify Function logs for the exact error

**If Named Credential callout fails:**
- Verify the URL is correct
- Check "Enabled for Callouts" is ON
- Verify network access (if your org has restrictions)
- Check Debug Logs in Salesforce for callout errors

Your setup looks correct! Continue with creating the Apex class and triggers next.

