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

  // Helper functions for generating code examples
  const generateCurlExample = (endpoint) => {
    const method = endpoint.method.toUpperCase();
    const path = endpoint.path.replace(/{(\w+)}/g, '$1');
    const hasAuth = !endpoint.path?.includes('auth');
    const hasBody = ['POST', 'PUT', 'PATCH'].includes(method);
    
    let curl = `curl -X ${method} "https://api.example.com/v1${path}"`;
    
    if (hasAuth) {
      curl += ` \\
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"`;
    }
    
    curl += ` \\
  -H "Content-Type: application/json"`;
    
    if (hasBody) {
      const bodyExample = getRequestExample(endpoint);
      curl += ` \\
  -d '${JSON.stringify(bodyExample, null, 2)}'`;
    }
    
    return curl;
  };

  const generateJavaScriptExample = (endpoint) => {
    const method = endpoint.method.toUpperCase();
    const path = endpoint.path.replace(/{(\w+)}/g, '${id}');
    const hasAuth = !endpoint.path?.includes('auth');
    const hasBody = ['POST', 'PUT', 'PATCH'].includes(method);
    
    let js = `const response = await fetch('https://api.example.com/v1${path}', {\n`;
    js += `  method: '${method}',\n`;
    js += `  headers: {\n`;
    js += `    'Content-Type': 'application/json',\n`;
    
    if (hasAuth) {
      js += `    'Authorization': 'Bearer ' + accessToken,\n`;
    }
    
    js += `  },\n`;
    
    if (hasBody) {
      const bodyExample = getRequestExample(endpoint);
      js += `  body: JSON.stringify(${JSON.stringify(bodyExample, null, 2)})\n`;
    }
    
    js += `});\n\nconst data = await response.json();\nconsole.log(data);`;
    
    return js;
  };

  const generatePythonExample = (endpoint) => {
    const method = endpoint.method.toLowerCase();
    const path = endpoint.path.replace(/{(\w+)}/g, '{id}');
    const hasAuth = !endpoint.path?.includes('auth');
    const hasBody = ['POST', 'PUT', 'PATCH'].includes(endpoint.method.toUpperCase());
    
    let python = `import requests\nimport json\n\n`;
    python += `url = "https://api.example.com/v1${path}"\n`;
    
    if (hasAuth) {
      python += `headers = {\n`;
      python += `    "Authorization": "Bearer " + access_token,\n`;
      python += `    "Content-Type": "application/json"\n`;
      python += `}\n\n`;
    } else {
      python += `headers = {"Content-Type": "application/json"}\n\n`;
    }
    
    if (hasBody) {
      const bodyExample = getRequestExample(endpoint);
      python += `data = ${JSON.stringify(bodyExample, null, 2)}\n\n`;
      python += `response = requests.${method}(url, headers=headers, json=data)`;
    } else {
      python += `response = requests.${method}(url, headers=headers)`;
    }
    
    python += `\n\nif response.status_code == 200:\n    print(response.json())\nelse:\n    print(f"Error: {response.status_code} - {response.text}")`;
    
    return python;
  };

  const generatePHPExample = (endpoint) => {
    const method = endpoint.method.toUpperCase();
    const path = endpoint.path.replace(/{(\w+)}/g, '$id');
    const hasAuth = !endpoint.path?.includes('auth');
    const hasBody = ['POST', 'PUT', 'PATCH'].includes(method);
    
    let php = `<?php\n\n$url = "https://api.example.com/v1${path}";\n`;
    
    if (hasAuth) {
      php += `$headers = [\n`;
      php += `    "Authorization: Bearer " . $accessToken,\n`;
      php += `    "Content-Type: application/json"\n`;
      php += `];\n\n`;
    } else {
      php += `$headers = ["Content-Type: application/json"];\n\n`;
    }
    
    if (hasBody) {
      const bodyExample = getRequestExample(endpoint);
      php += `$data = ${JSON.stringify(bodyExample, null, 2)};\n\n`;
      php += `$options = [\n`;
      php += `    "http" => [\n`;
      php += `        "header" => implode("\\r\\n", $headers),\n`;
      php += `        "method" => "${method}",\n`;
      php += `        "content" => json_encode($data)\n`;
      php += `    ]\n`;
      php += `];\n\n`;
    } else {
      php += `$options = [\n`;
      php += `    "http" => [\n`;
      php += `        "header" => implode("\\r\\n", $headers),\n`;
      php += `        "method" => "${method}"\n`;
      php += `    ]\n`;
      php += `];\n\n`;
    }
    
    php += `$context = stream_context_create($options);\n`;
    php += `$response = file_get_contents($url, false, $context);\n`;
    php += `$data = json_decode($response, true);\n\nprint_r($data);\n\n?>`;
    
    return php;
  };

  const getOpenAPIType = (fieldType) => {
    const typeMap = {
      'string': 'string',
      'number': 'number',
      'integer': 'integer',
      'boolean': 'boolean',
      'date': 'string',
      'datetime': 'string',
      'email': 'string',
      'url': 'string',
      'text': 'string',
      'json': 'object'
    };
    return typeMap[fieldType?.toLowerCase()] || 'string';
  };

  const getExampleValue = (fieldType, fieldName) => {
    const name = fieldName?.toLowerCase() || '';
    
    if (name.includes('email')) return 'user@example.com';
    if (name.includes('name')) return 'John Doe';
    if (name.includes('url')) return 'https://example.com';
    if (name.includes('phone')) return '+1-555-123-4567';
    if (name.includes('address')) return '123 Main St, City, State 12345';
    if (name.includes('description')) return 'Sample description text';
    if (name.includes('title')) return 'Sample Title';
    if (name.includes('status')) return 'active';
    if (name.includes('role')) return 'user';
    if (name.includes('type')) return 'standard';
    if (name.includes('category')) return 'general';
    if (name.includes('priority')) return 'medium';
    if (name.includes('amount') || name.includes('price')) return 99.99;
    if (name.includes('count') || name.includes('quantity')) return 10;
    if (name.includes('id')) return '123e4567-e89b-12d3-a456-426614174000';
    
    switch (fieldType?.toLowerCase()) {
      case 'string': case 'text': return 'Sample text';
      case 'email': return 'user@example.com';
      case 'url': return 'https://example.com';
      case 'number': case 'integer': return 42;
      case 'boolean': return true;
      case 'date': return '2024-01-15';
      case 'datetime': return '2024-01-15T10:30:00Z';
      default: return 'Sample value';
    }
  };

  const getRequestExample = (endpoint, entity) => {
    const method = endpoint.method?.toUpperCase();
    
    if (endpoint.path?.includes('auth')) {
      if (endpoint.path?.includes('login')) {
        return {
          email: 'user@example.com',
          password: 'securePassword123'
        };
      }
      if (endpoint.path?.includes('register')) {
        return {
          name: 'John Doe',
          email: 'user@example.com',
          password: 'securePassword123',
          confirmPassword: 'securePassword123'
        };
      }
      if (endpoint.path?.includes('forgot')) {
        return {
          email: 'user@example.com'
        };
      }
    }
    
    if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
      if (entity?.fields) {
        return entity.fields.reduce((acc, field) => {
          if (field.name !== 'id' && field.name !== 'created_at' && field.name !== 'updated_at') {
            acc[field.name] = getExampleValue(field.type, field.name);
          }
          return acc;
        }, {});
      }
      
      return {
        name: 'Sample Name',
        description: 'Sample description',
        status: 'active',
        category: 'general'
      };
    }
    
    return null;
  };

  const getResponseExample = (endpoint, isList = false) => {
    const method = endpoint.method?.toUpperCase();
    
    if (endpoint.path?.includes('auth')) {
      if (endpoint.path?.includes('login')) {
        return {
          success: true,
          data: {
            user: {
              id: '123e4567-e89b-12d3-a456-426614174000',
              name: 'John Doe',
              email: 'user@example.com',
              role: 'user'
            },
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            refreshToken: 'def50200abc123...',
            expiresIn: 3600
          },
          message: 'Login successful'
        };
      }
    }
    
    if (isList) {
      return {
        success: true,
        data: {
          items: [
            {
              id: '123e4567-e89b-12d3-a456-426614174000',
              name: 'Sample Item 1',
              description: 'Description for item 1',
              status: 'active',
              created_at: '2024-01-15T10:30:00Z',
              updated_at: '2024-01-15T10:30:00Z'
            },
            {
              id: '456f7890-f12c-34e5-b678-537725285001',
              name: 'Sample Item 2',
              description: 'Description for item 2',
              status: 'active',
              created_at: '2024-01-14T15:20:00Z',
              updated_at: '2024-01-14T15:20:00Z'
            }
          ],
          pagination: {
            page: 1,
            limit: 20,
            total: 150,
            totalPages: 8
          }
        },
        message: 'Data retrieved successfully'
      };
    }
    
    return {
      success: true,
      data: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Sample Item',
        description: 'Sample description',
        status: 'active',
        created_at: '2024-01-15T10:30:00Z',
        updated_at: '2024-01-15T10:30:00Z'
      },
      message: method === 'POST' ? 'Resource created successfully' : 'Operation completed successfully'
    };
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
        description: `Complete REST API reference for ${currentProject.name}. This API provides comprehensive endpoints for managing ${entities.map(e => e.name).join(', ')} and related business operations with full CRUD capabilities, authentication, and advanced filtering.`,
        version: '1.0.0',
        baseUrl: 'https://api.example.com/v1',
        contact: {
          name: 'API Support Team',
          email: 'api-support@company.com',
          url: 'https://docs.company.com/api'
        },
        license: {
          name: 'MIT License',
          url: 'https://opensource.org/licenses/MIT'
        },
        termsOfService: 'https://company.com/terms',
        externalDocs: {
          description: 'Find more info here',
          url: 'https://docs.company.com'
        }
      },
      endpoints: endpoints.map(endpoint => {
        const method = endpoint.method?.toLowerCase();
        const isCreateEndpoint = method === 'post';
        const isUpdateEndpoint = method === 'put' || method === 'patch';
        const isDeleteEndpoint = method === 'delete';
        const isGetEndpoint = method === 'get';
        
        return {
          id: endpoint.id,
          name: endpoint.name,
          path: endpoint.path,
          method: endpoint.method,
          description: endpoint.description || `${endpoint.method} operation for ${endpoint.name}`,
          summary: `${endpoint.method} ${endpoint.path}`,
          category: endpoint.category || (endpoint.path?.includes('auth') ? 'Authentication' : 'Core API'),
          tags: [endpoint.category || 'General'],
          operationId: `${method}${endpoint.name?.replace(/\s+/g, '')}`,
          deprecated: false,
          security: endpoint.path?.includes('auth') ? [] : [{ bearerAuth: [] }],
          parameters: [
            // Path parameters
            ...(endpoint.path?.includes('{') ? [{
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'string', format: 'uuid' },
              description: 'Unique identifier for the resource',
              example: '123e4567-e89b-12d3-a456-426614174000'
            }] : []),
            // Query parameters for GET requests
            ...(isGetEndpoint ? [
              {
                name: 'page',
                in: 'query',
                required: false,
                schema: { type: 'integer', minimum: 1, default: 1 },
                description: 'Page number for pagination',
                example: 1
              },
              {
                name: 'limit',
                in: 'query',
                required: false,
                schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
                description: 'Number of items per page',
                example: 20
              },
              {
                name: 'sort',
                in: 'query',
                required: false,
                schema: { type: 'string', enum: ['asc', 'desc'], default: 'asc' },
                description: 'Sort order',
                example: 'desc'
              },
              {
                name: 'filter',
                in: 'query',
                required: false,
                schema: { type: 'string' },
                description: 'Filter criteria in JSON format',
                example: '{"status":"active"}'
              }
            ] : []),
            ...(endpoint.parameters || [])
          ],
          requestBody: (isCreateEndpoint || isUpdateEndpoint) ? {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: entities[0]?.fields?.reduce((acc, field) => {
                    if (field.name !== 'id' && field.name !== 'created_at' && field.name !== 'updated_at') {
                      acc[field.name] = {
                        type: getOpenAPIType(field.type),
                        description: `${field.name} field`,
                        example: getExampleValue(field.type, field.name)
                      };
                      if (field.required) {
                        acc[field.name].required = true;
                      }
                    }
                    return acc;
                  }, {}) || {
                    name: { type: 'string', description: 'Name of the resource', example: 'Sample Name' },
                    description: { type: 'string', description: 'Description of the resource', example: 'Sample description' }
                  }
                },
                required: entities[0]?.fields?.filter(f => f.required && f.name !== 'id').map(f => f.name) || ['name']
              }
            },
            examples: {
              'example-1': {
                summary: 'Example request',
                value: getRequestExample(endpoint, entities[0])
              }
            }
          } : undefined,
          responses: {
            200: {
              description: isGetEndpoint ? 'Successful response with data' : 'Operation completed successfully',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      data: isGetEndpoint && !endpoint.path?.includes('{') ? {
                        type: 'object',
                        properties: {
                          items: {
                            type: 'array',
                            items: { $ref: '#/components/schemas/User' }
                          },
                          pagination: {
                            type: 'object',
                            properties: {
                              page: { type: 'integer', example: 1 },
                              limit: { type: 'integer', example: 20 },
                              total: { type: 'integer', example: 150 },
                              totalPages: { type: 'integer', example: 8 }
                            }
                          }
                        }
                      } : { $ref: '#/components/schemas/User' },
                      message: { type: 'string', example: 'Operation completed successfully' },
                      timestamp: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00Z' }
                    }
                  },
                  examples: {
                    'success-response': {
                      summary: 'Successful response',
                      value: getResponseExample(endpoint, isGetEndpoint)
                    }
                  }
                }
              }
            },
            ...(isCreateEndpoint ? {
              201: {
                description: 'Resource created successfully',
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        success: { type: 'boolean', example: true },
                        data: { $ref: '#/components/schemas/User' },
                        message: { type: 'string', example: 'Resource created successfully' }
                      }
                    }
                  }
                }
              }
            } : {}),
            400: {
              description: 'Bad Request - Invalid input data',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                  examples: {
                    'validation-error': {
                      summary: 'Validation error',
                      value: {
                        success: false,
                        error: {
                          code: 'VALIDATION_ERROR',
                          message: 'Invalid input data',
                          details: [
                            {
                              field: 'email',
                              message: 'Email format is invalid',
                              code: 'INVALID_FORMAT'
                            }
                          ]
                        },
                        timestamp: '2024-01-15T10:30:00Z'
                      }
                    }
                  }
                }
              }
            },
            401: {
              description: 'Unauthorized - Authentication required',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' },
                  examples: {
                    'auth-required': {
                      summary: 'Authentication required',
                      value: {
                        success: false,
                        error: {
                          code: 'UNAUTHORIZED',
                          message: 'Authentication token required',
                          details: 'Please provide a valid Bearer token'
                        }
                      }
                    }
                  }
                }
              }
            },
            403: {
              description: 'Forbidden - Insufficient permissions',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' }
                }
              }
            },
            404: {
              description: 'Not Found - Resource does not exist',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' }
                }
              }
            },
            ...(isUpdateEndpoint || isDeleteEndpoint ? {
              409: {
                description: 'Conflict - Resource conflict',
                content: {
                  'application/json': {
                    schema: { $ref: '#/components/schemas/Error' }
                  }
                }
              }
            } : {}),
            500: {
              description: 'Internal Server Error',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' }
                }
              }
            }
          },
          codeExamples: {
            curl: generateCurlExample(endpoint),
            javascript: generateJavaScriptExample(endpoint),
            python: generatePythonExample(endpoint),
            php: generatePHPExample(endpoint)
          }
        };
      }),
      schemas: {
        User: {
          type: 'object',
          required: ['id', 'email', 'name'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Unique identifier for the user',
              example: '123e4567-e89b-12d3-a456-426614174000',
              readOnly: true
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
              example: 'user@example.com',
              maxLength: 255
            },
            name: {
              type: 'string',
              description: 'User full name',
              example: 'John Doe',
              minLength: 1,
              maxLength: 100
            },
            role: {
              type: 'string',
              enum: ['admin', 'user', 'moderator'],
              description: 'User role in the system',
              example: 'user'
            },
            status: {
              type: 'string',
              enum: ['active', 'inactive', 'suspended'],
              description: 'User account status',
              example: 'active',
              default: 'active'
            },
            profile: {
              type: 'object',
              description: 'User profile information',
              properties: {
                avatar: {
                  type: 'string',
                  format: 'uri',
                  description: 'Avatar image URL',
                  example: 'https://api.example.com/avatars/user123.jpg'
                },
                bio: {
                  type: 'string',
                  description: 'User biography',
                  example: 'Software developer with 5 years of experience',
                  maxLength: 500
                },
                location: {
                  type: 'string',
                  description: 'User location',
                  example: 'San Francisco, CA'
                }
              }
            },
            preferences: {
              type: 'object',
              description: 'User preferences',
              properties: {
                language: {
                  type: 'string',
                  description: 'Preferred language',
                  example: 'en',
                  default: 'en'
                },
                timezone: {
                  type: 'string',
                  description: 'User timezone',
                  example: 'America/New_York'
                },
                notifications: {
                  type: 'object',
                  properties: {
                    email: { type: 'boolean', default: true },
                    push: { type: 'boolean', default: false },
                    sms: { type: 'boolean', default: false }
                  }
                }
              }
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation timestamp',
              example: '2024-01-15T10:30:00Z',
              readOnly: true
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
              example: '2024-01-15T14:30:00Z',
              readOnly: true
            }
          }
        },
        Error: {
          type: 'object',
          required: ['success', 'error'],
          properties: {
            success: {
              type: 'boolean',
              example: false,
              description: 'Indicates if the operation was successful'
            },
            error: {
              type: 'object',
              required: ['code', 'message'],
              properties: {
                code: {
                  type: 'string',
                  description: 'Error code',
                  example: 'VALIDATION_ERROR'
                },
                message: {
                  type: 'string',
                  description: 'Human-readable error message',
                  example: 'The provided data is invalid'
                },
                details: {
                  oneOf: [
                    {
                      type: 'string',
                      description: 'Additional error details'
                    },
                    {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          field: { type: 'string', description: 'Field name' },
                          message: { type: 'string', description: 'Field error message' },
                          code: { type: 'string', description: 'Field error code' }
                        }
                      }
                    }
                  ]
                }
              }
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Error timestamp',
              example: '2024-01-15T10:30:00Z'
            },
            trace_id: {
              type: 'string',
              description: 'Request trace ID for debugging',
              example: 'abc123def456'
            }
          }
        },
        ...entities.reduce((acc, entity) => {
          acc[entity.name] = {
            type: 'object',
            properties: entity.fields?.reduce((fieldAcc, field) => {
              fieldAcc[field.name] = {
                type: getOpenAPIType(field.type),
                description: `${field.name} field`,
                example: getExampleValue(field.type, field.name),
                ...(field.required ? { required: true } : {}),
                ...(field.unique ? { unique: true } : {})
              };
              return fieldAcc;
            }, {}) || {}
          };
          return acc;
        }, {})
      },
      authentication: {
        types: [
          {
            name: 'Bearer Token (JWT)',
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'JWT token authentication. Include the token in the Authorization header.',
            example: 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            howToObtain: 'Use the /auth/login endpoint to obtain a JWT token',
            tokenLifetime: '24 hours',
            refreshable: true
          },
          {
            name: 'API Key',
            type: 'apiKey',
            in: 'header',
            name: 'X-API-Key',
            description: 'API key authentication for server-to-server communication.',
            example: 'X-API-Key: your-api-key-here',
            howToObtain: 'Generate API keys in your dashboard settings',
            rateLimit: '1000 requests per hour'
          }
        ],
        flows: {
          authorizationCode: {
            authorizationUrl: 'https://api.example.com/oauth/authorize',
            tokenUrl: 'https://api.example.com/oauth/token',
            scopes: {
              'read': 'Read access to resources',
              'write': 'Write access to resources',
              'admin': 'Administrative access'
            }
          }
        }
      },
      rateLimit: {
        requests: 1000,
        window: '1 hour',
        headers: {
          limit: 'X-RateLimit-Limit',
          remaining: 'X-RateLimit-Remaining',
          reset: 'X-RateLimit-Reset'
        }
      },
      versioning: {
        strategy: 'URL path',
        current: 'v1',
        supported: ['v1'],
        deprecated: [],
        sunset: null
      }
    };
  };

  const apiDocs = getApiDocs();

  if (!apiDocs) {
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
          pt-16 transition-spatial min-h-screen flex items-center justify-center
          ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'}
        `}>
          <div className="text-center">
            <h2 className="text-xl font-semibold text-foreground mb-2">No Project Selected</h2>
            <p className="text-muted-foreground">Please select a project to view API documentation</p>
          </div>
        </main>
      </div>
    );
  }

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
        <div className="h-[calc(100vh-4rem)] flex">
          <div className="flex-1 p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {currentProject.name} API Documentation
              </h1>
              <p className="text-lg text-muted-foreground mb-4">
                Comprehensive REST API reference with detailed examples and code snippets
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-8">
              <div className="prose prose-lg max-w-none">
                <h2 className="text-2xl font-semibold text-foreground mb-6">API Endpoints</h2>
                
                {/* Authentication Endpoints */}
                <div className="mb-12">
                  <h3 className="text-xl font-medium text-foreground mb-6 flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                    Authentication
                  </h3>
                  
                  <div className="space-y-8">
                    {/* Login Endpoint */}
                    <div className="border border-border rounded-lg p-6 bg-muted/30">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-foreground flex items-center">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-mono mr-3">POST</span>
                          User Login
                        </h4>
                        <code className="text-sm bg-muted px-2 py-1 rounded">/auth/login</code>
                      </div>
                      <p className="text-muted-foreground mb-4">
                        Authenticate a user with email and password credentials. Returns a JWT token for subsequent API requests.
                      </p>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-medium text-foreground mb-2">Request Body</h5>
                          <div className="bg-background p-4 rounded border">
                            <pre className="text-sm text-foreground">
{`{
  "email": "user@example.com",
  "password": "securePassword123",
  "rememberMe": false
}`}
                            </pre>
                          </div>
                        </div>
                        <div>
                          <h5 className="font-medium text-foreground mb-2">Response (200)</h5>
                          <div className="bg-background p-4 rounded border">
                            <pre className="text-sm text-foreground">
{`{
  "success": true,
  "data": {
    "user": {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "John Doe",
      "email": "user@example.com",
      "role": "user"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  },
  "message": "Login successful"
}`}
                            </pre>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <h5 className="font-medium text-foreground mb-2">cURL Example</h5>
                        <div className="bg-background p-4 rounded border">
                          <pre className="text-sm text-foreground overflow-x-auto">
{`curl -X POST "https://api.example.com/v1/auth/login" \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "user@example.com",
    "password": "securePassword123"
  }'`}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* User Management Endpoints */}
                <div className="mb-12">
                  <h3 className="text-xl font-medium text-foreground mb-6 flex items-center">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                    User Management
                  </h3>
                  
                  <div className="space-y-8">
                    {/* Get All Users */}
                    <div className="border border-border rounded-lg p-6 bg-muted/30">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-foreground flex items-center">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-mono mr-3">GET</span>
                          Get All Users
                        </h4>
                        <code className="text-sm bg-muted px-2 py-1 rounded">/users</code>
                      </div>
                      <p className="text-muted-foreground mb-4">
                        Retrieve a paginated list of all users with filtering, sorting, and search capabilities.
                      </p>
                      
                      <div className="mb-4">
                        <h5 className="font-medium text-foreground mb-2">Query Parameters</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="text-sm">
                            <code className="bg-muted px-2 py-1 rounded mr-2">page</code>
                            <span className="text-muted-foreground">Page number (default: 1)</span>
                          </div>
                          <div className="text-sm">
                            <code className="bg-muted px-2 py-1 rounded mr-2">limit</code>
                            <span className="text-muted-foreground">Items per page (default: 20)</span>
                          </div>
                          <div className="text-sm">
                            <code className="bg-muted px-2 py-1 rounded mr-2">search</code>
                            <span className="text-muted-foreground">Search by name or email</span>
                          </div>
                          <div className="text-sm">
                            <code className="bg-muted px-2 py-1 rounded mr-2">status</code>
                            <span className="text-muted-foreground">Filter by status (active, inactive)</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-medium text-foreground mb-2">Response (200)</h5>
                          <div className="bg-background p-4 rounded border">
                            <pre className="text-sm text-foreground">
{`{
  "success": true,
  "data": {
    "users": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "user",
        "status": "active",
        "created_at": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}`}
                            </pre>
                          </div>
                        </div>
                        <div>
                          <h5 className="font-medium text-foreground mb-2">cURL Example</h5>
                          <div className="bg-background p-4 rounded border">
                            <pre className="text-sm text-foreground overflow-x-auto">
{`curl -X GET "https://api.example.com/v1/users?page=1&limit=20" \\
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"`}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Create User */}
                    <div className="border border-border rounded-lg p-6 bg-muted/30">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-foreground flex items-center">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-mono mr-3">POST</span>
                          Create User
                        </h4>
                        <code className="text-sm bg-muted px-2 py-1 rounded">/users</code>
                      </div>
                      <p className="text-muted-foreground mb-4">
                        Create a new user account. Email address must be unique in the system.
                      </p>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-medium text-foreground mb-2">Request Body</h5>
                          <div className="bg-background p-4 rounded border">
                            <pre className="text-sm text-foreground">
{`{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "user"
}`}
                            </pre>
                          </div>
                        </div>
                        <div>
                          <h5 className="font-medium text-foreground mb-2">Response (201)</h5>
                          <div className="bg-background p-4 rounded border">
                            <pre className="text-sm text-foreground">
{`{
  "success": true,
  "data": {
    "id": "456f7890-f12c-34e5-b678-537725285001",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "status": "active",
    "created_at": "2024-01-15T10:30:00Z"
  },
  "message": "User created successfully"
}`}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Get User by ID */}
                    <div className="border border-border rounded-lg p-6 bg-muted/30">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-foreground flex items-center">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-mono mr-3">GET</span>
                          Get User by ID
                        </h4>
                        <code className="text-sm bg-muted px-2 py-1 rounded">/users/{'{id}'}</code>
                      </div>
                      <p className="text-muted-foreground mb-4">
                        Retrieve detailed information about a specific user by their unique identifier.
                      </p>
                      
                      <div className="mb-4">
                        <h5 className="font-medium text-foreground mb-2">Path Parameters</h5>
                        <div className="text-sm">
                          <code className="bg-muted px-2 py-1 rounded mr-2">id</code>
                          <span className="text-muted-foreground">User UUID (required)</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-medium text-foreground mb-2">Response (200)</h5>
                          <div className="bg-background p-4 rounded border">
                            <pre className="text-sm text-foreground">
{`{
  "success": true,
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "status": "active",
    "profile": {
      "avatar": "https://api.example.com/avatars/user123.jpg",
      "bio": "Software developer",
      "location": "San Francisco, CA"
    },
    "created_at": "2024-01-15T10:30:00Z"
  }
}`}
                            </pre>
                          </div>
                        </div>
                        <div>
                          <h5 className="font-medium text-foreground mb-2">Error Response (404)</h5>
                          <div className="bg-background p-4 rounded border">
                            <pre className="text-sm text-foreground">
{`{
  "success": false,
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "User with specified ID does not exist"
  }
}`}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Codes Section */}
                <div className="mb-8">
                  <h3 className="text-xl font-medium text-foreground mb-4">HTTP Status Codes</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-border rounded p-4">
                      <div className="flex items-center mb-2">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-mono mr-2">200</span>
                        <span className="font-medium">OK</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Request successful</p>
                    </div>
                    <div className="border border-border rounded p-4">
                      <div className="flex items-center mb-2">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-mono mr-2">201</span>
                        <span className="font-medium">Created</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Resource created successfully</p>
                    </div>
                    <div className="border border-border rounded p-4">
                      <div className="flex items-center mb-2">
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-mono mr-2">400</span>
                        <span className="font-medium">Bad Request</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Invalid request data</p>
                    </div>
                    <div className="border border-border rounded p-4">
                      <div className="flex items-center mb-2">
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-mono mr-2">401</span>
                        <span className="font-medium">Unauthorized</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Authentication required</p>
                    </div>
                    <div className="border border-border rounded p-4">
                      <div className="flex items-center mb-2">
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-mono mr-2">403</span>
                        <span className="font-medium">Forbidden</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Insufficient permissions</p>
                    </div>
                    <div className="border border-border rounded p-4">
                      <div className="flex items-center mb-2">
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-mono mr-2">404</span>
                        <span className="font-medium">Not Found</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Resource not found</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default APIDocumentation;