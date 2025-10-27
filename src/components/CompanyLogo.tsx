import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface CompanyLogoProps {
  logoUrl: string | null;
  companyName?: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  showFallback?: boolean;
}

const CompanyLogo: React.FC<CompanyLogoProps> = ({
  logoUrl,
  companyName = 'Company',
  size = 'medium',
  className = '',
  showFallback = false
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Size configurations
  const sizeConfig = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12',
    large: 'w-24 h-24'
  };

  // Don't render if no logo URL or image failed to load
  if (!logoUrl || imageError) {
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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: imageLoaded ? 1 : 0, scale: imageLoaded ? 1 : 0.8 }}
      transition={{ duration: 0.3 }}
      className={`${sizeConfig[size]} ${className} relative`}
    >
      <img
        src={logoUrl}
        alt={`${companyName} logo`}
        className="w-full h-full object-contain rounded-lg"
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
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
