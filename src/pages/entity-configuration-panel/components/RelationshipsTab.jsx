import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const RelationshipsTab = ({ relationships = [], onRelationshipsChange, availableEntities = [] }) => {
  const relationshipTypes = [
    { value: 'one-to-one', label: 'One to One (1:1)' },
    { value: 'one-to-many', label: 'One to Many (1:N)' },
    { value: 'many-to-one', label: 'Many to One (N:1)' },
    { value: 'many-to-many', label: 'Many to Many (N:N)' }
  ];

  const cascadeOptions = [
    { value: 'CASCADE', label: 'CASCADE' },
    { value: 'SET_NULL', label: 'SET NULL' },
    { value: 'RESTRICT', label: 'RESTRICT' },
    { value: 'NO_ACTION', label: 'NO ACTION' },
    { value: 'SET_DEFAULT', label: 'SET DEFAULT' }
  ];

  const entityOptions = availableEntities?.map(entity => ({
    value: entity?.id,
    label: entity?.name,
    description: `${entity?.fields?.length || 0} fields`
  }));

  const handleAddRelationship = () => {
    const newRelationship = {
      id: Date.now(),
      name: '',
      type: 'one-to-many',
      targetEntity: '',
      sourceField: '',
      targetField: '',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
      nullable: true,
      description: ''
    };
    onRelationshipsChange([...relationships, newRelationship]);
  };

  const handleUpdateRelationship = (relationshipId, updates) => {
    const updatedRelationships = relationships?.map(rel => 
      rel?.id === relationshipId ? { ...rel, ...updates } : rel
    );
    onRelationshipsChange(updatedRelationships);
  };

  const handleRemoveRelationship = (relationshipId) => {
    const updatedRelationships = relationships?.filter(rel => rel?.id !== relationshipId);
    onRelationshipsChange(updatedRelationships);
  };

  const getRelationshipIcon = (type) => {
    const icons = {
      'one-to-one': 'ArrowRight',
      'one-to-many': 'GitBranch',
      'many-to-one': 'GitMerge',
      'many-to-many': 'Network'
    };
    return icons?.[type] || 'ArrowRight';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-medium text-text-primary">Relationships</h3>
          <p className="text-sm text-text-secondary mt-1">
            Define how this entity connects to other entities
          </p>
        </div>
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
      {relationships?.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
          <Icon name="GitBranch" size={48} className="mx-auto mb-4 text-text-secondary opacity-50" />
          <h4 className="text-lg font-medium text-text-primary mb-2">No relationships defined</h4>
          <p className="text-text-secondary mb-4">Connect this entity to other entities in your schema</p>
          <Button
            variant="default"
            iconName="Plus"
            iconPosition="left"
            onClick={handleAddRelationship}
          >
            Add Your First Relationship
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {relationships?.map((relationship, index) => (
            <div
              key={relationship?.id}
              className="bg-card border border-border rounded-lg p-4 space-y-4 hover:shadow-subtle transition-smooth"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-accent/10 rounded-lg">
                    <Icon 
                      name={getRelationshipIcon(relationship?.type)} 
                      size={16} 
                      className="text-accent" 
                    />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-text-primary">
                      Relationship {index + 1}
                    </span>
                    <p className="text-xs text-text-secondary">
                      {relationshipTypes?.find(t => t?.value === relationship?.type)?.label}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Trash2"
                  iconSize={16}
                  onClick={() => handleRemoveRelationship(relationship?.id)}
                  className="text-error hover:text-error"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Relationship Name"
                  type="text"
                  placeholder="user_posts"
                  value={relationship?.name}
                  onChange={(e) => handleUpdateRelationship(relationship?.id, { name: e?.target?.value })}
                  required
                />
                <Select
                  label="Relationship Type"
                  options={relationshipTypes}
                  value={relationship?.type}
                  onChange={(value) => handleUpdateRelationship(relationship?.id, { type: value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Target Entity"
                  options={entityOptions}
                  value={relationship?.targetEntity}
                  onChange={(value) => handleUpdateRelationship(relationship?.id, { targetEntity: value })}
                  placeholder="Select target entity"
                  searchable
                />
                <Input
                  label="Foreign Key Field"
                  type="text"
                  placeholder="user_id"
                  value={relationship?.sourceField}
                  onChange={(e) => handleUpdateRelationship(relationship?.id, { sourceField: e?.target?.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="On Delete"
                  options={cascadeOptions}
                  value={relationship?.onDelete}
                  onChange={(value) => handleUpdateRelationship(relationship?.id, { onDelete: value })}
                  description="Action when parent record is deleted"
                />
                <Select
                  label="On Update"
                  options={cascadeOptions}
                  value={relationship?.onUpdate}
                  onChange={(value) => handleUpdateRelationship(relationship?.id, { onUpdate: value })}
                  description="Action when parent record is updated"
                />
              </div>

              <Input
                label="Description"
                type="text"
                placeholder="Describe this relationship"
                value={relationship?.description}
                onChange={(e) => handleUpdateRelationship(relationship?.id, { description: e?.target?.value })}
                description="Optional documentation for this relationship"
              />

              {/* Visual Relationship Preview */}
              <div className="bg-muted/30 rounded-lg p-3 border border-border">
                <div className="flex items-center justify-center space-x-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-primary rounded-sm"></div>
                    <span className="font-medium">Current Entity</span>
                  </div>
                  <Icon name={getRelationshipIcon(relationship?.type)} size={16} className="text-accent" />
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-secondary rounded-sm"></div>
                    <span className="font-medium">
                      {entityOptions?.find(e => e?.value === relationship?.targetEntity)?.label || 'Target Entity'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {relationships?.length > 0 && (
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="text-sm text-text-secondary">
            {relationships?.length} relationship{relationships?.length !== 1 ? 's' : ''} defined
          </div>
          <Button
            variant="outline"
            size="sm"
            iconName="Eye"
            iconPosition="left"
          >
            Preview Schema
          </Button>
        </div>
      )}
    </div>
  );
};

export default RelationshipsTab;