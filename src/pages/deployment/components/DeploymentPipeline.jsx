import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const DeploymentPipeline = ({ project }) => {
  const [showPipelineConfig, setShowPipelineConfig] = useState(false);
  const [pipelineConfig, setPipelineConfig] = useState({
    triggers: {
      pushToBranch: true,
      pullRequest: false,
      schedule: false,
      manual: true
    },
    branches: ['main', 'develop'],
    buildSteps: [
      { name: 'Install Dependencies', command: 'npm install', enabled: true },
      { name: 'Run Tests', command: 'npm test', enabled: true },
      { name: 'Build Application', command: 'npm run build', enabled: true },
      { name: 'Security Scan', command: 'npm audit', enabled: true }
    ],
    deploymentSteps: [
      { name: 'Deploy to Staging', environment: 'staging', autoApprove: false },
      { name: 'Run Integration Tests', command: 'npm run test:integration', enabled: true },
      { name: 'Deploy to Production', environment: 'production', autoApprove: false }
    ],
    notifications: {
      email: true,
      slack: false,
      webhook: false
    }
  });
  const pipelineStages = [
    {
      id: 'build',
      name: 'Build',
      status: 'completed',
      duration: '2m 34s',
      icon: 'Hammer',
      description: 'Compile and package application'
    },
    {
      id: 'test',
      name: 'Test',
      status: 'completed',
      duration: '1m 12s',
      icon: 'TestTube',
      description: 'Run unit and integration tests'
    },
    {
      id: 'security',
      name: 'Security Scan',
      status: 'in-progress',
      duration: '45s',
      icon: 'Shield',
      description: 'Security vulnerability scan'
    },
    {
      id: 'deploy-staging',
      name: 'Deploy to Staging',
      status: 'pending',
      duration: null,
      icon: 'Upload',
      description: 'Deploy to staging environment'
    },
    {
      id: 'approve',
      name: 'Manual Approval',
      status: 'pending',
      duration: null,
      icon: 'CheckCircle',
      description: 'Manual approval for production'
    },
    {
      id: 'deploy-prod',
      name: 'Deploy to Production',
      status: 'pending',
      duration: null,
      icon: 'Rocket',
      description: 'Deploy to production environment'
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return { icon: 'CheckCircle', color: 'text-green-600' };
      case 'in-progress': return { icon: 'Clock', color: 'text-blue-600' };
      case 'failed': return { icon: 'XCircle', color: 'text-red-600' };
      case 'pending': return { icon: 'Circle', color: 'text-gray-400' };
      default: return { icon: 'Circle', color: 'text-gray-400' };
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 border-green-200';
      case 'in-progress': return 'bg-blue-100 border-blue-200';
      case 'failed': return 'bg-red-100 border-red-200';
      case 'pending': return 'bg-gray-50 border-gray-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="p-6">
      {/* Pipeline Overview */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Deployment Pipeline</h2>
            <p className="text-muted-foreground">Automated CI/CD pipeline for {project?.name}</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" iconName="Play" iconPosition="left">
              Run Pipeline
            </Button>
            <Button variant="outline" size="sm" iconName="Settings" iconPosition="left">
              Configure
            </Button>
          </div>
        </div>

        {/* Pipeline Status */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Icon name="GitBranch" size={20} className="text-green-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-foreground">Latest Build</div>
                <div className="text-xs text-muted-foreground">#1234 - main branch</div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Icon name="Clock" size={20} className="text-blue-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-foreground">Duration</div>
                <div className="text-xs text-muted-foreground">4m 31s elapsed</div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Icon name="CheckCircle" size={20} className="text-green-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-foreground">Success Rate</div>
                <div className="text-xs text-muted-foreground">96.5% (last 30 days)</div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Icon name="Users" size={20} className="text-orange-600" />
              </div>
              <div>
                <div className="text-sm font-medium text-foreground">Triggered By</div>
                <div className="text-xs text-muted-foreground">Alex Johnson</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline Stages */}
      <div className="space-y-4">
        {pipelineStages.map((stage, index) => {
          const statusInfo = getStatusIcon(stage.status);
          return (
            <div key={stage.id} className={`border rounded-lg p-4 ${getStatusColor(stage.status)}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Icon name={statusInfo.icon} size={20} className={statusInfo.color} />
                    <span className="text-sm font-medium text-foreground">{index + 1}.</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Icon name={stage.icon} size={18} className="text-muted-foreground" />
                    <div>
                      <div className="font-medium text-foreground">{stage.name}</div>
                      <div className="text-sm text-muted-foreground">{stage.description}</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {stage.duration && (
                    <span className="text-sm text-muted-foreground">{stage.duration}</span>
                  )}
                  
                  {stage.status === 'in-progress' && (
                    <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                  )}
                  
                  {stage.status === 'pending' && stage.id === 'approve' && (
                    <Button variant="default" size="sm">
                      Approve
                    </Button>
                  )}
                  
                  <Button variant="ghost" size="sm">
                    <Icon name="MoreHorizontal" size={16} />
                  </Button>
                </div>
              </div>

              {/* Stage Details for In-Progress */}
              {stage.status === 'in-progress' && (
                <div className="mt-4 pl-8">
                  <div className="bg-blue-50 border border-blue-200 rounded p-3">
                    <div className="text-sm text-foreground mb-2">Running security scan...</div>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">65% complete</div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Pipeline Configuration */}
      <div className="mt-8 p-6 bg-muted rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">Pipeline Configuration</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPipelineConfig(true)}
            iconName="Settings"
            iconPosition="left"
          >
            Configure Pipeline
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-foreground mb-2">Triggers</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Icon name="GitBranch" size={14} />
                <span>Push to main branch</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="GitPullRequest" size={14} />
                <span>Pull request to main</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Clock" size={14} />
                <span>Scheduled: Daily at 2:00 AM</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-foreground mb-2">Notifications</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Icon name="Mail" size={14} />
                <span>Email on failure</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="MessageSquare" size={14} />
                <span>Slack notifications</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Webhook" size={14} />
                <span>Custom webhooks</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline Configuration Modal */}
      {showPipelineConfig && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Pipeline Configuration</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPipelineConfig(false)}
                iconName="X"
              />
            </div>

            <div className="p-6 space-y-6">
              {/* Triggers Section */}
              <div>
                <h4 className="text-md font-medium text-foreground mb-4">Pipeline Triggers</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border border-border rounded">
                    <div>
                      <div className="font-medium text-foreground">Push to Branch</div>
                      <div className="text-sm text-muted-foreground">Trigger pipeline on git push</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={pipelineConfig.triggers.pushToBranch}
                      onChange={(e) => setPipelineConfig(prev => ({
                        ...prev,
                        triggers: { ...prev.triggers, pushToBranch: e.target.checked }
                      }))}
                      className="rounded border-border"
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 border border-border rounded">
                    <div>
                      <div className="font-medium text-foreground">Pull Requests</div>
                      <div className="text-sm text-muted-foreground">Trigger on pull request creation</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={pipelineConfig.triggers.pullRequest}
                      onChange={(e) => setPipelineConfig(prev => ({
                        ...prev,
                        triggers: { ...prev.triggers, pullRequest: e.target.checked }
                      }))}
                      className="rounded border-border"
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 border border-border rounded">
                    <div>
                      <div className="font-medium text-foreground">Scheduled Builds</div>
                      <div className="text-sm text-muted-foreground">Run on a schedule (e.g., nightly)</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={pipelineConfig.triggers.schedule}
                      onChange={(e) => setPipelineConfig(prev => ({
                        ...prev,
                        triggers: { ...prev.triggers, schedule: e.target.checked }
                      }))}
                      className="rounded border-border"
                    />
                  </div>
                </div>
              </div>

              {/* Build Steps */}
              <div>
                <h4 className="text-md font-medium text-foreground mb-4">Build Steps</h4>
                <div className="space-y-3">
                  {pipelineConfig.buildSteps.map((step, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 border border-border rounded">
                      <input
                        type="checkbox"
                        checked={step.enabled}
                        onChange={(e) => {
                          const updatedSteps = [...pipelineConfig.buildSteps];
                          updatedSteps[index].enabled = e.target.checked;
                          setPipelineConfig(prev => ({ ...prev, buildSteps: updatedSteps }));
                        }}
                        className="rounded border-border"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-foreground">{step.name}</div>
                        <div className="text-sm text-muted-foreground font-mono">{step.command}</div>
                      </div>
                      <Button variant="ghost" size="sm" iconName="Edit" />
                    </div>
                  ))}
                  <Button variant="outline" size="sm" iconName="Plus" iconPosition="left">
                    Add Build Step
                  </Button>
                </div>
              </div>

              {/* Deployment Steps */}
              <div>
                <h4 className="text-md font-medium text-foreground mb-4">Deployment Steps</h4>
                <div className="space-y-3">
                  {pipelineConfig.deploymentSteps.map((step, index) => (
                    <div key={index} className="p-3 border border-border rounded">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium text-foreground">{step.name}</div>
                        <div className="flex items-center space-x-2">
                          {step.environment && (
                            <span className="px-2 py-1 bg-muted text-xs rounded">
                              {step.environment}
                            </span>
                          )}
                          <input
                            type="checkbox"
                            checked={step.autoApprove || false}
                            className="rounded border-border"
                          />
                          <span className="text-sm text-muted-foreground">Auto-approve</span>
                        </div>
                      </div>
                      {step.command && (
                        <div className="text-sm text-muted-foreground font-mono">{step.command}</div>
                      )}
                    </div>
                  ))}
                  <Button variant="outline" size="sm" iconName="Plus" iconPosition="left">
                    Add Deployment Step
                  </Button>
                </div>
              </div>

              {/* Notifications */}
              <div>
                <h4 className="text-md font-medium text-foreground mb-4">Notifications</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">Email Notifications</span>
                      <input
                        type="checkbox"
                        checked={pipelineConfig.notifications.email}
                        onChange={(e) => setPipelineConfig(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, email: e.target.checked }
                        }))}
                        className="rounded border-border"
                      />
                    </div>
                    <Input
                      placeholder="team@company.com"
                      label="Email Recipients"
                      disabled={!pipelineConfig.notifications.email}
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">Slack Notifications</span>
                      <input
                        type="checkbox"
                        checked={pipelineConfig.notifications.slack}
                        onChange={(e) => setPipelineConfig(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, slack: e.target.checked }
                        }))}
                        className="rounded border-border"
                      />
                    </div>
                    <Input
                      placeholder="#deployments"
                      label="Slack Channel"
                      disabled={!pipelineConfig.notifications.slack}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
              <Button variant="outline" onClick={() => setShowPipelineConfig(false)}>
                Cancel
              </Button>
              <Button variant="default">
                Save Configuration
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeploymentPipeline;