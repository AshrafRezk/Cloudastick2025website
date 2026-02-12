import React from 'react';
import { motion } from 'framer-motion';
import {
    Layers,
    CheckCircle2,
    Sparkles,
    AlertCircle,
    Loader2
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';

interface VerticalModule {
    id: string;
    name: string;
    featureList: string;
    priority: number | null;
    cloudastickEdge: string;
    verticalId: string;
    verticalName: string;
}

interface ModulesSectionProps {
    modules: VerticalModule[];
    isLoading: boolean;
    industryName?: string;
}

const ModulesSection = ({ modules, isLoading, industryName }: ModulesSectionProps) => {
    if (isLoading) {
        return (
            <section className="py-20 relative overflow-hidden bg-gray-900/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-cyan-400 mx-auto mb-4" />
                    <p className="text-gray-400">Loading industry modules...</p>
                </div>
            </section>
        );
    }

    if (modules.length === 0) {
        return null;
    }

    // Sort modules: Priority set (asc) -> Priority null -> Name asc
    const sortedModules = [...modules].sort((a, b) => {
        if (a.priority !== null && b.priority !== null) return a.priority - b.priority;
        if (a.priority !== null) return -1;
        if (b.priority !== null) return 1;
        return a.name.localeCompare(b.name);
    });

    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gray-900 pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-gray-900 to-gray-900 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-6"
                    >
                        <Layers className="w-4 h-4" />
                        <span className="text-sm font-medium uppercase tracking-wider">Modular Architecture</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-5xl font-bold text-white mb-6"
                    >
                        {industryName ? `${industryName} Modules` : 'Industry Modules'}
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-gray-400 max-w-3xl mx-auto"
                    >
                        Specialized components tailored for your industry needs.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sortedModules.map((module, index) => (
                        <motion.div
                            key={module.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card className="h-full bg-gray-800/30 backdrop-blur-sm border-gray-700 hover:border-cyan-500/50 transition-all hover:shadow-lg hover:shadow-cyan-500/10 group">
                                <CardHeader>
                                    <div className="flex items-start justify-between mb-2">
                                        <Badge variant="outline" className={`
                      bg-gray-900/50 text-xs font-medium border-gray-700
                      ${module.priority !== null && module.priority <= 3 ? 'text-amber-400 border-amber-500/30' : 'text-gray-400'}
                    `}>
                                            {module.priority !== null ? `Priority ${module.priority}` : 'Optional'}
                                        </Badge>
                                    </div>
                                    <CardTitle className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                                        {module.name}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    {/* Features List */}
                                    {module.featureList && (
                                        <div className="space-y-3">
                                            {module.featureList.split('\n').slice(0, 4).map((feature, idx) => (
                                                <div key={idx} className="flex items-start gap-2.5">
                                                    <CheckCircle2 className="w-5 h-5 text-gray-500 mt-0.5 shrink-0" />
                                                    <span className="text-sm text-gray-300 leading-snug">{feature.replace(/^-\s*/, '')}</span>
                                                </div>
                                            ))}
                                            {module.featureList.split('\n').length > 4 && (
                                                <p className="text-xs text-gray-500 italic pl-7">
                                                    + {module.featureList.split('\n').length - 4} more features
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    {/* Cloudastick Edge */}
                                    {module.cloudastickEdge && (
                                        <div className="pt-4 mt-auto border-t border-gray-700/50">
                                            <div className="flex items-center gap-2 mb-2 text-cyan-400">
                                                <Sparkles className="w-4 h-4" />
                                                <span className="text-xs font-bold uppercase tracking-wider">Cloudastick Edge</span>
                                            </div>
                                            <p className="text-sm text-gray-400 leading-relaxed italic">
                                                "{module.cloudastickEdge}"
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ModulesSection;
