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
    onSuccess?: () => void;
    isGatekeeper?: boolean;
}

const PasswordModal: React.FC<PasswordModalProps> = ({ isOpen, onClose, onSuccess, isGatekeeper = false }) => {
    const [inputPassword, setInputPassword] = useState("");
    const [error, setError] = useState(false);
    const correctPassword = "Salesforce#$PW3R";

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputPassword === correctPassword) {
            setError(false);
            if (onSuccess) onSuccess();
            onClose();
        } else {
            setError(true);
            // Shake effect or feedback
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={isGatekeeper ? () => { } : onClose}>
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
                            {isGatekeeper
                                ? "Enter the password to access the Salesforce Power Environment"
                                : "The Salesforce Power Environment is password protected"}
                        </p>

                        {/* Password Input */}
                        <form onSubmit={handleSubmit} className="w-full space-y-4">
                            <div className="relative group">
                                <div className={`absolute inset-0 bg-gradient-to-r ${error ? 'from-red-500/20 to-orange-500/20' : 'from-blue-500/20 to-purple-500/20'} blur-lg transition-opacity duration-300 opacity-0 group-hover:opacity-100`} />
                                <div className={`relative flex items-center gap-3 p-4 bg-white/5 border ${error ? 'border-red-500/50' : 'border-white/10'} rounded-2xl backdrop-blur-md overflow-hidden transition-all duration-300 group-hover:border-white/20`}>
                                    <Key className="w-5 h-5 text-blue-400 flex-shrink-0" />
                                    <input
                                        type="password"
                                        value={inputPassword}
                                        onChange={(e) => {
                                            setInputPassword(e.target.value);
                                            if (error) setError(false);
                                        }}
                                        placeholder="Enter password..."
                                        className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-gray-500 font-mono tracking-wider"
                                        autoFocus
                                    />
                                </div>
                                {error && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-red-400 text-xs mt-2 text-left ml-2"
                                    >
                                        Incorrect password. Please try again.
                                    </motion.p>
                                )}
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-[0_10px_20px_rgba(37,99,235,0.2)]"
                            >
                                Unlock Environment
                            </motion.button>
                        </form>

                        <p className="mt-8 text-[10px] text-gray-500 uppercase tracking-[0.2em]">
                            Cloudastick Systems Security Protocol
                        </p>
                    </div>

                    {/* Close Button - Only show if not gatekeeper */}
                    {!isGatekeeper && (
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default PasswordModal;
