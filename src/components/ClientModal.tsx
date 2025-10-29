import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Building2, Globe, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { ClientInfo } from '../data/clientsData';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: ClientInfo | null;
}

const ClientModal: React.FC<ClientModalProps> = ({ isOpen, onClose, client }) => {
  if (!client) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 text-white">
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-cyan-400">
              {client.name}
            </DialogTitle>
          </div>
          
          {/* Client Logo and Industry */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center">
              <Building2 className="w-8 h-8 text-cyan-400" />
            </div>
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30">
                <span className="text-sm font-medium text-cyan-300">
                  {client.industry}
                </span>
              </div>
            </div>
          </div>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Business Description */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">About {client.name}</h3>
            <p className="text-gray-300 leading-relaxed">
              {client.description}
            </p>
          </div>

          {/* Website Link */}
          {client.websiteUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="pt-4 border-t border-gray-700"
            >
              <a
                href={client.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/25"
              >
                <Globe className="w-4 h-4" />
                <span>Visit Website</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </motion.div>
          )}

          {/* Partnership Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="pt-4 border-t border-gray-700"
          >
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
              <span>Trusted Cloudastick Partner</span>
            </div>
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default ClientModal;
