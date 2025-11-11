import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { exteriorColors } from '../utils/soueastData';

interface SoueastColorSelectorProps {
  selectedColors: string[];
  onSelectionChange: (selectedColors: string[]) => void;
  currentLanguage: 'en' | 'ar';
  onInteraction?: () => void;
}

const SoueastColorSelector: React.FC<SoueastColorSelectorProps> = ({
  selectedColors,
  onSelectionChange,
  currentLanguage,
  onInteraction,
}) => {
  const handleColorToggle = (colorCode: string) => {
    if (onInteraction) {
      onInteraction();
    }
    
    if (selectedColors.includes(colorCode)) {
      onSelectionChange(selectedColors.filter(c => c !== colorCode));
    } else {
      onSelectionChange([...selectedColors, colorCode]);
    }
  };

  const isSelected = (colorCode: string) => selectedColors.includes(colorCode);

  const content = {
    en: {
      title: 'Preferred Exterior Colors',
      subtitle: 'Select your preferred exterior colors (you can select multiple)',
    },
    ar: {
      title: 'ألوان الهيكل الخارجي المفضلة',
      subtitle: 'اختر ألوان الهيكل الخارجي المفضلة لديك (يمكنك اختيار عدة ألوان)',
    },
  };

  const t = content[currentLanguage];

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

      <div className="flex flex-wrap gap-4">
        {exteriorColors.map((color, index) => {
          const selected = isSelected(color.code);
          const isDark = color.code === '#000000';
          const isLight = color.code === '#FFFFFF';
          
          return (
            <motion.div
              key={color.code}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleColorToggle(color.code)}
              className={`
                relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-300
                ${selected 
                  ? 'border-[#ee7138] shadow-lg ring-2 ring-[#ee7138] ring-opacity-30' 
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                }
              `}
            >
              {/* Color Swatch */}
              <div
                className="w-24 h-24 md:w-32 md:h-32 relative"
                style={{ backgroundColor: color.code }}
              >
                {/* Checkmark Overlay */}
                <AnimatePresence>
                  {selected && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20"
                    >
                      <div className={`
                        rounded-full p-2
                        ${isDark || isLight ? 'bg-[#ee7138]' : 'bg-white'}
                      `}>
                        <Check className={`
                          w-6 h-6
                          ${isDark || isLight ? 'text-white' : 'text-[#ee7138]'}
                        `} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Border for white color */}
                {isLight && (
                  <div className="absolute inset-0 border-2 border-slate-300 rounded-xl" />
                )}
              </div>

              {/* Color Name */}
              <div className={`
                px-3 py-2 text-center text-sm font-semibold
                ${selected ? 'bg-[#ee7138] text-white' : 'bg-slate-50 text-slate-900'}
                ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}
              `} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                {color.displayName}
              </div>

              {/* Selection Indicator */}
              {selected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-[#ee7138] rounded-full p-1 shadow-lg z-10"
                >
                  <Check className="w-4 h-4 text-white" />
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Selected Colors Summary */}
      {selectedColors.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-3 border border-orange-200"
        >
          <p className={`text-sm text-slate-700 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
            <span className="font-semibold text-[#ee7138]">
              {selectedColors.length} {currentLanguage === 'en' ? 'color' : 'لون'} {currentLanguage === 'en' ? 'selected' : 'محدد'}
            </span>
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default SoueastColorSelector;

