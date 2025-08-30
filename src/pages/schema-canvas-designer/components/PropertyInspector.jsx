import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const PropertyInspector = ({ 
  selectedEntity, 
  selectedConnection, 
  onEntityUpdate, 
  onConnectionUpdate,
  onClose,
  isCollapsed = false 
}) => {
  const [activeTab, setActiveTab] = useState('fields');
  const [entityData, setEntityData] = useState(null);
  const [connectionData, setConnectionData] = useState(null);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  const tabs = [
    { id: 'fields', label: 'Fields', icon: 'Columns' },
    { id: 'relationships', label: 'Relations', icon: 'GitBranch' },
    { id: 'indexes', label: 'Indexes', icon: 'Zap' },
    { id: 'constraints', label: 'Constraints', icon: 'Shield' }
  ];

  const fieldTypes = [
    { value: 'varchar', label: 'VARCHAR' },
    { value: 'char', label: 'CHAR' },
    { value: 'text', label: 'TEXT' },
    { value: 'longtext', label: 'LONGTEXT' },
    { value: 'int', label: 'INTEGER' },
    { value: 'bigint', label: 'BIGINT' },
    { value: 'smallint', label: 'SMALLINT' },
    { value: 'tinyint', label: 'TINYINT' },
    { value: 'decimal', label: 'DECIMAL' },
    { value: 'float', label: 'FLOAT' },
    { value: 'double', label: 'DOUBLE' },
    { value: 'boolean', label: 'BOOLEAN' },
    { value: 'date', label: 'DATE' },
    { value: 'datetime', label: 'DATETIME' },
    { value: 'timestamp', label: 'TIMESTAMP' },
    { value: 'time', label: 'TIME' },
    { value: 'year', label: 'YEAR' },
    { value: 'json', label: 'JSON' },
    { value: 'uuid', label: 'UUID' },
    { value: 'binary', label: 'BINARY' },
    { value: 'varbinary', label: 'VARBINARY' },
    { value: 'blob', label: 'BLOB' },
    { value: 'enum', label: 'ENUM' },
    { value: 'set', label: 'SET' }
  ];

  const relationshipTypes = [
    { value: 'one-to-one', label: 'One to One (1:1)' },
    { value: 'one-to-many', label: 'One to Many (1:N)' },
    { value: 'many-to-one', label: 'Many to One (N:1)' },
    { value: 'many-to-many', label: 'Many to Many (N:N)' }
  ];

  const constraintTypes = [
    { value: 'not_null', label: 'NOT NULL' },
    { value: 'unique', label: 'UNIQUE' },
    { value: 'primary_key', label: 'PRIMARY KEY' },
    { value: 'foreign_key', label: 'FOREIGN KEY' },
    { value: 'check', label: 'CHECK' },
    { value: 'default', label: 'DEFAULT' },
    { value: 'index', label: 'INDEX' }
  ];

  useEffect(() => {
    if (selectedEntity) {
      setEntityData({ ...selectedEntity });
      setConnectionData(null);
    } else if (selectedConnection) {
      setConnectionData({ ...selectedConnection });
      setEntityData(null);
    } else {
      setEntityData(null);
      setConnectionData(null);
    }
  }, [selectedEntity, selectedConnection]);

  const handleEntitySave = () => {
    if (entityData && onEntityUpdate) {
      // Validate entity data before saving
      if (!entityData.name || entityData.name.trim() === '') {
        alert('Entity name is required');
        return;
      }
      
      // Validate field names
      const invalidFields = entityData.fields?.filter(field => 
        !field.name || field.name.trim() === '' || 
        field.name.includes(' ') || 
        !/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(field.name)
      );
      
      if (invalidFields && invalidFields.length > 0) {
        alert('Field names must be valid identifiers (no spaces, start with letter or underscore)');
        return;
      }
      
      onEntityUpdate(entityData);
    }
  };

  const handleConnectionSave = () => {
    if (connectionData && onConnectionUpdate) {
      onConnectionUpdate(connectionData);
    }
  };

  const handleAddField = () => {
    if (!entityData) return;
    
    const newField = {
      id: Date.now(),
      name: '',
      type: 'varchar',
      length: '',
      precision: '',
      scale: '',
      nullable: true,
      primaryKey: false,
      unique: false,
      autoIncrement: false,
      defaultValue: '',
      comment: '',
      collation: '',
      charset: '',
      unsigned: false,
      zerofill: false
    };
    
    const updatedEntityData = {
      ...entityData,
      fields: [...(entityData.fields || []), newField]
    };
    
    setEntityData(updatedEntityData);
    
    // Update the entity immediately so changes appear on the canvas
    if (onEntityUpdate) {
      onEntityUpdate(updatedEntityData);
    }
  };

  const handleUpdateField = (fieldId, updates) => {
    if (!entityData) return;
    
    const updatedEntityData = {
      ...entityData,
      fields: entityData.fields?.map(field => 
        field?.id === fieldId ? { ...field, ...updates } : field
      )
    };
    
    setEntityData(updatedEntityData);
    
    // Update the entity immediately so changes appear on the canvas
    if (onEntityUpdate) {
      onEntityUpdate(updatedEntityData);
    }
  };

  const handleRemoveField = (fieldId) => {
    if (!entityData) return;
    
    const updatedEntityData = {
      ...entityData,
      fields: entityData.fields?.filter(field => field?.id !== fieldId)
    };
    
    setEntityData(updatedEntityData);
    
    // Update the entity immediately so changes appear on the canvas
    if (onEntityUpdate) {
      onEntityUpdate(updatedEntityData);
    }
  };

  const handleDuplicateField = (fieldId) => {
    if (!entityData) return;
    
    const fieldToDuplicate = entityData.fields?.find(f => f.id === fieldId);
    if (!fieldToDuplicate) return;
    
    const duplicatedField = {
      ...fieldToDuplicate,
      id: Date.now(),
      name: `${fieldToDuplicate.name}_copy`
    };
    
    const updatedEntityData = {
      ...entityData,
      fields: [...(entityData.fields || []), duplicatedField]
    };
    
    setEntityData(updatedEntityData);
    
    // Update the entity immediately so changes appear on the canvas
    if (onEntityUpdate) {
      onEntityUpdate(updatedEntityData);
    }
  };

  const getFieldIcon = (field) => {
    if (field?.primaryKey) return 'Key';
    if (field?.foreignKey) return 'Link';
    if (field?.unique) return 'Hash';
    if (field?.autoIncrement) return 'ArrowUp';
    return 'Minus';
  };

  const getFieldTypeDisplay = (field) => {
    let display = field.type?.toUpperCase();
    
    if (field.length && field.type !== 'text' && field.type !== 'longtext') {
      display += `(${field.length}`;
      if (field.precision && field.scale) {
        display += `,${field.precision},${field.scale}`;
      } else if (field.precision) {
        display += `,${field.precision}`;
      }
      display += ')';
    }
    
    if (field.unsigned) display += ' UNSIGNED';
    if (field.zerofill) display += ' ZEROFILL';
    
    return display;
  };

  if (isCollapsed) {
    return (
      <div className="w-12 bg-surface border-l border-border h-full flex flex-col items-center py-4 space-y-3">
        <Icon name="Settings" size={20} className="text-primary" />
        {(selectedEntity || selectedConnection) && (
          <div className="w-2 h-2 bg-accent rounded-full" />
        )}
      </div>
    );
  }

  if (!selectedEntity && !selectedConnection) {
    return (
      <div className="w-80 bg-surface border-l border-border h-full flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Icon name="MousePointer" size={48} className="mx-auto mb-3 text-text-secondary opacity-50" />
            <h3 className="text-base font-medium text-text-primary mb-2">No Selection</h3>
            <p className="text-sm text-text-secondary">
              Select an entity or connection to view its properties
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-surface border-l border-border h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Icon 
              name={selectedEntity ? "Table" : "GitBranch"} 
              size={20} 
              className="text-primary" 
            />
            <h2 className="text-lg font-semibold text-text-primary">
              {selectedEntity ? 'Entity Properties' : 'Connection Properties'}
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            iconSize={16}
            onClick={onClose}
          />
        </div>
        
        <p className="text-sm text-text-secondary">
          {selectedEntity ? entityData?.name : `${connectionData?.from} → ${connectionData?.to}`}
        </p>
      </div>

      {/* Entity Properties */}
      {selectedEntity && entityData && (
        <>
          {/* Entity Name */}
          <div className="p-4 border-b border-border">
            <Input
              label="Entity Name"
              type="text"
              placeholder="Enter entity name"
              value={entityData?.name || ''}
              onChange={(e) => {
                const updatedEntityData = { ...entityData, name: e.target.value };
                setEntityData(updatedEntityData);
                // Update the entity immediately so changes appear on the canvas
                if (onEntityUpdate) {
                  onEntityUpdate(updatedEntityData);
                }
              }}
              required
            />
            <Input
              label="Description"
              type="text"
              placeholder="Entity description"
              value={entityData?.description || ''}
              onChange={(e) => {
                const updatedEntityData = { ...entityData, description: e.target.value };
                setEntityData(updatedEntityData);
                // Update the entity immediately so changes appear on the canvas
                if (onEntityUpdate) {
                  onEntityUpdate(updatedEntityData);
                }
              }}
              className="mt-3"
            />
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border overflow-x-auto">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-smooth whitespace-nowrap ${
                  activeTab === tab?.id
                    ? 'border-primary text-primary bg-primary/5' :'border-transparent text-text-secondary hover:text-text-primary hover:bg-muted'
                }`}
              >
                <Icon name={tab?.icon} size={14} />
                <span>{tab?.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto">
            
            {/* Fields Tab */}
            {activeTab === 'fields' && (
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-text-primary">Fields</h3>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="Settings"
                      iconSize={14}
                      onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                      className={showAdvancedOptions ? 'bg-accent/10 text-accent' : ''}
                    >
                      Advanced
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="Plus"
                      iconSize={14}
                      onClick={handleAddField}
                    >
                      Add
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  {entityData?.fields?.map((field, index) => (
                    <div key={field?.id || index} className="p-3 border border-border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 flex-1">
                          <Icon name={getFieldIcon(field)} size={14} className="text-primary" />
                          <Input
                            type="text"
                            placeholder="field_name"
                            value={field?.name || ''}
                            onChange={(e) => handleUpdateField(field?.id || index, { name: e?.target?.value })}
                            className="flex-1"
                          />
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            iconName="Copy"
                            iconSize={14}
                            onClick={() => handleDuplicateField(field?.id || index)}
                            title="Duplicate field"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            iconName="Trash2"
                            iconSize={14}
                            onClick={() => handleRemoveField(field?.id || index)}
                            className="text-error hover:text-error"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <Select
                          options={fieldTypes}
                          value={field?.type || 'varchar'}
                          onChange={(value) => handleUpdateField(field?.id || index, { type: value })}
                          placeholder="Type"
                        />
                        <Input
                          type="text"
                          placeholder="Length"
                          value={field?.length || ''}
                          onChange={(e) => handleUpdateField(field?.id || index, { length: e?.target?.value })}
                        />
                      </div>

                      {showAdvancedOptions && (
                        <>
                          <div className="grid grid-cols-2 gap-2">
                            <Input
                              type="text"
                              placeholder="Precision"
                              value={field?.precision || ''}
                              onChange={(e) => handleUpdateField(field?.id || index, { precision: e?.target?.value })}
                            />
                            <Input
                              type="text"
                              placeholder="Scale"
                              value={field?.scale || ''}
                              onChange={(e) => handleUpdateField(field?.id || index, { scale: e?.target?.value })}
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <Input
                              type="text"
                              placeholder="Collation"
                              value={field?.collation || ''}
                              onChange={(e) => handleUpdateField(field?.id || index, { collation: e?.target?.value })}
                            />
                            <Input
                              type="text"
                              placeholder="Charset"
                              value={field?.charset || ''}
                              onChange={(e) => handleUpdateField(field?.id || index, { charset: e?.target?.value })}
                            />
                          </div>
                        </>
                      )}

                      <div className="flex flex-wrap gap-3">
                        <Checkbox
                          label="Nullable"
                          checked={field?.nullable !== false}
                          onChange={(e) => handleUpdateField(field?.id || index, { nullable: e?.target?.checked })}
                        />
                        <Checkbox
                          label="Primary Key"
                          checked={field?.primaryKey === true}
                          onChange={(e) => handleUpdateField(field?.id || index, { primaryKey: e?.target?.checked })}
                        />
                        <Checkbox
                          label="Unique"
                          checked={field?.unique === true}
                          onChange={(e) => handleUpdateField(field?.id || index, { unique: e?.target?.checked })}
                        />
                        <Checkbox
                          label="Auto Increment"
                          checked={field?.autoIncrement === true}
                          onChange={(e) => handleUpdateField(field?.id || index, { autoIncrement: e?.target?.checked })}
                        />
                        {showAdvancedOptions && (
                          <>
                            <Checkbox
                              label="Unsigned"
                              checked={field?.unsigned === true}
                              onChange={(e) => handleUpdateField(field?.id || index, { unsigned: e?.target?.checked })}
                            />
                            <Checkbox
                              label="Zerofill"
                              checked={field?.zerofill === true}
                              onChange={(e) => handleUpdateField(field?.id || index, { zerofill: e?.target?.checked })}
                            />
                          </>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          type="text"
                          placeholder="Default value"
                          value={field?.defaultValue || ''}
                          onChange={(e) => handleUpdateField(field?.id || index, { defaultValue: e?.target?.value })}
                        />
                        <Input
                          type="text"
                          placeholder="Comment"
                          value={field?.comment || ''}
                          onChange={(e) => handleUpdateField(field?.id || index, { comment: e?.target?.value })}
                        />
                      </div>

                      {/* Field Type Display */}
                      <div className="text-xs text-text-secondary bg-muted px-2 py-1 rounded">
                        <strong>Type:</strong> {getFieldTypeDisplay(field)}
                      </div>
                    </div>
                  ))}

                  {(!entityData?.fields || entityData?.fields?.length === 0) && (
                    <div className="text-center py-8 text-text-secondary">
                      <Icon name="Columns" size={32} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No fields defined</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Relationships Tab */}
            {activeTab === 'relationships' && (
              <div className="p-4">
                <div className="text-center py-8 text-text-secondary">
                  <Icon name="GitBranch" size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Relationships coming soon</p>
                </div>
              </div>
            )}

            {/* Indexes Tab */}
            {activeTab === 'indexes' && (
              <div className="p-4">
                <div className="text-center py-8 text-text-secondary">
                  <Icon name="Zap" size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Indexes coming soon</p>
                </div>
              </div>
            )}

            {/* Constraints Tab */}
            {activeTab === 'constraints' && (
              <div className="p-4">
                <div className="text-center py-8 text-text-secondary">
                  <Icon name="Shield" size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Constraints coming soon</p>
                </div>
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-text-secondary">
                Changes are saved automatically
              </div>
              <div className="flex items-center space-x-2 text-xs text-success">
                <Icon name="Check" size={14} />
                <span>Auto-saved</span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              iconName="RefreshCw"
              iconPosition="left"
              onClick={handleEntitySave}
              className="w-full"
            >
              Refresh Entity
            </Button>
          </div>
        </>
      )}
      {/* Connection Properties */}
      {selectedConnection && connectionData && (
        <>
          <div className="p-4 space-y-4">
            <h3 className="text-sm font-medium text-text-primary">Connection Details</h3>
            
            <Select
              label="Relationship Type"
              options={relationshipTypes}
              value={connectionData?.type || 'one-to-many'}
              onChange={(value) => setConnectionData(prev => ({ ...prev, type: value }))}
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="From Field"
                type="text"
                value={connectionData?.fromField || ''}
                onChange={(e) => setConnectionData(prev => ({ ...prev, fromField: e?.target?.value }))}
              />
              <Input
                label="To Field"
                type="text"
                value={connectionData?.toField || ''}
                onChange={(e) => setConnectionData(prev => ({ ...prev, toField: e?.target?.value }))}
              />
            </div>

            <Button
              variant="default"
              size="sm"
              iconName="Save"
              iconPosition="left"
              onClick={handleConnectionSave}
              className="w-full"
            >
              Save Connection
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default PropertyInspector;