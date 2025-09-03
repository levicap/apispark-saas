import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DeploymentHistory = ({ project }) => {
  const [filter, setFilter] = useState('all');

  const deploymentHistory = [
    {
      id: 'deploy_1',
      version: 'v1.2.3',
      environment: 'Production',
      status: 'success',
      deployedAt: '2024-01-15T10:30:00Z',
      deployedBy: 'Alex Johnson',
      branch: 'main',
      commit: 'a1b2c3d',
      commitMessage: 'Fix authentication bug and improve performance',
      duration: '3m 45s',
      rollbackAvailable: true
    },
    {
      id: 'deploy_2',
      version: 'v1.2.2',
      environment: 'Staging',
      status: 'success',
      deployedAt: '2024-01-14T15:45:00Z',
      deployedBy: 'Sarah Miller',
      branch: 'main',
      commit: 'e4f5g6h',
      commitMessage: 'Add new endpoint for user preferences',
      duration: '2m 18s',
      rollbackAvailable: true
    },
    {
      id: 'deploy_3',
      version: 'v1.2.1',
      environment: 'Production',
      status: 'failed',
      deployedAt: '2024-01-13T09:20:00Z',
      deployedBy: 'Mike Chen',
      branch: 'hotfix/security-patch',
      commit: 'i7j8k9l',
      commitMessage: 'Security patch for JWT validation',
      duration: '1m 52s',
      error: 'Database migration failed',
      rollbackAvailable: false
    },
    {
      id: 'deploy_4',
      version: 'v1.2.0',
      environment: 'Development',
      status: 'success',
      deployedAt: '2024-01-12T14:10:00Z',
      deployedBy: 'Alex Johnson',
      branch: 'develop',
      commit: 'm1n2o3p',
      commitMessage: 'Major release with new features',
      duration: '5m 12s',
      rollbackAvailable: true
    },
    {
      id: 'deploy_5',
      version: 'v1.1.9',
      environment: 'Production',
      status: 'rolled-back',
      deployedAt: '2024-01-11T11:30:00Z',
      deployedBy: 'Sarah Miller',
      branch: 'main',
      commit: 'q4r5s6t',
      commitMessage: 'Performance improvements',
      duration: '2m 45s',
      rollbackReason: 'High error rate detected',
      rollbackAvailable: false
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'rolled-back': return 'text-yellow-600 bg-yellow-100';
      case 'in-progress': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return 'CheckCircle';
      case 'failed': return 'XCircle';
      case 'rolled-back': return 'RotateCcw';
      case 'in-progress': return 'Clock';
      default: return 'Circle';
    }
  };

  const getEnvironmentColor = (environment) => {
    switch (environment.toLowerCase()) {
      case 'production': return 'text-red-600 bg-red-100';
      case 'staging': return 'text-orange-600 bg-orange-100';
      case 'development': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const filteredHistory = deploymentHistory.filter(deployment => {
    if (filter === 'all') return true;
    return deployment.status === filter;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Deployment History</h2>
          <p className="text-muted-foreground">Track all deployments for {project?.name}</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
          >
            <option value="all">All Deployments</option>
            <option value="success">Successful</option>
            <option value="failed">Failed</option>
            <option value="rolled-back">Rolled Back</option>
          </select>
          
          <Button variant="outline" size="sm" iconName="Download" iconPosition="left">
            Export
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Icon name="Activity" size={20} className="text-blue-600" />
            </div>
            <div>
              <div className="text-lg font-semibold text-foreground">24</div>
              <div className="text-sm text-muted-foreground">Total Deployments</div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Icon name="CheckCircle" size={20} className="text-green-600" />
            </div>
            <div>
              <div className="text-lg font-semibold text-foreground">21</div>
              <div className="text-sm text-muted-foreground">Successful</div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Icon name="XCircle" size={20} className="text-red-600" />
            </div>
            <div>
              <div className="text-lg font-semibold text-foreground">2</div>
              <div className="text-sm text-muted-foreground">Failed</div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <Icon name="RotateCcw" size={20} className="text-yellow-600" />
            </div>
            <div>
              <div className="text-lg font-semibold text-foreground">1</div>
              <div className="text-sm text-muted-foreground">Rolled Back</div>
            </div>
          </div>
        </div>
      </div>

      {/* Deployment List */}
      <div className="space-y-4">
        {filteredHistory.map((deployment) => (
          <div key={deployment.id} className="bg-card border border-border rounded-lg p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <Icon 
                  name={getStatusIcon(deployment.status)} 
                  size={20} 
                  className={getStatusColor(deployment.status).split(' ')[0]} 
                />
                
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="font-semibold text-foreground">{deployment.version}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEnvironmentColor(deployment.environment)}`}>
                      {deployment.environment}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(deployment.status)}`}>
                      {deployment.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <Icon name="User" size={14} />
                        <span>Deployed by {deployment.deployedBy}</span>
                      </div>
                      <div className="flex items-center space-x-2 mb-1">
                        <Icon name="Calendar" size={14} />
                        <span>{formatDate(deployment.deployedAt)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Icon name="Clock" size={14} />
                        <span>Duration: {deployment.duration}</span>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <Icon name="GitBranch" size={14} />
                        <span>{deployment.branch}</span>
                      </div>
                      <div className="flex items-center space-x-2 mb-1">
                        <Icon name="GitCommit" size={14} />
                        <span className="font-mono">{deployment.commit}</span>
                      </div>
                      <div className="text-xs">{deployment.commitMessage}</div>
                    </div>
                  </div>

                  {deployment.error && (
                    <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center space-x-2 text-red-600">
                        <Icon name="AlertCircle" size={16} />
                        <span className="font-medium">Error:</span>
                      </div>
                      <div className="text-sm text-red-600 mt-1">{deployment.error}</div>
                    </div>
                  )}

                  {deployment.rollbackReason && (
                    <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center space-x-2 text-yellow-600">
                        <Icon name="RotateCcw" size={16} />
                        <span className="font-medium">Rollback Reason:</span>
                      </div>
                      <div className="text-sm text-yellow-600 mt-1">{deployment.rollbackReason}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                {deployment.rollbackAvailable && deployment.status === 'success' && (
                  <Button variant="outline" size="sm" iconName="RotateCcw">
                    Rollback
                  </Button>
                )}
                
                <Button variant="outline" size="sm" iconName="ExternalLink">
                  View Logs
                </Button>
                
                <Button variant="ghost" size="sm">
                  <Icon name="MoreHorizontal" size={16} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredHistory.length === 0 && (
        <div className="text-center py-12">
          <Icon name="History" size={48} className="mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium text-foreground mb-2">No Deployments Found</h3>
          <p className="text-muted-foreground">No deployments match the selected filter.</p>
        </div>
      )}
    </div>
  );
};

export default DeploymentHistory;