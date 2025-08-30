import React, { useState } from 'react';
import { useProjectContext } from '../../contexts/ProjectContext';
import Button from './Button';
import Icon from '../AppIcon';

const DatabaseSchemaPanel = ({ onImportSchema, onGenerateEndpoints, className = '' }) => {
  const { currentProject, getCurrentProjectSchema } = useProjectContext();
  const [selectedEntities, setSelectedEntities] = useState(new Set());
  const [showPreview, setShowPreview] = useState(false);

  if (!currentProject) {
    return (
      <div className={`text-center p-4 ${className}`}>
        <Icon name="Database" size={24} className="text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">Select a project to access database schema</p>
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

  const handleSelectAll = () => {
    setSelectedEntities(new Set(entities.map(e => e.id)));
  };

  const handleDeselectAll = () => {
    setSelectedEntities(new Set());
  };

  const handleImportSchema = () => {
    if (selectedEntities.size === 0) {
      alert('Please select at least one entity to import');
      return;
    }

    const selectedSchema = {
      entities: entities.filter(e => selectedEntities.has(e.id)),
      connections: connections.filter(c => 
        selectedEntities.has(c.sourceEntityId) && selectedEntities.has(c.targetEntityId)
      )
    };

    if (onImportSchema) {
      onImportSchema(selectedSchema);
    }
  };

  const handleGenerateEndpoints = () => {
    if (selectedEntities.size === 0) {
      alert('Please select at least one entity to generate endpoints');
      return;
    }

    const selectedSchema = {
      entities: entities.filter(e => selectedEntities.has(e.id)),
      connections: connections.filter(c => 
        selectedEntities.has(c.sourceEntityId) && selectedEntities.has(c.targetEntityId)
      )
    };

    if (onGenerateEndpoints) {
      onGenerateEndpoints(selectedSchema);
    }
  };

  const getEntityIcon = (entity) => {
    if (entity.name.includes('user')) return 'User';
    if (entity.name.includes('product')) return 'Package';
    if (entity.name.includes('order')) return 'ShoppingCart';
    if (entity.name.includes('category')) return 'Folder';
    if (entity.name.includes('post')) return 'FileText';
    if (entity.name.includes('team')) return 'Users';
    if (entity.name.includes('task')) return 'CheckSquare';
    if (entity.name.includes('warehouse')) return 'Building';
    if (entity.name.includes('inventory')) return 'Box';
    return 'Database';
  };

  const getEntityColor = (entity) => {
    if (entity.name.includes('user')) return 'bg-blue-500';
    if (entity.name.includes('product')) return 'bg-green-500';
    if (entity.name.includes('order')) return 'bg-purple-500';
    if (entity.name.includes('category')) return 'bg-orange-500';
    if (entity.name.includes('post')) return 'bg-indigo-500';
    if (entity.name.includes('team')) return 'bg-pink-500';
    if (entity.name.includes('task')) return 'bg-teal-500';
    if (entity.name.includes('warehouse')) return 'bg-gray-500';
    if (entity.name.includes('inventory')) return 'bg-red-500';
    return 'bg-gray-500';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Database Schema</h3>
          <p className="text-sm text-muted-foreground">
            Import schema from {currentProject.name} to generate API endpoints
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
          >
            <Icon name={showPreview ? "EyeOff" : "Eye"} size={16} className="mr-2" />
            {showPreview ? 'Hide' : 'Preview'}
          </Button>
        </div>
      </div>

      {/* Schema Summary */}
      <div className="grid grid-cols-2 gap-4 p-3 bg-muted rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">{entities.length}</div>
          <div className="text-xs text-muted-foreground">Entities</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">{connections.length}</div>
          <div className="text-xs text-muted-foreground">Relationships</div>
        </div>
      </div>

      {/* Entity Selection */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-foreground">Select Entities</h4>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSelectAll}
            >
              Select All
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDeselectAll}
            >
              Clear
            </Button>
          </div>
        </div>

        <div className="max-h-64 overflow-y-auto space-y-2">
          {entities.map((entity) => (
            <div
              key={entity.id}
              className={`p-3 border rounded-lg cursor-pointer transition-smooth ${
                selectedEntities.has(entity.id)
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/30'
              }`}
              onClick={() => handleEntityToggle(entity.id)}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 ${getEntityColor(entity)} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <Icon name={getEntityIcon(entity)} size={16} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground">{entity.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {entity.fields?.length || 0} fields
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {selectedEntities.has(entity.id) && (
                    <Icon name="Check" size={16} className="text-primary" />
                  )}
                  <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
                </div>
              </div>

              {/* Entity Preview */}
              {showPreview && (
                <div className="mt-3 pt-3 border-t border-border">
                  <div className="text-xs text-muted-foreground mb-2">Fields:</div>
                  <div className="grid grid-cols-2 gap-2">
                    {entity.fields?.slice(0, 6).map((field, index) => (
                      <div key={index} className="text-xs bg-background px-2 py-1 rounded">
                        <span className="font-mono text-primary">{field.name}</span>
                        <span className="text-muted-foreground ml-1">({field.type})</span>
                      </div>
                    ))}
                    {entity.fields?.length > 6 && (
                      <div className="text-xs text-muted-foreground px-2 py-1">
                        +{entity.fields.length - 6} more
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-3 pt-4 border-t border-border">
        <Button
          variant="outline"
          onClick={handleImportSchema}
          disabled={selectedEntities.size === 0}
          className="flex-1"
          iconName="Download"
          iconPosition="left"
        >
          Import Schema
        </Button>
        <Button
          variant="default"
          onClick={handleGenerateEndpoints}
          disabled={selectedEntities.size === 0}
          className="flex-1"
          iconName="Code"
          iconPosition="left"
        >
          Generate Endpoints
        </Button>
      </div>

      {/* Selected Entities Summary */}
      {selectedEntities.size > 0 && (
        <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="text-sm font-medium text-primary mb-2">
            Selected: {selectedEntities.size} entities
          </div>
          <div className="text-xs text-muted-foreground">
            {Array.from(selectedEntities).map(id => {
              const entity = entities.find(e => e.id === id);
              return entity?.name;
            }).join(', ')}
          </div>
        </div>
      )}
    </div>
  );
};

export default DatabaseSchemaPanel; 