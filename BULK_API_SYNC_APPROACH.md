# Bulk API Sync Approach - Simplified Caching Strategy

## Overview

Instead of complex Platform Events and webhooks, use **Salesforce Bulk API 2.0** to periodically sync all data to Netlify Blobs cache. This is simpler, more reliable, and perfect for most use cases.

## Benefits

✅ **Simpler Setup** - No Platform Events, no webhooks, no Apex triggers  
✅ **More Reliable** - Bulk API handles large datasets efficiently  
✅ **Lower API Usage** - Single bulk query vs many individual queries  
✅ **Better Performance** - Optimized for large data transfers  
✅ **No Real-time Complexity** - Periodic refresh is sufficient for most apps  

## How It Works

```
Scheduled Job (Netlify Cron) 
  → Calls Bulk API Sync Function
    → Bulk API 2.0 queries Salesforce
      → Results stored in Netlify Blobs
        → All reads served from cache
```

## Setup

### 1. Use the New Bulk Sync Function

The function `syncSalesforceBulk.js` uses Bulk API 2.0:

**Manual Trigger:**
```bash
POST /.netlify/functions/syncSalesforceBulk
Body: {
  "access_token": "...",
  "instance_url": "...",
  "objects": ["Contact", "User", "OKR__c"], // Optional
  "useBulkAPI": true, // Use Bulk API (default) or regular SOQL
  "clearCacheFirst": false // Clear cache before sync
}
```

### 2. Schedule Automatic Sync (Recommended)

#### Option A: Netlify Scheduled Functions

Create `netlify/functions/scheduledBulkSync.js`:

```javascript
const { getStore } = require('@netlify/blobs');

// This will run on a schedule defined in netlify.toml
exports.handler = async (event, context) => {
  console.log('🕐 Scheduled bulk sync triggered');
  
  // Get Salesforce credentials from environment variables or fetch fresh token
  const access_token = process.env.SALESFORCE_ACCESS_TOKEN;
  const instance_url = process.env.SALESFORCE_INSTANCE_URL;
  
  if (!access_token || !instance_url) {
    console.error('❌ Missing Salesforce credentials');
    return { statusCode: 500, body: 'Missing credentials' };
  }
  
  // Call the sync function
  const syncUrl = `${event.headers['x-forwarded-proto'] || 'https'}://${event.headers.host}/.netlify/functions/syncSalesforceBulk`;
  
  const response = await fetch(syncUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      access_token,
      instance_url,
      useBulkAPI: true,
      clearCacheFirst: true, // Fresh sync each time
    }),
  });
  
  const result = await response.json();
  console.log('✅ Scheduled sync complete:', result);
  
  return {
    statusCode: 200,
    body: JSON.stringify({ success: true, result }),
  };
};
```

Add to `netlify.toml`:

```toml
[functions]
  directory = "netlify/functions"

[[plugins]]
  package = "@netlify/plugin-scheduled-functions"

[[plugins.scheduled_functions]]
  schedule = "0 */6 * * *"  # Every 6 hours
  function = "scheduledBulkSync"
```

#### Option B: External Cron Service

Use a service like:
- **cron-job.org** (free)
- **EasyCron** (free tier)
- **GitHub Actions** (free for public repos)
- **AWS EventBridge** (if on AWS)

Setup a cron job to call:
```
POST https://cloudastick.org/.netlify/functions/syncSalesforceBulk
```

### 3. Update Fetch Functions to Use Cache

All fetch functions should check cache first:

```javascript
const { getCache, setCache, getListCacheKey, simpleHash, CACHE_TTLS } = require('./salesforceCacheManager');

// Check cache
const cacheKey = getListCacheKey('Contact', simpleHash(query));
const cached = await getCache(cacheKey, CACHE_TTLS['Contact']);

if (cached && !cached.isStale) {
  return cached.data; // Serve from cache
}

// Cache miss - fetch from Salesforce (rarely happens)
const data = await fetchFromSalesforce(...);
await setCache(cacheKey, data);
return data;
```

## Sync Frequency Recommendations

| Use Case | Frequency | Reason |
|----------|-----------|--------|
| **High-traffic, frequently changing data** | Every 1-2 hours | Balance freshness vs API usage |
| **Moderate traffic** | Every 6 hours | Good balance |
| **Low traffic, stable data** | Daily (midnight) | Minimal API usage |
| **Initial sync** | On-demand | When cache is empty |

## Comparison: Bulk API vs Platform Events

| Feature | Bulk API Sync | Platform Events |
|---------|--------------|-----------------|
| **Setup Complexity** | ⭐ Simple | ⭐⭐⭐ Complex |
| **Real-time Updates** | ❌ Periodic | ✅ Instant |
| **API Efficiency** | ⭐⭐⭐ Excellent | ⭐ Good |
| **Reliability** | ⭐⭐⭐ High | ⭐⭐ Medium |
| **Maintenance** | ⭐⭐⭐ Low | ⭐ Medium |
| **Cost** | ⭐⭐⭐ Low API usage | ⭐⭐ Higher |

## When to Use Each Approach

### Use Bulk API Sync If:
- ✅ Data doesn't need to be real-time
- ✅ You want simpler setup
- ✅ You have large datasets
- ✅ Periodic refresh (hourly/daily) is acceptable
- ✅ You want to minimize API calls

### Use Platform Events If:
- ✅ Data must be real-time (< 1 minute delay)
- ✅ You need instant cache invalidation
- ✅ You have CDC available and enabled
- ✅ You're comfortable with complex setup

## Implementation Steps

1. ✅ **Deploy Bulk Sync Function** - Already created!
2. ⏳ **Set up scheduled sync** - Choose Option A or B above
3. ⏳ **Update fetch functions** - Add cache checks (example: `fetchBlogs.js` already updated)
4. ⏳ **Run initial sync** - Manually trigger to populate cache
5. ⏳ **Monitor and adjust** - Check sync logs, adjust frequency as needed

## Manual Sync Trigger

You can manually trigger a sync anytime:

```bash
curl -X POST https://cloudastick.org/.netlify/functions/syncSalesforceBulk \
  -H "Content-Type: application/json" \
  -d '{
    "access_token": "YOUR_TOKEN",
    "instance_url": "YOUR_INSTANCE_URL",
    "clearCacheFirst": true
  }'
```

Or from your app:
```javascript
await fetch('/.netlify/functions/syncSalesforceBulk', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    access_token,
    instance_url,
    clearCacheFirst: false, // Incremental sync
  }),
});
```

## Monitoring

### Check Sync Status

Use the `manageSalesforceCache` function:

```bash
POST /.netlify/functions/manageSalesforceCache
Body: { "action": "stats" }
```

Response shows:
- Total cached records
- Age of cache entries
- Objects cached
- Cache hit rates

### Check Sync Logs

Netlify Dashboard → Functions → `syncSalesforceBulk` → Logs

Look for:
- ✅ Job completion messages
- ✅ Record counts per object
- ⚠️ Errors or timeouts
- 📊 Duration of sync

## Fallback Strategy

If Bulk API fails or times out, the function falls back to regular SOQL queries automatically. You can also explicitly use regular queries:

```json
{
  "access_token": "...",
  "instance_url": "...",
  "useBulkAPI": false
}
```

## Summary

**Bulk API Sync is the recommended approach** because:
1. ✅ Much simpler setup (no Platform Events needed)
2. ✅ More reliable for large datasets
3. ✅ Lower API usage
4. ✅ Periodic refresh is usually sufficient

**Trade-off**: Data freshness depends on sync frequency (e.g., hourly vs real-time), which is acceptable for most use cases.

Proceed with Bulk API sync? I can help you:
1. Set up the scheduled function
2. Update all fetch functions to use cache
3. Create a monitoring dashboard

