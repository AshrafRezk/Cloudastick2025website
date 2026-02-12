import { motion } from "framer-motion";
import { ShoppingBag, Star, ExternalLink } from "lucide-react";
import AnimatedSection from "../components/AnimatedSection";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";

interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
}

const Merchandise = () => {
  // Specific merchandise products provided by user
  const products: Product[] = [
    {
      id: "1",
      name: "Iconic Astro Mag Charger",
      price: "$58",
      image: "https://www.mybrandmall.com/store/20240530432/assets/items/thumbnails/SFC450.jpg",
    },
    {
      id: "2",
      name: "Hello, Astro! Crewneck Sweatshirt",
      price: "$48",
      image: "https://www.mybrandmall.com/store/20240530432/assets/items/largeimages/SFC458.jpg",
    },
    {
      id: "3",
      name: "Astro bot charging cable",
      price: "$10",
      image: "https://www.mybrandmall.com/store/20240530432/assets/items/thumbnails/STB145.jpg",
    },
    {
      id: "4",
      name: "Astro Apple airpods pro case cover",
      price: "$20",
      image: "https://www.mybrandmall.com/store/20240530432/assets/items/thumbnails/SFC246.jpg",
    },
    {
      id: "5",
      name: "Trailblazer book tower",
      price: "$28",
      image: "https://www.mybrandmall.com/store/20240530432/assets/items/thumbnails/STB110.jpg",
    },
    {
      id: "6",
      name: "Roll-top Cooler Backpack",
      price: "$50",
      image: "https://www.mybrandmall.com/store/20240530432/assets/items/thumbnails/SFC253.jpg",
    },
  ];

  const handleProductClick = () => {
    window.location.href = "https://www.mybrandmall.com/salesforcestore";
  };

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

      {/* Products Grid */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
              Featured Collection
            </h2>
            <p className="text-gray-400 text-center text-lg">
              Check out our latest arrivals
            </p>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <AnimatedSection key={product.id} delay={index * 0.1}>
                <motion.div
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  onClick={handleProductClick}
                  className="cursor-pointer h-full"
                >
                  <Card className="bg-gray-800/80 backdrop-blur-sm border-gray-700 hover:border-cyan-500/50 transition-all duration-300 overflow-hidden h-full flex flex-col group">
                    <div className="relative h-64 bg-white flex items-center justify-center p-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                        }}
                      />
                      {!product.image && (
                        <ShoppingBag className="w-16 h-16 text-gray-400" />
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <span className="bg-white/90 text-gray-900 px-4 py-2 rounded-full font-medium flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                          View Store <ExternalLink className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                    <CardHeader className="flex-grow">
                      <CardTitle className="text-white text-xl line-clamp-2">{product.name}</CardTitle>
                    </CardHeader>
                    <CardFooter className="flex items-center justify-between mt-auto border-t border-gray-700 pt-4">
                      <span className="text-2xl font-bold text-cyan-400">{product.price}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30"
                      >
                        Visit Store
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-gradient-to-br from-gray-800 to-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Want to see more?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Explore our full collection at the official Salesforce Store.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-lg px-8 py-6"
            >
              <a href="https://www.mybrandmall.com/salesforcestore">Visit Salesforce Store</a>
            </Button>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default Merchandise;



