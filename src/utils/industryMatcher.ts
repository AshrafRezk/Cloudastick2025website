/**
 * Industry Matching Utility
 * Maps URL industry parameters to our internal industry IDs
 * Supports all 80+ industries from the provided list
 */

// Mapping of all industries to our 12 existing categories
const INDUSTRY_MAPPING: { [key: string]: string } = {
  // Real Estate
  'real estate': 'real-estate',
  'real-estate': 'real-estate',
  'construction': 'real-estate',
  'architecture and planning': 'real-estate',
  'architecture': 'real-estate',
  'building materials': 'real-estate',

  // Healthcare & Life Sciences
  'healthcare': 'healthcare-life-sciences',
  'hospitals and health care': 'healthcare-life-sciences',
  'hospitals': 'healthcare-life-sciences',
  'medical equipment manufacturing': 'healthcare-life-sciences',
  'medical equipment': 'healthcare-life-sciences',
  'pharmaceutical': 'healthcare-life-sciences',
  'pharmaceutical manufacturing': 'healthcare-life-sciences',

  // Manufacturing
  'manufacturing': 'manufacturing',
  'chemical manufacturing': 'manufacturing',
  'chemicals': 'manufacturing',
  'machinery': 'manufacturing',
  'electronics': 'manufacturing',
  'appliances, electrical, and electronics manufacturing': 'manufacturing',
  'appliances electrical and electronics manufacturing': 'manufacturing',
  'textile manufacturing': 'manufacturing',
  'textile & garment': 'manufacturing',
  'textile': 'manufacturing',
  'garment': 'manufacturing',
  'motor vehicle manufacturing': 'manufacturing',
  'furniture': 'manufacturing',

  // Telecommunications
  'telecommunications': 'telecommunications',
  'communications': 'telecommunications',

  // Financial Services
  'banking/financial services/insurance': 'financial-services',
  'banking financial services insurance': 'financial-services',
  'financial services': 'financial-services',
  'finance': 'financial-services',
  'banking': 'financial-services',
  'insurance': 'financial-services',
  'investment management': 'financial-services',

  // Commerce Cloud (Retail/E-commerce)
  'retail apparel and fashion': 'commerce-cloud',
  'retail': 'commerce-cloud',
  'e-commerce': 'commerce-cloud',
  'ecommerce': 'commerce-cloud',
  'consumer services': 'commerce-cloud',

  // Professional Services
  'professional services': 'professional-services',
  'professional training and coaching': 'professional-services',
  'business consulting and services': 'professional-services',
  'it services and it consulting': 'professional-services',
  'it services': 'professional-services',
  'it consulting': 'professional-services',
  'computer software': 'professional-services',
  'software development': 'professional-services',
  'technology': 'professional-services',
  'consulting': 'professional-services',
  'outsourcing and offshoring consulting': 'professional-services',
  'outsourcing': 'professional-services',
  'offshoring': 'professional-services',
  'human resources services': 'professional-services',
  'hr services': 'professional-services',
  'recruitment': 'professional-services',
  'advertising services': 'professional-services',
  'advertising': 'professional-services',
  'marketing': 'professional-services',
  'law': 'professional-services',
  'law practice': 'professional-services',

  // Automotive
  'automotive': 'automotive',


  // Travel & Tourism
  'tourism': 'travel-tourism',
  'travel': 'travel-tourism',
  'hospitality': 'travel-tourism',
  'recreation': 'travel-tourism',
  'entertainment': 'travel-tourism',
  'spectator sports': 'travel-tourism',
  'sports': 'travel-tourism',

  // Food & Beverage
  'food and beverage manufacturing': 'food-beverage',
  'food & beverage': 'food-beverage',
  'food and beverage': 'food-beverage',
  'food and beverage services': 'food-beverage',
  'food export': 'food-beverage',

  // Utilities
  'utilities': 'utilities',
  'energy': 'utilities',
  'oil and gas': 'utilities',
  'oil & gas': 'utilities',
  'environmental': 'utilities',

  // Government
  'government': 'government',
  'government administration': 'government',

  // Other/Generic (industries that don't fit well into specific categories)
  'industry': null, // Too generic
  'other': null,
  '': null,
  'farming': null,
  'agriculture': null,
  'import & export': null,
  'import and export': null,
  'international trade and development': null,
  'transportation': null,
  'freight and package transportation': null,
  'freight': null,
  'shipping': null,
  'media': null,
  'not for profit': null,
  'non-profit organizations': null,
  'nonprofit': null,
  'education': null,
  'education administration programs': null,
  'higher education': null,
  'engineering': null,

  // Additional explicit mappings for better coverage
  'retail apparel': 'commerce-cloud',
  'apparel and fashion': 'commerce-cloud',
  'apparel': 'commerce-cloud',
  'fashion': 'commerce-cloud',
  'not-for-profit': null,
  'non profit': null,
  'non profit organizations': null,
};

