import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp, 
  Settings, 
  Sparkles, 
  Star,
  Share2,
  Copy,
  Download,
  Globe,
  Building2
} from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { industries, getIndustryById } from '../data/industries';
import Button from '../components/Button';

const SalesforceComparisonTable = () => {
  const { t, isRTL, language } = useLanguage();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [showIndustrySelector, setShowIndustrySelector] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  // Get industry from URL params
  const industryParam = searchParams.get('industry');
  const langParam = searchParams.get('lang');

  useEffect(() => {
    if (industryParam) {
      const industry = getIndustryById(industryParam);
      if (industry) {
        setSelectedIndustry(industryParam);
        setShowIndustrySelector(false);
      } else {
        setShowIndustrySelector(true);
      }
    } else {
      setShowIndustrySelector(true);
    }
  }, [industryParam]);

  const selectedIndustryData = selectedIndustry ? getIndustryById(selectedIndustry) : null;

  const handleIndustrySelect = (industryId: string) => {
    setSelectedIndustry(industryId);
    setShowIndustrySelector(false);
    
    // Update URL with industry parameter
    const newParams = new URLSearchParams(searchParams);
    newParams.set('industry', industryId);
    if (langParam) {
      newParams.set('lang', langParam);
    }
    navigate(`?${newParams.toString()}`, { replace: true });
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const url = `${window.location.origin}/salesforce-comparison?industry=${selectedIndustry}&lang=${language}`;
      
      // Try to use Web Share API if available (mobile)
      if (navigator.share) {
        await navigator.share({
          title: t('power.table.shareTitle'),
          text: t('power.table.shareDesc'),
          url: url
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(url);
        
        // Show success message
        const button = document.querySelector('[data-share-button]') as HTMLElement;
        if (button) {
          const originalText = button.textContent;
          button.textContent = t('power.table.copied');
          setTimeout(() => {
            button.textContent = originalText;
          }, 2000);
        }
      }
    } catch (err) {
      console.error('Failed to share:', err);
      // Fallback to alert
      alert(t('power.table.shareTitle') + ': ' + url);
    } finally {
      setIsSharing(false);
    }
  };

  const handleDownloadPDF = () => {
    // This would typically generate and download a PDF
    // For now, we'll just show a message
    alert(t('table.download') + ' - Feature coming soon!');
  };

  // Industry-specific comparison data
  const getIndustrySpecificData = (industryId: string | null) => {
    const baseData = [
      {
        metric: t('power.comparison.metric'),
        salesforce: { score: 10, label: 'Excellent', color: 'text-cyan-400' },
        hubspot: { score: 8, label: 'Very Good', color: 'text-gray-400' },
        zoho: { score: 8, label: 'Very Good', color: 'text-gray-400' },
        freshworks: { score: 8, label: 'Very Good', color: 'text-gray-400' },
        odoo: { score: 7, label: 'Good', color: 'text-gray-400' },
        salezbuzz: { score: 7, label: 'Good', color: 'text-gray-400' }
      },
    ];

    // Industry-specific metrics
    const industryMetrics = {
      'real-estate': [
        { metric: 'Lead Management', salesforce: 10, hubspot: 7, zoho: 6, freshworks: 6, odoo: 5, salezbuzz: 7 },
        { metric: 'Property Portfolio', salesforce: 9, hubspot: 5, zoho: 6, freshworks: 4, odoo: 7, salezbuzz: 5 },
        { metric: 'Commission Tracking', salesforce: 10, hubspot: 6, zoho: 7, freshworks: 5, odoo: 8, salezbuzz: 6 },
        { metric: 'Client Relationship', salesforce: 10, hubspot: 8, zoho: 7, freshworks: 7, odoo: 6, salezbuzz: 7 }
      ],
      'healthcare': [
        { metric: 'HIPAA Compliance', salesforce: 10, hubspot: 6, zoho: 5, freshworks: 4, odoo: 3, salezbuzz: 5 },
        { metric: 'Patient Data Mgmt', salesforce: 10, hubspot: 7, zoho: 6, freshworks: 5, odoo: 6, salezbuzz: 6 },
        { metric: 'Care Coordination', salesforce: 9, hubspot: 6, zoho: 5, freshworks: 4, odoo: 5, salezbuzz: 5 },
        { metric: 'Revenue Cycle', salesforce: 10, hubspot: 7, zoho: 6, freshworks: 5, odoo: 7, salezbuzz: 6 }
      ],
      'manufacturing': [
        { metric: 'Supply Chain', salesforce: 9, hubspot: 5, zoho: 6, freshworks: 4, odoo: 8, salezbuzz: 5 },
        { metric: 'Quality Control', salesforce: 10, hubspot: 6, zoho: 7, freshworks: 5, odoo: 8, salezbuzz: 6 },
        { metric: 'Equipment Maint', salesforce: 8, hubspot: 4, zoho: 5, freshworks: 3, odoo: 7, salezbuzz: 4 },
        { metric: 'Production Planning', salesforce: 9, hubspot: 5, zoho: 6, freshworks: 4, odoo: 8, salezbuzz: 5 }
      ],
      'retail': [
        { metric: 'Customer Journey', salesforce: 10, hubspot: 8, zoho: 7, freshworks: 6, odoo: 6, salezbuzz: 7 },
        { metric: 'Inventory Mgmt', salesforce: 9, hubspot: 6, zoho: 7, freshworks: 5, odoo: 8, salezbuzz: 6 },
        { metric: 'Omnichannel', salesforce: 10, hubspot: 7, zoho: 6, freshworks: 5, odoo: 6, salezbuzz: 6 },
        { metric: 'Sales Performance', salesforce: 10, hubspot: 8, zoho: 7, freshworks: 7, odoo: 6, salezbuzz: 7 }
      ]
    };

    const industrySpecific = industryId && industryMetrics[industryId as keyof typeof industryMetrics] 
      ? industryMetrics[industryId as keyof typeof industryMetrics].map(item => ({
          metric: item.metric,
          salesforce: { score: item.salesforce, label: getScoreLabel(item.salesforce), color: 'text-cyan-400' },
          hubspot: { score: item.hubspot, label: getScoreLabel(item.hubspot), color: 'text-gray-400' },
          zoho: { score: item.zoho, label: getScoreLabel(item.zoho), color: 'text-gray-400' },
          freshworks: { score: item.freshworks, label: getScoreLabel(item.freshworks), color: 'text-gray-400' },
          odoo: { score: item.odoo, label: getScoreLabel(item.odoo), color: 'text-gray-400' },
          salezbuzz: { score: item.salezbuzz, label: getScoreLabel(item.salezbuzz), color: 'text-gray-400' }
        }))
      : [];

    return [...baseData, ...industrySpecific];
  };

  const getScoreLabel = (score: number) => {
    if (score >= 9) return 'Excellent';
    if (score >= 7) return 'Very Good';
    if (score >= 5) return 'Good';
    if (score >= 3) return 'Fair';
    return 'Poor';
  };

  const comparisonData = getIndustrySpecificData(selectedIndustry);

  if (showIndustrySelector) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-8">
              <Globe className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {t('power.table.selectIndustry')}
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                {t('power.table.selectIndustry.desc')}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
              {industries.slice(0, 8).map((industry, index) => (
                <motion.div
                  key={industry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleIndustrySelect(industry.id)}
                  className={`bg-gradient-to-br ${industry.gradient} rounded-2xl p-6 cursor-pointer group transition-all duration-300 hover:shadow-2xl border border-white/20`}
                >
                  <industry.icon className="w-12 h-12 text-white mb-4 mx-auto group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-200 transition-colors duration-300">
                    {industry.shortName}
                  </h3>
                  <p className="text-white/80 text-sm">
                    {industry.description.split('.')[0]}.
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-12"
            >
              <Button
                onClick={() => navigate('/salesforce-power')}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                {t('common.back')} to Full Journey
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                {selectedIndustryData 
                  ? t('power.table.title.industry', { industry: selectedIndustryData.name })
                  : t('power.table.title')
                }
              </h1>
              {selectedIndustryData && (
                <div className="flex items-center gap-2 text-cyan-400">
                  <Building2 className="w-5 h-5" />
                  <span>{selectedIndustryData.name} Industry</span>
                </div>
              )}
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={handleShare}
                disabled={isSharing}
                data-share-button
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                {t('power.table.share')}
              </Button>
              
              <Button
                onClick={handleDownloadPDF}
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                {t('power.table.download')}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-gray-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-700"
        >
          {/* Table Header */}
          <div className="grid grid-cols-7 gap-4 p-6 bg-gray-800/80 border-b border-gray-700">
            <div className="col-span-1 text-gray-400 text-sm font-semibold">
              {t('comparison.metric')}
            </div>
            <div className="col-span-1 text-center">
              <div className="text-cyan-400 font-bold text-lg mb-1">Salesforce</div>
              <div className="text-xs text-gray-400">#1 CRM</div>
            </div>
            <div className="col-span-1 text-center">
              <div className="text-gray-300 font-bold text-lg mb-1">HubSpot</div>
              <div className="text-xs text-gray-400">Inbound</div>
            </div>
            <div className="col-span-1 text-center">
              <div className="text-gray-300 font-bold text-lg mb-1">Zoho</div>
              <div className="text-xs text-gray-400">Suite</div>
            </div>
            <div className="col-span-1 text-center">
              <div className="text-gray-300 font-bold text-lg mb-1">Freshworks</div>
              <div className="text-xs text-gray-400">Support</div>
            </div>
            <div className="col-span-1 text-center">
              <div className="text-gray-300 font-bold text-lg mb-1">Odoo</div>
              <div className="text-xs text-gray-400">Open Source</div>
            </div>
            <div className="col-span-1 text-center">
              <div className="text-gray-300 font-bold text-lg mb-1">SalezBuzz</div>
              <div className="text-xs text-gray-400">Pipeline Focus</div>
            </div>
          </div>

          {/* Comparison Rows */}
          {comparisonData.map((row, index) => (
            <motion.div
              key={row.metric}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="grid grid-cols-7 gap-4 p-6 border-b border-gray-700/50 last:border-b-0 hover:bg-gray-800/30 transition-colors duration-200"
            >
              <div className="col-span-1 flex items-center">
                <span className="text-white font-medium">{row.metric}</span>
              </div>
              {[row.salesforce, row.hubspot, row.zoho, row.freshworks, row.odoo, row.salezbuzz].map((item, idx) => (
                <div key={idx} className="col-span-1 flex flex-col items-center justify-center">
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          i < Math.floor(item.score / 2)
                            ? idx === 0 ? 'bg-cyan-400' : 'bg-yellow-400'
                            : 'bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <div className={`text-xs font-semibold ${idx === 0 ? 'text-cyan-400' : 'text-gray-300'}`}>
                    {item.score}/10
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{item.label}</div>
                </div>
              ))}
            </motion.div>
          ))}
        </motion.div>

        {/* Key Differentiators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12"
        >
          <h3 className="text-3xl font-bold text-white text-center mb-8">
            {t('power.comparison.differentiators')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: t('power.comparison.completePlatform'),
                description: t('power.comparison.completePlatform.desc'),
                icon: Settings,
                stat: '20+ Clouds'
              },
              {
                title: t('power.comparison.einstein'),
                description: t('power.comparison.einstein.desc'),
                icon: Sparkles,
                stat: 'AI-Powered'
              },
              {
                title: t('power.comparison.appexchange'),
                description: t('power.comparison.appexchange.desc'),
                icon: Star,
                stat: '5000+ Apps'
              },
              {
                title: t('power.comparison.scalability'),
                description: t('power.comparison.scalability.desc'),
                icon: TrendingUp,
                stat: 'Enterprise'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-cyan-500/50 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">{item.title}</h4>
                    <p className="text-cyan-400 text-sm font-semibold">{item.stat}</p>
                  </div>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ROI Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-12 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-8 text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <TrendingUp className="w-8 h-8 text-cyan-400" />
            <h3 className="text-3xl font-bold text-white">{t('power.comparison.averageROI')}</h3>
          </div>
          <p className="text-lg text-gray-300 mb-6">
            {t('power.comparison.roiDescription')}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {[
              { name: 'Salesforce', roi: '251%', color: 'text-cyan-400', bgColor: 'bg-cyan-400' },
              { name: 'HubSpot', roi: '150%', color: 'text-gray-400', bgColor: 'bg-gray-400' },
              { name: 'Zoho', roi: '120%', color: 'text-gray-400', bgColor: 'bg-gray-400' },
              { name: 'Freshworks', roi: '110%', color: 'text-gray-400', bgColor: 'bg-gray-400' },
              { name: 'Odoo', roi: '140%', color: 'text-gray-400', bgColor: 'bg-gray-400' },
              { name: 'SalezBuzz', roi: '130%', color: 'text-gray-400', bgColor: 'bg-gray-400' }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className={`text-2xl font-bold ${item.color} mb-2`}>{item.roi}</div>
                <div className={`h-2 ${item.bgColor} rounded-full mb-2`} style={{ width: item.name === 'Salesforce' ? '100%' : `${parseInt(item.roi) / 2.51}%` }}></div>
                <div className="text-sm text-gray-400">{item.name}</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-6">
            *ROI data based on industry studies and customer surveys. Actual results may vary.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SalesforceComparisonTable;
