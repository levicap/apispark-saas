import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const DeploymentSettings = ({ project }) => {
  const [activeSection, setActiveSection] = useState('general');

  const sections = [
    { id: 'general', name: 'General', icon: 'Settings' },
    { id: 'environments', name: 'Environments', icon: 'Globe' },
    { id: 'notifications', name: 'Notifications', icon: 'Bell' },
    { id: 'security', name: 'Security', icon: 'Shield' },
    { id: 'integrations', name: 'Integrations', icon: 'Plug' }
  ];

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Project Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Project Name"
            value={project?.name || ''}
            placeholder="Enter project name"
          />
          <Input
            label="Repository URL"
            value="https://github.com/example/api-project"
            placeholder="Repository URL"
          />
          <Select
            label="Default Branch"
            options={[
              { value: 'main', label: 'main' },
              { value: 'master', label: 'master' },
              { value: 'develop', label: 'develop' }
            ]}
            value="main"
          />
          <Select
            label="Build System"
            options={[
              { value: 'docker', label: 'Docker' },
              { value: 'nodejs', label: 'Node.js' },
              { value: 'python', label: 'Python' },
              { value: 'custom', label: 'Custom' }
            ]}
            value="docker"
          />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Deployment Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <div className="font-medium text-foreground">Auto-deploy on push</div>
              <div className="text-sm text-muted-foreground">Automatically deploy when changes are pushed to main branch</div>
            </div>
            <input type="checkbox" className="rounded border-border" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <div className="font-medium text-foreground">Run tests before deployment</div>
              <div className="text-sm text-muted-foreground">Ensure all tests pass before deploying</div>
            </div>
            <input type="checkbox" className="rounded border-border" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <div className="font-medium text-foreground">Enable rollback on failure</div>
              <div className="text-sm text-muted-foreground">Automatically rollback if deployment fails</div>
            </div>
            <input type="checkbox" className="rounded border-border" defaultChecked />
          </div>
        </div>
      </div>
    </div>
  );

  const renderEnvironmentSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Environment Variables</h3>
        <Button variant="outline" size="sm" iconName="Plus" iconPosition="left">
          Add Variable
        </Button>
      </div>

      <div className="space-y-4">
        {[
          { key: 'DATABASE_URL', value: '••••••••••••••••', environment: 'production' },
          { key: 'API_SECRET_KEY', value: '••••••••••••••••', environment: 'production' },
          { key: 'REDIS_URL', value: 'redis://localhost:6379', environment: 'development' },
          { key: 'LOG_LEVEL', value: 'info', environment: 'all' }
        ].map((envVar, index) => (
          <div key={index} className="flex items-center space-x-4 p-4 border border-border rounded-lg">
            <div className="flex-1">
              <div className="font-medium text-foreground">{envVar.key}</div>
              <div className="text-sm text-muted-foreground font-mono">{envVar.value}</div>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              envVar.environment === 'production' ? 'bg-red-100 text-red-800' :
              envVar.environment === 'development' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {envVar.environment}
            </span>
            <Button variant="ghost" size="sm">
              <Icon name="Edit" size={16} />
            </Button>
            <Button variant="ghost" size="sm">
              <Icon name="Trash2" size={16} />
            </Button>
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Domain Configuration</h3>
        <div className="space-y-4">
          {[
            { environment: 'Production', domain: 'api.example.com', ssl: true },
            { environment: 'Staging', domain: 'staging-api.example.com', ssl: true },
            { environment: 'Development', domain: 'dev-api.example.com', ssl: false }
          ].map((config, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div>
                <div className="font-medium text-foreground">{config.environment}</div>
                <div className="text-sm text-muted-foreground">{config.domain}</div>
              </div>
              <div className="flex items-center space-x-3">
                <div className={`flex items-center space-x-1 ${config.ssl ? 'text-green-600' : 'text-gray-400'}`}>
                  <Icon name="Shield" size={16} />
                  <span className="text-xs">SSL</span>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground">Notification Preferences</h3>
      
      <div className="space-y-4">
        <div className="p-4 border border-border rounded-lg">
          <h4 className="font-medium text-foreground mb-3">Email Notifications</h4>
          <div className="space-y-3">
            {[
              { label: 'Deployment started', checked: true },
              { label: 'Deployment completed', checked: true },
              { label: 'Deployment failed', checked: true },
              { label: 'Rollback executed', checked: true },
              { label: 'Weekly deployment summary', checked: false }
            ].map((option, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-foreground">{option.label}</span>
                <input type="checkbox" className="rounded border-border" defaultChecked={option.checked} />
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border border-border rounded-lg">
          <h4 className="font-medium text-foreground mb-3">Slack Integration</h4>
          <div className="space-y-3">
            <Input
              label="Webhook URL"
              placeholder="https://hooks.slack.com/services/..."
              value="https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX"
            />
            <Input
              label="Channel"
              placeholder="#deployments"
              value="#deployments"
            />
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Enable Slack notifications</span>
              <input type="checkbox" className="rounded border-border" defaultChecked />
            </div>
          </div>
        </div>

        <div className="p-4 border border-border rounded-lg">
          <h4 className="font-medium text-foreground mb-3">Webhook Notifications</h4>
          <div className="space-y-3">
            <Input
              label="Webhook URL"
              placeholder="https://your-app.com/webhook"
            />
            <Input
              label="Secret Token"
              type="password"
              placeholder="Enter secret token"
            />
            <Button variant="outline" size="sm">Test Webhook</Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground">Security Configuration</h3>
      
      <div className="space-y-4">
        <div className="p-4 border border-border rounded-lg">
          <h4 className="font-medium text-foreground mb-3">Access Control</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-foreground">Require approval for production deployments</div>
                <div className="text-sm text-muted-foreground">Manual approval required before deploying to production</div>
              </div>
              <input type="checkbox" className="rounded border-border" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-foreground">IP restriction</div>
                <div className="text-sm text-muted-foreground">Restrict deployments to specific IP addresses</div>
              </div>
              <input type="checkbox" className="rounded border-border" />
            </div>
          </div>
        </div>

        <div className="p-4 border border-border rounded-lg">
          <h4 className="font-medium text-foreground mb-3">API Keys</h4>
          <div className="space-y-3">
            {[
              { name: 'Production Deploy Key', created: '2024-01-10', lastUsed: '2024-01-15' },
              { name: 'CI/CD Pipeline Key', created: '2024-01-05', lastUsed: '2024-01-15' }
            ].map((key, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded">
                <div>
                  <div className="font-medium text-foreground">{key.name}</div>
                  <div className="text-xs text-muted-foreground">
                    Created: {key.created} • Last used: {key.lastUsed}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">Regenerate</Button>
                  <Button variant="outline" size="sm">Delete</Button>
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" iconName="Plus" iconPosition="left">
              Generate New Key
            </Button>
          </div>
        </div>

        <div className="p-4 border border-border rounded-lg">
          <h4 className="font-medium text-foreground mb-3">Security Scanning</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-foreground">Vulnerability scanning</div>
                <div className="text-sm text-muted-foreground">Scan for security vulnerabilities before deployment</div>
              </div>
              <input type="checkbox" className="rounded border-border" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-foreground">Dependency scanning</div>
                <div className="text-sm text-muted-foreground">Check for vulnerable dependencies</div>
              </div>
              <input type="checkbox" className="rounded border-border" defaultChecked />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderIntegrationSettings = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground">Third-party Integrations</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          {
            name: 'GitHub',
            description: 'Connect your GitHub repository',
            icon: 'Github',
            connected: true,
            status: 'Connected to example/api-project'
          },
          {
            name: 'Docker Hub',
            description: 'Deploy from Docker containers',
            icon: 'Package',
            connected: true,
            status: 'Connected to example/api-images'
          },
          {
            name: 'AWS',
            description: 'Deploy to Amazon Web Services',
            icon: 'Cloud',
            connected: false,
            status: 'Not connected'
          },
          {
            name: 'Monitoring',
            description: 'Application performance monitoring',
            icon: 'Activity',
            connected: true,
            status: 'DataDog integration active'
          }
        ].map((integration, index) => (
          <div key={index} className="p-4 border border-border rounded-lg">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                <Icon name={integration.icon} size={20} className="text-foreground" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-foreground">{integration.name}</div>
                <div className="text-sm text-muted-foreground">{integration.description}</div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className={`text-sm ${integration.connected ? 'text-green-600' : 'text-muted-foreground'}`}>
                {integration.status}
              </div>
              <Button
                variant={integration.connected ? "outline" : "default"}
                size="sm"
              >
                {integration.connected ? 'Configure' : 'Connect'}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'general': return renderGeneralSettings();
      case 'environments': return renderEnvironmentSettings();
      case 'notifications': return renderNotificationSettings();
      case 'security': return renderSecuritySettings();
      case 'integrations': return renderIntegrationSettings();
      default: return renderGeneralSettings();
    }
  };

  return (
    <div className="flex h-full">
      {/* Settings Navigation */}
      <div className="w-64 border-r border-border bg-surface p-4">
        <nav className="space-y-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors ${
                activeSection === section.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              <Icon name={section.icon} size={18} />
              <span className="text-sm font-medium">{section.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Settings Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {renderSectionContent()}
        
        {/* Save Button */}
        <div className="mt-8 pt-6 border-t border-border">
          <div className="flex space-x-2">
            <Button variant="default">Save Changes</Button>
            <Button variant="outline">Cancel</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeploymentSettings;