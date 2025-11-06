import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Wallet } from 'lucide-react';

interface InvestmentBudgetWidgetProps {
  value: string;
  onChange: (value: string) => void;
  currentLanguage: 'en' | 'ar';
  onInteraction?: () => void;
}

interface ROIProjection {
  years: number;
  value: number;
}

const InvestmentBudgetWidget: React.FC<InvestmentBudgetWidgetProps> = ({
  value,
  onChange,
  currentLanguage,
  onInteraction,
}) => {
  const MIN_VALUE = 100000;
  const MAX_VALUE = 10000000;
  const STEP = 50000;
  const DEFAULT_VALUE = 1000000;
  const CAGR = 0.065; // 6.5% annual appreciation

  // Parse incoming value to number, default to 1M if empty or invalid
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
  const [showROI, setShowROI] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [error, setError] = useState<string>('');
  const [previousROI, setPreviousROI] = useState<ROIProjection[]>([]);
  
  const sliderRef = useRef<HTMLInputElement>(null);

  // Translations
  const content = {
    en: {
      title: "Investment Budget (Optional)",
      manualLabel: "Type your exact amount (any value allowed)",
      manualPlaceholder: "e.g., 1,000,000 SAR",
      roiTitle: "If you invest",
      roiToday: "SAR today",
      roiSubtitle: "Estimated portfolio value",
      roiNote: "(assuming 6.5% annual appreciation)",
      years: "Years",
      disclaimer: "*Figures are indicative and based on average Saudi real-estate ROI trends.",
      extremeDisclaimer: "*Values shown are indicative only.",
      errorInvalid: "Please enter a valid amount in SAR.",
      minLabel: "100K SAR",
      maxLabel: "10M SAR",
    },
    ar: {
      title: "الميزانية الاستثمارية (اختياري)",
      manualLabel: "اكتب المبلغ الدقيق (أي قيمة مسموحة)",
      manualPlaceholder: "مثال: 1,000,000 ريال سعودي",
      roiTitle: "إذا استثمرت",
      roiToday: "ريال سعودي اليوم",
      roiSubtitle: "القيمة المقدرة للمحفظة",
      roiNote: "(بافتراض 6.5٪ ارتفاع سنوي)",
      years: "سنوات",
      disclaimer: "*الأرقام إرشادية وتستند إلى متوسط اتجاهات عائد الاستثمار العقاري السعودي.",
      extremeDisclaimer: "*القيم الموضحة إرشادية فقط.",
      errorInvalid: "يرجى إدخال مبلغ صالح بالريال السعودي.",
      minLabel: "100 ألف ريال",
      maxLabel: "10 مليون ريال",
    },
  };

  const t = content[currentLanguage];

  // Calculate ROI projections using compound interest formula
  const calculateROI = (principal: number): ROIProjection[] => {
    if (principal === 0) return [];
    
    const timeHorizons = [5, 10, 20, 30];
    return timeHorizons.map((years) => ({
      years,
      value: principal * Math.pow(1 + CAGR, years),
    }));
  };

  // Format number with commas
  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US');
  };

  // Format as millions with 2 decimal places
  const formatMillions = (num: number): string => {
    const millions = num / 1000000;
    return millions.toFixed(2);
  };

  // Format display value for input
  const formatDisplayValue = (num: number): string => {
    if (num === 0) return '';
    return `${formatNumber(num)} SAR`;
  };

  // Sync with parent value
  useEffect(() => {
    const parsed = parseValue(value);
    if (parsed !== localValue && !isDragging) {
      setLocalValue(parsed || DEFAULT_VALUE);
      setInputValue(formatDisplayValue(parsed || DEFAULT_VALUE));
      if (parsed > 0) {
        setShowROI(true);
        setHasInteracted(true);
      }
    }
  }, [value]);

  // Initialize input value
  useEffect(() => {
    if (!inputValue && localValue > 0) {
      setInputValue(formatDisplayValue(localValue));
    }
  }, []);

  // Trigger haptic feedback
  const triggerHaptic = (duration = 30) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(duration);
    }
  };

  // Handle slider change
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    setLocalValue(newValue);
    setInputValue(formatDisplayValue(newValue));
    setError('');
    
    if (!hasInteracted) {
      setHasInteracted(true);
      setShowROI(true);
      onInteraction?.();
    }
    
    // Update parent with clean numeric string
    onChange(newValue.toString());
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    setInputValue(rawValue);
    setError('');
  };

  // Handle input blur - format and validate
  const handleInputBlur = () => {
    const cleanValue = inputValue.replace(/[^0-9]/g, '');
    
    if (!cleanValue) {
      setLocalValue(0);
      setInputValue('');
      setShowROI(false);
      onChange('');
      return;
    }

    const numValue = parseInt(cleanValue, 10);
    
    if (isNaN(numValue) || numValue < 0) {
      setError(t.errorInvalid);
      return;
    }

    // Round to nearest thousand
    const roundedValue = Math.round(numValue / 1000) * 1000;
    
    setLocalValue(roundedValue);
    setInputValue(formatDisplayValue(roundedValue));
    
    if (!hasInteracted && roundedValue > 0) {
      setHasInteracted(true);
      setShowROI(true);
      onInteraction?.();
    }
    
    if (roundedValue > 0) {
      setShowROI(true);
    }
    
    // Update parent
    onChange(roundedValue.toString());
    triggerHaptic(20);
  };

  // Handle input focus - select all for easy editing
  const handleInputFocus = () => {
    triggerHaptic(15);
    // Remove " SAR" suffix for easier editing
    if (localValue > 0) {
      setInputValue(formatNumber(localValue));
    }
  };

  // Calculate current ROI
  const currentROI = calculateROI(localValue);

  // Get slider position for thumb
  const sliderPercentage = ((localValue - MIN_VALUE) / (MAX_VALUE - MIN_VALUE)) * 100;

  // Determine if value is extreme (>50M)
  const isExtremeValue = localValue > 50000000;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
    >
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#6daead]/10 to-[#1c2d36]/10 border-2 border-[#6daead]/30 shadow-lg">
        {/* Header */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex items-center gap-3 mb-6"
        >
          <motion.div
            animate={{ 
              rotate: [0, 10, -10, 10, 0],
              scale: [1, 1.1, 1.1, 1.1, 1]
            }}
            transition={{ 
              duration: 0.6,
              delay: 0.2,
              times: [0, 0.25, 0.5, 0.75, 1]
            }}
            className="w-10 h-10 bg-gradient-to-br from-[#6daead] to-[#1c2d36] rounded-full flex items-center justify-center shadow-lg"
          >
            <Wallet className="w-5 h-5 text-white" strokeWidth={2.5} />
          </motion.div>
          <label 
            htmlFor="investment-slider" 
            className={`text-base font-bold text-[#1c2d36] ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`} 
            dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
          >
            {t.title}
          </label>
        </motion.div>

        {/* Slider Container */}
        <div className="mb-6">
          <div className="relative pt-2 pb-8">
            {/* Slider Track Background */}
            <div className="absolute top-2 left-0 right-0 h-2 bg-slate-200 rounded-full" />
            
            {/* Slider Track Fill (Gradient) */}
            <motion.div
              className="absolute top-2 left-0 h-2 bg-gradient-to-r from-[#6daead] to-[#1c2d36] rounded-full"
              style={{ 
                width: `${Math.min(100, Math.max(0, sliderPercentage))}%`,
              }}
              animate={{
                boxShadow: isDragging 
                  ? '0 0 20px rgba(109, 174, 173, 0.6)' 
                  : '0 0 0px rgba(109, 174, 173, 0)',
              }}
              transition={{ duration: 0.2 }}
            />

            {/* Custom Slider Input */}
            <input
              ref={sliderRef}
              type="range"
              id="investment-slider"
              min={MIN_VALUE}
              max={MAX_VALUE}
              step={STEP}
              value={Math.min(MAX_VALUE, Math.max(MIN_VALUE, localValue))}
              onChange={handleSliderChange}
              onMouseDown={() => {
                setIsDragging(true);
                triggerHaptic(20);
              }}
              onMouseUp={() => {
                setIsDragging(false);
                triggerHaptic(15);
              }}
              onTouchStart={() => {
                setIsDragging(true);
                triggerHaptic(20);
              }}
              onTouchEnd={() => {
                setIsDragging(false);
                triggerHaptic(15);
              }}
              className="relative w-full h-2 appearance-none bg-transparent cursor-pointer z-10"
              style={{
                WebkitAppearance: 'none',
              }}
            />

            {/* Floating Tooltip on Thumb */}
            <AnimatePresence>
              {isDragging && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-[-40px] pointer-events-none"
                  style={{
                    left: `${sliderPercentage}%`,
                    transform: 'translateX(-50%)',
                  }}
                >
                  <div className="bg-[#1c2d36] text-white px-3 py-1 rounded-lg shadow-xl text-sm font-bold whitespace-nowrap">
                    {formatNumber(localValue)} SAR
                  </div>
                  <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#1c2d36] mx-auto" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Min/Max Labels */}
            <div className={`flex justify-between text-xs text-slate-500 font-medium mt-2 ${currentLanguage === 'ar' ? 'flex-row-reverse' : ''}`}>
              <span>{t.minLabel}</span>
              <span>{t.maxLabel}</span>
            </div>
          </div>
        </div>

        {/* Manual Input Field */}
        <div className="mb-4">
          <label 
            htmlFor="investment-input" 
            className={`block text-xs text-slate-600 mb-2 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}
            dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
          >
            {t.manualLabel}
          </label>
          <input
            type="text"
            id="investment-input"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onFocus={handleInputFocus}
            className={`w-full px-4 py-3 rounded-2xl border-2 text-slate-900 placeholder-slate-400 bg-white focus:border-[#6daead] focus:ring-2 focus:ring-[#6daead]/20 focus:outline-none transition-all duration-200 font-mono text-right ${
              error ? 'border-red-500' : 'border-[#6daead]/30'
            }`}
            placeholder={t.manualPlaceholder}
            dir="ltr"
          />
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-xs mt-1"
            >
              {error}
            </motion.p>
          )}
        </div>

        {/* ROI Visualization Panel */}
        <AnimatePresence>
          {showROI && localValue > 0 && currentROI.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: 20, height: 0 }}
              transition={{ 
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="overflow-hidden"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="mt-6 p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200/50 shadow-inner"
              >
                {/* ROI Header */}
                <div className={`text-center mb-4 ${currentLanguage === 'ar' ? 'text-right' : 'text-center'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                  <h3 className="text-sm font-semibold text-slate-700 mb-1">
                    {t.roiTitle}{' '}
                    <span className="text-[#6daead] font-bold">
                      {formatNumber(localValue)}
                    </span>{' '}
                    {t.roiToday}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium">{t.roiSubtitle}</p>
                  <p className="text-xs text-slate-500 italic">{t.roiNote}</p>
                </div>

                {/* Divider */}
                <div className="border-t border-slate-300/50 mb-4" />

                {/* ROI Projections Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {currentROI.map((projection, index) => (
                    <motion.div
                      key={projection.years}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ 
                        duration: 0.3,
                        delay: index * 0.05,
                      }}
                      className="text-center p-3 rounded-xl bg-white/60 border border-slate-200/50"
                    >
                      <div className="text-xs font-semibold text-slate-600 mb-1">
                        {projection.years} {t.years}
                      </div>
                      <AnimatedNumber
                        value={projection.value}
                        previousValue={previousROI[index]?.value || projection.value}
                      />
                    </motion.div>
                  ))}
                </div>

                {/* Divider */}
                <div className="border-t border-slate-300/50 mt-4 mb-3" />

                {/* Disclaimer */}
                <p className={`text-xs text-slate-500 italic text-center ${currentLanguage === 'ar' ? 'text-right' : 'text-center'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                  {isExtremeValue ? t.extremeDisclaimer : t.disclaimer}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Custom Slider Styles */}
      <style>{`
        #investment-slider::-webkit-slider-thumb {
          appearance: none;
          width: 24px;
          height: 24px;
          background: linear-gradient(135deg, #6daead 0%, #1c2d36 100%);
          border: 3px solid white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        #investment-slider::-webkit-slider-thumb:hover {
          transform: scale(1.15);
          box-shadow: 0 4px 12px rgba(109, 174, 173, 0.4);
        }

        #investment-slider::-webkit-slider-thumb:active {
          transform: scale(1.25);
          box-shadow: 0 6px 16px rgba(109, 174, 173, 0.6);
        }

        #investment-slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          background: linear-gradient(135deg, #6daead 0%, #1c2d36 100%);
          border: 3px solid white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        #investment-slider::-moz-range-thumb:hover {
          transform: scale(1.15);
          box-shadow: 0 4px 12px rgba(109, 174, 173, 0.4);
        }

        #investment-slider::-moz-range-thumb:active {
          transform: scale(1.25);
          box-shadow: 0 6px 16px rgba(109, 174, 173, 0.6);
        }
      `}</style>
    </motion.div>
  );
};

// Animated Number Component with Count-Up Effect
interface AnimatedNumberProps {
  value: number;
  previousValue: number;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value, previousValue }) => {
  const [displayValue, setDisplayValue] = useState(previousValue);

  useEffect(() => {
    const duration = 400; // ms
    const steps = 30;
    const increment = (value - displayValue) / steps;
    const stepDuration = duration / steps;

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setDisplayValue(value);
        clearInterval(interval);
      } else {
        setDisplayValue((prev) => prev + increment);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [value]);

  const formatMillions = (num: number): string => {
    const millions = num / 1000000;
    return millions.toFixed(2);
  };

  return (
    <div className="text-base md:text-lg font-bold text-[#1c2d36] tabular-nums">
      ≈ {formatMillions(displayValue)} <span className="text-xs font-normal">M SAR</span>
    </div>
  );
};

export default InvestmentBudgetWidget;

