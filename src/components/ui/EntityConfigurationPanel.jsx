import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';
import Input from './Input';
import Select from './Select';
import { Checkbox } from './Checkbox';

const EntityConfigurationPanel = ({ 
  isOpen = false, 
  onClose, 
  selectedEntity = null,
  onSave,
  onDelete 
}) => {
  const [activeTab, setActiveTab] = useState('fields');
  const [entityData, setEntityData] = useState({
    name: '',
    fields: [],
    relationships: [],
    indexes: [],
    validation: {}
  });

  const tabs = [
    { id: 'fields', label: 'Fields', icon: 'Columns' },
    { id: 'relationships', label: 'Relations', icon: 'GitBranch' },
    { id: 'indexes', label: 'Indexes', icon: 'Zap' },
    { id: 'validation', label: 'Validation', icon: 'Shield' }
  ];

  const fieldTypes = [
    { value: 'varchar', label: 'VARCHAR' },
    { value: 'int', label: 'INTEGER' },
    { value: 'bigint', label: 'BIGINT' },
    { value: 'decimal', label: 'DECIMAL' },
    { value: 'boolean', label: 'BOOLEAN' },
    { value: 'date', label: 'DATE' },
    { value: 'datetime', label: 'DATETIME' },
    { value: 'text', label: 'TEXT' },
    { value: 'json', label: 'JSON' }
  ];

  const relationshipTypes = [
    { value: 'one-to-one', label: 'One to One' },
    { value: 'one-to-many', label: 'One to Many' },
    { value: 'many-to-one', label: 'Many to One' },
    { value: 'many-to-many', label: 'Many to Many' }
  ];

  useEffect(() => {
    if (selectedEntity) {
      setEntityData(selectedEntity);
    }
  }, [selectedEntity]);

  const handleSave = () => {
    if (onSave) {
      onSave(entityData);
    }
    onClose();
  };

  const handleAddField = () => {
    const newField = {
      id: Date.now(),
      name: '',
      type: 'varchar',
      length: '',
      nullable: true,
      primaryKey: false,
      unique: false,
      defaultValue: ''
    };
    setEntityData(prev => ({
      ...prev,
      fields: [...prev?.fields, newField]
    }));
  };

  const handleUpdateField = (fieldId, updates) => {
    setEntityData(prev => ({
      ...prev,
      fields: prev?.fields?.map(field => 
        field?.id === fieldId ? { ...field, ...updates } : field
      )
    }));
  };

  const handleRemoveField = (fieldId) => {
    setEntityData(prev => ({
      ...prev,
      fields: prev?.fields?.filter(field => field?.id !== fieldId)
    }));
  };

  const handleAddRelationship = () => {
    const newRelationship = {
      id: Date.now(),
      name: '',
      type: 'one-to-many',
      targetEntity: '',
      foreignKey: '',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    };
    setEntityData(prev => ({
      ...prev,
      relationships: [...prev?.relationships, newRelationship]
    }));
  };

  const handleAddIndex = () => {
    const newIndex = {
      id: Date.now(),
      name: '',
      fields: [],
      unique: false,
      type: 'btree'
    };
    setEntityData(prev => ({
      ...prev,
      indexes: [...prev?.indexes, newIndex]
    }));
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-panel z-200"
        onClick={onClose}
      />
      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-2xl bg-surface border-l border-border shadow-depth z-200 flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <Icon name="Settings" size={20} className="text-primary" />
            <div>
              <h2 className="text-lg font-semibold text-text-primary">
                Entity Configuration
              </h2>
              <p className="text-sm text-text-secondary">
                {entityData?.name || 'New Entity'}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            iconName="X"
            iconSize={20}
            onClick={onClose}
          />
        </div>

        {/* Entity Name */}
        <div className="p-6 border-b border-border">
          <Input
            label="Entity Name"
            type="text"
            placeholder="Enter entity name"
            value={entityData?.name}
            onChange={(e) => setEntityData(prev => ({ ...prev, name: e?.target?.value }))}
            required
          />
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-smooth ${
                activeTab === tab?.id
                  ? 'border-primary text-primary bg-primary/5' :'border-transparent text-text-secondary hover:text-text-primary hover:bg-muted'
              }`}
            >
              <Icon name={tab?.icon} size={16} />
              <span>{tab?.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">
          
          {/* Fields Tab */}
          {activeTab === 'fields' && (
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-medium text-text-primary">Fields</h3>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Plus"
                  iconPosition="left"
                  onClick={handleAddField}
                >
                  Add Field
                </Button>
              </div>

              <div className="space-y-4">
                {entityData?.fields?.map((field) => (
                  <div key={field?.id} className="p-4 border border-border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <Input
                        label="Field Name"
                        type="text"
                        placeholder="field_name"
                        value={field?.name}
                        onChange={(e) => handleUpdateField(field?.id, { name: e?.target?.value })}
                        className="flex-1 mr-3"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Trash2"
                        iconSize={16}
                        onClick={() => handleRemoveField(field?.id)}
                        className="text-error hover:text-error"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Select
                        label="Type"
                        options={fieldTypes}
                        value={field?.type}
                        onChange={(value) => handleUpdateField(field?.id, { type: value })}
                      />
                      <Input
                        label="Length"
                        type="text"
                        placeholder="255"
                        value={field?.length}
                        onChange={(e) => handleUpdateField(field?.id, { length: e?.target?.value })}
                      />
                    </div>

                    <div className="flex flex-wrap gap-4">
                      <Checkbox
                        label="Nullable"
                        checked={field?.nullable}
                        onChange={(e) => handleUpdateField(field?.id, { nullable: e?.target?.checked })}
                      />
                      <Checkbox
                        label="Primary Key"
                        checked={field?.primaryKey}
                        onChange={(e) => handleUpdateField(field?.id, { primaryKey: e?.target?.checked })}
                      />
                      <Checkbox
                        label="Unique"
                        checked={field?.unique}
                        onChange={(e) => handleUpdateField(field?.id, { unique: e?.target?.checked })}
                      />
                    </div>

                    <Input
                      label="Default Value"
                      type="text"
                      placeholder="Default value"
                      value={field?.defaultValue}
                      onChange={(e) => handleUpdateField(field?.id, { defaultValue: e?.target?.value })}
                    />
                  </div>
                ))}

                {entityData?.fields?.length === 0 && (
                  <div className="text-center py-8 text-text-secondary">
                    <Icon name="Columns" size={48} className="mx-auto mb-3 opacity-50" />
                    <p>No fields defined yet</p>
                    <p className="text-sm">Click "Add Field" to get started</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Relationships Tab */}
          {activeTab === 'relationships' && (
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-medium text-text-primary">Relationships</h3>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Plus"
                  iconPosition="left"
                  onClick={handleAddRelationship}
                >
                  Add Relationship
                </Button>
              </div>

              <div className="space-y-4">
                {entityData?.relationships?.map((relationship) => (
                  <div key={relationship?.id} className="p-4 border border-border rounded-lg space-y-3">
                    <Input
                      label="Relationship Name"
                      type="text"
                      placeholder="relationship_name"
                      value={relationship?.name}
                      onChange={(e) => handleUpdateField(relationship?.id, { name: e?.target?.value })}
                    />
                    
                    <div className="grid grid-cols-2 gap-3">
                      <Select
                        label="Type"
                        options={relationshipTypes}
                        value={relationship?.type}
                        onChange={(value) => handleUpdateField(relationship?.id, { type: value })}
                      />
                      <Input
                        label="Target Entity"
                        type="text"
                        placeholder="target_entity"
                        value={relationship?.targetEntity}
                        onChange={(e) => handleUpdateField(relationship?.id, { targetEntity: e?.target?.value })}
                      />
                    </div>
                  </div>
                ))}

                {entityData?.relationships?.length === 0 && (
                  <div className="text-center py-8 text-text-secondary">
                    <Icon name="GitBranch" size={48} className="mx-auto mb-3 opacity-50" />
                    <p>No relationships defined yet</p>
                    <p className="text-sm">Click "Add Relationship" to get started</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Indexes Tab */}
          {activeTab === 'indexes' && (
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-medium text-text-primary">Indexes</h3>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Plus"
                  iconPosition="left"
                  onClick={handleAddIndex}
                >
                  Add Index
                </Button>
              </div>

              {entityData?.indexes?.length === 0 && (
                <div className="text-center py-8 text-text-secondary">
                  <Icon name="Zap" size={48} className="mx-auto mb-3 opacity-50" />
                  <p>No indexes defined yet</p>
                  <p className="text-sm">Click "Add Index" to get started</p>
                </div>
              )}
            </div>
          )}

          {/* Validation Tab */}
          {activeTab === 'validation' && (
            <div className="p-6 space-y-4">
              <h3 className="text-base font-medium text-text-primary">Validation Rules</h3>
              
              <div className="text-center py-8 text-text-secondary">
                <Icon name="Shield" size={48} className="mx-auto mb-3 opacity-50" />
                <p>Validation rules coming soon</p>
                <p className="text-sm">Define custom validation logic for your entity</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/30">
          <Button
            variant="outline"
            iconName="Trash2"
            iconPosition="left"
            onClick={onDelete}
            className="text-error hover:text-error"
          >
            Delete Entity
          </Button>
          
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              iconName="Save"
              iconPosition="left"
              onClick={handleSave}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EntityConfigurationPanel;