import React, { useState } from 'react';
import { useProjectContext } from '../../contexts/ProjectContext';
import Icon from '../AppIcon';
import Button from './Button';

const ProjectSelector = () => {
  const { currentProject, projects, setCurrentProject } = useProjectContext();
  const [isOpen, setIsOpen] = useState(false);

  const handleProjectSelect = (project) => {
    setCurrentProject(project);
    setIsOpen(false);
  };

  const handleCreateNew = () => {
    // TODO: Implement project creation modal
    console.log('Create new project');
    setIsOpen(false);
  };

  if (!currentProject) {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
          <Icon name="Database" size={16} className="text-muted-foreground" />
        </div>
        <span className="text-sm text-muted-foreground">No project selected</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="h-8 px-3 text-left min-w-0"
      >
        <div className="flex items-center space-x-2 min-w-0">
          <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center flex-shrink-0">
            <Icon name="Database" size={12} className="text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-foreground truncate">
              {currentProject.name}
            </div>
            <div className="text-xs text-muted-foreground truncate">
              {currentProject.databaseType}
            </div>
          </div>
          <Icon 
            name={isOpen ? "ChevronUp" : "ChevronDown"} 
            size={14} 
            className="text-muted-foreground flex-shrink-0" 
          />
        </div>
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-50" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-1 w-80 bg-popover border border-border rounded-lg shadow-elevation-2 z-50">
            <div className="p-3 border-b border-border">
              <h3 className="text-sm font-medium text-foreground">Select Project</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Choose a project to work on
              </p>
            </div>
            
            <div className="max-h-64 overflow-y-auto">
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => handleProjectSelect(project)}
                  className={`w-full p-3 text-left hover:bg-muted transition-smooth ${
                    currentProject.id === project.id ? 'bg-muted' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      currentProject.id === project.id 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      <Icon name="Database" size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground truncate">
                        {project.name}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {project.description}
                      </div>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                        <span>{project.databaseType}</span>
                        <span>{project.collaborators} collaborators</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          project.status === 'active' 
                            ? 'bg-success/10 text-success' 
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {project.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            
            <div className="p-3 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCreateNew}
                className="w-full"
                iconName="Plus"
                iconPosition="left"
              >
                Create New Project
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProjectSelector; 