import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation data
const translations = {
  en: {
    // Hero Section
    'hero.badge': 'Beyond CRM - Complete Platform',
    'hero.title': 'Discover the Full Power of Salesforce',
    'hero.subtitle': 'Choose your industry to explore how Salesforce transforms businesses beyond traditional CRM',
    'hero.cta': 'Get Started Now',
    'hero.explore': 'Explore Solutions',
    
    // Platform Overview
    'platform.title': 'More Than Just CRM',
    'platform.title.industry': 'More Than Just CRM for {industry}',
    'platform.subtitle': 'Salesforce is a complete platform with specialized clouds for every business need',
    'platform.subtitle.industry': 'Salesforce provides specialized solutions for {industry} with industry-specific clouds and workflows that address your unique challenges.',
    'platform.challenges': 'Key Challenges We Solve for {industry}:',
    
    // ERP Integration
    'erp.title': 'Seamlessly Connects to Your Existing Systems',
    'erp.title.industry': 'Seamlessly Connects to Your {industry} Systems',
    'erp.subtitle': 'Salesforce integrates with all major ERP systems for unified business operations',
    'erp.subtitle.industry': 'Salesforce integrates with major ERP systems used in {industry} to unify your data and streamline {industry} workflows',
    'erp.integrations': 'Common {industry} Integrations:',
    
    // Data Cloud
    'data.title': 'Data Cloud: Connect Everything',
    'data.title.industry': 'Data Cloud: Connect Your {industry} Data',
    'data.subtitle': 'One unified view of your customer, regardless of where data lives',
    'data.subtitle.industry': 'One unified view of your {industry} customers and operations, regardless of where data lives across your systems',
    'data.sources': '{industry} Data Sources We Connect:',
    
    // Industry Solutions
    'industry.title': 'Tailored Solutions for {industry}',
    'industry.products': 'Industry Products',
    'industry.metrics': 'Success Metrics',
    'industry.useCases': 'Use Cases',
    
    // Competitive Analysis
    'comparison.title': 'Salesforce vs The Competition',
    'comparison.subtitle': 'See how Salesforce outperforms other CRM and business platforms',
    'comparison.metric': 'Metric',
    'comparison.salesforce': 'Salesforce',
    'comparison.hubspot': 'HubSpot',
    'comparison.zoho': 'Zoho',
    'comparison.freshworks': 'Freshworks',
    'comparison.odoo': 'Odoo',
    'comparison.roi': 'ROI Potential',
    'comparison.differentiators': 'Why Salesforce Delivers Superior ROI',
    'comparison.completePlatform': 'Complete Platform',
    'comparison.completePlatform.desc': 'Not just CRM - Sales, Service, Marketing, Commerce, Analytics all integrated',
    'comparison.einstein': 'Einstein AI',
    'comparison.einstein.desc': 'Built-in AI for predictions, recommendations, and automation',
    'comparison.appexchange': 'AppExchange',
    'comparison.appexchange.desc': '5000+ apps and integrations in the ecosystem',
    'comparison.scalability': 'Enterprise Scale',
    'comparison.scalability.desc': 'From startup to Fortune 500, scales with your business',
    'comparison.averageROI': '251% Average ROI',
    'comparison.roiDescription': 'Salesforce customers see an average ROI of 251% within 3 years - significantly higher than competitors',
    
    // Table
    'table.title': 'Salesforce vs Competitors Comparison',
    'table.title.industry': 'Salesforce vs Competitors - {industry} Industry',
    'table.selectIndustry': 'Select Your Industry',
    'table.selectIndustry.desc': 'Choose your industry to see a personalized comparison of Salesforce vs competitors',
    'table.share': 'Share This Comparison',
    'table.copy': 'Copy Link',
    'table.download': 'Download PDF',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.close': 'Close',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.finish': 'Finish',
    'common.yes': 'Yes',
    'common.no': 'No',
  },
  ar: {
    // Hero Section
    'hero.badge': 'أكثر من مجرد CRM - منصة شاملة',
    'hero.title': 'اكتشف القوة الكاملة لـ Salesforce',
    'hero.subtitle': 'اختر صناعتك لاستكشاف كيف يحول Salesforce الشركات إلى ما هو أبعد من CRM التقليدي',
    'hero.cta': 'ابدأ الآن',
    'hero.explore': 'استكشف الحلول',
    
    // Platform Overview
    'platform.title': 'أكثر من مجرد CRM',
    'platform.title.industry': 'أكثر من مجرد CRM لـ {industry}',
    'platform.subtitle': 'Salesforce هو منصة شاملة مع سحابات متخصصة لكل احتياجات الأعمال',
    'platform.subtitle.industry': 'يوفر Salesforce حلولاً متخصصة لـ {industry} مع سحابات مخصصة للصناعة وسير عمل تعالج تحدياتك الفريدة.',
    'platform.challenges': 'التحديات الرئيسية التي نحلها لـ {industry}:',
    
    // ERP Integration
    'erp.title': 'يتصل بسلاسة مع أنظمتك الموجودة',
    'erp.title.industry': 'يتصل بسلاسة مع أنظمة {industry}',
    'erp.subtitle': 'يتكامل Salesforce مع جميع أنظمة ERP الرئيسية للعمليات التجارية الموحدة',
    'erp.subtitle.industry': 'يتكامل Salesforce مع أنظمة ERP الرئيسية المستخدمة في {industry} لتوحيد بياناتك وتبسيط سير عمل {industry}',
    'erp.integrations': 'تكاملات {industry} الشائعة:',
    
    // Data Cloud
    'data.title': 'Data Cloud: ربط كل شيء',
    'data.title.industry': 'Data Cloud: ربط بيانات {industry}',
    'data.subtitle': 'نظرة موحدة لعملائك، بغض النظر عن مكان وجود البيانات',
    'data.subtitle.industry': 'نظرة موحدة لعملاء {industry} وعملياتك، بغض النظر عن مكان وجود البيانات عبر أنظمتك',
    'data.sources': 'مصادر بيانات {industry} التي نربطها:',
    
    // Industry Solutions
    'industry.title': 'حلول مخصصة لـ {industry}',
    'industry.products': 'منتجات الصناعة',
    'industry.metrics': 'مقاييس النجاح',
    'industry.useCases': 'حالات الاستخدام',
    
    // Competitive Analysis
    'comparison.title': 'Salesforce مقابل المنافسين',
    'comparison.subtitle': 'شاهد كيف يتفوق Salesforce على منصات CRM والأعمال الأخرى',
    'comparison.metric': 'المقياس',
    'comparison.salesforce': 'Salesforce',
    'comparison.hubspot': 'HubSpot',
    'comparison.zoho': 'Zoho',
    'comparison.freshworks': 'Freshworks',
    'comparison.odoo': 'Odoo',
    'comparison.roi': 'إمكانات العائد على الاستثمار',
    'comparison.differentiators': 'لماذا يوفر Salesforce عائد استثمار متفوق',
    'comparison.completePlatform': 'منصة شاملة',
    'comparison.completePlatform.desc': 'ليس فقط CRM - المبيعات، الخدمة، التسويق، التجارة، التحليلات كلها متكاملة',
    'comparison.einstein': 'Einstein AI',
    'comparison.einstein.desc': 'ذكاء اصطناعي مدمج للتنبؤات والتوصيات والأتمتة',
    'comparison.appexchange': 'AppExchange',
    'comparison.appexchange.desc': '5000+ تطبيق وتكامل في النظام البيئي',
    'comparison.scalability': 'مقياس المؤسسة',
    'comparison.scalability.desc': 'من الشركات الناشئة إلى Fortune 500، يتوسع مع عملك',
    'comparison.averageROI': '251% متوسط العائد على الاستثمار',
    'comparison.roiDescription': 'عملاء Salesforce يحصلون على متوسط عائد استثمار 251% خلال 3 سنوات - أعلى بكثير من المنافسين',
    
    // Table
    'table.title': 'مقارنة Salesforce مقابل المنافسين',
    'table.title.industry': 'Salesforce مقابل المنافسين - صناعة {industry}',
    'table.selectIndustry': 'اختر صناعتك',
    'table.selectIndustry.desc': 'اختر صناعتك لرؤية مقارنة شخصية لـ Salesforce مقابل المنافسين',
    'table.share': 'شارك هذه المقارنة',
    'table.copy': 'نسخ الرابط',
    'table.download': 'تحميل PDF',
    
    // Common
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.close': 'إغلاق',
    'common.back': 'رجوع',
    'common.next': 'التالي',
    'common.finish': 'إنهاء',
    'common.yes': 'نعم',
    'common.no': 'لا',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [isRTL, setIsRTL] = useState(false);

  useEffect(() => {
    // Check for saved language preference
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['en', 'ar'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
    
    // Check URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang') as Language;
    if (langParam && ['en', 'ar'].includes(langParam)) {
      setLanguage(langParam);
    }
  }, []);

  useEffect(() => {
    setIsRTL(language === 'ar');
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string, params?: Record<string, string>): string => {
    // Direct lookup using bracket notation
    const currentTranslations = translations[language];
    let value = currentTranslations[key];
    
    // If not found, try English fallback
    if (!value) {
      value = translations.en[key];
    }
    
    // If still not found, return the key
    if (!value) {
      return key;
    }
    
    // Replace parameters
    if (params) {
      return value.replace(/\{(\w+)\}/g, (match, param) => params[param] || match);
    }
    
    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
