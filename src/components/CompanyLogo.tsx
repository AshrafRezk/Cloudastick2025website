import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CompanyLogoProps {
  logoUrl: string | null;
  companyName?: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  showFallback?: boolean;
  /** Domain for Google favicon fallback (e.g., "example.com") */
  domain?: string;
}

// Fixed favicon size for consistent quality
const FAVICON_SIZE = 64;

const CompanyLogo: React.FC<CompanyLogoProps> = ({
  logoUrl,
  companyName = 'Company',
  size = 'medium',
  className = '',
  showFallback = false,
  domain
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [usingFaviconFallback, setUsingFaviconFallback] = useState(false);
  const [faviconError, setFaviconError] = useState(false);

  // Reset states when logoUrl changes
  useEffect(() => {
    setImageError(false);
    setImageLoaded(false);
    setUsingFaviconFallback(false);
    setFaviconError(false);
  }, [logoUrl]);

  // Size configurations
  const sizeConfig = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-24 h-24'
  };

  // Build Google favicon URL
  const faviconUrl = domain 
    ? `https://www.google.com/s2/favicons?sz=${FAVICON_SIZE}&domain=${encodeURIComponent(domain)}`
    : null;

  // Handle primary image error - try favicon fallback
  const handleImageError = () => {
    if (faviconUrl && !usingFaviconFallback) {
      // Try Google favicon as fallback
      setUsingFaviconFallback(true);
      setImageLoaded(false);
    } else {
      setImageError(true);
    }
  };

  // Handle favicon fallback error
  const handleFaviconError = () => {
    setFaviconError(true);
    setImageError(true);
  };

  // Determine current image source
  const currentSrc = usingFaviconFallback ? faviconUrl : logoUrl;

  // Don't render if no logo URL and no favicon fallback, or all sources failed
  if ((!logoUrl && !faviconUrl) || (imageError && (faviconError || !faviconUrl))) {
    if (showFallback) {
      return (
        <div className={`${sizeConfig[size]} ${className} bg-gray-700/50 rounded-lg flex items-center justify-center`}>
          <span className="text-gray-400 text-xs font-medium">
            {companyName.charAt(0).toUpperCase()}
          </span>
        </div>
      );
    }
    return null;
  }

  // If we have no logoUrl but have a domain, try favicon directly
  if (!logoUrl && faviconUrl && !faviconError) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: imageLoaded ? 1 : 0, scale: imageLoaded ? 1 : 0.8 }}
        transition={{ duration: 0.3 }}
        className={`${sizeConfig[size]} ${className} relative`}
      >
        <img
          src={faviconUrl}
          alt={`${companyName} logo`}
          className="w-full h-full object-contain rounded-lg"
          onLoad={() => setImageLoaded(true)}
          onError={handleFaviconError}
          loading="lazy"
        />
        
        {/* Loading placeholder */}
        {!imageLoaded && !faviconError && (
          <div className="absolute inset-0 bg-gray-700/50 rounded-lg animate-pulse flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: imageLoaded ? 1 : 0, scale: imageLoaded ? 1 : 0.8 }}
      transition={{ duration: 0.3 }}
      className={`${sizeConfig[size]} ${className} relative`}
    >
      <img
        src={currentSrc || ''}
        alt={`${companyName} logo`}
        className="w-full h-full object-contain rounded-lg"
        onLoad={() => setImageLoaded(true)}
        onError={usingFaviconFallback ? handleFaviconError : handleImageError}
        loading="lazy"
      />
      
      {/* Loading placeholder */}
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-gray-700/50 rounded-lg animate-pulse flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </motion.div>
  );
};

export default CompanyLogo;
