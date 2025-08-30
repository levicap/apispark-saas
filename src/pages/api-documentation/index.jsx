import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import DocumentationSidebar from './components/DocumentationSidebar';
import EndpointDetails from './components/EndpointDetails';
import SchemaViewer from './components/SchemaViewer';
import AuthenticationDocs from './components/AuthenticationDocs';
import SDKDownloads from './components/SDKDownloads';
import TryItPanel from './components/TryItPanel';
import { useProjectContext } from '../../contexts/ProjectContext';

const APIDocumentation = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);
  const [showTryIt, setShowTryIt] = useState(false);

  // Project context
  const { currentProject, getCurrentProjectSchema, getCurrentProjectEndpoints } = useProjectContext();

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

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const handleEndpointSelect = (endpoint) => {
    setSelectedEndpoint(endpoint);
  };

  const handleTryItToggle = () => {
    setShowTryIt(!showTryIt);
  };

  // Get API documentation data based on current project
  const getApiDocs = () => {
    if (!currentProject) return null;

    const schema = getCurrentProjectSchema();
    const endpoints = getCurrentProjectEndpoints();
    const { entities = [] } = schema;

    return {
      project: currentProject,
      overview: {
        title: `${currentProject.name} API Documentation`,
        description: `Complete API reference for ${currentProject.name}. This API provides endpoints for managing ${entities.map(e => e.name).join(', ')} and related operations.`,
        version: '1.0.0',
        baseUrl: 'https://api.example.com/v1',
        contact: {
          name: 'API Support',
          email: 'support@apiforge.com',
          url: 'https://docs.apiforge.com'
        }
      },
      endpoints: endpoints.map(endpoint => ({
        id: endpoint.id,
        name: endpoint.name,
        path: endpoint.path,
        method: endpoint.method,
        description: endpoint.description,
        category: endpoint.category,
        parameters: endpoint.parameters || [],
        responses: endpoint.responses || {}
      })),
      schemas: entities.map(entity => ({
        name: entity.name,
        type: 'object',
        properties: entity.fields?.reduce((acc, field) => {
          acc[field.name] = {
            type: getOpenAPIType(field.type),
            description: `${field.name} field`,
            required: field.required || false
          };
          return acc;
        }, {}) || {}
      })),
      authentication: {
        types: [
          {
            name: 'Bearer Token',
            description: 'JWT token authentication',
            example: 'Authorization: Bearer <token>'
          },
          {
            name: 'API Key',
            description: 'API key authentication',
            example: 'X-API-Key: <your-api-key>'
          }
        ]
      }
    };
  };

  const getOpenAPIType = (dbType) => {
    if (!dbType) return 'string';
    
    const typeMap = {
      'uuid': 'string',
      'varchar': 'string',
      'text': 'string',
      'longtext': 'string',
      'int': 'integer',
      'integer': 'integer',
      'bigint': 'integer',
      'decimal': 'number',
      'boolean': 'boolean',
      'timestamp': 'string',
      'date': 'string',
      'jsonb': 'object',
      'enum': 'string'
    };
    
    // Handle complex types like varchar(255)
    const baseType = dbType.toLowerCase().split('(')[0];
    return typeMap[baseType] || 'string';
  };

  const apiDocs = getApiDocs();

  if (!apiDocs) {
    return (
      <div className="min-h-screen bg-background">
        <Header user={mockUser} onMenuClick={handleSidebarOpen} />
        <div className="flex h-screen pt-16">
          <Sidebar
            isOpen={sidebarOpen}
            onClose={handleSidebarClose}
            onToggle={handleSidebarToggle}
            isCollapsed={sidebarCollapsed}
            currentProject={currentProject}
          />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-foreground mb-2">No Project Selected</h2>
              <p className="text-muted-foreground">Please select a project to view API documentation</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
          onProjectChange={handleSidebarOpen}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={handleSidebarToggle}
        />

        {/* Page Content */}
        <div className="flex-1 overflow-hidden p-6">
          <div className="h-full flex flex-col">
            {/* Project Info */}
            {currentProject ? (
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {currentProject.name} API Documentation
                </h1>
                <p className="text-lg text-muted-foreground mb-4">
                  {currentProject.description}
                </p>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span>Database: {currentProject.databaseType}</span>
                  <span>Framework: {currentProject.metadata?.framework}</span>
                  <span>Language: {currentProject.metadata?.language}</span>
                </div>
              </div>
            ) : (
              <div className="mb-6 text-center py-12">
                <h1 className="text-2xl font-semibold text-foreground mb-2">
                  No Project Selected
                </h1>
                <p className="text-muted-foreground">
                  Please select a project from the header to view its API documentation.
                </p>
              </div>
            )}

            {/* Documentation Sidebar */}
            <div className="w-80 flex-shrink-0 border-r border-border bg-surface">
              <DocumentationSidebar
                  sections={[
                    { id: 'overview', label: 'Overview', icon: 'Info' },
                    { id: 'endpoints', label: 'Endpoints', icon: 'Globe' },
                    { id: 'schemas', label: 'Schemas', icon: 'Database' },
                    { id: 'authentication', label: 'Authentication', icon: 'Shield' },
                    { id: 'sdks', label: 'SDKs', icon: 'Download' }
                  ]}
                  activeSection={activeSection}
                  onSectionChange={handleSectionChange}
                  endpoints={apiDocs.endpoints}
                  onEndpointSelect={handleEndpointSelect}
                selectedEndpoint={selectedEndpoint}
              />
            </div>

            {/* Main Documentation */}
            <div className="flex-1 flex">
              <div className={`${showTryIt ? 'w-2/3' : 'w-full'} p-8 overflow-y-auto`}>
                {activeSection === 'overview' && (
                  <div className="max-w-4xl space-y-8">
                    <div>
                      <h2 className="text-2xl font-semibold text-foreground mb-6">Getting Started</h2>
                      <div className="prose prose-lg max-w-none text-foreground">
                        <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                          Welcome to the {currentProject.name} API documentation. This guide will help you understand how to use our API endpoints to build powerful applications.
                        </p>
                        
                        <h3 className="text-xl font-medium text-foreground mb-4">Quick Start</h3>
                        <div className="bg-muted p-6 rounded-xl mb-8">
                          <pre className="text-sm text-foreground overflow-x-auto">
                            <code>
{`# Get your API key
curl -X GET "${apiDocs.overview.baseUrl}/auth/api-key" \\
  -H "Authorization: Bearer <your-token>"

# Make your first request
curl -X GET "${apiDocs.overview.baseUrl}/api/users" \\
  -H "X-API-Key: <your-api-key>"`}
                            </code>
                          </pre>
                        </div>

                        <h3 className="text-xl font-medium text-foreground mb-4">Authentication</h3>
                        <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                          All API requests require authentication. We support both Bearer token and API key authentication methods.
                        </p>

                        <h3 className="text-xl font-medium text-foreground mb-4">Rate Limiting</h3>
                        <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                          API requests are limited to 1000 requests per hour per API key. Rate limit headers are included in all responses.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === 'endpoints' && (
                  <div className="max-w-4xl space-y-8">
                    <h2 className="text-2xl font-semibold text-foreground mb-6">API Endpoints</h2>
                    {apiDocs.endpoints.map((endpoint) => (
                      <EndpointDetails
                        key={endpoint.id}
                        endpoint={endpoint}
                        isSelected={selectedEndpoint?.id === endpoint.id}
                        onSelect={() => handleEndpointSelect(endpoint)}
                      />
                    ))}
                  </div>
                )}

                {activeSection === 'schemas' && (
                  <div className="max-w-4xl space-y-8">
                    <h2 className="text-2xl font-semibold text-foreground mb-6">Data Schemas</h2>
                    {apiDocs.schemas.map((schema) => (
                      <SchemaViewer
                        key={schema.name}
                        schema={schema}
                      />
                    ))}
                  </div>
                )}

                {activeSection === 'authentication' && (
                  <div className="max-w-4xl">
                    <AuthenticationDocs authentication={apiDocs.authentication} />
                  </div>
                )}

                {activeSection === 'sdks' && (
                  <div className="max-w-4xl">
                    <SDKDownloads project={currentProject} />
                  </div>
                )}
              </div>

              {/* Try It Panel */}
              {showTryIt && (
                <div className="w-1/3 border-l border-border">
                  <TryItPanel
                    endpoint={selectedEndpoint}
                    baseUrl={apiDocs.overview.baseUrl}
                    onClose={() => setShowTryIt(false)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIDocumentation;