import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Building2,
    MapPin,
    Briefcase,
    Clock,
    DollarSign,
    ArrowRight,
    Search,
    Loader2,
    Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
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
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            {/* Header */}
            <div className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            {companyLogo ? (
                                <img
                                    src={companyLogo}
                                    alt="Company Logo"
                                    className="h-10 w-auto object-contain bg-white/10 rounded-lg p-1"
                                />
                            ) : (
                                <div className="bg-white/10 p-2 rounded-lg" style={{ color: primaryColor }}>
                                    <Building2 className="h-6 w-6" />
                                </div>
                            )}
                            <div>
                                <h1 className="text-2xl font-bold text-white">Career Opportunities</h1>
                                <p className="text-sm text-gray-400">Join our growing team</p>
                            </div>
                        </div>

                        {/* Search Bar (Desktop) */}
                        <div className="hidden md:block w-96 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                type="text"
                                placeholder="Search positions..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 bg-gray-900/50 border-gray-600 text-white placeholder-gray-500 focus:ring-opacity-50"
                                style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Mobile Search */}
                <div className="md:hidden mb-8">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            type="text"
                            placeholder="Search positions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 bg-gray-800/50 border-gray-600 text-white placeholder-gray-500"
                        />
                    </div>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="h-12 w-12 animate-spin mb-4" style={{ color: primaryColor }} />
                        <p className="text-gray-400">Loading open positions...</p>
                    </div>
                ) : filteredPositions.length === 0 ? (
                    <div className="text-center py-20 bg-gray-800/30 rounded-2xl border border-gray-700 border-dashed">
                        <Briefcase className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-300 mb-2">
                            {searchTerm ? 'No positions found' : 'No open positions'}
                        </h3>
                        <p className="text-gray-500">
                            {searchTerm
                                ? 'Try adjusting your search terms'
                                : 'Check back later for new opportunities'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {filteredPositions.map((position, index) => (
                            <motion.div
                                key={position.Id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Card className="bg-gray-800/40 backdrop-blur-sm border-gray-700 hover:border-gray-600 hover:bg-gray-800/60 transition-all group overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1 h-full transition-colors duration-300"
                                        style={{ backgroundColor: primaryColor, opacity: 0.7 }} />

                                    <CardContent className="p-6">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between mb-2">
                                                    <h2 className="text-xl font-bold text-white group-hover:text-blue-200 transition-colors">
                                                        {position.Name}
                                                    </h2>
                                                    <Badge variant="outline" className="border-gray-600 text-gray-300 bg-gray-900/50">
                                                        {position.Type__c || 'Full Time'}
                                                    </Badge>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4">
                                                    {position.Location__c && (
                                                        <div className="flex items-center gap-1.5">
                                                            <MapPin className="h-4 w-4" style={{ color: primaryColor }} />
                                                            {position.Location__c}
                                                        </div>
                                                    )}
                                                    {position.Hire_By__c && (
                                                        <div className="flex items-center gap-1.5">
                                                            <Calendar className="h-4 w-4" style={{ color: primaryColor }} />
                                                            Apply by: {formatDate(position.Hire_By__c)}
                                                        </div>
                                                    )}
                                                    {(position.Min_Pay__c || position.Max_Pay__c) && (
                                                        <div className="flex items-center gap-1.5">
                                                            <DollarSign className="h-4 w-4" style={{ color: primaryColor }} />
                                                            {position.Min_Pay__c && position.Max_Pay__c
                                                                ? `${position.Min_Pay__c.toLocaleString()} - ${position.Max_Pay__c.toLocaleString()}`
                                                                : (position.Min_Pay__c ? `From ${position.Min_Pay__c.toLocaleString()}` : `Up to ${position.Max_Pay__c?.toLocaleString()}`)
                                                            }
                                                        </div>
                                                    )}
                                                </div>

                                                {position.Job_Description__c && (
                                                    <div className="text-gray-400 line-clamp-2 text-sm mb-4">
                                                        {position.Job_Description__c}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-shrink-0">
                                                <Button
                                                    onClick={() => handleApply(position.Formatted_Name__c)}
                                                    className="w-full md:w-auto text-white border-0 hover:opacity-90 transition-opacity"
                                                    style={{ backgroundColor: primaryColor }}
                                                >
                                                    View Details
                                                    <ArrowRight className="ml-2 h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Careers;
