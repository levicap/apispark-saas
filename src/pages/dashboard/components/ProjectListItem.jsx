import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const ProjectListItem = ({ project, onOpen, onDuplicate, onShare, onDelete, onViewDetails }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center gap-4">
        {/* Project Thumbnail */}
        <div className="w-12 h-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
          <Image
            src={project?.thumbnail}
            alt={`${project?.name} preview`}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Project Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground truncate">{project?.name}</h3>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project?.status)}`}>
              {project?.status}
            </div>
          </div>
          <p className="text-sm text-muted-foreground truncate mb-2">{project?.description}</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Modified {formatDate(project?.lastModified)}</span>
            <div className="flex items-center gap-1">
              <Icon name="Globe" size={12} />
              <span>{project?.endpoints} endpoints</span>
            </div>
            <div className="flex items-center gap-1">
              <Icon name="Users" size={12} />
              <span>{project?.collaborators} members</span>
            </div>
          </div>
        </div>

        {/* Collaboration Indicators */}
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {project?.recentCollaborators?.slice(0, 3)?.map((collaborator) => (
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

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewDetails && onViewDetails(project)}
              className="text-xs"
            >
              <Icon name="Info" size={12} />
              Details
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpen(project)}
              iconName="ExternalLink"
              iconSize={14}
            >
              Open
            </Button>
            
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                iconName="MoreVertical"
                iconSize={16}
              />
              
              {isMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-40 bg-popover border border-border rounded-md shadow-lg z-50">
                  <button
                    onClick={() => {
                      onViewDetails && onViewDetails(project);
                      setIsMenuOpen(false);
                    }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2"
                  >
                    <Icon name="Info" size={14} />
                    View Details
                  </button>
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
      </div>
    </div>
  );
};

export default ProjectListItem;