import React from 'react';
import { motion } from 'framer-motion';
import {
    Rocket,
    CheckCircle2,
    Users,
    Zap,
    DollarSign,
    Clock,
    ShieldCheck,
    Headphones,
    FileText,
    BarChart3,
    Layers
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const InvestmentPlanSection = () => {
    const { isRTL } = useLanguage();

    const timelineSteps = [
        {
            icon: Layers,
            title: "Demos & Discovery",
            description: "We start by understanding your needs through personalized demos and deep-dive discovery sessions.",
            color: "text-blue-400",
            bg: "bg-blue-500/10",
            border: "border-blue-500/20"
        },
        {
            icon: Rocket,
            title: "Implementation Milestones",
            description: "Agile delivery with clear milestones, ensuring you see value at every step of the journey.",
            color: "text-cyan-400",
            bg: "bg-cyan-500/10",
            border: "border-cyan-500/20"
        },
        {
            icon: CheckCircle2,
            title: "UAT Sessions",
            description: "User Acceptance Testing ensures the solution meets your exact requirements before go-live.",
            color: "text-purple-400",
            bg: "bg-purple-500/10",
            border: "border-purple-500/20"
        },
        {
            icon: Users,
            title: "Adoption & Training",
            description: "Comprehensive training and support to ensure your team adopts and loves the new system.",
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
            border: "border-emerald-500/20"
        }
    ];

    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gray-900 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-800/50 to-gray-900 pointer-events-none" />
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold text-white mb-6"
                    >
                        Investment <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Plan</span> & Journey
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-gray-400 max-w-3xl mx-auto"
                    >
                        A transparent, value-driven approach to transforming your business with Salesforce.
                    </motion.p>
                </div>

                {/* 1. Implementation Timeline */}
                <div className="mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h3 className="text-2xl font-semibold text-white mb-4 flex items-center justify-center gap-2">
                            <Zap className="w-6 h-6 text-yellow-400" />
                            Implementation Journey
                        </h3>
                        <p className="text-gray-400">
                            Fast adoption with variance cost depending on complexity and R&D needed.
                        </p>
                    </motion.div>

                    <div className="relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-[60px] left-0 w-full h-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-emerald-500/20 rounded-full" />

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            {timelineSteps.map((step, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="relative group"
                                >
                                    <div className={`
                    w-24 h-24 mx-auto mb-6 rounded-2xl rotate-3 group-hover:rotate-0 transition-all duration-300
                    flex items-center justify-center ${step.bg} border ${step.border}
                    backdrop-blur-sm relative z-10 shadow-lg shadow-black/50
                  `}>
                                        <step.icon className={`w-10 h-10 ${step.color}`} />
                                    </div>

                                    <div className="text-center px-4">
                                        <h4 className="text-lg font-bold text-white mb-3">{step.title}</h4>
                                        <p className="text-sm text-gray-400 leading-relaxed">{step.description}</p>
                                    </div>

                                    {/* Connecting Arrow for Mobile */}
                                    {index < timelineSteps.length - 1 && (
                                        <div className="md:hidden flex justify-center my-4">
                                            <div className="w-0.5 h-8 bg-gray-700" />
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 }}
                            className="mt-12 text-center"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-800/50 border border-gray-700 text-sm text-gray-300">
                                <FileText className="w-4 h-4 text-cyan-400" />
                                <span>Detailed quote is shared by the sales team within a proposal upon request</span>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* 2. Running Costs */}
                <div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h3 className="text-2xl font-semibold text-white mb-4 flex items-center justify-center gap-2">
                            <BarChart3 className="w-6 h-6 text-green-400" />
                            Running Costs
                        </h3>
                        <p className="text-gray-400">
                            Clear, predictable operational costs to keep your business moving forward.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {/* Licenses Cost */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-3xl p-8 hover:border-cyan-500/30 transition-all duration-300 group"
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className="bg-cyan-500/10 p-3 rounded-xl">
                                    <DollarSign className="w-8 h-8 text-cyan-400" />
                                </div>
                                <div className="bg-gray-700/50 px-3 py-1 rounded-full text-xs font-medium text-gray-300">
                                    Monthly / User
                                </div>
                            </div>

                            <h4 className="text-2xl font-bold text-white mb-4">Licenses Cost</h4>
                            <p className="text-gray-400 mb-6 leading-relaxed">
                                Flexible licensing based on your specific use cases. Pay only for the value you need, scalable as your team grows.
                            </p>

                            <ul className="space-y-3">
                                <li className="flex items-start gap-3 text-sm text-gray-300">
                                    <CheckCircle2 className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
                                    <span>Tailored to user roles and access needs</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-gray-300">
                                    <CheckCircle2 className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
                                    <span>Volume discounts available for larger teams</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-gray-300">
                                    <CheckCircle2 className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
                                    <span>Transparent pricing with no hidden fees</span>
                                </li>
                            </ul>
                        </motion.div>

                        {/* Support Cost */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-3xl p-8 hover:border-purple-500/30 transition-all duration-300 group"
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className="bg-purple-500/10 p-3 rounded-xl">
                                    <Headphones className="w-8 h-8 text-purple-400" />
                                </div>
                                <div className="bg-gray-700/50 px-3 py-1 rounded-full text-xs font-medium text-gray-300">
                                    Annual
                                </div>
                            </div>

                            <h4 className="text-2xl font-bold text-white mb-4">Support Cost</h4>
                            <p className="text-gray-400 mb-6 leading-relaxed">
                                Ongoing peace of mind. Usually costs less than implementation, ensuring continuous optimization and help.
                            </p>

                            <ul className="space-y-3">
                                <li className="flex items-start gap-3 text-sm text-gray-300">
                                    <CheckCircle2 className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                                    <span>Three-tiered options to match your needs</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-gray-300">
                                    <CheckCircle2 className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                                    <span>Dedicated success manager available</span>
                                </li>
                                <li className="flex items-start gap-3 text-sm text-gray-300">
                                    <CheckCircle2 className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                                    <span>Regular health checks and roadmap planning</span>
                                </li>
                            </ul>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="mt-8 text-center"
                    >
                        <p className="text-sm text-gray-500">
                            Official pricing and support packages are shared by the sales team upon request to ensure accuracy for your specific region and requirements.
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default InvestmentPlanSection;
