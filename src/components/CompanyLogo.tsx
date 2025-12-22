import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CompanyLogoProps {
  logoUrl: string | null;
  companyName?: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  showFallback?: boolean;
}

// Cloudastick logo as default fallback
const CLOUDASTICK_LOGO = '/Assets/Company Logos/white-logo-dark.webp';

const CompanyLogo: React.FC<CompanyLogoProps> = ({
  logoUrl,
  companyName = 'Company',
  size = 'medium',
  className = '',
  showFallback = true
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Reset states when logoUrl changes
  useEffect(() => {
    setImageError(false);
    setImageLoaded(false);
  }, [logoUrl]);

  // Size configurations
  const sizeConfig = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-24 h-24'
  };

  // Use Cloudastick logo as fallback if no logo or error
  const displayLogo = (!logoUrl || imageError) ? CLOUDASTICK_LOGO : logoUrl;

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
        onError={() => setImageError(true)}
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
