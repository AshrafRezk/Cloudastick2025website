import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Briefcase, CheckCircle2, Clock, TrendingUp, Mail, Users,
  BookOpen, Loader2, Calendar, Percent, Target, Plus
} from 'lucide-react';
import type { TeamMember, OKR, OkrMetadata } from '../services/teamService';
import { fetchLearningInstances } from '../services/learningService';
import { useSalesforce } from '../contexts/SalesforceContext';
import type { LearningMaterialInstance } from '../services/learningService';
import { createObjective, createKeyResult, fetchOkrMetadata } from '../services/teamService';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

// Helper function to render rich text content safely
const renderRichText = (content: string) => {
  if (!content) return null;
  
  // Check if content contains HTML tags
  const hasHTML = /<[^>]+>/.test(content);
  
  if (hasHTML) {
    // Sanitize and render HTML content
    return (
      <div 
        className="prose prose-invert max-w-none text-muted-foreground leading-relaxed text-sm
          prose-headings:text-foreground prose-strong:text-foreground prose-em:text-muted-foreground
          prose-ul:text-muted-foreground prose-ol:text-muted-foreground prose-li:text-muted-foreground
          prose-p:text-muted-foreground prose-a:text-primary hover:prose-a:text-primary/80
          prose-code:text-foreground prose-pre:bg-muted prose-blockquote:text-muted-foreground
          prose-hr:border-border"
        dangerouslySetInnerHTML={{ __html: content }}
        style={{
          wordBreak: 'break-word',
        }}
      />
    );
  }
  
  // Plain text - preserve line breaks and format common patterns
  // Convert markdown-like syntax to HTML
  const formatted = content
    // Bold: **text** or __text__
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.*?)__/g, '<strong>$1</strong>')
    // Italic: *text* or _text_
    .replace(/(?<!\*)\*(?!\*)([^*]+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>')
    .replace(/(?<!_)_(?!_)([^_]+?)(?<!_)_(?!_)/g, '<em>$1</em>')
    // Code: `text`
    .replace(/`([^`]+)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-foreground text-xs">$1</code>');
  
  // Handle line breaks
  const lines = formatted.split('\n');
  const processedLines = lines.map((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) return '<br />';
    
    // Check for bullet points
    if (/^[-•*]\s/.test(trimmed)) {
      return `<li>${trimmed.replace(/^[-•*]\s/, '')}</li>`;
    }
    
    // Check for numbered lists
    if (/^\d+\.\s/.test(trimmed)) {
      return `<li>${trimmed.replace(/^\d+\.\s/, '')}</li>`;
    }
    
    return `<p>${trimmed}</p>`;
  });
  
  // Wrap consecutive list items in ul/ol
  let wrapped = '';
  let inList = false;
  let listType: 'ul' | 'ol' | null = null;
  
  processedLines.forEach((line, index) => {
    if (line.startsWith('<li>')) {
      // Check original line to determine if it's numbered
      const originalLine = lines[index]?.trim() || '';
      const isNumbered = /^\d+\.\s/.test(originalLine);
      const currentListType = isNumbered ? 'ol' : 'ul';
      
      if (!inList || listType !== currentListType) {
        if (inList) wrapped += `</${listType}>`;
        wrapped += `<${currentListType} class="list-disc list-inside space-y-1 my-2">`;
        inList = true;
        listType = currentListType;
      }
      wrapped += line;
    } else {
      if (inList) {
        wrapped += `</${listType}>`;
        inList = false;
        listType = null;
      }
      wrapped += line;
    }
  });
  
  if (inList && listType) {
    wrapped += `</${listType}>`;
  }
  
  return (
    <div 
      className="text-muted-foreground leading-relaxed text-sm"
      dangerouslySetInnerHTML={{ __html: wrapped }}
      style={{
        wordBreak: 'break-word',
      }}
    />
  );
};

interface TeamMemberDetailProps {
  member: TeamMember;
  isOpen: boolean;
  onClose: () => void;
}

