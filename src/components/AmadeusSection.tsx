import React from 'react';
import { motion } from 'framer-motion';
import { Plane, Globe, Database, ArrowRight, Shield, Clock } from 'lucide-react';
import AnimatedSection from './AnimatedSection';

const AmadeusSection = () => {
    return (
        <section className="py-20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-sky-900/30 to-indigo-900/20"></div>

            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 left-10 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <AnimatedSection className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-full text-blue-400 text-sm font-medium mb-6 border border-blue-500/30">
                            <Globe className="w-4 h-4" />
                            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                            Global Travel Tech
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Seamless Amadeus Integration
                        </h2>
                        <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed mb-4">
                            Unlock the full potential of your travel business by unifying Salesforce with Amadeus.
                            Experience real-time synchronization of PNRs, customer profiles, and booking data
                            to deliver personalized journeys at scale.
                        </p>
                    </motion.div>
                </AnimatedSection>

                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Integration Visual */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full transform -rotate-6"></div>
                        <div className="bg-gradient-to-br from-gray-900/90 to-blue-900/90 backdrop-blur-xl rounded-3xl p-8 border border-blue-500/30 shadow-2xl relative z-10">

                            {/* Connection Animation */}
                            <div className="flex justify-between items-center mb-12 relative">
                                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-lg z-10">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Salesforce.com_logo.svg/2560px-Salesforce.com_logo.svg.png" alt="Salesforce" className="w-14" />
                                </div>

                                {/* Flowing dots line */}
                                <div className="absolute left-20 right-20 top-1/2 h-1 bg-gray-700 overflow-hidden">
                                    <div className="absolute inset-0 bg-blue-400 w-1/2 animate-slide-right opacity-50"></div>
                                </div>

                                <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg z-10">
                                    <h3 className="text-white font-bold text-xl">aMabEus</h3>
                                </div>
                            </div>

                            {/* Data Cards */}
                            <div className="space-y-4">
                                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 flex items-center gap-4">
                                    <div className="p-2 bg-green-500/20 rounded-lg text-green-400">
                                        <Database className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">PNR Synchronization</p>
                                        <p className="text-white font-mono text-sm">REC-29384-AX • Confirmed</p>
                                    </div>
                                    <div className="ml-auto text-green-400 text-xs flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                                        Live
                                    </div>
                                </div>

                                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 flex items-center gap-4">
                                    <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                                        <Shield className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Profile Management</p>
                                        <p className="text-white font-mono text-sm">Traveler Preferences Included</p>
                                    </div>
                                    <div className="ml-auto text-purple-400 text-xs flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse"></span>
                                        Synced
                                    </div>
                                </div>
                            </div>

                        </div>
                    </motion.div>

                    {/* Features List */}
                    <div className="space-y-6">
                        {[
                            {
                                icon: Plane,
                                title: 'Real-Time PNR Sync',
                                description: 'Automatically sync Passenger Name Records (PNR) from Amadeus to Salesforce. View itineraries, flight status, and ancillary services directly in the CRM.'
                            },
                            {
                                icon: Globe,
                                title: 'Unified Customer Profile',
                                description: 'Combine Amadeus booking data with Salesforce 360 view. Understand traveler preferences, history, and value to offer personalized upgrades.'
                            },
                            {
                                icon: Clock,
                                title: 'Automated Workflows',
                                description: 'Trigger Salesforce flows based on Amadeus events. Send automated welcome emails, delay notifications, or check-in reminders.'
                            },
                            {
                                icon: Shield,
                                title: 'Secure Data Exchange',
                                description: 'Enterprise-grade security ensuring PCI compliance and data protection during the transfer of sensitive traveler information.'
                            }
                        ].map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="flex gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-blue-500/30 group"
                            >
                                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                    <feature.icon className="w-6 h-6 text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AmadeusSection;
