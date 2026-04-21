import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquare, DollarSign, Clock, Star, PlayCircle, Send } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Button from './Button';

interface OpportunityFeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (feedback: {
        budget: string;
        timeline: string;
        satisfaction: string;
        needDemo: boolean;
        engagementRating: number;
        demoFeedback: string;
    }) => void;
    onSuccess?: () => void;
}

const OpportunityFeedbackModal: React.FC<OpportunityFeedbackModalProps> = ({
    isOpen,
    onClose,
    onSubmit,
    onSuccess
}) => {
    const { isRTL } = useLanguage();
    const [budget, setBudget] = useState('');
    const [timeline, setTimeline] = useState('');
    const [satisfaction, setSatisfaction] = useState('Satisfied');
    const [needDemo, setNeedDemo] = useState(false);
    const [engagementRating, setEngagementRating] = useState(0);
    const [demoFeedback, setDemoFeedback] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        onSubmit({
            budget,
            timeline,
            satisfaction,
            needDemo,
            engagementRating,
            demoFeedback
        });

        // Trigger success callback immediately to avoid popup blockers
        if (onSuccess) onSuccess();

        setTimeout(() => {
            setIsSubmitting(false);
            onClose();
        }, 800);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
                        dir={isRTL ? 'rtl' : 'ltr'}
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-gray-800 flex items-center justify-between bg-gradient-to-r from-blue-900/20 to-purple-900/20">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                                    <MessageSquare className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white">Rate Your Engagement</h2>
                                    <p className="text-xs text-gray-400">Help us tailor the perfect solution for you</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[80vh]">
                            {/* Engagement Rating */}
                            <div className="space-y-3 p-4 bg-blue-600/10 border border-blue-500/20 rounded-xl">
                                <label className="text-sm font-bold text-blue-300 flex items-center gap-2">
                                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                    How much did you like the engagement?
                                </label>
                                <div className="flex gap-3 justify-center py-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setEngagementRating(star)}
                                            className="transition-transform hover:scale-125 focus:outline-none"
                                        >
                                            <Star
                                                className={`w-8 h-8 ${star <= engagementRating
                                                    ? 'text-yellow-400 fill-yellow-400'
                                                    : 'text-gray-600'
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Demo Feedback */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                    <PlayCircle className="w-4 h-4 text-red-400" />
                                    If there was a demo, how was it?
                                </label>
                                <textarea
                                    value={demoFeedback}
                                    onChange={(e) => setDemoFeedback(e.target.value)}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none min-h-[80px]"
                                    placeholder="Tell us your thoughts about the demo experience..."
                                />
                            </div>

                            {/* Budget */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-green-400" />
                                    Pricing & Budget Expectations
                                </label>
                                <textarea
                                    value={budget}
                                    onChange={(e) => setBudget(e.target.value)}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none min-h-[60px]"
                                    placeholder="Your budget expectations..."
                                />
                            </div>

                            {/* Timeline */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-purple-400" />
                                    Desired Timeline
                                </label>
                                <textarea
                                    value={timeline}
                                    onChange={(e) => setTimeline(e.target.value)}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none min-h-[60px]"
                                    placeholder="When are you looking to implement?"
                                />
                            </div>

                            {/* Satisfaction & Demo */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                        <Star className="w-4 h-4 text-yellow-400" />
                                        Overall Satisfaction
                                    </label>
                                    <select
                                        value={satisfaction}
                                        onChange={(e) => setSatisfaction(e.target.value)}
                                        className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    >
                                        <option>Very Satisfied</option>
                                        <option>Satisfied</option>
                                        <option>Neutral</option>
                                        <option>Unsatisfied</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                        <PlayCircle className="w-4 h-4 text-red-400" />
                                        Need another demo?
                                    </label>
                                    <label className="flex items-center gap-3 p-3 bg-gray-800 border border-gray-700 rounded-xl cursor-pointer hover:bg-gray-750 transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={needDemo}
                                            onChange={(e) => setNeedDemo(e.target.checked)}
                                            className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-offset-gray-900"
                                        />
                                        <span className="text-sm text-gray-300">Yes, please!</span>
                                    </label>
                                </div>
                            </div>

                             {/* Submit Button */}
                            <div className="pt-2 space-y-3">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting || engagementRating === 0}
                                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:grayscale"
                                >
                                    {isSubmitting ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            Submit Feedbacks
                                            <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </>
                                    )}
                                </Button>
                                
                                {!isSubmitting && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (onSuccess) onSuccess();
                                            onClose();
                                        }}
                                        className="w-full py-3 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all flex items-center justify-center gap-2"
                                    >
                                        Skip and download proposal
                                    </button>
                                )}

                                {engagementRating === 0 && (
                                    <p className="text-[10px] text-center text-gray-500 mt-2 italic">Please select a rating to enable submission</p>
                                )}
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default OpportunityFeedbackModal;
