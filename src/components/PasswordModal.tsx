import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Key, Copy, Check, X, Lock } from 'lucide-react';
import {
    Dialog,
    DialogContent,
} from './ui/dialog';

interface PasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PasswordModal: React.FC<PasswordModalProps> = ({ isOpen, onClose }) => {
    const [copied, setCopied] = useState(false);
    const password = "Salesforce#$PW3R";

    const handleCopy = () => {
        navigator.clipboard.writeText(password);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md bg-gradient-to-br from-[#0B0F1A] via-[#1A1F2E] to-[#0B0F1A] border border-white/10 text-white p-0 overflow-hidden rounded-3xl backdrop-blur-2xl">
                <div className="relative p-8">
                    {/* Animated Background Glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-blue-500/20 blur-[80px] rounded-full pointer-events-none" />

                    <div className="flex flex-col items-center text-center">
                        {/* Header Icon */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", damping: 15, stiffness: 200 }}
                            className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.15)]"
                        >
                            <Shield className="w-8 h-8 text-blue-400" />
                        </motion.div>

                        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                            <Lock className="w-5 h-5 text-gray-400" />
                            Secure Access
                        </h2>
                        <p className="text-gray-400 text-sm mb-8">
                            Use the following credentials to access the Salesforce Power Environment
                        </p>

                        {/* Password Container */}
                        <div className="w-full relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-lg transition-opacity duration-300 opacity-0 group-hover:opacity-100" />
                            <div className="relative flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md overflow-hidden transition-all duration-300 group-hover:border-white/20">
                                <Key className="w-5 h-5 text-blue-400 flex-shrink-0" />
                                <code className="flex-1 text-lg font-mono font-bold tracking-wider text-white select-all">
                                    {password}
                                </code>
                                <button
                                    onClick={handleCopy}
                                    className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-200 group/btn active:scale-95"
                                    title="Copy password"
                                >
                                    <AnimatePresence mode="wait">
                                        {copied ? (
                                            <motion.div
                                                key="check"
                                                initial={{ opacity: 0, scale: 0.5 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.5 }}
                                            >
                                                <Check className="w-4 h-4 text-green-400" />
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="copy"
                                                initial={{ opacity: 0, scale: 0.5 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.5 }}
                                            >
                                                <Copy className="w-4 h-4 text-gray-400 group-hover/btn:text-white" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </button>
                            </div>
                        </div>

                        <p className="mt-8 text-[10px] text-gray-500 uppercase tracking-[0.2em]">
                            Cloudastick Systems Security Protocol
                        </p>
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default PasswordModal;
