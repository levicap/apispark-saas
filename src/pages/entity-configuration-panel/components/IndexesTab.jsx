import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const IndexesTab = ({ indexes = [], onIndexesChange, availableFields = [] }) => {
  const indexTypes = [
    { value: 'btree', label: 'B-Tree (Default)' },
    { value: 'hash', label: 'Hash' },
    { value: 'gin', label: 'GIN (Generalized Inverted)' },
    { value: 'gist', label: 'GiST (Generalized Search Tree)' },
    { value: 'spgist', label: 'SP-GiST' },
    { value: 'brin', label: 'BRIN (Block Range)' }
  ];

  const fieldOptions = availableFields?.map(field => ({
    value: field?.name,
    label: field?.name,
    description: `${field?.type}${field?.length ? `(${field?.length})` : ''}`
  }));

  const handleAddIndex = () => {
    const newIndex = {
      id: Date.now(),
      name: '',
      fields: [],
      type: 'btree',
      unique: false,
      partial: false,
      condition: '',
      comment: ''
    };
    onIndexesChange([...indexes, newIndex]);
  };

  const handleUpdateIndex = (indexId, updates) => {
    const updatedIndexes = indexes?.map(index => 
      index?.id === indexId ? { ...index, ...updates } : index
    );
    onIndexesChange(updatedIndexes);
  };

  const handleRemoveIndex = (indexId) => {
    const updatedIndexes = indexes?.filter(index => index?.id !== indexId);
    onIndexesChange(updatedIndexes);
  };

  const handleFieldsChange = (indexId, selectedFields) => {
    handleUpdateIndex(indexId, { fields: selectedFields });
  };

  const getIndexIcon = (type) => {
    const icons = {
      'btree': 'TreePine',
      'hash': 'Hash',
      'gin': 'Search',
      'gist': 'MapPin',
      'spgist': 'Layers',
      'brin': 'BarChart3'
    };
    return icons?.[type] || 'Zap';
  };

  const generateIndexName = (fields, unique = false) => {
    if (fields?.length === 0) return '';
    const prefix = unique ? 'unique_' : 'idx_';
    const fieldNames = fields?.join('_');
    return `${prefix}${fieldNames}`;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-medium text-text-primary">Indexes</h3>
          <p className="text-sm text-text-secondary mt-1">
            Optimize query performance with database indexes
          </p>
        </div>
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
      {indexes?.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
          <Icon name="Zap" size={48} className="mx-auto mb-4 text-text-secondary opacity-50" />
          <h4 className="text-lg font-medium text-text-primary mb-2">No indexes defined</h4>
          <p className="text-text-secondary mb-4">Add indexes to improve query performance</p>
          <Button
            variant="default"
            iconName="Plus"
            iconPosition="left"
            onClick={handleAddIndex}
          >
            Add Your First Index
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {indexes?.map((index, indexNum) => (
            <div
              key={index?.id}
              className="bg-card border border-border rounded-lg p-4 space-y-4 hover:shadow-subtle transition-smooth"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-warning/10 rounded-lg">
                    <Icon 
                      name={getIndexIcon(index?.type)} 
                      size={16} 
                      className="text-warning" 
                    />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-text-primary">
                      Index {indexNum + 1}
                    </span>
                    <p className="text-xs text-text-secondary">
                      {indexTypes?.find(t => t?.value === index?.type)?.label}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Trash2"
                  iconSize={16}
                  onClick={() => handleRemoveIndex(index?.id)}
                  className="text-error hover:text-error"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Index Name"
                  type="text"
                  placeholder={generateIndexName(index?.fields, index?.unique)}
                  value={index?.name}
                  onChange={(e) => handleUpdateIndex(index?.id, { name: e?.target?.value })}
                  description="Leave empty for auto-generated name"
                />
                <Select
                  label="Index Type"
                  options={indexTypes}
                  value={index?.type}
                  onChange={(value) => handleUpdateIndex(index?.id, { type: value })}
                />
              </div>

              <Select
                label="Fields"
                options={fieldOptions}
                value={index?.fields}
                onChange={(value) => handleFieldsChange(index?.id, value)}
                multiple
                searchable
                placeholder="Select fields to index"
                description="Order matters for composite indexes"
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Checkbox
                    label="Unique Index"
                    checked={index?.unique}
                    onChange={(e) => handleUpdateIndex(index?.id, { unique: e?.target?.checked })}
                    description="Enforce uniqueness constraint"
                  />
                  <Checkbox
                    label="Partial Index"
                    checked={index?.partial}
                    onChange={(e) => handleUpdateIndex(index?.id, { partial: e?.target?.checked })}
                    description="Index only rows matching a condition"
                  />
                </div>
                
                {index?.partial && (
                  <Input
                    label="WHERE Condition"
                    type="text"
                    placeholder="status = 'active'"
                    value={index?.condition}
                    onChange={(e) => handleUpdateIndex(index?.id, { condition: e?.target?.value })}
                    description="SQL condition for partial index"
                  />
                )}
              </div>

              <Input
                label="Comment"
                type="text"
                placeholder="Index description or purpose"
                value={index?.comment}
                onChange={(e) => handleUpdateIndex(index?.id, { comment: e?.target?.value })}
                description="Optional documentation for this index"
              />

              {/* Index Preview */}
              <div className="bg-muted/30 rounded-lg p-3 border border-border">
                <div className="text-xs font-mono text-text-secondary">
                  <div className="font-semibold mb-1">Generated SQL:</div>
                  <div className="bg-surface p-2 rounded border">
                    CREATE {index?.unique ? 'UNIQUE ' : ''}INDEX {index?.name || generateIndexName(index?.fields, index?.unique)}
                    <br />ON table_name {index?.type !== 'btree' ? `USING ${index?.type?.toUpperCase()} ` : ''}
                    ({index?.fields?.join(', ')})
                    {index?.partial && index?.condition ? `\nWHERE ${index?.condition}` : ''};
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {indexes?.length > 0 && (
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="text-sm text-text-secondary">
            {indexes?.length} index{indexes?.length !== 1 ? 'es' : ''} defined
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="BarChart3"
              iconPosition="left"
            >
              Analyze Performance
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              iconPosition="left"
            >
              Export DDL
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndexesTab;