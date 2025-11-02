# Company Intelligence System - Testing Guide

## Overview
This system enriches company data, fetches news, generates AI insights, and recommends appropriate products based on industry.

## Environment Variables Required

Add these to your Netlify environment variables:

```bash
# OrgInfo API (200 free lookups/month)
ORGINFO_API_KEY=your_orginfo_key_here

# NewsAPI (100 requests/day free tier)
NEWSAPI_KEY=your_newsapi_key_here

# Gemini API (already configured)
GEMINI_API_KEY=existing_key
```

### Getting API Keys

1. **OrgInfo API**: Sign up at https://orginfo.io/
   - Free tier: 200 lookups/month
   - Get API key from dashboard

2. **NewsAPI**: Sign up at https://newsapi.org/
   - Free tier: 100 requests/day
   - Get API key from account page

## Test Cases

### Test 1: Real Estate Company (Cityscape Recommendation)

**Company**: Emaar Properties
**Website**: emaar.com

**Expected Results**:
- ✅ Company name auto-filled: "Emaar"
- ✅ Industry detected: "Real Estate"
- ✅ Product recommendation banner appears for "Cityscape" 🏙️
- ✅ AI insights about Salesforce for real estate
- ✅ Recent news articles about Emaar
- ✅ Industry badge and location displayed
- ✅ Data cached for 7 days

**How to Test**:
1. Go to `/salesforce-power`
2. Enter "emaar.com" in Company Website field
3. Wait 1.5 seconds for enrichment
4. Verify banner appears: "✨ Cityscape is specifically built for real estate companies like yours!"
5. Click "Explore Cityscape" to navigate to Cityscape page
6. Verify company intelligence card shows up with industry badge
7. Verify AI insights are displayed
8. Verify news articles are shown
9. Refresh page with same domain - should load instantly from cache

### Test 2: Construction Company (Memar Recommendation)

**Company**: Bechtel
**Website**: bechtel.com

**Expected Results**:
- ✅ Company name auto-filled
- ✅ Industry detected: "Construction" or "Engineering"
- ✅ Product recommendation banner appears for "Memar" 🏗️
- ✅ AI insights about Salesforce for construction
- ✅ Recent news and industry events

### Test 3: Other Industries (No Product Recommendation)

**Companies to test**:
- Insurance: allianz.com
- Manufacturing: siemens.com
- Healthcare: mayo.edu
- Retail: walmart.com

**Expected Results**:
- ✅ Company data enriched
- ✅ No product recommendation banner (continues with Salesforce Power)
- ✅ Industry-specific AI insights
- ✅ Relevant news articles

### Test 4: Cache Functionality

**Steps**:
1. Enter "emaar.com" and wait for enrichment
2. Open browser DevTools > Application > Local Storage
3. Look for key starting with `company_intel_emaar.com`
4. Verify it contains all the enriched data
5. Refresh the page
6. Enter "emaar.com" again
7. Data should load instantly (no API calls)

### Test 5: URL Sharing with Company Info

**Steps**:
1. Enter company info (name + website)
2. Wait for enrichment
3. Click "Copy Table Link"
4. Open link in incognito window
5. Verify company info is pre-filled
6. Verify enrichment happens automatically

### Test 6: Fallback Behavior (No API Keys)

**Test without API keys** (or with exhausted quota):

**Expected Results**:
- ✅ System works with fallback data
- ✅ Company name extracted from domain
- ✅ No news displayed
- ✅ Generic AI insights if Gemini works
- ✅ No errors thrown
- ✅ User can still fill form manually

## API Usage Monitoring

### OrgInfo API
- **Limit**: 200 lookups/month
- **Cache**: 7 days per domain
- **Expected usage**: ~30 unique domains/month (well within limit)

### NewsAPI
- **Limit**: 100 requests/day
- **Cache**: 7 days per company
- **Expected usage**: ~15 requests/day (within limit)

### Gemini API
- **Already configured**
- Used for AI insights generation
- 1 request per company enrichment

## Common Issues & Solutions

### Issue: API key not working
**Solution**: Verify keys in Netlify env variables, redeploy site

### Issue: No news showing up
**Solution**: NewsAPI free tier doesn't work with localhost, deploy to Netlify

### Issue: Cache not clearing
**Solution**: Open DevTools > Application > Local Storage > Clear all

### Issue: Product recommendation not showing
**Solution**: Verify industry detection is working, check console logs

## Success Metrics

After implementation, verify:
- ✅ All Netlify functions created and deployed
- ✅ Environment variables configured
- ✅ Real estate companies show Cityscape recommendation
- ✅ Construction companies show Memar recommendation
- ✅ Other industries continue with Salesforce Power
- ✅ 7-day caching works correctly
- ✅ URL sharing includes company params
- ✅ Intelligence UI displays correctly
- ✅ Mobile responsive design works
- ✅ No console errors

## Next Steps

1. Deploy to Netlify
2. Add API keys to environment variables
3. Test with real companies
4. Monitor API usage
5. Collect user feedback
6. Add more industry mappings if needed

