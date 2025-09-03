import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import RequestCollections from './components/RequestCollections';
import RequestBuilder from './components/RequestBuilder';
import ResponseViewer from './components/ResponseViewer';
import TestRunner from './components/TestRunner';
import EnvironmentManager from './components/EnvironmentManager';
import TestCreationModal from './components/TestCreationModal';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const APITesting = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [currentResponse, setCurrentResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showEnvironments, setShowEnvironments] = useState(false);
  const [currentEnvironment, setCurrentEnvironment] = useState(null);
  const [testResults, setTestResults] = useState(null);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [showTestCreationModal, setShowTestCreationModal] = useState(false);
  const [createdTests, setCreatedTests] = useState([]);

  // Mock data for collections
  const [collections] = useState([
    {
      id: 'col1',
      name: 'User Management API',
      requests: [
        {
          id: 'req1',
          name: 'Get All Users',
          method: 'GET',
          url: 'https://api.example.com/users',
          headers: [
            { key: 'Authorization', value: 'Bearer {{token}}', enabled: true },
            { key: 'Content-Type', value: 'application/json', enabled: true }
          ],
          status: 'success'
        },
        {
          id: 'req2',
          name: 'Create User',
          method: 'POST',
          url: 'https://api.example.com/users',
          headers: [
            { key: 'Authorization', value: 'Bearer {{token}}', enabled: true },
            { key: 'Content-Type', value: 'application/json', enabled: true }
          ],
          body: `{
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user"
}`,
          authType: 'bearer',
          bearerToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          status: 'success'
        },
        {
          id: 'req3',
          name: 'Update User',
          method: 'PUT',
          url: 'https://api.example.com/users/123',
          headers: [
            { key: 'Authorization', value: 'Bearer {{token}}', enabled: true },
            { key: 'Content-Type', value: 'application/json', enabled: true }
          ],
          body: `{
  "name": "John Smith",
  "email": "johnsmith@example.com"
}`,
          status: 'error'
        }
      ]
    },
    {
      id: 'col2',
      name: 'Product Catalog',
      requests: [
        {
          id: 'req4',
          name: 'Get Products',
          method: 'GET',
          url: 'https://api.example.com/products',
          headers: [
            { key: 'API-Key', value: '{{apiKey}}', enabled: true }
          ],
          params: [
            { key: 'limit', value: '10', enabled: true },
            { key: 'offset', value: '0', enabled: true }
          ],
          authType: 'apikey',
          apiKey: { key: 'X-API-Key', value: 'abc123def456', location: 'header' }
        },
        {
          id: 'req5',
          name: 'Create Product',
          method: 'POST',
          url: 'https://api.example.com/products',
          headers: [
            { key: 'API-Key', value: '{{apiKey}}', enabled: true },
            { key: 'Content-Type', value: 'application/json', enabled: true }
          ],
          body: `{
  "name": "Wireless Headphones",
  "price": 99.99,
  "category": "electronics",
  "description": "High-quality wireless headphones with noise cancellation"
}`
        }
      ]
    }
  ]);

  // Mock environments
  const [environments] = useState([
    {
      id: 'dev',
      name: 'Development',
      description: 'Local development environment',
      variables: [
        { key: 'baseUrl', value: 'http://localhost:3000/api', enabled: true },
        { key: 'token', value: 'dev_token_123', enabled: true },
        { key: 'apiKey', value: 'dev_api_key_456', enabled: true }
      ]
    },
    {
      id: 'staging',
      name: 'Staging',
      description: 'Staging environment for testing',
      variables: [
        { key: 'baseUrl', value: 'https://staging-api.example.com', enabled: true },
        { key: 'token', value: 'staging_token_789', enabled: true },
        { key: 'apiKey', value: 'staging_api_key_012', enabled: true }
      ]
    },
    {
      id: 'prod',
      name: 'Production',
      description: 'Production environment',
      variables: [
        { key: 'baseUrl', value: 'https://api.example.com', enabled: true },
        { key: 'token', value: 'prod_token_345', enabled: true },
        { key: 'apiKey', value: 'prod_api_key_678', enabled: true }
      ]
    }
  ]);

  // Mock test suites
  const [testSuites] = useState([
    {
      id: 'suite1',
      name: 'User API Tests',
      description: 'Comprehensive tests for user management endpoints',
      tests: [
        { name: 'Get all users returns 200', endpoint: '/users', method: 'GET' },
        { name: 'Create user with valid data', endpoint: '/users', method: 'POST' },
        { name: 'Update user returns updated data', endpoint: '/users/123', method: 'PUT' }
      ],
      lastRun: {
        status: 'passed',
        duration: 1250
      }
    },
    {
      id: 'suite2',
      name: 'Product API Tests',
      description: 'Tests for product catalog functionality',
      tests: [
        { name: 'Get products with pagination', endpoint: '/products', method: 'GET' },
        { name: 'Create product validates required fields', endpoint: '/products', method: 'POST' }
      ],
      lastRun: {
        status: 'failed',
        duration: 890
      }
    }
  ]);

  useEffect(() => {
    // Set default environment
    if (environments?.length > 0 && !currentEnvironment) {
      setCurrentEnvironment(environments?.[0]);
    }
  }, [environments, currentEnvironment]);

  const handleSendRequest = async () => {
    if (!selectedRequest) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockResponse = {
        status: selectedRequest?.method === 'GET' ? 200 : selectedRequest?.method === 'POST' ? 201 : 200,
        statusText: selectedRequest?.method === 'GET' ? 'OK' : selectedRequest?.method === 'POST' ? 'Created' : 'OK',
        time: Math.floor(Math.random() * 500) + 100,
        size: Math.floor(Math.random() * 5000) + 1000,
        contentType: 'application/json',
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Remaining': '99',
          'X-Response-Time': '145ms',
          'Cache-Control': 'no-cache'
        },
        body: selectedRequest?.method === 'GET' 
          ? `{
  "users": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "admin",
      "created_at": "2025-01-10T10:30:00Z"
    },
    {
      "id": 2,
      "name": "Jane Smith",
      "email": "jane@example.com",
      "role": "user",
      "created_at": "2025-01-11T14:20:00Z"
    }
  ],
  "total": 2,
  "page": 1,
  "limit": 10
}`
          : selectedRequest?.method === 'POST'
          ? `{
  "id": 3,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "created_at": "2025-01-13T12:51:05Z",
  "message": "User created successfully"
}`
          : `{
  "id": 123,
  "name": "John Smith",
  "email": "johnsmith@example.com",
  "role": "user",
  "updated_at": "2025-01-13T12:51:05Z",
  "message": "User updated successfully"
}`,
        testResults: {
          passed: 3,
          total: 4,
          tests: [
            { name: 'Status code is 200', passed: true, duration: 5 },
            { name: 'Response time is less than 500ms', passed: true, duration: 3 },
            { name: 'Response has required fields', passed: true, duration: 2 },
            { name: 'Email format is valid', passed: false, duration: 4, error: 'Expected valid email format' }
          ]
        }
      };

      setCurrentResponse(mockResponse);
      setIsLoading(false);
    }, 1000);
  };

  const handleRunTests = (suite) => {
    setIsRunningTests(true);
    
    // Simulate test execution
    setTimeout(() => {
      const mockTestResults = {
        summary: {
          total: suite?.tests?.length,
          passed: Math.floor(suite?.tests?.length * 0.8),
          failed: Math.ceil(suite?.tests?.length * 0.2),
          skipped: 0,
          duration: Math.floor(Math.random() * 2000) + 500
        },
        tests: suite?.tests?.map((test, index) => ({
          name: test?.name,
          method: test?.method,
          endpoint: test?.endpoint,
          status: index < suite?.tests?.length * 0.8 ? 'passed' : 'failed',
          duration: Math.floor(Math.random() * 200) + 50,
          error: index >= suite?.tests?.length * 0.8 ? 'Assertion failed: Expected status 200 but got 404' : null,
          assertions: [
            { description: 'Status code is 200', passed: index < suite?.tests?.length * 0.8 },
            { description: 'Response time < 500ms', passed: true },
            { description: 'Content-Type is application/json', passed: true }
          ]
        }))
      };

      setTestResults(mockTestResults);
      setIsRunningTests(false);
    }, 2000);
  };

  const handleRunCollection = () => {
    // Run all test suites
    handleRunTests({ tests: testSuites?.flatMap(suite => suite?.tests) });
  };

  const handleCreateRequest = (collectionId) => {
    console.log('Creating new request for collection:', collectionId);
  };

  const handleCreateCollection = () => {
    console.log('Creating new collection');
  };

  const handleEnvironmentChange = (environment) => {
    setCurrentEnvironment(environment);
  };

  const handleEnvironmentUpdate = (updatedEnvironment) => {
    console.log('Updating environment:', updatedEnvironment);
  };

  const handleCreateEnvironment = (newEnvironment) => {
    console.log('Creating new environment:', newEnvironment);
  };

  const handleCreateTest = (newTest) => {
    setCreatedTests(prev => [...prev, newTest]);
    console.log('Created new test:', newTest);
  };

  const handleRunCreatedTests = (testsToRun = null) => {
    const targetTests = testsToRun || createdTests;
    if (targetTests.length === 0) return;
    
    setIsRunningTests(true);
    
    // Simulate test execution for created tests
    setTimeout(() => {
      const mockTestResults = {
        summary: {
          total: targetTests.length,
          passed: Math.floor(targetTests.length * 0.85),
          failed: Math.ceil(targetTests.length * 0.15),
          skipped: 0,
          duration: Math.floor(Math.random() * 3000) + 1000
        },
        tests: targetTests.map((test, index) => {
          const isSuccess = index < targetTests.length * 0.85;
          return {
            name: test.name,
            method: test.method,
            endpoint: test.endpoint,
            type: test.type,
            source: test.source,
            status: isSuccess ? 'passed' : 'failed',
            duration: Math.floor(Math.random() * 300) + 50,
            error: !isSuccess ? `Assertion failed: Expected ${test.expectedStatusCode} but got ${Math.floor(Math.random() * 100) + 400}` : null,
            assertions: test.assertions?.map(assertion => ({
              description: `${assertion.type} ${assertion.operator} ${assertion.value}`,
              passed: isSuccess
            })) || [],
            testContent: test.testContent,
            expectedResponse: test.expectedResponse
          };
        })
      };
      
      setTestResults(mockTestResults);
      setIsRunningTests(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        isCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onProjectChange={() => {}}
        user={{ name: 'Alex Johnson', email: 'alex@apiforge.com' }}
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
          {/* Top Toolbar */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-surface">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Icon name="TestTube" size={20} className="text-primary" />
                <h1 className="text-lg font-semibold text-foreground">API Testing</h1>
              </div>
              <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
                <span>Environment:</span>
                <span className="font-medium text-foreground">
                  {currentEnvironment?.name || 'None'}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTestCreationModal(true)}
                iconName="Plus"
                iconPosition="left"
              >
                Create Test
              </Button>
              <Button
                variant={showEnvironments ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowEnvironments(!showEnvironments)}
                iconName="Settings"
                iconPosition="left"
              >
                Environment
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName="Play"
                iconPosition="left"
              >
                Mock Server
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName="Download"
                iconPosition="left"
              >
                Export
              </Button>
            </div>
          </div>

          {/* Environment Manager */}
          {showEnvironments && (
            <div className="p-4 border-b border-border">
              <EnvironmentManager
                environments={environments}
                currentEnvironment={currentEnvironment}
                onEnvironmentChange={handleEnvironmentChange}
                onEnvironmentUpdate={handleEnvironmentUpdate}
                onCreateEnvironment={handleCreateEnvironment}
              />
            </div>
          )}

          {/* Main Content Area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left Panel - Collections */}
            <div className="w-80 flex-shrink-0 hidden lg:block">
              <RequestCollections
                collections={collections}
                selectedRequest={selectedRequest}
                onRequestSelect={setSelectedRequest}
                onCreateRequest={handleCreateRequest}
                onCreateCollection={handleCreateCollection}
              />
            </div>

            {/* Center Panel - Request Builder */}
            <div className="flex-1 min-w-0">
              <RequestBuilder
                request={selectedRequest}
                onRequestChange={setSelectedRequest}
                onSendRequest={handleSendRequest}
                isLoading={isLoading}
              />
            </div>

            {/* Right Panel - Response Viewer */}
            <div className="w-96 flex-shrink-0 hidden xl:block">
              <ResponseViewer
                response={currentResponse}
                isLoading={isLoading}
              />
            </div>
          </div>

          {/* Bottom Panel - Test Runner */}
          <div className="h-80 flex-shrink-0 border-t border-border">
            <TestRunner
              testSuites={testSuites}
              createdTests={createdTests}
              onRunTests={handleRunTests}
              onRunCollection={handleRunCollection}
              onRunCreatedTests={handleRunCreatedTests}
              onCreateTest={() => setShowTestCreationModal(true)}
              isRunning={isRunningTests}
              testResults={testResults}
            />
          </div>
        </div>

        {/* Mobile Collections Overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-150 lg:hidden">
            <div className="fixed left-0 top-16 bottom-0 w-80 bg-surface">
              <RequestCollections
                collections={collections}
                selectedRequest={selectedRequest}
                onRequestSelect={(request) => {
                  setSelectedRequest(request);
                  setSidebarOpen(false);
                }}
                onCreateRequest={handleCreateRequest}
                onCreateCollection={handleCreateCollection}
              />
            </div>
          </div>
        )}

        {/* Mobile Response Viewer Modal */}
        {currentResponse && (
          <div className="xl:hidden">
            <div className="fixed bottom-4 right-4 z-200">
              <Button
                variant="default"
                onClick={() => {
                  // Show response in modal
                }}
                iconName="Eye"
                iconPosition="left"
              >
                View Response
              </Button>
            </div>
          </div>
        )}

        {/* Test Creation Modal */}
        <TestCreationModal
          isOpen={showTestCreationModal}
          onClose={() => setShowTestCreationModal(false)}
          onCreateTest={handleCreateTest}
          selectedRequest={selectedRequest}
          collections={collections}
        />
      </main>
    </div>
  );
};

export default APITesting;