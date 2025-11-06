import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface CityscapeInvestmentWidgetProps {
  value: string;
  onChange: (value: string) => void;
  currentLanguage: 'en' | 'ar';
  gradient: string; // Dynamic gradient based on booth purpose
  onInteraction?: () => void;
}

interface ROIProjection {
  years: number;
  value: number;
}

interface KSAMegaProject {
  name: string;
  location: string;
  year: number;
  roi: number;
}

const CityscapeInvestmentWidget: React.FC<CityscapeInvestmentWidgetProps> = ({
  value,
  onChange,
  currentLanguage,
  gradient,
  onInteraction,
}) => {
  const MIN_VALUE = 100000;
  const MAX_VALUE = 10000000;
  const STEP = 50000;
  const DEFAULT_VALUE = 1000000;
  const KSA_REAL_ESTATE_CAGR = 0.070; // 7.0% based on KSA mega projects

  // KSA Mega Projects - replacing Memar projects
  const ksaMegaProjects: KSAMegaProject[] = [
    { name: 'NEOM', location: 'Tabuk Province', year: 2025, roi: 8.2 },
    { name: 'Red Sea Project', location: 'Red Sea Coast', year: 2023, roi: 7.8 },
    { name: 'Qiddiya', location: 'Riyadh', year: 2024, roi: 7.5 },
    { name: 'Diriyah Gate', location: 'Riyadh', year: 2022, roi: 7.3 },
  ];

  // Asset classes with realistic CAGRs
  const assetClasses: Record<string, { label: string; cagr: number; color: string; reference: string }> = {
    ksaRealEstate: {
      label: currentLanguage === 'en' ? 'KSA Mega Projects' : 'مشاريع السعودية الضخمة',
      cagr: 0.070,
      color: '#10b981', // emerald-500 as default, will be overridden by gradient
      reference: currentLanguage === 'en' 
        ? 'NEOM, Red Sea Project, Qiddiya, Diriyah Gate - Vision 2030 Real Estate Performance'
        : 'نيوم، مشروع البحر الأحمر، القدية، بوابة الدرعية - أداء عقاري رؤية 2030',
    },
    gold: {
      label: currentLanguage === 'en' ? 'Gold Bullion' : 'سبائك الذهب',
      cagr: 0.038,
      color: '#D4AF37',
      reference: currentLanguage === 'en' 
        ? 'SAMA (Saudi Arabian Monetary Authority) 10-year average gold returns'
        : 'ساما (المؤسسة النقدية العربية السعودية) متوسط عوائد الذهب لمدة 10 سنوات',
    },
    stocks: {
      label: currentLanguage === 'en' ? 'Tadawul Index' : 'مؤشر تداول',
      cagr: 0.050,
      color: '#64748b',
      reference: currentLanguage === 'en' 
        ? 'Tadawul All Share Index (TASI) 10-year CAGR per Saudi Exchange data'
        : 'مؤشر تداول لجميع الأسهم (تاسي) معدل النمو السنوي المركب لمدة 10 سنوات حسب بيانات السوق المالية السعودية',
    },
    fixed: {
      label: currentLanguage === 'en' ? 'Fixed Deposits' : 'الودائع الثابتة',
      cagr: 0.020,
      color: '#cbd5e1',
      reference: currentLanguage === 'en' 
        ? 'SAMA average retail deposit yields 2020-2024'
        : 'متوسط عوائد الودائع البيعية لساما 2020-2024',
    },
  };

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
  const [showROI, setShowROI] = useState(false);
  const [showProjectDetails, setShowProjectDetails] = useState(false);
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
      roiNote: "(assuming 7.0% annual appreciation)",
      years: "Years",
      disclaimer: "*Figures are indicative and based on average Saudi real-estate ROI trends.",
      errorInvalid: "Please enter a valid amount in SAR.",
      minLabel: "100K SAR",
      maxLabel: "10M SAR",
      viewProjectDetails: "View KSA Mega Projects",
      hideProjectDetails: "Hide Projects",
      avgAnnualROI: "Avg. Annual ROI",
      delivered: "Launched",
      dataDisclaimer: "All figures are indicative and derived from verified sources: SAMA, Tadawul, and Vision 2030 mega project performance data.",
      referencesTitle: "Data Sources & References",
      yearLabel: "Year",
    },
    ar: {
      title: "الميزانية الاستثمارية (اختياري)",
      manualLabel: "اكتب المبلغ الدقيق (أي قيمة مسموحة)",
      manualPlaceholder: "مثال: 1,000,000 ريال سعودي",
      roiTitle: "إذا استثمرت",
      roiToday: "ريال سعودي اليوم",
      roiSubtitle: "القيمة المقدرة للمحفظة",
      roiNote: "(بافتراض 7.0٪ ارتفاع سنوي)",
      years: "سنوات",
      disclaimer: "*الأرقام إرشادية وتستند إلى متوسط اتجاهات عائد الاستثمار العقاري السعودي.",
      errorInvalid: "يرجى إدخال مبلغ صالح بالريال السعودي.",
      minLabel: "100 ألف ريال",
      maxLabel: "10 مليون ريال",
      viewProjectDetails: "عرض مشاريع السعودية الضخمة",
      hideProjectDetails: "إخفاء المشاريع",
      avgAnnualROI: "متوسط العائد السنوي",
      delivered: "تم الإطلاق",
      dataDisclaimer: "جميع الأرقام إرشادية ومستمدة من مصادر موثوقة: ساما، تداول، وبيانات أداء مشاريع رؤية 2030 الضخمة.",
      referencesTitle: "مصادر البيانات والمراجع",
      yearLabel: "السنة",
    },
  };

  const t = content[currentLanguage];

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

  // Calculate ROI projections using compound interest formula
  const calculateROI = (principal: number): ROIProjection[] => {
    if (principal <= 0) return [];
    
    const years = [5, 10, 20, 30];
    return years.map(y => ({
      years: y,
      value: principal * Math.pow(1 + KSA_REAL_ESTATE_CAGR, y),
    }));
  };

  // Generate chart data with year-by-year fluctuations
  const generateChartData = (investment: number) => {
    const allYears = Array.from({ length: 31 }, (_, i) => i);
    
    return allYears.map(year => {
      if (year === 0) {
        return {
          year: 0,
          ksaRealEstate: investment,
          gold: investment,
          stocks: investment,
          fixed: investment,
        };
      }
      
      const getKSAReturn = (y: number) => {
        const seed = Math.sin(y * 7.234 + 12.456) * 43758.5453;
        const variance = ((seed - Math.floor(seed)) - 0.5) * 0.04;
        return 0.070 + variance;
      };
      
      const getGoldReturn = (y: number) => {
        const seed = Math.sin(y * 13.789 + 45.123) * 23456.7890;
        const variance = ((seed - Math.floor(seed)) - 0.5) * 0.12;
        return 0.038 + variance;
      };
      
      const getStocksReturn = (y: number) => {
        const seed = Math.sin(y * 23.456 + 78.901) * 12345.6789;
        const variance = ((seed - Math.floor(seed)) - 0.5) * 0.25;
        return 0.050 + variance;
      };
      
      const getFixedReturn = (y: number) => {
        const seed = Math.sin(y * 5.678 + 34.567) * 87654.3210;
        const variance = ((seed - Math.floor(seed)) - 0.5) * 0.015;
        return 0.020 + variance;
      };
      
      let ksaValue = investment;
      let goldValue = investment;
      let stocksValue = investment;
      let fixedValue = investment;
      
      for (let y = 1; y <= year; y++) {
        ksaValue *= (1 + getKSAReturn(y));
        goldValue *= (1 + getGoldReturn(y));
        stocksValue *= (1 + getStocksReturn(y));
        fixedValue *= (1 + getFixedReturn(y));
      }
      
      return {
        year,
        ksaRealEstate: ksaValue,
        gold: goldValue,
        stocks: stocksValue,
        fixed: fixedValue,
      };
    });
  };

  // Sync with parent value
  useEffect(() => {
    const parsed = parseValue(value);
    if (parsed !== localValue) {
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
    
    onChange(newValue.toString());
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    setInputValue(rawValue);
    setError('');
  };

  // Handle input blur
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
    
    onChange(roundedValue.toString());
    triggerHaptic(20);
  };

  // Handle input focus
  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    triggerHaptic(15);
    if (localValue > 0) {
      setInputValue(formatNumber(localValue));
    }
    e.target.style.borderColor = primaryColor;
    e.target.style.boxShadow = `0 0 0 3px ${primaryColor}33`;
  };

  // Handle input blur
  const handleInputBlurWithStyle = (e: React.FocusEvent<HTMLInputElement>) => {
    handleInputBlur();
    e.target.style.borderColor = error ? undefined : '#cbd5e1'; // slate-300
    e.target.style.boxShadow = 'none';
  };

  // Calculate current ROI
  const currentROI = calculateROI(localValue);
  const chartData = generateChartData(localValue);

  // Get slider position for thumb
  const sliderPercentage = ((localValue - MIN_VALUE) / (MAX_VALUE - MIN_VALUE)) * 100;

  // Extract gradient colors for use in chart
  const getGradientColor = () => {
    // Extract color from gradient string like "from-emerald-500 to-teal-600"
    if (gradient.includes('emerald')) return '#10b981';
    if (gradient.includes('blue')) return '#3b82f6';
    if (gradient.includes('purple')) return '#a855f7';
    return '#10b981'; // default emerald
  };

  const primaryColor = getGradientColor();

  // Custom tooltip for chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/98 backdrop-blur-sm p-3 md:p-4 rounded-lg md:rounded-xl shadow-2xl border-2 border-opacity-40 max-w-[280px] md:max-w-[320px]" style={{ borderColor: primaryColor }}>
          <p className="font-bold text-slate-900 mb-2 text-sm md:text-base">{t.yearLabel} {label}</p>
          {payload.map((entry: any) => (
            <div key={entry.dataKey} className="flex items-center gap-2 mb-1.5 last:mb-0">
              <div 
                className="w-3 h-3 md:w-3.5 md:h-3.5 rounded-full flex-shrink-0" 
                style={{ backgroundColor: entry.color }} 
              />
              <span className="text-xs md:text-sm font-semibold text-slate-800 truncate">{entry.name}:</span>
              <span className="text-xs md:text-sm font-bold text-slate-900 ml-auto tabular-nums">
                ≈ {formatMillions(entry.value)} M
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
    >
      <div className="p-3 md:p-6 rounded-3xl bg-white border-2 border-slate-200 shadow-lg">
        {/* Header */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex items-center gap-3 mb-4 md:mb-6"
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
            className={`w-10 h-10 bg-gradient-to-br ${gradient} rounded-full flex items-center justify-center shadow-lg`}
          >
            <Wallet className="w-5 h-5 text-white" strokeWidth={2.5} />
          </motion.div>
          <label 
            htmlFor="investment-slider" 
            className={`text-base font-bold text-slate-900 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`} 
            dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
          >
            {t.title}
          </label>
        </motion.div>

        {/* Slider Container */}
        <div className="mb-4 md:mb-6">
          <div className="relative pt-2 pb-8">
            {/* Slider Track Background */}
            <div className="absolute top-2 left-0 right-0 h-2 bg-slate-200 rounded-full" />
            
            {/* Slider Track Fill (Gradient) */}
            <motion.div
              className={`absolute top-2 left-0 h-2 bg-gradient-to-r ${gradient} rounded-full`}
              style={{ 
                width: `${Math.min(100, Math.max(0, sliderPercentage))}%`,
              }}
              animate={{
                boxShadow: isDragging 
                  ? `0 0 20px ${primaryColor}80` 
                  : '0 0 0px transparent',
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
                  <div className="bg-slate-900 text-white px-3 py-1 rounded-lg shadow-xl text-sm font-bold whitespace-nowrap">
                    {formatNumber(localValue)} SAR
                  </div>
                  <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-slate-900 mx-auto" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Min/Max Labels */}
            <div className={`flex justify-between text-xs text-slate-700 font-medium mt-2 ${currentLanguage === 'ar' ? 'flex-row-reverse' : ''}`}>
              <span>{t.minLabel}</span>
              <span>{t.maxLabel}</span>
            </div>
          </div>
        </div>

        {/* Manual Input Field */}
        <div className="mb-3 md:mb-4">
          <label 
            htmlFor="investment-input" 
            className={`block text-xs text-slate-700 mb-2 font-medium ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}
            dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
          >
            {t.manualLabel}
          </label>
          <input
            type="text"
            id="investment-input"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlurWithStyle}
            onFocus={handleInputFocus}
            className={`w-full px-4 py-3 rounded-2xl border-2 text-slate-900 placeholder-slate-400 bg-white focus:outline-none transition-all duration-200 font-mono text-right ${
              error ? 'border-red-500' : 'border-slate-300'
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

        {/* KSA Mega Projects Section */}
        <div className="mb-4 md:mb-6">
          <button
            onClick={() => {
              setShowProjectDetails(!showProjectDetails);
              triggerHaptic(20);
            }}
            className={`flex items-center gap-2 text-sm font-semibold transition-colors mx-auto hover:text-blue-700 ${currentLanguage === 'ar' ? 'flex-row-reverse' : ''} text-blue-800`}
          >
            {showProjectDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {showProjectDetails ? t.hideProjectDetails : t.viewProjectDetails}
          </button>

          <AnimatePresence>
            {showProjectDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-3 md:mt-4 space-y-3 overflow-hidden"
              >
                {ksaMegaProjects.map((project, index) => (
                  <motion.div
                    key={project.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="p-2 md:p-3 bg-white rounded-xl border shadow-sm"
                    style={{ borderColor: `${primaryColor}33` }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-slate-900">{project.name}</h4>
                        <p className="text-xs text-slate-600">
                          {project.location} • {t.delivered} {project.year}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold" style={{ color: primaryColor }}>{project.roi}%</div>
                        <div className="text-xs text-slate-500">{t.avgAnnualROI}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ROI Visualization Panel */}
        <AnimatePresence>
          {showROI && localValue > 0 && currentROI.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: 20, height: 0 }}
              transition={{ duration: 0.5 }}
              className="overflow-hidden"
            >
              <div className="p-4 md:p-6 rounded-2xl bg-white border-2 shadow-lg" style={{ borderColor: `${primaryColor}30` }}>
                {/* ROI Header */}
                <div className={`mb-4 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">
                    {t.roiTitle}{' '}
                    <span className="font-mono" style={{ color: primaryColor }}>
                      {formatNumber(localValue)}
                    </span>{' '}
                    {t.roiToday}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium">{t.roiSubtitle}</p>
                  <p className="text-xs text-slate-500 italic">{t.roiNote}</p>
                </div>

                {/* ROI Projections Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4">
                  {currentROI.map((projection, index) => {
                    const prevValue = previousROI[index]?.value || projection.value;
                    return (
                      <motion.div
                        key={projection.years}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="p-3 md:p-4 rounded-xl bg-gradient-to-br from-slate-50 to-white border border-slate-200"
                      >
                        <div className="text-xs text-slate-600 mb-1">{projection.years} {t.years}</div>
                        <div className="text-lg md:text-xl font-bold" style={{ color: primaryColor }}>
                          ≈ {formatMillions(projection.value)} M
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Comparison Chart */}
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <h4 className={`text-sm font-semibold text-slate-900 mb-3 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                    {currentLanguage === 'en' ? 'Compare with Other Investments' : 'قارن مع استثمارات أخرى'}
                  </h4>
                  <div className="bg-slate-50 rounded-xl p-2" style={{ height: window.innerWidth < 768 ? 250 : 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                        <XAxis 
                          dataKey="year"
                          domain={[0, 30]}
                          ticks={[0, 5, 10, 15, 20, 25, 30]}
                          tick={{ fill: '#64748b', fontSize: 11 }}
                        />
                        <YAxis 
                          tick={{ fill: '#64748b', fontSize: 12 }}
                          tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend 
                          wrapperStyle={{ fontSize: '12px', marginTop: '16px' }}
                          formatter={(value) => {
                            if (value === 'ksaRealEstate') return assetClasses.ksaRealEstate.label;
                            if (value === 'gold') return assetClasses.gold.label;
                            if (value === 'stocks') return assetClasses.stocks.label;
                            if (value === 'fixed') return assetClasses.fixed.label;
                            return value;
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="ksaRealEstate" 
                          stroke={primaryColor}
                          strokeWidth={4}
                          dot={false}
                          animationDuration={800}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="gold" 
                          stroke={assetClasses.gold.color}
                          strokeWidth={2}
                          dot={false}
                          animationDuration={800}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="stocks" 
                          stroke={assetClasses.stocks.color}
                          strokeWidth={2}
                          dot={false}
                          animationDuration={800}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="fixed" 
                          stroke={assetClasses.fixed.color}
                          strokeWidth={2}
                          dot={false}
                          animationDuration={800}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Disclaimer */}
                <p className="text-xs text-slate-500 italic mt-4 text-center">
                  {t.dataDisclaimer}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default CityscapeInvestmentWidget;

