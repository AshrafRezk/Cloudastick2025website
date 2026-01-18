import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  ShoppingBag,
  ShoppingCart,
  Package,
  Wallet,
  User,
  Search,
  Heart,
  Star,
  ChevronRight,
  Plus,
  Minus,
  X,
  ArrowLeft,
  CreditCard,
  MapPin,
  CheckCircle2,
  Target,
  Sparkles,
  Loader2,
  Cloud,
  Building2
} from 'lucide-react';
import CompanyLogo from './CompanyLogo';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  description: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface InteractiveStorefrontDemoProps {
  companyName: string;
  companyLogo: string | null;
}

type Screen = 'home' | 'products' | 'cart' | 'orders' | 'wallet' | 'recommendations' | 'bundles' | 'checkout' | 'product-detail';

const USER_NAME = 'Aamer Galaal';

// Helper function to get category-specific image
const getCategoryImage = (category: string, index: number): string => {
  const categoryImages: { [key: string]: string[] } = {
    Electronics: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400'
    ],
    Fashion: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400'
    ],
    Home: [
      'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=400',
      'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
      'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400'
    ],
    Beauty: [
      'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400',
      'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400'
    ],
    Sports: [
      'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400'
    ]
  };

  const images = categoryImages[category] || categoryImages.Electronics;
  return images[index % images.length];
};

