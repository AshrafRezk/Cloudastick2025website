import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Lock, Loader2, Search, Eye, Edit, Trash2, 
  Building2, Users, Calendar, FileText, X,
  AlertTriangle, RefreshCw, Target
} from 'lucide-react';
import { 
  listProjectTeams, 
  deleteProjectTeam, 
  getProjectTeam,
  ProjectTeamListItem,
  ProjectTeamData
} from '../services/projectTeamService';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useToast } from '../hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';

const ProjectTeamAdmin: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const EDIT_PASSWORD = 'Cloudastick@Team$';
  
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPasswordDialog, setShowPasswordDialog] = useState(true);
  
  // Data state
  const [projects, setProjects] = useState<ProjectTeamListItem[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<ProjectTeamListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // View/Delete state
  const [selectedProject, setSelectedProject] = useState<ProjectTeamData | null>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Check if already authenticated
  useEffect(() => {
    const authStatus = sessionStorage.getItem('project-team-admin-auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      setShowPasswordDialog(false);
      loadProjects();
    }
  }, []);

  // Filter projects based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredProjects(projects);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = projects.filter(project => 
      project.companyName.toLowerCase().includes(term) ||
      project.projectId.toLowerCase().includes(term)
    );
    setFilteredProjects(filtered);
  }, [searchTerm, projects]);

  // Handle password authentication
  const handlePasswordSubmit = () => {
    if (password === EDIT_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('project-team-admin-auth', 'true');
      setShowPasswordDialog(false);
      setPassword('');
      loadProjects();
      toast({
        title: 'Authentication successful',
        description: 'You can now manage project teams.',
      });
    } else {
      toast({
        title: 'Invalid password',
        description: 'Please enter the correct password.',
        variant: 'destructive',
      });
      setPassword('');
    }
  };

  // Load projects list
  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const response = await listProjectTeams(EDIT_PASSWORD);
      setProjects(response.projects);
      setFilteredProjects(response.projects);
    } catch (error: any) {
      console.error('Error loading projects:', error);
      toast({
        title: 'Failed to load projects',
        description: error.message || 'An error occurred while loading projects.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // View project details
  const handleViewProject = async (projectId: string) => {
    try {
      const data = await getProjectTeam(projectId);
      if (data) {
        setSelectedProject(data);
        setShowViewDialog(true);
      } else {
        toast({
          title: 'Project not found',
          description: 'The project could not be loaded.',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      console.error('Error loading project:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to load project details.',
        variant: 'destructive',
      });
    }
  };

  // Edit project - redirect to project-team page
  const handleEditProject = (projectId: string) => {
    navigate(`/project-team?projectId=${projectId}`);
  };

  // Delete project
  const handleDeleteClick = (projectId: string) => {
    setProjectToDelete(projectId);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;

    setIsDeleting(true);
    try {
      await deleteProjectTeam(projectToDelete, EDIT_PASSWORD);
      toast({
        title: 'Project deleted',
        description: 'The project team configuration has been deleted.',
      });
      setShowDeleteDialog(false);
      setProjectToDelete(null);
      // Reload projects list
      await loadProjects();
    } catch (error: any) {
      console.error('Error deleting project:', error);
      toast({
        title: 'Failed to delete project',
        description: error.message || 'An error occurred while deleting the project.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return dateString;
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-gray-700 p-8 max-w-md w-full shadow-2xl"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="bg-cyan-500/20 p-3 rounded-full">
              <Lock className="h-8 w-8 text-cyan-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white text-center mb-2">
            Admin Access Required
          </h1>
          <p className="text-gray-400 text-center mb-6">
            Please enter the password to access the project team admin panel.
          </p>
          <div className="space-y-4">
            <div>
              <Label htmlFor="password" className="text-gray-300">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handlePasswordSubmit();
                  }
                }}
                placeholder="Enter admin password"
                className="mt-2 bg-gray-700/50 border-gray-600 text-white"
                autoFocus
              />
            </div>
            <Button
              onClick={handlePasswordSubmit}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
            >
              Authenticate
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 mb-6 shadow-xl"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Project Team Admin</h1>
              <p className="text-gray-400">Manage all project team configurations</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={loadProjects}
                disabled={isLoading}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                onClick={() => {
                  sessionStorage.removeItem('project-team-admin-auth');
                  setIsAuthenticated(false);
                  setShowPasswordDialog(true);
                }}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <Lock className="h-4 w-4 mr-2" />
                Lock
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-gray-700 p-4 mb-6"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by company name or project ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-700/50 border-gray-600 text-white"
            />
          </div>
        </motion.div>

        {/* Projects Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-800/90 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden shadow-xl"
        >
          {isLoading ? (
            <div className="p-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-cyan-400 mx-auto mb-4" />
              <p className="text-gray-400">Loading projects...</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="p-12 text-center">
              <Building2 className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-2">
                {searchTerm ? 'No projects found matching your search' : 'No projects found'}
              </p>
              {searchTerm && (
                <Button
                  onClick={() => setSearchTerm('')}
                  variant="outline"
                  className="mt-4 border-gray-600 text-gray-300"
                >
                  Clear search
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700 hover:bg-gray-800/50">
                    <TableHead className="text-gray-300">Company</TableHead>
                    <TableHead className="text-gray-300">Project ID</TableHead>
                    <TableHead className="text-gray-300">Team Members</TableHead>
                    <TableHead className="text-gray-300">Last Updated</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.map((project) => (
                    <TableRow
                      key={project.projectId}
                      className="border-gray-700 hover:bg-gray-800/50"
                    >
                      <TableCell className="font-medium text-white">
                        {project.companyName || 'N/A'}
                      </TableCell>
                      <TableCell className="text-gray-400 font-mono text-sm">
                        {project.projectId.substring(0, 15)}...
                      </TableCell>
                      <TableCell className="text-gray-300">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-gray-500" />
                          {project.teamMemberCount}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-400 text-sm">
                        {formatDate(project.updatedAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {project.hasScope && (
                            <span className="inline-flex items-center gap-1 text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                              <FileText className="h-3 w-3" />
                              Scope
                            </span>
                          )}
                          {project.hasDeliverables && (
                            <span className="inline-flex items-center gap-1 text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                              <Target className="h-3 w-3" />
                              Deliverables
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            onClick={() => handleViewProject(project.projectId)}
                            variant="ghost"
                            size="sm"
                            className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => handleEditProject(project.projectId)}
                            variant="ghost"
                            size="sm"
                            className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteClick(project.projectId)}
                            variant="ghost"
                            size="sm"
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          
          {!isLoading && filteredProjects.length > 0 && (
            <div className="p-4 border-t border-gray-700 bg-gray-800/50">
              <p className="text-sm text-gray-400">
                Showing {filteredProjects.length} of {projects.length} project{projects.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* View Project Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Project Details</DialogTitle>
            <DialogDescription className="text-gray-400">
              View project team configuration
            </DialogDescription>
          </DialogHeader>
          {selectedProject && (
            <div className="space-y-4">
              <div>
                <Label className="text-gray-300">Company Name</Label>
                <p className="text-white mt-1">{selectedProject.companyName || 'N/A'}</p>
              </div>
              <div>
                <Label className="text-gray-300">Project ID</Label>
                <p className="text-white font-mono text-sm mt-1">{selectedProject.projectId}</p>
              </div>
              <div>
                <Label className="text-gray-300">Team Members</Label>
                <p className="text-white mt-1">
                  {selectedProject.selectedTeam?.length || 0} member{selectedProject.selectedTeam?.length !== 1 ? 's' : ''}
                </p>
              </div>
              {selectedProject.projectScope && (
                <div>
                  <Label className="text-gray-300">Project Scope</Label>
                  <p className="text-white mt-1 whitespace-pre-wrap">{selectedProject.projectScope}</p>
                </div>
              )}
              {selectedProject.deliverables && (
                <div>
                  <Label className="text-gray-300">Deliverables</Label>
                  <p className="text-white mt-1 whitespace-pre-wrap">{selectedProject.deliverables}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">Created</Label>
                  <p className="text-white text-sm mt-1">
                    {selectedProject.createdAt ? formatDate(selectedProject.createdAt) : 'N/A'}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-300">Last Updated</Label>
                  <p className="text-white text-sm mt-1">
                    {selectedProject.updatedAt ? formatDate(selectedProject.updatedAt) : 'N/A'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={() => {
                    setShowViewDialog(false);
                    handleEditProject(selectedProject.projectId);
                  }}
                  className="bg-cyan-500 hover:bg-cyan-600"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Project
                </Button>
                <Button
                  onClick={() => setShowViewDialog(false)}
                  variant="outline"
                  className="border-gray-600"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              Confirm Delete
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete this project team configuration? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end pt-4">
            <Button
              onClick={() => {
                setShowDeleteDialog(false);
                setProjectToDelete(null);
              }}
              variant="outline"
              className="border-gray-600"
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectTeamAdmin;

