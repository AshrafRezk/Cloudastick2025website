# Guide: Adding a New Employee to the Website

This guide documents the steps required to add a new employee to the Cloudastick website. Follow these steps in order to ensure the employee appears on all relevant pages.

## Prerequisites

- Employee's name (first and last)
- Employee's role/title
- Employee's profile image (PNG format recommended)
- Years of experience
- Number of certificates
- Education (if applicable)
- Career track/employment history
- Short bio/description

## Step-by-Step Instructions

### 1. Prepare and Rename the Employee Image

1. Place the employee's image in: `public/Assets/Company Members/`
2. Rename the image file following this format:
   ```
   FirstName_LastName_Role_Title.png
   ```
   Example: `Alyaa_Hafez_Salesforce_Consultant.png`
   - Use underscores instead of spaces
   - Capitalize first letter of each word
   - Remove special characters

### 2. Add Employee to `src/data/teamMembers.ts`

1. Open `src/data/teamMembers.ts`
2. Add a new entry to the `teamMembers` array with the following structure:
   ```typescript
   {
     id: "firstname-lastname",  // lowercase with hyphens
     name: "First Last",
     role: "Role Title",
     image: "/Assets/Company Members/FirstName_LastName_Role_Title.png",
     profileSlug: "firstname-lastname",  // lowercase with hyphens, matches id
     description: "A brief description of the employee's role and expertise."
   }
   ```
3. Place the new entry at the end of the array (before the closing bracket)

**Important Fields:**
- `id`: lowercase version of name with hyphens (e.g., "alyaa-hafez")
- `profileSlug`: must match the `id` field
- `image`: path should start with `/Assets/Company Members/`
- `isAcademy`: Set to `true` if employee is part of the academy, otherwise omit or set to `false`

### 3. Create Profile Markdown Files

Create two markdown files with identical content (one in `src` for development, one in `public` for production).

#### File 1: `src/data/team-profiles/firstname-lastname.md`
#### File 2: `public/data/team-profiles/firstname-lastname.md`

**Markdown Template:**
```markdown
# Employee Full Name

## Experience
- Years: [number]
- Certificates: [number]

## Career Track
- Company Name (Start Year-End Year)
- Previous Company (Start Year-End Year)
- [Add more entries as needed]

## Bio
[Brief bio description of the employee's expertise and contributions.]
```

**Example:**
```markdown
# Alyaa Hafez

## Experience
- Years: 1
- Certificates: 2

## Career Track
- Progressio solutions (2024-2025)

## Bio
GUC Graduate and Salesforce Consultant bringing fresh expertise to deliver innovative solutions and drive business transformation in the Salesforce ecosystem.
```

**Important Notes:**
- The filename must match the `profileSlug` from step 2
- Career Track entries should be in reverse chronological order (most recent first)
- Format: `- Company Name (Start Year-End Year)` or `- Company Name (Year-Present)`

### 4. Update `src/pages/SalesforcePower.tsx`

1. Open `src/pages/SalesforcePower.tsx`
2. Find the hardcoded `teamMembers` array around line 1842
3. Add the new employee entry at the end of the array:
   ```javascript
   { name: 'First Last', role: 'Role Title', image: 'FirstName_LastName_Role_Title.png', isAcademy: false }
   ```
4. Ensure `isAcademy` matches the value set in `teamMembers.ts`

### 5. Update `src/pages/About.tsx`

1. Open `src/pages/About.tsx`
2. Find the hardcoded `teamMembers` array around line 17
3. Add the new employee entry at the end of the array:
   ```typescript
   { 
     id: [next number], name: "First Last", 
     role: t('team.salesforceConsultant'),  // or appropriate translation key
     image: "/Assets/Company Members/FirstName_LastName_Role_Title.png",
     icons: [Icon1, Icon2],  // Choose from imported icons
     hoverElements: [t('team.hoverElements.key1'), t('team.hoverElements.key2')],
     color: "from-color1-400 to-color2-500"  // Choose a gradient color scheme
   }
   ```

