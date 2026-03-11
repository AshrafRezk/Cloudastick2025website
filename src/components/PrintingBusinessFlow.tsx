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
            glow: 'rgba(59, 130, 246, 0.5)'
        },
        {
            title: 'Lead Capturing',
            icon: UserCheck,
            description: 'Instant lead capture from all sources with AI-driven qualification and automated routing logic.',
            color: 'from-cyan-400 to-blue-500',
            glow: 'rgba(34, 211, 238, 0.5)'
        },
        {
            title: 'Specs & Qualification',
            icon: Layers,
            description: 'Detailed specification highlights and comprehensive opportunity qualification for precision bidding.',
            color: 'from-purple-500 to-pink-600',
            glow: 'rgba(168, 85, 247, 0.5)'
        },
        {
            title: 'Samples Sharing',
            icon: CheckCircle2,
            description: 'Seamless digital sample sharing with real-time customer feedback and collaborative approval loops.',
            color: 'from-emerald-400 to-teal-500',
            glow: 'rgba(52, 211, 153, 0.5)'
        },
        {
            title: 'Order & ERP Management',
            icon: RefreshCw,
            description: 'End-to-end contract and order management with seamless real-time ERP data synchronization.',
            color: 'from-amber-400 to-orange-500',
            glow: 'rgba(251, 191, 36, 0.5)'
        },
        {
            title: 'Account Management',
            icon: DollarSign,
            description: `Unified view for ${companyName || 'your company'} with opportunities, contracts, orders, and investment size.`,
            color: 'from-green-500 to-emerald-600',
            glow: 'rgba(34, 197, 94, 0.5)'
        },
        {
            title: 'After Sales Management',
            icon: Headset,
            description: 'Proactive customer success management and high-standard after-sales support orchestration.',
            color: 'from-pink-500 to-rose-600',
            glow: 'rgba(236, 72, 153, 0.5)'
        }
    ];

    return (
        <section className="py-32 relative overflow-hidden bg-[#030712]">
            {/* High-end ambient background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,24,39,1)_0%,rgba(3,7,18,1)_100%)]"></div>
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <AnimatedSection className="text-center mb-28">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full text-cyan-300 text-xs font-bold uppercase tracking-widest mb-8 border border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.1)]"
                    >
                        <Sparkles className="w-4 h-4 text-cyan-400" />
                        <span>The Business Lifecycle</span>
                    </motion.div>
                    <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-8 tracking-tight">
                        Orchestrating <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400">End-to-End Excellence</span>
                    </h2>
                    <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-light">
                        A single, high-standard platform that powers your entire journey—from the first lead to lasting after-sales success.
                    </p>
                </AnimatedSection>

                <div className="relative">
                    {/* Vertical Connector Line */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gray-700 to-transparent transform -translate-x-1/2 hidden lg:block"></div>

                    <div className="space-y-12 lg:space-y-40 relative">
                        {steps.map((step, index) => {
                            const isEven = index % 2 === 0;
                            return (
                                <div key={index} className="relative">
                                    {/* Mobile/Tablet view */}
                                    <div className="lg:hidden">
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            className="p-8 bg-white/[0.03] backdrop-blur-xl rounded-3xl border border-white/10 relative overflow-hidden group"
                                        >
                                            <div className="flex items-center gap-5 mb-4">
                                                <div className={`w-14 h-14 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center shadow-xl relative z-10`}>
                                                    <step.icon className="w-7 h-7 text-white" />
                                                </div>
                                                <h3 className="text-xl font-bold text-white tracking-tight">{step.title}</h3>
                                            </div>
                                            <p className="text-gray-400 leading-relaxed text-sm">{step.description}</p>
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full pointer-events-none"></div>
                                        </motion.div>
                                    </div>

                                    {/* Desktop Zig-Zag View */}
                                    <div className="hidden lg:flex items-center justify-center">
                                        <div className={`w-1/2 flex ${isEven ? 'justify-end pr-20' : 'justify-start pl-20 order-2'}`}>
                                            <motion.div
                                                initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true, margin: "-100px" }}
                                                transition={{ duration: 0.8, ease: "easeOut" }}
                                                className="max-w-md w-full"
                                            >
                                                <div className="relative group">
                                                    {/* Card */}
                                                    <div className="relative z-10 p-12 bg-gray-900/40 backdrop-blur-xl rounded-[2.5rem] border border-white/10 hover:border-white/20 transition-all duration-500 shadow-2xl group-hover:-translate-y-2 flex flex-col h-full">
                                                        <div className="flex flex-col gap-8 h-full">
                                                            <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center shadow-lg relative shrink-0`}>
                                                                <step.icon className="w-8 h-8 text-white" />
                                                                <div className="absolute inset-0 bg-white opacity-20 blur-xl scale-150 rounded-full -z-10"></div>
                                                            </div>
                                                            <div className="flex-grow">
                                                                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors tracking-tight">{step.title}</h3>
                                                                <p className="text-gray-400 leading-relaxed group-hover:text-gray-200 transition-all duration-500 text-lg font-light">
                                                                    {step.description}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Decorative corner element */}
                                                        <div className={`absolute -right-4 -bottom-4 w-32 h-32 bg-gradient-to-br ${step.color} opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity`}></div>
                                                    </div>

                                                    {/* Connection Point Bloom */}
                                                    <div className={`absolute top-1/2 ${isEven ? '-right-[84px]' : '-left-[84px]'} w-4 h-4 rounded-full bg-white z-20 shadow-[0_0_20px_rgba(255,255,255,0.8)] transform -translate-y-1/2`}>
                                                        <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-25 scale-[2.5]"></div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </div>

                                        {/* Center Number/Step Display */}
                                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
                                            <motion.div
                                                initial={{ scale: 0, rotate: -45 }}
                                                whileInView={{ scale: 1, rotate: 0 }}
                                                viewport={{ once: true }}
                                                className="w-16 h-16 rounded-3xl bg-[#030712] border border-gray-800 flex items-center justify-center text-gray-500 font-black text-lg shadow-[0_0_30px_rgba(0,0,0,0.5)] rotate-45"
                                            >
                                                <span className="-rotate-45">0{index + 1}</span>
                                            </motion.div>
                                        </div>

                                        <div className="w-1/2"></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-40">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative p-16 bg-gradient-to-br from-gray-900/80 to-black/80 rounded-[4rem] border border-white/10 overflow-hidden shadow-3xl text-center md:text-left group"
                    >
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(0,0,0,0)_0%,rgba(6,182,212,0.05)_100%)]"></div>
                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-16">
                            <div className="flex-shrink-0 relative">
                                <div className="w-32 h-32 bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 rounded-[2.5rem] flex items-center justify-center shadow-[0_30px_60px_rgba(6,182,212,0.4)] relative z-10 rotate-6 group-hover:rotate-0 transition-transform duration-700">
                                    <Check className="w-16 h-16 text-white" />
                                </div>
                                <div className="absolute inset-0 bg-cyan-400 opacity-20 blur-[60px] scale-150 animate-pulse"></div>
                            </div>
                            <div>
                                <h4 className="text-3xl md:text-4xl font-black text-white mb-6 tracking-tight">Precision Engineering for Printing</h4>
                                <p className="text-xl text-gray-400 leading-relaxed font-light max-w-4xl">
                                    The industry-leading standard for operational excellence. We unify every touchpoint, eliminating data fragmentation and ensuring your business operates with surgical precision and massive scale.
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
