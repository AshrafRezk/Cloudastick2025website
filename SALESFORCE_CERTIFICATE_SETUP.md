# LMS Certificate System Setup Guide

This guide outlines how the certificate system uses **existing Salesforce objects** - no new objects need to be created!

## Overview

The certificate system uses the existing `Learning_Material_Instance__c` object to store certificate data. When a parent course is completed (all child materials completed and all quizzes passed), certificate information is automatically stored on the instance record itself.

## How It Works

### Certificate Data Storage

Certificates are stored directly on `Learning_Material_Instance__c` records:

- **Certificate ID**: Format `CERT-{InstanceId}` (derived from the instance ID)
- **Verification Code**: Stored in the `Name` field along with certificate ID
- **Name Field Format**: `CERT-{InstanceId}|{VerificationCode}`
  - Example: `CERT-a1b2c3d4e5f6g7h8|ABC123XY`
- **Issued Date**: Uses existing `Completed_On__c` field
- **Status**: Uses existing `Status__c` field (must be 'Completed')

### Certificate Identification

- Certificates are identified by `Name` field starting with `CERT-`
- Only parent course instances (not child materials) can have certificates
- Certificate is automatically generated when:
  1. All child materials are completed
  2. All quizzes passed (if any quizzes exist)
  3. `Issue_Certificate__c` is enabled on the parent material

## Required Fields on Existing Objects

### Learning_Material__c (Optional Enhancements)

These fields are **optional** but recommended for better certificate functionality:

#### Checkbox Fields
1. **Issue_Certificate__c** (Checkbox)
   - Field Label: `Issue Certificate`
   - Field Name: `Issue_Certificate__c`
   - Default Value: `false`
   - Description: Enable certificate generation for this course
   - **Note**: If this field doesn't exist, certificates will be generated for all completed courses

#### URL Fields (Optional)
2. **Certificate_Logo_URL__c** (URL(255))
   - Field Label: `Certificate Logo URL`
   - Field Name: `Certificate_Logo_URL__c`
   - Required: No
   - Description: URL to course-specific logo for certificate branding

#### Rich Text Area Fields (Optional)
3. **Certificate_Template__c** (Rich Text Area(131072))
   - Field Label: `Certificate Template`
   - Field Name: `Certificate_Template__c`
   - Required: No
   - Description: Optional custom HTML template for certificate display

### Learning_Material_Instance__c (Uses Existing Fields)

**No new fields needed!** The system uses:
- `Name` - Stores certificate ID and verification code
- `Status__c` - Must be 'Completed' for certificate
- `Completed_On__c` - Used as issued date
- `Learner__c` - Contact who earned the certificate
- `Material__c` - The course/material

## Certificate Generation Flow

1. User completes all child materials in a parent course
2. System checks if all quizzes passed (if any exist)
3. System checks if `Issue_Certificate__c` is enabled (if field exists)
4. If eligible, system updates the instance `Name` field with certificate data
5. Certificate becomes accessible via public link: `/certificate/CERT-{InstanceId}`

## Certificate Lookup Queries

### Find Certificate by Certificate ID
```sql
SELECT Id, Name, Learner__c, Learner__r.Name, Learner__r.Email, 
       Material__c, Material__r.Title__c, Material__r.Description__c,
       Status__c, Completed_On__c
FROM Learning_Material_Instance__c 
WHERE Id = '{instanceId}' 
  AND Status__c = 'Completed' 
  AND Name LIKE 'CERT-%'
```

### Find Certificate by Verification Code
```sql
SELECT Id, Name, Learner__c, Learner__r.Name, Learner__r.Email,
       Material__c, Material__r.Title__c, Material__r.Description__c,
       Status__c, Completed_On__c
FROM Learning_Material_Instance__c 
WHERE Status__c = 'Completed' 
  AND Name LIKE '%|{verificationCode}'
```

### Find All Certificates for a Contact
```sql
SELECT Id, Name, Learner__c, Material__c, Material__r.Title__c,
       Status__c, Completed_On__c, Material__r.Parent_Material__c
FROM Learning_Material_Instance__c 
WHERE Learner__c = '{contactId}' 
  AND Status__c = 'Completed' 
  AND Name LIKE 'CERT-%'
  AND Material__r.Parent_Material__c = null
ORDER BY Completed_On__c DESC
```

## Field Requirements

### Name Field on Learning_Material_Instance__c

The `Name` field must be:
- **Editable** - The system needs to update it to store certificate data
- **Text field** - To store the format `CERT-{InstanceId}|{VerificationCode}`

**Important**: If the `Name` field is auto-number or read-only, you may need to:
1. Check if it's editable via API (some auto-number fields can be updated)
2. Or use an alternative text field if available

## Setup Steps

### Minimal Setup (No New Fields Required)

1. **Verify Name Field is Editable**
   - Go to `Learning_Material_Instance__c` object setup
   - Check that `Name` field can be updated via API
   - If not editable, the system will attempt to update it (may fail silently)

2. **Test Certificate Generation**
   - Complete a parent course (all children completed)
   - Check that the instance `Name` field is updated with `CERT-` prefix
   - Verify certificate is accessible via public link

### Recommended Setup (Optional Fields)

1. **Add Issue_Certificate__c to Learning_Material__c** (Optional)
   - Allows selective certificate generation per course
   - If not added, certificates generate for all completed courses

2. **Add Certificate_Logo_URL__c to Learning_Material__c** (Optional)
   - Enables course-specific branding on certificates

3. **Add Certificate_Template__c to Learning_Material__c** (Optional)
   - Allows custom certificate templates per course

## Certificate URL Format

- Public Certificate URL: `https://yourdomain.com/certificate/CERT-{InstanceId}`
- Verification URL: `https://yourdomain.com/verify-certificate?certificateId=CERT-{InstanceId}`

## Verification Code Format

- 8-character alphanumeric code
- Stored in `Name` field after the `|` separator
- Example: `CERT-a1b2c3d4e5f6g7h8|ABC123XY`

## Security Considerations

1. **Public Access**: Certificate endpoints use system authentication (client credentials)
2. **Data Privacy**: Only public information is exposed (name, course, date)
3. **Verification**: Verification codes provide additional security layer
4. **Status Check**: Only 'Completed' instances with `CERT-` prefix are considered valid certificates

## Troubleshooting

### Certificates Not Generating

1. Check that all child materials are completed
2. Verify all quizzes passed (if any exist)
3. Check if `Issue_Certificate__c` is enabled (if field exists)
4. Verify `Name` field is editable on `Learning_Material_Instance__c`
5. Check system logs for certificate generation errors

### Certificate Not Found

1. Verify certificate ID format: `CERT-{InstanceId}`
2. Check that instance `Status__c = 'Completed'`
3. Verify `Name` field starts with `CERT-`
4. Ensure instance is for a parent course (not child material)

### Name Field Update Fails

- If `Name` is auto-number, it may not be updatable
- Check field-level security permissions
- Verify API access to update the field
- Consider using an alternative text field if available

## Benefits of This Approach

✅ **No new objects needed** - Uses existing `Learning_Material_Instance__c`  
✅ **No additional lookups** - Certificate data is on the completion record  
✅ **Simpler data model** - Certificate tied directly to completion  
✅ **Automatic generation** - No manual certificate creation needed  
✅ **Minimal setup** - Works with existing fields  

## Notes

- The certificate system automatically generates certificates when courses are completed
- Certificate data is stored in the `Name` field: `CERT-{InstanceId}|{VerificationCode}`
- Certificate ID is derived from instance ID: `CERT-{InstanceId}`
- Verification code is a random 8-character alphanumeric string
- All certificate data can be derived from the instance record and related objects
- No additional Salesforce configuration needed beyond ensuring `Name` field is editable
