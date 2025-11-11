import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { getCarByModel, carModels } from '../utils/soueastData';
import SoueastCarComparison from '../components/SoueastCarComparison';

const SoueastComparison: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Get selected cars from URL params
  const selectedCarsParam = searchParams.get('cars');
  const selectedCars = useMemo(() => {
    if (!selectedCarsParam) return [];
    return selectedCarsParam.split(',').filter(Boolean);
  }, [selectedCarsParam]);

  const handleBack = () => {
    navigate('/soueast-success');
  };

  const handleVisitWebsite = () => {
    window.open('https://soueastksa.com', '_blank');
  };

  // If no cars selected, show all cars
  const carsToCompare = selectedCars.length >= 2 
    ? selectedCars 
    : carModels.slice(0, 3).map(car => car.model);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                onClick={handleBack}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-slate-700" />
              </motion.button>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                  Car Comparison
                </h1>
                <p className="text-sm text-slate-600 mt-1">
                  Compare your selected Soueast models
                </p>
              </div>
            </div>
            <motion.button
              onClick={handleVisitWebsite}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-gradient-to-r from-[#ee7138] to-[#d85a20] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Visit Website
            </motion.button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Logo and Motto */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="w-32 h-32 mx-auto mb-4 relative">
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.2, 0.3, 0.2],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute inset-0 bg-gradient-to-br from-[#ee7138]/30 to-black/30 rounded-full blur-3xl"
            />
            <div className="w-full h-full bg-white rounded-3xl shadow-2xl flex items-center justify-center p-6 relative z-10">
              <img
                src="/Assets/Customers/Soueast/SoueastLogoTransparent(Black).png"
                alt="Soueast"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
            </div>
          </div>
          <span className="inline-block px-6 py-2 bg-gradient-to-r from-[#ee7138] to-[#d85a20] text-white text-lg font-semibold rounded-full shadow-lg">
            Ease Your Life
          </span>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <SoueastCarComparison
            selectedCarModels={carsToCompare}
            currentLanguage="en"
          />
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div className="bg-gradient-to-r from-[#ee7138] to-[#d85a20] rounded-2xl p-8 text-white shadow-xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Experience Soueast?
            </h2>
            <p className="text-lg mb-6 opacity-90">
              Schedule a test drive or get a personalized quote today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={handleVisitWebsite}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-[#ee7138] font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-5 h-5" />
                Visit Soueast Website
              </motion.button>
              <motion.button
                onClick={handleBack}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white font-semibold rounded-xl border-2 border-white/30 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Success Page
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SoueastComparison;

