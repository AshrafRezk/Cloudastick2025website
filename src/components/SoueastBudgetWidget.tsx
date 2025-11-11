import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ArrowUp } from 'lucide-react';
import { getCarsWithinBudget, getUpgradeAmount } from '../utils/soueastData';

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
      upgradeToNext: 'to unlock the next tier',
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
      upgradeToNext: 'لفتح المستوى التالي',
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

        {upgradeAmount && upgradeAmount > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 pt-3 border-t border-slate-200"
          >
            <ArrowUp className="w-4 h-4 text-[#ee7138]" />
            <span className="text-sm text-slate-700">
              <span className="font-semibold text-[#ee7138]">{t.upgradeAmount} {formatValue(upgradeAmount)} SAR</span>{' '}
              {t.upgradeToNext}
            </span>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default SoueastBudgetWidget;

