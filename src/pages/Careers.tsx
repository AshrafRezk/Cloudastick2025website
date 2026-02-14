import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Building2,
    MapPin,
    Briefcase,
    Clock,
    DollarSign,
    ArrowRight,
    Search,
    Loader2,
    Calendar,
    CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "../components/ui/dialog";
import { useSalesforce } from '../contexts/SalesforceContext';
import { fetchPositions, type Position } from '../services/careerService';
import { fetchCompanyLogo } from '../services/logoService';
import { normalizeWebsiteUrl } from '../utils/urlNormalizer';

const Careers = () => {
    const [searchParams] = useSearchParams();
    const { authData } = useSalesforce();

    // URL Params
    const brandColor = searchParams.get('brandColor');
    const companyWebsite = searchParams.get('cw');
    const directLogoUrl = searchParams.get('logo');

    // State
    const [positions, setPositions] = useState<Position[]>([]);
    const [filteredPositions, setFilteredPositions] = useState<Position[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [companyLogo, setCompanyLogo] = useState<string | null>(null);
    const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);

    // Computed Styles
    const primaryColor = brandColor ? `#${brandColor.replace('#', '')}` : '#06b6d4'; // Default cyan-500

    // Fetch Logo
    useEffect(() => {
        const loadLogo = async () => {
            if (directLogoUrl) {
                setCompanyLogo(directLogoUrl);
                return;
            }

            if (companyWebsite) {
                const normalized = normalizeWebsiteUrl(companyWebsite);
                const domain = normalized.domain || normalized.display;
                if (domain) {
                    try {
                        const logoData = await fetchCompanyLogo(domain);
                        if (logoData.logoUrl) {
                            setCompanyLogo(logoData.logoUrl);
                        }
                    } catch (error) {
                        console.error('Error fetching logo:', error);
                    }
                }
            }
        };

        loadLogo();
    }, [companyWebsite, directLogoUrl]);

    // Fetch Positions
    useEffect(() => {
        const loadPositions = async () => {
            if (!authData?.access_token || !authData?.instance_url) return;

            try {
                setLoading(true);
                const data = await fetchPositions(authData.access_token, authData.instance_url);
                setPositions(data);
                setFilteredPositions(data);
            } catch (error) {
                console.error('Error loading positions:', error);
            } finally {
                setLoading(false);
            }
        };

        if (authData) {
            loadPositions();
        }
    }, [authData]);

    // Filter Positions
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredPositions(positions);
            return;
        }

        const term = searchTerm.toLowerCase();
        const filtered = positions.filter(pos =>
            pos.Name.toLowerCase().includes(term) ||
            pos.Type__c?.toLowerCase().includes(term) ||
            pos.Location__c?.toLowerCase().includes(term) ||
            pos.Job_Description__c?.toLowerCase().includes(term)
        );
        setFilteredPositions(filtered);
    }, [searchTerm, positions]);

    const handleApply = (formattedName: string | undefined) => {
        if (formattedName) {
            window.location.href = `https://www.cloudastick.com/CareerDetails/${formattedName}`;
        }
    };

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return 'Open until filled';
        return new Date(dateString).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-cyan-500/30">
            {/* Header / Hero */}
            <div className="relative overflow-hidden mb-12">
                {/* Background Gradients */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-blue-900/20 to-transparent opacity-50 pointer-events-none" />
                <div className="absolute top-0 inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent opacity-40" />

                <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-6 pb-20 relative z-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
                        {/* Branding / Logo */}
                        <div className="flex items-center gap-4">
                            {companyLogo ? (
                                <img
                                    src={companyLogo}
                                    alt="Company Logo"
                                    className="h-24 md:h-32 w-auto object-contain bg-white/5 rounded-2xl p-4 backdrop-blur-md border border-white/10 shadow-xl"
                                />
                            ) : (
                                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-md" style={{ color: primaryColor }}>
                                    <Building2 className="h-12 w-12" />
                                </div>
                            )}
                        </div>

                        {/* Desktop Search */}
                        <div className="hidden md:block w-96 relative group">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors h-4 w-4" />
                            <Input
                                type="text"
                                placeholder="Search open roles..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-11 h-12 bg-white/5 border-white/10 text-white placeholder-gray-500 rounded-full focus:ring-2 focus:border-transparent transition-all hover:bg-white/10"
                                style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                            />
                        </div>
                    </div>

                    {/* Hero Text */}
                    <div className="max-w-4xl">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-400"
                        >
                            Shape the Future with Cloudastick Systems
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-xl md:text-2xl text-gray-400 leading-relaxed font-light"
                        >
                            At Cloudastick Systems, you'll collaborate with passionate professionals, tackle exciting challenges, and make a real impact. We foster growth, celebrate creativity, and empower every team member to shine. If you're ready to elevate your career and help shape tomorrow's technology, you belong with us.
                        </motion.p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-24">

                {/* Mobile Search */}
                <div className="md:hidden mb-12">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                        <Input
                            type="text"
                            placeholder="Search open roles..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-11 h-12 bg-white/5 border-white/10 text-white placeholder-gray-500 rounded-full"
                        />
                    </div>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32">
                        <Loader2 className="h-10 w-10 animate-spin mb-4 text-gray-500" />
                        <p className="text-gray-500 font-medium">Discovering opportunities...</p>
                    </div>
                ) : filteredPositions.length === 0 ? (
                    <div className="text-center py-32">
                        <Briefcase className="h-16 w-16 text-gray-700 mx-auto mb-6" />
                        <h3 className="text-2xl font-semibold text-gray-300 mb-3">
                            {searchTerm ? 'No roles matched' : 'No open positions'}
                        </h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                            {searchTerm
                                ? 'Refine your search to find the perfect role for looks.'
                                : 'We are always looking for exceptional talent. Check back soon.'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {filteredPositions.map((position, index) => (
                            <motion.div
                                key={position.Id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card
                                    className="group relative bg-white/5 backdrop-blur-sm border-white/5 hover:bg-white/10 transition-all duration-300 overflow-hidden cursor-pointer"
                                    onClick={() => setSelectedPosition(position)}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none" />

                                    <CardContent className="p-8">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                                            <div className="flex-1 space-y-4">
                                                <div className="flex flex-col md:flex-row md:items-center gap-4 text-sm text-cyan-400 font-medium tracking-wide uppercase">
                                                    <span style={{ color: primaryColor }}>{position.Type__c || 'Full Time'}</span>
                                                    <span className="hidden md:inline text-gray-700">•</span>
                                                    <span className="text-gray-400">Hybrid - Cairo, Egypt</span>
                                                    {position.Hire_By__c && (
                                                        <>
                                                            <span className="hidden md:inline text-gray-700">•</span>
                                                            <span className="text-gray-500">Apply by {formatDate(position.Hire_By__c)}</span>
                                                        </>
                                                    )}
                                                </div>

                                                <h2 className="text-3xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                                                    {position.Name}
                                                </h2>

                                                {position.Job_Description__c && (
                                                    <p className="text-gray-400 text-lg leading-relaxed line-clamp-2 max-w-3xl">
                                                        {position.Job_Description__c}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex-shrink-0">
                                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                                    <Button
                                                        className="w-full md:w-auto px-8 py-6 rounded-full text-lg font-medium bg-white text-black hover:bg-gray-200 border-0"
                                                        style={brandColor ? { backgroundColor: primaryColor, color: 'white' } : {}}
                                                    >
                                                        View Role
                                                        <ArrowRight className="ml-2 h-5 w-5" />
                                                    </Button>
                                                </motion.div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Position Details Modal */}
            <Dialog open={!!selectedPosition} onOpenChange={(open) => !open && setSelectedPosition(null)}>
                <DialogContent className="max-w-3xl bg-gray-900 border-gray-800 text-white max-h-[90vh] overflow-y-auto">
                    {selectedPosition && (
                        <>
                            <DialogHeader>
                                <div className="flex flex-col gap-4 mb-4">
                                    <div className="flex items-center gap-3 text-sm font-medium tracking-wide uppercase">
                                        <Badge variant="outline" className="bg-white/10 border-white/10 text-white hover:bg-white/20">
                                            {selectedPosition.Type__c || 'Full Time'}
                                        </Badge>
                                        <span className="text-gray-400">Hybrid - Cairo, Egypt</span>
                                    </div>
                                    <DialogTitle className="text-4xl font-bold text-white">
                                        {selectedPosition.Name}
                                    </DialogTitle>
                                </div>
                            </DialogHeader>

                            <div className="space-y-6 py-4">
                                {selectedPosition.Job_Description__c && (
                                    <div className="prose prose-invert max-w-none text-gray-300">
                                        <p className="text-lg leading-relaxed whitespace-pre-line">
                                            {selectedPosition.Job_Description__c}
                                        </p>
                                    </div>
                                )}

                                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-800">
                                    <div className="flex-1 space-y-2">
                                        {selectedPosition.Hire_By__c && (
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <Calendar className="h-4 w-4" style={{ color: primaryColor }} />
                                                <span>Application Deadline: {formatDate(selectedPosition.Hire_By__c)}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2 text-gray-400">
                                            <MapPin className="h-4 w-4" style={{ color: primaryColor }} />
                                            <span>Hybrid - Cairo, Egypt</span>
                                        </div>
                                    </div>

                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-shrink-0">
                                        <Button
                                            onClick={() => handleApply(selectedPosition.Formatted_Name__c)}
                                            className="w-full sm:w-auto px-8 py-6 rounded-full text-lg font-medium bg-white text-black hover:bg-gray-200 border-0"
                                            style={brandColor ? { backgroundColor: primaryColor, color: 'white' } : {}}
                                        >
                                            Apply Now
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </Button>
                                    </motion.div>
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Careers;