**Icon Selection:**
Available icons are imported at the top of the file. Common choices:
- `Code`, `Settings`, `Target`, `TrendingUp`, `GraduationCap`, `Award`, etc.
- Choose 2 icons that represent the employee's expertise

**Color Schemes:**
Use Tailwind gradient classes. Examples:
- `"from-cyan-400 to-blue-500"`
- `"from-indigo-400 to-blue-500"`
- `"from-purple-400 to-pink-500"`
- Ensure the color scheme is unique and not used by many other team members

### 6. Verify Changes

After completing all steps:

1. **Check file paths:** Ensure image path is correct in all files
2. **Check naming consistency:** 
   - ID matches profile slug
   - Profile slug matches markdown filenames
   - Image filename matches references
3. **Test locally:** Run the development server and verify:
   - Employee appears in team member lists
   - Employee profile loads correctly
   - Images display properly
   - No console errors

## Files That Need Updates

1. ✅ `public/Assets/Company Members/[Image].png` - Image file (rename/add)
2. ✅ `src/data/teamMembers.ts` - Main team data
3. ✅ `src/data/team-profiles/[slug].md` - Profile markdown (dev)
4. ✅ `public/data/team-profiles/[slug].md` - Profile markdown (prod)
5. ✅ `src/pages/SalesforcePower.tsx` - Hardcoded team list
6. ✅ `src/pages/About.tsx` - Hardcoded team list

## Additional Notes

- **Academy Members:** If the employee is part of the academy program, set `isAcademy: true` in `teamMembers.ts` and `SalesforcePower.tsx`
- **Role Translations:** In `About.tsx`, use translation keys like `t('team.salesforceConsultant')` for internationalization support
- **ID Numbers:** In `About.tsx`, use the next sequential number (check the last entry's id)
- **Image Optimization:** Consider optimizing images before adding them to reduce load times

## Quick Checklist

- [ ] Image renamed and placed in correct directory
- [ ] Added to `src/data/teamMembers.ts`
- [ ] Created markdown file in `src/data/team-profiles/`
- [ ] Created markdown file in `public/data/team-profiles/`
- [ ] Updated `src/pages/SalesforcePower.tsx`
- [ ] Updated `src/pages/About.tsx`
- [ ] Verified all paths and naming are consistent
- [ ] Tested locally to ensure everything works

## Example: Adding "Alyaa Hafez"

Here's a real example from the codebase:

**Image:** `Alyaa_Hafez_Salesforce_Consultant.png`
**ID/Slug:** `alyaa-hafez`

**teamMembers.ts entry:**
```typescript
{
  id: "alyaa-hafez",
  name: "Alyaa Hafez",
  role: "Salesforce Consultant",
  image: "/Assets/Company Members/Alyaa_Hafez_Salesforce_Consultant.png",
  profileSlug: "alyaa-hafez",
  description: "GUC Graduate and Salesforce Consultant bringing fresh expertise..."
}
```

**Profile markdown:** `alyaa-hafez.md` (in both locations)

**SalesforcePower.tsx entry:**
```javascript
{ name: 'Alyaa Hafez', role: 'Salesforce Consultant', image: 'Alyaa_Hafez_Salesforce_Consultant.png', isAcademy: false }
```

**About.tsx entry:**
```typescript
{ 
  id: 23, name: "Alyaa Hafez", 
  role: t('team.salesforceConsultant'), 
  image: "/Assets/Company Members/Alyaa_Hafez_Salesforce_Consultant.png",
  icons: [GraduationCap, Code],
  hoverElements: [t('team.hoverElements.development'), t('team.hoverElements.innovation')],
  color: "from-cyan-400 to-blue-500"
}
```

---

**Last Updated:** December 2024
**Maintained By:** Cloudastick Development Team

