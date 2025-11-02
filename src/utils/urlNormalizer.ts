// URL Normalization Utility

/**
 * Normalize website URL for display and API calls
 * Handles various user input formats
 */
export const normalizeWebsiteUrl = (input: string): {
  display: string;      // For showing in input field (e.g., "cloudastick.com")
  domain: string;       // For API calls (e.g., "cloudastick.com")
  fullUrl: string;      // Full URL with protocol (e.g., "https://www.cloudastick.com")
} => {
  if (!input || !input.trim()) {
    return { display: '', domain: '', fullUrl: '' };
  }

  let cleaned = input.trim().toLowerCase();

  // Remove protocol if present
  cleaned = cleaned.replace(/^https?:\/\//, '');
  
  // Remove www. if present (we'll add it back in fullUrl)
  const hadWww = cleaned.startsWith('www.');
  cleaned = cleaned.replace(/^www\./, '');
  
  // Remove trailing slashes and paths
  cleaned = cleaned.split('/')[0];
  
  // Remove trailing dots
  cleaned = cleaned.replace(/\.+$/, '');

  // Basic validation - should have at least one dot (domain.extension)
  if (!cleaned.includes('.')) {
    // Invalid domain, return as-is
    return { display: cleaned, domain: cleaned, fullUrl: '' };
  }

  return {
    display: cleaned,                    // cloudastick.com
    domain: cleaned,                     // cloudastick.com
    fullUrl: `https://www.${cleaned}`    // https://www.cloudastick.com
  };
};

/**
 * Format URL for logo fetching
 * Some logo services prefer with or without www
 */
export const formatForLogoFetch = (url: string): string => {
  const normalized = normalizeWebsiteUrl(url);
  return normalized.domain; // Return clean domain without protocol or www
};

/**
 * Format URL for company enrichment
 */
export const formatForEnrichment = (url: string): string => {
  const normalized = normalizeWebsiteUrl(url);
  return normalized.domain; // Return clean domain
};

/**
 * Validate if input looks like a valid domain
 */
export const isValidDomain = (input: string): boolean => {
  if (!input || !input.trim()) return false;
  
  const normalized = normalizeWebsiteUrl(input);
  
  // Basic validation
  const domainPattern = /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,}$/i;
  return domainPattern.test(normalized.domain);
};

/**
 * Examples:
 * normalizeWebsiteUrl("cloudastick.com") → { display: "cloudastick.com", domain: "cloudastick.com", fullUrl: "https://www.cloudastick.com" }
 * normalizeWebsiteUrl("cloudastick.org") → { display: "cloudastick.org", domain: "cloudastick.org", fullUrl: "https://www.cloudastick.org" }
 * normalizeWebsiteUrl("https://www.cloudastick.com") → { display: "cloudastick.com", domain: "cloudastick.com", fullUrl: "https://www.cloudastick.com" }
 * normalizeWebsiteUrl("www.cloudastick.com/about") → { display: "cloudastick.com", domain: "cloudastick.com", fullUrl: "https://www.cloudastick.com" }
 * normalizeWebsiteUrl("HTTP://CLOUDASTICK.COM/") → { display: "cloudastick.com", domain: "cloudastick.com", fullUrl: "https://www.cloudastick.com" }
 * normalizeWebsiteUrl("emaar.ae") → { display: "emaar.ae", domain: "emaar.ae", fullUrl: "https://www.emaar.ae" }
 */

