import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Layers,
    CheckCircle2,
    Sparkles,
    AlertCircle,
    Loader2,
    FileText,
    Download
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useToast } from '../hooks/use-toast';

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
    verticalType?: string;
    companyName?: string;
    selectedModules?: Set<string>;
    onToggleModule?: (moduleId: string) => void;
}

const ModulesSection = ({
    modules,
    isLoading,
    industryName,
    verticalType,
    companyName,
    selectedModules,
    onToggleModule
}: ModulesSectionProps) => {
    const { toast } = useToast();
    const [execSummary, setExecSummary] = useState('');
    const [currentState, setCurrentState] = useState('');
    const [otherNotes, setOtherNotes] = useState('');
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

    const generateSOW = async () => {
        setIsGeneratingPdf(true);
        try {
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.width;

            // --- Header ---
            // Placeholder for Logo - In a real app, you'd load the image data
            // doc.addImage(logoData, 'PNG', 15, 15, 30, 10);

            doc.setFontSize(22);
            doc.setTextColor(0, 150, 255); // Cloudastick Blue-ish
            doc.text("Scope of Work", pageWidth / 2, 20, { align: 'center' });

            doc.setFontSize(16);
            doc.setTextColor(60, 60, 60);
            doc.text(`For: ${companyName || 'Valued Client'}`, pageWidth / 2, 30, { align: 'center' });

            doc.setFontSize(12);
            doc.setTextColor(100, 100, 100);
            doc.text(`Industry: ${verticalType || industryName || 'General'}`, pageWidth / 2, 38, { align: 'center' });

            let yPos = 50;

            // --- Sections Helper ---
            const addSectionParams = (title: string, content: string) => {
                if (!content) return;

                doc.setFontSize(14);
                doc.setTextColor(0, 0, 0);
                doc.text(title, 14, yPos);
                yPos += 7;

                doc.setFontSize(10);
                doc.setTextColor(80, 80, 80);
                const splitText = doc.splitTextToSize(content, pageWidth - 28);
                doc.text(splitText, 14, yPos);
                yPos += (splitText.length * 5) + 10;
            };

            // --- User Inputs ---
            addSectionParams("1. Executive Summary & Objectives", execSummary);
            addSectionParams("2. Current State & Vision", currentState);

            // --- In-Scope Modules ---
            doc.setFontSize(14);
            doc.setTextColor(0, 0, 0);
            doc.text("3. In-Scope Modules", 14, yPos);
            yPos += 5;

            const inScopeData = modules
                .filter(m => selectedModules?.has(m.id))
                .map(m => [m.name, m.priority ? `P${m.priority}` : 'Standard']);

            if (inScopeData.length > 0) {
                autoTable(doc, {
                    startY: yPos,
                    head: [['Module Name', 'Priority']],
                    body: inScopeData,
                    theme: 'grid',
                    headStyles: { fillColor: [0, 150, 255] },
                    styles: { fontSize: 10, cellPadding: 3 },
                    margin: { left: 14, right: 14 }
                });
                // @ts-ignore
                yPos = doc.lastAutoTable.finalY + 15;
            } else {
                doc.setFontSize(10);
                doc.text("(No modules selected)", 14, yPos + 5);
                yPos += 15;
            }

            // --- Out-of-Scope Modules ---
            // Check if we need a new page
            if (yPos > 250) {
                doc.addPage();
                yPos = 20;
            }

            doc.setFontSize(14);
            doc.setTextColor(0, 0, 0);
            doc.text("4. Out-of-Scope Modules", 14, yPos);
            yPos += 2; // autotable margin handles spacing

            const outScopeData = modules
                .filter(m => !selectedModules?.has(m.id))
                .map(m => [m.name, "Future Phase Candidate"]);

            if (outScopeData.length > 0) {
                autoTable(doc, {
                    startY: yPos + 5,
                    head: [['Module Name', 'Status']],
                    body: outScopeData,
                    theme: 'striped', // different theme for contrast
                    headStyles: { fillColor: [150, 150, 150] },
                    styles: { fontSize: 9, cellPadding: 2, textColor: [100, 100, 100] },
                    margin: { left: 14, right: 14 }
                });
                // @ts-ignore
                yPos = doc.lastAutoTable.finalY + 15;
            } else {
                doc.setFontSize(10);
                doc.text("(All available modules selected)", 14, yPos + 10);
                yPos += 20;
            }

            // --- Other Notes ---
            if (otherNotes) {
                if (yPos > 240) {
                    doc.addPage();
                    yPos = 20;
                }
                addSectionParams("5. Other Notes", otherNotes);
            }

            // --- Footer ---
            const pageCount = doc.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setTextColor(150);
                doc.text(`Page ${i} of ${pageCount} - Generated by Cloudastick Scope Builder`, pageWidth / 2, doc.internal.pageSize.height - 10, { align: 'center' });
            }

            doc.save(`${companyName || 'Cloudastick'}_Scope_of_Work.pdf`);

            toast({
                title: "Document Saved",
                description: "Your Scope of Work PDF has been generated successfully.",
                variant: "default"
            });

        } catch (error) {
            console.error("PDF Generation Error", error);
            toast({
                title: "Export Failed",
                description: "Could not generate the PDF. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsGeneratingPdf(false);
        }
    };

    if (isLoading) {
        return (
            <section id="modules-section" className="py-20 relative overflow-hidden bg-gray-900/50">
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

    const displayTitle = verticalType || industryName || 'Industry';
    const contextSubtitle = companyName
        ? `${companyName}'s Modules in scope`
        : "Select the modules you need to build your custom scope";

    return (
        <section id="modules-section" className="py-24 relative overflow-hidden">
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
                        {displayTitle} Modules
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-gray-400 max-w-3xl mx-auto"
                    >
                        {onToggleModule ? contextSubtitle : "Specialized components tailored for your industry needs."}
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {sortedModules.map((module, index) => {
                        const isSelected = selectedModules ? selectedModules.has(module.id) : false;
                        const isInteractive = !!onToggleModule;

                        return (
                            <motion.div
                                key={module.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => isInteractive && onToggleModule && onToggleModule(module.id)}
                            >
                                <Card className={`h-full backdrop-blur-sm transition-all duration-300 group relative
                                    ${isInteractive ? 'cursor-pointer' : ''}
                                    ${isSelected
                                        ? 'bg-cyan-900/20 border-cyan-500/50 shadow-lg shadow-cyan-500/10'
                                        : 'bg-gray-800/30 border-gray-700 hover:border-gray-500/50'
                                    }
                                    ${isInteractive && !isSelected ? 'opacity-80 hover:opacity-100' : ''}
                                `}>
                                    {/* Selection Indicator */}
                                    {isSelected && (
                                        <div className="absolute top-4 right-4 z-10">
                                            <div className="bg-cyan-500 rounded-full p-1">
                                                <CheckCircle2 className="w-4 h-4 text-white" />
                                            </div>
                                        </div>
                                    )}

                                    <CardHeader>
                                        <div className="flex items-start justify-between mb-2">
                                            <Badge variant="outline" className={`
                                                bg-gray-900/50 text-xs font-medium border-gray-700
                                                ${module.priority !== null && module.priority <= 3 ? 'text-amber-400 border-amber-500/30' : 'text-gray-400'}
                                            `}>
                                                {module.priority !== null ? `Priority ${module.priority}` : 'Optional'}
                                            </Badge>
                                        </div>
                                        <CardTitle className={`text-xl font-bold transition-colors ${isSelected ? 'text-cyan-400' : 'text-white group-hover:text-cyan-300'}`}>
                                            {module.name}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        {/* Features List */}
                                        {module.featureList && (
                                            <div className="space-y-3">
                                                {module.featureList.split('\n').slice(0, 4).map((feature, idx) => (
                                                    <div key={idx} className="flex items-start gap-2.5">
                                                        <CheckCircle2 className={`w-5 h-5 mt-0.5 shrink-0 transition-colors ${isSelected ? 'text-cyan-500' : 'text-gray-500'}`} />
                                                        <span className={`text-sm leading-snug transition-colors ${isSelected ? 'text-gray-200' : 'text-gray-400'}`}>{feature.replace(/^-\s*/, '')}</span>
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
                        );
                    })}
                </div>

                {/* SOW Generator Section */}
                {onToggleModule && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto bg-gray-800/50 backdrop-blur-md rounded-2xl border border-gray-700 p-8"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-cyan-500/20 p-3 rounded-lg">
                                <FileText className="w-6 h-6 text-cyan-400" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white">Generate Scope of Work</h3>
                                <p className="text-gray-400">Customize your project scope document</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 mb-8">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">1. Executive Summary & Objectives</label>
                                <Textarea
                                    placeholder="Describe the high-level goals and objectives of this project..."
                                    className="bg-gray-900/50 border-gray-600 focus:border-cyan-500 min-h-[100px]"
                                    value={execSummary}
                                    onChange={(e) => setExecSummary(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">2. Current State & Vision</label>
                                <Textarea
                                    placeholder="Describe the current challenges and the desired future state..."
                                    className="bg-gray-900/50 border-gray-600 focus:border-cyan-500 min-h-[100px]"
                                    value={currentState}
                                    onChange={(e) => setCurrentState(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">3. Other Notes</label>
                                <Textarea
                                    placeholder="Any additional requirements, assumptions, or constraints..."
                                    className="bg-gray-900/50 border-gray-600 focus:border-cyan-500 min-h-[80px]"
                                    value={otherNotes}
                                    onChange={(e) => setOtherNotes(e.target.value)}
                                />
                            </div>
                        </div>

                        <Button
                            onClick={generateSOW}
                            disabled={isGeneratingPdf}
                            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold py-6 text-lg shadow-lg shadow-cyan-900/20"
                        >
                            {isGeneratingPdf ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Generating Document...
                                </>
                            ) : (
                                <>
                                    <Download className="w-5 h-5 mr-2" />
                                    Save Scope of Work Document
                                </>
                            )}
                        </Button>
                        <p className="text-xs text-center text-gray-500 mt-4">
                            Generates a PDF with selected modules as "In-Scope" and unselected as "Future Phase Candidates".
                        </p>
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default ModulesSection;
