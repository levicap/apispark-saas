import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { formatDistanceToNow } from 'date-fns';

const ProjectManager = ({ 
  projects = [], 
  currentProject, 
  onCreateProject, 
  onUpdateProject, 
  onDeleteProject, 
  onDuplicateProject,
  onProjectSelect,
  isOpen = false,
  onClose 
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    framework: 'Express.js',
    database: 'PostgreSQL'
  });

  const frameworks = [
    { value: 'Express.js', label: 'Express.js (Node.js)' },
    { value: 'FastAPI', label: 'FastAPI (Python)' },
    { value: 'Spring Boot', label: 'Spring Boot (Java)' },
    { value: 'ASP.NET', label: 'ASP.NET (C#)' }
  ];

  const databases = [
    { value: 'PostgreSQL', label: 'PostgreSQL' },
    { value: 'MongoDB', label: 'MongoDB' },
    { value: 'MySQL', label: 'MySQL' },
    { value: 'SQLite', label: 'SQLite' }
  ];

  const filteredProjects = projects?.filter(project => {
    const matchesSearch = project?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
                         project?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase());
    const matchesStatus = filterStatus === 'all' || project?.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCreateProject = (e) => {
    e?.preventDefault();
    if (!formData?.name?.trim()) return;

    onCreateProject?.({
      name: formData?.name,
      description: formData?.description,
      metadata: {
        framework: formData?.framework,
        database: formData?.database
      }
    });

    setFormData({
      name: '',
      description: '',
      framework: 'Express.js',
      database: 'PostgreSQL'
    });
    setShowCreateModal(false);
  };

  const handleEditProject = (e) => {
    e?.preventDefault();
    if (!editingProject || !formData?.name?.trim()) return;

    onUpdateProject?.(editingProject?.id, {
      name: formData?.name,
      description: formData?.description,
      metadata: {
        ...editingProject?.metadata,
        framework: formData?.framework,
        database: formData?.database
      }
    });

    setShowEditModal(false);
    setEditingProject(null);
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setFormData({
      name: project?.name || '',
      description: project?.description || '',
      framework: project?.metadata?.framework || 'Express.js',
      database: project?.metadata?.database || 'PostgreSQL'
    });
    setShowEditModal(true);
  };

  const handleDelete = (projectId) => {
    if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      onDeleteProject?.(projectId);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card border border-border rounded-lg shadow-elevation-3 w-full max-w-6xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Project Manager</h1>
              <p className="text-muted-foreground mt-1">Manage your API projects and workflows</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button onClick={() => setShowCreateModal(true)}>
                <Icon name="Plus" size={16} />
                New Project
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <Icon name="X" size={20} />
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e?.target?.value)}
                className="w-full"
              />
            </div>
            <Select
              value={filterStatus}
              onChange={setFilterStatus}
              options={[
                { value: 'all', label: 'All Projects' },
                { value: 'active', label: 'Active' },
                { value: 'archived', label: 'Archived' }
              ]}
              className="w-48"
            />
          </div>
        </div>

        {/* Project List */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects?.map(project => (
              <div
                key={project?.id}
                className={`bg-surface border rounded-lg p-4 transition-smooth hover:shadow-elevation-1 cursor-pointer ${
                  currentProject?.id === project?.id ? 'border-primary' : 'border-border'
                }`}
                onClick={() => {
                  onProjectSelect?.(project);
                  onClose?.();
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground mb-1">{project?.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {project?.description}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1 ml-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e?.stopPropagation();
                        openEditModal(project);
                      }}
                      className="w-8 h-8"
                    >
                      <Icon name="Edit" size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e?.stopPropagation();
                        onDuplicateProject?.(project?.id);
                      }}
                      className="w-8 h-8"
                    >
                      <Icon name="Copy" size={14} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e?.stopPropagation();
                        handleDelete(project?.id);
                      }}
                      className="w-8 h-8 text-destructive hover:text-destructive"
                    >
                      <Icon name="Trash2" size={14} />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                  <span>{project?.metadata?.framework}</span>
                  <span>{project?.metadata?.database}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    project?.status === 'active' ?'bg-success/10 text-success' :'bg-muted text-muted-foreground'
                  }`}>
                    {project?.status}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Updated {formatDistanceToNow(new Date(project?.updatedAt))} ago
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-border">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{project?.nodes?.length || 0} nodes</span>
                    <span>v{project?.metadata?.version}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProjects?.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="FolderOpen" size={32} className="text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No projects found</h3>
              <p className="text-muted-foreground">
                {searchQuery || filterStatus !== 'all' ?'Try adjusting your search or filter criteria' :'Create your first project to get started'
                }
              </p>
            </div>
          )}
        </div>

        {/* Create Project Modal */}
        {showCreateModal && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-card border border-border rounded-lg shadow-elevation-3 w-full max-w-md p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Create New Project</h2>
              <form onSubmit={handleCreateProject} className="space-y-4">
                <Input
                  label="Project Name"
                  value={formData?.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e?.target?.value }))}
                  placeholder="Enter project name"
                  required
                />
                <Input
                  label="Description"
                  value={formData?.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e?.target?.value }))}
                  placeholder="Brief description of your project"
                />
                <Select
                  label="Framework"
                  value={formData?.framework}
                  onChange={(value) => setFormData(prev => ({ ...prev, framework: value }))}
                  options={frameworks}
                />
                <Select
                  label="Database"
                  value={formData?.database}
                  onChange={(value) => setFormData(prev => ({ ...prev, database: value }))}
                  options={databases}
                />
                <div className="flex justify-end space-x-3 pt-4">
                  <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Project</Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Project Modal */}
        {showEditModal && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-card border border-border rounded-lg shadow-elevation-3 w-full max-w-md p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Edit Project</h2>
              <form onSubmit={handleEditProject} className="space-y-4">
                <Input
                  label="Project Name"
                  value={formData?.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e?.target?.value }))}
                  placeholder="Enter project name"
                  required
                />
                <Input
                  label="Description"
                  value={formData?.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e?.target?.value }))}
                  placeholder="Brief description of your project"
                />
                <Select
                  label="Framework"
                  value={formData?.framework}
                  onChange={(value) => setFormData(prev => ({ ...prev, framework: value }))}
                  options={frameworks}
                />
                <Select
                  label="Database"
                  value={formData?.database}
                  onChange={(value) => setFormData(prev => ({ ...prev, database: value }))}
                  options={databases}
                />
                <div className="flex justify-end space-x-3 pt-4">
                  <Button variant="outline" onClick={() => setShowEditModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Update Project</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectManager;