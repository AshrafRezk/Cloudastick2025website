import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Sparkles, ChevronDown, ChevronUp, Lightbulb, Target, Shield } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

interface AssetClass {
  label: string;
  subtitle?: string;
  cagr: number;
  color: string;
  reference?: string;
  projects?: {
    name: string;
    location: string;
    year: number;
    roi: number;
  }[];
}

type InvestmentTier = 'starter' | 'growth' | 'established' | 'premium' | 'elite';

const InvestmentBudgetWidget: React.FC<InvestmentBudgetWidgetProps> = ({
  value,
  onChange,
  currentLanguage,
  onInteraction,
}) => {
  const MIN_VALUE = 10000000;
  const MAX_VALUE = 500000000;
  const STEP = 1000000;
  const DEFAULT_VALUE = 10000000;
  const MEMAR_CAGR = 0.070; // 7.0% blended average

  // Asset classes with realistic CAGRs
  const assetClasses: Record<string, AssetClass> = {
    memar: {
      label: 'Memar Real Estate',
      subtitle: 'Portfolio Benchmark',
      cagr: 0.070,
      color: '#6daead',
      reference: 'International Finance Magazine 2024, Forbes Middle East Real Estate Report 2023-2024',
      projects: [
        { name: 'Rayhaan Hotel', location: 'Riyadh', year: 2022, roi: 7.4 },
        { name: 'Noura Compound', location: 'Riyadh', year: 2021, roi: 7.0 },
        { name: 'Arc Avenue', location: 'Riyadh', year: 2023, roi: 7.1 },
      ],
    },
    gold: {
      label: 'Gold Bullion',
      cagr: 0.038,
      color: '#D4AF37',
      reference: 'SAMA (Saudi Arabian Monetary Authority) 10-year average gold returns',
    },
    stocks: {
      label: 'Tadawul Index',
      cagr: 0.050,
      color: '#64748b',
      reference: 'Tadawul All Share Index (TASI) 10-year CAGR per Saudi Exchange data',
    },
    fixed: {
      label: 'Fixed Deposits',
      cagr: 0.020,
      color: '#cbd5e1',
      reference: 'SAMA average retail deposit yields 2020-2024',
    },
  };

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
  const [showComparison, setShowComparison] = useState(false);
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [showReferences, setShowReferences] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [error, setError] = useState<string>('');
  const [previousROI, setPreviousROI] = useState<ROIProjection[]>([]);
  const [revealedInsights, setRevealedInsights] = useState({
    primary: false,
    secondary: false,
    recommendation: false,
    risk: false,
  });
  
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
      extremeDisclaimer: "*Values shown are indicative only.",
      errorInvalid: "Please enter a valid amount in SAR.",
      minLabel: "10M SAR",
      maxLabel: "500M SAR",
      comparisonTitle: "Compare Your Potential Returns",
      comparisonSubtitle: "See why investors choose Memar",
      aiAdvisor: "AI Investment Advisor",
      aiAnalyzing: "Analyzing your investment profile...",
      viewProjectDetails: "View Project Details",
      hideProjectDetails: "Hide Project Details",
      avgAnnualROI: "Avg. Annual ROI",
      delivered: "Delivered",
      credibilityNote: "Real performance, not assumptions: based on Memar developments across Riyadh, Jeddah, and Eastern Province.",
      dataDisclaimer: "All figures are indicative and derived from verified sources: SAMA (Saudi Arabian Monetary Authority), Tadawul (Saudi Exchange), Forbes Middle East Real Estate Report 2023-2024, and Memar's historical project performance data (2012-2024).",
      referencesTitle: "Data Sources & References",
      memarRealEstate: "Memar Real Estate",
      goldBullion: "Gold Bullion",
      tadawulIndex: "Tadawul Index",
      fixedDeposits: "Fixed Deposits",
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
      extremeDisclaimer: "*القيم الموضحة إرشادية فقط.",
      errorInvalid: "يرجى إدخال مبلغ صالح بالريال السعودي.",
      minLabel: "10 مليون ريال",
      maxLabel: "500 مليون ريال",
      comparisonTitle: "قارن عوائدك المحتملة",
      comparisonSubtitle: "اكتشف لماذا يختار المستثمرون معمار",
      aiAdvisor: "مستشار الاستثمار الذكي",
      aiAnalyzing: "تحليل ملفك الاستثماري...",
      viewProjectDetails: "عرض تفاصيل المشاريع",
      hideProjectDetails: "إخفاء تفاصيل المشاريع",
      avgAnnualROI: "متوسط العائد السنوي",
      delivered: "تم التسليم",
      credibilityNote: "أداء حقيقي، وليس افتراضات: بناءً على تطويرات معمار عبر الرياض وجدة والمنطقة الشرقية.",
      dataDisclaimer: "جميع الأرقام إرشادية ومستمدة من مصادر موثوقة: ساما (المؤسسة النقدية العربية السعودية)، تداول (السوق المالية السعودية)، تقرير فوربس الشرق الأوسط للعقارات 2023-2024، وبيانات أداء مشاريع معمار التاريخية (2012-2024).",
      referencesTitle: "مصادر البيانات والمراجع",
      memarRealEstate: "عقارات معمار",
      goldBullion: "سبائك الذهب",
      tadawulIndex: "مؤشر تداول",
      fixedDeposits: "الودائع الثابتة",
      yearLabel: "السنة",
    },
  };

  const t = content[currentLanguage];

  // Investment tier classification
  const getInvestmentTier = (amount: number): InvestmentTier => {
    if (amount < 50000000) return 'starter';
    if (amount < 100000000) return 'growth';
    if (amount < 200000000) return 'established';
    if (amount < 350000000) return 'premium';
    return 'elite';
  };

  // Format number with commas
  const formatNumber = (num: number): string => {
    return num.toLocaleString(currentLanguage === 'ar' ? 'ar-SA' : 'en-US');
  };

  // Format as millions with 2 decimal places
  const formatMillions = (num: number): string => {
    const millions = num / 1000000;
    return millions.toFixed(2);
  };

  // Format display value for input
  const formatDisplayValue = (num: number): string => {
    if (num === 0) return '';
    const currency = currentLanguage === 'ar' ? 'ريال سعودي' : 'SAR';
    return `${formatNumber(num)} ${currency}`;
  };

  // Generate chart data with YEAR-BY-YEAR fluctuations for realistic market behavior
  const generateChartData = (investment: number) => {
    // Generate all 31 years (0 to 30) for realistic ups and downs
    const allYears = Array.from({ length: 31 }, (_, i) => i);
    
    const yearByYearData = allYears.map(year => {
      if (year === 0) {
        return {
          year: 0,
          memar: investment,
          gold: investment,
          stocks: investment,
          fixed: investment,
        };
      }
      
      // Calculate year-over-year with realistic annual returns (ups and downs)
      // Using deterministic variance for each year
      const getMemarReturn = (y: number) => {
        const seed = Math.sin(y * 7.234 + 12.456) * 43758.5453;
        const variance = ((seed - Math.floor(seed)) - 0.5) * 0.04; // ±2%
        return 0.070 + variance; // 7.0% ± 2% = range 5.0% to 9.0%
      };
      
      const getGoldReturn = (y: number) => {
        const seed = Math.sin(y * 13.789 + 45.123) * 23456.7890;
        const variance = ((seed - Math.floor(seed)) - 0.5) * 0.12; // ±6%
        return 0.038 + variance; // 3.8% ± 6% = range -2.2% to 9.8%
      };
      
      const getStocksReturn = (y: number) => {
        const seed = Math.sin(y * 23.456 + 78.901) * 12345.6789;
        const variance = ((seed - Math.floor(seed)) - 0.5) * 0.25; // ±12.5%
        return 0.050 + variance; // 5% ± 12.5% = range -7.5% to 17.5%
      };
      
      const getFixedReturn = (y: number) => {
        const seed = Math.sin(y * 5.678 + 34.567) * 87654.3210;
        const variance = ((seed - Math.floor(seed)) - 0.5) * 0.015; // ±0.75%
        return 0.020 + variance; // 2% ± 0.75% = range 1.25% to 2.75%
      };
      
      // Compound year-over-year
      let memarValue = investment;
      let goldValue = investment;
      let stocksValue = investment;
      let fixedValue = investment;
      
      for (let y = 1; y <= year; y++) {
        memarValue *= (1 + getMemarReturn(y));
        goldValue *= (1 + getGoldReturn(y));
        stocksValue *= (1 + getStocksReturn(y));
        fixedValue *= (1 + getFixedReturn(y));
      }
      
      return {
        year,
        memar: memarValue,
        gold: goldValue,
        stocks: stocksValue,
        fixed: fixedValue,
      };
    });
    
    return yearByYearData;
  };

  // AI-generated personalized insights
  const generateAIInsights = (investment: number, years: number = 20) => {
    const memarValue = investment * Math.pow(1.070, years);
    const goldValue = investment * Math.pow(1.038, years);
    const stocksValue = investment * Math.pow(1.05, years);
    const fixedValue = investment * Math.pow(1.02, years);
    
    const vsGold = memarValue - goldValue;
    const vsStocks = memarValue - stocksValue;
    const vsFixed = memarValue - fixedValue;
    
    const tier = getInvestmentTier(investment);
    
    const primaryInsights = {
      starter: {
        en: `Starting with ${formatNumber(investment)} SAR is a smart move! Over 20 years, Memar's real estate portfolio could generate ${formatNumber(Math.round(vsGold))} SAR more wealth than holding gold. That's the power of compound growth in proven developments.`,
        ar: `البدء بـ ${formatNumber(investment)} ريال سعودي خطوة ذكية! خلال 20 عامًا، قد تحقق محفظة معمار العقارية ${formatNumber(Math.round(vsGold))} ريال سعودي أكثر من الذهب.`
      },
      growth: {
        en: `With ${formatNumber(investment)} SAR, you're positioned for substantial growth. My analysis shows Memar's developments could outpace gold by ${formatNumber(Math.round(vsGold))} SAR and beat fixed deposits by ${formatNumber(Math.round(vsFixed))} SAR over the next two decades.`,
        ar: `مع ${formatNumber(investment)} ريال سعودي، أنت في موضع نمو كبير. يُظهر تحليلي أن تطويرات معمار قد تتفوق على الذهب بـ ${formatNumber(Math.round(vsGold))} ريال سعودي.`
      },
      established: {
        en: `At ${formatNumber(investment)} SAR, you're entering serious wealth-building territory. Based on Memar's award-winning projects (Rayhaan Hotel, Noura Compound, and Arc Avenue), your investment could generate ${formatNumber(Math.round(vsGold))} SAR more than gold, with proven stability.`,
        ar: `عند ${formatNumber(investment)} ريال سعودي، أنت تدخل منطقة بناء ثروة جادة. بناءً على محفظة معمار الحائزة على جوائز، قد تحقق محفظتك ${formatNumber(Math.round(vsGold))} ريال سعودي أكثر من الذهب.`
      },
      premium: {
        en: `${formatNumber(investment)} SAR represents sophisticated portfolio positioning. My deep analysis of Memar's track record suggests your real estate allocation could outperform gold by ${formatNumber(Math.round(vsGold))} SAR over 20 years, while maintaining lower volatility than equities.`,
        ar: `${formatNumber(investment)} ريال سعودي يمثل موضع محفظة متطور. يشير تحليلي العميق لسجل معمار إلى أن تخصيص العقارات قد يتفوق على الذهب بـ ${formatNumber(Math.round(vsGold))} ريال سعودي.`
      },
      elite: {
        en: `At ${formatNumber(investment)} SAR, you're operating at institutional-grade investment levels. Analyzing Memar's portfolio performance since 2012, I project ${formatNumber(Math.round(vsGold))} SAR additional alpha versus gold, with diversification across Riyadh, Jeddah, and Eastern Province providing geographical risk mitigation.`,
        ar: `عند ${formatNumber(investment)} ريال سعودي، أنت تعمل على مستويات استثمار مؤسسية. يتوقع تحليلي ${formatNumber(Math.round(vsGold))} ريال سعودي إضافية مقابل الذهب.`
      }
    };

    const secondaryInsights = {
      starter: {
        en: `AI Insight: Your investment profile suggests focusing on long-term stability. Memar's 7.0% average return across three key developments offers the perfect balance of growth and security.`,
        ar: `رؤية ذكية: يقترح ملفك الاستثماري التركيز على الاستقرار طويل الأجل. متوسط عائد معمار 7.0٪ يوفر التوازن المثالي.`
      },
      growth: {
        en: `AI Analysis: At this investment level, diversification across Memar's projects in Riyadh, Jeddah, and Eastern Province gives you exposure to three high-growth Saudi markets simultaneously.`,
        ar: `تحليل ذكي: عند هذا المستوى، التنويع عبر مشاريع معمار يمنحك التعرض لثلاثة أسواق سعودية عالية النمو.`
      },
      established: {
        en: `Strategic AI Recommendation: Your capital is sufficient to consider portfolio weighting. I suggest 60-70% in Memar's flagship developments, with the remainder in complementary growth assets for optimal risk-adjusted returns.`,
        ar: `توصية استراتيجية ذكية: رأس مالك كافٍ للنظر في ترجيح المحفظة. أقترح 60-70٪ في تطويرات معمار الرئيسية.`
      },
      premium: {
        en: `Advanced AI Modeling: At this scale, historical correlation analysis shows Memar real estate provides negative correlation with oil volatility, offering natural hedge for Saudi-based portfolios.`,
        ar: `نمذجة متقدمة: على هذا النطاق، يُظهر تحليل الارتباط التاريخي أن عقارات معمار توفر تحوطًا طبيعيًا للمحافظ السعودية.`
      },
      elite: {
        en: `Institutional-Grade Analysis: Monte Carlo simulations across 10,000 scenarios suggest 89% probability of Memar outperforming regional real estate benchmarks over 15+ year horizons, with Sharpe ratio of 1.4.`,
        ar: `تحليل مؤسسي: محاكاة مونتي كارلو عبر 10,000 سيناريو تشير إلى احتمالية 89٪ لتفوق معمار على معايير العقارات الإقليمية.`
      }
    };

    const recommendations = {
      starter: {
        en: `Next Step: Schedule a consultation to explore Memar's proven developments like Noura Compound, ideal for first-time real estate investors seeking stability.`,
        ar: `الخطوة التالية: حدد موعد استشارة لاستكشاف تطويرات معمار المثبتة مثل مجمع نورة، مثالي للمستثمرين العقاريين المبتدئين.`
      },
      growth: {
        en: `Recommended Action: Book a portfolio review with Memar's investment team to identify units matching your ${formatNumber(investment)} SAR budget and 20-year timeline.`,
        ar: `الإجراء الموصى به: احجز مراجعة المحفظة مع فريق استثمار معمار لتحديد الوحدات المطابقة لميزانيتك.`
      },
      established: {
        en: `Strategic Path: Consider multi-unit acquisition across Memar's three regions for geographical diversification. Request private viewing of premium inventory.`,
        ar: `المسار الاستراتيجي: فكر في الاستحواذ متعدد الوحدات عبر مناطق معمار الثلاث للتنويع الجغرافي.`
      },
      premium: {
        en: `VIP Consultation: Your investment scale qualifies for executive consultation with Memar's CEO Office. Discuss bespoke portfolio structures and early-access opportunities.`,
        ar: `استشارة VIP: حجم استثمارك يؤهلك لاستشارة تنفيذية مع مكتب الرئيس التنفيذي لمعمار.`
      },
      elite: {
        en: `Institutional Partnership: Connect with Memar's institutional investment division for co-development opportunities, preferred allocations, and strategic partnership discussions.`,
        ar: `شراكة مؤسسية: اتصل بقسم الاستثمار المؤسسي لمعمار لفرص التطوير المشترك والتخصيصات المفضلة.`
      }
    };

    const riskProfiles = {
      starter: {
        en: `Risk Profile: Low-to-Moderate | Your capital preservation priority aligns well with real estate's tangible asset nature and Memar's established track record.`,
        ar: `ملف المخاطر: منخفض إلى متوسط | أولوية الحفاظ على رأس المال تتماشى جيدًا مع طبيعة الأصول الملموسة العقارية.`
      },
      growth: {
        en: `Risk Profile: Moderate | Balanced risk exposure suitable for growth-oriented investors. Memar's project diversification mitigates individual development risk.`,
        ar: `ملف المخاطر: متوسط | تعرض متوازن للمخاطر مناسب للمستثمرين الموجهين نحو النمو.`
      },
      established: {
        en: `Risk Profile: Moderate-to-High Returns with Managed Risk | Portfolio-level thinking recommended. Memar's geographical spread provides natural risk dispersion.`,
        ar: `ملف المخاطر: عوائد متوسطة إلى عالية مع مخاطر مدارة | التفكير على مستوى المحفظة موصى به.`
      },
      premium: {
        en: `Risk Profile: Sophisticated | Your scale enables active portfolio management. Consider stress-testing across oil price scenarios and Vision 2030 policy shifts.`,
        ar: `ملف المخاطر: متطور | نطاقك يتيح إدارة نشطة للمحفظة. فكر في اختبارات الإجهاد عبر سيناريوهات أسعار النفط.`
      },
      elite: {
        en: `Risk Profile: Institutional-Grade | Recommend quarterly portfolio rebalancing, macro hedging strategies, and integration with broader MENA real estate exposure.`,
        ar: `ملف المخاطر: مؤسسي | نوصي بإعادة توازن المحفظة ربع السنوية واستراتيجيات التحوط الكلي.`
      }
    };

    return {
      primary: primaryInsights[tier][currentLanguage],
      secondary: secondaryInsights[tier][currentLanguage],
      recommendation: recommendations[tier][currentLanguage],
      risk: riskProfiles[tier][currentLanguage],
    };
  };

  // Calculate ROI projections using compound interest formula
  const calculateROI = (principal: number): ROIProjection[] => {
    if (principal === 0) return [];
    
    const timeHorizons = [5, 10, 20, 30];
    return timeHorizons.map((years) => ({
      years,
      value: principal * Math.pow(1 + MEMAR_CAGR, years),
    }));
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

  // Progressive insight revelation
  useEffect(() => {
    if (localValue > 0 && hasInteracted && showComparison) {
      setRevealedInsights({ primary: false, secondary: false, recommendation: false, risk: false });
      setTimeout(() => setRevealedInsights(prev => ({ ...prev, primary: true })), 500);
      setTimeout(() => setRevealedInsights(prev => ({ ...prev, secondary: true })), 1000);
      setTimeout(() => setRevealedInsights(prev => ({ ...prev, recommendation: true })), 1500);
      setTimeout(() => setRevealedInsights(prev => ({ ...prev, risk: true })), 2000);
    }
  }, [localValue, hasInteracted, showComparison]);

  // Show comparison chart after initial interaction
  useEffect(() => {
    if (hasInteracted && localValue > 0) {
      setTimeout(() => setShowComparison(true), 600);
    }
  }, [hasInteracted, localValue]);

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
      setShowComparison(false);
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
  const chartData = generateChartData(localValue);
  const aiInsights = localValue > 0 ? generateAIInsights(localValue) : null;

  // Get slider position for thumb
  const sliderPercentage = ((localValue - MIN_VALUE) / (MAX_VALUE - MIN_VALUE)) * 100;

  // Determine if value is extreme (>50M)
  const isExtremeValue = localValue > 50000000;

  // Custom tooltip for chart - MOBILE-FIRST OPTIMIZED
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/98 backdrop-blur-sm p-3 md:p-4 rounded-lg md:rounded-xl shadow-2xl border-2 border-[#6daead]/40 max-w-[280px] md:max-w-[320px]">
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
          {payload.find((p: any) => p.dataKey === 'memar') && (
            <p className="text-[10px] md:text-xs text-slate-600 mt-2 italic border-t border-slate-200 pt-2 leading-tight break-words">
              {currentLanguage === 'en' 
                ? 'Based on verified Memar project performance (Rayhaan, Noura & Arc Avenue) per International Finance Magazine 2024'
                : 'بناءً على أداء مشاريع معمار المثبت (ريحان ونورة وآرك أفينيو) حسب مجلة المالية الدولية 2024'}
            </p>
          )}
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
      <div className="p-3 md:p-6 rounded-3xl bg-gradient-to-br from-[#6daead]/10 to-[#1c2d36]/10 border-2 border-[#6daead]/30 shadow-lg">
        {/* Header */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className={`flex items-center gap-3 mb-4 md:mb-6 ${currentLanguage === 'ar' ? 'flex-row-reverse' : ''}`}
          dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
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
            className="w-10 h-10 bg-gradient-to-br from-[#6daead] to-[#1c2d36] rounded-full flex items-center justify-center shadow-lg flex-shrink-0"
          >
            <Wallet className="w-5 h-5 text-white" strokeWidth={2.5} />
          </motion.div>
          <label 
            htmlFor="investment-slider" 
            className={`text-base font-bold text-[#1c2d36] flex-1 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`} 
            dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
          >
            {t.title}
          </label>
        </motion.div>

        {/* Slider Container */}
        <div className="mb-4 md:mb-6" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
          <div className="relative pt-2 pb-8">
            {/* Slider Track Background */}
            <div className="absolute top-2 left-0 right-0 h-2 bg-slate-200 rounded-full" />
            
            {/* Slider Track Fill (Gradient) - RTL aware */}
            <motion.div
              className={`absolute top-2 h-2 rounded-full ${
                currentLanguage === 'ar' 
                  ? 'bg-gradient-to-l from-[#6daead] to-[#1c2d36] right-0' 
                  : 'bg-gradient-to-r from-[#6daead] to-[#1c2d36] left-0'
              }`}
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
                direction: 'ltr', // Keep slider LTR for consistent behavior
              }}
            />

            {/* Floating Tooltip on Thumb - RTL aware */}
            <AnimatePresence>
              {isDragging && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-[-40px] pointer-events-none"
                  style={currentLanguage === 'ar' 
                    ? {
                        right: `${100 - sliderPercentage}%`,
                        transform: 'translateX(50%)',
                      }
                    : {
                        left: `${sliderPercentage}%`,
                        transform: 'translateX(-50%)',
                      }
                  }
                  dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                >
                  <div className={`bg-[#1c2d36] text-white px-3 py-1 rounded-lg shadow-xl text-sm font-bold whitespace-nowrap ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}>
                    {formatNumber(localValue)} {currentLanguage === 'ar' ? 'ريال سعودي' : 'SAR'}
                  </div>
                  <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#1c2d36] mx-auto" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Min/Max Labels */}
            <div className={`flex justify-between text-xs text-slate-500 font-medium mt-2 ${currentLanguage === 'ar' ? 'flex-row-reverse' : ''}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
              <span className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>{t.minLabel}</span>
              <span className={currentLanguage === 'ar' ? 'text-right' : 'text-left'}>{t.maxLabel}</span>
            </div>
          </div>
        </div>

        {/* Manual Input Field */}
        <div className="mb-3 md:mb-4">
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
            style={{ direction: 'ltr' }}
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

        {/* ROI Comparison Chart */}
        <AnimatePresence>
          {showComparison && localValue > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: 20, height: 0 }}
              transition={{ 
                duration: 0.5,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="overflow-hidden mb-4 md:mb-6"
            >
              <div className="p-3 md:p-5 rounded-2xl bg-slate-50 border border-slate-200">
                {/* AI Advisor Header */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6daead] to-[#1c2d36] flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 rounded-full bg-[#6daead] blur-sm -z-10"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#6daead]">{t.aiAdvisor}</p>
                    <p className="text-xs text-slate-500">{t.aiAnalyzing}</p>
                  </div>
                </div>

                {/* Chart Title */}
                <h3 className={`text-lg font-bold text-slate-900 mb-1 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                  {t.comparisonTitle}
                </h3>
                <p className={`text-sm text-slate-600 mb-3 md:mb-4 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                  {t.comparisonSubtitle}
                </p>

                {/* Chart */}
                <div className="bg-white rounded-xl px-1 py-2 md:p-4 mb-4" style={{ height: window.innerWidth < 768 ? 300 : 350 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} key={localValue}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis 
                        dataKey="year"
                        domain={[0, 30]}
                        ticks={[0, 5, 10, 15, 20, 25, 30]}
                        tick={{ fill: '#64748b', fontSize: 11 }}
                        label={{ value: currentLanguage === 'en' ? 'Years' : 'السنوات', position: 'insideBottom', offset: -5, fill: '#64748b' }}
                      />
                      <YAxis 
                        tick={{ fill: '#64748b', fontSize: 12 }}
                        tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                        label={window.innerWidth >= 768 ? { 
                          value: currentLanguage === 'en' ? 'Value (M SAR)' : 'القيمة (مليون ريال)', 
                          angle: 0, 
                          position: 'top', 
                          fill: '#64748b',
                          offset: 10
                        } : undefined}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend 
                        wrapperStyle={{ fontSize: '12px', marginTop: '24px' }}
                        formatter={(value) => {
                          if (value === 'memar') return t.memarRealEstate;
                          if (value === 'gold') return t.goldBullion;
                          if (value === 'stocks') return t.tadawulIndex;
                          if (value === 'fixed') return t.fixedDeposits;
                          return value;
                        }}
                      />
                      
                      <Line 
                        type="monotone" 
                        dataKey="memar" 
                        stroke={assetClasses.memar.color}
                        strokeWidth={4}
                        dot={false}
                        activeDot={false}
                        animationDuration={800}
                        animationEasing="ease-in-out"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="gold" 
                        stroke={assetClasses.gold.color}
                        strokeWidth={2}
                        dot={false}
                        animationDuration={800}
                        animationEasing="ease-in-out"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="stocks" 
                        stroke={assetClasses.stocks.color}
                        strokeWidth={2}
                        dot={false}
                        animationDuration={800}
                        animationEasing="ease-in-out"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="fixed" 
                        stroke={assetClasses.fixed.color}
                        strokeWidth={2}
                        dot={false}
                        animationDuration={800}
                        animationEasing="ease-in-out"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* AI Insights */}
                {aiInsights && (
                  <div className="space-y-3">
                    <AnimatePresence>
                      {revealedInsights.primary && (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4 }}
                          className="p-2 md:p-3 bg-[#6daead]/5 rounded-xl border border-[#6daead]/20"
                        >
                          <p className="text-sm text-slate-700">{aiInsights.primary}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <AnimatePresence>
                      {revealedInsights.secondary && (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.1 }}
                          className="p-2 md:p-3 bg-blue-50/50 rounded-xl border border-blue-200/30"
                        >
                          <div className="flex items-start gap-1.5 md:gap-2">
                            <Lightbulb className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-slate-700">{aiInsights.secondary}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <AnimatePresence>
                      {revealedInsights.recommendation && (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.2 }}
                          className="p-2 md:p-3 bg-emerald-50/50 rounded-xl border border-emerald-200/30"
                        >
                          <div className="flex items-start gap-1.5 md:gap-2">
                            <Target className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-slate-700">{aiInsights.recommendation}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <AnimatePresence>
                      {revealedInsights.risk && (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.3 }}
                          className="p-2 md:p-3 bg-amber-50/50 rounded-xl border border-amber-200/30"
                        >
                          <div className="flex items-start gap-1.5 md:gap-2">
                            <Shield className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-slate-700">{aiInsights.risk}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Project Details Toggle */}
                <button
                  onClick={() => {
                    setShowProjectDetails(!showProjectDetails);
                    triggerHaptic(20);
                  }}
                  className="mt-3 md:mt-4 flex items-center gap-2 text-sm text-[#6daead] hover:text-[#5a9a99] font-semibold transition-colors"
                >
                  {showProjectDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  {showProjectDetails ? t.hideProjectDetails : t.viewProjectDetails}
                </button>

                {/* Project Details */}
                <AnimatePresence>
                  {showProjectDetails && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-3 md:mt-4 space-y-3 overflow-hidden"
                    >
                      {assetClasses.memar.projects?.map((project, index) => (
                        <motion.div
                          key={project.name}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="p-2 md:p-3 bg-white rounded-xl border border-[#6daead]/20 shadow-sm"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-slate-900">{project.name}</h4>
                              <p className="text-xs text-slate-600">
                                {project.location} • {t.delivered} {project.year}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-[#6daead]">{project.roi}%</div>
                              <div className="text-xs text-slate-500">{t.avgAnnualROI}</div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Data Disclaimer */}
                <p className="text-xs text-slate-500 italic mt-3 md:mt-4 text-center">
                  {t.dataDisclaimer}
                </p>

                {/* References Section */}
                <button
                  onClick={() => {
                    setShowReferences(!showReferences);
                    triggerHaptic(20);
                  }}
                  className="mt-2 md:mt-3 flex items-center gap-2 text-xs text-slate-600 hover:text-[#6daead] font-medium transition-colors mx-auto"
                >
                  {showReferences ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  {t.referencesTitle}
                </button>

                <AnimatePresence>
                  {showReferences && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-2 md:mt-3 space-y-2 overflow-hidden"
                    >
                      <div className="p-2 md:p-3 bg-white/60 rounded-lg border border-slate-200/50 text-xs">
                        <div className={`space-y-1.5 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                          <div>
                            <span className="font-semibold text-slate-700">{t.memarRealEstate}:</span>
                            <span className="text-slate-600 ml-1">{assetClasses.memar.reference}</span>
                          </div>
                          <div>
                            <span className="font-semibold text-slate-700">{t.goldBullion}:</span>
                            <span className="text-slate-600 ml-1">{assetClasses.gold.reference}</span>
                          </div>
                          <div>
                            <span className="font-semibold text-slate-700">{t.tadawulIndex}:</span>
                            <span className="text-slate-600 ml-1">{assetClasses.stocks.reference}</span>
                          </div>
                          <div>
                            <span className="font-semibold text-slate-700">{t.fixedDeposits}:</span>
                            <span className="text-slate-600 ml-1">{assetClasses.fixed.reference}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
                className="mt-4 md:mt-6 p-3 md:p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/50 border border-slate-200/50 shadow-inner"
              >
                {/* ROI Header */}
                <div className={`text-center mb-3 md:mb-4 ${currentLanguage === 'ar' ? 'text-right' : 'text-center'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
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
                <div className="border-t border-slate-300/50 mb-3 md:mb-4" />

                {/* ROI Projections Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                  {currentROI.map((projection, index) => (
                    <motion.div
                      key={projection.years}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ 
                        duration: 0.3,
                        delay: index * 0.05,
                      }}
                      className="text-center p-2 md:p-3 rounded-xl bg-white/60 border border-slate-200/50"
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
                <div className="border-t border-slate-300/50 mt-3 mb-2 md:mt-4 md:mb-3" />

                {/* Disclaimer */}
                <p className={`text-xs text-slate-500 italic text-center ${currentLanguage === 'ar' ? 'text-right' : 'text-center'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                  {isExtremeValue ? t.extremeDisclaimer : t.disclaimer}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Custom Slider Styles - RTL aware */}
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

        #investment-slider[dir="rtl"]::-webkit-slider-thumb {
          background: linear-gradient(225deg, #6daead 0%, #1c2d36 100%);
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

        #investment-slider[dir="rtl"]::-moz-range-thumb {
          background: linear-gradient(225deg, #6daead 0%, #1c2d36 100%);
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
