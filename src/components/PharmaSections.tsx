import React from 'react';
import { motion } from 'framer-motion';
import { Target, MessageSquare, BarChart3, Users, Zap, PieChart } from 'lucide-react';
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
