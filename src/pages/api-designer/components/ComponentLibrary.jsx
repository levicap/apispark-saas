import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';

const ComponentLibrary = ({ onDragStart, isCollapsed = false }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('http');

  const componentCategories = [
    {
      id: 'http',
      name: 'HTTP Methods',
      icon: 'Globe',
      components: [
        {
          id: 'get',
          name: 'GET',
          description: 'Retrieve data from server',
          color: 'bg-green-500',
          icon: 'Download'
        },
        {
          id: 'post',
          name: 'POST',
          description: 'Create new resource',
          color: 'bg-blue-500',
          icon: 'Plus'
        },
        {
          id: 'put',
          name: 'PUT',
          description: 'Update entire resource',
          color: 'bg-orange-500',
          icon: 'Edit'
        },
        {
          id: 'patch',
          name: 'PATCH',
          description: 'Partial resource update',
          color: 'bg-yellow-500',
          icon: 'Edit2'
        },
        {
          id: 'delete',
          name: 'DELETE',
          description: 'Remove resource',
          color: 'bg-red-500',
          icon: 'Trash2'
        }
      ]
    },
    {
      id: 'graphql',
      name: 'GraphQL',
      icon: 'Braces',
      components: [
        {
          id: 'query',
          name: 'Query',
          description: 'GraphQL query operation',
          color: 'bg-purple-500',
          icon: 'Search'
        },
        {
          id: 'mutation',
          name: 'Mutation',
          description: 'GraphQL mutation operation',
          color: 'bg-pink-500',
          icon: 'Edit3'
        },
        {
          id: 'subscription',
          name: 'Subscription',
          description: 'GraphQL subscription operation',
          color: 'bg-indigo-500',
          icon: 'Radio'
        },
        {
          id: 'resolver',
          name: 'Resolver',
          description: 'GraphQL field resolver',
          color: 'bg-cyan-500',
          icon: 'Function'
        },
        {
          id: 'schema',
          name: 'Schema',
          description: 'GraphQL schema definition',
          color: 'bg-teal-500',
          icon: 'FileText'
        }
      ]
    },
    {
      id: 'microservices',
      name: 'Microservices',
      icon: 'Server',
      components: [
        {
          id: 'service',
          name: 'Service',
          description: 'Microservice instance',
          color: 'bg-blue-600',
          icon: 'Server'
        },
        {
          id: 'gateway',
          name: 'API Gateway',
          description: 'Service gateway/router',
          color: 'bg-green-600',
          icon: 'Gateway'
        },
        {
          id: 'loadbalancer',
          name: 'Load Balancer',
          description: 'Traffic distribution',
          color: 'bg-orange-600',
          icon: 'Scale'
        },
        {
          id: 'messagequeue',
          name: 'Message Queue',
          description: 'Async communication',
          color: 'bg-red-600',
          icon: 'MessageSquare'
        },
        {
          id: 'circuitbreaker',
          name: 'Circuit Breaker',
          description: 'Fault tolerance pattern',
          color: 'bg-yellow-600',
          icon: 'Shield'
        }
      ]
    },
    {
      id: 'database',
      name: 'Database',
      icon: 'Database',
      components: [
        {
          id: 'table',
          name: 'Database Table',
          description: 'Database table schema',
          color: 'bg-gray-600',
          icon: 'Table'
        },
        {
          id: 'view',
          name: 'Database View',
          description: 'Database view definition',
          color: 'bg-slate-600',
          icon: 'Eye'
        },
        {
          id: 'storedprocedure',
          name: 'Stored Procedure',
          description: 'Database stored procedure',
          color: 'bg-zinc-600',
          icon: 'Code'
        },
        {
          id: 'trigger',
          name: 'Database Trigger',
          description: 'Database trigger',
          color: 'bg-neutral-600',
          icon: 'Zap'
        }
      ]
    },
    {
      id: 'auth',
      name: 'Authentication',
      icon: 'Shield',
      components: [
        {
          id: 'jwt',
          name: 'JWT Validation',
          description: 'JSON Web Token authentication',
          color: 'bg-purple-500',
          icon: 'Key'
        },
        {
          id: 'oauth',
          name: 'OAuth 2.0',
          description: 'OAuth 2.0 authorization',
          color: 'bg-indigo-500',
          icon: 'Lock'
        },
        {
          id: 'apikey',
          name: 'API Key',
          description: 'API key validation',
          color: 'bg-pink-500',
          icon: 'Hash'
        }
      ]
    },
    {
      id: 'middleware',
      name: 'Middleware',
      icon: 'Layers',
      components: [
        {
          id: 'ratelimit',
          name: 'Rate Limiting',
          description: 'Control request frequency',
          color: 'bg-cyan-500',
          icon: 'Timer'
        },
        {
          id: 'logging',
          name: 'Logging',
          description: 'Request/response logging',
          color: 'bg-gray-500',
          icon: 'FileText'
        },
        {
          id: 'validation',
          name: 'Validation',
          description: 'Input data validation',
          color: 'bg-emerald-500',
          icon: 'CheckCircle'
        },
        {
          id: 'cors',
          name: 'CORS',
          description: 'Cross-origin resource sharing',
          color: 'bg-teal-500',
          icon: 'Globe2'
        },
        {
          id: 'caching',
          name: 'Caching',
          description: 'Response caching layer',
          color: 'bg-amber-500',
          icon: 'Database'
        }
      ]
    },
    {
      id: 'response',
      name: 'Response',
      icon: 'Send',
      components: [
        {
          id: 'json',
          name: 'JSON Response',
          description: 'Structured JSON data',
          color: 'bg-blue-600',
          icon: 'Braces'
        },
        {
          id: 'file',
          name: 'File Download',
          description: 'File download response',
          color: 'bg-green-600',
          icon: 'Download'
        },
        {
          id: 'stream',
          name: 'Streaming',
          description: 'Real-time data streaming',
          color: 'bg-purple-600',
          icon: 'Radio'
        }
      ]
    },
    {
      id: 'integration',
      name: 'Integration',
      icon: 'Zap',
      components: [
        {
          id: 'webhook',
          name: 'Webhook',
          description: 'HTTP callback trigger',
          color: 'bg-orange-600',
          icon: 'Webhook'
        },
        {
          id: 'external',
          name: 'External API',
          description: 'Third-party API connector',
          color: 'bg-red-600',
          icon: 'ExternalLink'
        }
      ]
    }
  ];

  const filteredCategories = componentCategories?.map(category => ({
    ...category,
    components: category?.components?.filter(component =>
      component?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      component?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase())
    )
  }))?.filter(category => category?.components?.length > 0);

  const handleDragStart = (e, component) => {
    e?.dataTransfer?.setData('application/json', JSON.stringify(component));
    if (onDragStart) {
      onDragStart(component);
    }
  };

  if (isCollapsed) {
    return (
      <div className="w-16 bg-surface border-r border-border h-full flex flex-col items-center py-4 space-y-4">
        {componentCategories?.map(category => (
          <button
            key={category?.id}
            onClick={() => setActiveCategory(category?.id)}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-smooth ${
              activeCategory === category?.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
            title={category?.name}
          >
            <Icon name={category?.icon} size={18} />
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="w-64 bg-surface border-r border-border h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground mb-3">Components</h2>
        <Input
          type="search"
          placeholder="Search components..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e?.target?.value)}
          className="w-full"
        />
      </div>
      {/* Category Tabs */}
      <div className="flex overflow-x-auto border-b border-border">
        {componentCategories?.map(category => (
          <button
            key={category?.id}
            onClick={() => setActiveCategory(category?.id)}
            className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-smooth ${
              activeCategory === category?.id
                ? 'text-primary border-b-2 border-primary bg-primary/5' :'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <Icon name={category?.icon} size={16} />
            <span>{category?.name}</span>
          </button>
        ))}
      </div>
      {/* Component List */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredCategories?.map(category => (
          <div key={category?.id} className={activeCategory === category?.id ? 'block' : 'hidden'}>
            <div className="space-y-3">
              {category?.components?.map(component => (
                <div
                  key={component?.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, component)}
                  className="group p-3 bg-card border border-border rounded-lg cursor-move hover:shadow-elevation-1 transition-smooth"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 ${component?.color} rounded-md flex items-center justify-center`}>
                      <Icon name={component?.icon} size={16} color="white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-smooth">
                        {component?.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {component?.description}
                      </p>
                    </div>
                    <Icon 
                      name="GripVertical" 
                      size={14} 
                      className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-smooth" 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {filteredCategories?.length === 0 && (
          <div className="text-center py-8">
            <Icon name="Search" size={32} className="text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No components found</p>
            <p className="text-xs text-muted-foreground mt-1">Try adjusting your search terms</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComponentLibrary;