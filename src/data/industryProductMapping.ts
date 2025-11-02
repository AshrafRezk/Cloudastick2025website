// Industry to Product Mapping for Smart Recommendations

export interface ProductRecommendation {
  productId: string;
  productName: string;
  productPath: string;
  message: string;
  icon: string;
  priority: number; // 1 = highest priority
}

export interface IndustryMapping {
  id: string;
  names: string[]; // Common industry names/aliases
  keywords: string[]; // Keywords to detect in industry descriptions
  recommendedProduct: ProductRecommendation | null;
  salesforceConfig?: {
    primaryCloud: string[];
    keyFeatures: string[];
  };
}

export const industryMappings: IndustryMapping[] = [
  {
    id: 'real-estate',
    names: ['Real Estate', 'Property Management', 'Realty', 'Property Development'],
    keywords: ['real estate', 'property', 'realty', 'housing', 'residential', 'commercial property', 'estate'],
    recommendedProduct: {
      productId: 'cityscape',
      productName: 'Cityscape',
      productPath: '/cityscape',
      message: '✨ Cityscape is specifically built for real estate companies like yours! It offers tailored lead capturing, property management, and sales automation designed for the real estate industry.',
      icon: '🏙️',
      priority: 1
    },
    salesforceConfig: {
      primaryCloud: ['Sales Cloud', 'Experience Cloud'],
      keyFeatures: ['Property Management', 'Lead Capture', 'Customer Portal', 'Mobile Access']
    }
  },
  {
    id: 'construction',
    names: ['Construction', 'Architecture', 'Engineering', 'Building', 'Contracting'],
    keywords: ['construction', 'architect', 'building', 'contractor', 'engineering', 'infrastructure', 'civil'],
    recommendedProduct: {
      productId: 'memar',
      productName: 'Memar',
      productPath: '/memar',
      message: '🏗️ Memar is tailored for construction and architecture firms! It provides project management, bid tracking, and contractor collaboration tools specific to your industry.',
      icon: '🏗️',
      priority: 1
    },
    salesforceConfig: {
      primaryCloud: ['Sales Cloud', 'Service Cloud', 'Experience Cloud'],
      keyFeatures: ['Project Management', 'Bid Management', 'Contractor Portal', 'Document Management']
    }
  },
  {
    id: 'insurance',
    names: ['Insurance', 'Insurance Services', 'Life Insurance', 'Health Insurance', 'Property Insurance'],
    keywords: ['insurance', 'underwriting', 'claims', 'policy', 'actuarial', 'reinsurance'],
    recommendedProduct: null,
    salesforceConfig: {
      primaryCloud: ['Financial Services Cloud', 'Sales Cloud', 'Service Cloud'],
      keyFeatures: ['Policy Management', 'Claims Processing', 'Agent Portal', 'Customer Service']
    }
  },
  {
    id: 'manufacturing',
    names: ['Manufacturing', 'Industrial', 'Production', 'Factory'],
    keywords: ['manufacturing', 'industrial', 'production', 'factory', 'assembly', 'fabrication'],
    recommendedProduct: null,
    salesforceConfig: {
      primaryCloud: ['Manufacturing Cloud', 'Sales Cloud', 'Service Cloud'],
      keyFeatures: ['Sales Agreements', 'Forecasting', 'Supply Chain', 'B2B Commerce']
    }
  },
  {
    id: 'travel-tourism',
    names: ['Travel', 'Tourism', 'Hospitality', 'Hotel', 'Resort', 'Travel Agency'],
    keywords: ['travel', 'tourism', 'hospitality', 'hotel', 'resort', 'booking', 'vacation', 'tour'],
    recommendedProduct: null,
    salesforceConfig: {
      primaryCloud: ['Sales Cloud', 'Service Cloud', 'Marketing Cloud'],
      keyFeatures: ['Booking Management', 'Customer Experience', 'Loyalty Programs', 'Guest Services']
    }
  },
  {
    id: 'education',
    names: ['Education', 'School', 'University', 'College', 'E-learning', 'Training'],
    keywords: ['education', 'school', 'university', 'college', 'learning', 'academic', 'student', 'training'],
    recommendedProduct: null,
    salesforceConfig: {
      primaryCloud: ['Education Cloud', 'Experience Cloud'],
      keyFeatures: ['Student Management', 'Admissions', 'Alumni Relations', 'Fundraising']
    }
  },
  {
    id: 'retail',
    names: ['Retail', 'E-commerce', 'Shopping', 'Store'],
    keywords: ['retail', 'ecommerce', 'e-commerce', 'shopping', 'store', 'merchant', 'consumer goods'],
    recommendedProduct: null,
    salesforceConfig: {
      primaryCloud: ['Commerce Cloud', 'Marketing Cloud', 'Service Cloud'],
      keyFeatures: ['Order Management', 'Personalization', 'Inventory', 'Customer Service']
    }
  },
  {
    id: 'healthcare',
    names: ['Healthcare', 'Medical', 'Hospital', 'Clinic', 'Pharmaceutical'],
    keywords: ['healthcare', 'medical', 'hospital', 'clinic', 'pharmaceutical', 'health', 'patient', 'doctor'],
    recommendedProduct: null,
    salesforceConfig: {
      primaryCloud: ['Health Cloud', 'Service Cloud'],
      keyFeatures: ['Patient Management', 'Care Coordination', 'Telehealth', 'Provider Relations']
    }
  },
  {
    id: 'finance',
    names: ['Finance', 'Banking', 'FinTech', 'Financial Services', 'Investment'],
    keywords: ['finance', 'banking', 'fintech', 'financial', 'investment', 'wealth', 'asset management'],
    recommendedProduct: null,
    salesforceConfig: {
      primaryCloud: ['Financial Services Cloud', 'Sales Cloud'],
      keyFeatures: ['Relationship Management', 'Wealth Management', 'Advisory', 'Compliance']
    }
  },
  {
    id: 'other',
    names: ['Other', 'General', 'Unknown'],
    keywords: [],
    recommendedProduct: null,
    salesforceConfig: {
      primaryCloud: ['Sales Cloud', 'Service Cloud'],
      keyFeatures: ['CRM', 'Sales Automation', 'Customer Service', 'Analytics']
    }
  }
];

/**
 * Get product recommendation based on normalized industry ID
 */
export const getProductRecommendation = (normalizedIndustry: string): ProductRecommendation | null => {
  const mapping = industryMappings.find(m => m.id === normalizedIndustry);
  return mapping?.recommendedProduct || null;
};

/**
 * Get industry mapping by ID
 */
export const getIndustryMapping = (normalizedIndustry: string): IndustryMapping | null => {
  return industryMappings.find(m => m.id === normalizedIndustry) || null;
};

/**
 * Normalize industry string to our standard IDs
 */
export const normalizeIndustry = (industryText: string): string => {
  if (!industryText) return 'other';
  
  const lowerIndustry = industryText.toLowerCase();
  
  for (const mapping of industryMappings) {
    // Check if any keyword matches
    if (mapping.keywords.some(keyword => lowerIndustry.includes(keyword))) {
      return mapping.id;
    }
  }
  
  return 'other';
};

/**
 * Get Salesforce configuration recommendations for an industry
 */
export const getSalesforceConfig = (normalizedIndustry: string) => {
  const mapping = getIndustryMapping(normalizedIndustry);
  return mapping?.salesforceConfig || industryMappings.find(m => m.id === 'other')?.salesforceConfig;
};

