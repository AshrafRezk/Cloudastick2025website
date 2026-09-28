import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, MessageSquare, BarChart3, Users, Zap, PieChart, Mail, MessageCircle, Smartphone, BrainCircuit, Laptop, Lightbulb, Activity, MapPin, TrendingUp, Layers, Brain, Phone, SendHorizonal, Stethoscope, HeartPulse, Bot, Mic, ClipboardList, Globe, ShieldCheck, CheckCircle2, ArrowRight, Bell, FileText, Lock, Sparkles, ChevronDown } from 'lucide-react';
import AnimatedSection from './AnimatedSection';


const PharmaSections = () => {
    return (
        <div className="space-y-24 py-12">
            {/* targeting and Segmentation Section */}
            <section className="relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500/20 rounded-full text-rose-300 text-sm font-medium mb-6 border border-rose-500/30">
                                <Target className="w-4 h-4" />
                                <span>Precision Targeting</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                                Advanced Targeting & <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-400">
                                    Segmentation
                                </span>
                            </h2>
                            <p className="text-gray-300 text-lg leading-relaxed mb-8">
                                Leverage AI-driven insights to segment Healthcare Professionals (HCPs) and patients with unprecedented accuracy. optimize your engagement strategy by targeting the right audience with the right message at the right time.
                            </p>

                            <div className="space-y-4">
                                {[
                                    { icon: Users, text: "Dynamic HCP segmentation based on prescribing behavior and preferences" },
                                    { icon: Zap, text: "AI-powered potential formulation to identify high-value targets" },
                                    { icon: PieChart, text: "Real-time territory alignment and coverage optimization" }
                                ].map((item, index) => (
                                    <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-rose-500/30 transition-colors">
                                        <div className="p-2 bg-rose-500/20 rounded-lg">
                                            <item.icon className="w-5 h-5 text-rose-400" />
                                        </div>
                                        <span className="text-gray-200">{item.text}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >
                            <div className="aspect-square rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-8 flex items-center justify-center">
                                {/* Abstract Visualization of Segmentation */}
                                <div className="relative w-full h-full">
                                    <div className="absolute inset-0 bg-rose-500/10 rounded-full blur-3xl animate-pulse" />
                                    <div className="grid grid-cols-2 gap-4 h-full">
                                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-white/5 flex flex-col justify-between">
                                            <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center mb-4">
                                                <Users className="w-5 h-5 text-rose-400" />
                                            </div>
                                            <div>
                                                <div className="text-2xl font-bold text-white mb-1">Top Tier</div>
                                                <div className="text-xs text-rose-300">High Potential HCPs</div>
                                            </div>
                                            <div className="mt-4 h-2 bg-gray-700 rounded-full overflow-hidden">
                                                <div className="h-full w-3/4 bg-rose-500 rounded-full" />
                                            </div>
                                        </div>
                                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-white/5 flex flex-col justify-between mt-8">
                                            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
                                                <Target className="w-5 h-5 text-blue-400" />
                                            </div>
                                            <div>
                                                <div className="text-2xl font-bold text-white mb-1">Growth</div>
                                                <div className="text-xs text-blue-300">Emerging Prescribers</div>
                                            </div>
                                            <div className="mt-4 h-2 bg-gray-700 rounded-full overflow-hidden">
                                                <div className="h-full w-1/2 bg-blue-500 rounded-full" />
                                            </div>
                                        </div>
                                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-white/5 flex flex-col justify-between -mt-8">
                                            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
                                                <Zap className="w-5 h-5 text-purple-400" />
                                            </div>
                                            <div>
                                                <div className="text-2xl font-bold text-white mb-1">Digital</div>
                                                <div className="text-xs text-purple-300">Tech-Savvy Segment</div>
                                            </div>
                                            <div className="mt-4 h-2 bg-gray-700 rounded-full overflow-hidden">
                                                <div className="h-full w-4/5 bg-purple-500 rounded-full" />
                                            </div>
                                        </div>
                                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-white/5 flex flex-col justify-between">
                                            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                                                <PieChart className="w-5 h-5 text-emerald-400" />
                                            </div>
                                            <div>
                                                <div className="text-2xl font-bold text-white mb-1">Loyal</div>
                                                <div className="text-xs text-emerald-300">Consistent Prescribers</div>
                                            </div>
                                            <div className="mt-4 h-2 bg-gray-700 rounded-full overflow-hidden">
                                                <div className="h-full w-full bg-emerald-500 rounded-full" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Promotional Activities Section */}
            <section className="relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="order-2 lg:order-1 relative"
                        >
                            <div className="aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-gray-900 relative group">
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent z-10" />
                                {/* Mock UI for Promotional Activity */}
                                <div className="absolute inset-0 p-8 flex flex-col justify-end z-20">
                                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white">JM</div>
                                            <div className="text-sm font-semibold text-white">Dr. John Mitchell</div>
                                            <span className="text-xs text-green-400 ml-auto flex items-center gap-1">
                                                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                                                Engaged
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-300">Just viewed "New Cardiology Study" via Email Campaign. Suggested Action: Schedule Follow-up Call.</p>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 delay-100">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-xs font-bold text-white">ES</div>
                                            <div className="text-sm font-semibold text-white">Dr. Emily Stone</div>
                                            <span className="text-xs text-yellow-400 ml-auto">Pending Visit</span>
                                        </div>
                                        <p className="text-xs text-gray-300">Scheduled for Lunch & Learn on Friday. Material: Guidelines Update 2026.</p>
                                    </div>
                                </div>
                                {/* Background decoration */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -mr-32 -mt-32" />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="order-1 lg:order-2"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-full text-blue-300 text-sm font-medium mb-6 border border-blue-500/30">
                                <MessageSquare className="w-4 h-4" />
                                <span>Omnichannel Engagement</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                                Orchestrated <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                                    Promotional Activities
                                </span>
                            </h2>
                            <p className="text-gray-300 text-lg leading-relaxed mb-8">
                                Deliver seamless, personalized experiences across all channels. Integrate face-to-face detailing, remote visits, email campaigns, and events into a unified promotional strategy.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "Closed-Loop Marketing (CLM) with interactive detailing aids",
                                    "Automated event management for webinars and conferences",
                                    "Approved Email integration with compliant templates",
                                    "Multi-channel journey orchestration via Marketing Cloud"
                                ].map((item, index) => (
                                    <li key={index} className="flex items-center gap-3 text-gray-200">
                                        <span className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
                                            <div className="w-2 h-2 bg-blue-400 rounded-full" />
                                        </span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </section>

            
            {/* Marketing Cloud Section */}
            <section className="relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/20 rounded-full text-indigo-300 text-sm font-medium mb-6 border border-indigo-500/30">
                                <Activity className="w-4 h-4" />
                                <span>Marketing Cloud</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                                Intelligent <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                                    Patient & HCP Journeys
                                </span>
                            </h2>
                            <p className="text-gray-300 text-lg leading-relaxed mb-8">
                                Deliver personalized, multi-channel marketing campaigns at scale. Capture sentiment, intent, and measurable ROI across every touchpoint to continuously optimize your outreach.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                {[
                                    { icon: Mail, text: "Email Campaigns" },
                                    { icon: MessageCircle, text: "WhatsApp Campaigns" },
                                    { icon: Smartphone, text: "SMS Campaigns" },
                                    { icon: BrainCircuit, text: "Intent & Sentiment Analysis" }
                                ].map((item, index) => (
                                    <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                                        <div className="p-2 bg-indigo-500/20 rounded-lg">
                                            <item.icon className="w-4 h-4 text-indigo-400" />
                                        </div>
                                        <span className="text-gray-200 text-sm font-medium">{item.text}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >
                            <div className="aspect-square sm:aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-gradient-to-br from-indigo-900/40 to-gray-900 p-8 flex items-center justify-center relative">
                                <div className="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-full mix-blend-screen" />
                                
                                <div className="w-full space-y-4 relative z-10">
                                    {/* Mock Journey Steps */}
                                    <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                                                <Mail className="w-5 h-5 text-blue-400" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-white">Initial Outreach</div>
                                                <div className="text-xs text-gray-400">Email Campaign</div>
                                            </div>
                                        </div>
                                        <div className="text-xs text-green-400 font-medium">+42% Open Rate</div>
                                    </div>

                                    <div className="w-1 h-6 bg-gradient-to-b from-blue-500/50 to-emerald-500/50 mx-auto" />

                                    <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                                <MessageCircle className="w-5 h-5 text-emerald-400" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-white">Engagement Follow-up</div>
                                                <div className="text-xs text-gray-400">WhatsApp Push</div>
                                            </div>
                                        </div>
                                        <div className="text-xs text-emerald-400 font-medium">Positive Sentiment</div>
                                    </div>
                                    
                                    <div className="w-1 h-6 bg-gradient-to-b from-emerald-500/50 to-indigo-500/50 mx-auto" />
                                    
                                    <div className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                                                <BarChart3 className="w-5 h-5 text-indigo-400" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-white">Conversion & ROI</div>
                                                <div className="text-xs text-gray-400">Intent Captured</div>
                                            </div>
                                        </div>
                                        <div className="text-xs text-indigo-400 font-medium">High Intent</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* e-Detailing & Insights Section */}
            <section className="relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="order-2 lg:order-1 relative"
                        >
                            <div className="aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-gradient-to-br from-teal-900/30 to-gray-900 relative group p-6 flex flex-col">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 to-emerald-500" />
                                
                                <div className="flex justify-between items-center mb-6">
                                    <div className="flex space-x-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                        <div className="w-3 h-3 rounded-full bg-green-500/50" />
                                    </div>
                                    <div className="text-xs text-gray-400 font-medium">Interactive e-Detailing Aid</div>
                                </div>
                                
                                <div className="flex-1 grid grid-cols-3 gap-4">
                                    <div className="col-span-2 bg-white/5 rounded-xl p-4 border border-white/10 flex flex-col justify-between">
                                        <div>
                                            <div className="h-4 w-1/3 bg-white/20 rounded mb-4" />
                                            <div className="space-y-2">
                                                <div className="h-2 w-full bg-white/10 rounded" />
                                                <div className="h-2 w-5/6 bg-white/10 rounded" />
                                                <div className="h-2 w-4/6 bg-white/10 rounded" />
                                            </div>
                                        </div>
                                        <div className="h-32 mt-4 bg-teal-500/10 rounded-lg border border-teal-500/20 flex items-end justify-center gap-2 p-2">
                                            <div className="w-1/5 bg-teal-500/40 h-1/3 rounded-t" />
                                            <div className="w-1/5 bg-teal-500/60 h-2/3 rounded-t" />
                                            <div className="w-1/5 bg-teal-500/80 h-1/2 rounded-t" />
                                            <div className="w-1/5 bg-teal-400 h-full rounded-t" />
                                        </div>
                                    </div>
                                    <div className="col-span-1 space-y-4">
                                        <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/20">
                                            <Lightbulb className="w-5 h-5 text-emerald-400 mb-2" />
                                            <div className="text-xs text-gray-300">Key Message Delivered</div>
                                            <div className="text-sm font-bold text-emerald-400 mt-1">Efficacy &gt; 90%</div>
                                        </div>
                                        <div className="bg-white/5 rounded-xl p-4 border border-white/10 flex-1">
                                            <div className="text-xs text-gray-400 mb-2">HCP Reaction</div>
                                            <div className="flex gap-2">
                                                <div className="flex-1 h-8 bg-green-500/20 rounded cursor-pointer hover:bg-green-500/40 border border-green-500/30 flex items-center justify-center text-xs">👍</div>
                                                <div className="flex-1 h-8 bg-white/5 rounded cursor-pointer hover:bg-white/10 flex items-center justify-center text-xs">🤔</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="order-1 lg:order-2"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/20 rounded-full text-teal-300 text-sm font-medium mb-6 border border-teal-500/30">
                                <Laptop className="w-4 h-4" />
                                <span>e-Detailing & Insights</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                                Interactive <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
                                    Presentations & Feedback
                                </span>
                            </h2>
                            <p className="text-gray-300 text-lg leading-relaxed mb-8">
                                Equip your sales reps with dynamic, compliant presentations. Capture real-time HCP reactions, track slide duration, and gather qualitative insights to refine your messaging.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "Dynamic content adaptation based on HCP profile",
                                    "Automated capture of key message reactions",
                                    "Seamless CRM integration for next-best-action",
                                    "Deep analytics on content performance"
                                ].map((item, index) => (
                                    <li key={index} className="flex items-center gap-3 text-gray-200">
                                        <span className="w-6 h-6 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-400 flex-shrink-0">
                                            <div className="w-2 h-2 bg-teal-400 rounded-full" />
                                        </span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Physician Movement Tracking Section */}
            <section className="relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 rounded-full text-amber-300 text-sm font-medium mb-6 border border-amber-500/30">
                                <TrendingUp className="w-4 h-4" />
                                <span>Absolute Physician Movement</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                                True ROI: <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                                    Classification vs. Sales
                                </span>
                            </h2>
                            <p className="text-gray-300 text-lg leading-relaxed mb-8">
                                Absolute physician movement isn't about geography—it's about <strong className="text-white">Classification vs. Sales</strong>.
                                Salesforce seamlessly captures the true ROI of promotional activities by verifying classification changes against actual sales data.
                            </p>
                            <ul className="space-y-4 mb-8">
                                {[
                                    "Track classification movement (e.g., Class B1 → A2 → A1) after RTDs or CLM e-Detailing.",
                                    "Verify rep honesty by matching classification upgrades with actual distributor sales data.",
                                    "Prove exact ROI on promotional spend (e.g. $200 RTD) by monitoring the resulting prescription uplift."
                                ].map((item, index) => (
                                    <li key={index} className="flex items-center gap-3 text-gray-200">
                                        <span className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
                                            <div className="w-2 h-2 bg-amber-400 rounded-full" />
                                        </span>
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            {/* Distributor Logos */}
                            <div className="pt-6 border-t border-white/10">
                                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Integrated with Top Distributors</p>
                                <div className="flex flex-wrap items-center gap-6 md:gap-8 opacity-90">
                                    <div className="flex flex-col">
                                        <span className="text-2xl font-bold italic tracking-tighter text-blue-500">ibnsina pharma</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xl font-bold text-teal-400 tracking-tight">PharmaOverseas</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-6 h-6 bg-red-600 rounded-sm flex items-center justify-center"><span className="w-3 h-3 bg-white rounded-full"></span></span>
                                        <span className="text-xl font-bold text-red-500">Al Masrya</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative h-full"
                        >
                            <div className="aspect-square sm:aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-gradient-to-br from-amber-900/40 to-gray-900 p-8 flex flex-col relative group">
                                <div className="absolute inset-0 bg-amber-500/10 blur-3xl rounded-full mix-blend-screen" />
                                
                                <div className="w-full relative z-10 flex flex-col h-full">
                                    <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                                        <div>
                                            <h3 className="text-white font-bold text-lg">Dr. Ahmed Hassan</h3>
                                            <p className="text-amber-400 text-sm">Classification vs. Sales ROI</p>
                                        </div>
                                        <div className="bg-emerald-500/20 text-emerald-300 text-xs px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
                                            <TrendingUp className="w-3 h-3" />
                                            Verifiable ROI
                                        </div>
                                    </div>

                                    {/* Graph Area */}
                                    <div className="flex-1 relative mt-4">
                                        {/* Y-axis labels */}
                                        <div className="absolute left-0 bottom-12 text-[10px] text-gray-500 font-bold -rotate-90 origin-bottom-left uppercase tracking-wider">Pharmacy Sales</div>
                                        
                                        {/* The Sales Curve (SVG) */}
                                        <div className="absolute inset-0 pl-8 pb-8 pt-4 pr-4">
                                            <div className="w-full h-full border-l-2 border-b-2 border-white/10 relative">
                                                <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                                                    <path d="M 0,90 Q 25,85 40,60 T 70,30 T 100,10" fill="none" stroke="rgba(251, 191, 36, 0.8)" strokeWidth="4" />
                                                    <path d="M 0,90 Q 25,85 40,60 T 70,30 T 100,10 L 100,100 L 0,100 Z" fill="url(#salesGradient)" opacity="0.3" />
                                                    <defs>
                                                        <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="0%" stopColor="rgba(251, 191, 36, 0.5)" />
                                                            <stop offset="100%" stopColor="rgba(251, 191, 36, 0)" />
                                                        </linearGradient>
                                                    </defs>
                                                </svg>

                                                {/* Timeline Milestones */}
                                                
                                                {/* Point 1 */}
                                                <div className="absolute flex flex-col items-center -translate-x-1/2 translate-y-1/2" style={{ left: '5%', bottom: '88%' }}>
                                                    <div className="mb-2 bg-gray-900/80 backdrop-blur-sm text-xs p-2 rounded border border-white/10 whitespace-nowrap z-20 shadow-lg text-center">
                                                        <div className="text-gray-400 mb-1">Baseline</div>
                                                        <div className="text-white font-bold">Class B1</div>
                                                    </div>
                                                    <div className="w-3 h-3 rounded-full bg-gray-500 border-2 border-gray-900 z-10" />
                                                </div>

                                                {/* Point 2 */}
                                                <div className="absolute flex flex-col items-center -translate-x-1/2 translate-y-1/2" style={{ left: '40%', bottom: '60%' }}>
                                                    <div className="mb-2 bg-gray-900/80 backdrop-blur-sm text-xs p-2 rounded border border-blue-500/30 whitespace-nowrap z-20 shadow-lg text-center">
                                                        <div className="text-blue-400 font-bold mb-1">RTD ($200)</div>
                                                        <div className="text-white font-bold">Class A2</div>
                                                    </div>
                                                    <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-gray-900 z-10" />
                                                </div>

                                                {/* Point 3 */}
                                                <div className="absolute flex flex-col items-center -translate-x-1/2 translate-y-1/2" style={{ left: '85%', bottom: '15%' }}>
                                                    <div className="mb-2 bg-gray-900/80 backdrop-blur-sm text-xs p-2 rounded border border-amber-500/30 whitespace-nowrap z-20 shadow-lg text-center">
                                                        <div className="text-emerald-400 font-bold mb-1">CLM + Samples</div>
                                                        <div className="text-white font-bold">Class A1</div>
                                                    </div>
                                                    <div className="w-5 h-5 rounded-full bg-amber-500 border-2 border-gray-900 z-10 shadow-[0_0_15px_rgba(251,191,36,0.5)]" />
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Agentforce ROI & Gap Analysis Section */}
            <section className="relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="order-2 lg:order-1 relative"
                        >
                            <div className="aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-gradient-to-br from-fuchsia-900/30 to-gray-900 relative group p-6">
                                <div className="absolute inset-0 bg-fuchsia-500/10 blur-3xl rounded-full mix-blend-screen" />
                                
                                <div className="relative z-10 h-full flex flex-col">
                                    <div className="flex justify-between items-center mb-6">
                                        <div className="flex items-center gap-2">
                                            <BrainCircuit className="w-5 h-5 text-fuchsia-400" />
                                            <span className="text-sm font-bold text-white">Agentforce Analysis</span>
                                        </div>
                                        <span className="text-xs bg-fuchsia-500/20 text-fuchsia-300 px-2 py-1 rounded border border-fuchsia-500/30">ROI Generated</span>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4 flex-1">
                                        <div className="bg-white/5 rounded-xl border border-white/10 p-4 flex flex-col justify-between">
                                            <div className="text-xs text-gray-400">Distributors Sales vs. Penetration</div>
                                            <div className="space-y-3 mt-4">
                                                <div>
                                                    <div className="flex justify-between text-xs mb-1">
                                                        <span className="text-white">Sales Data</span>
                                                        <span className="text-fuchsia-400">85%</span>
                                                    </div>
                                                    <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                                        <div className="h-full w-[85%] bg-fuchsia-500 rounded-full" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="flex justify-between text-xs mb-1">
                                                        <span className="text-white">Rep Penetration</span>
                                                        <span className="text-blue-400">62%</span>
                                                    </div>
                                                    <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                                        <div className="h-full w-[62%] bg-blue-500 rounded-full" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-fuchsia-500/10 rounded-xl border border-fuchsia-500/20 p-4 flex flex-col justify-between">
                                            <div className="text-xs text-fuchsia-300 mb-2">Causality & Gap Identified</div>
                                            <div className="text-sm text-white font-medium">Growth limited by sample allocation in Region North.</div>
                                            <div className="mt-4 bg-fuchsia-500/20 rounded-lg p-2 flex items-center justify-between border border-fuchsia-500/30">
                                                <span className="text-xs text-white">Suggested Action</span>
                                                <span className="text-xs font-bold text-fuchsia-300">Increase RTDs</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 bg-white/5 rounded-xl border border-white/10 p-3 flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <Layers className="w-4 h-4 text-gray-400" />
                                            <span className="text-xs text-gray-300">Cardio Line ROI</span>
                                        </div>
                                        <span className="text-sm font-bold text-green-400">+312%</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="order-1 lg:order-2"
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-fuchsia-500/20 rounded-full text-fuchsia-300 text-sm font-medium mb-6 border border-fuchsia-500/30">
                                <TrendingUp className="w-4 h-4" />
                                <span>Agentforce Analytics</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                                AI-Powered ROI & <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-pink-400">
                                    Causality of Growth
                                </span>
                            </h2>
                            <p className="text-gray-300 text-lg leading-relaxed mb-8">
                                Salesforce Agentforce analyzes distributors' sales data against rep-captured potential and penetration. It correlates these metrics with investments in RTDs, samples, and more to reveal precise ROI per product line, highlight market gaps, and identify the exact causality of your growth.
                            </p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    { title: "Investment vs ROI", desc: "Correlate RTDs and samples to sales uplift." },
                                    { title: "Gap Highlighting", desc: "Identify territories underperforming their potential." },
                                    { title: "Growth Causality", desc: "Understand exactly what drives your prescriptions." },
                                    { title: "Distributors Sync", desc: "Cross-reference actual sales with rep field data." }
                                ].map((item, index) => (
                                    <div key={index} className="flex flex-col gap-1 p-3 rounded-xl bg-white/5 border border-white/10">
                                        <span className="text-fuchsia-300 text-sm font-bold">{item.title}</span>
                                        <span className="text-gray-400 text-xs">{item.desc}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Reports and Dashboards Section */}
            <section className="relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <AnimatedSection className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-full text-purple-300 text-sm font-medium mb-6 border border-purple-500/30">
                            <BarChart3 className="w-4 h-4" />
                            <span>Analytics & Insights</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                            Actionable <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-violet-400">Reports & Dashboards</span>
                        </h2>
                        <p className="text-gray-300 text-lg max-w-3xl mx-auto">
                            Transform raw data into strategic advantage. Gain real-time visibility into sales performance, compliance metrics, and market trends with industry-tailored analytics.
                        </p>
                    </AnimatedSection>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Sales Performance",
                                metric: "+24%",
                                label: "Prescription Uplift",
                                desc: "Track territory performance, call activity, and prescription trends against targets in real-time.",
                                color: "from-purple-500 to-indigo-600"
                            },
                            {
                                title: "Compliance Monitoring",
                                metric: "100%",
                                label: "Audit Readiness",
                                desc: "Automated tracking of expense limits, signature capture, and interaction compliance.",
                                color: "from-emerald-500 to-teal-600"
                            },
                            {
                                title: "Market Intelligence",
                                metric: "AI",
                                label: "Powered Insights",
                                desc: "Predictive analytics to identify market shifts and competitive threats before they impact share.",
                                color: "from-orange-500 to-red-600"
                            }
                        ].map((card, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-gray-800/40 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:bg-gray-800/60 transition-colors group"
                            >
                                <div className={`h-2 w-12 rounded-full bg-gradient-to-r ${card.color} mb-6`} />
                                <h3 className="text-xl font-bold text-white mb-2">{card.title}</h3>
                                <div className="flex items-baseline gap-2 mb-4">
                                    <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">{card.metric}</span>
                                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{card.label}</span>
                                </div>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    {card.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════════ */}

            {/* PSP – PATIENT SUPPORT PROGRAM  (MEGA SECTION)                  */}
            {/* ═══════════════════════════════════════════════════════════════ */}

            {/* ── Hero Banner ── */}
            <section className="relative overflow-hidden py-28">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-950 via-gray-950 to-emerald-950" />
                {/* animated orbs */}
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] animate-pulse [animation-delay:1.5s]" />
                <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[80px] animate-pulse [animation-delay:0.8s]" />

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9 }}
                    >
                        {/* pill badge */}
                        <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-teal-500/20 to-emerald-500/20 border border-teal-400/30 mb-8 shadow-[0_0_30px_rgba(20,184,166,0.2)]">
                            <HeartPulse className="w-5 h-5 text-teal-400 animate-pulse" />
                            <span className="text-teal-300 font-semibold tracking-wide text-sm uppercase">Patient Support Program</span>
                            <Sparkles className="w-4 h-4 text-emerald-400" />
                        </div>

                        <h2 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
                            AI-Powered{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400">
                                PSP Platform
                            </span>
                        </h2>
                        <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-12">
                            Transform your Patient Support Program with cutting-edge AI. From onboarding to ongoing care, every touchpoint is intelligent, automated, and deeply personal.
                        </p>

                        {/* stats row */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                            {[
                                { value: "3×", label: "Faster Onboarding", color: "from-teal-400 to-cyan-400" },
                                { value: "94%", label: "Patient Adherence", color: "from-emerald-400 to-teal-400" },
                                { value: "100%", label: "Compliant Calls", color: "from-cyan-400 to-blue-400" },
                                { value: "2×", label: "HCP Satisfaction", color: "from-blue-400 to-indigo-400" },
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                                    className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors"
                                >
                                    <div className={`text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r ${stat.color} mb-1`}>{stat.value}</div>
                                    <div className="text-sm text-gray-400 font-medium">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── 1. AI Onboarding ── */}
            <section className="relative overflow-hidden py-24">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-violet-950/30 to-gray-950" />
                <div className="absolute top-20 right-0 w-[450px] h-[450px] bg-violet-500/10 rounded-full blur-[100px]" />

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Text side */}
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/20 rounded-full text-violet-300 text-sm font-semibold mb-6 border border-violet-500/30">
                                <Brain className="w-4 h-4" />
                                <span>AI-Powered Onboarding</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                                Enroll Patients in{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-400">
                                    Minutes, Not Days
                                </span>
                            </h2>
                            <p className="text-gray-300 text-lg leading-relaxed mb-10">
                                Our AI agent guides patients through eligibility checks, consent forms, and therapy initiation automatically — reducing coordinator workload by 70% and ensuring zero data entry errors.
                            </p>

                            <div className="space-y-4">
                                {[
                                    { icon: Bot, title: "AI Eligibility Check", desc: "Real-time verification against insurance, diagnosis codes, and program criteria" },
                                    { icon: ClipboardList, title: "Smart Consent Management", desc: "Digital e-consents with e-signature, auto-filed to Salesforce Health Cloud" },
                                    { icon: Sparkles, title: "Personalized Welcome Flow", desc: "AI tailors the onboarding journey based on patient profile, therapy, and language" },
                                    { icon: CheckCircle2, title: "Instant Nurse Assignment", desc: "Auto-match patients to the best available case manager using AI scoring" },
                                ].map((item, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: 0.1 * i }}
                                        className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-violet-500/40 hover:bg-violet-500/5 transition-all group"
                                    >
                                        <div className="p-2.5 bg-violet-500/20 rounded-lg flex-shrink-0 group-hover:bg-violet-500/30 transition-colors">
                                            <item.icon className="w-5 h-5 text-violet-400" />
                                        </div>
                                        <div>
                                            <div className="text-white font-semibold mb-1">{item.title}</div>
                                            <div className="text-gray-400 text-sm">{item.desc}</div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Visual side — animated onboarding flow */}
                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >
                            <div className="relative bg-gray-900/60 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent" />
                                {/* AI Chat simulation */}
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
                                        <Bot className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-white font-bold text-sm">MedAssist AI</div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                            <span className="text-xs text-green-400">Active · Patient Onboarding</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-6">
                                    {[
                                        { from: "ai", text: "Welcome! I'm here to enroll you in the support program. May I verify your insurance details?" },
                                        { from: "patient", text: "Yes, my insurance is AXA Corporate, ID: 4829101" },
                                        { from: "ai", text: "✅ Verified! You're fully eligible. I've auto-filled your profile. Sending consent form now…" },
                                        { from: "ai", text: "🎉 Enrollment complete! Your case manager Sarah will call you within 2 hours." },
                                    ].map((msg, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, y: 10 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.4, delay: 0.3 + i * 0.2 }}
                                            className={`flex ${msg.from === "patient" ? "justify-end" : "justify-start"}`}
                                        >
                                            <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm ${msg.from === "ai" ? "bg-violet-500/20 border border-violet-500/30 text-gray-200 rounded-tl-sm" : "bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-tr-sm"}`}>
                                                {msg.text}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Progress bar */}
                                <div className="bg-gray-800/60 rounded-xl p-4 border border-white/5">
                                    <div className="flex justify-between text-xs text-gray-400 mb-2">
                                        <span>Onboarding Progress</span>
                                        <span className="text-violet-400 font-bold">100%</span>
                                    </div>
                                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: "100%" }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 1.5, delay: 0.5 }}
                                            className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"
                                        />
                                    </div>
                                    <div className="flex justify-between mt-3">
                                        {["Eligibility", "Consent", "Profile", "Assigned"].map((step, i) => (
                                            <div key={i} className="flex flex-col items-center gap-1">
                                                <div className="w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center">
                                                    <CheckCircle2 className="w-3 h-3 text-white" />
                                                </div>
                                                <span className="text-[10px] text-gray-400">{step}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── 2. AI Call Recording & Coaching ── */}
            <section className="relative overflow-hidden py-24">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-950/40 via-gray-950 to-orange-950/20" />
                <div className="absolute left-0 top-1/3 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[100px]" />

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <AnimatedSection className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500/20 rounded-full text-rose-300 text-sm font-semibold mb-6 border border-rose-500/30">
                            <Mic className="w-4 h-4 animate-pulse" />
                            <span>Intelligent Call Recording</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                            Every Call, Captured &{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400">
                                Analyzed by AI
                            </span>
                        </h2>
                        <p className="text-gray-300 text-xl max-w-3xl mx-auto leading-relaxed">
                            All coordinator and patient calls are automatically recorded, transcribed, and analyzed. Compliance gaps, sentiment shifts, and missed action items are flagged in real-time.
                        </p>
                    </AnimatedSection>

                    {/* Feature grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                        {[
                            {
                                icon: Mic,
                                title: "Auto Recording & Transcription",
                                desc: "Every support call is recorded in HD, transcribed with 99%+ accuracy using medical-grade ASR, and stored securely within Salesforce.",
                                gradient: "from-rose-500/20 to-pink-500/20",
                                border: "hover:border-rose-500/40",
                                accent: "text-rose-400",
                                bg: "bg-rose-500/20"
                            },
                            {
                                icon: Brain,
                                title: "Sentiment & Adherence Analysis",
                                desc: "AI monitors patient sentiment, detects frustration, fear, or confusion, and alerts coordinators when intervention is needed.",
                                gradient: "from-orange-500/20 to-amber-500/20",
                                border: "hover:border-orange-500/40",
                                accent: "text-orange-400",
                                bg: "bg-orange-500/20"
                            },
                            {
                                icon: ShieldCheck,
                                title: "Compliance Guardrails",
                                desc: "Auto-flag calls that miss required disclosures, off-label discussions, or regulatory protocols — with timestamped evidence.",
                                gradient: "from-red-500/20 to-rose-500/20",
                                border: "hover:border-red-500/40",
                                accent: "text-red-400",
                                bg: "bg-red-500/20"
                            },
                            {
                                icon: ClipboardList,
                                title: "AI-Generated Call Summary",
                                desc: "After every call, AI creates a structured summary with outcomes, patient concerns, follow-up tasks, and next-call agenda — saved to patient record.",
                                gradient: "from-amber-500/20 to-yellow-500/20",
                                border: "hover:border-amber-500/40",
                                accent: "text-amber-400",
                                bg: "bg-amber-500/20"
                            },
                            {
                                icon: Activity,
                                title: "Real-Time Coaching",
                                desc: "Live AI prompts coach coordinators during calls with medication reminders, empathy cues, and therapy adherence tips.",
                                gradient: "from-pink-500/20 to-fuchsia-500/20",
                                border: "hover:border-pink-500/40",
                                accent: "text-pink-400",
                                bg: "bg-pink-500/20"
                            },
                            {
                                icon: BarChart3,
                                title: "Quality Scoring Dashboard",
                                desc: "Every call receives an automated quality score across 20+ dimensions — driving continuous improvement and highlighting top performers.",
                                gradient: "from-fuchsia-500/20 to-purple-500/20",
                                border: "hover:border-fuchsia-500/40",
                                accent: "text-fuchsia-400",
                                bg: "bg-fuchsia-500/20"
                            },
                        ].map((card, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                whileHover={{ y: -6, scale: 1.02 }}
                                className={`bg-gradient-to-br ${card.gradient} backdrop-blur-sm rounded-2xl p-7 border border-white/10 ${card.border} transition-all duration-300 group`}
                            >
                                <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                                    <card.icon className={`w-6 h-6 ${card.accent}`} />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-3">{card.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{card.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Call analysis mock */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="bg-gray-900/70 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center">
                                    <Phone className="w-5 h-5 text-rose-400" />
                                </div>
                                <div>
                                    <div className="text-white font-bold">Patient Call · Ahmed Al-Rashidi</div>
                                    <div className="text-xs text-gray-500">Sep 28, 2026 · 14:32 · 18 min 24 sec</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-full">
                                <CheckCircle2 className="w-4 h-4 text-green-400" />
                                <span className="text-green-400 text-xs font-semibold">Quality Score: 94/100</span>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="md:col-span-2">
                                {/* Waveform visualization */}
                                <div className="bg-gray-800/60 rounded-xl p-4 mb-4">
                                    <div className="flex items-center gap-1 h-12 overflow-hidden">
                                        {Array.from({ length: 80 }).map((_, i) => (
                                            <div
                                                key={i}
                                                className="w-1 bg-gradient-to-t from-rose-500 to-orange-400 rounded-full opacity-70 flex-shrink-0"
                                                style={{ height: `${Math.random() * 80 + 20}%` }}
                                            />
                                        ))}
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                                        <span>00:00</span>
                                        <span className="text-rose-400">▶ 08:12</span>
                                        <span>18:24</span>
                                    </div>
                                </div>
                                {/* AI highlights */}
                                <div className="space-y-2">
                                    {[
                                        { time: "02:14", tag: "Adherence", text: "Patient reports skipping 3 doses this week", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
                                        { time: "07:45", tag: "Action Item", text: "Nurse to send medication reminder setup guide", color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
                                        { time: "15:03", tag: "Sentiment 😟", text: "Patient expressed concern about side effects", color: "text-rose-400 bg-rose-500/10 border-rose-500/20" },
                                    ].map((hl, i) => (
                                        <div key={i} className={`flex items-start gap-3 px-4 py-2.5 rounded-lg border text-sm ${hl.color}`}>
                                            <span className="font-mono flex-shrink-0 opacity-60">{hl.time}</span>
                                            <span className="font-semibold flex-shrink-0">[{hl.tag}]</span>
                                            <span className="text-gray-300">{hl.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-gray-800/60 rounded-xl p-4 border border-white/5">
                                    <div className="text-xs text-gray-500 font-semibold uppercase mb-3">Sentiment Timeline</div>
                                    {[
                                        { label: "Positive", pct: 62, color: "bg-green-500" },
                                        { label: "Neutral", pct: 23, color: "bg-gray-500" },
                                        { label: "Concerned", pct: 15, color: "bg-rose-500" },
                                    ].map((s, i) => (
                                        <div key={i} className="mb-2">
                                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                                                <span>{s.label}</span>
                                                <span>{s.pct}%</span>
                                            </div>
                                            <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                                <div className={`h-full ${s.color} rounded-full`} style={{ width: `${s.pct}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="bg-gray-800/60 rounded-xl p-4 border border-white/5">
                                    <div className="text-xs text-gray-500 font-semibold uppercase mb-3">AI Next Actions</div>
                                    {["Send reminder schedule", "Book HCP callback", "Share side effect FAQ"].map((a, i) => (
                                        <div key={i} className="flex items-center gap-2 text-sm text-gray-300 py-1.5">
                                            <ArrowRight className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
                                            {a}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── 3. Automated Steps & Workflows ── */}
            <section className="relative overflow-hidden py-24">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-950/40 via-gray-950 to-indigo-950/30" />
                <div className="absolute right-0 bottom-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Visual: Step flow */}
                        <motion.div
                            initial={{ opacity: 0, x: -40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >
                            <div className="bg-gray-900/60 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                        <SendHorizonal className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <div className="text-white font-bold">Patient Journey: Therapy Start</div>
                                        <div className="text-xs text-gray-500">Automated · 12-week program</div>
                                    </div>
                                </div>

                                <div className="relative">
                                    {/* vertical line */}
                                    <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500 via-indigo-500 to-transparent" />

                                    {[
                                        { day: "Day 0", title: "Welcome Package Sent", icon: Bell, color: "text-blue-400 bg-blue-500/20", done: true },
                                        { day: "Day 1", title: "First Injection Guide via WhatsApp", icon: SendHorizonal, color: "text-teal-400 bg-teal-500/20", done: true },
                                        { day: "Day 3", title: "Side Effect Check-in Call (AI)", icon: Phone, color: "text-violet-400 bg-violet-500/20", done: true },
                                        { day: "Day 7", title: "Progress Survey Dispatched", icon: ClipboardList, color: "text-indigo-400 bg-indigo-500/20", done: false },
                                        { day: "Day 14", title: "Adherence Score Report to HCP", icon: Activity, color: "text-emerald-400 bg-emerald-500/20", done: false },
                                        { day: "Day 30", title: "30-Day Review with Case Manager", icon: Users, color: "text-rose-400 bg-rose-500/20", done: false },
                                    ].map((step, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.4, delay: 0.1 * i }}
                                            className="flex items-start gap-4 mb-6 last:mb-0 relative"
                                        >
                                            <div className={`w-10 h-10 rounded-full ${step.color} flex items-center justify-center flex-shrink-0 relative z-10 border-2 ${step.done ? "border-blue-500" : "border-gray-700"}`}>
                                                <step.icon className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1 pt-1">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xs font-mono text-blue-400 font-semibold">{step.day}</span>
                                                    {step.done && <span className="text-[10px] px-2 py-0.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full">Sent ✓</span>}
                                                    {!step.done && <span className="text-[10px] px-2 py-0.5 bg-gray-500/10 text-gray-500 border border-gray-500/20 rounded-full">Scheduled</span>}
                                                </div>
                                                <div className={`text-sm font-semibold mt-0.5 ${step.done ? "text-white" : "text-gray-400"}`}>{step.title}</div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Text side */}
                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-full text-blue-300 text-sm font-semibold mb-6 border border-blue-500/30">
                                <SendHorizonal className="w-4 h-4" />
                                <span>Automated Step Dispatch</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                                The Right Message,{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                                    At Exactly the Right Time
                                </span>
                            </h2>
                            <p className="text-gray-300 text-lg leading-relaxed mb-10">
                                Salesforce Flows automatically dispatch personalized communications, educational content, and care steps based on where each patient is in their therapy journey — across SMS, WhatsApp, Email, and voice.
                            </p>

                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { icon: Bell, label: "Smart Reminders", desc: "Medication & appointment nudges via preferred channel" },
                                    { icon: FileText, label: "Educational Content", desc: "Condition-specific guides auto-sent at key milestones" },
                                    { icon: Activity, label: "Adherence Nudges", desc: "AI detects drop-off risk & triggers re-engagement" },
                                    { icon: Users, label: "Caregiver Loop", desc: "Family caregivers kept informed with consent-based updates" },
                                ].map((f, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5, delay: 0.1 * i }}
                                        className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all group"
                                    >
                                        <div className="w-9 h-9 rounded-lg bg-blue-500/20 flex items-center justify-center mb-3 group-hover:bg-blue-500/30 transition-colors">
                                            <f.icon className="w-4.5 h-4.5 text-blue-400" />
                                        </div>
                                        <div className="text-white font-semibold text-sm mb-1">{f.label}</div>
                                        <div className="text-gray-400 text-xs leading-relaxed">{f.desc}</div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── 4 & 5. HCP Portal + Patient Portal ── */}
            <section className="relative overflow-hidden py-24">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-teal-950/20 to-emerald-950/20" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal-500/5 rounded-full blur-[150px]" />

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <AnimatedSection className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500/20 rounded-full text-teal-300 text-sm font-semibold mb-6 border border-teal-500/30">
                            <Globe className="w-4 h-4" />
                            <span>Digital Portals</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                            Dedicated Portals for{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
                                HCPs & Patients
                            </span>
                        </h2>
                        <p className="text-gray-300 text-xl max-w-3xl mx-auto">
                            Two powerful self-service portals built on Salesforce Experience Cloud — giving healthcare professionals and patients full transparency, access, and control.
                        </p>
                    </AnimatedSection>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* HCP Portal */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7 }}
                            className="relative group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-blue-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <div className="relative bg-gray-900/70 backdrop-blur-xl rounded-3xl border border-indigo-500/20 p-8 shadow-2xl overflow-hidden h-full">
                                {/* decorative top bar */}
                                <div className="h-1 w-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full mb-8 -mx-8 px-8" style={{ width: 'calc(100% + 64px)', marginLeft: '-32px' }} />

                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                                        <Stethoscope className="w-7 h-7 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-white">HCP Portal</h3>
                                        <p className="text-indigo-400 text-sm font-medium">Healthcare Professional Dashboard</p>
                                    </div>
                                </div>

                                <p className="text-gray-300 text-base leading-relaxed mb-8">
                                    Give prescribers a dedicated window into their patients' support program journey. Real-time adherence data, call summaries, and escalation alerts — all without requiring a Salesforce license.
                                </p>

                                <div className="space-y-4 mb-8">
                                    {[
                                        { icon: Activity, label: "Live Patient Adherence Dashboard", desc: "Dose tracking, missed injections, and trend alerts" },
                                        { icon: FileText, label: "Full Call & Interaction History", desc: "PSP coordinator notes auto-shared with prescriber" },
                                        { icon: Bell, label: "Escalation Alerts", desc: "Instant push/email alert for high-risk patient events" },
                                        { icon: Users, label: "Patient Enrollment Requests", desc: "HCP submits referrals directly into Salesforce workflow" },
                                        { icon: ClipboardList, label: "Prescription Analytics", desc: "View prescribing trends & program ROI per product" },
                                        { icon: Lock, label: "HIPAA-Grade Security", desc: "Role-based access with full audit trail" },
                                    ].map((f, i) => (
                                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-indigo-500/5 transition-colors border border-transparent hover:border-indigo-500/20">
                                            <div className="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center flex-shrink-0">
                                                <f.icon className="w-4 h-4 text-indigo-400" />
                                            </div>
                                            <div>
                                                <div className="text-white font-semibold text-sm">{f.label}</div>
                                                <div className="text-gray-500 text-xs">{f.desc}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Mini portal mockup */}
                                <div className="bg-gray-800/50 rounded-2xl p-5 border border-white/5">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">My Enrolled Patients</span>
                                        <span className="text-xs text-indigo-400 font-semibold">12 Active</span>
                                    </div>
                                    {[
                                        { name: "Sarah M.", status: "On Track", adherence: 95, color: "text-green-400" },
                                        { name: "Karim A.", status: "At Risk", adherence: 61, color: "text-amber-400" },
                                        { name: "Lina T.", status: "On Track", adherence: 88, color: "text-green-400" },
                                    ].map((p, i) => (
                                        <div key={i} className="flex items-center gap-3 py-2.5 border-b border-white/5 last:border-0">
                                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white">
                                                {p.name[0]}
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-sm text-white font-medium">{p.name}</div>
                                                <div className={`text-xs ${p.color}`}>{p.status}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-bold text-white">{p.adherence}%</div>
                                                <div className="text-[10px] text-gray-500">Adherence</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Patient Portal */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: 0.15 }}
                            className="relative group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-emerald-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <div className="relative bg-gray-900/70 backdrop-blur-xl rounded-3xl border border-teal-500/20 p-8 shadow-2xl overflow-hidden h-full">
                                {/* decorative top bar */}
                                <div className="h-1 w-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full mb-8 -mx-8 px-8" style={{ width: 'calc(100% + 64px)', marginLeft: '-32px' }} />

                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-teal-500/30">
                                        <HeartPulse className="w-7 h-7 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-white">Patient Portal</h3>
                                        <p className="text-teal-400 text-sm font-medium">Your Personal Health Companion</p>
                                    </div>
                                </div>

                                <p className="text-gray-300 text-base leading-relaxed mb-8">
                                    Empower patients with a beautifully simple mobile-first portal. Log doses, access educational resources, message their support nurse, and track their therapy progress — all in one place.
                                </p>

                                <div className="space-y-4 mb-8">
                                    {[
                                        { icon: CheckCircle2, label: "Dose Logging & Reminders", desc: "One-tap dose confirmation with smart reminder push notifications" },
                                        { icon: MessageSquare, label: "Direct Nurse Messaging", desc: "Secure in-portal chat with the assigned case coordinator" },
                                        { icon: FileText, label: "My Resources Library", desc: "Therapy guides, injection tutorials, FAQs — always accessible" },
                                        { icon: Activity, label: "My Progress Tracker", desc: "Visual journey map showing milestones and next steps" },
                                        { icon: Bell, label: "Appointment Scheduler", desc: "Book nurse calls and HCP visits directly from the portal" },
                                        { icon: ShieldCheck, label: "Privacy & Consent Center", desc: "Full control over data sharing preferences at any time" },
                                    ].map((f, i) => (
                                        <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-teal-500/5 transition-colors border border-transparent hover:border-teal-500/20">
                                            <div className="w-8 h-8 rounded-lg bg-teal-500/15 flex items-center justify-center flex-shrink-0">
                                                <f.icon className="w-4 h-4 text-teal-400" />
                                            </div>
                                            <div>
                                                <div className="text-white font-semibold text-sm">{f.label}</div>
                                                <div className="text-gray-500 text-xs">{f.desc}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Mini patient app mockup */}
                                <div className="bg-gray-800/50 rounded-2xl p-5 border border-white/5">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm font-bold text-white">My Week</span>
                                        <span className="text-xs text-teal-400 font-semibold">Week 6 of 12</span>
                                    </div>
                                    <div className="flex gap-2 mb-4">
                                        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                                            <div key={i} className={`flex-1 aspect-square rounded-lg flex flex-col items-center justify-center text-[10px] font-bold transition-all ${i < 5 ? "bg-teal-500 text-white shadow-[0_0_10px_rgba(20,184,166,0.3)]" : i === 5 ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : "bg-gray-700/40 text-gray-500"}`}>
                                                <span>{d}</span>
                                                {i < 5 && <CheckCircle2 className="w-3 h-3 mt-0.5" />}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-teal-500/10 rounded-xl border border-teal-500/20">
                                        <Bell className="w-4 h-4 text-teal-400 flex-shrink-0" />
                                        <div className="text-xs text-gray-300">
                                            <span className="text-white font-semibold">Next dose: Today 8:00 PM</span><br />
                                            Your nurse Sarah is available for questions
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* CTA Banner */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="mt-16 relative overflow-hidden rounded-3xl"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-teal-600/30 via-emerald-600/20 to-cyan-600/30" />
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(20,184,166,0.15),transparent_70%)]" />
                        <div className="relative border border-teal-500/20 rounded-3xl p-10 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(20,184,166,0.4)]">
                                <HeartPulse className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-3xl md:text-4xl font-black text-white mb-4">
                                Ready to Transform Your PSP?
                            </h3>
                            <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
                                Cloudastick has implemented Salesforce Health Cloud PSP solutions for leading pharmaceutical companies across the region. Let's build yours.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button className="px-8 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full text-white font-bold text-lg hover:shadow-[0_0_30px_rgba(20,184,166,0.5)] transition-all duration-300 hover:scale-105 flex items-center gap-2 justify-center">
                                    <Sparkles className="w-5 h-5" />
                                    Book a PSP Demo
                                </button>
                                <button className="px-8 py-4 bg-white/5 border border-white/20 rounded-full text-white font-semibold text-lg hover:bg-white/10 transition-all duration-300 flex items-center gap-2 justify-center">
                                    <FileText className="w-5 h-5 text-teal-400" />
                                    Download PSP Brochure
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

        </div>
    );
};

export default PharmaSections;
