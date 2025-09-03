import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const DeploymentEnvironments = ({ environments, onDeploy, deploymentInProgress, selectedEnvironment }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [selectedEnvForConfig, setSelectedEnvForConfig] = useState(null);
  const [newEnvironment, setNewEnvironment] = useState({
    name: '',
    type: 'development',
    url: '',
    branch: 'main',
    autoDeployEnabled: false,
    dockerImage: '',
    buildCommand: '',
    startCommand: '',
    environmentVariables: [],
    domains: [],
    resourceLimits: {
      cpu: '1',
      memory: '512',
      storage: '10'
    }
  });
  
  const handleCreateEnvironment = () => {
    console.log('Creating environment:', newEnvironment);
    setShowCreateModal(false);
    setNewEnvironment({
      name: '',
      type: 'development',
      url: '',
      branch: 'main',
      autoDeployEnabled: false,
      dockerImage: '',
      buildCommand: '',
      startCommand: '',
      environmentVariables: [],
      domains: [],
      resourceLimits: {
        cpu: '1',
        memory: '512',
        storage: '10'
      }
    });
  };

  const handleConfigureEnvironment = (env) => {
    setSelectedEnvForConfig(env);
    setShowConfigModal(true);
  };

  const addEnvironmentVariable = () => {
    setNewEnvironment(prev => ({
      ...prev,
      environmentVariables: [...prev.environmentVariables, { key: '', value: '', isSecret: false }]
    }));
  };

  const removeEnvironmentVariable = (index) => {
    setNewEnvironment(prev => ({
      ...prev,
      environmentVariables: prev.environmentVariables.filter((_, i) => i !== index)
    }));
  };

  const updateEnvironmentVariable = (index, field, value) => {
    setNewEnvironment(prev => ({
      ...prev,
      environmentVariables: prev.environmentVariables.map((envVar, i) => 
        i === index ? { ...envVar, [field]: value } : envVar
      )
    }));
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'deploying': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getHealthColor = (health) => {
    switch (health) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
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

  return (
    <div className="p-6">
      {/* Header with Create Button */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Deployment Environments</h2>
          <p className="text-muted-foreground">Manage and configure your deployment environments</p>
        </div>
        <Button
          variant="default"
          onClick={() => setShowCreateModal(true)}
          iconName="Plus"
          iconPosition="left"
        >
          Create Environment
        </Button>
      </div>

      {/* Environment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {environments.map((env) => (
          <div key={env.id} className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow">
            {/* Environment Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">{env.name}</h3>
                <p className="text-sm text-muted-foreground capitalize">{env.type}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(env.status)}`}>
                {env.status}
              </span>
            </div>

            {/* Environment Details */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center space-x-2">
                <Icon name="Globe" size={14} className="text-muted-foreground" />
                <a 
                  href={env.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  {env.url}
                </a>
              </div>
              
              <div className="flex items-center space-x-2">
                <Icon name="GitBranch" size={14} className="text-muted-foreground" />
                <span className="text-sm text-foreground">{env.branch}</span>
                <span className="text-xs text-muted-foreground">({env.version})</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Icon name="Calendar" size={14} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Last deployed {formatDate(env.lastDeployment)}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <Icon name="Server" size={14} className="text-muted-foreground" />
                <span className="text-sm text-foreground">{env.replicas} replicas</span>
                <Icon name={env.health === 'healthy' ? 'CheckCircle' : 'AlertCircle'} 
                      size={14} 
                      className={getHealthColor(env.health)} />
                <span className={`text-sm ${getHealthColor(env.health)}`}>
                  {env.health}
                </span>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-muted rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">CPU</span>
                  <span className="text-sm font-medium text-foreground">{env.metrics.cpu}%</span>
                </div>
                <div className="w-full bg-background rounded-full h-1.5 mt-2">
                  <div 
                    className="bg-primary h-1.5 rounded-full" 
                    style={{ width: `${env.metrics.cpu}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="bg-muted rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Memory</span>
                  <span className="text-sm font-medium text-foreground">{env.metrics.memory}%</span>
                </div>
                <div className="w-full bg-background rounded-full h-1.5 mt-2">
                  <div 
                    className="bg-primary h-1.5 rounded-full" 
                    style={{ width: `${env.metrics.memory}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="bg-muted rounded-lg p-3">
                <div className="text-xs text-muted-foreground">Requests/min</div>
                <div className="text-sm font-medium text-foreground">{env.metrics.requests}</div>
              </div>
              
              <div className="bg-muted rounded-lg p-3">
                <div className="text-xs text-muted-foreground">Uptime</div>
                <div className="text-sm font-medium text-foreground">{env.metrics.uptime}</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
              <Button
                variant="default"
                size="sm"
                className="flex-1"
                onClick={() => onDeploy(env.id)}
                loading={deploymentInProgress && selectedEnvironment === env.id}
                iconName="Upload"
                iconPosition="left"
              >
                Deploy
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName="Settings"
                onClick={() => handleConfigureEnvironment(env)}
              />
              <Button
                variant="outline"
                size="sm"
                iconName="MoreHorizontal"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Deploy Section */}
      <div className="p-6 bg-muted rounded-lg">
        <h3 className="text-lg font-semibold text-foreground mb-4">Quick Deploy</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            className="h-auto p-4 justify-start"
            iconName="GitBranch"
            iconPosition="left"
          >
            <div className="text-left">
              <div className="font-medium">Deploy from Git</div>
              <div className="text-xs text-muted-foreground">Deploy latest commit</div>
            </div>
          </Button>
          
          <Button
            variant="outline"
            className="h-auto p-4 justify-start"
            iconName="Package"
            iconPosition="left"
          >
            <div className="text-left">
              <div className="font-medium">Deploy Container</div>
              <div className="text-xs text-muted-foreground">Deploy Docker image</div>
            </div>
          </Button>
          
          <Button
            variant="outline"
            className="h-auto p-4 justify-start"
            iconName="Upload"
            iconPosition="left"
          >
            <div className="text-left">
              <div className="font-medium">Manual Upload</div>
              <div className="text-xs text-muted-foreground">Upload build files</div>
            </div>
          </Button>
        </div>
      </div>

      {/* Create Environment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Create New Environment</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCreateModal(false)}
                iconName="X"
              />
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h4 className="text-md font-medium text-foreground mb-4">Basic Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Environment Name"
                    value={newEnvironment.name}
                    onChange={(e) => setNewEnvironment(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Production, Staging"
                    required
                  />
                  <Select
                    label="Environment Type"
                    value={newEnvironment.type}
                    onChange={(value) => setNewEnvironment(prev => ({ ...prev, type: value }))}
                    options={[
                      { value: 'development', label: 'Development' },
                      { value: 'staging', label: 'Staging' },
                      { value: 'production', label: 'Production' },
                      { value: 'testing', label: 'Testing' }
                    ]}
                  />
                  <Input
                    label="Environment URL"
                    value={newEnvironment.url}
                    onChange={(e) => setNewEnvironment(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="https://api.example.com"
                  />
                  <Input
                    label="Git Branch"
                    value={newEnvironment.branch}
                    onChange={(e) => setNewEnvironment(prev => ({ ...prev, branch: e.target.value }))}
                    placeholder="main"
                  />
                </div>
              </div>

              {/* Build Configuration */}
              <div>
                <h4 className="text-md font-medium text-foreground mb-4">Build Configuration</h4>
                <div className="grid grid-cols-1 gap-4">
                  <Input
                    label="Docker Image (Optional)"
                    value={newEnvironment.dockerImage}
                    onChange={(e) => setNewEnvironment(prev => ({ ...prev, dockerImage: e.target.value }))}
                    placeholder="node:18-alpine"
                  />
                  <Input
                    label="Build Command"
                    value={newEnvironment.buildCommand}
                    onChange={(e) => setNewEnvironment(prev => ({ ...prev, buildCommand: e.target.value }))}
                    placeholder="npm run build"
                  />
                  <Input
                    label="Start Command"
                    value={newEnvironment.startCommand}
                    onChange={(e) => setNewEnvironment(prev => ({ ...prev, startCommand: e.target.value }))}
                    placeholder="npm start"
                  />
                </div>
              </div>

              {/* Resource Limits */}
              <div>
                <h4 className="text-md font-medium text-foreground mb-4">Resource Limits</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="CPU (Cores)"
                    type="number"
                    value={newEnvironment.resourceLimits.cpu}
                    onChange={(e) => setNewEnvironment(prev => ({
                      ...prev,
                      resourceLimits: { ...prev.resourceLimits, cpu: e.target.value }
                    }))}
                    placeholder="1"
                    min="0.5"
                    step="0.5"
                  />
                  <Input
                    label="Memory (MB)"
                    type="number"
                    value={newEnvironment.resourceLimits.memory}
                    onChange={(e) => setNewEnvironment(prev => ({
                      ...prev,
                      resourceLimits: { ...prev.resourceLimits, memory: e.target.value }
                    }))}
                    placeholder="512"
                    min="256"
                    step="256"
                  />
                  <Input
                    label="Storage (GB)"
                    type="number"
                    value={newEnvironment.resourceLimits.storage}
                    onChange={(e) => setNewEnvironment(prev => ({
                      ...prev,
                      resourceLimits: { ...prev.resourceLimits, storage: e.target.value }
                    }))}
                    placeholder="10"
                    min="1"
                    step="1"
                  />
                </div>
              </div>

              {/* Environment Variables */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-md font-medium text-foreground">Environment Variables</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addEnvironmentVariable}
                    iconName="Plus"
                    iconPosition="left"
                  >
                    Add Variable
                  </Button>
                </div>
                <div className="space-y-3">
                  {newEnvironment.environmentVariables.map((envVar, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Input
                        placeholder="KEY"
                        value={envVar.key}
                        onChange={(e) => updateEnvironmentVariable(index, 'key', e.target.value)}
                        className="flex-1"
                      />
                      <Input
                        placeholder="Value"
                        type={envVar.isSecret ? 'password' : 'text'}
                        value={envVar.value}
                        onChange={(e) => updateEnvironmentVariable(index, 'value', e.target.value)}
                        className="flex-1"
                      />
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={envVar.isSecret}
                          onChange={(e) => updateEnvironmentVariable(index, 'isSecret', e.target.checked)}
                          className="rounded border-border"
                        />
                        <span className="text-sm text-muted-foreground">Secret</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEnvironmentVariable(index)}
                        iconName="Trash2"
                      />
                    </div>
                  ))}
                  {newEnvironment.environmentVariables.length === 0 && (
                    <p className="text-sm text-muted-foreground">No environment variables configured</p>
                  )}
                </div>
              </div>

              {/* Deployment Settings */}
              <div>
                <h4 className="text-md font-medium text-foreground mb-4">Deployment Settings</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <div className="font-medium text-foreground">Auto Deploy</div>
                      <div className="text-sm text-muted-foreground">Automatically deploy when code is pushed to the selected branch</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={newEnvironment.autoDeployEnabled}
                      onChange={(e) => setNewEnvironment(prev => ({ ...prev, autoDeployEnabled: e.target.checked }))}
                      className="rounded border-border"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
              <Button
                variant="outline"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleCreateEnvironment}
                disabled={!newEnvironment.name}
              >
                Create Environment
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Configuration Modal */}
      {showConfigModal && selectedEnvForConfig && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Configure {selectedEnvForConfig.name}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowConfigModal(false)}
                iconName="X"
              />
            </div>

            <div className="p-6 space-y-6">
              {/* Environment Status */}
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium text-foreground mb-3">Environment Status</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Status</div>
                    <div className={`text-sm font-medium ${getStatusColor(selectedEnvForConfig.status).split(' ')[0]}`}>
                      {selectedEnvForConfig.status}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Health</div>
                    <div className={`text-sm font-medium ${getHealthColor(selectedEnvForConfig.health)}`}>
                      {selectedEnvForConfig.health}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Version</div>
                    <div className="text-sm font-medium text-foreground">{selectedEnvForConfig.version}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Replicas</div>
                    <div className="text-sm font-medium text-foreground">{selectedEnvForConfig.replicas}</div>
                  </div>
                </div>
              </div>

              {/* Environment Actions */}
              <div>
                <h4 className="font-medium text-foreground mb-3">Environment Actions</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Button variant="outline" className="justify-start" iconName="RotateCcw" iconPosition="left">
                    Restart Environment
                  </Button>
                  <Button variant="outline" className="justify-start" iconName="Pause" iconPosition="left">
                    Stop Environment
                  </Button>
                  <Button variant="outline" className="justify-start" iconName="RefreshCw" iconPosition="left">
                    Force Redeploy
                  </Button>
                  <Button variant="outline" className="justify-start" iconName="Scale" iconPosition="left">
                    Scale Resources
                  </Button>
                  <Button variant="outline" className="justify-start" iconName="FileText" iconPosition="left">
                    View Logs
                  </Button>
                  <Button variant="outline" className="justify-start" iconName="Activity" iconPosition="left">
                    View Metrics
                  </Button>
                </div>
              </div>

              {/* Configuration Options */}
              <div>
                <h4 className="font-medium text-foreground mb-3">Configuration</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border border-border rounded">
                    <div>
                      <div className="text-sm font-medium text-foreground">Auto-scaling</div>
                      <div className="text-xs text-muted-foreground">Automatically scale based on load</div>
                    </div>
                    <input type="checkbox" className="rounded border-border" />
                  </div>
                  <div className="flex items-center justify-between p-3 border border-border rounded">
                    <div>
                      <div className="text-sm font-medium text-foreground">Health checks</div>
                      <div className="text-xs text-muted-foreground">Monitor application health</div>
                    </div>
                    <input type="checkbox" className="rounded border-border" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 border border-border rounded">
                    <div>
                      <div className="text-sm font-medium text-foreground">SSL/TLS</div>
                      <div className="text-xs text-muted-foreground">Enable HTTPS</div>
                    </div>
                    <input type="checkbox" className="rounded border-border" defaultChecked />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
              <Button variant="outline" onClick={() => setShowConfigModal(false)}>
                Close
              </Button>
              <Button variant="default">
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeploymentEnvironments;