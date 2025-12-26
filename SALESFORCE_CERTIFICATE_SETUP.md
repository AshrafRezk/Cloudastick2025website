# Salesforce Certificate Object Setup Guide

This guide outlines the Salesforce custom objects and fields needed for the LMS Certificate System.

## 1. Create Certificate__c Custom Object

Create a new custom object in Salesforce Setup:

**Object Settings:**
- Object Label: `Certificate`
- Object Name: `Certificate`
- Plural Label: `Certificates`
- Record Name: `Certificate Number` (Auto Number, format: CERT-{00000})
- Allow Search: Yes
- Track Field History: Yes (optional)
- Allow Reports: Yes
- Allow Activities: No
- Allow Sharing: Yes

## 2. Certificate__c Fields

Create the following fields on the Certificate__c object:

### Lookup Fields
1. **Contact__c** (Lookup to Contact)
   - Field Label: `Contact`
   - Field Name: `Contact__c`
   - Required: Yes
   - Description: The contact who earned this certificate

2. **Learning_Material__c** (Lookup to Learning_Material__c)
   - Field Label: `Learning Material`
   - Field Name: `Learning_Material__c`
   - Required: Yes
   - Description: The parent course/material this certificate is for

3. **Learning_Material_Instance__c** (Lookup to Learning_Material_Instance__c)
   - Field Label: `Learning Material Instance`
   - Field Name: `Learning_Material_Instance__c`
   - Required: Yes
   - Description: The specific instance record tied to this certificate

### Text Fields
4. **Certificate_ID__c** (Text(255), Unique)
   - Field Label: `Certificate ID`
   - Field Name: `Certificate_ID__c`
   - Required: Yes
   - Unique: Yes
   - External ID: Yes
   - Description: Unique identifier for public certificate links

5. **Verification_Code__c** (Text(20), Unique)
   - Field Label: `Verification Code`
   - Field Name: `Verification_Code__c`
   - Required: Yes
   - Unique: Yes
   - Description: 8-character code for certificate verification

### Date Fields
6. **Issued_Date__c** (Date)
   - Field Label: `Issued Date`
   - Field Name: `Issued_Date__c`
   - Required: Yes
   - Description: Date the certificate was issued

### URL Fields
7. **Certificate_URL__c** (URL(255))
   - Field Label: `Certificate URL`
   - Field Name: `Certificate_URL__c`
   - Required: No
   - Description: Public URL to view the certificate

8. **PDF_File_URL__c** (URL(255))
   - Field Label: `PDF File URL`
   - Field Name: `PDF_File_URL__c`
   - Required: No
   - Description: URL to the PDF version of the certificate

### Picklist Fields
9. **Status__c** (Picklist)
   - Field Label: `Status`
   - Field Name: `Status__c`
   - Required: Yes
   - Default Value: `Active`
   - Values:
     - Active
     - Revoked
   - Description: Certificate status

### Long Text Area Fields
10. **Metadata__c** (Long Text Area(131072))
    - Field Label: `Metadata`
    - Field Name: `Metadata__c`
    - Required: No
    - Description: JSON string containing additional certificate data (scores, completion details, etc.)

## 3. Learning_Material__c Field Enhancements

Add the following fields to the existing Learning_Material__c object:

### Checkbox Fields
1. **Issue_Certificate__c** (Checkbox)
   - Field Label: `Issue Certificate`
   - Field Name: `Issue_Certificate__c`
   - Default Value: `false`
   - Description: Enable certificate generation for this course

### Rich Text Area Fields
2. **Certificate_Template__c** (Rich Text Area(131072))
   - Field Label: `Certificate Template`
   - Field Name: `Certificate_Template__c`
   - Required: No
   - Description: Optional custom HTML template for certificate display

### URL Fields
3. **Certificate_Logo_URL__c** (URL(255))
   - Field Label: `Certificate Logo URL`
   - Field Name: `Certificate_Logo_URL__c`
   - Required: No
   - Description: URL to course-specific logo for certificate branding

## 4. Field-Level Security & Sharing

### Field-Level Security
- Ensure all Certificate__c fields are visible to:
  - System Administrators
  - Portal Users (if using Community/Experience Cloud)
  - Custom profiles as needed

### Object Permissions
- Grant Read access to Certificate__c for:
  - Portal Users (for viewing their own certificates)
  - Public (for public certificate verification - read-only on Certificate_ID__c and Verification_Code__c)

### Sharing Rules (if needed)
- Create sharing rules to allow public read access to Certificate__c records via Certificate_ID__c

## 5. Validation Rules (Optional)

Consider adding validation rules:

1. **Certificate ID Format Validation**
   - Ensure Certificate_ID__c follows expected format (UUID or base64)

2. **Verification Code Format Validation**
   - Ensure Verification_Code__c is exactly 8 alphanumeric characters

3. **Status Validation**
   - Prevent deletion of Active certificates (use Status = Revoked instead)

## 6. Indexes

Create indexes on:
- Certificate_ID__c (already indexed as External ID)
- Verification_Code__c (for fast lookups)
- Contact__c + Learning_Material__c (composite index for querying user certificates)

## 7. Apex Triggers (Optional)

Consider creating triggers for:
- Auto-generating Certificate_ID__c if not provided
- Auto-generating Verification_Code__c if not provided
- Auto-populating Certificate_URL__c based on Certificate_ID__c
- Preventing duplicate certificates for same Contact + Learning_Material combination

## 8. Testing

After setup, verify:
1. Can create Certificate__c records via API
2. Certificate_ID__c uniqueness is enforced
3. Verification_Code__c uniqueness is enforced
4. Lookup relationships work correctly
5. Field-level security allows appropriate access

## Notes

- The Certificate_ID__c should be generated as a UUID or base64-encoded string
- The Verification_Code__c should be an 8-character alphanumeric code
- Consider using Salesforce Flow or Process Builder to auto-generate these values
- For public access, you may need to create a Guest User profile with limited read access

