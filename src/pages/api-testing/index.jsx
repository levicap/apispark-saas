import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Button from '../../components/ui/Button';
import RequestBuilder from './components/RequestBuilder';
import ResponseViewer from './components/ResponseViewer';
import EnvironmentManager from './components/EnvironmentManager';
import RequestCollections from './components/RequestCollections';
import TestRunner from './components/TestRunner';
import { useProjectContext } from '../../contexts/ProjectContext';

// Simple Icon component for now
const Icon = ({ name, size = 16, className = '' }) => (
  <span className={`inline-block ${className}`} style={{ width: size, height: size }}>
    {name === 'Globe' && '🌐'}
    {name === 'Folder' && '📁'}
    {name === 'Play' && '▶️'}
    {name === 'CheckCircle' && '✅'}
    {name === 'Edit' && '✏️'}
    {name === 'Settings' && '⚙️'}
  </span>
);

const APITesting = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('builder');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [testResults, setTestResults] = useState([]);
  const [showEnvironmentManager, setShowEnvironmentManager] = useState(false);
  const [showRequestCollections, setShowRequestCollections] = useState(false);
  const [showTestRunner, setShowTestRunner] = useState(false);
  const [environments, setEnvironments] = useState([
    { id: 'dev', name: 'Development', baseUrl: 'http://localhost:3000' },
    { id: 'staging', name: 'Staging', baseUrl: 'https://staging-api.example.com' },
    { id: 'prod', name: 'Production', baseUrl: 'https://api.example.com' }
  ]);
  const [currentEnvironment, setCurrentEnvironment] = useState('dev');

  // Project context
  const { currentProject } = useProjectContext();

  // Mock user data
  const mockUser = {
    id: 'user_1',
    name: 'Alex Johnson',
    email: 'alex.johnson@apiforge.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
  };

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const handleSidebarOpen = () => {
    setSidebarOpen(true);
  };

  const handleProjectChange = (project) => {
    // Handle project change
    console.log('Project changed:', project);
  };

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleRequestSelect = (request) => {
    setSelectedRequest(request);
  };

  const handleTestRun = (results) => {
    setTestResults(results);
  };

  const handleEnvironmentChange = (envId) => {
    setCurrentEnvironment(envId);
  };

  const handleEnvironmentUpdate = (updatedEnvironments) => {
    setEnvironments(updatedEnvironments);
  };

  const handleRunAllTests = () => {
    // Handle running all tests
    console.log('Running all tests...');
  };

  const tabs = [
    { id: 'builder', label: 'Request Builder', icon: 'Edit' },
    { id: 'collections', label: 'Collections', icon: 'Folder' },
    { id: 'environments', label: 'Environments', icon: 'Settings' },
    { id: 'testrunner', label: 'Test Runner', icon: 'Play' },
    { id: 'results', label: 'Test Results', icon: 'CheckCircle' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'builder':
        return (
          <div className="flex-1 flex">
            <RequestBuilder
              selectedRequest={selectedRequest}
              currentEnvironment={currentEnvironment}
              environments={environments}
            />
            <ResponseViewer />
          </div>
        );
      case 'collections':
        return (
          <RequestCollections
            onRequestSelect={handleRequestSelect}
            selectedRequest={selectedRequest}
          />
        );
      case 'environments':
        return (
          <EnvironmentManager
            environments={environments}
            currentEnvironment={currentEnvironment}
            onEnvironmentChange={handleEnvironmentChange}
            onEnvironmentUpdate={handleEnvironmentUpdate}
          />
        );
      case 'testrunner':
        return (
          <TestRunner
            selectedRequest={selectedRequest}
            onTestRun={handleTestRun}
            currentEnvironment={currentEnvironment}
          />
        );
      case 'results':
        return (
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-4">Test Results</h3>
            <div className="space-y-2">
              {testResults.map((result, index) => (
                <div key={index} className="p-3 border rounded">
                  <div className="flex items-center justify-between">
                    <span>{result.name || `Test ${index + 1}`}</span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      result.status === 'passed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {result.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onToggle={handleSidebarToggle}
        onClose={handleSidebarClose}
        currentUser={mockUser}
        currentProject={currentProject}
      />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        sidebarCollapsed ? 'ml-16' : 'ml-64'
      }`}>
        {/* Header */}
        <Header
          currentUser={mockUser}
          currentProject={currentProject}
          onProjectChange={handleProjectChange}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={handleToggleSidebar}
        />

        {/* Page Content */}
        <div className="flex-1 overflow-hidden p-6">
          <div className="h-full flex flex-col">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Button
                  onClick={() => setShowEnvironmentManager(!showEnvironmentManager)}
                  variant="outline"
                  size="sm"
                >
                  <Icon name="Globe" size={16} className="mr-2" />
                  Environments
                </Button>
                <Button
                  onClick={() => setShowRequestCollections(!showRequestCollections)}
                  variant="outline"
                  size="sm"
                >
                  <Icon name="Folder" size={16} className="mr-2" />
                  Collections
                </Button>
                <Button
                  onClick={() => setShowTestRunner(!showTestRunner)}
                  variant="outline"
                  size="sm"
                >
                  <Icon name="Play" size={16} className="mr-2" />
                  Test Runner
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={handleRunAllTests}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  size="sm"
                >
                  <Icon name="Play" size={16} className="mr-2" />
                  Run All Tests
                </Button>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b mb-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-2 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon name={tab.icon} size={16} className="mr-2" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-auto">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APITesting;