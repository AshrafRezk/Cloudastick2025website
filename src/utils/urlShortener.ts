// URL Shortener Utility for Company Intelligence Data

interface CompanyShareData {
  cn?: string; // companyName
  cw?: string; // companyWebsite
  i?: string;  // industry
  l?: string;  // language
}

/**
 * Generate a short URL code from company data
 */
export const generateShortCode = (data: {
  companyName?: string;
  companyWebsite?: string;
  industry?: string;
  language: string;
}): string => {
  // Create compact object with abbreviated keys
  const compact: CompanyShareData = {
    l: data.language,
  };
  
  if (data.industry) compact.i = data.industry;
  if (data.companyName) compact.cn = data.companyName;
  if (data.companyWebsite) compact.cw = data.companyWebsite;
  
  // Convert to JSON and encode to base64
  const json = JSON.stringify(compact);
  const base64 = btoa(encodeURIComponent(json));
  
  // Make it URL-safe
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

/**
 * Decode a short URL code back to company data
 */
export const decodeShortCode = (code: string): {
  companyName?: string;
  companyWebsite?: string;
  industry?: string;
  language: string;
} | null => {
  try {
    // Restore base64 format
    let base64 = code.replace(/-/g, '+').replace(/_/g, '/');
    
    // Add padding if needed
    while (base64.length % 4) {
      base64 += '=';
    }
    
    // Decode
    const json = decodeURIComponent(atob(base64));
    const compact: CompanyShareData = JSON.parse(json);
    
    // Expand back to full names
    return {
      language: compact.l || 'en',
      industry: compact.i,
      companyName: compact.cn,
      companyWebsite: compact.cw,
    };
  } catch (error) {
    console.error('Failed to decode short code:', error);
    return null;
  }
};

/**
 * Check if URL has a short code parameter
 */
export const hasShortCode = (searchParams: URLSearchParams): boolean => {
  return searchParams.has('s');
};

/**
 * Get short code from URL parameters
 */
export const getShortCode = (searchParams: URLSearchParams): string | null => {
  return searchParams.get('s');
};

