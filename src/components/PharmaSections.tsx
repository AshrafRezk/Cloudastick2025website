import React from 'react';
import { motion } from 'framer-motion';
import { Target, MessageSquare, BarChart3, Users, Zap, PieChart, Mail, MessageCircle, Smartphone, BrainCircuit, Laptop, Lightbulb, Activity, MapPin, TrendingUp, Layers } from 'lucide-react';
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
                                <MapPin className="w-4 h-4" />
                                <span>Absolute Physician Movement</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                                Track HCP Mobility & <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                                    Affiliation Changes
                                </span>
                            </h2>
                            <p className="text-gray-300 text-lg leading-relaxed mb-8">
                                Salesforce seamlessly captures absolute physician movement across hospitals, clinics, and new affiliations in real-time. Ensure your reps always know exactly where to engage and never lose track of key stakeholders.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "Real-time location and affiliation updates",
                                    "Multi-facility schedule mapping for precise engagement",
                                    "Automated territory realignment alerts",
                                    "Historical movement tracking and relationship graphing"
                                ].map((item, index) => (
                                    <li key={index} className="flex items-center gap-3 text-gray-200">
                                        <span className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
                                            <div className="w-2 h-2 bg-amber-400 rounded-full" />
                                        </span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative"
                        >
                            <div className="aspect-square sm:aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-gradient-to-br from-amber-900/40 to-gray-900 p-8 flex items-center justify-center relative group">
                                <div className="absolute inset-0 bg-amber-500/10 blur-3xl rounded-full mix-blend-screen" />
                                
                                <div className="w-full relative z-10 p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                                    <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                                        <div>
                                            <h3 className="text-white font-bold text-lg">Dr. Sarah Jenkins</h3>
                                            <p className="text-amber-400 text-sm">Cardiologist</p>
                                        </div>
                                        <div className="bg-amber-500/20 text-amber-300 text-xs px-3 py-1 rounded-full border border-amber-500/30">
                                            Moved Today
                                        </div>
                                    </div>
                                    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/20 before:to-transparent">
                                        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/50 bg-gray-900 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                                <MapPin className="w-4 h-4 text-gray-400" />
                                            </div>
                                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl bg-white/5 border border-white/10 opacity-50">
                                                <div className="text-xs text-gray-400">Previous (2022 - 2026)</div>
                                                <div className="text-sm font-bold text-white">City General Hospital</div>
                                            </div>
                                        </div>
                                        
                                        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-amber-500/50 bg-amber-900/50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                                <MapPin className="w-4 h-4 text-amber-400" />
                                            </div>
                                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
                                                <div className="text-xs text-amber-300 font-bold mb-1">New Primary Location</div>
                                                <div className="text-sm font-bold text-white">Mercy Medical Center</div>
                                                <div className="text-xs text-gray-300 mt-1">Schedule: Mon, Wed, Fri</div>
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
        </div>
    );
};

export default PharmaSections;
