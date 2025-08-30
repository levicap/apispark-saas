import React, { useState } from 'react';
import Icon from '../AppIcon';

const ProjectContextBar = () => {
  const [currentProject, setCurrentProject] = useState({
    name: 'E-commerce API',
    status: 'active',
    lastModified: '2 hours ago',
    collaborators: 3,
    deploymentStatus: 'deployed'
  });

  const [isProjectSelectorOpen, setIsProjectSelectorOpen] = useState(false);

  const projects = [
    { id: 1, name: 'E-commerce API', status: 'active', lastModified: '2 hours ago' },
    { id: 2, name: 'User Management API', status: 'draft', lastModified: '1 day ago' },
    { id: 3, name: 'Payment Gateway API', status: 'testing', lastModified: '3 days ago' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': case'deployed':
        return 'text-success bg-success-100';
      case 'testing':
        return 'text-warning bg-warning-100';
      case 'draft':
        return 'text-text-secondary bg-secondary-100';
      default:
        return 'text-text-secondary bg-secondary-100';
    }
  };

  const handleProjectSelect = (project) => {
    setCurrentProject(project);
    setIsProjectSelectorOpen(false);
  };

  const handleQuickAction = (action) => {
    console.log(`Quick action: ${action}`);
  };

  return (
    <div className="bg-surface border-b border-border px-6 py-3 mt-15">
      <div className="flex items-center justify-between">
        {/* Project Info */}
        <div className="flex items-center space-x-4">
          {/* Project Selector */}
          <div className="relative">
            <button
              onClick={() => setIsProjectSelectorOpen(!isProjectSelectorOpen)}
              className="flex items-center space-x-2 px-3 py-2 bg-secondary-50 hover:bg-secondary-100 rounded-md transition-all duration-150 ease-out"
            >
              <Icon name="Folder" size={16} color="#2563EB" />
              <span className="font-medium text-text-primary">{currentProject.name}</span>
              <Icon name="ChevronDown" size={14} />
            </button>

            {/* Project Dropdown */}
            {isProjectSelectorOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-surface border border-border rounded-lg shadow-lg z-1010 animate-slide-down">
                <div className="p-2">
                  <div className="text-xs font-medium text-text-secondary uppercase tracking-wide px-3 py-2">
                    Recent Projects
                  </div>
                  {projects.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => handleProjectSelect(project)}
                      className="w-full flex items-center justify-between px-3 py-2 hover:bg-secondary-50 rounded-md transition-all duration-150 ease-out"
                    >
                      <div className="flex items-center space-x-2">
                        <Icon name="Folder" size={14} />
                        <span className="text-sm text-text-primary">{project.name}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="border-t border-border p-2">
                  <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-primary hover:bg-primary-50 rounded-md transition-all duration-150 ease-out">
                    <Icon name="Plus" size={14} />
                    <span>Create New Project</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Project Status */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(currentProject.status)}`}>
                <div className="w-1.5 h-1.5 rounded-full bg-current mr-1" />
                {currentProject.status}
              </span>
            </div>

            <div className="flex items-center space-x-1 text-text-secondary">
              <Icon name="Clock" size={14} />
              <span className="text-xs">Modified {currentProject.lastModified}</span>
            </div>

            <div className="flex items-center space-x-1 text-text-secondary">
              <Icon name="Users" size={14} />
              <span className="text-xs">{currentProject.collaborators} collaborators</span>
            </div>

            {currentProject.deploymentStatus === 'deployed' && (
              <div className="flex items-center space-x-1 text-success">
                <Icon name="CheckCircle" size={14} />
                <span className="text-xs">Deployed</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleQuickAction('save')}
            className="flex items-center space-x-1 px-3 py-1.5 bg-primary text-white text-sm rounded-md hover:bg-primary-700 transition-all duration-150 ease-out"
          >
            <Icon name="Save" size={14} />
            <span className="hidden sm:inline">Save</span>
          </button>

          <button
            onClick={() => handleQuickAction('deploy')}
            className="flex items-center space-x-1 px-3 py-1.5 bg-success text-white text-sm rounded-md hover:bg-success-600 transition-all duration-150 ease-out"
          >
            <Icon name="Rocket" size={14} />
            <span className="hidden sm:inline">Deploy</span>
          </button>

          <button
            onClick={() => handleQuickAction('share')}
            className="flex items-center space-x-1 px-3 py-1.5 bg-secondary-100 text-text-secondary text-sm rounded-md hover:bg-secondary-200 transition-all duration-150 ease-out"
          >
            <Icon name="Share2" size={14} />
            <span className="hidden sm:inline">Share</span>
          </button>

          <div className="w-px h-6 bg-border mx-2" />

          <button
            onClick={() => handleQuickAction('settings')}
            className="p-1.5 text-text-secondary hover:text-text-primary hover:bg-secondary-100 rounded-md transition-all duration-150 ease-out"
          >
            <Icon name="Settings" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectContextBar;