import React, { useState, useEffect, useMemo } from 'react';
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

const CompanyLogo: React.FC<CompanyLogoProps> = ({
  logoUrl,
  companyName = 'Company',
  website,
  size = 'medium',
  className = '',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  showFallback = true
}) => {
  const [errorCount, setErrorCount] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Reset states when logoUrl or website changes
  useEffect(() => {
    setErrorCount(0);
    setImageLoaded(false);
  }, [logoUrl, website]);

  // Size configurations adding text sizes for the fallback
  const sizeConfig = {
    small: 'w-6 h-6 text-xs',
    medium: 'w-12 h-12 text-lg',
    large: 'w-24 h-24 text-3xl'
  };

  // Determine logo candidates
  const candidates = useMemo(() => {
    const list: string[] = [];

    // 1. Provided logo URL (highest priority)
    if (logoUrl) {
      list.push(logoUrl);
    }

    // 2. Google Favicon (fallback if website provided)
    if (website) {
      const { domain } = normalizeWebsiteUrl(website);
      if (domain) {
        list.push(`https://www.google.com/s2/favicons?domain=${domain}&sz=128`);
      }
    }

    return list;
  }, [logoUrl, website]);

  // Determine if we should show text fallback
  // If we have no candidates, or if we've exhausted all candidates (errorCount >= candidates.length)
  const showTextFallback = candidates.length === 0 || errorCount >= candidates.length;

  // Get current source
  const currentSource = candidates[errorCount];

  // Helper to get initials
  const getInitials = (name: string) => {
    if (!name) return 'CO';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || name.slice(0, 2).toUpperCase();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`${sizeConfig[size]} ${className} relative flex-shrink-0`}
    >
      {!showTextFallback && currentSource ? (
        <>
          {/* Container to center and constrain content */}
          <div className={`w-full h-full flex items-center justify-center ${!imageLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
            <img
              src={currentSource}
              alt={`${companyName} logo`}
              // If it's a google favicon, limit the size to avoid pixelation (e.g. 60% of container)
              // Otherwise fill the container
              className={`${currentSource.includes('google.com/s2/favicons') ? 'w-auto h-auto max-w-[60%] max-h-[60%]' : 'w-full h-full'} object-contain rounded-lg`}
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setErrorCount(prev => prev + 1);
                setImageLoaded(false);
              }}
              loading="lazy"
            />
          </div>

          {/* Loading placeholder */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-700/50 rounded-lg animate-pulse flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </>
      ) : (
        // Text Fallback
        <div className="w-full h-full rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold shadow-lg border border-white/10 select-none">
          {getInitials(companyName)}
        </div>
      )}
    </motion.div>
  );
};

export default CompanyLogo;
