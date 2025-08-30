import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const ProjectCard = ({ project, onOpen, onDuplicate, onShare, onDelete }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })?.format(new Date(date));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-success text-success-foreground';
      case 'draft': return 'bg-warning text-warning-foreground';
      case 'archived': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 group">
      {/* Project Thumbnail */}
      <div className="relative h-32 bg-muted overflow-hidden">
        <Image
          src={project?.thumbnail}
          alt={`${project?.name} preview`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        
        {/* Status Badge */}
        <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project?.status)}`}>
          {project?.status}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="bg-white/90 hover:bg-white text-foreground"
              iconName="MoreVertical"
              iconSize={16}
            />
            
            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-40 bg-popover border border-border rounded-md shadow-lg z-50">
                <button
                  onClick={() => {
                    onDuplicate(project);
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2"
                >
                  <Icon name="Copy" size={14} />
                  Duplicate
                </button>
                <button
                  onClick={() => {
                    onShare(project);
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2"
                >
                  <Icon name="Share2" size={14} />
                  Share
                </button>
                <button
                  onClick={() => {
                    onDelete(project);
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-muted text-error flex items-center gap-2"
                >
                  <Icon name="Trash2" size={14} />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Project Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-foreground text-lg truncate pr-2">{project?.name}</h3>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Icon name="Users" size={12} />
            <span>{project?.collaborators}</span>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{project?.description}</p>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
          <span>Modified {formatDate(project?.lastModified)}</span>
          <div className="flex items-center gap-1">
            <Icon name="Globe" size={12} />
            <span>{project?.endpoints} endpoints</span>
          </div>
        </div>

        {/* Collaboration Indicators */}
        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {project?.recentCollaborators?.slice(0, 3)?.map((collaborator, index) => (
              <div
                key={collaborator?.id}
                className="w-6 h-6 rounded-full border-2 border-card bg-muted flex items-center justify-center text-xs font-medium"
                title={collaborator?.name}
              >
                {collaborator?.avatar ? (
                  <Image
                    src={collaborator?.avatar}
                    alt={collaborator?.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-foreground">{collaborator?.name?.charAt(0)}</span>
                )}
              </div>
            ))}
            {project?.recentCollaborators?.length > 3 && (
              <div className="w-6 h-6 rounded-full border-2 border-card bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
                +{project?.recentCollaborators?.length - 3}
              </div>
            )}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpen(project)}
            iconName="ExternalLink"
            iconSize={14}
          >
            Open
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;