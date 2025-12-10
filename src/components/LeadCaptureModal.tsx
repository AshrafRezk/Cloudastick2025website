import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Building2, Globe, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { industries } from '../data/industries';
import Button from './Button';

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: { companyName: string; industry: string }) => void;
  title?: string;
  subtitle?: string;
}

const LeadCaptureModal: React.FC<LeadCaptureModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  title = "Get Your Personalized Analysis",
  subtitle = "Tell us about your company to receive a customized comparison report"
}) => {
  const { t, isRTL } = useLanguage();
  const [companyName, setCompanyName] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [showIndustrySelector, setShowIndustrySelector] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ companyName?: string; industry?: string }>({});

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setCompanyName('');
      setSelectedIndustry('');
      setShowIndustrySelector(false);
      setErrors({});
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors: { companyName?: string; industry?: string } = {};
    
    if (!companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    
    if (!selectedIndustry) {
      newErrors.industry = 'Please select an industry';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Log company name to Netlify
      try {
        await fetch('/.netlify/functions/logCompanyName', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            companyName: companyName.trim(),
            industry: selectedIndustry,
            source: 'lead-capture-modal',
          }),
        });
      } catch (logError) {
        // Don't block form submission if logging fails
        console.warn('Failed to log company name:', logError);
      }
      
      // Call success callback
      onSuccess({
        companyName: companyName.trim(),
        industry: selectedIndustry
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedIndustryData = selectedIndustry ? industries.find(i => i.id === selectedIndustry) : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative bg-gray-900 rounded-2xl border border-gray-700 w-full max-w-md mx-auto"
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <div>
                <h2 className="text-2xl font-bold text-white">{title}</h2>
                <p className="text-gray-400 text-sm mt-1">{subtitle}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Company Name *
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 ${
                      errors.companyName ? 'border-red-500' : 'border-gray-600'
                    }`}
                    placeholder="Enter your company name"
                  />
                </div>
                {errors.companyName && (
                  <p className="text-red-400 text-sm mt-1">{errors.companyName}</p>
                )}
              </div>

              {/* Industry Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Industry *
                </label>
                {!showIndustrySelector ? (
                  <button
                    type="button"
                    onClick={() => setShowIndustrySelector(true)}
                    className={`w-full flex items-center justify-between p-3 bg-gray-800 border rounded-lg text-left transition-all duration-200 hover:bg-gray-700 ${
                      errors.industry ? 'border-red-500' : 'border-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {selectedIndustryData ? (
                        <>
                          <selectedIndustryData.icon className="w-5 h-5 text-cyan-400" />
                          <span className="text-white">{selectedIndustryData.name}</span>
                        </>
                      ) : (
                        <>
                          <Globe className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-400">Select your industry</span>
                        </>
                      )}
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </button>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {industries.slice(0, 8).map((industry) => (
                      <button
                        key={industry.id}
                        type="button"
                        onClick={() => {
                          setSelectedIndustry(industry.id);
                          setShowIndustrySelector(false);
                        }}
                        className="w-full flex items-center gap-3 p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200 text-left"
                      >
                        <industry.icon className="w-5 h-5 text-cyan-400" />
                        <div>
                          <div className="text-white font-medium">{industry.name}</div>
                          <div className="text-gray-400 text-sm">{industry.description.split('.')[0]}.</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {errors.industry && (
                  <p className="text-red-400 text-sm mt-1">{errors.industry}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Getting Your Analysis...
                  </>
                ) : (
                  <>
                    Get My Analysis
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Footer */}
            <div className="px-6 pb-6">
              <p className="text-xs text-gray-500 text-center">
                By submitting, you agree to receive personalized insights and updates about Salesforce solutions.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LeadCaptureModal;
