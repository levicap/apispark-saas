import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const TestCreationModal = ({ isOpen, onClose, onCreateTest, selectedRequest = null, collections = [] }) => {
  const [testName, setTestName] = useState('');
  const [testType, setTestType] = useState('functional');
  const [selectedEndpoint, setSelectedEndpoint] = useState(selectedRequest || null);
  const [testDescription, setTestDescription] = useState('');
  const [expectedStatusCode, setExpectedStatusCode] = useState('200');
  const [expectedResponseTime, setExpectedResponseTime] = useState('2000');
  const [customTestContent, setCustomTestContent] = useState('');
  const [assertions, setAssertions] = useState([
    { type: 'status', operator: 'equals', value: '200', enabled: true }
  ]);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [suggestedTests, setSuggestedTests] = useState([]);
  const [selectedSuggestions, setSelectedSuggestions] = useState([]);
  const [activeTab, setActiveTab] = useState('manual');

  if (!isOpen) return null;

  // Get all endpoints from collections
  const allEndpoints = collections.flatMap(collection => 
    collection.requests.map(request => ({
      ...request,
      collectionName: collection.name,
      displayName: `${request.method} ${request.url}`,
      fullPath: `${collection.name} > ${request.name}`
    }))
  );

  const testTypes = [
    { value: 'functional', label: 'Functional Test' },
    { value: 'performance', label: 'Performance Test' },
    { value: 'security', label: 'Security Test' },
    { value: 'validation', label: 'Data Validation' },
    { value: 'integration', label: 'Integration Test' },
    { value: 'regression', label: 'Regression Test' }
  ];

  const assertionTypes = [
    { value: 'status', label: 'Status Code' },
    { value: 'response_time', label: 'Response Time' },
    { value: 'header', label: 'Response Header' },
    { value: 'body_contains', label: 'Body Contains' },
    { value: 'body_equals', label: 'Body Equals' },
    { value: 'json_path', label: 'JSON Path' },
    { value: 'schema', label: 'JSON Schema' }
  ];

  const operators = {
    status: [{ value: 'equals', label: 'Equals' }, { value: 'not_equals', label: 'Not Equals' }],
    response_time: [{ value: 'less_than', label: 'Less Than' }, { value: 'greater_than', label: 'Greater Than' }],
    header: [{ value: 'exists', label: 'Exists' }, { value: 'equals', label: 'Equals' }, { value: 'contains', label: 'Contains' }],
    body_contains: [{ value: 'contains', label: 'Contains' }],
    body_equals: [{ value: 'equals', label: 'Equals' }],
    json_path: [{ value: 'equals', label: 'Equals' }, { value: 'exists', label: 'Exists' }],
    schema: [{ value: 'validates', label: 'Validates Against' }]
  };

  const generateAITests = async () => {
    if (!selectedEndpoint) return;
    
    setIsGeneratingAI(true);
    
    // Enhanced AI test generation with mock data based on endpoint
    setTimeout(() => {
      const endpoint = selectedEndpoint;
      const method = endpoint.method;
      const isAuthRequired = endpoint.headers?.some(h => h.key.toLowerCase().includes('authorization'));
      
      const aiSuggestions = [
        // Core functional tests
        {
          id: `ai_${endpoint.id}_functional_1`,
          name: `Validate ${method} ${endpoint.name} success response`,
          type: 'functional',
          description: `Ensures the ${method} request returns expected data structure and status code`,
          endpoint: endpoint.url,
          method: endpoint.method,
          testContent: `Test validates that ${endpoint.name} endpoint responds correctly with proper data format.`,
          mockRequest: {
            url: endpoint.url,
            method: endpoint.method,
            headers: endpoint.headers || [],
            body: endpoint.body || null
          },
          expectedResponse: {
            statusCode: method === 'POST' ? 201 : 200,
            responseTime: '< 1500ms',
            contentType: 'application/json',
            bodyStructure: method === 'GET' ? 'Array or Object with data field' : 'Object with id and success message'
          },
          assertions: [
            { type: 'status', operator: 'equals', value: method === 'POST' ? '201' : '200', enabled: true },
            { type: 'response_time', operator: 'less_than', value: '1500', enabled: true },
            { type: 'header', operator: 'equals', value: 'application/json', field: 'content-type', enabled: true },
            { type: 'json_path', operator: 'exists', value: method === 'GET' ? '$.data' : '$.id', enabled: true }
          ],
          confidence: 94
        },
        
        // Error handling tests
        {
          id: `ai_${endpoint.id}_validation_1`,
          name: `Test ${endpoint.name} error handling`,
          type: 'validation',
          description: `Verifies proper error responses for invalid requests to ${endpoint.name}`,
          endpoint: endpoint.url,
          method: endpoint.method,
          testContent: `Test validates error handling when invalid data is sent to ${endpoint.name}.`,
          mockRequest: {
            url: endpoint.url,
            method: endpoint.method,
            headers: endpoint.headers?.filter(h => !h.key.toLowerCase().includes('authorization')) || [],
            body: method !== 'GET' ? '{"invalid": "data"}' : null
          },
          expectedResponse: {
            statusCode: isAuthRequired ? 401 : 400,
            responseTime: '< 1000ms',
            contentType: 'application/json',
            bodyStructure: 'Object with error message and details'
          },
          assertions: [
            { type: 'status', operator: 'equals', value: isAuthRequired ? '401' : '400', enabled: true },
            { type: 'body_contains', operator: 'contains', value: 'error', enabled: true },
            { type: 'response_time', operator: 'less_than', value: '1000', enabled: true }
          ],
          confidence: 89
        },
        
        // Performance tests
        {
          id: `ai_${endpoint.id}_performance_1`,
          name: `${endpoint.name} performance benchmark`,
          type: 'performance',
          description: `Establishes performance benchmarks for ${endpoint.name} endpoint`,
          endpoint: endpoint.url,
          method: endpoint.method,
          testContent: `Performance test to ensure ${endpoint.name} responds within acceptable time limits.`,
          mockRequest: {
            url: endpoint.url,
            method: endpoint.method,
            headers: endpoint.headers || [],
            body: endpoint.body || null
          },
          expectedResponse: {
            statusCode: method === 'POST' ? 201 : 200,
            responseTime: '< 800ms',
            contentType: 'application/json'
          },
          assertions: [
            { type: 'response_time', operator: 'less_than', value: '800', enabled: true },
            { type: 'status', operator: 'equals', value: method === 'POST' ? '201' : '200', enabled: true }
          ],
          confidence: 91
        }
      ];
      
      // Add security tests if authentication is required
      if (isAuthRequired) {
        aiSuggestions.push({
          id: `ai_${endpoint.id}_security_1`,
          name: `${endpoint.name} authentication validation`,
          type: 'security',
          description: `Verifies proper authentication handling for ${endpoint.name}`,
          endpoint: endpoint.url,
          method: endpoint.method,
          testContent: `Security test to validate authentication requirements for ${endpoint.name}.`,
          mockRequest: {
            url: endpoint.url,
            method: endpoint.method,
            headers: endpoint.headers?.filter(h => !h.key.toLowerCase().includes('authorization')) || [],
            body: endpoint.body || null
          },
          expectedResponse: {
            statusCode: 401,
            responseTime: '< 500ms',
            contentType: 'application/json',
            bodyStructure: 'Object with authentication error message'
          },
          assertions: [
            { type: 'status', operator: 'equals', value: '401', enabled: true },
            { type: 'body_contains', operator: 'contains', value: 'unauthorized', enabled: true },
            { type: 'header', operator: 'exists', value: 'www-authenticate', enabled: false }
          ],
          confidence: 87
        });
      }
      
      // Add integration tests for complex endpoints
      if (method === 'POST' || method === 'PUT') {
        aiSuggestions.push({
          id: `ai_${endpoint.id}_integration_1`,
          name: `${endpoint.name} data consistency check`,
          type: 'integration',
          description: `Validates data consistency and relationships for ${endpoint.name}`,
          endpoint: endpoint.url,
          method: endpoint.method,
          testContent: `Integration test to verify data consistency when creating/updating via ${endpoint.name}.`,
          mockRequest: {
            url: endpoint.url,
            method: endpoint.method,
            headers: endpoint.headers || [],
            body: endpoint.body || '{}'
          },
          expectedResponse: {
            statusCode: method === 'POST' ? 201 : 200,
            responseTime: '< 2000ms',
            contentType: 'application/json',
            bodyStructure: 'Object with complete entity data'
          },
          assertions: [
            { type: 'status', operator: 'equals', value: method === 'POST' ? '201' : '200', enabled: true },
            { type: 'json_path', operator: 'exists', value: '$.id', enabled: true },
            { type: 'json_path', operator: 'exists', value: '$.created_at', enabled: method === 'POST' },
            { type: 'json_path', operator: 'exists', value: '$.updated_at', enabled: method === 'PUT' }
          ],
          confidence: 85
        });
      }
      
      setSuggestedTests(aiSuggestions);
      setIsGeneratingAI(false);
    }, 2500);
  };

  const addAssertion = () => {
    setAssertions([...assertions, { type: 'status', operator: 'equals', value: '', enabled: true }]);
  };

  const updateAssertion = (index, field, value) => {
    const updated = [...assertions];
    updated[index][field] = value;
    
    // Reset operator when assertion type changes
    if (field === 'type') {
      updated[index].operator = operators[value]?.[0]?.value || 'equals';
    }
    
    setAssertions(updated);
  };

  const removeAssertion = (index) => {
    setAssertions(assertions.filter((_, i) => i !== index));
  };

  const toggleSuggestion = (suggestionId) => {
    setSelectedSuggestions(prev => 
      prev.includes(suggestionId)
        ? prev.filter(id => id !== suggestionId)
        : [...prev, suggestionId]
    );
  };

  const handleCreateTest = () => {
    if (!testName || !selectedEndpoint) return;
    
    const newTest = {
      id: `test_${Date.now()}`,
      name: testName,
      type: testType,
      description: testDescription,
      endpoint: selectedEndpoint.url,
      method: selectedEndpoint.method,
      testContent: customTestContent,
      expectedStatusCode,
      expectedResponseTime,
      assertions: assertions.filter(a => a.enabled),
      mockRequest: {
        url: selectedEndpoint.url,
        method: selectedEndpoint.method,
        headers: selectedEndpoint.headers || [],
        body: selectedEndpoint.body || null
      },
      expectedResponse: {
        statusCode: expectedStatusCode,
        responseTime: `< ${expectedResponseTime}ms`,
        contentType: 'application/json'
      },
      createdAt: new Date().toISOString(),
      createdBy: 'current_user',
      source: 'manual'
    };
    
    onCreateTest(newTest);
    
    // Reset form
    resetForm();
    onClose();
  };

  const handleCreateFromSuggestions = () => {
    const selectedTestData = suggestedTests.filter(test => selectedSuggestions.includes(test.id));
    
    selectedTestData.forEach(test => {
      const newTest = {
        id: `test_${Date.now()}_${test.id}`,
        name: test.name,
        type: test.type,
        description: test.description,
        endpoint: test.endpoint,
        method: test.method,
        testContent: test.testContent,
        expectedStatusCode: test.expectedResponse.statusCode,
        expectedResponseTime: test.expectedResponse.responseTime,
        assertions: test.assertions,
        mockRequest: test.mockRequest,
        expectedResponse: test.expectedResponse,
        createdAt: new Date().toISOString(),
        createdBy: 'ai_generated',
        confidence: test.confidence,
        source: 'ai'
      };
      
      onCreateTest(newTest);
    });
    
    // Reset form
    resetForm();
    onClose();
  };
  
  const resetForm = () => {
    setTestName('');
    setTestType('functional');
    setSelectedEndpoint(selectedRequest || null);
    setTestDescription('');
    setExpectedStatusCode('200');
    setExpectedResponseTime('2000');
    setCustomTestContent('');
    setAssertions([{ type: 'status', operator: 'equals', value: '200', enabled: true }]);
    setSuggestedTests([]);
    setSelectedSuggestions([]);
    setActiveTab('manual');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface border border-border rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Create Test</h2>
            {selectedEndpoint && (
              <p className="text-sm text-muted-foreground mt-1">
                For: {selectedEndpoint.method} {selectedEndpoint.url}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
              <button
                onClick={() => setActiveTab('manual')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  activeTab === 'manual' 
                    ? 'bg-background text-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Manual
              </button>
              <button
                onClick={() => setActiveTab('ai')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  activeTab === 'ai' 
                    ? 'bg-background text-foreground shadow-sm' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                AI Generate
              </button>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>

        <div className="flex h-[calc(90vh-140px)]">
          {activeTab === 'manual' && (
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-foreground mb-4">Manual Test Creation</h3>
                
                {/* Endpoint Selection */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Select Endpoint</label>
                  <Select
                    options={[
                      { value: '', label: 'Choose an endpoint...' },
                      ...allEndpoints.map(endpoint => ({
                        value: endpoint.id,
                        label: endpoint.fullPath
                      }))
                    ]}
                    value={selectedEndpoint?.id || ''}
                    onChange={(value) => {
                      const endpoint = allEndpoints.find(e => e.id === value);
                      setSelectedEndpoint(endpoint || null);
                    }}
                  />
                  {selectedEndpoint && (
                    <div className="mt-2 p-3 bg-muted rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          selectedEndpoint.method === 'GET' ? 'bg-green-100 text-green-800' :
                          selectedEndpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                          selectedEndpoint.method === 'PUT' ? 'bg-orange-100 text-orange-800' :
                          selectedEndpoint.method === 'DELETE' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {selectedEndpoint.method}
                        </span>
                        <span className="text-sm text-foreground font-mono">{selectedEndpoint.url}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{selectedEndpoint.collectionName}</p>
                    </div>
                  )}
                </div>
                
                {/* Test Details */}
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Test Name"
                    value={testName}
                    onChange={(e) => setTestName(e.target.value)}
                    placeholder="Enter test name"
                    required
                  />
                  
                  <Select
                    label="Test Type"
                    options={testTypes}
                    value={testType}
                    onChange={setTestType}
                  />
                </div>
                
                <Input
                  label="Test Description"
                  value={testDescription}
                  onChange={(e) => setTestDescription(e.target.value)}
                  placeholder="Describe what this test validates"
                />
                
                {/* Test Content */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Test Content</label>
                  <textarea
                    value={customTestContent}
                    onChange={(e) => setCustomTestContent(e.target.value)}
                    placeholder="Describe the test scenario, expected behavior, and any special conditions..."
                    className="w-full h-24 px-3 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground resize-none"
                  />
                </div>
                
                {/* Expectations */}
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-3">Expected Response</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Status Code"
                      value={expectedStatusCode}
                      onChange={(e) => setExpectedStatusCode(e.target.value)}
                      placeholder="200"
                    />
                    <Input
                      label="Max Response Time (ms)"
                      type="number"
                      value={expectedResponseTime}
                      onChange={(e) => setExpectedResponseTime(e.target.value)}
                      placeholder="2000"
                    />
                  </div>
                </div>
                
                {/* Assertions */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-foreground">Custom Assertions</label>
                    <Button variant="outline" size="sm" onClick={addAssertion}>
                      <Icon name="Plus" size={14} />
                      Add Assertion
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {assertions.map((assertion, index) => (
                      <div key={index} className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                        <Select
                          options={assertionTypes}
                          value={assertion.type}
                          onChange={(value) => updateAssertion(index, 'type', value)}
                          className="flex-1"
                        />
                        <Select
                          options={operators[assertion.type] || []}
                          value={assertion.operator}
                          onChange={(value) => updateAssertion(index, 'operator', value)}
                          className="flex-1"
                        />
                        <Input
                          value={assertion.value}
                          onChange={(e) => updateAssertion(index, 'value', e.target.value)}
                          placeholder="Expected value"
                          className="flex-1"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAssertion(index)}
                          className="text-destructive"
                        >
                          <Icon name="Trash2" size={14} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex space-x-2 pt-4 border-t border-border">
                  <Button variant="outline" onClick={onClose}>Cancel</Button>
                  <Button 
                    onClick={handleCreateTest} 
                    disabled={!testName || !selectedEndpoint}
                    className="bg-primary text-primary-foreground"
                  >
                    Create Test
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-foreground">AI Test Generation</h3>
                  <Button
                    variant="default"
                    onClick={generateAITests}
                    loading={isGeneratingAI}
                    disabled={!selectedEndpoint}
                    className="bg-primary text-primary-foreground"
                  >
                    <Icon name="Sparkles" size={14} />
                    Generate Tests
                  </Button>
                </div>
                
                {/* Endpoint Selection for AI */}
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Select Endpoint for AI Analysis</label>
                  <Select
                    options={[
                      { value: '', label: 'Choose an endpoint...' },
                      ...allEndpoints.map(endpoint => ({
                        value: endpoint.id,
                        label: endpoint.fullPath
                      }))
                    ]}
                    value={selectedEndpoint?.id || ''}
                    onChange={(value) => {
                      const endpoint = allEndpoints.find(e => e.id === value);
                      setSelectedEndpoint(endpoint || null);
                      // Clear previous suggestions when endpoint changes
                      setSuggestedTests([]);
                      setSelectedSuggestions([]);
                    }}
                  />
                  {selectedEndpoint && (
                    <div className="mt-2 p-3 bg-muted rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          selectedEndpoint.method === 'GET' ? 'bg-green-100 text-green-800' :
                          selectedEndpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                          selectedEndpoint.method === 'PUT' ? 'bg-orange-100 text-orange-800' :
                          selectedEndpoint.method === 'DELETE' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {selectedEndpoint.method}
                        </span>
                        <span className="text-sm text-foreground font-mono">{selectedEndpoint.url}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{selectedEndpoint.collectionName}</p>
                      <div className="mt-2 text-xs text-muted-foreground">
                        <span>Auth: {selectedEndpoint.headers?.some(h => h.key.toLowerCase().includes('authorization')) ? 'Required' : 'None'}</span>
                        {selectedEndpoint.body && <span className="ml-3">Has Body: Yes</span>}
                      </div>
                    </div>
                  )}
                </div>
                
                {!selectedEndpoint && (
                  <div className="text-center py-12">
                    <Icon name="AlertCircle" size={48} className="mx-auto mb-3 text-muted-foreground" />
                    <h4 className="text-lg font-medium text-foreground mb-2">Select an Endpoint</h4>
                    <p className="text-sm text-muted-foreground">Choose an endpoint above to generate AI-powered tests</p>
                  </div>
                )}
                
                {isGeneratingAI && (
                  <div className="text-center py-12">
                    <div className="animate-spin w-12 h-12 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                    <h4 className="text-lg font-medium text-foreground mb-2">Analyzing Endpoint</h4>
                    <p className="text-sm text-muted-foreground">AI is analyzing the endpoint structure and generating comprehensive tests...</p>
                    <div className="mt-4 text-xs text-muted-foreground">
                      <div>• Analyzing request/response patterns</div>
                      <div>• Generating validation scenarios</div>
                      <div>• Creating performance benchmarks</div>
                      <div>• Designing security tests</div>
                    </div>
                  </div>
                )}
                
                {suggestedTests.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-medium text-foreground">
                        AI Generated Tests ({suggestedTests.length})
                      </h4>
                      {selectedSuggestions.length > 0 && (
                        <Button
                          variant="default"
                          onClick={handleCreateFromSuggestions}
                          className="bg-primary text-primary-foreground"
                        >
                          <Icon name="Plus" size={14} className="mr-1" />
                          Create Selected ({selectedSuggestions.length})
                        </Button>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      {suggestedTests.map((test) => (
                        <div key={test.id} className="border border-border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                          <div className="flex items-start space-x-3">
                            <input
                              type="checkbox"
                              checked={selectedSuggestions.includes(test.id)}
                              onChange={() => toggleSuggestion(test.id)}
                              className="mt-1 rounded border-border"
                            />
                            <div className="flex-1 space-y-3">
                              <div className="flex items-center space-x-2">
                                <h5 className="text-sm font-medium text-foreground">{test.name}</h5>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  test.type === 'functional' ? 'bg-blue-100 text-blue-800' :
                                  test.type === 'performance' ? 'bg-orange-100 text-orange-800' :
                                  test.type === 'security' ? 'bg-red-100 text-red-800' :
                                  test.type === 'validation' ? 'bg-green-100 text-green-800' :
                                  test.type === 'integration' ? 'bg-purple-100 text-purple-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {test.type}
                                </span>
                                <span className="text-xs text-muted-foreground font-medium">
                                  {test.confidence}% confidence
                                </span>
                              </div>
                              
                              <p className="text-sm text-muted-foreground">{test.description}</p>
                              
                              {test.testContent && (
                                <div className="p-3 bg-muted rounded border">
                                  <p className="text-xs text-foreground">{test.testContent}</p>
                                </div>
                              )}
                              
                              <div className="grid grid-cols-2 gap-4 text-xs">
                                <div>
                                  <span className="font-medium text-foreground">Expected Response:</span>
                                  <div className="mt-1 space-y-1 text-muted-foreground">
                                    <div>Status: {test.expectedResponse.statusCode}</div>
                                    <div>Time: {test.expectedResponse.responseTime}</div>
                                    <div>Type: {test.expectedResponse.contentType}</div>
                                  </div>
                                </div>
                                <div>
                                  <span className="font-medium text-foreground">Assertions ({test.assertions.length}):</span>
                                  <div className="mt-1 space-y-1 text-muted-foreground">
                                    {test.assertions.slice(0, 3).map((assertion, idx) => (
                                      <div key={idx}>• {assertion.type} {assertion.operator} {assertion.value}</div>
                                    ))}
                                    {test.assertions.length > 3 && (
                                      <div>... and {test.assertions.length - 3} more</div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground">
                        Select tests and click "Create Selected" to add them to your test suite
                      </p>
                      <Button variant="outline" onClick={onClose}>
                        Close
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestCreationModal;