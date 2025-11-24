# Salesforce Lookup Testing Guide

## Overview
This document outlines how to test the Salesforce lookup functionality for the Project Team page and what errors to watch for.

## Test Scenarios

### 1. Account Search
**Test Steps:**
1. Go to `/project-team` (in edit mode)
2. Select "Account" from Record Type dropdown
3. Search for an account name (e.g., "Acme")
4. Verify results appear

**Expected Behavior:**
- Should return Account records matching the search term
- Should display: Name, Type, Industry
- No errors in console

**Potential Errors:**
- `INVALID_FIELD`: If Type or Industry fields are not accessible
- `INVALID_TYPE`: If Account object is not accessible
- `MALFORMED_QUERY`: If SOQL syntax is incorrect

### 2. Opportunity Search
**Test Steps:**
1. Select "Opportunity" from Record Type dropdown
2. Search for an opportunity name
3. Verify results appear with account information

**Expected Behavior:**
- Should return Opportunity records
- Should display: Name, Account Name, Stage, Close Date
- Account relationship should be populated if available

**Potential Errors:**
- `INVALID_FIELD`: If Account.Name relationship is not accessible
- `MALFORMED_QUERY`: If WHERE clause with relationship field fails
- `INVALID_TYPE`: If Opportunity object is not accessible

### 3. Project (SFDC_Project__c) Search
**Test Steps:**
1. Select "Project" from Record Type dropdown
2. Search for a project name
3. Verify results appear

**Expected Behavior:**
- Should return SFDC_Project__c records
- Should display: Name, Account Name (if field exists), Opportunity Name (if field exists)
- If relationship fields don't exist, should fall back to basic query

**Potential Errors:**
- `INVALID_FIELD`: If Account__c, Account__r.Name, Opportunity__c, or Opportunity__r.Name don't exist
- `INVALID_TYPE`: If SFDC_Project__c object doesn't exist or is not accessible
- Should automatically fall back to simplified query if fields are missing

## Common Salesforce API Errors

### Error Codes to Watch For:

1. **INVALID_FIELD** (400)
   - **Cause**: Field doesn't exist or is not accessible
   - **Fix**: Check field API names in Salesforce Setup
   - **Handling**: Code automatically falls back to simplified query for Projects

2. **INVALID_TYPE** (400)
   - **Cause**: Object doesn't exist or user doesn't have access
   - **Fix**: Verify object exists and user has read permissions
   - **Handling**: Returns error message to user

3. **MALFORMED_QUERY** (400)
   - **Cause**: SOQL syntax error
   - **Fix**: Check query syntax in code
   - **Handling**: Returns error message to user

4. **INVALID_SESSION_ID** (401)
   - **Cause**: Access token expired or invalid
   - **Fix**: Re-authenticate with Salesforce
   - **Handling**: Should trigger token refresh

5. **INSUFFICIENT_ACCESS** (403)
   - **Cause**: User doesn't have permission to query object
   - **Fix**: Grant read permissions in Salesforce
   - **Handling**: Returns error message to user

## Testing Checklist

- [ ] Account search works
- [ ] Opportunity search works
- [ ] Project search works
- [ ] Relationship fields populate correctly
- [ ] Error messages display properly
- [ ] Fallback query works for Projects with missing fields
- [ ] Auto-populate company name works when record is selected
- [ ] Manual entry fallback works
- [ ] Search debounce works (300ms delay)
- [ ] Loading states display correctly

## Field Name Verification

To verify field names in your Salesforce org:

1. **For SFDC_Project__c**:
   - Go to Setup → Object Manager → SFDC_Project__c
   - Check Fields & Relationships
   - Verify these field API names:
     - `Account__c` (Lookup to Account)
     - `Opportunity__c` (Lookup to Opportunity)
   - If different, update the SOQL query in `searchSalesforceRecords.js`

2. **For Opportunity**:
   - Standard fields should work: `AccountId`, `Account.Name`
   - If issues, check field-level security

3. **For Account**:
   - Standard fields: `Name`, `Type`, `Industry`, `Website`
   - Should work by default

## Debugging

### Check Netlify Function Logs:
1. Go to Netlify Dashboard
2. Navigate to Functions → searchSalesforceRecords
3. Check logs for:
   - SOQL queries being executed
   - Error messages from Salesforce
   - Response data

### Check Browser Console:
1. Open Developer Tools (F12)
2. Check Console tab for:
   - Salesforce authentication status
   - API call errors
   - Component errors

### Common Issues:

1. **"No records found" but records exist in Salesforce**
   - Check field-level security
   - Verify search term matches exactly
   - Check object permissions

2. **"Field not found" errors**
   - Verify field API names in Salesforce Setup
   - Check if custom fields exist
   - Update SOQL query with correct field names

3. **Relationship fields return null**
   - Check if lookup relationships are populated
   - Verify relationship field names (should end with __r for relationships)
   - Check field-level security on related objects

## Next Steps After Testing

If errors are found:
1. Note the exact error message
2. Check which object type caused the error
3. Verify field names in Salesforce Setup
4. Update the SOQL query if needed
5. Test again

