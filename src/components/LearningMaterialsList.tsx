import { motion } from 'framer-motion';
import { BookOpen, Play, CheckCircle2, Clock, FileText, Video, GraduationCap } from 'lucide-react';
import { usePortalUser } from '../contexts/PortalUserContext';
import { LearningMaterialInstance } from '../services/learningService';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';

interface LearningMaterialsListProps {
  onMaterialClick: (instance: LearningMaterialInstance) => void;
}

const getMaterialIcon = (materialType: string) => {
  switch (materialType) {
    case 'Video':
      return Video;
    case 'PDF':
      return FileText;
    case 'Course':
      return GraduationCap;
    default:
      return BookOpen;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Completed':
      return 'text-green-500';
    case 'In Progress':
      return 'text-blue-500';
    default:
      return 'text-muted-foreground';
  }
};

const getStatusBgColor = (status: string) => {
  switch (status) {
    case 'Completed':
      return 'bg-green-500/10 border-green-500/20';
    case 'In Progress':
      return 'bg-blue-500/10 border-blue-500/20';
    default:
      return 'bg-muted/50 border-border';
  }
};

const LearningMaterialsList = ({ onMaterialClick }: LearningMaterialsListProps) => {
  const { instances, notStarted, inProgress, completed, isLoading } = usePortalUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading materials...</div>
      </div>
    );
  }

  if (instances.length === 0) {
    return (
      <Card className="bg-card/80 backdrop-blur-sm border-border">
        <CardContent className="py-12 text-center">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Learning Materials</h3>
          <p className="text-muted-foreground">
            You don't have any learning materials assigned yet. Contact your administrator to get access.
          </p>
        </CardContent>
      </Card>
    );
  }

  const renderMaterialCard = (instance: LearningMaterialInstance, index: number) => {
    if (!instance.material) return null;

    const MaterialIcon = getMaterialIcon(instance.material.materialType);
    const statusColor = getStatusColor(instance.status);
    const statusBgColor = getStatusBgColor(instance.status);

    return (
      <motion.div
        key={instance.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        <Card
          className={`bg-card/80 backdrop-blur-sm border cursor-pointer hover:border-brand-primary/50 transition-all ${statusBgColor}`}
          onClick={() => onMaterialClick(instance)}
        >
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center flex-shrink-0">
                  <MaterialIcon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg mb-1 line-clamp-2">
                    {instance.material.title}
                  </CardTitle>
                  {instance.material.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {instance.material.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {instance.material.category && (
                      <span className="px-2 py-1 bg-muted rounded">{instance.material.category}</span>
                    )}
                    {instance.material.duration > 0 && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {instance.material.duration} min
                      </span>
                    )}
                    <span className={`flex items-center gap-1 font-medium ${statusColor}`}>
                      {instance.status === 'Completed' && <CheckCircle2 className="w-3 h-3" />}
                      {instance.status === 'In Progress' && <Play className="w-3 h-3" />}
                      {instance.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium text-foreground">{instance.progress}%</span>
              </div>
              <Progress value={instance.progress} className="h-2" />
            </div>
            {instance.completedOn && (
              <div className="mt-3 text-xs text-muted-foreground">
                Completed on {new Date(instance.completedOn).toLocaleDateString()}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="space-y-8">
      {/* In Progress Section */}
      {inProgress.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Play className="w-6 h-6 text-blue-500" />
            In Progress ({inProgress.length})
          </h2>
          <div className="grid gap-4">
            {inProgress.map((instance, index) => renderMaterialCard(instance, index))}
          </div>
        </div>
      )}

      {/* Not Started Section */}
      {notStarted.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-muted-foreground" />
            Not Started ({notStarted.length})
          </h2>
          <div className="grid gap-4">
            {notStarted.map((instance, index) => renderMaterialCard(instance, index))}
          </div>
        </div>
      )}

      {/* Completed Section */}
      {completed.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-green-500" />
            Completed ({completed.length})
          </h2>
          <div className="grid gap-4">
            {completed.map((instance, index) => renderMaterialCard(instance, index))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningMaterialsList;

