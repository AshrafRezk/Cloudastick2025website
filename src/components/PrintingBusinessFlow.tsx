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

const PrintingBusinessFlow = ({ companyName }: { companyName?: string }) => {
    const steps = [
        {
            title: 'Marketing',
            icon: Target,
            description: 'Strategic campaign management and multi-channel lead generation tailored for printing services.',
            color: 'from-blue-500 to-indigo-600',
            glow: 'rgba(59, 130, 246, 0.4)'
        },
        {
            title: 'Lead Capturing',
            icon: UserCheck,
            description: 'Instant lead capture from all sources with AI-driven qualification and automated routing logic.',
            color: 'from-cyan-400 to-blue-500',
            glow: 'rgba(34, 211, 238, 0.4)'
        },
        {
            title: 'Specs & Qualification',
            icon: Layers,
            description: 'Detailed specification highlights and comprehensive opportunity qualification for precision bidding.',
            color: 'from-purple-500 to-pink-600',
            glow: 'rgba(168, 85, 247, 0.4)'
        },
        {
            title: 'Samples Sharing',
            icon: CheckCircle2,
            description: 'Seamless digital sample sharing with real-time customer feedback and collaborative approval loops.',
            color: 'from-emerald-400 to-teal-500',
            glow: 'rgba(52, 211, 153, 0.4)'
        },
        {
            title: 'Order & ERP Management',
            icon: RefreshCw,
            description: 'End-to-end contract and order management with seamless real-time ERP data synchronization.',
            color: 'from-amber-400 to-orange-500',
            glow: 'rgba(251, 191, 36, 0.4)'
        },
        {
            title: 'Account Management',
            icon: DollarSign,
            description: `Unified view for ${companyName || 'your company'} with opportunities, contracts, orders, and investment size.`,
            color: 'from-green-500 to-emerald-600',
            glow: 'rgba(34, 197, 94, 0.4)'
        },
        {
            title: 'After Sales Management',
            icon: Headset,
            description: 'Proactive customer success management and high-standard after-sales support orchestration.',
            color: 'from-pink-500 to-rose-600',
            glow: 'rgba(236, 72, 153, 0.4)'
        }
    ];

    return (
        <section className="py-20 relative overflow-hidden bg-[#030712]">
            {/* High-end ambient background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,1)_0%,rgba(3,7,18,1)_100%)]"></div>

            <div className="relative z-10 max-w-Full mx-auto px-4 sm:px-6 lg:px-12">
                <AnimatedSection className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 bg-cyan-500/10 rounded-full text-cyan-300 text-[10px] font-bold uppercase tracking-widest mb-4 border border-cyan-500/20 shadow-sm"
                    >
                        <Sparkles className="w-3 h-3 text-cyan-400" />
                        <span>The Business Lifecycle</span>
                    </motion.div>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 tracking-tight">
                        Orchestrating <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400">End-to-End Excellence</span>
                    </h2>
                </AnimatedSection>

                {/* Horizontal Flow Container */}
                <div className="relative">
                    {/* Main Flow Logic Connector */}
                    <div className="absolute top-[40px] left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent hidden lg:block z-0"></div>

                    <div className="flex flex-col lg:flex-row gap-4 lg:gap-2 justify-between items-start relative z-10">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                viewport={{ once: true }}
                                className="flex flex-col items-center group cursor-default flex-1 w-full lg:w-auto"
                            >
                                {/* Icon container with connector points */}
                                <div className="relative mb-6 flex items-center justify-center w-full">
                                    {/* Small Connector Lines */}
                                    {index < steps.length - 1 && (
                                        <div className="absolute left-[calc(50%+32px)] right-[-1px] top-1/2 h-[1px] bg-gradient-to-r from-cyan-500/30 to-transparent hidden lg:block"></div>
                                    )}
                                    {index > 0 && (
                                        <div className="absolute right-[calc(50%+32px)] left-[-1px] top-1/2 h-[1px] bg-gradient-to-l from-cyan-500/30 to-transparent hidden lg:block"></div>
                                    )}

                                    <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-500 relative z-10 border border-white/20`}>
                                        <step.icon className="w-8 h-8 text-white" />
                                        {/* Animation ping */}
                                        <div className={`absolute inset-0 rounded-2xl bg-white opacity-0 group-hover:opacity-20 transition-opacity blur-md`}></div>
                                    </div>

                                    {/* Number Badge */}
                                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-900 border border-gray-700 rounded-lg flex items-center justify-center text-[10px] font-bold text-gray-400 z-20 shadow-lg">
                                        0{index + 1}
                                    </div>
                                </div>

                                <h3 className="text-white font-bold text-center text-sm mb-3 group-hover:text-cyan-400 transition-colors h-10 flex items-center justify-center max-w-[120px]">
                                    {step.title}
                                </h3>

                                {/* Description Card */}
                                <div className="p-4 bg-gray-900/40 backdrop-blur-xl rounded-2xl border border-white/10 group-hover:border-cyan-500/30 transition-all duration-300 w-full min-h-[140px] shadow-xl relative overflow-hidden">
                                    <p className="text-gray-400 text-xs text-center leading-relaxed group-hover:text-gray-200 transition-colors relative z-10">
                                        {step.description}
                                    </p>
                                    {/* Subtle Gradient Glow */}
                                    <div className={`absolute -bottom-10 -right-10 w-24 h-24 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-10 transition-opacity blur-2xl rounded-full`}></div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Footer Insight */}
                <div className="mt-16 flex justify-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="px-8 py-4 bg-white/[0.02] backdrop-blur-md rounded-2xl border border-white/5 flex flex-col md:flex-row items-center gap-6 max-w-4xl"
                    >
                        <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shrink-0">
                            <Check className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed text-center md:text-left font-light">
                            <span className="text-white font-semibold">The Highest Standards Unified:</span> Avoid fragmented data and disconnected processes. Our Printing Industry solution centralizes every interaction, ensuring consistency and precision.
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default PrintingBusinessFlow;