export const TeamMemberDetail = ({ member, isOpen, onClose }: TeamMemberDetailProps) => {
  const { authData, isLoading: isAuthLoading, refreshAuth } = useSalesforce();
  const [lmsInstances, setLmsInstances] = useState<LearningMaterialInstance[]>([]);
  const [isLoadingLMS, setIsLoadingLMS] = useState(false);
  const [lmsError, setLmsError] = useState<string | null>(null);
  const [okrs, setOkrs] = useState<OKR[]>(member.okrs || []);
  const [okrMetadata, setOkrMetadata] = useState<OkrMetadata | null>(null);
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);
  const [metadataError, setMetadataError] = useState<string | null>(null);
  const [creationError, setCreationError] = useState<string | null>(null);

  const [isCreatingObjective, setIsCreatingObjective] = useState(false);
  const [newObjective, setNewObjective] = useState({
    objective: '',
    status: '',
    period: '',
    year: new Date().getFullYear(),
    startDate: '',
    endDate: '',
  });

  const [isCreatingKR, setIsCreatingKR] = useState<{ [okrId: string]: boolean }>({});
  const [krForms, setKrForms] = useState<{
    [okrId: string]: { name: string; description: string; target: string; currentValue: string; unit: string; status: string };
  }>({});

  useEffect(() => {
    if (isOpen && member.id && authData) {
      loadLMSData();
      loadOkrMetadata();
      setOkrs(member.okrs || []);
    }
  }, [isOpen, member.id, authData, member.okrs]);

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

  const loadOkrMetadata = async () => {
    if (!authData) return;
    setIsLoadingMetadata(true);
    setMetadataError(null);
    try {
      const meta = await fetchOkrMetadata(authData);
      setOkrMetadata(meta);
    } catch (error) {
      console.error('Failed to load OKR metadata:', error);
      setMetadataError(error instanceof Error ? error.message : 'Failed to load OKR metadata');
    } finally {
      setIsLoadingMetadata(false);
    }
  };

  const handleCreateObjective = async () => {
    if (!authData || !member.id || !newObjective.objective.trim()) return;
    setIsCreatingObjective(true);
    setCreationError(null);
    try {
      const res = await createObjective(
        {
          contactId: member.id,
          objective: newObjective.objective.trim(),
          status: newObjective.status || undefined,
          period: newObjective.period || undefined,
          year: newObjective.year,
          startDate: newObjective.startDate || undefined,
          endDate: newObjective.endDate || undefined,
        },
        authData
      );

      if (res.success && res.id) {
        const newOkr: OKR = {
          id: res.id,
          name: newObjective.objective.trim(),
          objective: newObjective.objective.trim(),
          status: newObjective.status || 'In Progress',
          progress: 0,
          period: newObjective.period || '',
          year: newObjective.year || new Date().getFullYear(),
          startDate: newObjective.startDate || null,
          endDate: newObjective.endDate || null,
          createdDate: new Date().toISOString(),
          keyResults: [],
        };
        setOkrs((prev) => [newOkr, ...prev]);
        setNewObjective({
          objective: '',
          status: '',
          period: '',
          year: new Date().getFullYear(),
          startDate: '',
          endDate: '',
        });
      } else {
        setCreationError('Failed to create OKR');
      }
    } catch (error) {
      setCreationError(error instanceof Error ? error.message : 'Failed to create OKR');
    } finally {
      setIsCreatingObjective(false);
    }
  };

  const handleCreateKeyResult = async (okrId: string) => {
    if (!authData) return;
    const form = krForms[okrId] || { name: '', description: '', target: '', currentValue: '', unit: '', status: '' };
    if (!form.name.trim()) return;
    setIsCreatingKR((prev) => ({ ...prev, [okrId]: true }));
    setCreationError(null);
    try {
      const res = await createKeyResult(
        {
          okrId,
          name: form.name.trim(),
          description: form.description || undefined,
          target: form.target ? Number(form.target) : undefined,
          currentValue: form.currentValue ? Number(form.currentValue) : undefined,
          unit: form.unit || undefined,
          status: form.status || undefined,
        },
        authData
      );

      if (res.success && res.id) {
        const newKr = {
          id: res.id,
          name: form.name.trim(),
          description: form.description || '',
          target: form.target ? Number(form.target) : 0,
          currentValue: form.currentValue ? Number(form.currentValue) : 0,
          progress:
            form.target && form.currentValue
              ? Math.round((Number(form.currentValue) / Number(form.target)) * 100)
              : 0,
          status: form.status || 'In Progress',
          unit: form.unit || '',
          createdDate: new Date().toISOString(),
        };
        setOkrs((prev) =>
          prev.map((okr) =>
            okr.id === okrId ? { ...okr, keyResults: [...(okr.keyResults || []), newKr] } : okr
          )
        );
        setKrForms((prev) => ({
          ...prev,
          [okrId]: { name: '', description: '', target: '', currentValue: '', unit: '', status: '' },
        }));
      } else {
        setCreationError('Failed to create Key Result');
      }
    } catch (error) {
      setCreationError(error instanceof Error ? error.message : 'Failed to create Key Result');
    } finally {
      setIsCreatingKR((prev) => ({ ...prev, [okrId]: false }));
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
                  <div className="text-2xl font-bold">{okrs?.length || 0}</div>
                  {okrs && okrs.length > 0 && (
                    <div className="text-xs text-muted-foreground">
                      {Math.round(okrs.reduce((sum, okr) => sum + okr.progress, 0) / okrs.length)}% avg progress
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
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground flex-wrap">
                            {project.accountName && (
                              <span className="flex items-center gap-1">
                                <Briefcase className="h-4 w-4" />
                                Account: {project.accountName}
                              </span>
                            )}
                            {project.opportunityName && (
                              <span className="flex items-center gap-1">
                                <Briefcase className="h-4 w-4" />
                                Opportunity: {project.opportunityName}
                              </span>
                            )}
                            {project.projectName && (
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                Project: {project.projectName}
                              </span>
                            )}
                            {project.teamMembers && project.teamMembers.length > 0 && (
                              <span className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {project.teamMembers.length} member{project.teamMembers.length !== 1 ? 's' : ''}
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
                    <CardContent className="space-y-3">
                      {project.teamMembers && project.teamMembers.length > 0 && (
                        <div>
                          <div className="text-sm font-medium mb-2 flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Team Members
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {project.teamMembers.map((member) => (
                              <Badge key={member.id} variant="outline" className="text-xs">
                                {member.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {project.scope && (
                        <div>
                          <div className="text-sm font-medium mb-1">Scope</div>
                          {renderRichText(project.scope)}
                        </div>
                      )}
                      {project.deliverables && (
                        <div>
                          <div className="text-sm font-medium mb-1">Deliverables</div>
                          {renderRichText(project.deliverables)}
                        </div>
                      )}
                    </CardContent>
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
            <Card>
              <CardHeader className="flex flex-col gap-2">
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Objectives & Key Results
                </CardTitle>
                {metadataError && <p className="text-sm text-destructive">{metadataError}</p>}
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="objective">Objective</Label>
                    <Input
                      id="objective"
                      placeholder="Increase NPS to 60"
                      value={newObjective.objective}
                      onChange={(e) => {
                        const value = e.target.value;
                        setNewObjective((prev) => ({ ...prev, objective: value }));
                        // Clear creation error when user starts typing
                        if (creationError) {
                          setCreationError(null);
                        }
                      }}
                      onKeyDown={(e) => {
                        // Allow Enter key to submit if button is enabled
                        if (e.key === 'Enter' && newObjective.objective.trim() && authData && !isCreatingObjective) {
                          handleCreateObjective();
                        }
                      }}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={newObjective.status}
                      onChange={(e) => setNewObjective((prev) => ({ ...prev, status: e.target.value }))}
                    >
                      <option value="">Select</option>
                      {(okrMetadata?.picklists.okrStatus || ['Not Started', 'In Progress', 'On Track', 'Completed']).map((val) => (
                        <option key={val} value={val}>{val}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="period">Period</Label>
                    <select
                      id="period"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={newObjective.period}
                      onChange={(e) => setNewObjective((prev) => ({ ...prev, period: e.target.value }))}
                    >
                      <option value="">Select</option>
                      {(okrMetadata?.picklists.okrPeriod || ['Q1', 'Q2', 'Q3', 'Q4']).map((val) => (
                        <option key={val} value={val}>{val}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      type="number"
                      value={newObjective.year}
                      onChange={(e) => setNewObjective((prev) => ({ ...prev, year: Number(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={newObjective.startDate}
                      onChange={(e) => setNewObjective((prev) => ({ ...prev, startDate: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={newObjective.endDate}
                      onChange={(e) => setNewObjective((prev) => ({ ...prev, endDate: e.target.value }))}
                    />
                  </div>
                </div>
                {creationError && <p className="text-sm text-destructive">{creationError}</p>}
                {!authData && !isAuthLoading && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <p>Salesforce authentication required to create OKRs.</p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={refreshAuth}
                      className="h-7"
                    >
                      Authenticate
                    </Button>
                  </div>
                )}
                {isAuthLoading && (
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading authentication...
                  </p>
                )}
                <Button
                  onClick={handleCreateObjective}
                  disabled={isCreatingObjective || !newObjective.objective.trim() || !authData || isAuthLoading}
                  className={(!newObjective.objective.trim() || !authData || isAuthLoading) ? 'opacity-50 cursor-not-allowed' : ''}
                >
                  {isCreatingObjective ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Plus className="h-4 w-4" /> Add Objective
                    </span>
                  )}
                </Button>
              </CardContent>
            </Card>

            {!okrs || okrs.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  <Target className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No OKRs assigned</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {okrs.map((okr) => (
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
                    <CardContent className="pt-0 mt-1 border-t">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 items-end">
                        <div className="space-y-1">
                          <Label>Name</Label>
                          <Input
                            value={krForms[okr.id]?.name || ''}
                            onChange={(e) =>
                              setKrForms((prev) => ({
                                ...prev,
                                [okr.id]: {
                                  ...(prev[okr.id] || { name: '', description: '', target: '', currentValue: '', unit: '', status: '' }),
                                  name: e.target.value,
                                },
                              }))
                            }
                            placeholder="Ship feature X"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label>Description</Label>
                          <Input
                            value={krForms[okr.id]?.description || ''}
                            onChange={(e) =>
                              setKrForms((prev) => ({
                                ...prev,
                                [okr.id]: {
                                  ...(prev[okr.id] || { name: '', description: '', target: '', currentValue: '', unit: '', status: '' }),
                                  description: e.target.value,
                                },
                              }))
                            }
                            placeholder="Outcome / metric"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label>Target</Label>
                          <Input
                            type="number"
                            value={krForms[okr.id]?.target || ''}
                            onChange={(e) =>
                              setKrForms((prev) => ({
                                ...prev,
                                [okr.id]: {
                                  ...(prev[okr.id] || { name: '', description: '', target: '', currentValue: '', unit: '', status: '' }),
                                  target: e.target.value,
                                },
                              }))
                            }
                            placeholder="100"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label>Current</Label>
                          <Input
                            type="number"
                            value={krForms[okr.id]?.currentValue || ''}
                            onChange={(e) =>
                              setKrForms((prev) => ({
                                ...prev,
                                [okr.id]: {
                                  ...(prev[okr.id] || { name: '', description: '', target: '', currentValue: '', unit: '', status: '' }),
                                  currentValue: e.target.value,
                                },
                              }))
                            }
                            placeholder="25"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label>Unit</Label>
                          <select
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={krForms[okr.id]?.unit || ''}
                            onChange={(e) =>
                              setKrForms((prev) => ({
                                ...prev,
                                [okr.id]: {
                                  ...(prev[okr.id] || { name: '', description: '', target: '', currentValue: '', unit: '', status: '' }),
                                  unit: e.target.value,
                                },
                              }))
                            }
                          >
                            <option value="">Select</option>
                            {(okrMetadata?.picklists.krUnit || ['Units', '%', '$']).map((val) => (
                              <option key={val} value={val}>{val}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-1">
                          <Label>Status</Label>
                          <select
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={krForms[okr.id]?.status || ''}
                            onChange={(e) =>
                              setKrForms((prev) => ({
                                ...prev,
                                [okr.id]: {
                                  ...(prev[okr.id] || { name: '', description: '', target: '', currentValue: '', unit: '', status: '' }),
                                  status: e.target.value,
                                },
                              }))
                            }
                          >
                            <option value="">Select</option>
                            {(okrMetadata?.picklists.krStatus || ['Not Started', 'In Progress', 'Completed']).map((val) => (
                              <option key={val} value={val}>{val}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="flex justify-end mt-3">
                        {!authData && !isAuthLoading && (
                          <p className="text-xs text-muted-foreground mr-2 flex items-center">
                            Authentication required
                          </p>
                        )}
                        <Button
                          size="sm"
                          onClick={() => handleCreateKeyResult(okr.id)}
                          disabled={isCreatingKR[okr.id] || !(krForms[okr.id]?.name || '').trim() || !authData || isAuthLoading}
                          className={(!(krForms[okr.id]?.name || '').trim() || !authData || isAuthLoading) ? 'opacity-50 cursor-not-allowed' : ''}
                        >
                          {isCreatingKR[okr.id] ? (
                            <span className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              <Plus className="h-4 w-4" /> Add Key Result
                            </span>
                          )}
                        </Button>
                      </div>
                    </CardContent>
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

