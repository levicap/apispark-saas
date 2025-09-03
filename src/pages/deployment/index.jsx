import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import DeploymentEnvironments from './components/DeploymentEnvironments';
import DeploymentPipeline from './components/DeploymentPipeline';
import DeploymentHistory from './components/DeploymentHistory';
import DeploymentSettings from './components/DeploymentSettings';
import { useProjectContext } from '../../contexts/ProjectContext';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const Deployment = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('environments');
  const [selectedEnvironment, setSelectedEnvironment] = useState(null);
  const [deploymentInProgress, setDeploymentInProgress] = useState(false);

  const { currentProject } = useProjectContext();

  // Mock user data
  const mockUser = {
    id: 'user_1',
    name: 'Alex Johnson',
    email: 'alex.johnson@apiforge.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
  };

  // Mock deployment environments
  const [environments] = useState([
    {
      id: 'dev',
      name: 'Development',
      type: 'development',
      status: 'active',
      url: 'https://dev-api.example.com',
      lastDeployment: '2024-01-15T10:30:00Z',
      version: 'v1.2.3-dev',
      branch: 'develop',
      replicas: 1,
      health: 'healthy',
      metrics: {
        cpu: 45,
        memory: 62,
        requests: 150,
        uptime: '99.8%'
      }
    },
    {
      id: 'staging',
      name: 'Staging',
      type: 'staging',
      status: 'active',
      url: 'https://staging-api.example.com',
      lastDeployment: '2024-01-14T15:45:00Z',
      version: 'v1.2.2',
      branch: 'main',
      replicas: 2,
      health: 'healthy',
      metrics: {
        cpu: 38,
        memory: 55,
        requests: 89,
        uptime: '99.9%'
      }
    },
    {
      id: 'prod',
      name: 'Production',
      type: 'production',
      status: 'active',
      url: 'https://api.example.com',
      lastDeployment: '2024-01-13T09:20:00Z',
      version: 'v1.2.1',
      branch: 'main',
      replicas: 5,
      health: 'healthy',
      metrics: {
        cpu: 72,
        memory: 68,
        requests: 2450,
        uptime: '99.99%'
      }
    }
  ]);

  const tabs = [
    { id: 'environments', name: 'Environments', icon: 'Globe' },
    { id: 'pipeline', name: 'Pipeline', icon: 'GitBranch' },
    { id: 'history', name: 'History', icon: 'History' },
    { id: 'settings', name: 'Settings', icon: 'Settings' }
  ];

  const handleDeploy = (environmentId) => {
    setDeploymentInProgress(true);
    setSelectedEnvironment(environmentId);
    
    // Simulate deployment
    setTimeout(() => {
      setDeploymentInProgress(false);
      setSelectedEnvironment(null);
    }, 3000);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'environments':
        return (
          <DeploymentEnvironments
            environments={environments}
            onDeploy={handleDeploy}
            deploymentInProgress={deploymentInProgress}
            selectedEnvironment={selectedEnvironment}
          />
        );
      case 'pipeline':
        return <DeploymentPipeline project={currentProject} />;
      case 'history':
        return <DeploymentHistory project={currentProject} />;
      case 'settings':
        return <DeploymentSettings project={currentProject} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        isCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onProjectChange={() => {}}
        user={mockUser}
      />

      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className={`
        pt-16 transition-spatial min-h-screen
        ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'}
      `}>
        <div className="h-[calc(100vh-4rem)] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border bg-surface">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Icon name="Rocket" size={24} className="text-primary" />
                <h1 className="text-2xl font-bold text-foreground">Deployment</h1>
              </div>
              {currentProject && (
                <div className="text-sm text-muted-foreground">
                  {currentProject.name}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                iconName="RefreshCw"
                iconPosition="left"
              >
                Sync Status
              </Button>
              <Button
                variant="default"
                size="sm"
                iconName="Plus"
                iconPosition="left"
                onClick={() => setActiveTab('environments')}
              >
                New Environment
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border bg-surface">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
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
          <div className="flex-1 overflow-hidden">
            {renderTabContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Deployment;