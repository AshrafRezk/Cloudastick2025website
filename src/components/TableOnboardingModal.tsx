import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Building2, Briefcase } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { industries } from '../data/industries';

interface TableOnboardingModalProps {
  isOpen: boolean;
  onSubmit: (companyName: string, industryId: string) => void;
  onClose?: () => void;
}

const TableOnboardingModal: React.FC<TableOnboardingModalProps> = ({
  isOpen,
  onSubmit,
  onClose
}) => {
  const { t, isRTL } = useLanguage();
  const [companyName, setCompanyName] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [errors, setErrors] = useState<{ company?: string; industry?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: { company?: string; industry?: string } = {};
    
    if (!companyName.trim()) {
      newErrors.company = t('power.onboarding.required');
    }
    
    if (!selectedIndustry) {
      newErrors.industry = t('power.onboarding.required');
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
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
          source: 'table-onboarding-modal',
        }),
      });
    } catch (logError) {
      // Don't block form submission if logging fails
      console.warn('Failed to log company name:', logError);
    }
    
    // Store in localStorage
    localStorage.setItem('tableOnboarding', JSON.stringify({
      companyName: companyName.trim(),
      industryId: selectedIndustry,
      timestamp: Date.now()
    }));
    
    onSubmit(companyName.trim(), selectedIndustry);
    setErrors({});
  };

  const handleClose = () => {
    setCompanyName('');
    setSelectedIndustry('');
    setErrors({});
    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative w-full max-w-md bg-gray-900 rounded-2xl shadow-2xl border border-gray-700"
          onClick={(e) => e.stopPropagation()}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {t('power.onboarding.title')}
                </h2>
                <p className="text-sm text-gray-400">
                  {t('power.onboarding.subtitle')}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('power.onboarding.companyLabel')}
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder={t('power.onboarding.companyPlaceholder')}
                className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.company ? 'border-red-500' : 'border-gray-600'
                }`}
                dir="ltr"
              />
              {errors.company && (
                <p className="mt-1 text-sm text-red-400">{errors.company}</p>
              )}
            </div>

            {/* Industry Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('power.onboarding.industryLabel')}
              </label>
              <div className="relative">
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors appearance-none ${
                    errors.industry ? 'border-red-500' : 'border-gray-600'
                  }`}
                >
                  <option value="">
                    {t('power.onboarding.industryPlaceholder')}
                  </option>
                  {industries.map((industry) => (
                    <option key={industry.id} value={industry.id}>
                      {industry.name}
                    </option>
                  ))}
                </select>
                <Briefcase className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              {errors.industry && (
                <p className="mt-1 text-sm text-red-400">{errors.industry}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              {t('power.onboarding.submit')}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TableOnboardingModal;
