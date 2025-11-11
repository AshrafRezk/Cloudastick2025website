import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Car } from 'lucide-react';
import { CarModel, getCarsWithinBudget } from '../utils/soueastData';

interface SoueastCarSelectorProps {
  budget: number;
  selectedCars: string[];
  onSelectionChange: (selectedCars: string[]) => void;
  currentLanguage: 'en' | 'ar';
  onInteraction?: () => void;
}

const SoueastCarSelector: React.FC<SoueastCarSelectorProps> = ({
  budget,
  selectedCars,
  onSelectionChange,
  currentLanguage,
  onInteraction,
}) => {
  const carsInBudget = getCarsWithinBudget(budget);

  const handleCarToggle = (model: string) => {
    if (onInteraction) {
      onInteraction();
    }
    
    if (selectedCars.includes(model)) {
      onSelectionChange(selectedCars.filter(c => c !== model));
    } else {
      onSelectionChange([...selectedCars, model]);
    }
  };

  const isSelected = (model: string) => selectedCars.includes(model);

  const formatPrice = (price: number): string => {
    return price.toLocaleString('en-US');
  };

  const content = {
    en: {
      title: 'Select Your Preferred Cars',
      subtitle: 'You can select multiple cars you\'re interested in',
      noCars: 'No cars available in your budget. Please increase your budget to see more options.',
      priceBeforeVAT: 'Before VAT',
      selectCar: 'Select',
      deselectCar: 'Deselect',
    },
    ar: {
      title: 'اختر سياراتك المفضلة',
      subtitle: 'يمكنك اختيار عدة سيارات تهتم بها',
      noCars: 'لا توجد سيارات متاحة في ميزانيتك. يرجى زيادة ميزانيتك لرؤية المزيد من الخيارات.',
      priceBeforeVAT: 'قبل الضريبة',
      selectCar: 'اختر',
      deselectCar: 'إلغاء الاختيار',
    },
  };

  const t = content[currentLanguage];

  if (carsInBudget.length === 0) {
    return (
      <div className="w-full">
        <div className="mb-4">
          <h3 className={`text-lg font-bold text-slate-900 mb-1 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
            {t.title}
          </h3>
          <p className={`text-sm text-slate-600 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
            {t.subtitle}
          </p>
        </div>
        <div className="bg-slate-50 rounded-2xl p-8 text-center border border-slate-200">
          <Car className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <p className={`text-slate-600 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
            {t.noCars}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className={`text-lg font-bold text-slate-900 mb-1 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
          {t.title}
        </h3>
        <p className={`text-sm text-slate-600 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
          {t.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {carsInBudget.map((car, index) => {
            const selected = isSelected(car.model);
            return (
              <motion.div
                key={car.model}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCarToggle(car.model)}
                className={`
                  relative cursor-pointer rounded-2xl overflow-hidden border-2 transition-all duration-300
                  ${selected 
                    ? 'border-[#ee7138] bg-gradient-to-br from-orange-50 to-orange-100 shadow-lg' 
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                  }
                `}
              >
                {/* Selection Indicator */}
                <AnimatePresence>
                  {selected && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute top-3 right-3 z-10 bg-[#ee7138] rounded-full p-2 shadow-lg"
                    >
                      <Check className="w-5 h-5 text-white" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Car Image */}
                <div className="relative h-48 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden">
                  <img
                    src={car.image}
                    alt={car.model}
                    className="w-full h-full object-contain p-4"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                  {selected && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-[#ee7138] bg-opacity-10"
                    />
                  )}
                </div>

                {/* Car Info */}
                <div className="p-4">
                  <h4 className={`font-bold text-lg text-slate-900 mb-2 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                    {car.model}
                  </h4>
                  
                  {/* Key Specs Preview */}
                  <div className={`space-y-1 mb-3 text-sm text-slate-600 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{car.power} hp</span>
                      <span className="text-slate-400">•</span>
                      <span>{car.torque} Nm</span>
                    </div>
                    <div>{car.transmission}</div>
                    <div>{car.driveType}</div>
                  </div>

                  {/* Price */}
                  <div className={`pt-3 border-t border-slate-200 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-[#ee7138]">
                        {formatPrice(car.basePrice)}
                      </span>
                      <span className="text-sm text-slate-500">SAR</span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {t.priceBeforeVAT}
                    </div>
                  </div>

                  {/* Selection Badge */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: selected ? 1 : 0 }}
                    className={`mt-3 pt-3 border-t border-slate-200 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                  >
                    {selected && (
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#ee7138]">
                        <Check className="w-4 h-4" />
                        {t.selectCar}
                      </span>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SoueastCarSelector;

