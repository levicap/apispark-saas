import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const InspectorPanel = ({ selectedNode, onNodeUpdate, isCollapsed = false }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [codePreview, setCodePreview] = useState('');

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

  const graphqlTypes = [
    { value: 'query', label: 'Query' },
    { value: 'mutation', label: 'Mutation' },
    { value: 'subscription', label: 'Subscription' },
    { value: 'resolver', label: 'Resolver' },
    { value: 'schema', label: 'Schema' }
  ];

  const microserviceTypes = [
    { value: 'service', label: 'Service' },
    { value: 'gateway', label: 'API Gateway' },
    { value: 'loadbalancer', label: 'Load Balancer' },
    { value: 'messagequeue', label: 'Message Queue' },
    { value: 'circuitbreaker', label: 'Circuit Breaker' }
  ];

  const databaseTypes = [
    { value: 'table', label: 'Database Table' },
    { value: 'view', label: 'Database View' },
    { value: 'storedprocedure', label: 'Stored Procedure' },
    { value: 'trigger', label: 'Database Trigger' }
  ];

  const authTypes = [
    { value: 'none', label: 'No Authentication' },
    { value: 'jwt', label: 'JWT Bearer Token' },
    { value: 'oauth', label: 'OAuth 2.0' },
    { value: 'apikey', label: 'API Key' }
  ];

  const getNodeType = () => {
    if (selectedNode?.data?.graphqlType) return 'graphql';
    if (selectedNode?.data?.microserviceType) return 'microservice';
    if (selectedNode?.data?.databaseType) return 'database';
    return 'http';
  };

  const generateCode = () => {
    if (!selectedNode) return '';

    const nodeType = getNodeType();
    
    if (nodeType === 'graphql') {
      return generateGraphQLCode();
    } else if (nodeType === 'microservice') {
      return generateMicroserviceCode();
    } else if (nodeType === 'database') {
      return generateDatabaseCode();
    } else {
      return generateHTTPCode();
    }
  };

  const generateHTTPCode = () => {
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

  const generateGraphQLCode = () => {
    const graphqlType = selectedNode?.data?.graphqlType || 'query';
    const endpoint = selectedNode?.data?.endpoint || 'query { users }';
    
    if (graphqlType === 'query' || graphqlType === 'mutation') {
      return `// GraphQL ${graphqlType.charAt(0).toUpperCase() + graphqlType.slice(1)}
const typeDefs = gql\`
  ${graphqlType} {
    ${endpoint.replace(/^[^{]*{/, '').replace(/}$/, '')}
  }
\`;

const resolvers = {
  ${graphqlType}: {
    ${endpoint.match(/\w+/)?.[0] || 'users'}: async (parent, args, context) => {
      try {
        // Implementation here
        return await getUsers(args);
      } catch (error) {
        throw new Error(\`Failed to fetch users: \${error.message}\`);
      }
    }
  }
};`;
    } else if (graphqlType === 'resolver') {
      return `// GraphQL Resolver
const resolvers = {
  Query: {
    ${selectedNode?.name?.toLowerCase().replace(/\s+/g, '') || 'users'}: async (parent, args, context) => {
      try {
        // Resolver implementation
        return await getData(args);
      } catch (error) {
        throw new Error(\`Resolver error: \${error.message}\`);
      }
    }
  }
};`;
    }
    
    return `// GraphQL Schema Definition
const typeDefs = gql\`
  type ${selectedNode?.name?.replace(/\s+/g, '') || 'User'} {
    id: ID!
    name: String!
    email: String!
    createdAt: String!
    updatedAt: String!
  }
\`;`;
  };

  const generateMicroserviceCode = () => {
    const microserviceType = selectedNode?.data?.microserviceType || 'service';
    const endpoint = selectedNode?.data?.endpoint || '/api/service';
    
    if (microserviceType === 'service') {
      return `// Microservice Implementation
const express = require('express');
const app = express();

app.use(express.json());

// Service endpoints
app.get('${endpoint}', async (req, res) => {
  try {
    const result = await processServiceRequest(req.query);
    res.json({
      success: true,
      data: result,
      service: '${selectedNode?.name}',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Service error',
      message: error.message
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(\`${selectedNode?.name} service running on port \${PORT}\`);
});`;
    } else if (microserviceType === 'gateway') {
      return `// API Gateway Configuration
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Route to user service
app.use('/api/users', createProxyMiddleware({
  target: 'http://user-service:3001',
  changeOrigin: true,
  pathRewrite: {
    '^/api/users': '/api'
  }
}));

// Route to order service
app.use('/api/orders', createProxyMiddleware({
  target: 'http://order-service:3002',
  changeOrigin: true,
  pathRewrite: {
    '^/api/orders': '/api'
  }
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`API Gateway running on port \${PORT}\`);
});`;
    }
    
    return `// ${selectedNode?.name} Configuration
// Implementation for ${microserviceType} pattern`;
  };

  const generateDatabaseCode = () => {
    const databaseType = selectedNode?.data?.databaseType || 'table';
    const tableName = selectedNode?.data?.endpoint || 'table';
    
    if (databaseType === 'table') {
      return `-- Database Table Schema
CREATE TABLE ${tableName} (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_${tableName}_email ON ${tableName}(email);
CREATE INDEX idx_${tableName}_created_at ON ${tableName}(created_at);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_${tableName}_updated_at 
    BEFORE UPDATE ON ${tableName} 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();`;
    }
    
    return `-- ${selectedNode?.name} Database Configuration
-- Implementation for ${databaseType}`;
  };

  const handleFieldUpdate = (field, value) => {
    if (!selectedNode || !onNodeUpdate) return;

    const updatedNode = {
      ...selectedNode,
      data: {
        ...selectedNode?.data,
        [field]: value
      }
    };

    onNodeUpdate(updatedNode);
  };

  const renderGeneralTab = () => {
    const nodeType = getNodeType();
    
    return (
      <div className="p-4 space-y-4">
        <Input
          label="Component Name"
          value={selectedNode?.name}
          onChange={(e) => handleFieldUpdate('name', e?.target?.value)}
          placeholder="Enter component name"
        />

        {nodeType === 'http' && (
          <>
            <Input
              label="Endpoint Path"
              value={selectedNode?.data?.endpoint}
              onChange={(e) => handleFieldUpdate('endpoint', e?.target?.value)}
              placeholder="/api/endpoint"
            />

            <Select
              label="HTTP Method"
              options={httpMethods}
              value={selectedNode?.data?.method}
              onChange={(value) => handleFieldUpdate('method', value)}
            />
          </>
        )}

        {nodeType === 'graphql' && (
          <>
            <Select
              label="GraphQL Type"
              options={graphqlTypes}
              value={selectedNode?.data?.graphqlType}
              onChange={(value) => handleFieldUpdate('graphqlType', value)}
            />

            <Input
              label="GraphQL Operation"
              value={selectedNode?.data?.endpoint}
              onChange={(e) => handleFieldUpdate('endpoint', e?.target?.value)}
              placeholder="query { users }"
            />
          </>
        )}

        {nodeType === 'microservice' && (
          <>
            <Select
              label="Microservice Type"
              options={microserviceTypes}
              value={selectedNode?.data?.microserviceType}
              onChange={(value) => handleFieldUpdate('microserviceType', value)}
            />

            <Input
              label="Service Endpoint"
              value={selectedNode?.data?.endpoint}
              onChange={(e) => handleFieldUpdate('endpoint', e?.target?.value)}
              placeholder="/api/service"
            />
          </>
        )}

        {nodeType === 'database' && (
          <>
            <Select
              label="Database Type"
              options={databaseTypes}
              value={selectedNode?.data?.databaseType}
              onChange={(value) => handleFieldUpdate('databaseType', value)}
            />

            <Input
              label="Table/View Name"
              value={selectedNode?.data?.endpoint}
              onChange={(e) => handleFieldUpdate('endpoint', e?.target?.value)}
              placeholder="table_name"
            />
          </>
        )}

        <Input
          label="Description"
          value={selectedNode?.data?.description}
          onChange={(e) => handleFieldUpdate('description', e?.target?.value)}
          placeholder="Describe what this component does"
        />

        {/* Show schema information for database nodes */}
        {nodeType === 'database' && selectedNode?.data?.schema && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Table Schema</label>
            <div className="bg-muted rounded-lg p-3 max-h-32 overflow-y-auto">
              {selectedNode.data.schema.columns.map((column, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <span className="font-mono text-foreground">{column.name}</span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground">{column.type}</span>
                  {!column.nullable && (
                    <span className="text-xs px-1 py-0.5 bg-warning/10 text-warning rounded">required</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Show parameters for HTTP nodes */}
        {nodeType === 'http' && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Parameters</label>
            <div className="space-y-2">
              {(selectedNode?.data?.parameters || []).map((param, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-muted rounded-md">
                  <Icon name="Hash" size={14} className="text-muted-foreground" />
                  <span className="text-sm text-foreground">{param.name}</span>
                  <span className="text-xs text-muted-foreground">{param.type}</span>
                  {param.required && (
                    <span className="text-xs px-2 py-1 bg-warning/10 text-warning rounded">required</span>
                  )}
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full">
                <Icon name="Plus" size={14} />
                Add Parameter
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (isCollapsed) {
    return (
      <div className="w-12 bg-surface border-l border-border h-full flex flex-col items-center py-4">
        <Icon name="Settings" size={18} className="text-muted-foreground" />
      </div>
    );
  }

  if (!selectedNode) {
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
        {activeTab === 'general' && renderGeneralTab()}

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
              <Button variant="outline" size="sm" className="mt-2">
                <Icon name="Edit" size={14} />
                Edit Schema
              </Button>
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
              <Button variant="outline" size="sm" className="mt-2">
                <Icon name="Edit" size={14} />
                Edit Schema
              </Button>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="p-4 space-y-4">
            <Select
              label="Authentication Type"
              options={authTypes}
              value={selectedNode?.data?.authType || 'none'}
              onChange={(value) => handleFieldUpdate('authType', value)}
            />

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
              <Button variant="outline" size="sm" onClick={() => setCodePreview(generateCode())}>
                <Icon name="RefreshCw" size={14} />
                Regenerate
              </Button>
            </div>

            <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
              <pre className="text-green-400 whitespace-pre-wrap">
                {codePreview || generateCode()}
              </pre>
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Icon name="Copy" size={14} />
                Copy Code
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Icon name="Download" size={14} />
                Export
              </Button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Language</label>
              <Select
                options={[
                  { value: 'nodejs', label: 'Node.js (Express)' },
                  { value: 'python', label: 'Python (FastAPI)' },
                  { value: 'java', label: 'Java (Spring Boot)' },
                  { value: 'csharp', label: 'C# (.NET)' }
                ]}
                value="nodejs"
                onChange={() => {}}
              />
            </div>
          </div>
        )}
      </div>
      {/* Footer Actions */}
      <div className="p-4 border-t border-border">
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Icon name="Trash2" size={14} />
            Delete
          </Button>
          <Button variant="default" size="sm" className="flex-1">
            <Icon name="Save" size={14} />
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InspectorPanel;