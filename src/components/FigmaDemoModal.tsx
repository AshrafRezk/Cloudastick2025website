import React, { useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';
import {
  Dialog,
  DialogContent,
} from './ui/dialog';

interface FigmaDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FigmaDemoModal: React.FC<FigmaDemoModalProps> = ({ isOpen, onClose }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasLoadedRef = useRef(false);

  const figmaEmbedUrl = 'https://embed.figma.com/proto/9DYKuegyYCcLdKMlww48BC/Walkthrough?node-id=35-54&p=f&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=35%3A54&embed-host=share';
  const figmaDirectUrl = 'https://www.figma.com/proto/9DYKuegyYCcLdKMlww48BC/Walkthrough?node-id=35-54&p=f&t=lSeN4IWKTxtwfYI1-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=35%3A54';

  const handleRedirect = useCallback(() => {
    window.open(figmaDirectUrl, '_blank', 'noopener,noreferrer');
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      hasLoadedRef.current = false;
      // Set a timeout as a fallback - if iframe doesn't load properly, redirect
      // This handles cases where the iframe shows an error state
      errorTimeoutRef.current = setTimeout(() => {
        // If we reach here and haven't detected successful load, redirect
        if (!hasLoadedRef.current) {
          handleRedirect();
        }
      }, 5000); // Give it 5 seconds to load
    }

    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, [isOpen, handleRedirect]);

  const handleIframeError = useCallback(() => {
    // If iframe fails to load, automatically redirect
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }
    handleRedirect();
  }, [handleRedirect]);

  // Listen for iframe load events
  const handleIframeLoad = useCallback(() => {
    // Mark as loaded successfully
    hasLoadedRef.current = true;
    // Clear the error timeout if iframe loads successfully
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
      errorTimeoutRef.current = null;
    }
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-[95vw] max-h-[95vh] h-[95vh] bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 text-white p-0 overflow-hidden flex flex-col">
        {/* Header with Close Button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
          <h2 className="text-xl font-bold text-cyan-400">Try Demo - Real Estate Walkthrough</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                window.open(figmaDirectUrl, '_blank', 'noopener,noreferrer');
              }}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors duration-200 flex items-center gap-2 text-sm font-medium text-white"
              aria-label="Open in Figma"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Show in Cloudastick's Figma</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200"
              aria-label="Close modal"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Figma Iframe Container */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex-1 w-full relative overflow-hidden"
        >
          <iframe
            ref={iframeRef}
            src={figmaEmbedUrl}
            className="absolute inset-0 w-full h-full border-0"
            style={{ border: '1px solid rgba(0, 0, 0, 0.1)' }}
            allow="fullscreen"
            title="Figma Demo - Real Estate Walkthrough"
            onError={handleIframeError}
            onLoad={handleIframeLoad}
          />
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default FigmaDemoModal;

