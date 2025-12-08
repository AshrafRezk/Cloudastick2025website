import { useState } from 'react';
import { ChevronDown, ChevronRight, Users, Briefcase, CheckCircle2, Clock, TrendingUp, Mail } from 'lucide-react';
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
}

export const TeamTree = ({ member, currentUserId, level = 0, isCurrentUser = false }: TeamTreeProps) => {
  const [isExpanded, setIsExpanded] = useState(level < 2); // Auto-expand first 2 levels
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const hasSubordinates = member.subordinates && member.subordinates.length > 0;
  const indent = level * 24;

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
    if (!isCurrentUser && clickedMember.id !== currentUserId) {
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
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>
            </CardHeader>

            {!isCurrentUser && (
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {/* Projects */}
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-xs text-muted-foreground">Projects</div>
                      <div className="text-sm font-semibold">{member.teamBuilds.length}</div>
                    </div>
                  </div>

                  {/* Requirements */}
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-xs text-muted-foreground">Requirements</div>
                      <div className="text-sm font-semibold">
                        {member.requirementsStats.completed}/{member.requirementsStats.total}
                      </div>
                    </div>
                  </div>

                  {/* In Progress */}
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-xs text-muted-foreground">In Progress</div>
                      <div className="text-sm font-semibold">{member.requirementsStats.inProgress}</div>
                    </div>
                  </div>

                  {/* Allocation */}
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-xs text-muted-foreground">Allocation</div>
                      <Badge
                        variant="outline"
                        className={`text-xs ${getAllocationColor(member.totalAllocationPercentage)}`}
                      >
                        {member.totalAllocationPercentage}%
                      </Badge>
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
            )}
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
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Member Detail Modal */}
      {selectedMember && (
        <TeamMemberDetail
          member={selectedMember}
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
}

export const TeamHierarchyView = ({ currentUser, currentUserId }: TeamHierarchyViewProps) => {
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
        <TeamTree member={currentUser} currentUserId={currentUserId} level={0} isCurrentUser={true} />
      </div>
    </div>
  );
};

