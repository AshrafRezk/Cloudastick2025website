
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
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
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Special routes for Tarwtl - no standard startup or layout */}
            <Route path="/tarwtl" element={<TarwtlLeadCapture />} />
            <Route path="/tarwtl-lead-capture" element={<TarwtlLeadCapture />} />
            <Route path="/tarwtl-success" element={<TarwtlLeadSuccess />} />
            
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
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Layout>
                )}
              </>
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
