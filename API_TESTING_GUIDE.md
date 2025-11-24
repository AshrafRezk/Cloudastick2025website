# Salesforce Search API Testing Guide

## Overview
This guide explains how to test the Salesforce search functionality for Opportunity and Account objects.

## Test Scripts Available

1. **test-api-simple.js** - Simple API test script
2. **test-api-search.js** - Comprehensive API test with validation
3. **test-salesforce-search.js** - Logic and SOQL query tests
4. **verify-soql-queries.js** - SOQL query structure verification

## Testing Methods

### Method 1: Test via Browser (Recommended)

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to the Project Team page:**
   - Go to `http://localhost:5173/project-team`
   - Or use the production URL if deployed

3. **Authenticate with Salesforce:**
   - Click the Salesforce authentication button
   - Complete the OAuth flow
   - Credentials will be stored in localStorage

4. **Test Account Search:**
   - Select "Account" from the Record Type dropdown
   - Type at least 2 characters in the search box
   - Wait for results to appear
   - Verify:
     - ✅ Results appear in dropdown
     - ✅ Account names are displayed
     - ✅ No console errors
     - ✅ Proper error messages if no results

5. **Test Opportunity Search:**
   - Select "Opportunity" from the Record Type dropdown
   - Type at least 2 characters in the search box
   - Wait for results to appear
   - Verify:
     - ✅ Results appear in dropdown
     - ✅ Opportunity names are displayed
     - ✅ Account information is shown (if available)
     - ✅ No console errors

### Method 2: Test via Netlify Dev (Local)

1. **Start Netlify dev server:**
   ```bash
   netlify dev
   ```
   This starts the server on `http://localhost:8888`

2. **Get Salesforce credentials:**
   - Authenticate in the browser first (see Method 1)
   - Open browser console and run:
     ```javascript
     JSON.parse(localStorage.getItem('salesforce_auth_data'))
     ```
   - Copy the `access_token` and `instance_url`

3. **Set environment variables:**
   ```bash
   export SF_ACCESS_TOKEN="your_access_token_here"
   export SF_INSTANCE_URL="https://yourinstance.salesforce.com"
   ```

4. **Run the test script:**
   ```bash
   node test-api-simple.js local
   ```

### Method 3: Test via Production API

1. **Get Salesforce credentials** (same as Method 2, step 2)

2. **Set environment variables:**
   ```bash
   export SF_ACCESS_TOKEN="your_access_token_here"
   export SF_INSTANCE_URL="https://yourinstance.salesforce.com"
   ```

3. **Run the test script:**
   ```bash
   node test-api-simple.js production
   ```

### Method 4: Test Logic Only (No API Required)

Test the SOQL query construction and logic:

```bash
node test-salesforce-search.js
node verify-soql-queries.js
```

These tests verify:
- ✅ SOQL query structure
- ✅ Special character escaping
- ✅ Input validation logic
- ✅ URL encoding

## Expected Behavior

### Successful Search Response

```json
{
  "success": true,
  "records": [
    {
      "id": "001XX000004XXXXX",
      "name": "Account Name",
      "type": "Account",
      "accountName": "Account Name",
      "accountIndustry": "Technology",
      "accountWebsite": "https://example.com",
      "additionalInfo": "Type | Industry"
    }
  ],
  "totalSize": 1
}
```

### Error Responses

**400 Bad Request:**
- Missing access_token or instance_url
- Search term too short (< 2 characters)
- Invalid object type

**500 Server Error:**
- Salesforce API errors
- Network errors
- Invalid credentials

## Testing Checklist

### Account Search
- [ ] Search returns results for valid search terms
- [ ] Results show Account name, Type, Industry
- [ ] No results message displays correctly ("No accounts found")
- [ ] Special characters in search term are handled
- [ ] Error messages are user-friendly
- [ ] Loading state shows during search

### Opportunity Search
- [ ] Search returns results for valid search terms
- [ ] Results show Opportunity name, Account name, Stage, Close Date
- [ ] Account relationship fields are populated
- [ ] No results message displays correctly ("No opportunities found")
- [ ] Special characters in search term are handled
- [ ] Error messages are user-friendly
- [ ] Loading state shows during search

### Error Handling
- [ ] Missing credentials shows appropriate error
- [ ] Invalid search term shows validation error
- [ ] Network errors are handled gracefully
- [ ] Salesforce API errors are displayed clearly
- [ ] Non-JSON error responses are handled

## Troubleshooting

### Issue: "Failed to connect to server"
**Solution:** Make sure Netlify dev server is running:
```bash
netlify dev
```

### Issue: "Authentication error" or "Invalid credentials"
**Solution:** 
1. Re-authenticate with Salesforce in the browser
2. Get fresh credentials from localStorage
3. Update environment variables

### Issue: "No results found" but records exist in Salesforce
**Solution:**
1. Check if the search term matches (case-insensitive)
2. Verify user has access to the records
3. Check Salesforce field-level security
4. Verify the SOQL query in browser network tab

### Issue: "500 Server Error"
**Solution:**
1. Check Netlify function logs
2. Verify SOQL query syntax
3. Check for field access issues
4. Review error handling in function

## Test Data

For testing, you can use:
- **Account search:** Any account name in your Salesforce org
- **Opportunity search:** Any opportunity name in your Salesforce org
- **Special characters:** Test with names containing `'`, `%`, `_`, `\`

## Next Steps

After successful testing:
1. ✅ Verify all error cases are handled
2. ✅ Test with real production data
3. ✅ Monitor API usage and performance
4. ✅ Check browser console for any warnings
5. ✅ Verify mobile responsiveness

