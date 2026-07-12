
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState, lazy, Suspense } from "react";
import { HelmetProvider } from "react-helmet-async";
import Layout from "./components/Layout";
import StartupSequence from "./components/StartupSequence";
import PageLoader from "./components/PageLoader";
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Services = lazy(() => import("./pages/Services"));
const Clients = lazy(() => import("./pages/Clients"));
const Feedback = lazy(() => import("./pages/Feedback"));
const Contact = lazy(() => import("./pages/Contact"));
const Learn = lazy(() => import("./pages/Learn"));
const NotFound = lazy(() => import("./pages/NotFound"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const TarwtlLeadCapture = lazy(() => import("./pages/TarwtlLeadCapture"));
const TarwtlLeadSuccess = lazy(() => import("./pages/TarwtlLeadSuccess"));
const MemarLeadCapture = lazy(() => import("./pages/MemarLeadCapture"));
const MemarLeadSuccess = lazy(() => import("./pages/MemarLeadSuccess"));
const CityscapeStart = lazy(() => import("./pages/CityscapeStart"));
const CityscapeLeadCapture = lazy(() => import("./pages/CityscapeLeadCapture"));
const CityscapeLeadSuccess = lazy(() => import("./pages/CityscapeLeadSuccess"));
const SoueastLeadCapture = lazy(() => import("./pages/SoueastLeadCapture"));
const SoueastLeadSuccess = lazy(() => import("./pages/SoueastLeadSuccess"));
const SoueastComparison = lazy(() => import("./pages/SoueastComparison"));
const SalesforceApps = lazy(() => import("./pages/SalesforceApps"));
const SalesforcePower = lazy(() => import("./pages/SalesforcePower"));
const SalesforcePowerLeadCapture = lazy(() => import("./pages/SalesforcePowerLeadCapture"));
const SalesforcePowerSuccess = lazy(() => import("./pages/SalesforcePowerSuccess"));
const SalesforceComparisonTable = lazy(() => import("./pages/SalesforceComparisonTable"));
const CaptureIntelligence = lazy(() => import("./pages/CaptureIntelligence"));
const BlogDetail = lazy(() => import("./pages/BlogDetail"));
const Blogs = lazy(() => import("./pages/Blogs"));
const Merchandise = lazy(() => import("./pages/Merchandise"));
const ProjectTeam = lazy(() => import("./pages/ProjectTeam"));
const ProjectTeamAdmin = lazy(() => import("./pages/ProjectTeamAdmin"));
const ProjectTeamView = lazy(() => import("./pages/ProjectTeamView"));
const SalesVerticals = lazy(() => import("./pages/SalesVerticals"));
const Careers = lazy(() => import("./pages/Careers"));
const SalesVerticalDetail = lazy(() => import("./pages/SalesVerticalDetail"));
const Profile = lazy(() => import("./pages/Profile"));
const Certificate = lazy(() => import("./pages/Certificate"));
const VerifyCertificate = lazy(() => import("./pages/VerifyCertificate"));
const CustomerSurvey = lazy(() => import("./pages/CustomerSurvey"));
const LifeAtCloudastick = lazy(() => import("./pages/LifeAtCloudastick"));
import { LanguageProvider } from "./contexts/LanguageContext";
import { SalesforceProvider } from "./contexts/SalesforceContext";
import { PortalUserProvider } from "./contexts/PortalUserContext";

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App = () => {
  const [showStartup, setShowStartup] = useState(true);
  const [startupComplete, setStartupComplete] = useState(false);

  useEffect(() => {
    // Check if startup has been shown before (optional - you can remove this for always showing startup)
    const hasSeenStartup = localStorage.getItem('cloudastick-startup-seen');
    if (hasSeenStartup) {
      setShowStartup(false);
      setStartupComplete(true);
    }
  }, []);

  const handleStartupComplete = () => {
    setShowStartup(false);
    setStartupComplete(true);
    localStorage.setItem('cloudastick-startup-seen', 'true');
  };

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <LanguageProvider>
            <SalesforceProvider>
              <PortalUserProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <ScrollToTop />
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                    {/* Special routes for Tarwtl - no standard startup or layout */}
                    <Route path="/tarwtl" element={<TarwtlLeadCapture />} />
                    <Route path="/tarwtl-lead-capture" element={<TarwtlLeadCapture />} />
                    <Route path="/tarwtl-success" element={<TarwtlLeadSuccess />} />

                    {/* Special routes for Memar - no standard startup or layout */}
                    <Route path="/memar" element={<MemarLeadCapture />} />
                    <Route path="/memar-lead-capture" element={<MemarLeadCapture />} />
                    <Route path="/memar-success" element={<MemarLeadSuccess />} />

                    {/* Special routes for Cityscape - no standard startup or layout */}
                    <Route path="/cityscape" element={<CityscapeStart />} />
                    <Route path="/cityscape-start" element={<CityscapeStart />} />
                    <Route path="/cityscape-lead-capture" element={<CityscapeLeadCapture />} />
                    <Route path="/cityscape-success" element={<CityscapeLeadSuccess />} />

                    {/* Special routes for Soueast - no standard startup or layout */}
                    <Route path="/soueast" element={<SoueastLeadCapture />} />
                    <Route path="/soueast-lead-capture" element={<SoueastLeadCapture />} />
                    <Route path="/soueast-success" element={<SoueastLeadSuccess />} />
                    <Route path="/soueast-comparison" element={<SoueastComparison />} />

                    {/* Special route for Project Team - no standard startup or layout */}
                    <Route path="/project-team" element={<ProjectTeam />} />

                    {/* Special route for Project Team Admin - no standard startup or layout */}
                    <Route path="/project-team-admin" element={<ProjectTeamAdmin />} />

                    {/* Special route for Project Team View (shareable customer page) - no standard startup or layout */}
                    <Route path="/project-team-view" element={<ProjectTeamView />} />

                    {/* Special route for Customer Session Feedback Survey - no startup or layout */}
                    <Route path="/survey" element={<CustomerSurvey />} />

                    {/* Special routes for Sales Portal - no standard startup or layout */}
                    <Route path="/sales" element={<SalesVerticals />} />
                    <Route path="/sales/vertical/:id" element={<SalesVerticalDetail />} />

                    {/* Standard routes with startup sequence and layout */}
                    <Route path="/*" element={
                      <>
                        {showStartup && <StartupSequence onComplete={handleStartupComplete} />}
                        {startupComplete && (
                          <Layout>
                            <Routes>
                              <Route path="/" element={<Home />} />
                              <Route path="/about" element={<About />} />
                              <Route path="/services" element={<Services />} />
                              <Route path="/clients" element={<Clients />} />
                              <Route path="/feedback" element={<Feedback />} />
                              <Route path="/contact" element={<Contact />} />
                              <Route path="/learn" element={<Learn />} />
                              <Route path="/forgot-password" element={<ForgotPassword />} />
                              <Route path="/reset-password" element={<ResetPassword />} />
                              <Route path="/profile" element={<Profile />} />
                              <Route path="/certificate/:id" element={<Certificate />} />
                              <Route path="/verify-certificate" element={<VerifyCertificate />} />
                              <Route path="/merchandise" element={<Merchandise />} />
                              <Route path="/salesforce-apps" element={<SalesforceApps />} />
                              <Route path="/salesforce-power" element={<SalesforcePower />} />
                              <Route path="/salesforce-power-lead-capture" element={<SalesforcePowerLeadCapture />} />
                              <Route path="/salesforce-power-success" element={<SalesforcePowerSuccess />} />
                              <Route path="/salesforce-comparison" element={<SalesforceComparisonTable />} />
                              <Route path="/careers" element={<Careers />} />
                              <Route path="/intelligence-capture" element={<CaptureIntelligence />} />
                              <Route path="/blogs" element={<Blogs />} />
                              <Route path="/blog/:slug" element={<BlogDetail />} />
                              <Route path="/life" element={<LifeAtCloudastick />} />
                              <Route path="*" element={<NotFound />} />
                            </Routes>
                          </Layout>
                        )}
                      </>
                    } />
                    </Routes>
                  </Suspense>
                </BrowserRouter>
              </PortalUserProvider>
            </SalesforceProvider>
          </LanguageProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
