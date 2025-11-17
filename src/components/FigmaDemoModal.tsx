import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
} from './ui/dialog';

interface FigmaDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FigmaDemoModal: React.FC<FigmaDemoModalProps> = ({ isOpen, onClose }) => {
  const figmaUrl = 'https://www.figma.com/proto/9DYKuegyYCcLdKMlww48BC/Walkthrough?node-id=35-54&p=f&t=CsZvU5HD3uFw94qx-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=35%3A54';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] w-[95vw] max-h-[95vh] h-[95vh] bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 text-white p-0 overflow-hidden flex flex-col">
        {/* Header with Close Button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700 flex-shrink-0">
          <h2 className="text-xl font-bold text-cyan-400">Try Demo - Real Estate Walkthrough</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200"
            aria-label="Close modal"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Figma Iframe Container */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex-1 w-full relative overflow-hidden"
        >
          <iframe
            src={figmaUrl}
            className="absolute inset-0 w-full h-full border-0"
            allow="fullscreen"
            title="Figma Demo - Real Estate Walkthrough"
          />
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default FigmaDemoModal;

