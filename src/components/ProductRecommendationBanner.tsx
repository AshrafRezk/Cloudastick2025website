import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProductRecommendationBannerProps {
  productName: string;
  productPath: string;
  message: string;
  icon: string;
  onDismiss: () => void;
  isVisible: boolean;
}

const ProductRecommendationBanner: React.FC<ProductRecommendationBannerProps> = ({
  productName,
  productPath,
  message,
  icon,
  onDismiss,
  isVisible,
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-4xl px-4"
        >
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-[2px] rounded-xl shadow-2xl">
            <div className="bg-gray-900 rounded-xl p-4 md:p-6 relative">
              {/* Close button */}
              <button
                onClick={onDismiss}
                className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
                aria-label="Dismiss recommendation"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl md:text-4xl shadow-lg">
                    {icon}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                    <h3 className="text-lg md:text-xl font-bold text-white">
                      Perfect Match Found!
                    </h3>
                  </div>
                  
                  <p className="text-gray-300 text-sm md:text-base mb-4 leading-relaxed">
                    {message}
                  </p>

                  <Link
                    to={productPath}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <span>Explore {productName}</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>

              {/* Animated sparkle effects */}
              <div className="absolute -top-1 -left-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping opacity-75" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-pink-400 rounded-full animate-ping opacity-75" style={{ animationDelay: '0.5s' }} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductRecommendationBanner;

