import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Map, Calendar, Navigation, Bus, User, MapPin, CheckCircle2 } from 'lucide-react';
import AnimatedSection from './AnimatedSection';

const FleetManagementSection = () => {

    return (
        <section className="py-20 relative overflow-hidden bg-gray-900">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&auto=format&fit=crop&w=2021&q=80')] bg-cover bg-center opacity-10"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <AnimatedSection className="mb-16">
                    <div className="text-center max-w-3xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium mb-6 border border-emerald-500/30">
                            <Navigation className="w-4 h-4" />
                            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                            Logistics & Operations
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Advanced Itinerary & Fleet Management
                        </h2>
                        <p className="text-xl text-gray-300 leading-relaxed">
                            Orchestrate complex travel itineraries and manage your fleet efficiency with a single, integrated map-based solution.
                        </p>
                    </div>
                </AnimatedSection>

                <div className="grid lg:grid-cols-5 gap-8">
                    {/* Interactive Builder Mockup */}
                    <div className="lg:col-span-3">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 shadow-2xl h-full flex flex-col"
                        >
                            {/* Header */}
                            <div className="bg-gray-900 p-4 border-b border-gray-700 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    <span className="text-gray-400 text-sm ml-2 font-mono">ItineraryBuilder.app</span>
                                </div>
                                <div className="flex gap-2">
                                    <span className="px-2 py-1 bg-blue-600/20 text-blue-400 text-xs rounded border border-blue-600/30">Day 1</span>
                                    <span className="px-2 py-1 bg-gray-700 text-gray-400 text-xs rounded">Day 2</span>
                                    <span className="px-2 py-1 bg-gray-700 text-gray-400 text-xs rounded">Day 3</span>
                                </div>
                            </div>

                            {/* Map UI */}
                            <div className="relative flex-grow min-h-[400px] bg-gray-800">
                                {/* Fake Map Background */}
                                <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/-74.006,40.7128,12,0/800x600?access_token=YOUR_ACCESS_TOKEN')] bg-cover opacity-30 grayscale"></div>

                                {/* Map Elements */}
                                <div className="absolute inset-0 p-6">
                                    {/* Route Line */}
                                    <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
                                        <path d="M 150 150 Q 300 100 450 250 T 600 200" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="6 4" />
                                    </svg>

                                    {/* Point 1 */}
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        whileInView={{ scale: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="absolute top-[130px] left-[130px] z-20"
                                    >
                                        <div className="relative group cursor-pointer">
                                            <div className="w-4 h-4 bg-emerald-500 rounded-full ring-4 ring-emerald-500/30"></div>
                                            <div className="absolute mt-2 -left-12 bg-white text-gray-900 px-3 py-1 rounded shadow-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                                Hotel Pickup 08:00 AM
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Point 2 */}
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        whileInView={{ scale: 1 }}
                                        transition={{ delay: 0.4 }}
                                        className="absolute top-[230px] left-[430px] z-20"
                                    >
                                        <div className="relative group cursor-pointer">
                                            <div className="w-4 h-4 bg-emerald-500 rounded-full ring-4 ring-emerald-500/30"></div>
                                            <div className="absolute mt-2 -left-12 bg-white text-gray-900 px-3 py-1 rounded shadow-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                                Museum Tour 10:30 AM
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* Point 3 */}
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        whileInView={{ scale: 1 }}
                                        transition={{ delay: 0.6 }}
                                        className="absolute top-[180px] left-[580px] z-20"
                                    >
                                        <div className="relative group cursor-pointer">
                                            <div className="w-4 h-4 bg-emerald-500 rounded-full ring-4 ring-emerald-500/30"></div>
                                            <div className="absolute mt-2 -left-12 bg-white text-gray-900 px-3 py-1 rounded shadow-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                                Lunch Break 01:00 PM
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Control Panel */}
                            <div className="bg-gray-900 p-6 border-t border-gray-700 grid grid-cols-2 gap-4">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-emerald-500/20 rounded text-emerald-400 mt-1">
                                        <Bus className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-white">Vehicle Assignment</p>
                                        <p className="text-xs text-gray-400 mt-1">Smart matching based on group size and vehicle availability.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-blue-500/20 rounded text-blue-400 mt-1">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-white">Route Optimization</p>
                                        <p className="text-xs text-gray-400 mt-1">AI-calculated efficient routes to save fuel and time.</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Feature Cards */}
                    <div className="lg:col-span-2 space-y-4">
                        {[
                            {
                                title: "Dynamic Itinerary Builder",
                                desc: "Drag-and-drop interface to build multi-day itineraries. Automatically calculating travel times and distances between points of interest.",
                                icon: Calendar,
                                color: "text-purple-400",
                                bg: "bg-purple-500/10",
                                border: "border-purple-500/30"
                            },
                            {
                                title: "Fleet Tracking",
                                desc: "Real-time GPS tracking of all vehicles. Monitor detailed statuses including speed, location, and maintenance alerts.",
                                icon: Map,
                                color: "text-blue-400",
                                bg: "bg-blue-500/10",
                                border: "border-blue-500/30"
                            },
                            {
                                title: "Driver Management",
                                desc: "Assign drivers to trips, track working hours, and manage performance. Ensure compliance with rest regulations.",
                                icon: User,
                                color: "text-orange-400",
                                bg: "bg-orange-500/10",
                                border: "border-orange-500/30"
                            }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className={`p-6 rounded-xl border ${item.border} ${item.bg} hover:bg-gray-800 transition-colors`}
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <item.icon className={`w-6 h-6 ${item.color}`} />
                                    <h3 className="text-lg font-bold text-white">{item.title}</h3>
                                </div>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    {item.desc}
                                </p>
                            </motion.div>
                        ))}

                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="p-6 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl mt-4 text-center cursor-pointer hover:shadow-lg hover:shadow-emerald-500/20 transition-all transform hover:-translate-y-1"
                        >
                            <h4 className="text-white font-bold text-lg mb-1">Request a Demo</h4>
                            <p className="text-emerald-50 text-sm">See the fleet management console in action</p>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FleetManagementSection;
