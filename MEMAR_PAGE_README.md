# Memar Lead Capture Page

## Overview
A modern, mobile-first, interactive Salesforce Web-to-Lead form for Memar Developments at Cityscape event, accessible at `https://cloudastick.org/memar`.

## Features Implemented

### ✅ Custom Startup Sequence
- **Two-logo sequence**: Cityscape → Memar
- **Animated transitions**: 3D rotation effects with smooth fade-in/out
- **Interactive start**: User must click "Start Your Investment Journey" to begin
- **Video background**: Skyscrapers video on welcome screen
- **Final state**: Memar logo remains dominant until user begins

### ✅ Material 3 Design
- **Hero Section**: Gradient background with animated particle patterns (emerald/green theme)
- **Form Design**: Rounded inputs (border-radius: 1rem), modern typography
- **Color Scheme**: Emerald to green gradient reflecting investment/growth theme
- **Responsive Layout**: Mobile-first, single column on mobile, two columns on desktop

### ✅ Haptic Feedback
- **Button taps**: 30-40ms vibration on all interactive elements
- **Form focus**: 20ms subtle feedback when focusing inputs
- **Submit action**: 40ms feedback on form submission
- **Validation errors**: 50ms stronger vibration for errors
- **Crescendo haptic**: Special woosh haptic pattern for animations

### ✅ Personalized Experience
- **Dynamic quotes**: Investment-themed quotes shown to users after entering name
- **Animated quote display**: Smooth fade-in with gradient background
- **Contextual messaging**: Quotes focused on safety, stability, and growth

### ✅ Salesforce Integration
**POST Endpoint**: `https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8&orgId=00DQE000000FdFZ`

**Standard Fields**:
- first_name
- last_name
- email
- mobile
- description
- lead_source

**Custom Fields**:
- `00NQE000000wSwn`: Budget (investment budget field)

### ✅ Device Information Capture
Auto-captured and stored for analytics:
```
Device: Mobile/Desktop
Browser: Chrome/Safari/Firefox/Edge
OS: Windows/macOS/Linux/Android/iOS
Screen: 390x844 (width x height)
Language: en-US
Timezone: GMT+3
Referrer: https://example.com
Lead Source: Trade Show (from ?lead_source= or ?utm_source= query param)
```

### ✅ Query Parameter Support
- `?lead_source=Cityscape` → Set as lead source
- `?source=cityscape` → Captured as lead source
- `?utm_source=event` → Captured as lead source
- Falls back to "Trade Show" if no source parameter present

### ✅ Form Validation
- **HTML5 validation**: Email format, required fields
- **Custom validation**: First name, last name, email, mobile required
- **Real-time feedback**: Errors clear as user corrects them
- **Visual indicators**: Red borders and error messages
- **Submit blocking**: Disabled until all required fields are valid

### ✅ Success Feedback
- **Visual**: Green snackbar with checkmark icon
- **Audio**: Success sound plays on submission
- **Haptic**: Vibration feedback
- **Redirect**: Automatic redirect to success page after 2 seconds
- **Success page**: Detailed next steps with 3-step process

### ✅ Success Page Features
- **Background video**: Skyscrapers video loop
- **Thank you message**: Clear confirmation of submission
- **Next steps**: 3-step process explaining what happens next:
  1. Personalized Review - Investment team reviews information
  2. Schedule Consultation - Team reaches out to schedule meeting
  3. Investment Strategy - Discuss tailored opportunities
- **Back button**: Option to return to form
- **Branded experience**: Memar logo and emerald/green theme

### ✅ Micro-interactions
- **Ripple effects**: Material 3-style ripples on buttons
- **Scale animations**: Buttons scale on hover (1.05x) and tap (0.95x)
- **Color transitions**: Smooth gradient shifts on hover
- **Input focus**: Border color changes to emerald
- **Loading state**: Animated spinner during submission
- **Woosh animations**: Morphing circle-to-square button animation on scroll

## File Structure

```
src/
├── components/
│   └── MemarStartupSequence.tsx      # Custom logo sequence
├── pages/
│   ├── MemarLeadCapture.tsx          # Main lead capture page
│   └── MemarLeadSuccess.tsx          # Success page with next steps
└── App.tsx                            # Updated with /memar routes
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
# Visit http://localhost:5173/memar
```