// Product data - mix of generic, inferred, and configurable categories
const generateProducts = (companyName: string): Product[] => {
  const baseProducts: Product[] = [
    // Electronics
    { id: '1', name: 'Wireless Headphones', price: 89.99, originalPrice: 129.99, image: getCategoryImage('Electronics', 0), category: 'Electronics', rating: 4.5, reviews: 234, inStock: true, description: 'Premium noise-cancelling wireless headphones with advanced audio technology' },
    { id: '2', name: 'Smart Watch', price: 249.99, image: getCategoryImage('Electronics', 1), category: 'Electronics', rating: 4.7, reviews: 189, inStock: true, description: 'Advanced fitness tracking smartwatch with health monitoring features' },
    { id: '3', name: 'Laptop Stand', price: 39.99, image: getCategoryImage('Electronics', 2), category: 'Electronics', rating: 4.3, reviews: 156, inStock: true, description: 'Ergonomic aluminum laptop stand for improved workspace comfort' },

    // Fashion
    { id: '4', name: 'Classic Leather Jacket', price: 199.99, originalPrice: 299.99, image: getCategoryImage('Fashion', 0), category: 'Fashion', rating: 4.6, reviews: 312, inStock: true, description: 'Premium genuine leather jacket with timeless design' },
    { id: '5', name: 'Running Shoes', price: 129.99, image: getCategoryImage('Fashion', 1), category: 'Fashion', rating: 4.4, reviews: 278, inStock: true, description: 'Comfortable athletic running shoes with superior cushioning' },
    { id: '6', name: 'Designer Sunglasses', price: 149.99, image: getCategoryImage('Fashion', 2), category: 'Fashion', rating: 4.5, reviews: 145, inStock: true, description: 'UV protection designer sunglasses with polarized lenses' },

    // Home & Garden
    { id: '7', name: 'Modern Coffee Table', price: 349.99, image: getCategoryImage('Home', 0), category: 'Home', rating: 4.8, reviews: 89, inStock: true, description: 'Sleek modern coffee table design perfect for contemporary living spaces' },
    { id: '8', name: 'Indoor Plant Set', price: 49.99, image: getCategoryImage('Home', 1), category: 'Home', rating: 4.6, reviews: 167, inStock: true, description: 'Set of 3 indoor plants with decorative pots for home decoration' },
    { id: '9', name: 'Smart LED Lights', price: 79.99, image: getCategoryImage('Home', 2), category: 'Home', rating: 4.4, reviews: 203, inStock: true, description: 'Color-changing smart LED light strips with app control' },

    // Health & Beauty
    { id: '10', name: 'Skincare Set', price: 89.99, originalPrice: 129.99, image: getCategoryImage('Beauty', 0), category: 'Beauty', rating: 4.7, reviews: 445, inStock: true, description: 'Complete daily skincare routine set with anti-aging properties' },
    { id: '11', name: 'Perfume Collection', price: 119.99, image: getCategoryImage('Beauty', 1), category: 'Beauty', rating: 4.5, reviews: 298, inStock: true, description: 'Luxury fragrance collection with long-lasting scents' },

    // Sports
    { id: '12', name: 'Yoga Mat Premium', price: 39.99, image: getCategoryImage('Sports', 0), category: 'Sports', rating: 4.6, reviews: 234, inStock: true, description: 'Non-slip premium yoga mat with extra thickness for comfort' },
    { id: '13', name: 'Dumbbell Set', price: 149.99, image: getCategoryImage('Sports', 1), category: 'Sports', rating: 4.8, reviews: 156, inStock: true, description: 'Adjustable weight dumbbell set for home fitness training' },
  ];

  // Enhanced inference based on company name keywords
  const companyLower = companyName.toLowerCase();
  const inferredProducts: Product[] = [];

  // Pharmacy/Pharmaceutical products (Enhanced)
  if (companyLower.includes('pharmacy') || companyLower.includes('pharmacies') || companyLower.includes('pharma') || companyLower.includes('drug') || companyLower.includes('medicine') || companyLower.includes('medical')) {
    inferredProducts.push(
      // Medicines
      { id: 'inf-ph1', name: 'Panadol Advance 500mg', price: 8.50, image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400', category: 'Medicines', rating: 4.9, reviews: 1520, inStock: true, description: `Effective pain relief medication. Gentle on the stomach.` },
      { id: 'inf-ph2', name: 'Brufen 400mg Tablets', price: 12.99, image: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=400', category: 'Medicines', rating: 4.8, reviews: 890, inStock: true, description: `Anti-inflammatory pain relief for muscle aches and fever.` },
      { id: 'inf-ph3', name: 'Centrum Multivitamins', price: 28.99, image: 'https://images.unsplash.com/photo-1544367563-12123d8965cd?w=400', category: 'Medicines', rating: 4.7, reviews: 2100, inStock: true, description: `Complete multivitamin supplement for daily health support.` },

      // Medical Devices
      { id: 'inf-ph4', name: 'Accu-Chek Instant Glucometer', price: 45.00, image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400', category: 'Medical Devices', rating: 4.8, reviews: 540, inStock: true, description: `Wireless blood glucose monitoring system with instant clarity.` },
      { id: 'inf-ph5', name: 'Omron Blood Pressure Monitor', price: 89.99, image: 'https://images.unsplash.com/photo-1584036561566-b937441273e9?w=400', category: 'Medical Devices', rating: 4.9, reviews: 1205, inStock: true, description: `Clinical accuracy for home blood pressure monitoring.` },

      // Wellness Electronics
      { id: 'inf-ph6', name: 'Oral-B iO Series Electric Toothbrush', price: 149.99, image: 'https://images.unsplash.com/photo-1559599101-f09722fb4948?w=400', category: 'Wellness', rating: 4.8, reviews: 670, inStock: true, description: `Revolutionary magnetic technology for a professional clean feel.` },
      { id: 'inf-ph7', name: 'Beurer Massage Gun', price: 119.00, image: 'https://images.unsplash.com/photo-1600336153113-d34dd09f2808?w=400', category: 'Wellness', rating: 4.6, reviews: 320, inStock: true, description: `Deep tissue muscle recovery and relaxation device.` },

      // Cosmetic Products
      { id: 'inf-ph8', name: 'Vichy Minéral 89 Booster', price: 35.00, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400', category: 'Cosmetics', rating: 4.9, reviews: 2800, inStock: true, description: `Hyaluronic acid booster for strengthening skin barrier.` },
      { id: 'inf-ph9', name: 'La Roche-Posay Effaclar Gel', price: 24.50, image: 'https://images.unsplash.com/photo-1556228720-1987ba429995?w=400', category: 'Cosmetics', rating: 4.8, reviews: 1560, inStock: true, description: `Purifying foaming gel for oily and sensitive skin.` },

      // Luxury Perfumes
      { id: 'inf-ph10', name: 'Sauvage Eau de Parfum', price: 135.00, image: 'https://images.unsplash.com/photo-1594035910387-fea4779426e9?w=400', category: 'Fragrances', rating: 4.9, reviews: 3400, inStock: true, description: `A noble composition with fresh and woody notes.` },
      { id: 'inf-ph11', name: 'Coco Mademoiselle Intense', price: 155.00, image: 'https://images.unsplash.com/photo-1523293188086-b435067f9a05?w=400', category: 'Fragrances', rating: 4.9, reviews: 2900, inStock: true, description: `An intense and sensual amber woody fragrance.` }
    );
  }

  // Ceramics/Porcelain products
  if (companyLower.includes('ceramic') || companyLower.includes('porcelain') || companyLower.includes('tile') || companyLower.includes('pottery')) {
    inferredProducts.push(
      { id: 'inf-cer1', name: 'Ceramic Dinner Set', price: 79.99, image: 'https://images.unsplash.com/photo-1556910096-6f5e72db6803?w=400', category: 'Home', rating: 4.7, reviews: 189, inStock: true, description: `Elegant ceramic dinner set for 6 from ${companyName}` },
      { id: 'inf-cer2', name: 'Porcelain Vase Collection', price: 129.99, image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400', category: 'Home', rating: 4.5, reviews: 145, inStock: true, description: `Handcrafted porcelain vases by ${companyName}` },
      { id: 'inf-cer3', name: 'Ceramic Tile Samples', price: 24.99, image: 'https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=400', category: 'Home', rating: 4.6, reviews: 98, inStock: true, description: `Premium ceramic tile sample pack from ${companyName}` },
      { id: 'inf-cer4', name: 'Decorative Ceramic Bowls', price: 39.99, image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400', category: 'Home', rating: 4.4, reviews: 167, inStock: true, description: `Hand-painted decorative ceramic bowls by ${companyName}` }
    );
  }

  // Cosmetics/Beauty products
  if (companyLower.includes('cosmetic') || companyLower.includes('beauty') || companyLower.includes('makeup') || companyLower.includes('skincare') || companyLower.includes('perfume')) {
    inferredProducts.push(
      { id: 'inf-cos1', name: 'Luxury Makeup Collection', price: 149.99, image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400', category: 'Beauty', rating: 4.8, reviews: 1234, inStock: true, description: 'Premium makeup collection with all essentials' },
      { id: 'inf-cos2', name: 'Anti-Aging Skincare Set', price: 89.99, image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400', category: 'Beauty', rating: 4.7, reviews: 892, inStock: true, description: 'Complete anti-aging skincare routine' },
      { id: 'inf-cos3', name: 'Designer Perfume Collection', price: 119.99, image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400', category: 'Beauty', rating: 4.6, reviews: 567, inStock: true, description: 'Luxury fragrance collection' },
      { id: 'inf-cos4', name: 'Hair Care Essentials', price: 49.99, image: 'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=400', category: 'Beauty', rating: 4.5, reviews: 456, inStock: true, description: 'Professional hair care products' }
    );
  }

  // Fashion/Apparel products
  if (companyLower.includes('fashion') || companyLower.includes('apparel') || companyLower.includes('clothing') || companyLower.includes('garment') || companyLower.includes('textile')) {
    inferredProducts.push(
      { id: 'inf-fash1', name: 'Designer Collection', price: 299.99, image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400', category: 'Fashion', rating: 4.8, reviews: 267, inStock: true, description: 'Exclusive designer clothing collection' },
      { id: 'inf-fash2', name: 'Premium Accessories', price: 89.99, image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400', category: 'Fashion', rating: 4.6, reviews: 198, inStock: true, description: 'Luxury fashion accessories set' },
      { id: 'inf-fash3', name: 'Seasonal Fashion Line', price: 199.99, image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400', category: 'Fashion', rating: 4.7, reviews: 345, inStock: true, description: 'Latest seasonal fashion collection' }
    );
  }

  // Electronics/Tech products
  if (companyLower.includes('electronic') || companyLower.includes('tech') || companyLower.includes('computer') || companyLower.includes('software') || companyLower.includes('digital')) {
    inferredProducts.push(
      { id: 'inf-elec1', name: 'Smart Devices Bundle', price: 349.99, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', category: 'Electronics', rating: 4.7, reviews: 456, inStock: true, description: 'Complete smart home device bundle' },
      { id: 'inf-elec2', name: 'Wireless Tech Accessories', price: 79.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', category: 'Electronics', rating: 4.6, reviews: 289, inStock: true, description: 'Premium wireless accessories' }
    );
  }

  // Food/Beverage products
  if (companyLower.includes('food') || companyLower.includes('beverage') || companyLower.includes('restaurant') || companyLower.includes('cafe') || companyLower.includes('bakery')) {
    inferredProducts.push(
      { id: 'inf-food1', name: 'Gourmet Food Basket', price: 59.99, image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400', category: 'Food', rating: 4.8, reviews: 234, inStock: true, description: 'Premium gourmet food selection' },
      { id: 'inf-food2', name: 'Artisan Coffee Collection', price: 39.99, image: 'https://images.unsplash.com/photo-1511920170033-83939d9d5e41?w=400', category: 'Food', rating: 4.7, reviews: 567, inStock: true, description: 'Premium artisan coffee beans' }
    );
  }

  // Furniture/Home products
  if (companyLower.includes('furniture') || companyLower.includes('home') || companyLower.includes('interior') || companyLower.includes('decor')) {
    inferredProducts.push(
      { id: 'inf-furn1', name: 'Modern Furniture Set', price: 899.99, image: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=400', category: 'Home', rating: 4.8, reviews: 189, inStock: true, description: 'Contemporary furniture collection' },
      { id: 'inf-furn2', name: 'Home Decor Collection', price: 149.99, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400', category: 'Home', rating: 4.6, reviews: 234, inStock: true, description: 'Elegant home decoration items' }
    );
  }

  // Automotive products
  if (companyLower.includes('car') || companyLower.includes('vehicle') || companyLower.includes('auto') || companyLower.includes('motor') || companyLower.includes('tire') || companyLower.includes('parts')) {
    inferredProducts.push(
      { id: 'inf-auto1', name: 'Car Accessories Bundle', price: 199.99, image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400', category: 'Automotive', rating: 4.7, reviews: 456, inStock: true, description: 'Premium car accessories and parts' },
      { id: 'inf-auto2', name: 'Tire Set (4 Pack)', price: 449.99, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', category: 'Automotive', rating: 4.8, reviews: 234, inStock: true, description: 'High-performance tire set' },
      { id: 'inf-auto3', name: 'Car Care Kit', price: 49.99, image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400', category: 'Automotive', rating: 4.6, reviews: 189, inStock: true, description: 'Complete car cleaning and maintenance kit' }
    );
  }

  // Jewelry products
  if (companyLower.includes('jewelry') || companyLower.includes('jewellery') || companyLower.includes('gold') || companyLower.includes('silver') || companyLower.includes('diamond') || companyLower.includes('watch')) {
    inferredProducts.push(
      { id: 'inf-jew1', name: 'Gold Necklace Collection', price: 599.99, image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400', category: 'Jewelry', rating: 4.9, reviews: 567, inStock: true, description: 'Elegant gold necklace designs' },
      { id: 'inf-jew2', name: 'Diamond Ring Set', price: 1299.99, image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=400', category: 'Jewelry', rating: 4.8, reviews: 234, inStock: true, description: 'Premium diamond engagement rings' },
      { id: 'inf-jew3', name: 'Luxury Watch Collection', price: 899.99, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', category: 'Jewelry', rating: 4.7, reviews: 345, inStock: true, description: 'Swiss-made luxury timepieces' }
    );
  }

  // Books/Education products
  if (companyLower.includes('book') || companyLower.includes('education') || companyLower.includes('learning') || companyLower.includes('course') || companyLower.includes('training')) {
    inferredProducts.push(
      { id: 'inf-book1', name: 'Educational Course Bundle', price: 149.99, image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400', category: 'Education', rating: 4.7, reviews: 892, inStock: true, description: 'Comprehensive online learning courses' },
      { id: 'inf-book2', name: 'Professional Training Materials', price: 79.99, image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400', category: 'Education', rating: 4.6, reviews: 456, inStock: true, description: 'Expert training resources and materials' },
      { id: 'inf-book3', name: 'E-Book Collection', price: 29.99, image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400', category: 'Education', rating: 4.5, reviews: 1234, inStock: true, description: 'Digital library of educational books' }
    );
  }

  // Sports/Outdoor products
  if (companyLower.includes('sport') || companyLower.includes('fitness') || companyLower.includes('gym') || companyLower.includes('outdoor') || companyLower.includes('equipment')) {
    inferredProducts.push(
      { id: 'inf-sport1', name: 'Fitness Equipment Set', price: 299.99, image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', category: 'Sports', rating: 4.8, reviews: 567, inStock: true, description: 'Complete home gym equipment' },
      { id: 'inf-sport2', name: 'Outdoor Adventure Gear', price: 199.99, image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400', category: 'Sports', rating: 4.7, reviews: 345, inStock: true, description: 'Premium outdoor sports equipment' },
      { id: 'inf-sport3', name: 'Athletic Apparel Collection', price: 89.99, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', category: 'Sports', rating: 4.6, reviews: 678, inStock: true, description: 'Professional athletic wear' }
    );
  }

  // Toys/Games products
  if (companyLower.includes('toy') || companyLower.includes('game') || companyLower.includes('play') || companyLower.includes('children') || companyLower.includes('kids')) {
    inferredProducts.push(
      { id: 'inf-toy1', name: 'Educational Toy Set', price: 49.99, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', category: 'Toys', rating: 4.8, reviews: 1234, inStock: true, description: 'Interactive learning toys for children' },
      { id: 'inf-toy2', name: 'Board Game Collection', price: 39.99, image: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400', category: 'Toys', rating: 4.7, reviews: 567, inStock: true, description: 'Classic and modern board games' },
      { id: 'inf-toy3', name: 'Building Blocks Set', price: 59.99, image: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e4?w=400', category: 'Toys', rating: 4.9, reviews: 890, inStock: true, description: 'Creative building and construction toys' }
    );
  }

  // Pet Supplies products
  if (companyLower.includes('pet') || companyLower.includes('animal') || companyLower.includes('dog') || companyLower.includes('cat') || companyLower.includes('veterinary')) {
    inferredProducts.push(
      { id: 'inf-pet1', name: 'Premium Pet Food', price: 34.99, image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400', category: 'Pets', rating: 4.8, reviews: 1234, inStock: true, description: 'High-quality nutrition for pets' },
      { id: 'inf-pet2', name: 'Pet Accessories Bundle', price: 49.99, image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400', category: 'Pets', rating: 4.7, reviews: 567, inStock: true, description: 'Essential pet care accessories' },
      { id: 'inf-pet3', name: 'Pet Toys Collection', price: 24.99, image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400', category: 'Pets', rating: 4.6, reviews: 890, inStock: true, description: 'Interactive toys for dogs and cats' }
    );
  }

  // Office Supplies products
  if (companyLower.includes('office') || companyLower.includes('stationery') || companyLower.includes('paper') || companyLower.includes('pen') || companyLower.includes('business')) {
    inferredProducts.push(
      { id: 'inf-off1', name: 'Professional Stationery Set', price: 29.99, image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400', category: 'Office', rating: 4.6, reviews: 456, inStock: true, description: 'Premium office stationery collection' },
      { id: 'inf-off2', name: 'Business Supplies Bundle', price: 79.99, image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400', category: 'Office', rating: 4.7, reviews: 234, inStock: true, description: 'Complete office supplies package' },
      { id: 'inf-off3', name: 'Organizational Products', price: 49.99, image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400', category: 'Office', rating: 4.5, reviews: 345, inStock: true, description: 'Desk organizers and filing solutions' }
    );
  }

  // Construction/Building products
  if (companyLower.includes('construction') || companyLower.includes('building') || companyLower.includes('material') || companyLower.includes('tool') || companyLower.includes('hardware')) {
    inferredProducts.push(
      { id: 'inf-cons1', name: 'Building Materials Kit', price: 299.99, image: 'https://images.unsplash.com/photo-1504307651254-35680f2df4d7?w=400', category: 'Construction', rating: 4.7, reviews: 234, inStock: true, description: 'Essential construction materials' },
      { id: 'inf-cons2', name: 'Professional Tool Set', price: 199.99, image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400', category: 'Construction', rating: 4.8, reviews: 456, inStock: true, description: 'Complete professional tool collection' },
      { id: 'inf-cons3', name: 'Hardware Supplies', price: 89.99, image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400', category: 'Construction', rating: 4.6, reviews: 189, inStock: true, description: 'Quality hardware and fasteners' }
    );
  }

  // If no specific products inferred, return base products
  // Otherwise, prioritize inferred products and add some base products for variety
  if (inferredProducts.length > 0) {
    return [...inferredProducts, ...baseProducts.slice(0, 6)];
  }

  return baseProducts;
};

const InteractiveStorefrontDemo: React.FC<InteractiveStorefrontDemoProps> = ({ companyName, companyLogo }) => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [walletBalance] = useState(1250.50);
  const [selectedPaymentGateway, setSelectedPaymentGateway] = useState<'gidea' | 'paymob' | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isSyncingSalesforce, setIsSyncingSalesforce] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [fetchedProducts, setFetchedProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  // Enhanced product fetching from multiple APIs
  useEffect(() => {
    const fetchCompanyProducts = async () => {
      if (!companyName || companyName.trim().length < 3) {
        setFetchedProducts([]);
        return;
      }

      setIsLoadingProducts(true);
      const productHints: string[] = [];
      let foundProducts = false;

      try {
        // Strategy 1: Try Wikipedia API (free, no key needed)
        try {
          const wikiQuery = encodeURIComponent(companyName);
          const wikiController = new AbortController();
          const wikiTimeout = setTimeout(() => wikiController.abort(), 5000);

          const wikiResponse = await fetch(
            `https://en.wikipedia.org/api/rest_v1/page/summary/${wikiQuery}`,
            {
              method: 'GET',
              headers: { 'Accept': 'application/json' },
              signal: wikiController.signal,
            }
          );

          clearTimeout(wikiTimeout);

          if (wikiResponse.ok) {
            const wikiData = await wikiResponse.json();
            if (wikiData.extract) {
              // Enhanced parsing of Wikipedia extract
              const extract = wikiData.extract;

              // Look for product-related sentences
              const productPatterns = [
                /(?:sells|offers|produces|manufactures|provides|specializes in|known for)[\s:]+([^.!?]+)/gi,
                /(?:products?|services?|offerings?)[\s:]+([^.!?]+)/gi,
                /(?:including|such as|like)[\s]+([^.!?]+)/gi,
              ];

              productPatterns.forEach(pattern => {
                const matches = extract.matchAll(pattern);
                for (const match of matches) {
                  if (match[1]) {
                    // Extract product names from the match
                    const products = match[1]
                      .split(/[,;and&]/)
                      .map(p => p.trim())
                      .filter(p => {
                        const clean = p.toLowerCase();
                        return (
                          p.length > 3 &&
                          p.length < 50 &&
                          !clean.includes('company') &&
                          !clean.includes('business') &&
                          !clean.includes('organization') &&
                          !clean.includes('founded') &&
                          !clean.includes('established')
                        );
                      });
                    productHints.push(...products);
                  }
                }
              });

              // Also extract from first paragraph if it contains product info
              const firstPara = extract.split('.')[0];
              if (firstPara.toLowerCase().includes('product') || firstPara.toLowerCase().includes('sell')) {
                const words = firstPara.split(',').map(w => w.trim());
                words.forEach(word => {
                  if (word.length > 4 && word.length < 40) {
                    const lower = word.toLowerCase();
                    if (!lower.includes('company') && !lower.includes('business')) {
                      productHints.push(word);
                    }
                  }
                });
              }

              if (productHints.length > 0) {
                foundProducts = true;
              }
            }
          }
        } catch (wikiError: any) {
          if (wikiError.name !== 'AbortError') {
            console.log('Wikipedia API failed, trying other sources');
          }
        }

        // Strategy 2: Try DuckDuckGo with improved parsing (if Wikipedia didn't work)
        if (!foundProducts) {
          try {
            const searchQuery = encodeURIComponent(`${companyName} products services`);
            const ddgController = new AbortController();
            const ddgTimeout = setTimeout(() => ddgController.abort(), 5000);

            const ddgResponse = await fetch(
              `https://api.duckduckgo.com/?q=${searchQuery}&format=json&no_html=1&skip_disambig=1`,
              {
                method: 'GET',
                headers: { 'Accept': 'application/json' },
                signal: ddgController.signal,
              }
            );

            clearTimeout(ddgTimeout);

            if (ddgResponse.ok) {
              const ddgData = await ddgResponse.json();
              if (ddgData.AbstractText) {
                // Improved NLP-style extraction
                const abstract = ddgData.AbstractText;
                const sentences = abstract.split(/[.!?]/);

                sentences.forEach(sentence => {
                  const lower = sentence.toLowerCase();
                  // Look for product indicators
                  if (
                    lower.includes('product') ||
                    lower.includes('sell') ||
                    lower.includes('offer') ||
                    lower.includes('manufacture') ||
                    lower.includes('provide')
                  ) {
                    // Extract nouns/phrases after product indicators
                    const productRegex = /(?:products?|sells?|offers?|manufactures?|provides?)[\s:]+([^.!?]+)/gi;
                    const matches = sentence.matchAll(productRegex);
                    for (const match of matches) {
                      if (match[1]) {
                        const products = match[1]
                          .split(/[,;and&]/)
                          .map(p => p.trim())
                          .filter(p => {
                            const clean = p.toLowerCase();
                            return (
                              p.length > 3 &&
                              p.length < 40 &&
                              !clean.includes('company') &&
                              !clean.includes('business')
                            );
                          });
                        productHints.push(...products);
                      }
                    }
                  }
                });
              }
            }
          } catch (ddgError: any) {
            if (ddgError.name !== 'AbortError') {
              console.log('DuckDuckGo API failed');
            }
          }
        }

        // Strategy 3: Try companyIntelligence service (if available)
        if (!foundProducts && productHints.length === 0) {
          try {
            // Use a simplified version that doesn't require full CompanyData
            const intelController = new AbortController();
            const intelTimeout = setTimeout(() => intelController.abort(), 5000);

            const intelligenceResponse = await fetch('/.netlify/functions/cloudiator', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                prompt: `List 3-5 main products or services that ${companyName} sells or offers. Format as comma-separated list only, no explanations.`
              }),
              signal: intelController.signal,
            });

            clearTimeout(intelTimeout);

            if (intelligenceResponse.ok) {
              const intelData = await intelligenceResponse.json();
              if (intelData.response && intelData.response !== 'UNKNOWN') {
                const products = intelData.response
                  .split(',')
                  .map((p: string) => p.trim())
                  .filter((p: string) => {
                    const lower = p.toLowerCase();
                    return (
                      p.length > 3 &&
                      p.length < 50 &&
                      !lower.includes('based on') &&
                      !lower.includes('unknown') &&
                      !lower.includes('sorry')
                    );
                  })
                  .slice(0, 5);
                productHints.push(...products);
              }
            }
          } catch (intelError: any) {
            if (intelError.name !== 'AbortError') {
              console.log('Company intelligence service unavailable');
            }
          }
        }

        // Create products from collected hints
        if (productHints.length > 0) {
          // Remove duplicates and clean up
          const uniqueHints = Array.from(
            new Set(
              productHints
                .map(h => h.trim())
                .filter(h => h.length > 3 && h.length < 50)
            )
          ).slice(0, 8);

          const apiProducts: Product[] = uniqueHints.map((hint, idx) => {
            // Determine category from hint
            const hintLower = hint.toLowerCase();
            let category = 'General';
            if (hintLower.includes('medicine') || hintLower.includes('drug') || hintLower.includes('pharma')) category = 'Health';
            else if (hintLower.includes('ceramic') || hintLower.includes('tile') || hintLower.includes('porcelain')) category = 'Home';
            else if (hintLower.includes('cosmetic') || hintLower.includes('beauty') || hintLower.includes('makeup')) category = 'Beauty';
            else if (hintLower.includes('cloth') || hintLower.includes('fashion') || hintLower.includes('apparel')) category = 'Fashion';
            else if (hintLower.includes('electronic') || hintLower.includes('tech') || hintLower.includes('software')) category = 'Electronics';
            else if (hintLower.includes('food') || hintLower.includes('beverage')) category = 'Food';

            // Generate realistic pricing based on category
            let basePrice = 50;
            if (category === 'Health') basePrice = 30;
            else if (category === 'Beauty') basePrice = 60;
            else if (category === 'Fashion') basePrice = 80;
            else if (category === 'Electronics') basePrice = 150;
            else if (category === 'Home') basePrice = 100;

            return {
              id: `api-${idx}`,
              name: hint.charAt(0).toUpperCase() + hint.slice(1),
              price: Math.round((Math.random() * basePrice * 2 + basePrice * 0.5) * 100) / 100,
              image: `https://images.unsplash.com/photo-${1500000000000 + idx}?w=400&q=80`,
              category,
              rating: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10,
              reviews: Math.floor(Math.random() * 500 + 50),
              inStock: true,
              description: `Premium ${hint} from ${companyName}`
            };
          });

          setFetchedProducts(apiProducts);
        } else {
          setFetchedProducts([]);
        }
      } catch (error) {
        console.log('Could not fetch products from APIs, using inferred products');
        setFetchedProducts([]);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    // Debounce API calls
    const timeoutId = setTimeout(() => {
      fetchCompanyProducts();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [companyName]);

  const products = useMemo(() => {
    const generated = generateProducts(companyName);
    // Prioritize fetched products, then add generated ones
    return fetchedProducts.length > 0 ? [...fetchedProducts, ...generated] : generated;
  }, [companyName, fetchedProducts]);

  const cartTotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [cartItems]);

  const cartItemCount = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  const recommendations = useMemo(() => {
    return products.slice(0, 4);
  }, [products]);

  const bundles = useMemo(() => {
    return [
      {
        id: 'bundle1',
        name: 'Home Essentials Bundle',
        products: [products[6], products[7], products[8]],
        price: 399.99,
        savings: 79.98,
        image: products[6].image
      },
      {
        id: 'bundle2',
        name: 'Fashion Starter Pack',
        products: [products[4], products[5], products[6]],
        price: 349.99,
        savings: 129.99,
        image: products[4].image
      }
    ];
  }, [products]);

  const orders = useMemo(() => {
    return [
      {
        id: 'order1',
        date: '2024-01-15',
        items: [products[0], products[1]],
        total: 339.98,
        status: 'Delivered'
      },
      {
        id: 'order2',
        date: '2024-01-10',
        items: [products[3]],
        total: 199.99,
        status: 'Delivered'
      }
    ];
  }, [products]);

  const handleAddToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCartItems(prev =>
      prev.map(item => {
        if (item.id === productId) {
          const newQuantity = item.quantity + delta;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      }).filter(item => item.quantity > 0)
    );
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setCurrentScreen('product-detail');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return renderHomeScreen();
      case 'products':
        return renderProductsScreen();
      case 'cart':
        return renderCartScreen();
      case 'orders':
        return renderOrdersScreen();
      case 'wallet':
        return renderWalletScreen();
      case 'recommendations':
        return renderRecommendationsScreen();
      case 'bundles':
        return renderBundlesScreen();
      case 'checkout':
        return renderCheckoutScreen();
      case 'product-detail':
        return renderProductDetailScreen();
      default:
        return renderHomeScreen();
    }
  };

  const renderHomeScreen = () => (
    <div className="h-full overflow-y-auto bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {companyLogo && (
              <img src={companyLogo} alt={companyName} className="w-8 h-8 rounded" />
            )}
            <span className="font-bold text-lg text-gray-900">{companyName || 'Store'}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold text-sm">
              {USER_NAME.split(' ').map(n => n[0]).join('')}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Welcome back,</span>
          <span className="font-semibold text-gray-900">{USER_NAME}</span>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-6 mx-4 mt-4 rounded-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            {companyLogo && (
              <img
                src={companyLogo}
                alt={companyName}
                className="w-10 h-10 rounded-lg bg-white/20 p-1 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
            <div>
              <h2 className="text-xl font-bold">Special Offer from {companyName || 'Store'}!</h2>
              <p className="text-sm opacity-90 mt-1">Get 20% off on selected items</p>
            </div>
          </div>
        </div>
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full -ml-12 -mb-12"></div>
        </div>
      </div>

      {/* Featured Products */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Featured Products</h3>
          <button
            onClick={() => setCurrentScreen('products')}
            className="text-orange-500 text-sm font-semibold"
          >
            See All
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {products.slice(0, 4).map((product) => (
            <motion.div
              key={product.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleProductClick(product)}
              className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200"
            >
              <div className="aspect-square bg-gray-100 relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.originalPrice && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                    Sale
                  </div>
                )}
              </div>
              <div className="p-2">
                <p className="text-xs text-gray-600 line-clamp-1">{product.name}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-gray-600">{product.rating}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-bold text-sm text-gray-900">${product.price.toFixed(2)}</span>
                  {product.originalPrice && (
                    <span className="text-xs text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 mt-6 mb-20">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setCurrentScreen('recommendations')}
            className="bg-white p-4 rounded-lg border border-gray-200 text-left"
          >
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-2">
              <Target className="w-5 h-5 text-orange-500" />
            </div>
            <p className="font-semibold text-sm text-gray-900">Recommendations</p>
            <p className="text-xs text-gray-500 mt-1">For you</p>
          </button>
          <button
            onClick={() => setCurrentScreen('bundles')}
            className="bg-white p-4 rounded-lg border border-gray-200 text-left"
          >
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mb-2">
              <Package className="w-5 h-5 text-orange-500" />
            </div>
            <p className="font-semibold text-sm text-gray-900">Bundles</p>
            <p className="text-xs text-gray-500 mt-1">Save more</p>
          </button>
        </div>
      </div>
    </div>
  );

  const renderProductsScreen = () => (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-3">
          <button onClick={() => setCurrentScreen('home')} className="p-1">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h2 className="text-lg font-bold text-gray-900">Products</h2>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm"
          />
        </div>
      </div>

      <div className="px-4 py-4">
        <div className="grid grid-cols-2 gap-3">
          {products.map((product) => (
            <motion.div
              key={product.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleProductClick(product)}
              className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200"
            >
              <div className="aspect-square bg-gray-100 relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.originalPrice && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                    Sale
                  </div>
                )}
              </div>
              <div className="p-2">
                <p className="text-xs text-gray-600 line-clamp-2 mb-1">{product.name}</p>
                <div className="flex items-center gap-1 mb-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-gray-600">{product.rating} ({product.reviews})</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-gray-900">${product.price.toFixed(2)}</span>
                    {product.originalPrice && (
                      <span className="text-xs text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                    className="p-1.5 bg-orange-500 text-white rounded-full"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderCartScreen = () => (
    <div className="h-full overflow-y-auto bg-gray-50 flex flex-col">
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => setCurrentScreen('home')} className="p-1">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h2 className="text-lg font-bold text-gray-900">Shopping Cart</h2>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-semibold">Your cart is empty</p>
            <button
              onClick={() => setCurrentScreen('products')}
              className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg font-semibold"
            >
              Start Shopping
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 px-4 py-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg p-3 mb-3 border border-gray-200">
                <div className="flex gap-3">
                  <img src={item.image} alt={item.name} className="w-20 h-20 rounded object-cover" />
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500 mt-1">${item.price.toFixed(2)} each</p>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center gap-2 bg-gray-100 rounded-lg">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, -1)}
                          className="p-1"
                        >
                          <Minus className="w-4 h-4 text-gray-600" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, 1)}
                          className="p-1"
                        >
                          <Plus className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                      <button
                        onClick={() => handleRemoveFromCart(item.id)}
                        className="p-1 text-red-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white border-t border-gray-200 px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600 font-semibold">Total</span>
              <span className="text-xl font-bold text-gray-900">${cartTotal.toFixed(2)}</span>
            </div>
            <button
              onClick={() => setCurrentScreen('checkout')}
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );

  const renderOrdersScreen = () => (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => setCurrentScreen('home')} className="p-1">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h2 className="text-lg font-bold text-gray-900">My Orders</h2>
        </div>
      </div>

      <div className="px-4 py-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg p-4 mb-3 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-semibold text-gray-900">Order #{order.id.slice(-6)}</p>
                <p className="text-xs text-gray-500 mt-1">{order.date}</p>
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-xs font-semibold">{order.status}</span>
              </div>
            </div>
            <div className="flex gap-2 mb-3">
              {order.items.map((item) => (
                <img key={item.id} src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover" />
              ))}
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <span className="text-sm text-gray-600">{order.items.length} items</span>
              <span className="font-bold text-gray-900">${order.total.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderWalletScreen = () => (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => setCurrentScreen('home')} className="p-1">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h2 className="text-lg font-bold text-gray-900">Wallet</h2>
        </div>
      </div>

      <div className="px-4 py-4">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white mb-4">
          <p className="text-sm opacity-90 mb-2">Available Balance</p>
          <p className="text-3xl font-bold">${walletBalance.toFixed(2)}</p>
        </div>

        <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Recent Transactions</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">Purchase</p>
                <p className="text-xs text-gray-500">Jan 15, 2024</p>
              </div>
              <span className="text-sm font-semibold text-red-600">-$339.98</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">Top Up</p>
                <p className="text-xs text-gray-500">Jan 10, 2024</p>
              </div>
              <span className="text-sm font-semibold text-green-600">+$500.00</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Payment Methods</h3>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <CreditCard className="w-5 h-5 text-gray-600" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">•••• •••• •••• 4242</p>
              <p className="text-xs text-gray-500">Expires 12/25</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRecommendationsScreen = () => (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => setCurrentScreen('home')} className="p-1">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h2 className="text-lg font-bold text-gray-900">Recommendations</h2>
        </div>
      </div>

      <div className="px-4 py-4">
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-1">Recommended for you, {USER_NAME}</p>
          <h3 className="text-lg font-bold text-gray-900">Based on your browsing</h3>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {recommendations.map((product) => (
            <motion.div
              key={product.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleProductClick(product)}
              className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200"
            >
              <div className="aspect-square bg-gray-100 relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                  Recommended
                </div>
              </div>
              <div className="p-2">
                <p className="text-xs text-gray-600 line-clamp-1">{product.name}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs text-gray-600">{product.rating}</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-bold text-sm text-gray-900">${product.price.toFixed(2)}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                    className="p-1.5 bg-orange-500 text-white rounded-full"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBundlesScreen = () => (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => setCurrentScreen('home')} className="p-1">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h2 className="text-lg font-bold text-gray-900">Bundles</h2>
        </div>
      </div>

      <div className="px-4 py-4">
        {bundles.map((bundle) => (
          <div key={bundle.id} className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
            <img src={bundle.image} alt={bundle.name} className="w-full h-40 object-cover rounded-lg mb-3" />
            <h3 className="font-bold text-gray-900 mb-2">{bundle.name}</h3>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl font-bold text-gray-900">${bundle.price.toFixed(2)}</span>
              <span className="text-sm text-green-600 font-semibold">Save ${bundle.savings.toFixed(2)}</span>
            </div>
            <div className="flex gap-2 mb-3">
              {bundle.products.map((product) => (
                <img key={product.id} src={product.image} alt={product.name} className="w-12 h-12 rounded object-cover" />
              ))}
            </div>
            <button
              onClick={() => {
                bundle.products.forEach(product => handleAddToCart(product));
                setCurrentScreen('cart');
              }}
              className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold"
            >
              Add Bundle to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const handlePayment = async () => {
    if (!selectedPaymentGateway) {
      alert('Please select a payment gateway');
      return;
    }

    setIsProcessingPayment(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsProcessingPayment(false);
    setIsSyncingSalesforce(true);

    // Simulate Salesforce CRM sync
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSyncingSalesforce(false);
    setPaymentSuccess(true);

    // After showing success, reset and go to orders
    setTimeout(() => {
      setCartItems([]);
      setSelectedPaymentGateway(null);
      setPaymentSuccess(false);
      setCurrentScreen('orders');
    }, 2000);
  };

  const renderCheckoutScreen = () => {
    if (paymentSuccess) {
      return (
        <div className="h-full overflow-y-auto bg-gray-50 flex items-center justify-center">
          <div className="text-center px-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle2 className="w-10 h-10 text-white" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-4">Your order has been placed</p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Cloud className="w-4 h-4 text-blue-500" />
              <span>Synced to Salesforce CRM</span>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="h-full overflow-y-auto bg-gray-50">
        <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setSelectedPaymentGateway(null);
                setCurrentScreen('cart');
              }}
              className="p-1"
              disabled={isProcessingPayment || isSyncingSalesforce}
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <h2 className="text-lg font-bold text-gray-900">Checkout</h2>
          </div>
        </div>

        <div className="px-4 py-4">
          <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Shipping Address</h3>
            </div>
            <p className="text-sm text-gray-900">{USER_NAME}</p>
            <p className="text-sm text-gray-600">123 Main Street</p>
            <p className="text-sm text-gray-600">New York, NY 10001</p>
          </div>

          <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="w-5 h-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Payment Gateway</h3>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedPaymentGateway('gidea')}
                disabled={isProcessingPayment || isSyncingSalesforce}
                className={`w-full p-3 rounded-lg border-2 transition-all ${selectedPaymentGateway === 'gidea'
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
                  } ${isProcessingPayment || isSyncingSalesforce ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-gray-900">Gidea</p>
                    <p className="text-xs text-gray-500">Visa, Mastercard, Meeza</p>
                  </div>
                  {selectedPaymentGateway === 'gidea' && (
                    <CheckCircle2 className="w-5 h-5 text-orange-500" />
                  )}
                </div>
              </button>

              <button
                onClick={() => setSelectedPaymentGateway('paymob')}
                disabled={isProcessingPayment || isSyncingSalesforce}
                className={`w-full p-3 rounded-lg border-2 transition-all ${selectedPaymentGateway === 'paymob'
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
                  } ${isProcessingPayment || isSyncingSalesforce ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-gray-900">Paymob</p>
                    <p className="text-xs text-gray-500">Credit & Debit Cards</p>
                  </div>
                  {selectedPaymentGateway === 'paymob' && (
                    <CheckCircle2 className="w-5 h-5 text-orange-500" />
                  )}
                </div>
              </button>
            </div>
          </div>

          {selectedPaymentGateway && (
            <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <CreditCard className="w-5 h-5 text-gray-600" />
                <h3 className="font-semibold text-gray-900">Card Details</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <input
                    type="text"
                    placeholder="Card Number"
                    defaultValue="4242 4242 4242 4242"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    disabled={isProcessingPayment || isSyncingSalesforce}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    defaultValue="12/25"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    disabled={isProcessingPayment || isSyncingSalesforce}
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    defaultValue="123"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    disabled={isProcessingPayment || isSyncingSalesforce}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Cardholder Name"
                  defaultValue={USER_NAME}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  disabled={isProcessingPayment || isSyncingSalesforce}
                />
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3">Order Summary</h3>
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">{item.name} x{item.quantity}</span>
                <span className="text-sm font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t border-gray-200 pt-3 mt-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="text-xl font-bold text-gray-900">${cartTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={!selectedPaymentGateway || isProcessingPayment || isSyncingSalesforce}
            className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 ${!selectedPaymentGateway || isProcessingPayment || isSyncingSalesforce
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-orange-500 text-white hover:bg-orange-600'
              }`}
          >
            {isProcessingPayment ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing Payment...</span>
              </>
            ) : isSyncingSalesforce ? (
              <>
                <Cloud className="w-5 h-5 animate-pulse" />
                <span>Syncing to Salesforce CRM...</span>
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                <span>Pay ${cartTotal.toFixed(2)}</span>
              </>
            )}
          </button>

          {isSyncingSalesforce && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              <p className="text-xs text-blue-800">
                Creating order record in Salesforce CRM...
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderProductDetailScreen = () => {
    if (!selectedProduct) return null;

    return (
      <div className="h-full overflow-y-auto bg-gray-50">
        <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setCurrentScreen('products')} className="p-1">
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <h2 className="text-lg font-bold text-gray-900">Product Details</h2>
          </div>
        </div>

        <div className="bg-white">
          <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-80 object-cover" />
          <div className="p-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedProduct.name}</h3>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-gray-600">{selectedProduct.rating} ({selectedProduct.reviews} reviews)</span>
              </div>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl font-bold text-gray-900">${selectedProduct.price.toFixed(2)}</span>
              {selectedProduct.originalPrice && (
                <span className="text-lg text-gray-400 line-through">${selectedProduct.originalPrice.toFixed(2)}</span>
              )}
            </div>
            <p className="text-sm text-gray-600 mb-4">{selectedProduct.description}</p>
            <button
              onClick={() => {
                handleAddToCart(selectedProduct);
                setCurrentScreen('cart');
              }}
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* Mobile Frame */}
      <div className="relative bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl z-20"></div>

        {/* Status Bar */}
        <div className="absolute top-2 left-0 right-0 flex items-center justify-between px-6 text-white text-xs z-10">
          <span>9:41</span>
          <div className="flex items-center gap-1">
            <div className="w-4 h-2 border border-white rounded-sm">
              <div className="w-3 h-1.5 bg-white rounded-sm m-0.5"></div>
            </div>
            <div className="w-1 h-1 bg-white rounded-full"></div>
            <div className="w-6 h-3 border border-white rounded-sm">
              <div className="w-5 h-2.5 bg-white rounded-sm m-0.5"></div>
            </div>
          </div>
        </div>

        {/* Screen Content */}
        <div className="relative bg-white rounded-[2rem] overflow-hidden" style={{ height: '600px' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentScreen}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {renderScreen()}
            </motion.div>
          </AnimatePresence>

          {/* Bottom Navigation */}
          {!['checkout', 'product-detail'].includes(currentScreen) && (
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2">
              <div className="flex items-center justify-around">
                <button
                  onClick={() => setCurrentScreen('home')}
                  className={`flex flex-col items-center gap-1 p-2 ${currentScreen === 'home' ? 'text-orange-500' : 'text-gray-400'}`}
                >
                  <Home className="w-5 h-5" />
                  <span className="text-xs">Home</span>
                </button>
                <button
                  onClick={() => setCurrentScreen('products')}
                  className={`flex flex-col items-center gap-1 p-2 ${currentScreen === 'products' ? 'text-orange-500' : 'text-gray-400'}`}
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span className="text-xs">Shop</span>
                </button>
                <button
                  onClick={() => setCurrentScreen('cart')}
                  className="flex flex-col items-center gap-1 p-2 text-gray-400 relative"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                  <span className="text-xs">Cart</span>
                </button>
                <button
                  onClick={() => setCurrentScreen('orders')}
                  className={`flex flex-col items-center gap-1 p-2 ${currentScreen === 'orders' ? 'text-orange-500' : 'text-gray-400'}`}
                >
                  <Package className="w-5 h-5" />
                  <span className="text-xs">Orders</span>
                </button>
                <button
                  onClick={() => setCurrentScreen('wallet')}
                  className={`flex flex-col items-center gap-1 p-2 ${currentScreen === 'wallet' ? 'text-orange-500' : 'text-gray-400'}`}
                >
                  <Wallet className="w-5 h-5" />
                  <span className="text-xs">Wallet</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full"></div>
      </div>
    </div>
  );
};

export default InteractiveStorefrontDemo;
