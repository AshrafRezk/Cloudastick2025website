import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Briefcase, CheckCircle2, Clock, TrendingUp, Mail, Users, 
  BookOpen, Loader2, Calendar, Percent, Target
} from 'lucide-react';
import type { TeamMember } from '../services/teamService';
import { fetchLearningInstances } from '../services/learningService';
import { useSalesforce } from '../contexts/SalesforceContext';
import type { LearningMaterialInstance } from '../services/learningService';

interface TeamMemberDetailProps {
  member: TeamMember;
  isOpen: boolean;
  onClose: () => void;
}

export const TeamMemberDetail = ({ member, isOpen, onClose }: TeamMemberDetailProps) => {
  const { authData } = useSalesforce();
  const [lmsInstances, setLmsInstances] = useState<LearningMaterialInstance[]>([]);
  const [isLoadingLMS, setIsLoadingLMS] = useState(false);
  const [lmsError, setLmsError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && member.id && authData) {
      loadLMSData();
    }
  }, [isOpen, member.id, authData]);

  const loadLMSData = async () => {
    if (!authData || !member.id) return;

    setIsLoadingLMS(true);
    setLmsError(null);
    try {
      const response = await fetchLearningInstances(member.id, authData);
      setLmsInstances(response.instances || []);
    } catch (error) {
      console.error('Failed to load LMS data:', error);
      setLmsError(error instanceof Error ? error.message : 'Failed to load learning data');
    } finally {
      setIsLoadingLMS(false);
    }
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAllocationColor = (percentage: number) => {
    if (percentage >= 100) return 'text-red-600 bg-red-50 border-red-200';
    if (percentage >= 75) return 'text-orange-600 bg-orange-50 border-orange-200';
    if (percentage >= 50) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  const completedInstances = lmsInstances.filter(i => i.status === 'Completed');
  const inProgressInstances = lmsInstances.filter(i => i.status === 'In Progress');
  const notStartedInstances = lmsInstances.filter(i => i.status === 'Not Started');

  const totalProgress = lmsInstances.length > 0
    ? Math.round(
        lmsInstances.reduce((sum, i) => sum + i.progress, 0) / lmsInstances.length
      )
    : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-gradient-to-br from-brand-primary to-brand-secondary text-white">
                {getUserInitials(member.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="text-2xl">{member.name}</DialogTitle>
              <DialogDescription className="flex items-center gap-2 mt-1">
                <Mail className="h-4 w-4" />
                {member.email}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="lms">LMS Progress</TabsTrigger>
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
            <TabsTrigger value="okrs">OKRs</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Projects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{member.teamBuilds.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Requirements Completed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{member.requirementsStats.completed}</div>
                  <div className="text-xs text-muted-foreground">
                    of {member.requirementsStats.total} total
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    In Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{member.requirementsStats.inProgress}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    OKRs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{member.okrs?.length || 0}</div>
                  {member.okrs && member.okrs.length > 0 && (
                    <div className="text-xs text-muted-foreground">
                      {Math.round(member.okrs.reduce((sum, okr) => sum + okr.progress, 0) / member.okrs.length)}% avg progress
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Allocation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge
                    variant="outline"
                    className={`text-lg ${getAllocationColor(member.totalAllocationPercentage)}`}
                  >
                    {member.totalAllocationPercentage}%
                  </Badge>
                </CardContent>
              </Card>
            </div>

            {member.subordinates.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Direct Reports ({member.subordinates.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {member.subordinates.map((sub) => (
                      <div key={sub.id} className="flex items-center justify-between p-2 rounded border">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>
                              {getUserInitials(sub.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{sub.name}</div>
                            <div className="text-xs text-muted-foreground">{sub.email}</div>
                          </div>
                        </div>
                        <Badge variant="outline">
                          {sub.teamBuilds.length} project{sub.teamBuilds.length !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-4 mt-4">
            {member.teamBuilds.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  <Briefcase className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No projects allocated</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {member.teamBuilds.map((project) => (
                  <Card key={project.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{project.name || 'Unnamed Project'}</CardTitle>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            {project.accountName && (
                              <span className="flex items-center gap-1">
                                <Briefcase className="h-4 w-4" />
                                {project.accountName}
                              </span>
                            )}
                            {project.projectName && (
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {project.projectName}
                              </span>
                            )}
                            <Badge
                              variant="outline"
                              className={getAllocationColor(project.allocationPercentage)}
                            >
                              <Percent className="h-3 w-3 mr-1" />
                              {project.allocationPercentage}% allocated
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    {(project.scope || project.deliverables) && (
                      <CardContent className="space-y-3">
                        {project.scope && (
                          <div>
                            <div className="text-sm font-medium mb-1">Scope</div>
                            <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                              {project.scope}
                            </div>
                          </div>
                        )}
                        {project.deliverables && (
                          <div>
                            <div className="text-sm font-medium mb-1">Deliverables</div>
                            <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                              {project.deliverables}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* LMS Progress Tab */}
          <TabsContent value="lms" className="space-y-4 mt-4">
            {isLoadingLMS ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                  <p className="text-muted-foreground">Loading learning progress...</p>
                </CardContent>
              </Card>
            ) : lmsError ? (
              <Card>
                <CardContent className="py-8 text-center text-destructive">
                  <p>{lmsError}</p>
                </CardContent>
              </Card>
            ) : lmsInstances.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No learning materials assigned</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {/* Summary Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Completed
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">
                        {completedInstances.length}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        In Progress
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">
                        {inProgressInstances.length}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Average Progress
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{totalProgress}%</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Learning Materials List */}
                <div className="space-y-2">
                  {lmsInstances.map((instance) => (
                    <Card key={instance.id}>
                      <CardContent className="py-3">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-medium">{instance.material?.title || 'Unknown Material'}</div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {instance.material?.category || 'Uncategorized'}
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="text-sm font-medium">{instance.progress}%</div>
                              <div className="text-xs text-muted-foreground">
                                {instance.status}
                              </div>
                            </div>
                            <Badge
                              variant={
                                instance.status === 'Completed'
                                  ? 'default'
                                  : instance.status === 'In Progress'
                                  ? 'secondary'
                                  : 'outline'
                              }
                            >
                              {instance.status}
                            </Badge>
                          </div>
                        </div>
                        {instance.progress > 0 && (
                          <div className="mt-2 w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-primary h-2 rounded-full transition-all"
                              style={{ width: `${instance.progress}%` }}
                            />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* OKRs Tab */}
          <TabsContent value="okrs" className="space-y-4 mt-4">
            {!member.okrs || member.okrs.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No OKRs assigned</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {member.okrs.map((okr) => (
                  <Card key={okr.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">{okr.objective || okr.name}</CardTitle>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            {okr.period && (
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {okr.period} {okr.year}
                              </span>
                            )}
                            <Badge
                              variant={
                                okr.status === 'Completed'
                                  ? 'default'
                                  : okr.status === 'On Track'
                                  ? 'secondary'
                                  : 'outline'
                              }
                            >
                              {okr.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{okr.progress}%</div>
                          <div className="text-xs text-muted-foreground">Progress</div>
                        </div>
                      </div>
                      {okr.progress > 0 && (
                        <div className="mt-3 w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all"
                            style={{ width: `${okr.progress}%` }}
                          />
                        </div>
                      )}
                    </CardHeader>
                    {okr.keyResults && okr.keyResults.length > 0 && (
                      <CardContent>
                        <div className="space-y-3">
                          <div className="text-sm font-medium mb-2">Key Results</div>
                          {okr.keyResults.map((kr) => (
                            <div key={kr.id} className="p-3 rounded-lg border bg-muted/50">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                  <div className="font-medium text-sm">{kr.name || kr.description}</div>
                                  {kr.description && kr.description !== kr.name && (
                                    <div className="text-xs text-muted-foreground mt-1">
                                      {kr.description}
                                    </div>
                                  )}
                                </div>
                                <div className="text-right ml-4">
                                  <div className="text-sm font-semibold">
                                    {kr.currentValue.toLocaleString()}
                                    {kr.unit && ` ${kr.unit}`} / {kr.target.toLocaleString()}
                                    {kr.unit && ` ${kr.unit}`}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {kr.progress}% complete
                                  </div>
                                </div>
                              </div>
                              <div className="w-full bg-background rounded-full h-1.5 mt-2">
                                <div
                                  className={`h-1.5 rounded-full transition-all ${
                                    kr.progress >= 100
                                      ? 'bg-green-600'
                                      : kr.progress >= 75
                                      ? 'bg-blue-600'
                                      : kr.progress >= 50
                                      ? 'bg-yellow-600'
                                      : 'bg-orange-600'
                                  }`}
                                  style={{ width: `${Math.min(100, kr.progress)}%` }}
                                />
                              </div>
                              <div className="flex items-center justify-between mt-1">
                                <Badge
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {kr.status}
                                </Badge>
                                {kr.unit && (
                                  <span className="text-xs text-muted-foreground">
                                    Target: {kr.target.toLocaleString()} {kr.unit}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    )}
                    {(!okr.keyResults || okr.keyResults.length === 0) && (
                      <CardContent>
                        <div className="text-sm text-muted-foreground text-center py-4">
                          No key results defined
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Requirements Tab */}
          <TabsContent value="requirements" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Requirements Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-lg border">
                    <div className="text-3xl font-bold text-green-600">
                      {member.requirementsStats.completed}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">Completed</div>
                  </div>
                  <div className="text-center p-4 rounded-lg border">
                    <div className="text-3xl font-bold text-blue-600">
                      {member.requirementsStats.inProgress}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">In Progress</div>
                  </div>
                  <div className="text-center p-4 rounded-lg border">
                    <div className="text-3xl font-bold">
                      {member.requirementsStats.total}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">Total</div>
                  </div>
                </div>

                {member.requirementsStats.total > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Completion Rate</span>
                      <span className="font-medium">
                        {Math.round(
                          (member.requirementsStats.completed / member.requirementsStats.total) * 100
                        )}%
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all"
                        style={{
                          width: `${
                            (member.requirementsStats.completed / member.requirementsStats.total) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

