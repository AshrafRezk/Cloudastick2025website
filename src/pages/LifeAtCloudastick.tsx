import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Heart,
    Users,
    Globe,
    Target,
    Zap,
    BookOpen,
    Briefcase,
    MessageCircle,
    Award,
    CheckCircle2,
    ArrowRight,
    MapPin,
    Star,
    Code,
    PhoneCall,
    Kanban,
    Clock,
    Eye,
    Shield
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { useLanguage } from '../contexts/LanguageContext';

const tabs = [
    { id: 'culture', label: 'Culture' },
    { id: 'teams', label: 'Teams' },
    { id: 'how-we-hire', label: 'How We Hire' },
    { id: 'academy', label: 'Academy' },
];

const LifeAtCloudastick = () => {
    const [activeTab, setActiveTab] = useState('culture');

    return (
        <div className="min-h-screen bg-black text-white selection:bg-cyan-500/30 pb-24">
            {/* Header Hero */}
            <div className="relative overflow-hidden mb-12">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-cyan-900/20 to-transparent opacity-50 pointer-events-none" />
                <div className="absolute top-0 inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent opacity-40" />

                <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-20 pb-16 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-8"
                    >
                        <Heart className="h-4 w-4" />
                        <span className="text-sm font-medium tracking-wide uppercase">Life at Cloudastick</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-cyan-500"
                    >
                        Build Your Future With Us
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-xl text-gray-400 leading-relaxed font-light max-w-3xl mx-auto"
                    >
                        We are a community of trailblazers, innovators, and creators. Discover our culture, how we find talent, and our comprehensive academy designed to launch your career.
                    </motion.p>
                </div>
            </div>

            {/* Sub-tabs Navigation */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-16">
                <div className="flex justify-center">
                    <div className="inline-flex bg-white/5 p-1 rounded-full border border-white/10 backdrop-blur-md">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`relative px-6 py-3 rounded-full text-sm sm:text-base font-medium transition-all duration-300 ${
                                    activeTab === tab.id
                                        ? 'text-black'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="activeTabLife"
                                        className="absolute inset-0 bg-cyan-400 rounded-full"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    />
                                )}
                                <span className="relative z-10">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                    >
                        {activeTab === 'culture' && <CultureSection />}
                        {activeTab === 'teams' && <TeamsSection />}
                        {activeTab === 'how-we-hire' && <HowWeHireSection />}
                        {activeTab === 'academy' && <AcademySection />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

const CultureSection = () => {
    const { t } = useLanguage();

    const values = [
        { icon: Heart, title: t('about.values.reverence'), desc: t('about.values.reverence.desc') },
        { icon: Zap, title: t('about.values.efficiency'), desc: t('about.values.efficiency.desc') },
        { icon: Users, title: t('about.values.inclusion'), desc: t('about.values.inclusion.desc') },
        { icon: Eye, title: t('about.values.transparency'), desc: t('about.values.transparency.desc') },
        { icon: Shield, title: t('about.values.consistency'), desc: t('about.values.consistency.desc') },
    ];

    return (
        <div className="space-y-24">
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Our Ohana, Our Family</h2>
                    <p className="text-gray-400 text-lg leading-relaxed mb-6">
                        At Cloudastick, culture isn't just a buzzword—it's the operating system of our company. 
                        We believe that when our employees are happy, supported, and challenged, they do their best work.
                    </p>
                    <p className="text-gray-400 text-lg leading-relaxed mb-8">
                        We foster an environment of continuous learning, deep collaboration, and unwavering support. 
                        Whether we are working remotely or celebrating in the office, we are united by shared values.
                    </p>
                    <Button 
                        onClick={() => window.open('https://www.cloudastick.com/careers', '_blank')}
                        className="bg-cyan-500 hover:bg-cyan-600 text-black px-8 py-6 rounded-full text-lg"
                    >
                        Explore Open Roles <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop" alt="Team collaborating" className="rounded-2xl h-64 object-cover w-full" />
                    <img src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&auto=format&fit=crop" alt="Office meeting" className="rounded-2xl h-64 object-cover w-full mt-8" />
                </div>
            </div>

            <div>
                <h3 className="text-2xl md:text-4xl font-bold mb-12 text-center text-white">Our Core Values</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {values.map((val, i) => (
                        <Card key={i} className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                            <CardContent className="p-8">
                                <div className="bg-cyan-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                                    <val.icon className="h-7 w-7 text-cyan-400" />
                                </div>
                                <h4 className="text-xl font-semibold mb-3 text-white">{val.title}</h4>
                                <p className="text-gray-400 leading-relaxed">{val.desc}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

const HowWeHireSection = () => {
    const steps = [
        { icon: MessageCircle, title: 'Screening', desc: 'An initial conversation with our recruiting team to learn about your background, goals, and alignment with our values.' },
        { icon: Zap, title: 'Use Case Implementation', desc: 'Show us what you can do! You will be given a real-world use case and have 5 days to implement your solution.', highlight: '5 days' },
        { icon: Code, title: 'Technical Interview', desc: 'A deep dive into your technical skills, problem-solving approach, and the thought process behind your use case implementation.' },
        { icon: Users, title: 'Final Interview', desc: 'Meet with leadership and key team members to ensure mutual fit and discuss your future at Cloudastick.' },
        { icon: Award, title: 'Acceptance / Next Steps', desc: 'Welcome aboard! We will discuss your offer and outline the onboarding process to set you up for success.' },
    ];

    return (
        <div className="space-y-24">
            <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">A Transparent Process</h2>
                <p className="text-gray-400 text-lg leading-relaxed">
                    We want you to shine. Our hiring process is designed to be a two-way street—a mutual exploration 
                    to ensure we are the right fit for your career trajectory.
                </p>
            </div>

            <div className="relative max-w-4xl mx-auto">
                {/* Connecting Line */}
                <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/50 via-cyan-500/20 to-transparent -translate-x-1/2" />
                
                <div className="space-y-12">
                    {steps.map((step, i) => (
                        <div key={i} className={`flex flex-col md:flex-row items-center gap-8 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                            <div className="md:w-1/2 flex justify-center md:justify-start">
                                {i % 2 === 0 ? <div className="hidden md:block w-full" /> : 
                                <Card className="bg-white/5 border-white/10 w-full hover:border-cyan-500/50 transition-colors">
                                    <CardContent className="p-8">
                                        <h4 className="text-xl font-bold text-white mb-2">{step.title}</h4>
                                        <p className="text-gray-400 mb-3">{step.desc}</p>
                                        {step.highlight && (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-sm font-medium border border-yellow-500/20">
                                                <Clock className="h-4 w-4" />
                                                {step.highlight}
                                            </span>
                                        )}
                                    </CardContent>
                                </Card>}
                            </div>

                            <div className="relative z-10 flex items-center justify-center w-16 h-16 rounded-full bg-gray-900 border-4 border-black shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                                <div className="bg-cyan-500 w-full h-full rounded-full flex items-center justify-center">
                                    <step.icon className="h-6 w-6 text-black" />
                                </div>
                            </div>

                            <div className="md:w-1/2 flex justify-center md:justify-start w-full">
                                {i % 2 !== 0 ? <div className="hidden md:block w-full" /> : 
                                <Card className="bg-white/5 border-white/10 w-full hover:border-cyan-500/50 transition-colors">
                                    <CardContent className="p-8">
                                        <h4 className="text-xl font-bold text-white mb-2">{step.title}</h4>
                                        <p className="text-gray-400 mb-3">{step.desc}</p>
                                        {step.highlight && (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-sm font-medium border border-yellow-500/20">
                                                <Clock className="h-4 w-4" />
                                                {step.highlight}
                                            </span>
                                        )}
                                    </CardContent>
                                </Card>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const AcademySection = () => {
    const timeline = [
        {
            month: 'Month 1',
            title: 'Learn the Basics',
            desc: 'Start your journey by mastering the foundational skills, tools, and methodologies we use every day.',
            icon: BookOpen,
        },
        {
            month: 'Month 2',
            title: 'Take Tasks & Shadow',
            desc: 'Apply your knowledge. Begin working on real tasks under the guidance and mentorship of senior team members.',
            icon: Users,
        },
        {
            month: 'Month 3',
            title: 'Customer Interfacing',
            desc: 'Step up to the plate. Start interacting directly with customers, understanding their needs, and delivering solutions.',
            icon: MessageCircle,
        },
        {
            month: 'Month 4',
            title: 'Assessment & Placement',
            desc: 'Undergo a comprehensive assessment. We will profile match your developed skills with the perfect role inside the company or with a partner.',
            icon: Star,
        }
    ];

    return (
        <div className="space-y-16">
            <div className="text-center max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 mb-6">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm font-medium tracking-wide uppercase">The Cloudastick Trail</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Cloudastick Academy</h2>
                <p className="text-gray-400 text-lg leading-relaxed">
                    Our 3-month intense training program followed by a placement assessment. 
                    We don't just hire talent—we build it. Embark on a guided trail to forge your tech career.
                </p>
            </div>

            {/* Trail visualization inspired by Trailhead */}
            <div className="relative py-12">
                {/* Winding Trail SVG background */}
                <div className="absolute inset-0 pointer-events-none hidden lg:block">
                    <svg width="100%" height="100%" viewBox="0 0 1200 400" preserveAspectRatio="none">
                        <path 
                            d="M 100 200 C 300 200, 300 100, 500 100 C 700 100, 700 300, 900 300 C 1100 300, 1100 200, 1200 200" 
                            fill="none" 
                            stroke="rgba(6, 182, 212, 0.2)" 
                            strokeWidth="8" 
                            strokeDasharray="10 10" 
                        />
                    </svg>
                </div>

                <div className="grid lg:grid-cols-4 gap-8 relative z-10">
                    {timeline.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.15 }}
                            className={`flex flex-col ${i % 2 !== 0 ? 'lg:mt-32' : 'lg:-mt-12'}`}
                        >
                            <Card className="bg-gradient-to-b from-gray-900 to-black border-gray-800 hover:border-cyan-500/50 transition-colors h-full">
                                <CardContent className="p-8 flex flex-col h-full">
                                    <div className="flex items-center justify-between mb-6">
                                        <span className="text-cyan-400 font-bold uppercase tracking-wider text-sm">{step.month}</span>
                                        <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
                                            <step.icon className="h-6 w-6 text-cyan-400" />
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                                    <p className="text-gray-400 leading-relaxed flex-grow">{step.desc}</p>
                                    
                                    <div className="mt-8 flex items-center text-sm font-medium text-gray-500">
                                        <CheckCircle2 className="h-4 w-4 mr-2 text-cyan-500/50" />
                                        Milestone
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-12">
                <Button 
                    onClick={() => window.open('https://wa.me/201282001662?text=Hi%20Mariam%2C%20I%20would%20like%20to%20join%20the%20Cloudastick%20Academy%20waitlist!', '_blank')}
                    className="bg-white/10 text-white border border-white/20 hover:bg-white/20 px-8 py-6 rounded-full text-lg transition-colors"
                >
                    Join Waitlist on WhatsApp
                </Button>
                <Button 
                    onClick={() => window.open('https://www.cloudastick.com/CareerDetails/cloudastick_academy_associate', '_blank')}
                    className="bg-cyan-500 text-black hover:bg-cyan-600 px-8 py-6 rounded-full text-lg shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-all"
                >
                    Apply Now
                </Button>
            </div>
        </div>
    );
};

const TeamsSection = () => {
    const teams = [
        {
            title: 'Salesforce Consultants',
            desc: 'Our strategic advisors who partner with clients to understand their business challenges and design tailored Salesforce solutions that drive growth and efficiency.',
            icon: Target,
            image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop'
        },
        {
            title: 'Salesforce Project Managers',
            desc: 'The maestros of execution. They orchestrate complex implementations, ensuring projects are delivered on time, within scope, and above expectations.',
            icon: Kanban,
            image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&auto=format&fit=crop'
        },
        {
            title: 'Salesforce Developers',
            desc: 'The architects of innovation. Our developers write clean, scalable code to build custom applications and integrations that push the boundaries of the Salesforce platform.',
            icon: Code,
            image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop'
        },
        {
            title: 'Salesforce BDRs & SDRs',
            desc: 'The frontline of our growth. Business and Sales Development Representatives are master communicators who identify opportunities and build the foundation for lasting client relationships.',
            icon: PhoneCall,
            image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&auto=format&fit=crop'
        }
    ];

    return (
        <div className="space-y-16">
            <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Meet Our Teams</h2>
                <p className="text-gray-400 text-lg leading-relaxed">
                    We are a collective of specialized experts. Find your tribe and discover where your skills can make the biggest impact at Cloudastick.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {teams.map((team, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Card className="bg-white/5 border-white/10 hover:border-cyan-500/50 hover:bg-white/10 transition-all overflow-hidden group h-full">
                            <div className="h-48 overflow-hidden relative">
                                <div className="absolute inset-0 bg-cyan-900/40 mix-blend-multiply z-10 group-hover:bg-transparent transition-colors duration-500" />
                                <img 
                                    src={team.image} 
                                    alt={team.title} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                                />
                            </div>
                            <CardContent className="p-8">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-lg bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20">
                                        <team.icon className="h-6 w-6 text-cyan-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white">{team.title}</h3>
                                </div>
                                <p className="text-gray-400 leading-relaxed">
                                    {team.desc}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
            
            <div className="text-center pt-8">
                <Button 
                    onClick={() => window.open('https://www.cloudastick.com/careers', '_blank')}
                    className="bg-cyan-500 hover:bg-cyan-600 text-black px-8 py-6 rounded-full text-lg"
                >
                    View Open Roles Across Teams <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
            </div>
        </div>
    );
};

export default LifeAtCloudastick;
