import React from 'react';
import { motion } from 'framer-motion';
import { Target, Zap, LayoutTemplate, Smartphone, Droplet, Box, PenTool, CheckCircle, Search, Wrench, Sprout, Wind, ArrowRight, Sun, Settings, Database, Users, ShieldCheck, Activity } from 'lucide-react';
import AnimatedSection from './AnimatedSection';

const WaterIrrigationSection = () => {
    return (
        <div className="space-y-24 py-12">
            {/* Executive Dashboard Section */}
            <section className="relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <AnimatedSection className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-full text-green-300 text-sm font-medium mb-6 border border-green-500/30">
                            <Sprout className="w-4 h-4" />
                            <span>Specification Selling & Project Intelligence</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                            Water Supply & <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">Irrigation Systems</span>
                        </h2>
                        <p className="text-gray-300 text-lg max-w-4xl mx-auto leading-relaxed">
                            Transition from simple quoting to complex specification selling. Manage years-long mega-projects, influence consultants, and orchestrate multiple sales teams from discovery to installation.
                        </p>
                    </AnimatedSection>

                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="space-y-6"
                        >
                            <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                                <Activity className="w-8 h-8 text-green-400" />
                                The Mega-Project View
                            </h3>
                            <p className="text-gray-300 leading-relaxed mb-6">
                                A single unified view for executive leadership. Track the entire ecosystem of a massive development before the final contractor is even selected.
                            </p>

                            <div className="bg-gray-800/80 rounded-2xl p-6 border border-white/10 shadow-xl space-y-4">
                                <div className="border-b border-gray-700 pb-4 mb-4">
                                    <h4 className="text-xl font-bold text-cyan-400">New Cairo Mega Development</h4>
                                    <p className="text-sm text-gray-400 mt-1">Project Value Potential: EGP 150M</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-500 block">Developer</span>
                                        <span className="text-white font-medium">Mega Real Estate Co.</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 block">Main Consultant</span>
                                        <span className="text-white font-medium">Global Consultants Inc.</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 block">Specification Status</span>
                                        <span className="text-green-400 font-medium">Pumps Approved / Irrigation Pending</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 block">Main Contractor</span>
                                        <span className="text-white font-medium">Premier Construction (Tender)</span>
                                    </div>
                                </div>
                                <div className="mt-4 bg-black/30 rounded-xl p-4">
                                    <span className="text-gray-500 block text-sm mb-2">Key Project Stakeholders</span>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs">Landscape Design Consultant</span>
                                        <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs">Supervision Consultant</span>
                                        <span className="px-2 py-1 bg-orange-500/20 text-orange-300 rounded text-xs">General Contractor</span>
                                        <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs">Landscape Contractor</span>
                                        <span className="px-2 py-1 bg-red-500/20 text-red-300 rounded text-xs">Supplier</span>
                                    </div>
                                    <span className="text-gray-500 block text-sm mb-2">Assigned Opportunity Teams</span>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded text-xs">Consultant Sales</span>
                                        <span className="px-2 py-1 bg-pink-500/20 text-pink-300 rounded text-xs">Developer Sales</span>
                                        <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded text-xs">Technical Engineer</span>
                                        <span className="px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded text-xs">Contractor Sales</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <Target className="w-8 h-8 text-blue-400" />
                                The Specification Lifecycle & Leads
                            </h3>
                            <p className="text-gray-300 leading-relaxed mb-6">
                                Selling starts years before a quote is requested. Track specification influence, monitor lead generation from marketing campaigns, track project changes in real-time, and map contact movement across developers or project zones to open new channels.
                            </p>

                            <div className="relative border-l-2 border-gray-700 ml-4 space-y-6">
                                {[
                                    { phase: "Marketing & Lead Gen", steps: ["Campaign Tracking", "Lead Qualification", "Developer Network Mapping"] },
                                    { phase: "Early Influence", steps: ["Project Identified", "Consultant Engaged", "Specification in Progress"] },
                                    { phase: "Hardcoding the Brand", steps: ["Specified", "Developer Approved"], highlight: true },
                                    { phase: "Commercial Execution", steps: ["Contractor Identified", "RFQ Received", "Quotation Submitted"] },
                                    { phase: "Closing", steps: ["Commercial Negotiation", "Won/Lost", "Installation", "After-Sales"] }
                                ].map((stage, idx) => (
                                    <div key={idx} className="relative pl-6">
                                        <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-4 border-gray-900 ${stage.highlight ? 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]' : 'bg-gray-600'}`} />
                                        <h4 className={`font-bold ${stage.highlight ? 'text-cyan-400' : 'text-white'}`}>{stage.phase}</h4>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {stage.steps.map((step, stepIdx) => (
                                                <span key={stepIdx} className="text-xs px-2 py-1 bg-white/5 border border-white/10 rounded-md text-gray-400">
                                                    {step}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Project & Customer Intelligence Infographic */}
            <section className="relative overflow-hidden py-16 bg-gray-900/30 border-y border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <AnimatedSection className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-white mb-6">
                            Intelligent <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">Project & Customer Tracking</span>
                        </h2>
                        <p className="text-gray-300 max-w-3xl mx-auto leading-relaxed">
                            A clear, structured view of your entire business landscape, powered by automated tracking and real-time notifications.
                        </p>
                    </AnimatedSection>
                    
                    <div className="grid md:grid-cols-3 gap-6">
                        {/* 4 Kinds of Projects */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-white/10 shadow-xl"
                        >
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <LayoutTemplate className="w-6 h-6 text-cyan-400" />
                                4 Different Kinds of Projects
                            </h3>
                            <ul className="space-y-4 text-gray-300 font-medium text-lg">
                                <li className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                                    Under Design Opp
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                                    Mobilisation/Tender Opp
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                                    Under Construction Opp
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                                    FM Opp
                                </li>
                            </ul>
                        </motion.div>

                        {/* Types of Customers */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-white/10 shadow-xl"
                        >
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <Users className="w-6 h-6 text-purple-400" />
                                Types of Customers
                            </h3>
                            <ul className="space-y-4 text-gray-300 font-medium text-lg">
                                <li className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                                    Construction Company
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                                    Academy applicant
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                                    Business Contacts
                                </li>
                            </ul>
                        </motion.div>

                        {/* Notifications & Automations */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-2xl p-6 border border-blue-500/30 shadow-xl text-white"
                        >
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Zap className="w-6 h-6 text-yellow-400" />
                                Automations & Alerts
                            </h3>
                            <p className="text-blue-100 text-sm mb-4 leading-relaxed">
                                Get instant alerts when project attributes or stakeholders shift across projects and zones.
                            </p>
                            
                            <div className="space-y-4">
                                {/* Stakeholder Change Alert */}
                                <div className="bg-white/5 p-4 rounded-xl border border-white/10 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-1.5 bg-red-500/20 rounded-bl-lg border-b border-l border-red-500/30">
                                        <Activity className="w-3 h-3 text-red-400 animate-pulse" />
                                    </div>
                                    <h4 className="text-sm font-semibold text-blue-200 mb-3">Stakeholder Change Alert</h4>
                                    
                                    <div className="flex items-center justify-between text-xs mb-2">
                                        <span className="text-gray-400 font-medium">Main Contractor</span>
                                        <span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">Zone A</span>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 bg-red-500/10 border border-red-500/20 rounded p-1.5 text-center text-gray-400 line-through text-xs">
                                            Contractor A
                                        </div>
                                        <ArrowRight className="w-3 h-3 text-gray-500 shrink-0" />
                                        <div className="flex-1 bg-green-500/20 border border-green-500/30 rounded p-1.5 text-center text-green-300 font-bold text-xs">
                                            Contractor B
                                        </div>
                                    </div>
                                </div>

                                {/* Design Consultant Change Alert */}
                                <div className="bg-white/5 p-4 rounded-xl border border-white/10 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-1.5 bg-yellow-500/20 rounded-bl-lg border-b border-l border-yellow-500/30">
                                        <Activity className="w-3 h-3 text-yellow-400 animate-pulse" />
                                    </div>
                                    <h4 className="text-sm font-semibold text-blue-200 mb-3">Design Revision Alert</h4>
                                    
                                    <div className="flex items-center justify-between text-xs mb-2">
                                        <span className="text-gray-400 font-medium">Design Consultant</span>
                                        <span className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">Project Wide</span>
                                    </div>
                                    
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 bg-red-500/10 border border-red-500/20 rounded p-1.5 text-center text-gray-400 line-through text-xs">
                                            Consultant X
                                        </div>
                                        <ArrowRight className="w-3 h-3 text-gray-500 shrink-0" />
                                        <div className="flex-1 bg-green-500/20 border border-green-500/30 rounded p-1.5 text-center text-green-300 font-bold text-xs">
                                            Consultant Y
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Product & Margin Governance */}
            <section className="relative overflow-hidden bg-gray-900/50 py-16 border-y border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <AnimatedSection className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-white mb-6">
                            Intelligent <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Catalog & Margin Governance</span>
                        </h2>
                        <p className="text-gray-300 max-w-3xl mx-auto leading-relaxed">
                            Structure international brands with deep SKU-level cost tracking, and enforce strict margin-based approval workflows for the commercial team.
                        </p>
                    </AnimatedSection>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-white/10"
                        >
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <Database className="w-6 h-6 text-blue-400" />
                                4-Tier Data Architecture
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-gray-300">
                                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-medium">1. Supplier</span>
                                    <ArrowRight className="w-4 h-4 text-gray-600" />
                                    <span>International Manufacturer</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-300">
                                    <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-lg text-sm font-medium">2. Brand</span>
                                    <ArrowRight className="w-4 h-4 text-gray-600" />
                                    <span>Brand Name</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-300">
                                    <span className="px-3 py-1 bg-teal-500/20 text-teal-400 rounded-lg text-sm font-medium">3. Family</span>
                                    <ArrowRight className="w-4 h-4 text-gray-600" />
                                    <span>Irrigation / Pumps / Couplings</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-300">
                                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm font-medium">4. SKU</span>
                                    <ArrowRight className="w-4 h-4 text-gray-600" />
                                    <span>Specific Model</span>
                                </div>
                                <div className="mt-6 pt-6 border-t border-gray-700">
                                    <p className="text-sm text-gray-400">
                                        Every SKU tracks: Source Country • Currency • Local Inventory • Purchase Cost • Landed Cost • List Price • Target Margin • Legal Entity (e.g. Egypt vs KSA)
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 border border-white/10"
                        >
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <ShieldCheck className="w-6 h-6 text-purple-400" />
                                Automated Margin Approvals
                            </h3>
                            <p className="text-sm text-gray-400 mb-6">
                                Salesforce calculates: Purchase Cost + Landed Cost = Cost Basis → Customer Price → Gross Profit → Gross Margin %.
                            </p>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
                                    <span className="text-green-400 font-bold">Margin ≥ 25%</span>
                                    <span className="text-gray-300 text-sm">Auto-Approved (Salesperson)</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                                    <span className="text-yellow-400 font-bold">20% – 25%</span>
                                    <span className="text-gray-300 text-sm">Sales Manager Approval</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                                    <span className="text-orange-400 font-bold">15% – 20%</span>
                                    <span className="text-gray-300 text-sm">Commercial / CFO Approval</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                                    <span className="text-red-400 font-bold">&lt; 15%</span>
                                    <span className="text-gray-300 text-sm">Executive Approval / Blocked</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Systems Architecture */}
            <section className="relative overflow-hidden py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <AnimatedSection className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white mb-6">
                            Best-in-Class <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Systems Architecture</span>
                        </h2>
                    </AnimatedSection>
                    
                    <div className="grid md:grid-cols-2 gap-8 items-stretch">
                        <div className="bg-gray-800/60 rounded-2xl p-8 border border-blue-500/30 flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6">
                                <Users className="w-8 h-8 text-blue-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">Salesforce CRM</h3>
                            <p className="text-gray-300 mb-6 flex-grow">
                                Comprehensive Account Tracking (Consumers, Developers, Academic, Consultants, Contractors) • Mega-Projects • Stakeholder Maps • Sales Execution • Specifications • Opportunities • CPQ Quotes • Margin Approvals
                            </p>
                            <span className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium">Front-Office Engine</span>
                        </div>

                        <div className="hidden md:flex items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 mt-12">
                            <div className="bg-gray-900 p-2 rounded-full border border-gray-700 flex flex-col items-center gap-2">
                                <ArrowRight className="w-6 h-6 text-gray-500" />
                                <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">API Sync</span>
                                <ArrowRight className="w-6 h-6 text-gray-500 rotate-180" />
                            </div>
                        </div>

                        <div className="bg-gray-800/60 rounded-2xl p-8 border border-purple-500/30 flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6">
                                <Box className="w-8 h-8 text-purple-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">ERP (Odoo / SAP)</h3>
                            <p className="text-gray-300 mb-6 flex-grow">
                                Inventory Source of Truth • Real-time SKU Stock • Purchasing Cost • Standard Costing • Finance & Accounting • Warehouse Management
                            </p>
                            <span className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-full text-sm font-medium">Back-Office Engine</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default WaterIrrigationSection;
