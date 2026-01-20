import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { normalizeWebsiteUrl } from '../utils/urlNormalizer';

interface CompanyLogoProps {
  logoUrl: string | null;
  companyName?: string;
  website?: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  showFallback?: boolean;
}

// Cloudastick logo as default fallback
const CLOUDASTICK_LOGO = '/Assets/Company Logos/white-logo-dark.webp';

const CompanyLogo: React.FC<CompanyLogoProps> = ({
  logoUrl,
  companyName = 'Company',
  website,
  size = 'medium',
  className = '',
  showFallback = true
}) => {
  const [errorCount, setErrorCount] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Reset states when logoUrl or website changes
  useEffect(() => {
    setErrorCount(0);
    setImageLoaded(false);
  }, [logoUrl, website]);

  // Size configurations
  const sizeConfig = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-24 h-24'
  };

  // Determine logo candidates
  const getCandidates = () => {
    const candidates: string[] = [];

    // 1. Provided logo URL (highest priority)
    if (logoUrl) {
      candidates.push(logoUrl);
    }

    // 2. Google Favicon (fallback if website provided)
    if (website) {
      const { domain } = normalizeWebsiteUrl(website);
      if (domain) {
        candidates.push(`https://www.google.com/s2/favicons?domain=${domain}&sz=64`);
      }
    }

    // 3. Cloudastick Logo (ultimate fallback)
    if (showFallback) {
      candidates.push(CLOUDASTICK_LOGO);
    }

    return candidates;
  };

  const candidates = getCandidates();
  // Get current source based on error count. If we run out of candidates, use the last one (safe fallback)
  const displayLogo = candidates[Math.min(errorCount, candidates.length - 1)] || CLOUDASTICK_LOGO;

  // Check if we are showing the fallback (only relevant if we are at the last candidate and it's the cloudastick logo)
  const isFallback = displayLogo === CLOUDASTICK_LOGO;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: imageLoaded ? 1 : 0, scale: imageLoaded ? 1 : 0.8 }}
      transition={{ duration: 0.3 }}
      className={`${sizeConfig[size]} ${className} relative`}
    >
      <img
        src={displayLogo}
        alt={`${companyName} logo`}
        className="w-full h-full object-contain rounded-lg"
        onLoad={() => setImageLoaded(true)}
        onError={() => {
          // Move to next candidate
          if (errorCount < candidates.length - 1) {
            setErrorCount(prev => prev + 1);
            setImageLoaded(false); // Reset loaded state for new image
          }
        }}
        loading="lazy"
      />

      {/* Loading placeholder */}
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gray-700/50 rounded-lg animate-pulse flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </motion.div>
  );
};

export default CompanyLogo;
