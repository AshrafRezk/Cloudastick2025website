import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Truck, LayoutTemplate, Smartphone, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import AnimatedSection from './AnimatedSection';
import Button from './Button';

const TechSaSection = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const images = [
        "https://i0.wp.com/merge.techsa.io/wp-content/uploads/2023/09/shipper.png?w=1489&ssl=1",
        "https://i0.wp.com/merge.techsa.io/wp-content/uploads/2023/09/Picture2.png?w=1001&ssl=1"
    ];

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    // Auto-advance carousel
    useEffect(() => {
        const timer = setInterval(nextImage, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="py-20 relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-gray-900 to-indigo-900"></div>

            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '40px 40px' }}>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <AnimatedSection className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-full text-blue-300 text-sm font-medium mb-6 border border-blue-500/30">
                            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                            Strategic Partnership
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Cloudastick's Sister Company: <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Techsa</span>
                        </h2>

                        <div className="flex justify-center">
                            <div className="rounded-3xl bg-gradient-to-r from-blue-400/30 via-cyan-300/30 to-indigo-400/30 p-[1px] shadow-[0_30px_90px_-40px_rgba(59,130,246,0.9)]">
                                <div className="rounded-3xl border border-white/10 bg-white/5 px-8 py-5 backdrop-blur-sm">
                                    <img
                                        src="https://techsa.io/wp-content/uploads/2022/07/Original-on-Transparent-1-1536x281.png"
                                        alt="Techsa logo"
                                        className="h-14 md:h-16 w-auto drop-shadow-[0_18px_36px_rgba(56,189,248,0.5)]"
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                        </div>

                        <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                            Expanding our ecosystem with deep expertise in Distribution Management Systems (DMS) through our sister company, Techsa, and their flagship solution, Merge.
                        </p>
                    </motion.div>
                </AnimatedSection>

                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Content Side */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="order-2 lg:order-1"
                    >
                        <div className="space-y-8">
                            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-blue-500/30 transition-all duration-300">
                                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                                    <LayoutTemplate className="w-8 h-8 text-blue-400" />
                                    Merge by Techsa
                                </h3>
                                <p className="text-gray-300 leading-relaxed mb-6">
                                    A comprehensive Distribution Management System designed to streamline operations for distributors and manufacturers.
                                </p>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                                            <Truck className="w-4 h-4 text-blue-300" />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-semibold text-sm">B2B Distribution</h4>
                                            <p className="text-gray-400 text-xs">Optimize bulk deliveries and supply chain logistics.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                                            <Smartphone className="w-4 h-4 text-cyan-300" />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-semibold text-sm">B2C Last Mile</h4>
                                            <p className="text-gray-400 text-xs">Seamless direct-to-consumer delivery management.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <a href="https://techsa.io" target="_blank" rel="noopener noreferrer">
                                    <Button variant="primary" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                                        Visit Techsa <ExternalLink className="ml-2 w-4 h-4" />
                                    </Button>
                                </a>
                                <a href="https://merge.techsa.io" target="_blank" rel="noopener noreferrer">
                                    <Button variant="secondary" className="w-full sm:w-auto border-blue-500/30 hover:bg-blue-500/10">
                                        Explore Merge Solution <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>
                                </a>
                            </div>
                        </div>
                    </motion.div>

                    {/* Carousel Side */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="order-1 lg:order-2"
                    >
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-gray-900 group">
                            <div className="aspect-video relative overflow-hidden">
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={currentImageIndex}
                                        src={images[currentImageIndex]}
                                        alt={`Techsa Merge Platform Preview ${currentImageIndex + 1}`}
                                        className="w-full h-full object-cover"
                                        initial={{ opacity: 0, scale: 1.1 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </AnimatePresence>

                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent pointer-events-none"></div>
                            </div>

                            {/* Carousel Controls */}
                            <button
                                onClick={prevImage}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>

                            {/* Dots */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                {images.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentImageIndex(idx)}
                                        className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-blue-400 w-6' : 'bg-gray-400'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default TechSaSection;
