import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { useToast } from '../../../contexts/ToastContext';

const TryItPanel = ({ endpoint, baseUrl, onClose }) => {
  const [requestData, setRequestData] = useState({});
  const [headers, setHeaders] = useState({
    'Authorization': 'Bearer your-access-token',
    'Content-Type': 'application/json'
  });
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('params');
  const { success, error: showError } = useToast();

  const handleParameterChange = (paramName, value) => {
    setRequestData(prev => ({
      ...prev,
      [paramName]: value
    }));
  };

  const handleHeaderChange = (headerName, value) => {
    setHeaders(prev => ({
      ...prev,
      [headerName]: value
    }));
  };

  const addHeader = () => {
    const newHeaderName = `Custom-Header-${Object.keys(headers).length + 1}`;
    setHeaders(prev => ({
      ...prev,
      [newHeaderName]: ''
    }));
    success('Custom header added');
  };

  const removeHeader = (headerName) => {
    setHeaders(prev => {
      const newHeaders = { ...prev };
      delete newHeaders[headerName];
      return newHeaders;
    });
    success('Header removed');
  };

  const executeRequest = async () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockResponse = {
        status: 200,
        statusText: 'OK',
        headers: {
          'content-type': 'application/json',
          'x-response-time': '45ms',
          'x-request-id': 'req_' + Math.random().toString(36).substr(2, 9)
        },
        data: { message: 'Success', data: [] },
        timing: {
          total: 156,
          dns: 12,
          connect: 23,
          ssl: 34,
          send: 2,
          wait: 67,
          receive: 18
        }
      };
      
      setResponse(mockResponse);
      setLoading(false);
      
      if (mockResponse.status >= 200 && mockResponse.status < 300) {
        success('Request executed successfully!');
      } else {
        showError('Request failed. Please check your parameters.');
      }
    }, 1500);
  };

  const generateCurlCommand = () => {
    if (!endpoint) return '';
    
    const method = endpoint.method?.toUpperCase() || 'GET';
    const url = `${baseUrl}${endpoint.path}`;
    
    let curl = `curl -X ${method} "${url}"`;
    
    Object.entries(headers).forEach(([key, value]) => {
      if (value) {
        curl += ` \\\n  -H "${key}: ${value}"`;
      }
    });
    
    if (method !== 'GET' && Object.keys(requestData).length > 0) {
      curl += ` \\\n  -d '${JSON.stringify(requestData, null, 2)}'`;
    }
    
    return curl;
  };

  const tabs = [
    { id: 'params', label: 'Parameters', icon: 'Settings' },
    { id: 'headers', label: 'Headers', icon: 'List' },
    { id: 'body', label: 'Request Body', icon: 'FileText' }
  ];

  if (!endpoint) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-muted-foreground">
          <Icon name="FileText" size={48} className="mx-auto mb-4 opacity-50" />
          <p>Select an endpoint to try it out</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-surface border-l border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Try It Out</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded transition-colors"
          >
            <Icon name="X" size={16} />
          </button>
        </div>
        <div className="mt-2">
          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
            endpoint.method?.toUpperCase() === 'GET' ? 'text-green-600 bg-green-100' :
            endpoint.method?.toUpperCase() === 'POST' ? 'text-blue-600 bg-blue-100' :
            endpoint.method?.toUpperCase() === 'PUT' ? 'text-orange-600 bg-orange-100' :
            endpoint.method?.toUpperCase() === 'DELETE' ? 'text-red-600 bg-red-100' :
            'text-muted-foreground bg-muted'
          }`}>
            {endpoint.method}
          </span>
          <code className="ml-2 text-sm font-mono text-foreground">{endpoint.path}</code>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Icon name={tab.icon} size={14} />
                <span>{tab.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'params' && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground">Query Parameters</h4>
            {endpoint.parameters && endpoint.parameters.length > 0 ? (
              endpoint.parameters.map((param, index) => (
                <div key={index} className="space-y-2">
                  <label className="text-sm text-foreground">
                    {param.name}
                    {param.required && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  <input
                    type="text"
                    placeholder={param.description}
                    value={requestData[param.name] || ''}
                    onChange={(e) => handleParameterChange(param.name, e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No parameters required</p>
            )}
          </div>
        )}

        {activeTab === 'headers' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-foreground">Request Headers</h4>
              <button
                onClick={addHeader}
                className="text-sm text-primary hover:text-primary/80"
              >
                + Add Header
              </button>
            </div>
            {Object.entries(headers).map(([key, value]) => (
              <div key={key} className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Header name"
                  value={key}
                  onChange={(e) => {
                    const newHeaders = { ...headers };
                    delete newHeaders[key];
                    newHeaders[e.target.value] = value;
                    setHeaders(newHeaders);
                  }}
                  className="flex-1 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <input
                  type="text"
                  placeholder="Header value"
                  value={value}
                  onChange={(e) => handleHeaderChange(key, e.target.value)}
                  className="flex-1 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button
                  onClick={() => removeHeader(key)}
                  className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                >
                  <Icon name="Trash2" size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'body' && (
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-foreground">Request Body</h4>
            <textarea
              placeholder="Enter JSON request body..."
              value={JSON.stringify(requestData, null, 2)}
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  setRequestData(parsed);
                } catch (error) {
                  // Invalid JSON, keep as is
                }
              }}
              className="w-full h-32 px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
            />
          </div>
        )}
      </div>

      {/* Execute Button */}
      <div className="p-4 border-t border-border">
        <button
          onClick={executeRequest}
          disabled={loading}
          className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <Icon name="Loader2" size={16} className="animate-spin" />
              <span>Executing...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <Icon name="Play" size={16} />
              <span>Execute Request</span>
            </div>
          )}
        </button>
      </div>

      {/* Response */}
      {response && (
        <div className="border-t border-border">
          <div className="p-4">
            <h4 className="text-sm font-medium text-foreground mb-3">Response</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs font-medium rounded ${
                  response.status >= 200 && response.status < 300 ? 'text-green-600 bg-green-100' :
                  response.status >= 400 && response.status < 500 ? 'text-orange-600 bg-orange-100' :
                  response.status >= 500 ? 'text-red-600 bg-red-100' :
                  'text-muted-foreground bg-muted'
                }`}>
                  {response.status} {response.statusText}
                </span>
                <span className="text-xs text-muted-foreground">
                  {response.timing?.total}ms
                </span>
              </div>
              
              <div className="bg-muted p-3 rounded">
                <pre className="text-sm text-foreground overflow-x-auto">
                  <code>{JSON.stringify(response.data, null, 2)}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TryItPanel;