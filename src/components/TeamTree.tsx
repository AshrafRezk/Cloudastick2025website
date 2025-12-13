import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, Users, Briefcase, CheckCircle2, Clock, TrendingUp, Mail, Target, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import type { TeamMember } from '../services/teamService';
import { TeamMemberDetail } from './TeamMemberDetail';

interface TeamTreeProps {
  member: TeamMember;
  currentUserId: string;
  level?: number;
  isCurrentUser?: boolean;
  loadMemberData?: (contactId: string) => void;
  isMemberLoading?: (memberId: string) => boolean;
  isMemberDataLoaded?: (memberId: string) => boolean;
}

export const TeamTree = ({ 
  member, 
  currentUserId, 
  level = 0, 
  isCurrentUser = false,
  loadMemberData,
  isMemberLoading,
  isMemberDataLoaded,
}: TeamTreeProps) => {
  const [isExpanded, setIsExpanded] = useState(level < 2); // Auto-expand first 2 levels
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [enrichedMember, setEnrichedMember] = useState<TeamMember>(member);

  const hasSubordinates = member.subordinates && member.subordinates.length > 0;
  const indent = level * 24;

  // DISABLED: Lazy loading removed - only one API call is made for the current user
  // Subordinates will show whatever data is available from the initial API response
  // useEffect(() => {
  //   if (isExpanded && !isCurrentUser && loadMemberData && !isMemberDataLoaded?.(member.id)) {
  //     loadMemberData(member.id);
  //   }
  // }, [isExpanded, member.id, isCurrentUser, loadMemberData, isMemberDataLoaded]);

  // Update enriched member when member prop changes (data loaded)
  useEffect(() => {
    setEnrichedMember(member);
  }, [member]);

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

  const handleMemberClick = (e: React.MouseEvent, clickedMember: TeamMember) => {
    e.stopPropagation();
    // Allow clicking on any member to see their details, including current user
    if (clickedMember.id !== currentUserId || isCurrentUser) {
      setSelectedMember(clickedMember);
    }
  };

  return (
    <>
      <div className="relative">
        {/* Tree connector line */}
        {level > 0 && (
          <div
            className="absolute border-l-2 border-border"
            style={{
              left: `${indent - 12}px`,
              top: '-12px',
              height: '12px',
            }}
          />
        )}

        <div
          className="relative"
          style={{ marginLeft: `${indent}px` }}
        >
          <Card
            className={`mb-3 transition-all hover:shadow-md ${
              isCurrentUser
                ? 'border-2 border-brand-primary bg-brand-primary/5'
                : 'cursor-pointer hover:border-primary/50'
            }`}
            onClick={(e) => handleMemberClick(e, member)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback
                      className={
                        isCurrentUser
                          ? 'bg-gradient-to-br from-brand-primary to-brand-secondary text-white'
                          : 'bg-muted'
                      }
                    >
                      {getUserInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg mb-1 flex items-center gap-2">
                      {member.name}
                      {isCurrentUser && (
                        <Badge variant="outline" className="text-xs">
                          You
                        </Badge>
                      )}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      <span className="truncate">{member.email}</span>
                    </div>
                  </div>
                </div>

                {hasSubordinates && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsExpanded(!isExpanded);
                    }}
                  >
                    {isMemberLoading?.(member.id) ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {/* Projects */}
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-xs text-muted-foreground">Projects</div>
                      <div className="text-sm font-semibold">
                        {isMemberLoading?.(member.id) ? (
                          <Loader2 className="h-3 w-3 animate-spin inline" />
                        ) : (
                          enrichedMember.teamBuilds.length
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Requirements */}
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-xs text-muted-foreground">Requirements</div>
                      <div className="text-sm font-semibold">
                        {isMemberLoading?.(member.id) ? (
                          <Loader2 className="h-3 w-3 animate-spin inline" />
                        ) : (
                          `${enrichedMember.requirementsStats.completed}/${enrichedMember.requirementsStats.total}`
                        )}
                      </div>
                    </div>
                  </div>

                  {/* In Progress */}
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-xs text-muted-foreground">In Progress</div>
                      <div className="text-sm font-semibold">
                        {isMemberLoading?.(member.id) ? (
                          <Loader2 className="h-3 w-3 animate-spin inline" />
                        ) : (
                          enrichedMember.requirementsStats.inProgress
                        )}
                      </div>
                    </div>
                  </div>

                  {/* OKRs */}
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-xs text-muted-foreground">OKRs</div>
                      <div className="text-sm font-semibold">
                        {isMemberLoading?.(member.id) ? (
                          <Loader2 className="h-3 w-3 animate-spin inline" />
                        ) : (
                          <>
                            {enrichedMember.okrs?.length || 0}
                            {enrichedMember.okrs && enrichedMember.okrs.length > 0 && enrichedMember.okrs[0] && typeof enrichedMember.okrs[0] === 'object' && 'progress' in enrichedMember.okrs[0] && (
                              <span className="text-xs text-muted-foreground ml-1">
                                ({Math.round(enrichedMember.okrs.reduce((sum, okr) => sum + (okr?.progress || 0), 0) / enrichedMember.okrs.length)}% avg)
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Allocation */}
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-xs text-muted-foreground">Allocation</div>
                      {isMemberLoading?.(member.id) ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Badge
                          variant="outline"
                          className={`text-xs ${getAllocationColor(enrichedMember.totalAllocationPercentage)}`}
                        >
                          {enrichedMember.totalAllocationPercentage}%
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Subordinates count */}
                {hasSubordinates && (
                  <div className="mt-3 pt-3 border-t flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{member.subordinates.length} direct report{member.subordinates.length !== 1 ? 's' : ''}</span>
                  </div>
                )}
              </CardContent>
          </Card>

          {/* Subordinates */}
          {hasSubordinates && isExpanded && (
            <div className="mt-2">
              {member.subordinates.map((subordinate) => (
                <TeamTree
                  key={subordinate.id}
                  member={subordinate}
                  currentUserId={currentUserId}
                  level={level + 1}
                  isCurrentUser={false}
                  loadMemberData={undefined}
                  isMemberLoading={isMemberLoading}
                  isMemberDataLoaded={isMemberDataLoaded}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Member Detail Modal */}
      {selectedMember && (
        <TeamMemberDetail
          member={enrichedMember.id === selectedMember.id ? enrichedMember : selectedMember}
          isOpen={!!selectedMember}
          onClose={() => setSelectedMember(null)}
        />
      )}
    </>
  );
};

interface TeamHierarchyViewProps {
  currentUser: TeamMember;
  currentUserId: string;
  loadMemberData?: (contactId: string) => void;
  isMemberLoading?: (memberId: string) => boolean;
  isMemberDataLoaded?: (memberId: string) => boolean;
}

export const TeamHierarchyView = ({ 
  currentUser, 
  currentUserId,
  loadMemberData,
  isMemberLoading,
  isMemberDataLoaded,
}: TeamHierarchyViewProps) => {
  return (
    <div className="space-y-6">
      {/* Managers (upward hierarchy) */}
      {currentUser.managers && currentUser.managers.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 text-muted-foreground">Reports To</h3>
          <div className="space-y-2">
            {currentUser.managers.map((manager, index) => (
              <div key={manager.id} className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-muted">
                      {manager.name
                        .split(' ')
                        .map(n => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{manager.name}</div>
                    <div className="text-xs text-muted-foreground">{manager.email}</div>
                  </div>
                </div>
                {index < currentUser.managers!.length - 1 && (
                  <ChevronDown className="h-4 w-4 text-muted-foreground ml-4" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Current User */}
      <div>
        {currentUser.managers && currentUser.managers.length > 0 && (
          <h3 className="text-lg font-semibold mb-4">Your Team</h3>
        )}
                <TeamTree 
          member={currentUser} 
          currentUserId={currentUserId} 
          level={0} 
          isCurrentUser={true}
          loadMemberData={undefined}
          isMemberLoading={isMemberLoading}
          isMemberDataLoaded={isMemberDataLoaded}
        />
      </div>
    </div>
  );
};

