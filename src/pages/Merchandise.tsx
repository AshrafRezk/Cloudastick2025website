import { motion } from "framer-motion";
import { ShoppingBag, TShirt, Coffee, Gift, Star, ShoppingCart } from "lucide-react";
import AnimatedSection from "../components/AnimatedSection";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useState } from "react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  image: string;
  category: string;
  featured?: boolean;
}

const Merchandise = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Sample merchandise products - replace with actual products
  const products: Product[] = [
    {
      id: "1",
      name: "Cloudastick T-Shirt",
      description: "Premium cotton t-shirt with Cloudastick logo. Comfortable fit for everyday wear.",
      price: "$29.99",
      image: "/placeholder.svg",
      category: "apparel",
      featured: true,
    },
    {
      id: "2",
      name: "Cloudastick Hoodie",
      description: "Cozy hoodie perfect for cooler days. Features embroidered Cloudastick branding.",
      price: "$49.99",
      image: "/placeholder.svg",
      category: "apparel",
      featured: true,
    },
    {
      id: "3",
      name: "Cloudastick Coffee Mug",
      description: "Ceramic mug with Cloudastick logo. Perfect for your morning coffee or tea.",
      price: "$19.99",
      image: "/placeholder.svg",
      category: "accessories",
    },
    {
      id: "4",
      name: "Cloudastick Laptop Sticker Pack",
      description: "Set of premium vinyl stickers featuring Cloudastick branding and designs.",
      price: "$9.99",
      image: "/placeholder.svg",
      category: "accessories",
    },
    {
      id: "5",
      name: "Cloudastick Notebook",
      description: "Premium notebook with Cloudastick branding. Perfect for meetings and notes.",
      price: "$14.99",
      image: "/placeholder.svg",
      category: "accessories",
    },
    {
      id: "6",
      name: "Cloudastick Tote Bag",
      description: "Eco-friendly canvas tote bag with Cloudastick logo. Perfect for carrying your essentials.",
      price: "$24.99",
      image: "/placeholder.svg",
      category: "accessories",
    },
    {
      id: "7",
      name: "Cloudastick Water Bottle",
      description: "Stainless steel water bottle with Cloudastick branding. Keep hydrated in style.",
      price: "$34.99",
      image: "/placeholder.svg",
      category: "accessories",
    },
    {
      id: "8",
      name: "Cloudastick Cap",
      description: "Adjustable cap with embroidered Cloudastick logo. Perfect for outdoor activities.",
      price: "$27.99",
      image: "/placeholder.svg",
      category: "apparel",
    },
  ];

  const categories = [
    { id: "all", name: "All Products", icon: ShoppingBag },
    { id: "apparel", name: "Apparel", icon: TShirt },
    { id: "accessories", name: "Accessories", icon: Gift },
  ];

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  const featuredProducts = products.filter((product) => product.featured);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-br from-gray-800 to-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatedSection className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-6"
            >
              <ShoppingBag className="w-16 h-16 text-cyan-400 mx-auto" />
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Cloudastick Merchandise
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Show your support for Cloudastick with our premium branded merchandise. 
              Quality products designed for Salesforce professionals and enthusiasts.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="py-20 bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="text-center mb-12">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Star className="w-6 h-6 text-yellow-400" />
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Featured Products
                </h2>
                <Star className="w-6 h-6 text-yellow-400" />
              </div>
              <p className="text-gray-400 text-lg">
                Our most popular items
              </p>
            </AnimatedSection>

            <div className="grid md:grid-cols-2 gap-8 mb-20">
              {featuredProducts.map((product, index) => (
                <AnimatedSection key={product.id} delay={index * 0.1}>
                  <motion.div
                    whileHover={{ y: -5, scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="bg-gray-800/80 backdrop-blur-sm border-gray-700 hover:border-cyan-500/50 transition-all duration-300 overflow-hidden">
                      <div className="relative h-64 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                          }}
                        />
                        {!product.image || product.image === "/placeholder.svg" ? (
                          <ShoppingBag className="w-24 h-24 text-gray-600" />
                        ) : null}
                      </div>
                      <CardHeader>
                        <CardTitle className="text-white text-2xl">{product.name}</CardTitle>
                        <CardDescription className="text-gray-400 text-base">
                          {product.description}
                        </CardDescription>
                      </CardHeader>
                      <CardFooter className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-cyan-400">{product.price}</span>
                        <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white">
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Add to Cart
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Category Filter */}
      <section className="py-8 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <motion.button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    selectedCategory === category.id
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/50"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {category.name}
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
              All Products
            </h2>
            <p className="text-gray-400 text-center text-lg">
              Browse our complete collection
            </p>
          </AnimatedSection>

          {filteredProducts.length === 0 ? (
            <AnimatedSection className="text-center py-20">
              <p className="text-gray-400 text-xl">No products found in this category.</p>
            </AnimatedSection>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <AnimatedSection key={product.id} delay={index * 0.05}>
                  <motion.div
                    whileHover={{ y: -5, scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="bg-gray-800/80 backdrop-blur-sm border-gray-700 hover:border-cyan-500/50 transition-all duration-300 overflow-hidden h-full flex flex-col">
                      <div className="relative h-48 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                          }}
                        />
                        {!product.image || product.image === "/placeholder.svg" ? (
                          <ShoppingBag className="w-16 h-16 text-gray-600" />
                        ) : null}
                      </div>
                      <CardHeader className="flex-grow">
                        <CardTitle className="text-white">{product.name}</CardTitle>
                        <CardDescription className="text-gray-400">
                          {product.description}
                        </CardDescription>
                      </CardHeader>
                      <CardFooter className="flex items-center justify-between mt-auto">
                        <span className="text-xl font-bold text-cyan-400">{product.price}</span>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Add
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-br from-gray-800 to-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Questions About Our Merchandise?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Have questions about sizing, shipping, or custom orders? We're here to help!
            </p>
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-lg px-8 py-6"
            >
              <a href="/contact">Contact Us</a>
            </Button>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default Merchandise;



