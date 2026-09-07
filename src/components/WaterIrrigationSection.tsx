import React from 'react';
import { motion } from 'framer-motion';
import { Target, Zap, LayoutTemplate, Smartphone, Droplet, Box, PenTool, CheckCircle, Search, Wrench, Sprout, Wind, ArrowRight, Sun, Settings } from 'lucide-react';
import AnimatedSection from './AnimatedSection';

const WaterIrrigationSection = () => {
    return (
        <div className="space-y-24 py-12">
            {/* Project Pipeline Section */}
            <section className="relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <AnimatedSection className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-full text-blue-300 text-sm font-medium mb-6 border border-blue-500/30">
                            <Droplet className="w-4 h-4" />
                            <span>End-to-End Project Execution</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                            Water Supply & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Irrigation Systems</span>
                        </h2>
                        <p className="text-gray-300 text-lg max-w-4xl mx-auto leading-relaxed">
                            A complete solution tailored for compounds and large real estate projects (like Sodic, Mountain View, Taj Sultan). Manage complex tenders, intricate quoting processes, and end-to-end material supply using Salesforce.
                        </p>
                    </AnimatedSection>

                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <Box className="w-8 h-8 text-blue-400" />
                                The Material Pipeline
                            </h3>
                            <p className="text-gray-300 leading-relaxed mb-6">
                                Streamline your catalogs and BOMs across the entire project lifecycle, from initial water sourcing to landscape maintenance.
                            </p>

                            <div className="space-y-4">
                                {[
                                    { icon: Zap, title: "1. Get the Water There", text: "DAB (Pumps) → DVD (Valves) → Viking Johnson (Couplings)" },
                                    { icon: Droplet, title: "2. Distribute the Water", text: "Elysee (Pipes/fittings) → Rivulis (Drip irrigation)" },
                                    { icon: Sprout, title: "3. Irrigate Landscape", text: "Hunter (Sprinklers, controllers, valves)" },
                                    { icon: LayoutTemplate, title: "4. Landscape Extras", text: "FX Luminaire (Lighting) → ZinCo (Green roofs) → Aquatronic" },
                                    { icon: Wind, title: "5. Outdoor Environment", text: "Metalco (Urban furniture) → MyEquilibria (Outdoor fitness)" },
                                    { icon: Wrench, title: "6. Maintenance", text: "STIGA (Mowers & landscaping machinery)" }
                                ].map((item, index) => (
                                    <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-colors">
                                        <div className="p-2 bg-blue-500/20 rounded-lg shrink-0">
                                            <item.icon className="w-5 h-5 text-blue-400" />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-semibold text-sm">{item.title}</h4>
                                            <span className="text-gray-400 text-sm">{item.text}</span>
                                        </div>
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
                                <div className="relative w-full h-full flex flex-col justify-between">
                                    <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
                                    
                                    <div className="space-y-6 relative z-10">
                                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-blue-500/30 shadow-lg">
                                            <div className="flex items-center justify-between mb-4">
                                                <h4 className="text-xl font-bold text-white">Sales Cloud CPQ</h4>
                                                <PenTool className="w-6 h-6 text-blue-400" />
                                            </div>
                                            <p className="text-sm text-gray-300">Generate complex quotes for massive compound tenders instantly. Combine Pumps, Pipes, and Irrigation Controllers into unified BOMs.</p>
                                        </div>

                                        <div className="flex justify-center">
                                            <ArrowRight className="w-6 h-6 text-gray-500 rotate-90" />
                                        </div>

                                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-cyan-500/30 shadow-lg">
                                            <div className="flex items-center justify-between mb-4">
                                                <h4 className="text-xl font-bold text-white">Experience Cloud</h4>
                                                <Search className="w-6 h-6 text-cyan-400" />
                                            </div>
                                            <p className="text-sm text-gray-300">Client portal for real estate developers to track project phases, material delivery status, and submit service requests.</p>
                                        </div>

                                        <div className="flex justify-center">
                                            <ArrowRight className="w-6 h-6 text-gray-500 rotate-90" />
                                        </div>

                                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-teal-500/30 shadow-lg">
                                            <div className="flex items-center justify-between mb-4">
                                                <h4 className="text-xl font-bold text-white">Service Cloud & FSM</h4>
                                                <Wrench className="w-6 h-6 text-teal-400" />
                                            </div>
                                            <p className="text-sm text-gray-300">After-sales maintenance tracking. Dispatch field service teams for pump repairs or irrigation system checkups.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Catalog Categories Section */}
            <section className="relative overflow-hidden bg-gray-900/50 py-16 border-y border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <AnimatedSection className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white mb-6">
                            Mastering the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Complete Catalog</span>
                        </h2>
                        <p className="text-gray-300 max-w-3xl mx-auto leading-relaxed">
                            Salesforce seamlessly unifies quoting, inventory visibility, and maintenance across all your diverse business units.
                        </p>
                    </AnimatedSection>
                    
                    <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {[
                            {
                                icon: Settings, title: "MEP",
                                colorClass: "border-blue-500", bgClass: "bg-blue-500/20", textClass: "text-blue-400", dotClass: "text-blue-500",
                                items: ["Pumps", "Booster Systems", "Valves", "Couplings", "Flange Adaptors", "Water/Wastewater Components"]
                            },
                            {
                                icon: Droplet, title: "Irrigation",
                                colorClass: "border-cyan-500", bgClass: "bg-cyan-500/20", textClass: "text-cyan-400", dotClass: "text-cyan-500",
                                items: ["Sprinklers", "Rotors", "Spray Heads", "Dripline", "Controllers", "Solenoid Valves", "Filters"]
                            },
                            {
                                icon: Sprout, title: "Agriculture",
                                colorClass: "border-green-500", bgClass: "bg-green-500/20", textClass: "text-green-400", dotClass: "text-green-500",
                                items: ["Drip Irrigation", "Filtration", "Fertigation", "Agricultural Sprinklers"]
                            },
                            {
                                icon: Sun, title: "Landscape",
                                colorClass: "border-orange-500", bgClass: "bg-orange-500/20", textClass: "text-orange-400", dotClass: "text-orange-500",
                                items: ["Landscape Lighting", "Green Roof Systems", "Water Features", "Urban Furniture", "Garden Machinery"]
                            },
                            {
                                icon: Wrench, title: "Services",
                                colorClass: "border-purple-500", bgClass: "bg-purple-500/20", textClass: "text-purple-400", dotClass: "text-purple-500",
                                items: ["Design", "Engineering", "Installation", "Testing & Commissioning", "Plantation", "Maintenance"]
                            }
                        ].map((category, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className={`bg-gray-800/80 rounded-2xl p-6 border-t-4 ${category.colorClass} shadow-xl hover:bg-gray-800 transition-colors`}
                            >
                                <div className={`w-12 h-12 ${category.bgClass} rounded-xl flex items-center justify-center mb-4`}>
                                    <category.icon className={`w-6 h-6 ${category.textClass}`} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-4">{category.title}</h3>
                                <ul className="space-y-2">
                                    {category.items.map((item, itemIdx) => (
                                        <li key={itemIdx} className="text-sm text-gray-400 flex items-start gap-2">
                                            <span className={`${category.dotClass} mt-1`}>•</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default WaterIrrigationSection;
