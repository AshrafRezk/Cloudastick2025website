import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { usePortalUser } from "../contexts/PortalUserContext";
import PortalLogin from "../components/PortalLogin";
import PortalProfile from "../components/PortalProfile";
import LearningMaterialsList from "../components/LearningMaterialsList";
import CompletedBadges from "../components/CompletedBadges";
import MaterialViewer from "../components/MaterialViewer";
import { LearningMaterialInstance } from "../services/learningService";

const Learn = () => {
  const { t } = useLanguage();
  const { user } = usePortalUser();
  const [selectedMaterial, setSelectedMaterial] = useState<LearningMaterialInstance | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  // If user is not logged in, show login form
  if (!user) {
    return <PortalLogin />;
  }

  const handleMaterialClick = (instance: LearningMaterialInstance) => {
    setSelectedMaterial(instance);
    setIsViewerOpen(true);
  };

  const handleCloseViewer = () => {
    setIsViewerOpen(false);
    setSelectedMaterial(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Section */}
        <div className="mb-8">
          <PortalProfile />
        </div>

        {/* Completed Badges Section */}
        <div className="mb-8">
          <CompletedBadges />
        </div>

        {/* Learning Materials Section */}
        <div className="mb-8">
          <LearningMaterialsList onMaterialClick={handleMaterialClick} />
        </div>
      </div>

      {/* Material Viewer */}
      <MaterialViewer
        instance={selectedMaterial}
        isOpen={isViewerOpen}
        onClose={handleCloseViewer}
      />
    </div>
  );
};

export default Learn;
