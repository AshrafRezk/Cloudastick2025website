import React, { useState, useMemo } from 'react';
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
  CheckCircle2
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

// Product data - mix of generic, inferred, and configurable categories
const generateProducts = (companyName: string): Product[] => {
  const baseProducts: Product[] = [
    // Electronics
    { id: '1', name: 'Wireless Headphones', price: 89.99, originalPrice: 129.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', category: 'Electronics', rating: 4.5, reviews: 234, inStock: true, description: 'Premium noise-cancelling wireless headphones' },
    { id: '2', name: 'Smart Watch', price: 249.99, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', category: 'Electronics', rating: 4.7, reviews: 189, inStock: true, description: 'Advanced fitness tracking smartwatch' },
    { id: '3', name: 'Laptop Stand', price: 39.99, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400', category: 'Electronics', rating: 4.3, reviews: 156, inStock: true, description: 'Ergonomic aluminum laptop stand' },
    
    // Fashion
    { id: '4', name: 'Classic Leather Jacket', price: 199.99, originalPrice: 299.99, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400', category: 'Fashion', rating: 4.6, reviews: 312, inStock: true, description: 'Premium genuine leather jacket' },
    { id: '5', name: 'Running Shoes', price: 129.99, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', category: 'Fashion', rating: 4.4, reviews: 278, inStock: true, description: 'Comfortable athletic running shoes' },
    { id: '6', name: 'Designer Sunglasses', price: 149.99, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400', category: 'Fashion', rating: 4.5, reviews: 145, inStock: true, description: 'UV protection designer sunglasses' },
    
    // Home & Garden
    { id: '7', name: 'Modern Coffee Table', price: 349.99, image: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=400', category: 'Home', rating: 4.8, reviews: 89, inStock: true, description: 'Sleek modern coffee table design' },
    { id: '8', name: 'Indoor Plant Set', price: 49.99, image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400', category: 'Home', rating: 4.6, reviews: 167, inStock: true, description: 'Set of 3 indoor plants with pots' },
    { id: '9', name: 'Smart LED Lights', price: 79.99, image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400', category: 'Home', rating: 4.4, reviews: 203, inStock: true, description: 'Color-changing smart LED light strips' },
    
    // Health & Beauty
    { id: '10', name: 'Skincare Set', price: 89.99, originalPrice: 129.99, image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400', category: 'Beauty', rating: 4.7, reviews: 445, inStock: true, description: 'Complete daily skincare routine set' },
    { id: '11', name: 'Perfume Collection', price: 119.99, image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400', category: 'Beauty', rating: 4.5, reviews: 298, inStock: true, description: 'Luxury fragrance collection' },
    
    // Sports
    { id: '12', name: 'Yoga Mat Premium', price: 39.99, image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400', category: 'Sports', rating: 4.6, reviews: 234, inStock: true, description: 'Non-slip premium yoga mat' },
    { id: '13', name: 'Dumbbell Set', price: 149.99, image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', category: 'Sports', rating: 4.8, reviews: 156, inStock: true, description: 'Adjustable weight dumbbell set' },
  ];

  // Infer products based on company name
  const companyLower = companyName.toLowerCase();
  const inferredProducts: Product[] = [];
  
  if (companyLower.includes('ceramic') || companyLower.includes('porcelain') || companyLower.includes('tile')) {
    inferredProducts.push(
      { id: 'inf1', name: 'Ceramic Dinner Set', price: 79.99, image: 'https://images.unsplash.com/photo-1556910096-6f5e72db6803?w=400', category: 'Home', rating: 4.7, reviews: 189, inStock: true, description: 'Elegant ceramic dinner set for 6' },
      { id: 'inf2', name: 'Porcelain Vase Collection', price: 129.99, image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400', category: 'Home', rating: 4.5, reviews: 145, inStock: true, description: 'Handcrafted porcelain vases' },
      { id: 'inf3', name: 'Ceramic Tile Samples', price: 24.99, image: 'https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=400', category: 'Home', rating: 4.6, reviews: 98, inStock: true, description: 'Premium ceramic tile sample pack' }
    );
  }
  
  if (companyLower.includes('fashion') || companyLower.includes('apparel') || companyLower.includes('clothing')) {
    inferredProducts.push(
      { id: 'inf4', name: 'Designer Collection', price: 299.99, image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400', category: 'Fashion', rating: 4.8, reviews: 267, inStock: true, description: 'Exclusive designer clothing collection' },
      { id: 'inf5', name: 'Premium Accessories', price: 89.99, image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400', category: 'Fashion', rating: 4.6, reviews: 198, inStock: true, description: 'Luxury fashion accessories set' }
    );
  }

  return [...baseProducts, ...inferredProducts];
};

const InteractiveStorefrontDemo: React.FC<InteractiveStorefrontDemoProps> = ({ companyName, companyLogo }) => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [walletBalance] = useState(1250.50);
  
  const products = useMemo(() => generateProducts(companyName), [companyName]);
  
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
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-6 mx-4 mt-4 rounded-xl">
        <h2 className="text-xl font-bold mb-2">Special Offer!</h2>
        <p className="text-sm opacity-90">Get 20% off on selected items</p>
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
            <div className="text-2xl mb-2">🎯</div>
            <p className="font-semibold text-sm text-gray-900">Recommendations</p>
            <p className="text-xs text-gray-500 mt-1">For you</p>
          </button>
          <button
            onClick={() => setCurrentScreen('bundles')}
            className="bg-white p-4 rounded-lg border border-gray-200 text-left"
          >
            <div className="text-2xl mb-2">📦</div>
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

  const renderCheckoutScreen = () => (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => setCurrentScreen('cart')} className="p-1">
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
            <h3 className="font-semibold text-gray-900">Payment Method</h3>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <CreditCard className="w-5 h-5 text-gray-600" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">•••• •••• •••• 4242</p>
            </div>
          </div>
        </div>

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
          onClick={() => {
            alert('Order placed successfully!');
            setCartItems([]);
            setCurrentScreen('home');
          }}
          className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold"
        >
          Place Order
        </button>
      </div>
    </div>
  );

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
