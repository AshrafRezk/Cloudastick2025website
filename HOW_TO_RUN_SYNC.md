# How to Run the Salesforce Bulk Sync

## Quick Start

After deployment, follow these steps to populate the cache:

## Method 1: Using curl (Terminal)

Replace `YOUR_ACCESS_TOKEN` and `YOUR_INSTANCE_URL` with your actual Salesforce credentials:

```bash
curl -X POST https://cloudastick.org/.netlify/functions/syncSalesforceBulk \
  -H "Content-Type: application/json" \
  -d '{
    "access_token": "YOUR_ACCESS_TOKEN",
    "instance_url": "YOUR_INSTANCE_URL",
    "clearCacheFirst": true
  }'
```

**Example:**
```bash
curl -X POST https://cloudastick.org/.netlify/functions/syncSalesforceBulk \
  -H "Content-Type: application/json" \
  -d '{
    "access_token": "00D5g000000abcd!AQEAQAbc123...",
    "instance_url": "https://yourinstance.salesforce.com",
    "clearCacheFirst": true
  }'
```

## Method 2: Using Browser Console (JavaScript)

Open browser console on your site and run:

```javascript
// First, get your Salesforce credentials (from your app's context)
const accessToken = 'YOUR_ACCESS_TOKEN';
const instanceUrl = 'YOUR_INSTANCE_URL';

// Run the sync
fetch('/.netlify/functions/syncSalesforceBulk', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    access_token: accessToken,
    instance_url: instanceUrl,
    clearCacheFirst: true,
  }),
})
.then(response => response.json())
.then(data => {
  console.log('✅ Sync complete!', data);
})
.catch(error => {
  console.error('❌ Sync failed:', error);
});
```

## Method 3: Using Postman or Similar Tool

1. **URL**: `https://cloudastick.org/.netlify/functions/syncSalesforceBulk`
2. **Method**: `POST`
3. **Headers**:
   - `Content-Type: application/json`
4. **Body** (raw JSON):
```json
{
  "access_token": "YOUR_ACCESS_TOKEN",
  "instance_url": "YOUR_INSTANCE_URL",
  "clearCacheFirst": true
}
```

## Method 4: From Your App Code

If you have access to Salesforce credentials in your app, you can trigger sync programmatically:

```typescript
// In your React/TypeScript app
const runSync = async () => {
  try {
    const response = await fetch('/.netlify/functions/syncSalesforceBulk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_token: salesforceAccessToken,
        instance_url: salesforceInstanceUrl,
        clearCacheFirst: true,
      }),
    });
    
    const result = await response.json();
    console.log('Sync result:', result);
  } catch (error) {
    console.error('Sync error:', error);
  }
};
```

## Sync Options

### Full Sync (All Objects)
```json
{
  "access_token": "...",
  "instance_url": "...",
  "clearCacheFirst": true
}
```

### Sync Specific Objects Only
```json
{
  "access_token": "...",
  "instance_url": "...",
  "objects": ["Contact", "User", "OKR__c"],
  "clearCacheFirst": false
}
```

### Use Regular SOQL Instead of Bulk API
```json
{
  "access_token": "...",
  "instance_url": "...",
  "useBulkAPI": false,
  "clearCacheFirst": true
}
```

## Expected Response

On success, you'll see:

```json
{
  "success": true,
  "results": {
    "startedAt": "2024-01-15T10:00:00.000Z",
    "syncMethod": "bulk-api",
    "objects": {
      "Contact": {
        "count": 500,
        "cached": 500,
        "errors": 0,
        "duration": 3500
      },
      "User": {
        "count": 150,
        "cached": 150,
        "errors": 0,
        "duration": 1200
      },
      ...
    },
    "totalRecordsCached": 2000,
    "duration": 15000
  }
}
```

## How to Get Your Salesforce Credentials

### Option 1: From Browser Session
If you're logged into Salesforce in your app:
1. Open browser DevTools → Network tab
2. Look for any Salesforce API calls
3. Find `Authorization: Bearer ...` header (this is your access token)
4. Find the Salesforce URL in the request (this is your instance_url)

### Option 2: From Salesforce OAuth Flow
If your app uses OAuth:
- Access token is typically stored in your app state/context
- Instance URL is returned in the OAuth response

### Option 3: Create a Connected App
1. Salesforce Setup → App Manager → New Connected App
2. Enable OAuth Settings
3. Use OAuth to get access token programmatically

## Check Sync Status

After running sync, check if it worked:

### Check Cache Statistics

```bash
curl -X POST https://cloudastick.org/.netlify/functions/manageSalesforceCache \
  -H "Content-Type: application/json" \
  -d '{"action": "stats"}'
```

### Test Cache is Working

Try fetching blogs - should come from cache:

```bash
curl -X POST https://cloudastick.org/.netlify/functions/fetchBlogs \
  -H "Content-Type: application/json" \
  -d '{
    "access_token": "YOUR_TOKEN",
    "instance_url": "YOUR_INSTANCE_URL"
  }'
```

Check the response - it should have `"fromCache": true` if cache is working.

## Monitoring

### Check Netlify Function Logs

1. Go to Netlify Dashboard
2. Your site → **Functions** → `syncSalesforceBulk`
3. Click **Logs** tab
4. You'll see sync progress and results

### What to Look For

✅ **Success indicators:**
- "✅ Bulk sync complete!"
- Total records cached count
- Duration time
- No errors in logs

❌ **Error indicators:**
- "❌ Error syncing..."
- "Failed to create Bulk API job"
- "Salesforce API error"
- Check error messages for details

## Troubleshooting

### "Missing access_token or instance_url"
- Make sure you're sending credentials in the request body
- Check JSON is valid

### "Salesforce API error: 401"
- Your access token expired
- Get a fresh token and try again

### "Failed to create Bulk API job"
- Bulk API might not be enabled in your org
- Try setting `"useBulkAPI": false` to use regular SOQL

### Sync Takes Too Long
- Normal for large datasets (can take 30-60 seconds)
- Check Netlify function timeout limits (26s for Pro, 10s for Free)
- Consider syncing objects individually if timeout occurs

## Next Steps After Sync

1. ✅ **Verify cache is populated** - Check stats
2. ✅ **Test a fetch** - Try `fetchBlogs` and verify `fromCache: true`
3. ⏳ **Set up scheduled sync** - See `BULK_API_SETUP_COMPLETE.md`
4. ⏳ **Monitor performance** - Check cache hit rates

## Quick Reference

**Sync Endpoint:**
```
POST /.netlify/functions/syncSalesforceBulk
```

**Check Stats:**
```
POST /.netlify/functions/manageSalesforceCache
Body: {"action": "stats"}
```

**Clear Cache:**
```
POST /.netlify/functions/manageSalesforceCache
Body: {"action": "clear"}
```