### Production
The page is accessible at: `https://cloudastick.org/memar`

### Testing with Query Parameters
- `https://cloudastick.org/memar?lead_source=Cityscape`
- `https://cloudastick.org/memar?utm_source=event`
- `https://cloudastick.org/memar?source=qr-code`

## Logo Assets Used
Located in `/public/Assets/Cityscape/`:
- **Cityscape**: `Cityscape assets/Cityscape_Logo.png`
- **Memar**: `Memar/Memar_Logo.png`

## Video Assets Used
Located in `/public/Assets/`:
- **Background video**: `scyscrapers.mp4`

## Audio Assets Used
Located in `/public/Assets/`:
- **Success sound**: `cloudastickwebsiteloadmusic.mp3`
- **Woosh 1**: `woosh1new.mp3` (small motions)
- **Woosh 2**: `woosh2new.mp3` (bigger animations)
- **Selection 1**: `selection1new.mp3` (interactions)

## Routing Implementation
The `/memar` routes are configured to:
- **Bypass** the standard Cloudastick startup sequence
- **Skip** the standard Layout component (no header/footer from main site)
- **Display** its own custom startup sequence with Cityscape and Memar logos
- **Provide** a standalone, branded experience for the event

### Available Routes
- `/memar` - Main lead capture page
- `/memar-lead-capture` - Alias for main page
- `/memar-success` - Success page shown after form submission

## Form Fields

### Required Fields
- **First Name**: Text input
- **Last Name**: Text input
- **Email**: Email input with validation
- **Mobile**: Phone number input

### Optional Fields
- **Budget**: Investment budget (text input)
- **Description**: Additional comments (textarea)

### Hidden Fields
- **Lead Source**: Auto-populated from URL params or defaults to "Trade Show"
- **Organization ID**: Salesforce org ID (00DQE000000FdFZ)
- **Return URL**: Success page URL

## Inspirational Quotes
The form displays personalized investment quotes to users:
- "Secure your future with the safest investment opportunities."
- "Grow your capital steadily with Memar's proven track record."
- "Investment success starts with the right partner—Memar Developments."
- "Build wealth that lasts generations with smart real estate investments."
- "Your financial security is our priority—invest with confidence."
- And more...

## Browser Compatibility
- **Haptics**: Supported on mobile devices (iOS/Android)
- **Desktop**: Graceful fallback (no haptics, but all other features work)
- **Modern browsers**: Chrome, Safari, Firefox, Edge (latest versions)
- **Form submission**: Uses hidden iframe to avoid page redirect

## Accessibility
- Semantic HTML structure
- Keyboard navigation support
- Focus indicators on all interactive elements
- ARIA labels where appropriate
- High contrast ratios for text readability

## Performance
- Optimized animations (60fps)
- Video preloading with fallback gradient
- Efficient re-renders with React optimization
- Minimal bundle size impact
- Audio volume set to 5% to avoid startling users

## Color Theme
- **Primary**: Emerald (emerald-500, emerald-600)
- **Secondary**: Green (green-500, green-600)
- **Background**: Gradient from emerald-50 to green-50
- **Text**: Slate-900 for headings, slate-600 for body
- **Success**: Emerald-500
- **Error**: Red-500

## Future Enhancements (Optional)
- [ ] Multi-language support (English/Arabic)
- [ ] Investment calculator integration
- [ ] Property showcase carousel
- [ ] Virtual tour integration
- [ ] Live chat with investment advisors
- [ ] Advanced analytics tracking
- [ ] Progressive Web App (PWA) features

## Event Context
This page was created for Memar Developments to capture leads at the **Cityscape** event. The messaging focuses on:
- Safe and secure investments
- Capital growth opportunities
- Real estate investment expertise
- Consultation with investment professionals
- Building long-term wealth

## Notes
- Audio volume is set to 5% to be subtle and non-intrusive
- Haptic feedback is reduced to 10% intensity for comfort
- All animations are optimized for 60fps
- Form submission uses hidden iframe to prevent page navigation
- Success page automatically shows after 2 seconds of submission

