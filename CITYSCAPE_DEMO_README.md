# Cityscape Demo Lead Capture System

## Overview
A fully personalized lead capture demo system designed for Cityscape exhibition attendees. The system tailors its UI/UX based on the company's booth purpose and generates a dynamic company logo.

## User Flow

### 1. Start Page (`/cityscape`)
- **Company Name Input**: User enters their company name
- **Booth Purpose Selection**: Three options:
  - 💰 **Attract Investors** - For securing funding and partnerships
  - 🏢 **Attract Offices** - For ready-to-move business spaces  
  - 🏠 **Attract Residents** - For residential property buyers
- **Logo Generation**: Creates a logo using company initials
- **Data Storage**: Selections stored in sessionStorage for next page

### 2. Lead Capture Page (`/cityscape-lead-capture`)
- **Personalized Branding**:
  - Generated logo with company initials
  - Custom color gradient based on booth purpose
  - Tailored messaging and quotes
  - Dynamic feature highlights
  
- **Adaptive Content by Purpose**:
  - **Investors**: Emerald/Teal gradient, capital growth messaging
  - **Offices**: Blue/Indigo gradient, modern workspace messaging
  - **Residents**: Purple/Pink gradient, family home messaging

- **Form Fields**:
  - First Name & Last Name (required)
  - Email & Mobile (required)
  - Company (auto-filled from start page)
  - Budget (optional)
  - Additional Comments (optional)

- **Smart Features**:
  - Personalized quotes appear after user starts typing
  - Smooth scroll animations with haptic feedback
  - Real-time form validation
  - Device info capture for lead tracking

- **Salesforce Integration**:
  - Direct submission to Salesforce Web-to-Lead
  - Custom fields for budget tracking
  - Lead source automatically tagged as "Cityscape Demo"
  - Booth purpose included in description

### 3. Success Page (`/cityscape-success`)
- **Thank You Message**: Confirmation of successful submission
- **Vimeo Demo Video**: Embedded autoplay video showcasing Cloudastick capabilities
- **Call-to-Action Buttons**:
  - ✅ **Quick Quote** (WhatsApp): Get app ready in 4 days
  - ✅ **Full Package** (WhatsApp): Salesforce + App + MVP Setup
- **Social Proof**: Display of trusted companies:
  - Erth, Memar, HDP, Marakez, Benoit Properties, Nile City Towers, and more
- **WhatsApp Integration**: Pre-filled messages to Mina for quick contact

## Technical Architecture

### Pages Created
1. **CityscapeStart.tsx** - Initial company info and purpose selection
2. **CityscapeLeadCapture.tsx** - Dynamic lead capture form
3. **CityscapeLeadSuccess.tsx** - Thank you page with video and CTAs

### Components Created
1. **CityscapeStartupSequence.tsx** - Animated loading sequence

### Key Features

#### Dynamic Logo Generation
```typescript
const generateLogo = (name: string) => {
  const words = name.trim().split(' ');
  const initials = words.length >= 2 
    ? `${words[0][0]}${words[1][0]}`.toUpperCase()
    : words[0].slice(0, 2).toUpperCase();
  return initials;
};
```

#### Purpose-Based Customization
Each booth purpose has:
- Unique color gradient
- Tailored titles and subtitles
- Custom features list
- Personalized motivational quotes
- Specific icon representation

#### Salesforce Integration
- Organization ID: `00DQE000000FdFZ`
- Custom budget field: `00NQE000000wSwn`
- Return URL: `/cityscape-success`
- Hidden iframe submission for seamless UX

#### WhatsApp Integration
Two pre-configured message templates:
1. **Quick Quote**: 4-day implementation request
2. **Full Package**: Complete Salesforce + App setup

Contact: Mina (+971 50 969 9691)

## Routes Configuration

```typescript
// App.tsx routes
<Route path="/cityscape" element={<CityscapeStart />} />
<Route path="/cityscape-start" element={<CityscapeStart />} />
<Route path="/cityscape-lead-capture" element={<CityscapeLeadCapture />} />
<Route path="/cityscape-success" element={<CityscapeLeadSuccess />} />
```

## Design Elements

### Animations
- Framer Motion for smooth transitions
- Haptic feedback on mobile devices
- Scroll-triggered form animations
- Loading states with spinners
- Woosh sound effects for interactions

### Responsive Design
- Mobile-first approach
- Breakpoints: sm, md, lg, xl
- Touch-friendly buttons
- Adaptive video backgrounds
- Flexible grid layouts

### Audio Effects
- Startup sequence music (5% volume)
- Woosh sounds for transitions
- Success confirmation sounds
- All audio respects user preferences

## Usage

### Demo URL
Navigate to: `https://yourdomain.com/cityscape`

### Testing Different Purposes
1. Enter different company names to see logo generation
2. Select each booth purpose to see different themes:
   - Investors: Green theme, investment messaging
   - Offices: Blue theme, workspace messaging
   - Residents: Purple theme, residential messaging

### Customization
To customize for different events:
1. Update company names in `CityscapeLeadSuccess.tsx`
2. Modify color gradients in `contentByPurpose` object
3. Change Salesforce Organization ID if needed
4. Update WhatsApp number and messages
5. Replace Vimeo video URL

## Video Integration

### Vimeo Video Details
- Video ID: 1129519409
- Autoplay enabled
- Responsive 16:9 aspect ratio
- Embedded with Vimeo Player API

## Lead Data Captured

### Standard Fields
- First Name, Last Name
- Email, Mobile
- Company Name
- Lead Source: "Cityscape Demo"

### Custom Fields
- Budget (Investment/Purchase amount)
- Booth Purpose (investors/offices/residents)
- Device Information (browser, OS, screen size)
- Timezone and Language
- Referrer URL

## Social Proof

Trusted companies displayed:
- Erth
- Memar
- HDP
- Marakez
- Benoit Properties
- Nile City Towers

This builds credibility and trust with potential clients.

## Next Steps

1. **Before Cityscape**: Test all flows and ensure Salesforce connection works
2. **At the Booth**: Display QR code or short URL to `/cityscape`
3. **After Submission**: Sales team receives lead in Salesforce immediately
4. **Follow-up**: WhatsApp integration enables instant communication

## Support

For technical support or customization requests:
- Contact: Cloudastick Team
- Salesforce Partner
- Built with ❤️ for Cityscape 2025

---

**Note**: This system can be easily replicated for other exhibitions by modifying the purpose options, branding, and messaging.

