import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Play, CheckCircle2, Clock, FileText, Video, GraduationCap, ChevronDown, ChevronRight } from 'lucide-react';
import { usePortalUser } from '../contexts/PortalUserContext';
import { LearningMaterialInstance, LearningMaterial } from '../services/learningService';
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

  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  const toggleModule = (instanceId: string) => {
    setExpandedModules(prev => {
      const newSet = new Set(prev);
      if (newSet.has(instanceId)) {
        newSet.delete(instanceId);
      } else {
        newSet.add(instanceId);
      }
      return newSet;
    });
  };

  const renderChildMaterial = (child: LearningMaterial, parentInstance: LearningMaterialInstance, childIndex: number) => {
    const ChildIcon = getMaterialIcon(child.materialType);
    const childInstance = child.instance;
    const childProgress = childInstance?.progress || 0;
    const childStatus = childInstance?.status || 'Not Started';
    const childStatusColor = getStatusColor(childStatus);
    
    return (
      <motion.div
        key={child.id}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: childIndex * 0.03 }}
        className="ml-8 mt-2"
      >
        <Card
          className="bg-card/60 backdrop-blur-sm border border-border/50 cursor-pointer hover:border-brand-primary/50 transition-all"
          onClick={() => {
            // Create a temporary instance for the child material
            const childInstanceData: LearningMaterialInstance = {
              ...parentInstance,
              id: childInstance?.id || `${parentInstance.id}-${child.id}`,
              learningMaterialId: child.id,
              material: child,
              progress: childProgress,
              status: childStatus as 'Not Started' | 'In Progress' | 'Completed',
              startedOn: childInstance?.startedOn || null,
              completedOn: childInstance?.completedOn || null,
            };
            onMaterialClick(childInstanceData);
          }}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary/80 to-brand-secondary/80 flex items-center justify-center flex-shrink-0">
                <ChildIcon className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-base mb-1 line-clamp-2">
                  {child.title}
                </CardTitle>
                {child.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                    {child.description}
                  </p>
                )}
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                  {child.duration > 0 && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {child.duration} min
                    </span>
                  )}
                  <span className={`flex items-center gap-1 font-medium ${childStatusColor}`}>
                    {childStatus === 'Completed' && <CheckCircle2 className="w-3 h-3" />}
                    {childStatus === 'In Progress' && <Play className="w-3 h-3" />}
                    {childStatus}
                  </span>
                </div>
                {childInstance && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{childProgress}%</span>
                    </div>
                    <Progress value={childProgress} className="h-1.5" />
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>
      </motion.div>
    );
  };

  const renderMaterialCard = (instance: LearningMaterialInstance, index: number) => {
    if (!instance.material) return null;

    const MaterialIcon = getMaterialIcon(instance.material.materialType);
    const statusColor = getStatusColor(instance.status);
    const statusBgColor = getStatusBgColor(instance.status);
    const hasChildren = instance.material.childMaterials && instance.material.childMaterials.length > 0;
    const isExpanded = expandedModules.has(instance.id);

    return (
      <motion.div
        key={instance.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        <Card
          className={`bg-card/80 backdrop-blur-sm border cursor-pointer hover:border-brand-primary/50 transition-all ${statusBgColor}`}
        >
          <CardHeader
            onClick={() => {
              if (hasChildren) {
                toggleModule(instance.id);
              } else {
                onMaterialClick(instance);
              }
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center flex-shrink-0">
                  <MaterialIcon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg mb-1 line-clamp-2">
                      {instance.material.title}
                    </CardTitle>
                    {hasChildren && (
                      <span className="text-xs text-muted-foreground">
                        ({instance.material.childMaterials?.length} materials)
                      </span>
                    )}
                  </div>
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
              {hasChildren && (
                <div className="flex-shrink-0">
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              )}
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
          {hasChildren && isExpanded && (
            <CardContent className="pt-0 border-t border-border/50">
              <div className="space-y-2">
                {instance.material.childMaterials?.map((child, childIndex) =>
                  renderChildMaterial(child, instance, childIndex)
                )}
              </div>
            </CardContent>
          )}
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

      {/* Completed Section - Shows completed parent modules (not child badges) */}
      {completed.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-green-500" />
            Completed Modules ({completed.length})
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

