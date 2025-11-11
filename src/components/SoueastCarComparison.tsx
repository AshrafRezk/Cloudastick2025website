import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, X } from 'lucide-react';
import { CarModel, getCarByModel } from '../utils/soueastData';

interface SoueastCarComparisonProps {
  selectedCarModels: string[];
  currentLanguage: 'en' | 'ar';
  onRemoveCar?: (model: string) => void;
}

const SoueastCarComparison: React.FC<SoueastCarComparisonProps> = ({
  selectedCarModels,
  currentLanguage,
  onRemoveCar,
}) => {
  const selectedCars = useMemo(() => {
    return selectedCarModels
      .map(model => getCarByModel(model))
      .filter((car): car is CarModel => car !== undefined);
  }, [selectedCarModels]);

  const formatPrice = (price: number): string => {
    return price.toLocaleString('en-US');
  };

  const content = {
    en: {
      title: 'Compare Your Selected Cars',
      subtitle: 'Side-by-side comparison of your selected vehicles',
      noCars: 'Select at least 2 cars to compare',
      model: 'Model',
      engine: 'Engine',
      power: 'Power',
      torque: 'Torque',
      transmission: 'Transmission',
      driveType: 'Drive Type',
      dimensions: 'Dimensions',
      wheelbase: 'Wheelbase',
      fuelTank: 'Fuel Tank',
      seats: 'Seats',
      keyFeatures: 'Key Features',
      basePrice: 'Base Price (Before VAT)',
      totalPrice: 'Total Price (After VAT)',
      hp: 'hp',
      nm: 'Nm',
      mm: 'mm',
      l: 'L',
      remove: 'Remove',
    },
    ar: {
      title: 'قارن سياراتك المحددة',
      subtitle: 'مقارنة جنبًا إلى جنب لسياراتك المحددة',
      noCars: 'اختر سيارتين على الأقل للمقارنة',
      model: 'الموديل',
      engine: 'المحرك',
      power: 'القوة',
      torque: 'عزم الدوران',
      transmission: 'ناقل الحركة',
      driveType: 'نوع الدفع',
      dimensions: 'الأبعاد',
      wheelbase: 'قاعدة العجلات',
      fuelTank: 'خزان الوقود',
      seats: 'المقاعد',
      keyFeatures: 'الميزات الرئيسية',
      basePrice: 'السعر الأساسي (قبل الضريبة)',
      totalPrice: 'السعر الإجمالي (بعد الضريبة)',
      hp: 'حصان',
      nm: 'نيوتن متر',
      mm: 'مم',
      l: 'لتر',
      remove: 'إزالة',
    },
  };

  const t = content[currentLanguage];

  if (selectedCars.length < 2) {
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

  // Comparison rows
  const comparisonRows = [
    { label: t.model, getValue: (car: CarModel) => car.model },
    { label: t.engine, getValue: (car: CarModel) => car.engine },
    { label: t.power, getValue: (car: CarModel) => `${car.power} ${t.hp}` },
    { label: t.torque, getValue: (car: CarModel) => `${car.torque} ${t.nm}` },
    { label: t.transmission, getValue: (car: CarModel) => car.transmission },
    { label: t.driveType, getValue: (car: CarModel) => car.driveType },
    { label: t.dimensions, getValue: (car: CarModel) => `${car.dimensions} ${t.mm}` },
    { label: t.wheelbase, getValue: (car: CarModel) => `${car.wheelbase} ${t.mm}` },
    { label: t.fuelTank, getValue: (car: CarModel) => car.fuelTank ? `${car.fuelTank} ${t.l}` : 'N/A' },
    { label: t.seats, getValue: (car: CarModel) => car.seats.toString() },
    { label: t.keyFeatures, getValue: (car: CarModel) => car.keyFeatures },
    { label: t.basePrice, getValue: (car: CarModel) => `${formatPrice(car.basePrice)} SAR` },
    { label: t.totalPrice, getValue: (car: CarModel) => `${formatPrice(car.totalPrice)} SAR` },
  ];

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

      {/* Comparison Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-lg">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="bg-gradient-to-r from-[#ee7138] to-[#d85a20] text-white">
              <th className={`px-4 py-3 text-left text-sm font-semibold ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                {t.model}
              </th>
              {selectedCars.map((car, index) => (
                <th key={car.model} className="px-4 py-3 text-center relative">
                  <div className="flex flex-col items-center gap-2">
                    {onRemoveCar && selectedCars.length > 2 && (
                      <button
                        onClick={() => onRemoveCar(car.model)}
                        className="absolute top-2 right-2 p-1 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors"
                        aria-label={t.remove}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    <div className="w-16 h-16 bg-white rounded-lg overflow-hidden shadow-md">
                      <img
                        src={car.image}
                        alt={car.model}
                        className="w-full h-full object-contain p-2"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }}
                      />
                    </div>
                    <span className="font-semibold text-sm">{car.model}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparisonRows.map((row, rowIndex) => (
              <motion.tr
                key={rowIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: rowIndex * 0.05 }}
                className={rowIndex % 2 === 0 ? 'bg-slate-50' : 'bg-white'}
              >
                <td className={`px-4 py-3 font-semibold text-slate-700 border-r border-slate-200 ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                  {row.label}
                </td>
                {selectedCars.map((car) => {
                  const value = row.getValue(car);
                  // Check if this value is different from others in the row
                  const allValues = selectedCars.map(c => row.getValue(c));
                  const isDifferent = allValues.some(v => v !== value);
                  
                  return (
                    <td
                      key={car.model}
                      className={`px-4 py-3 text-center border-r border-slate-200 last:border-r-0 ${
                        isDifferent && selectedCars.length > 1
                          ? 'bg-yellow-50 font-semibold text-[#ee7138]'
                          : 'text-slate-700'
                      } ${currentLanguage === 'ar' ? 'text-right' : 'text-left'}`}
                      dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                    >
                      {value}
                    </td>
                  );
                })}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile-friendly scroll indicator */}
      <div className="mt-2 text-center">
        <p className="text-xs text-slate-500">
          {currentLanguage === 'en' ? '← Scroll horizontally to see all details →' : '← قم بالتمرير أفقيًا لرؤية جميع التفاصيل →'}
        </p>
      </div>
    </div>
  );
};

export default SoueastCarComparison;

