// Helper to get client logo path

/**
 * Get logo path for a client
 * Logo files are named: "CompanyName - Industry.png"
 */
export const getClientLogoPath = (clientName: string, industry: string): string => {
  // Construct the path based on naming convention
  const logoPath = `/Assets/Customers-Logos-Website/${clientName} - ${industry}.png`;
  return logoPath;
};

/**
 * Handle logo load error with fallback
 */
export const handleLogoError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  // Fallback to placeholder or hide
  e.currentTarget.style.display = 'none';
};

