
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { HelmetProvider } from "react-helmet-async";
import Layout from "./components/Layout";
import StartupSequence from "./components/StartupSequence";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Clients from "./pages/Clients";
import Feedback from "./pages/Feedback";
import Contact from "./pages/Contact";
import Learn from "./pages/Learn";
import NotFound from "./pages/NotFound";
import TarwtlLeadCapture from "./pages/TarwtlLeadCapture";
import TarwtlLeadSuccess from "./pages/TarwtlLeadSuccess";
import MemarLeadCapture from "./pages/MemarLeadCapture";
import MemarLeadSuccess from "./pages/MemarLeadSuccess";
import CityscapeStart from "./pages/CityscapeStart";
import CityscapeLeadCapture from "./pages/CityscapeLeadCapture";
import CityscapeLeadSuccess from "./pages/CityscapeLeadSuccess";
import SoueastLeadCapture from "./pages/SoueastLeadCapture";
import SoueastLeadSuccess from "./pages/SoueastLeadSuccess";
import SoueastComparison from "./pages/SoueastComparison";
import SalesforceApps from "./pages/SalesforceApps";
import SalesforcePower from "./pages/SalesforcePower";
import SalesforcePowerLeadCapture from "./pages/SalesforcePowerLeadCapture";
import SalesforcePowerSuccess from "./pages/SalesforcePowerSuccess";
import SalesforceComparisonTable from "./pages/SalesforceComparisonTable";
import CaptureIntelligence from "./pages/CaptureIntelligence";
import BlogDetail from "./pages/BlogDetail";
import Blogs from "./pages/Blogs";
import Merchandise from "./pages/Merchandise";
import ProjectTeam from "./pages/ProjectTeam";
import ProjectTeamAdmin from "./pages/ProjectTeamAdmin";
import ProjectTeamView from "./pages/ProjectTeamView";
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
                      <Route path="/merchandise" element={<Merchandise />} />
                      <Route path="/salesforce-apps" element={<SalesforceApps />} />
                          <Route path="/salesforce-power" element={<SalesforcePower />} />
                          <Route path="/salesforce-power-lead-capture" element={<SalesforcePowerLeadCapture />} />
                          <Route path="/salesforce-power-success" element={<SalesforcePowerSuccess />} />
                          <Route path="/salesforce-comparison" element={<SalesforceComparisonTable />} />
                      <Route path="/intelligence-capture" element={<CaptureIntelligence />} />
                      <Route path="/blogs" element={<Blogs />} />
                      <Route path="/blog/:slug" element={<BlogDetail />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Layout>
                )}
              </>
            } />
          </Routes>
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
