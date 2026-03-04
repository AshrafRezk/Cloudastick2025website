import React from 'react';
import { motion } from 'framer-motion';
import {
    Target,
    UserCheck,
    Layers,
    CheckCircle2,
    RefreshCw,
    DollarSign,
    Headset,
    ArrowRight,
    Sparkles,
    Check
} from 'lucide-react';
import AnimatedSection from './AnimatedSection';

const PrintingBusinessFlow = () => {
    const steps = [
        {
            title: 'Marketing',
            icon: Target,
            description: 'Strategic campaign management and multi-channel lead generation tailored for printing services.',
            color: 'bg-blue-500',
            shadow: 'shadow-blue-500/20'
        },
        {
            title: 'Lead Capturing',
            icon: UserCheck,
            description: 'Instant lead capture from all sources with AI-driven qualification and automated routing.',
            color: 'bg-cyan-500',
            shadow: 'shadow-cyan-500/20'
        },
        {
            title: 'Specs & Qualification',
            icon: Layers,
            description: 'Detailed specification highlights and comprehensive opportunity qualification for precision bidding.',
            color: 'bg-purple-500',
            shadow: 'shadow-purple-500/20'
        },
        {
            title: 'Samples Sharing',
            icon: CheckCircle2,
            description: 'Seamless digital sample sharing with real-time customer feedback and collaborative approval loops.',
            color: 'bg-emerald-500',
            shadow: 'shadow-emerald-500/20'
        },
        {
            title: 'Order & ERP Management',
            icon: RefreshCw,
            description: 'End-to-end contract and order management with seamless real-time ERP data synchronization.',
            color: 'bg-amber-500',
            shadow: 'shadow-amber-500/20'
        },
        {
            title: 'Account Cash-in/out',
            icon: DollarSign,
            description: 'Unified financial management for seamless accounts payable and receivable tracking.',
            color: 'bg-green-500',
            shadow: 'shadow-green-500/20'
        },
        {
            title: 'After Sales Management',
            icon: Headset,
            description: 'Proactive customer success management and high-standard after-sales support orchestration.',
            color: 'bg-pink-500',
            shadow: 'shadow-pink-500/20'
        }
    ];

    return (
        <section className="py-24 relative overflow-hidden bg-gray-900">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black"></div>

            {/* Animated background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 -right-12 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <AnimatedSection className="text-center mb-20">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 rounded-full text-cyan-300 text-sm font-medium mb-6 border border-cyan-500/30">
                        <Sparkles className="w-4 h-4" />
                        <span>End-to-End Excellence</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                        More than just a CRM for <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Printing Industries</span>
                    </h2>
                    <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
                        A single, high-standard platform that orchestrates your entire business lifecycle—from initial marketing contact to seamless after-sales service.
                    </p>
                </AnimatedSection>

                {/* Mobile View: Vertical List */}
                <div className="lg:hidden space-y-6">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="relative p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10"
                        >
                            <div className="flex items-center gap-4 mb-3">
                                <div className={`w-12 h-12 ${step.color} rounded-xl flex items-center justify-center shadow-lg ${step.shadow}`}>
                                    <step.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-white">{step.title}</h3>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Desktop View: Interactive Hub & Spoke Flow */}
                <div className="hidden lg:block relative">
                    {/* Main Flow Logic Connector */}
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent transform -translate-y-1/2 z-0"></div>

                    <div className="grid grid-cols-7 gap-4 relative z-10">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.6 }}
                                viewport={{ once: true }}
                                className="flex flex-col items-center group cursor-default"
                            >
                                <div className="relative mb-6">
                                    {/* Connector line for desktop */}
                                    {index < steps.length - 1 && (
                                        <div className="absolute left-full top-1/2 w-4 h-[2px] bg-cyan-500/30 transform -translate-y-1/2 translate-x-2"></div>
                                    )}

                                    <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center shadow-2xl ${step.shadow} group-hover:scale-110 transition-transform duration-500 relative z-10 border-2 border-white/20`}>
                                        <step.icon className="w-8 h-8 text-white" />
                                    </div>

                                    {/* Animation ping */}
                                    <div className={`absolute inset-0 rounded-2xl ${step.color} opacity-20 blur-xl group-hover:blur-2xl transition-all duration-500 scale-125`}></div>
                                </div>

                                <h3 className="text-white font-bold text-center text-sm mb-3 group-hover:text-cyan-400 transition-colors">{step.title}</h3>
                                <div className="p-4 bg-gray-800/80 backdrop-blur-xl rounded-xl border border-white/5 group-hover:border-cyan-500/30 transition-all duration-300 h-32 overflow-hidden shadow-xl">
                                    <p className="text-gray-400 text-xs text-center leading-relaxed group-hover:text-gray-200 transition-colors">
                                        {step.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="mt-20 flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="p-8 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-3xl border border-cyan-500/30 max-w-3xl w-full backdrop-blur-md"
                    >
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="flex-shrink-0 relative">
                                <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl relative z-10">
                                    <Check className="w-10 h-10 text-white" />
                                </div>
                                <div className="absolute inset-0 bg-cyan-400 opacity-20 blur-2xl rounded-full scale-150 animate-pulse"></div>
                            </div>
                            <div className="text-center md:text-left">
                                <h4 className="text-xl font-bold text-white mb-2">The Highest Standards Unified</h4>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    Avoid fragmented data and disconnected processes. Our Printing Industry solution centralizes every interaction, ensuring consistency, reliability, and precision at every stage of your business growth.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default PrintingBusinessFlow;
