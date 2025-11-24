# Project Search Fix Plan

## Overview
This document outlines the testing and potential fixes for the Project (SFDC_Project__c) search functionality, including the "deraya" project search.

## Current Implementation Status

### ✅ What's Working
1. **SOQL Query Construction** - Correctly builds query with relationship fields
2. **Fallback Logic** - Has fallback to simplified query if fields don't exist
3. **Record Transformation** - Properly transforms Salesforce records to app format
4. **Error Handling** - Catches INVALID_FIELD errors and retries with simple query

### ⚠️ Potential Issues

1. **Error Detection May Be Too Narrow**
   - Currently only checks for "No such column" and "INVALID_FIELD"
   - Salesforce may return errors in different formats
   - Need to check for relationship field errors more broadly

2. **Fallback Query May Not Always Trigger**
   - If error format is different, fallback won't activate
   - Should improve error detection to catch more cases

3. **Missing Field Handling**
   - If Account__r or Opportunity__r fields don't exist, should gracefully handle
   - Current implementation does handle this, but could be more robust

## Testing Results

### Logic Tests ✅
- ✅ SOQL query construction: PASSED
- ✅ Fallback query structure: PASSED
- ✅ Record transformation (with relationships): PASSED
- ✅ Record transformation (without relationships): PASSED
- ✅ Error handling logic: VERIFIED

### API Tests Needed
- ⏳ Test with real Salesforce credentials
- ⏳ Test "deraya" project search specifically
- ⏳ Test with missing relationship fields
- ⏳ Test error scenarios

## Fixes Implemented

### 1. Improved Error Detection
**File:** `netlify/functions/searchSalesforceRecords.js`

**Change:** Enhanced error detection to catch more Salesforce error formats:
```javascript
const isFieldError = errorMessage.includes('No such column') || 
                    errorMessage.includes('INVALID_FIELD') ||
                    errorMessage.includes('No such column') ||
                    errorMessage.includes('field does not exist') ||
                    errorMessage.includes('sObject type') ||
                    (errorMessage.includes('Account__r') || errorMessage.includes('Opportunity__r'));
```

**Reason:** Salesforce can return field errors in various formats. This ensures we catch them all.

### 2. Updated Test Scripts
**Files:** 
- `test-api-simple.js` - Added Project search test with "deraya"
- `test-project-search.js` - Comprehensive Project search testing

## Testing Checklist

### Project Search (SFDC_Project__c)
- [ ] Search returns results for "deraya"
- [ ] Results show Project name
- [ ] Account relationship fields populate if available
- [ ] Opportunity relationship fields populate if available
- [ ] Fallback works if relationship fields don't exist
- [ ] No results message displays correctly ("No projects found")
- [ ] Special characters in search term are handled
- [ ] Error messages are user-friendly
- [ ] Loading state shows during search

### Error Scenarios
- [ ] Missing Account__r fields triggers fallback
- [ ] Missing Opportunity__r fields handled gracefully
- [ ] Invalid field errors caught and handled
- [ ] Network errors handled properly
- [ ] Authentication errors display clearly

## How to Test

### Method 1: Browser UI (Recommended)
1. Go to `/project-team`
2. Select "Project" from Record Type dropdown
3. Search for "deraya"
4. Verify results appear

### Method 2: API Test Script
```bash
# Set credentials
export SF_ACCESS_TOKEN="your_token"
export SF_INSTANCE_URL="https://instance.salesforce.com"

# Test Project search
node test-api-simple.js production
```

### Method 3: Logic Tests Only
```bash
node test-project-search.js
```

## Expected Behavior

### Successful Project Search
```json
{
  "success": true,
  "records": [
    {
      "id": "a0X...",
      "name": "Deraya Project",
      "type": "Project",
      "accountName": "Deraya Account",
      "accountId": "001...",
      "accountIndustry": "Technology",
      "accountWebsite": "https://deraya.com",
      "opportunityName": "Deraya Opportunity",
      "opportunityId": "006...",
      "additionalInfo": "Account: Deraya Account"
    }
  ],
  "totalSize": 1
}
```

### Fallback Response (if fields missing)
```json
{
  "success": true,
  "records": [
    {
      "id": "a0X...",
      "name": "Deraya Project",
      "type": "Project",
      "accountName": "",
      "accountId": "",
      "accountIndustry": "",
      "accountWebsite": "",
      "opportunityName": "",
      "opportunityId": "",
      "additionalInfo": "Limited fields available"
    }
  ],
  "totalSize": 1,
  "warning": "Some fields are not accessible"
}
```

## Troubleshooting

### Issue: Project search returns no results but project exists
**Solutions:**
1. Check if project name contains "deraya" (case-insensitive)
2. Verify user has access to SFDC_Project__c object
3. Check field-level security
4. Verify SOQL query in browser network tab

### Issue: Relationship fields not populating
**Solutions:**
1. Check if Account__c and Opportunity__c fields exist on SFDC_Project__c
2. Verify relationship fields are accessible
3. Check if fallback query is being used (check console logs)
4. Verify field API names match: Account__r, Opportunity__r

### Issue: Error not triggering fallback
**Solutions:**
1. Check error message format in console
2. Verify error detection logic catches the specific error
3. May need to add more error patterns to detection

## Next Steps

1. ✅ Improved error detection (completed)
2. ⏳ Test with real Salesforce org
3. ⏳ Test "deraya" project specifically
4. ⏳ Verify fallback works in production
5. ⏳ Monitor for any edge cases

## Files Modified

- `netlify/functions/searchSalesforceRecords.js` - Enhanced error detection
- `test-api-simple.js` - Added Project search test
- `test-project-search.js` - New comprehensive Project test

