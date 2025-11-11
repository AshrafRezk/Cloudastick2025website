export interface CarModel {
  model: string;
  engine: string;
  power: number;
  torque: number;
  transmission: string;
  driveType: string;
  dimensions: string;
  wheelbase: number;
  fuelTank: number | null;
  seats: number;
  keyFeatures: string;
  basePrice: number; // Before VAT
  vat: number;
  totalPrice: number; // After VAT
  image: string; // Mapped to S06/S07/S09.png
  category: 'S06' | 'S07' | 'S09';
}

export const carModels: CarModel[] = [
  {
    model: 'S06 1.5T COM',
    engine: '1.5L Turbo 4-cyl',
    power: 156,
    torque: 230,
    transmission: '6-speed DCT',
    driveType: 'FWD',
    dimensions: '4616×1910×1685',
    wheelbase: 2720,
    fuelTank: 57,
    seats: 5,
    keyFeatures: 'Leather, 12.8" infotainment, 4-spkr audio, rear sensors, cruise, ESP, keyless start',
    basePrice: 64900,
    vat: 9735.0,
    totalPrice: 74635.0,
    image: '/Assets/Customers/Soueast/S06.png',
    category: 'S06',
  },
  {
    model: 'S06 1.6T PREMIUM',
    engine: '1.6L Turbo 4-cyl',
    power: 197,
    torque: 290,
    transmission: '7-speed DCT',
    driveType: 'FWD',
    dimensions: '4616×1910×1690',
    wheelbase: 2720,
    fuelTank: 57,
    seats: 5,
    keyFeatures: 'Ventilated electric seats, panoramic sunroof, 360° camera, adaptive cruise, LED matrix, ambient lighting',
    basePrice: 82900,
    vat: 12435.0,
    totalPrice: 95335.0,
    image: '/Assets/Customers/Soueast/S06.png',
    category: 'S06',
  },
  {
    model: 'S06 DM (PHEV)',
    engine: 'Hybrid 1.5L + Motor',
    power: 265,
    torque: 530,
    transmission: 'Dedicated Hybrid Transmission',
    driveType: 'FWD',
    dimensions: '4616×1910×1690',
    wheelbase: 2720,
    fuelTank: null,
    seats: 5,
    keyFeatures: 'Plug-in hybrid, 14kWh battery, 4.9–1.0L/100km, R20 wheels, 360° camera, 9-speaker audio, armrest fridge',
    basePrice: 97900,
    vat: 14685.0,
    totalPrice: 112585.0,
    image: '/Assets/Customers/Soueast/S06.png',
    category: 'S06',
  },
  {
    model: 'S07 1.5T COM',
    engine: '1.5L Turbo 4-cyl',
    power: 156,
    torque: 230,
    transmission: '6-speed DCT',
    driveType: 'FWD',
    dimensions: '4724×1900×1720',
    wheelbase: 2720,
    fuelTank: 57,
    seats: 5,
    keyFeatures: 'Leather, 12.3" screen, 8-spkr system, power mirrors, dual-zone A/C + N95 filter',
    basePrice: 74900,
    vat: 11235.0,
    totalPrice: 86135.0,
    image: '/Assets/Customers/Soueast/S07.png',
    category: 'S07',
  },
  {
    model: 'S07 1.6T LUX',
    engine: '1.6L Turbo 4-cyl',
    power: 197,
    torque: 290,
    transmission: '7-speed DCT',
    driveType: 'FWD',
    dimensions: '4724×1900×1720',
    wheelbase: 2720,
    fuelTank: 57,
    seats: 5,
    keyFeatures: 'Electric ventilated seats, 360° camera, panoramic roof, ambient lighting, adaptive cruise, lane assist',
    basePrice: 84900,
    vat: 12735.0,
    totalPrice: 97635.0,
    image: '/Assets/Customers/Soueast/S07.png',
    category: 'S07',
  },
  {
    model: 'S09 2.0T LUX',
    engine: '2.0L Turbo 4-cyl',
    power: 254,
    torque: 390,
    transmission: '7-speed DCT',
    driveType: 'FWD',
    dimensions: '4858×1925×1789',
    wheelbase: 2850,
    fuelTank: 57,
    seats: 7,
    keyFeatures: 'Leather, panoramic sunroof, heated/ventilated front seats, LED matrix, 8-spkr audio',
    basePrice: 91900,
    vat: 13785.0,
    totalPrice: 105685.0,
    image: '/Assets/Customers/Soueast/S09.png',
    category: 'S09',
  },
  {
    model: 'S09 2.0T PREMIUM 4WD',
    engine: '2.0L Turbo 4-cyl',
    power: 254,
    torque: 390,
    transmission: '8-speed Auto',
    driveType: '4WD',
    dimensions: '4858×1925×1789',
    wheelbase: 2850,
    fuelTank: 57,
    seats: 7,
    keyFeatures: '4WD, adaptive cruise, 360° camera, ambient lighting, hands-free tailgate, 10.25"+15.6" screens',
    basePrice: 99900,
    vat: 14985.0,
    totalPrice: 114885.0,
    image: '/Assets/Customers/Soueast/S09.png',
    category: 'S09',
  },
];

// Helper function to filter cars by budget
export const getCarsWithinBudget = (budget: number): CarModel[] => {
  return carModels.filter(car => car.basePrice <= budget).sort((a, b) => a.basePrice - b.basePrice);
};

// Helper function to get next tier car price
export const getNextTierPrice = (budget: number): number | null => {
  const carsAboveBudget = carModels.filter(car => car.basePrice > budget).sort((a, b) => a.basePrice - b.basePrice);
  return carsAboveBudget.length > 0 ? carsAboveBudget[0].basePrice : null;
};

// Helper function to calculate upgrade amount
export const getUpgradeAmount = (budget: number): number | null => {
  const nextTierPrice = getNextTierPrice(budget);
  return nextTierPrice ? nextTierPrice - budget : null;
};

// Helper function to get next tier cars (cars that would be unlocked)
export const getNextTierCars = (budget: number): CarModel[] => {
  const nextTierPrice = getNextTierPrice(budget);
  if (!nextTierPrice) return [];
  
  // Get all cars at or just above the next tier price (within reasonable range)
  const maxPrice = nextTierPrice + 10000; // Include cars up to 10K more
  return carModels
    .filter(car => car.basePrice > budget && car.basePrice <= maxPrice)
    .sort((a, b) => a.basePrice - b.basePrice);
};

// Helper function to get car by model name
export const getCarByModel = (model: string): CarModel | undefined => {
  return carModels.find(car => car.model === model);
};

// Helper function to get cars by category
export const getCarsByCategory = (category: 'S06' | 'S07' | 'S09'): CarModel[] => {
  return carModels.filter(car => car.category === category);
};

// Exterior color options
export const exteriorColors = [
  { name: 'Mountain Green', code: '#2d5016', displayName: 'Mountain Green' },
  { name: 'Snow White', code: '#FFFFFF', displayName: 'Snow White' },
  { name: 'Phantom Grey', code: '#4a4a4a', displayName: 'Phantom Grey' },
  { name: 'Moon Grey', code: '#8b8b8b', displayName: 'Moon Grey' },
  { name: 'Ocean Blue', code: '#1e3a5f', displayName: 'Ocean Blue' },
  { name: 'Starlit Black', code: '#000000', displayName: 'Starlit Black' },
];

