import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Layers,
    ChevronUp,
    X,
    CheckCircle2,
    Building2,
    ArrowRight
} from 'lucide-react';
import { Button } from './ui/button';
import { industries } from '../data/industries';

interface ScopeBuilderFabProps {
    selectedVerticalId: string | null;
    selectedModuleCount: number;
    onVerticalChange: (verticalId: string) => void;
    onScrollToModules: () => void;
}

const ScopeBuilderFab = ({
    selectedVerticalId,
    selectedModuleCount,
    onVerticalChange,
    onScrollToModules
}: ScopeBuilderFabProps) => {
    const [isOpen, setIsOpen] = useState(false);

    // Get current vertical name
    const currentVerticalName = industries.find(i => i.id === selectedVerticalId)?.name || 'Select Industry';

    return (
        <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end pointer-events-none">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="mb-4 bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-2xl shadow-2xl p-4 w-72 pointer-events-auto"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-white font-semibold">Scope Builder</h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Vertical Selector */}
                            <div>
                                <label className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2 block">
                                    Target Industry
                                </label>
                                <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-700">
                                    {industries.map((industry) => (
                                        <button
                                            key={industry.id}
                                            onClick={() => {
                                                onVerticalChange(industry.id);
                                                // Don't close, let them see the change
                                            }}
                                            className={`flex items-center gap-2 p-2 rounded-lg text-sm transition-colors text-left ${selectedVerticalId === industry.id
                                                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                                                    : 'hover:bg-gray-800 text-gray-300 border border-transparent'
                                                }`}
                                        >
                                            <Building2 className="w-4 h-4 shrink-0" />
                                            <span className="truncate">{industry.name}</span>
                                            {selectedVerticalId === industry.id && (
                                                <CheckCircle2 className="w-3 h-3 ml-auto" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Stats & Action */}
                            <div className="pt-3 border-t border-gray-700">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-gray-400 text-sm">Selected Modules</span>
                                    <span className="text-white font-bold bg-gray-800 px-2 py-0.5 rounded-full text-xs">
                                        {selectedModuleCount}
                                    </span>
                                </div>
                                <Button
                                    onClick={() => {
                                        setIsOpen(false);
                                        onScrollToModules();
                                    }}
                                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                                >
                                    <Layers className="w-4 h-4 mr-2" />
                                    Edit Modules
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={`pointer-events-auto flex items-center gap-3 pl-4 pr-3 py-3 rounded-full shadow-lg border backdrop-blur-sm transition-all shadow-cyan-500/10 ${isOpen
                        ? 'bg-gray-800 border-cyan-500 text-white'
                        : 'bg-gray-900/90 border-gray-700 text-gray-200 hover:border-cyan-500/50'
                    }`}
            >
                <div className="flex flex-col items-start mr-1">
                    <span className="text-xs text-gray-400 font-medium">Building Scope for</span>
                    <span className="text-sm font-bold text-cyan-400">{currentVerticalName}</span>
                </div>

                <div className="relative">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-cyan-500 text-white' : 'bg-gray-800 text-cyan-400'
                        }`}>
                        {isOpen ? <ChevronUp className="w-5 h-5" /> : <Layers className="w-5 h-5" />}
                    </div>
                    {selectedModuleCount > 0 && !isOpen && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-gray-900">
                            {selectedModuleCount}
                        </span>
                    )}
                </div>
            </motion.button>
        </div>
    );
};

export default ScopeBuilderFab;