/**
 * Normalize industry string for matching
 * - Convert to lowercase
 * - Replace hyphens with spaces
 * - Remove special characters
 * - Trim whitespace
 */
function normalizeIndustryString(industry: string): string {
  return industry
    .toLowerCase()
    .replace(/-/g, ' ')
    .replace(/[&/]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Match industry from URL parameter to our internal industry ID
 * @param industryParam - Industry string from URL (e.g., "Real-Estate", "Banking/Financial Services/Insurance")
 * @returns Industry ID or null if no match found
 */
export function matchIndustryFromUrl(industryParam: string | null): string | null {
  if (!industryParam) return null;

  // Decode URL encoding
  const decoded = decodeURIComponent(industryParam);

  // Normalize the string
  const normalized = normalizeIndustryString(decoded);

  // Direct match
  if (INDUSTRY_MAPPING[normalized] !== undefined) {
    return INDUSTRY_MAPPING[normalized];
  }

  // Fuzzy matching - check if any key contains the normalized string or vice versa
  for (const [key, value] of Object.entries(INDUSTRY_MAPPING)) {
    if (key.includes(normalized) || normalized.includes(key)) {
      return value;
    }
  }

  // Keyword-based matching for partial matches
  const keywords: { [key: string]: string } = {
    'real estate': 'real-estate',
    'property': 'real-estate',
    'construction': 'real-estate',
    'architect': 'real-estate',
    'building': 'real-estate',

    'health': 'healthcare-life-sciences',
    'medical': 'healthcare-life-sciences',
    'hospital': 'healthcare-life-sciences',
    'pharma': 'healthcare-life-sciences',
    'pharmaceutical': 'healthcare-life-sciences',

    'manufactur': 'manufacturing',
    'chemical': 'manufacturing',
    'machinery': 'manufacturing',
    'electron': 'manufacturing',
    'textile': 'manufacturing',
    'furniture': 'manufacturing',

    'telecom': 'telecommunications',
    'communication': 'telecommunications',

    'bank': 'financial-services',
    'finance': 'financial-services',
    'financial': 'financial-services',
    'insurance': 'financial-services',
    'investment': 'financial-services',

    'retail': 'commerce-cloud',
    'ecommerce': 'commerce-cloud',
    'e-commerce': 'commerce-cloud',
    'shopping': 'commerce-cloud',
    'fashion': 'commerce-cloud',
    'apparel': 'commerce-cloud',

    'professional': 'professional-services',
    'consulting': 'professional-services',
    'software': 'professional-services',
    'technology': 'professional-services',
    'it ': 'professional-services',
    'hr ': 'professional-services',
    'human resource': 'professional-services',
    'recruitment': 'professional-services',
    'advertising': 'professional-services',
    'marketing': 'professional-services',
    'law': 'professional-services',
    'legal': 'professional-services',

    'automotive': 'automotive',
    'vehicle': 'automotive',
    'motor': 'automotive',

    'travel': 'travel-tourism',
    'tourism': 'travel-tourism',
    'hospitality': 'travel-tourism',
    'hotel': 'travel-tourism',
    'recreation': 'travel-tourism',
    'entertainment': 'travel-tourism',
    'sport': 'travel-tourism',

    'food': 'food-beverage',
    'beverage': 'food-beverage',
    'restaurant': 'food-beverage',

    'utility': 'utilities',
    'energy': 'utilities',
    'oil': 'utilities',
    'gas': 'utilities',
    'environmental': 'utilities',

    'government': 'government',
    'public sector': 'government',
  };

  for (const [keyword, industryId] of Object.entries(keywords)) {
    if (normalized.includes(keyword)) {
      return industryId;
    }
  }

  // No match found
  return null;
}

/**
 * Get all supported industry names (for reference/debugging)
 */
export function getSupportedIndustries(): string[] {
  return Object.keys(INDUSTRY_MAPPING).filter(key => INDUSTRY_MAPPING[key] !== null);
}

