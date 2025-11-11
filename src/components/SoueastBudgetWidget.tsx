import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, ArrowUp, Sparkles, ChevronRight, Car } from 'lucide-react';
import { getCarsWithinBudget, getUpgradeAmount, getNextTierCars } from '../utils/soueastData';

interface SoueastBudgetWidgetProps {
  value: string;
  onChange: (value: string) => void;
  currentLanguage: 'en' | 'ar';
  onInteraction?: () => void;
}

const SoueastBudgetWidget: React.FC<SoueastBudgetWidgetProps> = ({
  value,
  onChange,
  currentLanguage,
  onInteraction,
}) => {
  const MIN_VALUE = 60000;
  const MAX_VALUE = 120000;
  const STEP = 1000;
  const DEFAULT_VALUE = 80000;

  // Parse incoming value to number
  const parseValue = (val: string): number => {
    if (!val) return 0;
    const cleanValue = val.replace(/[^0-9]/g, '');
    const numValue = parseInt(cleanValue, 10);
    return isNaN(numValue) ? 0 : numValue;
  };

  const [localValue, setLocalValue] = useState<number>(() => {
    const parsed = parseValue(value);
    return parsed || DEFAULT_VALUE;
  });
  const [inputValue, setInputValue] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const sliderRef = useRef<HTMLInputElement>(null);

  // Translations
  const content = {
    en: {
      title: 'Your Budget',
      subtitle: 'Select your budget to see available cars',
      manualLabel: 'Or enter your exact budget',
      manualPlaceholder: 'e.g., 80,000 SAR',
      carsAvailable: 'cars available',
      upgradeAmount: 'Add',
      upgradeToNext: 'to unlock',
      unlockButton: 'Unlock This Car',
      unlockPrice: 'Unlock for',
      carsUnlocked: 'cars unlocked',
      keyFeatures: 'Key Features',
      minLabel: '60K SAR',
      maxLabel: '120K SAR',
    },
    ar: {
      title: 'ميزانيتك',
      subtitle: 'اختر ميزانيتك لرؤية السيارات المتاحة',
      manualLabel: 'أو أدخل ميزانيتك بالضبط',
      manualPlaceholder: 'مثال: 80,000 ريال سعودي',
      carsAvailable: 'سيارة متاحة',
      upgradeAmount: 'أضف',
      upgradeToNext: 'لفتح',
      unlockButton: 'فتح هذه السيارة',
      unlockPrice: 'فتح مقابل',
      carsUnlocked: 'سيارة مفتوحة',
      keyFeatures: 'الميزات الرئيسية',
      minLabel: '60 ألف ريال',
      maxLabel: '120 ألف ريال',
    },
  };

  const t = content[currentLanguage];

  // Update local value when prop changes
  useEffect(() => {
    const parsed = parseValue(value);
    if (parsed > 0 && parsed !== localValue) {
      setLocalValue(parsed);
    }
  }, [value]);

  // Sync local value to parent
  useEffect(() => {
    if (localValue > 0) {
      onChange(localValue.toString());
    }
  }, [localValue, onChange]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    setLocalValue(newValue);
    setHasInteracted(true);
    if (onInteraction) {
      onInteraction();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    setInputValue(rawValue);
    
    const parsed = parseValue(rawValue);
    if (parsed > 0) {
      const clampedValue = Math.max(MIN_VALUE, Math.min(MAX_VALUE, parsed));
      setLocalValue(clampedValue);
      setHasInteracted(true);
      if (onInteraction) {
        onInteraction();
      }
    }
  };

  const handleInputBlur = () => {
    if (inputValue) {
      const parsed = parseValue(inputValue);
      if (parsed > 0) {
        const clampedValue = Math.max(MIN_VALUE, Math.min(MAX_VALUE, parsed));
        setLocalValue(clampedValue);
        const formatted = clampedValue.toLocaleString('en-US');
        setInputValue(`${formatted} SAR`);
      } else {
        setInputValue('');
      }
    } else {
      const formatted = localValue.toLocaleString('en-US');
      setInputValue(`${formatted} SAR`);
    }
  };

  const handleInputFocus = () => {
    if (inputValue.includes('SAR')) {
      setInputValue(inputValue.replace(/\sSAR/g, '').replace(/,/g, ''));
    }
  };

  // Format value for display
  const formatValue = (val: number): string => {
    return val.toLocaleString('en-US');
  };

  // Calculate percentage for slider fill
  const percentage = ((localValue - MIN_VALUE) / (MAX_VALUE - MIN_VALUE)) * 100;

  // Get cars within budget
  const carsInBudget = getCarsWithinBudget(localValue);
  const upgradeAmount = getUpgradeAmount(localValue);
  const nextTierCars = getNextTierCars(localValue);

  // Handle unlock button click for a specific car
  const handleUnlockCar = (carPrice: number) => {
    setLocalValue(carPrice);
    setHasInteracted(true);
    if (onInteraction) {
      onInteraction();
    }
  };

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

      {/* Slider Container */}
      <div className="relative mb-6">
        {/* Track */}
        <div className="relative h-3 bg-slate-200 rounded-full overflow-hidden">
          {/* Filled track with gradient */}
          <motion.div
            className="absolute top-0 left-0 h-full rounded-full"
            style={{
              width: `${percentage}%`,
              background: 'linear-gradient(90deg, #ee7138 0%, #d85a20 100%)',
            }}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>

        {/* Slider Input */}
        <input
          ref={sliderRef}
          type="range"
          min={MIN_VALUE}
          max={MAX_VALUE}
          step={STEP}
          value={localValue}
          onChange={handleSliderChange}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          className="absolute top-0 left-0 w-full h-3 opacity-0 cursor-pointer z-10"
          style={{ WebkitAppearance: 'none', appearance: 'none' }}
        />

        {/* Labels */}
        <div className="flex justify-between mt-2 text-xs text-slate-500">
          <span>{t.minLabel}</span>
          <span>{t.maxLabel}</span>
        </div>

        {/* Value Display */}
        <motion.div
          className="absolute top-0 left-0 flex items-center justify-center"
          style={{
            left: `calc(${percentage}% - 20px)`,
            transform: 'translateY(-100%)',
            marginTop: '-8px',
          }}
          animate={{
            scale: isDragging ? 1.2 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          <div className="bg-[#ee7138] text-white px-3 py-1 rounded-lg text-sm font-semibold shadow-lg whitespace-nowrap">
            {formatValue(localValue)} SAR
          </div>
        </motion.div>
      </div>

      {/* Manual Input */}
      <div className="mb-4">
        <label className={`block text-sm font-semibold text-slate-700 mb-2 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
          {t.manualLabel}
        </label>
        <input
          type="text"
          value={inputValue || formatValue(localValue) + ' SAR'}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onFocus={handleInputFocus}
          placeholder={t.manualPlaceholder}
          className={`w-full px-4 py-3 rounded-2xl border-2 border-slate-200 text-slate-900 placeholder-slate-400 bg-white focus:border-[#ee7138] focus:outline-none transition-colors duration-200 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}
          dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
        />
      </div>

      {/* Cars Available & Upgrade Info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-4 border border-slate-200"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#ee7138]" />
            <span className="text-sm font-semibold text-slate-900">
              {carsInBudget.length} {t.carsAvailable}
            </span>
          </div>
        </div>

        {upgradeAmount && upgradeAmount > 0 && nextTierCars.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="pt-4 border-t border-slate-200 mt-4"
          >
            {/* Upgrade Header */}
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#ee7138] to-[#d85a20] rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <ArrowUp className="w-4 h-4 text-[#ee7138]" />
                  <span className="text-sm font-semibold text-slate-900">
                    <span className="text-[#ee7138]">{t.upgradeAmount} {formatValue(upgradeAmount)} SAR</span>{' '}
                    {t.upgradeToNext} {nextTierCars.length} {t.carsUnlocked}
                  </span>
                </div>
                <p className={`text-xs text-slate-600 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                  {currentLanguage === 'en' 
                    ? 'Unlock premium features and enhanced performance' 
                    : 'افتح الميزات المميزة والأداء المحسّن'}
                </p>
              </div>
            </div>

            {/* Cars Preview */}
            <div className="space-y-3">
              {nextTierCars.map((car, index) => {
                const carUpgradeAmount = car.basePrice - localValue;
                return (
                  <motion.div
                    key={car.model}
                    initial={{ opacity: 0, x: currentLanguage === 'ar' ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl p-4 border border-slate-200 hover:border-[#ee7138] transition-colors"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex-shrink-0 w-16 h-16 bg-slate-100 rounded-lg overflow-hidden">
                        <img
                          src={car.image}
                          alt={car.model}
                          className="w-full h-full object-contain p-1"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder.svg';
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-semibold text-slate-900 mb-1 text-sm ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                          {car.model}
                        </h4>
                        <div className={`text-xs text-slate-600 mb-2 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span>{car.power} hp</span>
                            <span className="text-slate-400">•</span>
                            <span>{car.torque} Nm</span>
                            <span className="text-slate-400">•</span>
                            <span>{car.transmission}</span>
                          </div>
                        </div>
                        <div className={`text-xs text-slate-500 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                          <span className="font-semibold text-[#ee7138]">{formatValue(car.basePrice)} SAR</span>
                          <span className="text-slate-400 ml-1">{currentLanguage === 'en' ? 'before VAT' : 'قبل الضريبة'}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Key Features Preview */}
                    <div className={`mb-3 pt-3 border-t border-slate-100 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                      <p className="text-xs font-semibold text-slate-700 mb-1">{t.keyFeatures}:</p>
                      <p className="text-xs text-slate-600 line-clamp-2">{car.keyFeatures}</p>
                    </div>

                    {/* Individual Unlock Button */}
                    <motion.button
                      onClick={() => handleUnlockCar(car.basePrice)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full px-4 py-2.5 bg-gradient-to-r from-[#ee7138] to-[#d85a20] text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <Car className="w-4 h-4" />
                      <span>{t.unlockButton}</span>
                      <span className="text-xs opacity-90">({t.unlockPrice} {formatValue(carUpgradeAmount)} SAR)</span>
                      <ChevronRight className={`w-4 h-4 ${currentLanguage === 'ar' ? 'rotate-180' : ''}`} />
                    </motion.button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default SoueastBudgetWidget;

