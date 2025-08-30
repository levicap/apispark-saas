import React, { useState, useEffect } from 'react';

// Simple Icon component for now
const Icon = ({ name, size = 16, className = '', color = 'currentColor' }) => (
  <span className={`inline-block ${className}`} style={{ width: size, height: size, color }}>
    {name === 'Settings' && '⚙️'}
    {name === 'Braces' && '{}'}
    {name === 'Shield' && '🛡️'}
    {name === 'Code' && '💻'}
    {name === 'MousePointer' && '👆'}
    {name === 'RefreshCw' && '🔄'}
    {name === 'Copy' && '📋'}
    {name === 'Download' && '⬇️'}
    {name === 'Trash2' && '🗑️'}
    {name === 'Save' && '💾'}
    {name === 'Edit' && '✏️'}
  </span>
);

const InspectorPanel = ({ selectedNode, onNodeUpdate, isCollapsed = false }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [codePreview, setCodePreview] = useState('');
  const [localNode, setLocalNode] = useState(selectedNode);

  // Always keep localNode in sync with selectedNode
  useEffect(() => {
    setLocalNode(selectedNode);
  }, [selectedNode]);

  const tabs = [
    { id: 'general', name: 'General', icon: 'Settings' },
    { id: 'schema', name: 'Schema', icon: 'Braces' },
    { id: 'security', name: 'Security', icon: 'Shield' },
    { id: 'code', name: 'Code', icon: 'Code' }
  ];

  const httpMethods = [
    { value: 'GET', label: 'GET' },
    { value: 'POST', label: 'POST' },
    { value: 'PUT', label: 'PUT' },
    { value: 'PATCH', label: 'PATCH' },
    { value: 'DELETE', label: 'DELETE' }
  ];

  const authTypes = [
    { value: 'none', label: 'No Authentication' },
    { value: 'jwt', label: 'JWT Bearer Token' },
    { value: 'oauth', label: 'OAuth 2.0' },
    { value: 'apikey', label: 'API Key' }
  ];

  const generateCode = () => {
    if (!selectedNode) return '';

    const method = selectedNode?.data?.method || 'GET';
    const endpoint = selectedNode?.data?.endpoint || '/api/endpoint';
    
    return `// Express.js Route Handler
app.${method?.toLowerCase()}('${endpoint}', async (req, res) => {
  try {
    // Request validation
    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: error.details 
      });
    }

    // Business logic here
    const result = await processRequest(value);
    
    // Success response
    res.status(200).json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});`;
  };

  const handleFieldChange = (field, value) => {
    // Update localNode only
    setLocalNode(prev => {
      if (!prev) return prev;
      if (["name", "color", "icon", "type", "position"].includes(field)) {
        return { ...prev, [field]: value };
      } else {
        return { ...prev, data: { ...prev.data, [field]: value } };
      }
    });
  };

  const handleFieldCommit = (field) => {
    if (!localNode || !onNodeUpdate) return;
    onNodeUpdate(localNode);
  };

  // Parameter editing logic
  const handleParameterChange = (idx, key, value) => {
    setLocalNode(prev => {
      if (!prev) return prev;
      const params = Array.isArray(prev.data?.parameters) ? [...prev.data.parameters] : [];
      params[idx] = { ...params[idx], [key]: value };
      // Immediately update the node in parent so selection is not lost
      if (onNodeUpdate) {
        const updatedNode = { ...prev, data: { ...prev.data, parameters: params } };
        onNodeUpdate(updatedNode);
      }
      return { ...prev, data: { ...prev.data, parameters: params } };
    });
  };

  const handleAddParameter = () => {
    setLocalNode(prev => {
      if (!prev) return prev;
      const params = Array.isArray(prev.data?.parameters) ? [...prev.data.parameters] : [];
      params.push({ name: "param" + (params.length + 1), type: "string", required: false });
      return { ...prev, data: { ...prev.data, parameters: params } };
    });
    setTimeout(() => {
      if (localNode && onNodeUpdate) {
        onNodeUpdate(localNode);
      }
    }, 0);
  };

  const handleRemoveParameter = (idx) => {
    setLocalNode(prev => {
      if (!prev) return prev;
      const params = Array.isArray(prev.data?.parameters) ? [...prev.data.parameters] : [];
      params.splice(idx, 1);
      return { ...prev, data: { ...prev.data, parameters: params } };
    });
    setTimeout(() => {
      if (localNode && onNodeUpdate) {
        onNodeUpdate(localNode);
      }
    }, 0);
  };

  const handleFieldUpdate = (field, value) => {
    if (!localNode || !onNodeUpdate) return;
    const updatedNode = { ...localNode, data: { ...localNode.data, [field]: value } };
    onNodeUpdate(updatedNode);
  };

  if (isCollapsed) {
    return (
      <div className="w-12 bg-surface border-l border-border h-full flex flex-col items-center py-4">
        <Icon name="Settings" size={18} className="text-muted-foreground" />
      </div>
    );
  }

  if (!localNode) {
    return (
      <div className="w-80 bg-surface border-l border-border h-full flex items-center justify-center">
        <div className="text-center max-w-xs">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="MousePointer" size={32} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            Select a Component
          </h3>
          <p className="text-sm text-muted-foreground">
            Click on any component in the canvas to view and edit its properties, configure schemas, and generate code.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-surface border-l border-border h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-3 mb-3">
          <div className={`w-8 h-8 ${selectedNode?.color} rounded-md flex items-center justify-center`}>
            <Icon name={selectedNode?.icon} size={16} color="white" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-foreground truncate">
              {selectedNode?.name}
            </h2>
            <p className="text-sm text-muted-foreground truncate">
              {selectedNode?.data?.endpoint}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-muted rounded-lg p-1">
          {tabs?.map(tab => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-xs font-medium rounded-md transition-smooth ${
                activeTab === tab?.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={tab?.icon} size={14} />
              <span className="hidden sm:inline">{tab?.name}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* General Tab */}
        {activeTab === 'general' && (
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Endpoint Name</label>
              <input
                type="text"
                value={localNode?.name || ''}
                onChange={(e) => handleFieldChange('name', e?.target?.value)}
                onBlur={() => handleFieldCommit('name')}
                onKeyDown={e => { if (e.key === 'Enter') handleFieldCommit('name'); }}
                placeholder="Enter endpoint name"
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Endpoint Path</label>
              <input
                type="text"
                value={localNode?.data?.endpoint || ''}
                onChange={(e) => handleFieldChange('endpoint', e?.target?.value)}
                onBlur={() => handleFieldCommit('endpoint')}
                onKeyDown={e => { if (e.key === 'Enter') handleFieldCommit('endpoint'); }}
                placeholder="/api/endpoint"
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">HTTP Method</label>
              <select
                value={localNode?.data?.method || 'GET'}
                onChange={(e) => { handleFieldChange('method', e.target.value); handleFieldCommit('method'); }}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                {httpMethods.map(method => (
                  <option key={method.value} value={method.value}>{method.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Description</label>
              <input
                type="text"
                value={localNode?.data?.description || ''}
                onChange={(e) => handleFieldChange('description', e?.target?.value)}
                onBlur={() => handleFieldCommit('description')}
                onKeyDown={e => { if (e.key === 'Enter') handleFieldCommit('description'); }}
                placeholder="Describe what this endpoint does"
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Parameters</label>
              <div className="space-y-2">
                {(Array.isArray(localNode?.data?.parameters) && localNode.data.parameters.length > 0) ? (
                  localNode.data.parameters.map((param, idx) => (
                    <div key={idx} className="flex items-center space-x-2 p-2 bg-muted rounded-md">
                      <input
                        className="w-24 px-2 py-1 text-sm border border-border rounded bg-background text-foreground"
                        value={param.name || ''}
                        onChange={e => handleParameterChange(idx, "name", e.target.value)}
                        placeholder="name"
                      />
                      <select
                        className="px-2 py-1 text-sm border border-border rounded bg-background text-foreground"
                        value={param.type || 'string'}
                        onChange={e => handleParameterChange(idx, "type", e.target.value)}
                      >
                        <option value="string">string</option>
                        <option value="number">number</option>
                        <option value="boolean">boolean</option>
                      </select>
                      <label className="flex items-center text-xs">
                        <input
                          type="checkbox"
                          checked={!!param.required}
                          onChange={e => handleParameterChange(idx, "required", e.target.checked)}
                          className="mr-1"
                        />
                        required
                      </label>
                      <button 
                        className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
                        onClick={() => handleRemoveParameter(idx)}
                      >
                        <Icon name="Trash2" size={14} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-muted-foreground">No parameters</div>
                )}
                <button 
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground hover:bg-muted transition-colors flex items-center justify-center space-x-2"
                  onClick={handleAddParameter}
                >
                  <Icon name="Plus" size={14} />
                  <span>Add Parameter</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Schema Tab */}
        {activeTab === 'schema' && (
          <div className="p-4 space-y-4">
            <div>
              <h3 className="text-sm font-medium text-foreground mb-3">Request Schema</h3>
              <div className="bg-muted rounded-lg p-3 font-mono text-sm">
                <pre className="text-foreground whitespace-pre-wrap">
{`{
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "minLength": 1
    },
    "email": {
      "type": "string",
      "format": "email"
    }
  },
  "required": ["name", "email"]
}`}
                </pre>
              </div>
              <button className="mt-2 px-3 py-2 border border-border rounded-md bg-background text-foreground hover:bg-muted transition-colors flex items-center space-x-2">
                <Icon name="Edit" size={14} />
                <span>Edit Schema</span>
              </button>
            </div>

            <div>
              <h3 className="text-sm font-medium text-foreground mb-3">Response Schema</h3>
              <div className="bg-muted rounded-lg p-3 font-mono text-sm">
                <pre className="text-foreground whitespace-pre-wrap">
{`{
  "type": "object",
  "properties": {
    "success": {
      "type": "boolean"
    },
    "data": {
      "type": "object"
    },
    "timestamp": {
      "type": "string",
      "format": "date-time"
    }
  }
}`}
                </pre>
              </div>
              <button className="mt-2 px-3 py-2 border border-border rounded-md bg-background text-foreground hover:bg-muted transition-colors flex items-center space-x-2">
                <Icon name="Edit" size={14} />
                <span>Edit Schema</span>
              </button>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Authentication Type</label>
              <select
                value={localNode?.data?.authType || 'none'}
                onChange={(e) => handleFieldUpdate('authType', e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                {authTypes.map(auth => (
                  <option key={auth.value} value={auth.value}>{auth.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Security Settings</label>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-foreground">Rate Limiting</p>
                    <p className="text-xs text-muted-foreground">Limit requests per minute</p>
                  </div>
                  <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-foreground">CORS Enabled</p>
                    <p className="text-xs text-muted-foreground">Allow cross-origin requests</p>
                  </div>
                  <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-foreground">Request Logging</p>
                    <p className="text-xs text-muted-foreground">Log all requests and responses</p>
                  </div>
                  <div className="w-12 h-6 bg-muted-foreground rounded-full relative cursor-pointer">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Code Tab */}
        {activeTab === 'code' && (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-foreground">Generated Code</h3>
              <button 
                className="px-3 py-2 border border-border rounded-md bg-background text-foreground hover:bg-muted transition-colors flex items-center space-x-2"
                onClick={() => setCodePreview(generateCode())}
              >
                <Icon name="RefreshCw" size={14} />
                <span>Regenerate</span>
              </button>
            </div>

            <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
              <pre className="text-green-400 whitespace-pre-wrap">
                {codePreview || generateCode()}
              </pre>
            </div>

            <div className="flex space-x-2">
              <button className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-foreground hover:bg-muted transition-colors flex items-center justify-center space-x-2">
                <Icon name="Copy" size={14} />
                <span>Copy Code</span>
              </button>
              <button className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-foreground hover:bg-muted transition-colors flex items-center justify-center space-x-2">
                <Icon name="Download" size={14} />
                <span>Export</span>
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Language</label>
              <select
                className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                defaultValue="nodejs"
              >
                <option value="nodejs">Node.js (Express)</option>
                <option value="python">Python (FastAPI)</option>
                <option value="java">Java (Spring Boot)</option>
                <option value="csharp">C# (.NET)</option>
              </select>
            </div>
          </div>
        )}
      </div>
      {/* Footer Actions */}
      <div className="p-4 border-t border-border">
        <div className="flex space-x-2">
          <button className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-foreground hover:bg-muted transition-colors flex items-center justify-center space-x-2">
            <Icon name="Trash2" size={14} />
            <span>Delete</span>
          </button>
          <button className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-foreground hover:bg-muted transition-colors flex items-center justify-center space-x-2">
            <Icon name="Save" size={14} />
            <span>Save</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InspectorPanel;