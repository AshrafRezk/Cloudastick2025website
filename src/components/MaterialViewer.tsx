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
import QuizViewer from './QuizViewer';

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
  const youtubeIframeRef = useRef<HTMLIFrameElement>(null);

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
    
    // Do not run time-based tracking for Quizzes (they have their own completion logic)
    if (material.materialType === 'Quiz') return;

    setIsTracking(true);
    startTimeRef.current = Date.now();

    // Update visual progress every 10 seconds, but do NOT spam Salesforce API
    intervalRef.current = setInterval(() => {
      if (!material || !startTimeRef.current) return;

      const elapsed = (Date.now() - startTimeRef.current) / 1000 / 60; // minutes
      setViewingTime(elapsed);

      // Calculate progress based on duration
      if (material.duration > 0 && instance?.id) {
        const newProgress = Math.min(100, Math.round((elapsed / material.duration) * 100));
        if (newProgress > progress) {
          setProgress(newProgress);
          // Removed updateProgressAsync to prevent Salesforce API spam / background refreshing
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
    if (!instance || isUpdating) return;

    try {
      setIsUpdating(true);
      const isCompositeId = typeof instance.id === 'string' && instance.id.includes('-') && instance.id.length > 18;
      
      const payload: any = {
        progress: newProgress,
        status,
        startedOn: instance.startedOn || new Date().toISOString(),
      };
      
      if (isCompositeId || !instance.id) {
        if (!user || !material) return;
        payload.contactId = user.id;
        payload.learningMaterialId = material.id;
      } else {
        payload.instanceId = instance.id;
      }

      await updateProgress(payload);
    } catch (error) {
      console.error('Failed to update progress:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateProgress = async (newProgress: number) => {
    if (!instance || isUpdating) return;

    // Check if instance.id is a composite ID (contains hyphen and looks like two IDs)
    // Composite IDs indicate child materials - we need to create instances for these
    const isCompositeId = instance.id && instance.id.includes('-') && instance.id.length > 18;
    
    // If it's a composite ID or no instance ID, create a new instance
    if (isCompositeId || !instance.id) {
      if (!material || !user) {
        console.error('Cannot create instance: missing material or user');
        return;
      }
      
      try {
        setIsUpdating(true);
        stopTracking();
        const progressValue = Math.min(100, Math.max(0, newProgress));
        const newStatus = progressValue === 100 ? 'Completed' : progressValue > 0 ? 'In Progress' : 'Not Started';
        
        console.log('Creating new Learning Material Instance for material:', material.id);
        const result = await updateProgress({
          contactId: user.id,
          learningMaterialId: material.id,
          progress: progressValue,
          status: newStatus,
          startedOn: instance.startedOn || new Date().toISOString(),
          completedOn: progressValue === 100 ? new Date().toISOString() : undefined,
        });
        
        console.log('Instance created successfully:', result);
        setProgress(progressValue);
        setManualProgress([progressValue]);
        if (progressValue === 100) {
          setIsCompleted(true);
        }
        // Close viewer to allow refresh - user can reopen to see updated instance
        onClose();
      } catch (error) {
        console.error('Failed to create/update progress:', error);
      } finally {
        setIsUpdating(false);
      }
      return;
    }

    // Normal update for existing instance with valid Salesforce ID
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
    // Allow creating instances for child materials (composite IDs) or materials without instances
    await handleUpdateProgress(manualProgress[0]);
  };

  const handleStartMaterial = async () => {
    if (!instance || !material || !user) return;

    const isCompositeId = typeof instance.id === 'string' && instance.id.includes('-') && instance.id.length > 18;

    // If no instance exists or it's a composite ID, create one
    if (isCompositeId || !instance.id) {
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
    } else {
      // Update existing instance
      await updateProgressAsync(0, 'In Progress');
      startTracking();
    }
  };

  const handleAutoStart = () => {
    const isCompositeId = typeof instance?.id === 'string' && instance.id.includes('-');
    if ((!instance?.id || instance.status === 'Not Started' || isCompositeId) && !isUpdating && !isCompleted) {
      updateProgressAsync(0, 'In Progress').then(() => {
        if (!isTracking) startTracking();
      });
    }
  };

  // YouTube progress tracking via postMessage
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Ensure the message is from YouTube
      if (typeof event.origin === 'string' && !event.origin.includes('youtube.com')) return;
      
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (data.event === 'infoDelivery' && data.info) {
          // PlayerState: 0 = ended, 1 = playing, 2 = paused
          if (data.info.playerState === 0) {
            if (!isCompleted && !isUpdating) {
               console.log("YouTube video ended automatically marking complete.");
               handleUpdateProgress(100);
            }
          } else if (data.info.playerState === 1) {
            if (!isTracking) startTracking();
          } else if (data.info.playerState === 2) {
            stopTracking();
          }
        }
      } catch (e) {
        // ignore parse errors
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isCompleted, isUpdating, isTracking]);

  const handleYoutubeLoad = () => {
    if (youtubeIframeRef.current?.contentWindow) {
      youtubeIframeRef.current.contentWindow.postMessage(JSON.stringify({ event: 'listening' }), '*');
    }
  };

  if (!material || !instance) {
    return null;
  }

  const isPDF = material.materialType === 'PDF';
  const isVideo = material.materialType === 'Video' || material.materialType === 'Audio';
  const isQuiz = material.materialType === 'Quiz';
  const materialUrl = material.materialUrl;

  // Route to QuizViewer for quiz materials
  if (isQuiz) {
    return <QuizViewer instance={instance} isOpen={isOpen} onClose={onClose} />;
  }

  // Convert Google Drive sharing link to embeddable preview link
  const getEmbeddableUrl = (url: string | null): string | null => {
    if (!url) return null;
    
    // Check if it's already a preview link
    if (url.includes('drive.google.com/file/d/') && url.includes('/preview')) {
      return url;
    }
    
    // Extract file ID from various Google Drive URL formats
    // Format 1: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
    // Format 2: https://drive.google.com/file/d/FILE_ID/view
    // Format 3: https://drive.google.com/file/d/FILE_ID
    // Format 4: https://drive.google.com/open?id=FILE_ID
    let fileId: string | null = null;
    
    // Try format 1-3: /file/d/FILE_ID
    const driveMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (driveMatch) {
      fileId = driveMatch[1];
    } else {
      // Try format 4: /open?id=FILE_ID
      const openMatch = url.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/);
      if (openMatch) {
        fileId = openMatch[1];
      }
    }
    
    // If we found a file ID, convert to preview format
    if (fileId) {
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }
    
    return url;
  };

  const getYouTubeUrl = (url: string) => {
    let embedUrl = url.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/');
    if (embedUrl.includes('?')) {
      embedUrl += '&enablejsapi=1';
    } else {
      embedUrl += '?enablejsapi=1';
    }
    return embedUrl;
  };

  const embeddableUrl = getEmbeddableUrl(materialUrl);

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
                src={embeddableUrl || materialUrl || ''}
                className="w-full h-[600px] border-0"
                title={material.title}
              />
            ) : isVideo ? (
              <div className="w-full">
                {materialUrl && (materialUrl.includes('youtube.com') || materialUrl.includes('youtu.be')) ? (
                  <div className="aspect-video" onMouseEnter={handleAutoStart}>
                    <iframe
                      ref={youtubeIframeRef}
                      src={getYouTubeUrl(materialUrl)}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={material.title}
                      onLoad={handleYoutubeLoad}
                    />
                  </div>
                ) : embeddableUrl && embeddableUrl.includes('drive.google.com') ? (
                  <div className="aspect-video" onMouseEnter={handleAutoStart}>
                    <iframe
                      src={embeddableUrl}
                      className="w-full h-full border-0"
                      allow="autoplay"
                      allowFullScreen
                      title={material.title}
                    />
                  </div>
                ) : (
                  <video
                    src={materialUrl || ''}
                    controls
                    className="w-full"
                    onPlay={() => !isTracking && startTracking()}
                    onPause={() => stopTracking()}
                    onEnded={() => {
                      stopTracking();
                      if (!isCompleted && !isUpdating) {
                         handleUpdateProgress(100);
                      }
                    }}
                  >
                    Your browser does not support the video/audio tag.
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
            {!isCompleted ? (
              <Button
                variant="primary"
                onClick={handleMarkComplete}
                disabled={isUpdating}
                className="flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                {isUpdating ? 'Processing...' : 'Mark as Complete'}
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

