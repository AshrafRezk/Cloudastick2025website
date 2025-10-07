# Tarwtl Lead Capture Page

## Overview
A modern, mobile-first, interactive Salesforce Web-to-Lead form for Tarjama and Arabic.ai, accessible at `https://cloudastick.org/tarwtl`.

## Features Implemented

### ✅ Custom Startup Sequence
- **Three-logo sequence**: Gitex → Tarjama → Arabic.ai
- **Animated transitions**: 3D rotation effects with smooth fade-in/out
- **Interactive start**: User must click "Start Your Journey" to begin
- **Final state**: Arabic.ai logo remains dominant until user clicks "Begin"

### ✅ Material 3 Design
- **Hero Section**: Gradient background with animated particle patterns
- **Form Design**: Rounded inputs (border-radius: 1rem), modern typography
- **Color Scheme**: Blue to purple gradient reflecting both brands
- **Responsive Layout**: Mobile-first, single column on mobile, two columns on desktop

### ✅ Haptic Feedback
- **Button taps**: 30-40ms vibration on all interactive elements
- **Form focus**: 20ms subtle feedback when focusing inputs
- **Product selector**: 40ms haptic on selection toggle
- **Submit action**: 40ms feedback on form submission
- **Validation errors**: 50ms stronger vibration for errors

### ✅ Product Selector
- **Multi-select**: Choose Tarjama, Arabic.ai, or both
- **Visual feedback**: Gradient background for selected items
- **Animated**: Scale and color transitions on interaction
- **Required field**: Validation ensures at least one product is selected

### ✅ Salesforce Integration
**POST Endpoint**: `https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8&orgId=00D3z000000fPuB`

**Standard Fields**:
- first_name
- last_name
- email
- company
- city
- country_code
- mobile
- industry

**Custom Fields**:
- `00NJ5000000hzjZ`: Comments (includes selected products)
- `00NNM00000D1ioR`: Device Info (30k char limit)

### ✅ Device Information Capture
Auto-captured and appended to Device Info field:
```
Device: Mobile/Desktop
Browser: Chrome/Safari/Firefox/Edge
OS: Windows/macOS/Linux/Android/iOS
Screen: 390x844 (width x height)
Language: en-US
Timezone: GMT+3
Referrer: https://example.com
Lead Source: gitex2025 (from ?src= or ?utm_source= query param)
```

### ✅ Query Parameter Support
- `?src=gitex2025` → Captured as "Lead Source: gitex2025"
- `?utm_source=email` → Captured as "Lead Source: email"
- Falls back to "organic" if no source parameter present

### ✅ Form Validation
- **HTML5 validation**: email format, required fields
- **Custom validation**: At least one product must be selected
- **Real-time feedback**: Errors clear as user corrects them
- **Visual indicators**: Red borders and error messages
- **Submit blocking**: Disabled until all required fields are valid

### ✅ Success Feedback
- **Visual**: Green snackbar with checkmark icon
- **Audio**: Success sound plays on submission
- **Haptic**: 50ms vibration
- **Auto-dismiss**: Clears after 5 seconds
- **Form reset**: All fields cleared for new submission

### ✅ Micro-interactions
- **Ripple effects**: Material 3-style ripples on buttons
- **Scale animations**: Buttons scale on hover (1.05x) and tap (0.95x)
- **Color transitions**: Smooth gradient shifts on hover
- **Input focus**: Border color changes to blue
- **Loading state**: Animated spinner during submission

## File Structure

```
src/
├── components/
│   └── TarwtlStartupSequence.tsx    # Custom logo sequence
├── pages/
│   └── TarwtlLeadCapture.tsx        # Main lead capture page
└── App.tsx                           # Updated with /tarwtl route
```

## Key Technologies
- **React** with TypeScript
- **Framer Motion** for animations
- **Tailwind CSS** for styling
- **Salesforce Web-to-Lead** API
- **Navigator API** for haptics and device info

## Usage

### Development
```bash
npm run dev
# Visit http://localhost:5173/tarwtl
```

### Production
The page is accessible at: `https://cloudastick.org/tarwtl`

### Testing with Query Parameters
- `https://cloudastick.org/tarwtl?src=gitex2025`
- `https://cloudastick.org/tarwtl?utm_source=email`
- `https://cloudastick.org/tarwtl?utm_source=linkedin&utm_campaign=launch`

## Logo Assets Used
Located in `/public/lovable-uploads/`:
- **Gitex**: `86bce185-8352-41ab-95de-e94dde49cfa6.png`
- **Tarjama**: `2bfae079-606f-45b2-bee0-70af6023b001.png`
- **Arabic.ai**: `4fe89c11-3a26-4657-b290-84aa60913e64.png`

## Routing Implementation
The `/tarwtl` route is configured to:
- **Bypass** the standard Cloudastick startup sequence
- **Skip** the standard Layout component (no header/footer from main site)
- **Display** its own custom startup sequence with customer logos
- **Provide** a standalone, branded experience

## Browser Compatibility
- **Haptics**: Supported on mobile devices (iOS/Android)
- **Desktop**: Graceful fallback (no haptics, but all other features work)
- **Modern browsers**: Chrome, Safari, Firefox, Edge (latest versions)
- **Form submission**: Uses `mode: 'no-cors'` for Salesforce compatibility

## Accessibility
- Semantic HTML structure
- Keyboard navigation support
- Focus indicators on all interactive elements
- ARIA labels where appropriate
- High contrast ratios for text readability

## Performance
- Optimized animations (60fps)
- Lazy loading for images
- Debounced validation
- Efficient re-renders with React optimization
- Minimal bundle size impact

## Future Enhancements (Optional)
- [ ] Confetti animation on success
- [ ] 3D particle effects in hero section (Three.js)
- [ ] Advanced form analytics tracking
- [ ] Multi-language support (English/Arabic)
- [ ] Progressive Web App (PWA) features

