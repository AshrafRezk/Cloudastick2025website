/**
 * Logo Service for fetching company logos from various APIs
 */

export interface LogoServiceResponse {
  logoUrl: string | null;
  source: 'clearbit' | 'brandfetch' | 'fallback' | null;
  error?: string;
}

/**
 * Extract domain from website URL
 */
export const extractDomain = (website: string): string | null => {
  try {
    // Remove protocol if present
    let domain = website.replace(/^https?:\/\//, '');
    
    // Remove www. if present
    domain = domain.replace(/^www\./, '');
    
    // Remove trailing slash and path
    domain = domain.split('/')[0];
    
    // Basic domain validation
    if (domain && domain.includes('.') && !domain.includes(' ')) {
      return domain;
    }
    
    return null;
  } catch (error) {
    console.error('Error extracting domain:', error);
    return null;
  }
};

/**
 * Validate if a URL is a valid image
 */
export const validateImageUrl = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const contentType = response.headers.get('content-type');
    
    return response.ok && contentType?.startsWith('image/') === true;
  } catch (error) {
    console.error('Error validating image URL:', error);
    return false;
  }
};

/**
 * Fetch company logo using multiple services
 */
export const fetchCompanyLogo = async (website: string): Promise<LogoServiceResponse> => {
  const domain = extractDomain(website);
  
  if (!domain) {
    return {
      logoUrl: null,
      source: null,
      error: 'Invalid website URL'
    };
  }

  // Try Clearbit first (free, no auth required)
  try {
    const clearbitUrl = `https://logo.clearbit.com/${domain}`;
    const isValid = await validateImageUrl(clearbitUrl);
    
    if (isValid) {
      return {
        logoUrl: clearbitUrl,
        source: 'clearbit'
      };
    }
  } catch (error) {
    console.warn('Clearbit logo fetch failed:', error);
  }

  // Try Brandfetch as fallback (if API key available)
  try {
    // This would require a Brandfetch API key
    // For now, we'll skip this and use a fallback
    console.log('Brandfetch not implemented yet');
  } catch (error) {
    console.warn('Brandfetch logo fetch failed:', error);
  }

  // Try favicon as last resort
  try {
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    const isValid = await validateImageUrl(faviconUrl);
    
    if (isValid) {
      return {
        logoUrl: faviconUrl,
        source: 'fallback'
      };
    }
  } catch (error) {
    console.warn('Favicon fetch failed:', error);
  }

  return {
    logoUrl: null,
    source: null,
    error: 'No logo found for this domain'
  };
};

/**
 * Format website URL for display
 */
export const formatWebsiteUrl = (website: string): string => {
  if (!website) return '';
  
  // Add https:// if no protocol
  if (!website.startsWith('http://') && !website.startsWith('https://')) {
    return `https://${website}`;
  }
  
  return website;
};
