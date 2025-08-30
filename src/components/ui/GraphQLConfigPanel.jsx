import React, { useState, useEffect } from 'react';
import { useProjectContext } from '../../contexts/ProjectContext';
import Button from './Button';
import Icon from '../AppIcon';
import Input from './Input';

const GraphQLConfigPanel = ({ onSave, className = '' }) => {
  const { currentProject, getCurrentProjectSchema } = useProjectContext();
  const [selectedEntities, setSelectedEntities] = useState(new Set());
  const [resolverConfigs, setResolverConfigs] = useState({});
  const [schemaConfig, setSchemaConfig] = useState({
    enableSubscriptions: false,
    enableIntrospection: true,
    maxDepth: 10,
    maxComplexity: 1000
  });

  if (!currentProject) {
    return (
      <div className={`text-center p-4 ${className}`}>
        <Icon name="Network" size={24} className="text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">Select a project to configure GraphQL</p>
      </div>
    );
  }

  const schema = getCurrentProjectSchema();
  const { entities = [], connections = [] } = schema;

  const handleEntityToggle = (entityId) => {
    const newSelected = new Set(selectedEntities);
    if (newSelected.has(entityId)) {
      newSelected.delete(entityId);
    } else {
      newSelected.add(entityId);
    }
    setSelectedEntities(newSelected);
  };

  const handleResolverConfigChange = (entityId, resolverType, config) => {
    setResolverConfigs(prev => ({
      ...prev,
      [entityId]: {
        ...prev[entityId],
        [resolverType]: config
      }
    }));
  };

  const handleGenerateGraphQL = () => {
    if (selectedEntities.size === 0) {
      alert('Please select at least one entity to generate GraphQL schema');
      return;
    }

    const graphQLConfig = {
      entities: Array.from(selectedEntities).map(entityId => {
        const entity = entities.find(e => e.id === entityId);
        const config = resolverConfigs[entityId] || {};
        return {
          ...entity,
          resolvers: config
        };
      }),
      connections,
      schema: schemaConfig
    };

    if (onSave) {
      onSave(graphQLConfig);
    }
  };

  const generateGraphQLSchema = () => {
    let gqlSchema = `# GraphQL Schema for ${currentProject.name}\n`;
    gqlSchema += `# Generated on ${new Date().toLocaleString()}\n\n`;

    // Generate type definitions
    selectedEntities.forEach(entityId => {
      const entity = entities.find(e => e.id === entityId);
      if (!entity) return;

      gqlSchema += `type ${entity.name.charAt(0).toUpperCase() + entity.name.slice(1)} {\n`;
      entity.fields.forEach(field => {
        const fieldType = getGraphQLType(field.type);
        const nullable = field.nullable ? '' : '!';
        gqlSchema += `  ${field.name}: ${fieldType}${nullable}\n`;
      });
      gqlSchema += `}\n\n`;
    });

    // Generate input types
    selectedEntities.forEach(entityId => {
      const entity = entities.find(e => e.id === entityId);
      if (!entity) return;

      gqlSchema += `input ${entity.name.charAt(0).toUpperCase() + entity.name.slice(1)}Input {\n`;
      entity.fields.filter(f => !f.primaryKey && f.name !== 'created_at' && f.name !== 'updated_at').forEach(field => {
        const fieldType = getGraphQLType(field.type);
        const nullable = field.nullable ? '' : '!';
        gqlSchema += `  ${field.name}: ${fieldType}${nullable}\n`;
      });
      gqlSchema += `}\n\n`;
    });

    // Generate queries
    gqlSchema += `type Query {\n`;
    selectedEntities.forEach(entityId => {
      const entity = entities.find(e => e.id === entityId);
      if (!entity) return;

      gqlSchema += `  ${entity.name}(id: ID!): ${entity.name.charAt(0).toUpperCase() + entity.name.slice(1)}\n`;
      gqlSchema += `  ${entity.name}s(limit: Int = 10, offset: Int = 0): [${entity.name.charAt(0).toUpperCase() + entity.name.slice(1)}!]!\n`;
    });
    gqlSchema += `}\n\n`;

    // Generate mutations
    gqlSchema += `type Mutation {\n`;
    selectedEntities.forEach(entityId => {
      const entity = entities.find(e => e.id === entityId);
      if (!entity) return;

      gqlSchema += `  create${entity.name.charAt(0).toUpperCase() + entity.name.slice(1)}(input: ${entity.name.charAt(0).toUpperCase() + entity.name.slice(1)}Input!): ${entity.name.charAt(0).toUpperCase() + entity.name.slice(1)}!\n`;
      gqlSchema += `  update${entity.name.charAt(0).toUpperCase() + entity.name.slice(1)}(id: ID!, input: ${entity.name.charAt(0).toUpperCase() + entity.name.slice(1)}Input!): ${entity.name.charAt(0).toUpperCase() + entity.name.slice(1)}!\n`;
      gqlSchema += `  delete${entity.name.charAt(0).toUpperCase() + entity.name.slice(1)}(id: ID!): Boolean!\n`;
    });
    gqlSchema += `}\n\n`;

    // Generate subscriptions if enabled
    if (schemaConfig.enableSubscriptions) {
      gqlSchema += `type Subscription {\n`;
      selectedEntities.forEach(entityId => {
        const entity = entities.find(e => e.id === entityId);
        if (!entity) return;

        gqlSchema += `  ${entity.name}Created: ${entity.name.charAt(0).toUpperCase() + entity.name.slice(1)}!\n`;
        gqlSchema += `  ${entity.name}Updated: ${entity.name.charAt(0).toUpperCase() + entity.name.slice(1)}!\n`;
        gqlSchema += `  ${entity.name}Deleted: ID!\n`;
      });
      gqlSchema += `}\n`;
    }

    return gqlSchema;
  };

  const getGraphQLType = (dbType) => {
    const typeMap = {
      'uuid': 'ID',
      'varchar': 'String',
      'text': 'String',
      'int': 'Int',
      'bigint': 'Int',
      'decimal': 'Float',
      'boolean': 'Boolean',
      'timestamp': 'DateTime',
      'date': 'Date',
      'jsonb': 'JSON'
    };
    return typeMap[dbType.toLowerCase()] || 'String';
  };

  const downloadSchema = () => {
    const schema = generateGraphQLSchema();
    const blob = new Blob([schema], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentProject.name.toLowerCase().replace(/\s+/g, '_')}_schema.graphql`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">GraphQL Configuration</h3>
          <p className="text-sm text-muted-foreground">
            Configure GraphQL resolvers and schema for {currentProject.name}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={downloadSchema}
          >
            <Icon name="Download" size={16} className="mr-2" />
            Download Schema
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleGenerateGraphQL}
          >
            <Icon name="Save" size={16} className="mr-2" />
            Save Configuration
          </Button>
        </div>
      </div>

      {/* Schema Configuration */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Schema Settings</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Enable Subscriptions</label>
            <input
              type="checkbox"
              checked={schemaConfig.enableSubscriptions}
              onChange={(e) => setSchemaConfig(prev => ({ ...prev, enableSubscriptions: e.target.checked }))}
              className="rounded border-border"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Enable Introspection</label>
            <input
              type="checkbox"
              checked={schemaConfig.enableIntrospection}
              onChange={(e) => setSchemaConfig(prev => ({ ...prev, enableIntrospection: e.target.checked }))}
              className="rounded border-border"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Max Depth</label>
            <Input
              type="number"
              value={schemaConfig.maxDepth}
              onChange={(e) => setSchemaConfig(prev => ({ ...prev, maxDepth: parseInt(e.target.value) || 10 }))}
              min="1"
              max="20"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Max Complexity</label>
            <Input
              type="number"
              value={schemaConfig.maxComplexity}
              onChange={(e) => setSchemaConfig(prev => ({ ...prev, maxComplexity: parseInt(e.target.value) || 1000 }))}
              min="100"
              max="10000"
            />
          </div>
        </div>
      </div>

      {/* Entity Selection */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Select Entities for GraphQL</h4>
        <div className="max-h-64 overflow-y-auto space-y-3">
          {entities.map((entity) => (
            <div
              key={entity.id}
              className={`p-4 border rounded-lg transition-smooth ${
                selectedEntities.has(entity.id)
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/30'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={selectedEntities.has(entity.id)}
                    onChange={() => handleEntityToggle(entity.id)}
                    className="rounded border-border"
                  />
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Icon name="Database" size={16} className="text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{entity.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {entity.fields?.length || 0} fields
                    </div>
                  </div>
                </div>
                <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
              </div>

              {/* Resolver Configuration */}
              {selectedEntities.has(entity.id) && (
                <div className="space-y-3 pt-3 border-t border-border">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground">Query Resolver</label>
                      <select
                        value={resolverConfigs[entity.id]?.query?.type || 'default'}
                        onChange={(e) => handleResolverConfigChange(entity.id, 'query', { type: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background"
                      >
                        <option value="default">Default (Database Query)</option>
                        <option value="custom">Custom Logic</option>
                        <option value="cached">Cached Query</option>
                        <option value="aggregated">Aggregated Data</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground">Mutation Resolver</label>
                      <select
                        value={resolverConfigs[entity.id]?.mutation?.type || 'default'}
                        onChange={(e) => handleResolverConfigChange(entity.id, 'mutation', { type: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background"
                      >
                        <option value="default">Default (CRUD)</option>
                        <option value="custom">Custom Business Logic</option>
                        <option value="validated">With Validation</option>
                        <option value="transactional">Transactional</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground">Data Return Type</label>
                      <select
                        value={resolverConfigs[entity.id]?.returnType || 'full'}
                        onChange={(e) => handleResolverConfigChange(entity.id, 'returnType', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background"
                      >
                        <option value="full">Full Entity Data</option>
                        <option value="summary">Summary Only</option>
                        <option value="custom">Custom Fields</option>
                        <option value="nested">With Related Data</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs text-muted-foreground">Business Logic</label>
                      <textarea
                        placeholder="Custom business logic, validation rules, or data transformations..."
                        value={resolverConfigs[entity.id]?.businessLogic || ''}
                        onChange={(e) => handleResolverConfigChange(entity.id, 'businessLogic', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background resize-none"
                        rows="3"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Schema Preview */}
      {selectedEntities.size > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Generated Schema Preview</h4>
          <div className="bg-muted p-4 rounded-lg">
            <pre className="text-xs text-muted-foreground overflow-x-auto">
              {generateGraphQLSchema()}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default GraphQLConfigPanel; 