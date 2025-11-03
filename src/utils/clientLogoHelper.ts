// Helper to get client logo path

/**
 * Map industry names to their logo file equivalents
 */
const industryMapping: { [key: string]: string } = {
  'Real Estate & Construction': 'Real Estate',
  'Travel & Hospitality': 'Traveling & Hospitality',
  'Traveling & Hospitality': 'Traveling & Hospitality',
  'Construction': 'Construction',
  'Manufacturing': 'Manufacturing',
  'Healthcare': 'Healthcare',
  'Education': 'Education',
  'Professional Services': 'Professional Services',
  'eCommerce': 'eCommerce',
  'Fintech': 'Fintech',
  'Non-profit': 'Non-profit',
  'Automotive': 'Automotive',
  'Brokerage': 'Brokerage',
  'Law': 'Law',
  'Real Esate': 'Real Esate', // Note: keeping the typo as it exists in filenames
};

/**
 * Get logo path for a client
 * Logo files are named: "CompanyName - Industry.png"
 */
export const getClientLogoPath = (clientName: string, industry: string): string => {
  // Map the industry to the filename convention
  const mappedIndustry = industryMapping[industry] || industry;
  
  // Construct the path based on naming convention
  const logoPath = `/Assets/Customers-Logos-Website/${clientName} - ${mappedIndustry}.png`;
  return logoPath;
};

/**
 * Handle logo load error with fallback
 */
export const handleLogoError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  // Fallback to placeholder or hide
  e.currentTarget.style.display = 'none';
};

