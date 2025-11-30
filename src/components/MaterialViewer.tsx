import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Clock, Play, Pause, FileText, Video as VideoIcon, Save } from 'lucide-react';
import { usePortalUser } from '../contexts/PortalUserContext';
import { LearningMaterialInstance } from '../services/learningService';
import Button from './Button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Slider } from './ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface MaterialViewerProps {
  instance: LearningMaterialInstance | null;
  isOpen: boolean;
  onClose: () => void;
}

const MaterialViewer = ({ instance, isOpen, onClose }: MaterialViewerProps) => {
  const { updateProgress, user } = usePortalUser();
  const [progress, setProgress] = useState(0);
  const [manualProgress, setManualProgress] = useState([0]);
  const [isTracking, setIsTracking] = useState(false);
  const [viewingTime, setViewingTime] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const material = instance?.material;

  // Initialize progress from instance
  useEffect(() => {
    if (instance) {
      setProgress(instance.progress);
      setManualProgress([instance.progress]);
      setIsCompleted(instance.status === 'Completed');
      setViewingTime(0);
    }
  }, [instance]);

  // Start tracking when viewer opens
  useEffect(() => {
    if (isOpen && instance && !isCompleted && instance.id) {
      startTracking();
      return () => {
        stopTracking();
      };
    }
  }, [isOpen, instance, isCompleted]);

  const startTracking = () => {
    if (isTracking || !material || isCompleted || !instance?.id) return;

    setIsTracking(true);
    startTimeRef.current = Date.now();

    // Update progress every 10 seconds based on viewing time
    intervalRef.current = setInterval(() => {
      if (!material || !startTimeRef.current) return;

      const elapsed = (Date.now() - startTimeRef.current) / 1000 / 60; // minutes
      setViewingTime(elapsed);

      // Calculate progress based on duration
      if (material.duration > 0 && instance?.id) {
        const newProgress = Math.min(100, Math.round((elapsed / material.duration) * 100));
        if (newProgress > progress) {
          setProgress(newProgress);
          updateProgressAsync(newProgress, 'In Progress');
        }
      }
    }, 10000); // Update every 10 seconds
  };

  const stopTracking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsTracking(false);
  };

  const updateProgressAsync = async (
    newProgress: number,
    status: 'Not Started' | 'In Progress' | 'Completed'
  ) => {
    if (!instance || !instance.id || isUpdating) return;

    try {
      setIsUpdating(true);
      await updateProgress({
        instanceId: instance.id,
        progress: newProgress,
        status,
        startedOn: instance.startedOn || new Date().toISOString(),
      });
    } catch (error) {
      console.error('Failed to update progress:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateProgress = async (newProgress: number) => {
    if (!instance || !instance.id || isUpdating) return;

    const progressValue = Math.min(100, Math.max(0, newProgress));
    const newStatus = progressValue === 100 ? 'Completed' : progressValue > 0 ? 'In Progress' : 'Not Started';

    try {
      setIsUpdating(true);
      stopTracking();
      await updateProgress({
        instanceId: instance.id,
        progress: progressValue,
        status: newStatus,
        startedOn: instance.startedOn || new Date().toISOString(),
        completedOn: progressValue === 100 ? new Date().toISOString() : undefined,
      });
      setProgress(progressValue);
      setManualProgress([progressValue]);
      if (progressValue === 100) {
        setIsCompleted(true);
      }
    } catch (error) {
      console.error('Failed to update progress:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleMarkComplete = async () => {
    await handleUpdateProgress(100);
  };

  const handleSaveManualProgress = async () => {
    await handleUpdateProgress(manualProgress[0]);
  };

  const handleStartMaterial = async () => {
    if (!instance || !material || !user) return;

    // If no instance exists, create one
    if (!instance.id && material.id) {
      try {
        setIsUpdating(true);
        await updateProgress({
          contactId: user.id,
          learningMaterialId: material.id,
          progress: 0,
          status: 'In Progress',
          startedOn: new Date().toISOString(),
        });
        // Close viewer to allow refresh - user can reopen to see updated instance
        onClose();
      } catch (error) {
        console.error('Failed to start material:', error);
      } finally {
        setIsUpdating(false);
      }
    } else if (instance.id) {
      // Update existing instance
      await updateProgressAsync(0, 'In Progress');
      startTracking();
    }
  };

  if (!material || !instance) {
    return null;
  }

  const isPDF = material.materialType === 'PDF';
  const isVideo = material.materialType === 'Video';
  const materialUrl = material.materialUrl;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-2xl mb-2">{material.title}</DialogTitle>
          {material.description && (
            <p className="text-sm text-muted-foreground mb-3">{material.description}</p>
          )}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {material.category && (
              <span className="px-2 py-1 bg-muted rounded">{material.category}</span>
            )}
            {material.duration > 0 && (
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {material.duration} min
              </span>
            )}
            {viewingTime > 0 && (
              <span className="flex items-center gap-1">
                <Play className="w-3 h-3" />
                {Math.round(viewingTime)} min viewed
              </span>
            )}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-auto px-6 py-4">
          {/* Progress Bar */}
          <div className="mb-4 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Manual Progress Control */}
            {instance.id && !isCompleted && (
              <div className="space-y-3 p-4 bg-muted/30 rounded-lg border border-border">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground font-medium">Update Progress Manually</span>
                  <span className="text-muted-foreground">{manualProgress[0]}%</span>
                </div>
                <Slider
                  value={manualProgress}
                  onValueChange={setManualProgress}
                  max={100}
                  min={0}
                  step={1}
                  className="w-full"
                />
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSaveManualProgress}
                    disabled={isUpdating || manualProgress[0] === progress}
                    className="flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {isUpdating ? 'Saving...' : 'Save Progress'}
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    Set your progress from 0% to 100%
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Material Content */}
          <div className="bg-muted/30 rounded-lg overflow-hidden mb-4">
            {!materialUrl ? (
              <div className="p-12 text-center text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-4" />
                <p>No material URL provided</p>
              </div>
            ) : isPDF ? (
              <iframe
                src={materialUrl}
                className="w-full h-[600px] border-0"
                title={material.title}
              />
            ) : isVideo ? (
              <div className="w-full">
                {materialUrl.includes('youtube.com') || materialUrl.includes('youtu.be') ? (
                  <div className="aspect-video">
                    <iframe
                      src={materialUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={material.title}
                    />
                  </div>
                ) : (
                  <video
                    src={materialUrl}
                    controls
                    className="w-full"
                    onPlay={() => !isTracking && startTracking()}
                    onPause={() => stopTracking()}
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>
            ) : (
              <div className="p-12 text-center">
                <p className="text-muted-foreground mb-4">Material type: {material.materialType}</p>
                <a
                  href={materialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-primary hover:underline"
                >
                  Open Material
                </a>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-4">
            {!instance.id || instance.status === 'Not Started' ? (
              <Button
                variant="primary"
                onClick={handleStartMaterial}
                disabled={isUpdating}
                className="flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Start Learning
              </Button>
            ) : !isCompleted ? (
              <Button
                variant="primary"
                onClick={handleMarkComplete}
                disabled={isUpdating || isCompleted}
                className="flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                {isUpdating ? 'Marking...' : 'Mark as Complete'}
              </Button>
            ) : (
              <div className="flex items-center gap-2 text-green-500">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-medium">Completed</span>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MaterialViewer;

