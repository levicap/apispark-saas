import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const ProjectDetailsModal = ({ project, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen || !project) return null;

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const formatDateShort = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-success text-success-foreground';
      case 'draft': return 'bg-warning text-warning-foreground';
      case 'archived': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getMethodColor = (method) => {
    switch (method) {
      case 'GET': return 'bg-green-100 text-green-800';
      case 'POST': return 'bg-blue-100 text-blue-800';
      case 'PUT': return 'bg-orange-100 text-orange-800';
      case 'DELETE': return 'bg-red-100 text-red-800';
      case 'PATCH': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: 'Info' },
    { id: 'team', name: 'Team', icon: 'Users' },
    { id: 'apikeys', name: 'API Keys', icon: 'Key' },
    { id: 'endpoints', name: 'Endpoints', icon: 'Globe' },
    { id: 'entities', name: 'Entities', icon: 'Database' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface border border-border rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden">
              <Image
                src={project.thumbnail}
                alt={project.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">{project.name}</h2>
              <div className="flex items-center space-x-3 mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
                <span className="text-sm text-muted-foreground">
                  Created {formatDateShort(project.createdAt)} by {project.createdBy?.name}
                </span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-primary text-primary bg-primary/5'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <Icon name={tab.icon} size={16} />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-foreground mb-2">Description</h3>
                <p className="text-muted-foreground">{project.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="Globe" size={16} className="text-primary" />
                    <span className="text-sm font-medium text-foreground">Endpoints</span>
                  </div>
                  <div className="text-2xl font-bold text-foreground">{project.endpoints}</div>
                </div>

                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="Database" size={16} className="text-accent" />
                    <span className="text-sm font-medium text-foreground">Entities</span>
                  </div>
                  <div className="text-2xl font-bold text-foreground">{project.entities}</div>
                </div>

                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="Users" size={16} className="text-success" />
                    <span className="text-sm font-medium text-foreground">Team Members</span>
                  </div>
                  <div className="text-2xl font-bold text-foreground">{project.collaborators}</div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-foreground mb-3">Project Timeline</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Icon name="Plus" size={16} className="text-success" />
                      <span className="text-sm text-foreground">Project Created</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{formatDate(project.createdAt)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Icon name="Edit" size={16} className="text-warning" />
                      <span className="text-sm text-foreground">Last Modified</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{formatDate(project.lastModified)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-foreground">Team Members ({project.collaborators})</h3>
                <Button variant="outline" size="sm">
                  <Icon name="UserPlus" size={14} />
                  Add Member
                </Button>
              </div>

              <div className="space-y-3">
                {project.recentCollaborators?.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        {member.avatar ? (
                          <Image
                            src={member.avatar}
                            alt={member.name}
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-primary font-medium">{member.name.charAt(0)}</span>
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{member.name}</div>
                        <div className="text-sm text-muted-foreground">{member.role}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">Joined</div>
                      <div className="text-sm text-foreground">{formatDateShort(member.joinedAt)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'apikeys' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-foreground">API Keys ({project.apiKeys?.length || 0})</h3>
                <Button variant="outline" size="sm">
                  <Icon name="Plus" size={14} />
                  Generate Key
                </Button>
              </div>

              <div className="space-y-3">
                {project.apiKeys?.map((apiKey) => (
                  <div key={apiKey.id} className="p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Icon name="Key" size={16} className="text-warning" />
                        <div>
                          <div className="font-medium text-foreground">{apiKey.name}</div>
                          <div className="text-xs text-muted-foreground">
                            Created by {apiKey.createdBy} on {formatDateShort(apiKey.createdAt)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          apiKey.status === 'active' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                        }`}>
                          {apiKey.status}
                        </span>
                        <Button variant="ghost" size="sm">
                          <Icon name="MoreHorizontal" size={14} />
                        </Button>
                      </div>
                    </div>
                    <div className="bg-surface border border-border rounded p-3 font-mono text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">{apiKey.key}</span>
                        <Button variant="ghost" size="sm">
                          <Icon name="Copy" size={14} />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      Last used: {formatDate(apiKey.lastUsed)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'endpoints' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-foreground">Recent Endpoints ({project.endpoints})</h3>
                <Button variant="outline" size="sm">
                  <Icon name="Plus" size={14} />
                  Add Endpoint
                </Button>
              </div>

              <div className="space-y-3">
                {project.recentEndpoints?.map((endpoint) => (
                  <div key={endpoint.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getMethodColor(endpoint.method)}`}>
                        {endpoint.method}
                      </span>
                      <div>
                        <div className="font-mono text-sm text-foreground">{endpoint.path}</div>
                        <div className="text-xs text-muted-foreground">
                          Created by {endpoint.createdBy} on {formatDateShort(endpoint.createdAt)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        endpoint.status === 'active' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                      }`}>
                        {endpoint.status}
                      </span>
                      <Button variant="ghost" size="sm">
                        <Icon name="ExternalLink" size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center py-4">
                <Button variant="outline">
                  View All {project.endpoints} Endpoints
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'entities' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-foreground">Database Entities ({project.entities})</h3>
                <Button variant="outline" size="sm">
                  <Icon name="Plus" size={14} />
                  Add Entity
                </Button>
              </div>

              <div className="space-y-3">
                {project.recentEntities?.map((entity) => (
                  <div key={entity.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Icon name="Database" size={16} className="text-accent" />
                      <div>
                        <div className="font-medium text-foreground">{entity.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {entity.fields} fields • Created by {entity.createdBy} on {formatDateShort(entity.createdAt)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">Last Modified</div>
                      <div className="text-sm text-foreground">{formatDateShort(entity.lastModified)}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center py-4">
                <Button variant="outline">
                  View All {project.entities} Entities
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsModal;