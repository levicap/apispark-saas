import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const FieldsTab = ({ fields = [], onFieldsChange }) => {
  const [draggedField, setDraggedField] = useState(null);

  const dataTypes = [
    { value: 'varchar', label: 'VARCHAR' },
    { value: 'text', label: 'TEXT' },
    { value: 'int', label: 'INTEGER' },
    { value: 'bigint', label: 'BIGINT' },
    { value: 'decimal', label: 'DECIMAL' },
    { value: 'float', label: 'FLOAT' },
    { value: 'boolean', label: 'BOOLEAN' },
    { value: 'date', label: 'DATE' },
    { value: 'datetime', label: 'DATETIME' },
    { value: 'timestamp', label: 'TIMESTAMP' },
    { value: 'json', label: 'JSON' },
    { value: 'uuid', label: 'UUID' }
  ];

  const handleAddField = () => {
    const newField = {
      id: Date.now(),
      name: '',
      type: 'varchar',
      length: '255',
      nullable: true,
      primaryKey: false,
      unique: false,
      autoIncrement: false,
      defaultValue: '',
      comment: ''
    };
    onFieldsChange([...fields, newField]);
  };

  const handleUpdateField = (fieldId, updates) => {
    const updatedFields = fields?.map(field => 
      field?.id === fieldId ? { ...field, ...updates } : field
    );
    onFieldsChange(updatedFields);
  };

  const handleRemoveField = (fieldId) => {
    const updatedFields = fields?.filter(field => field?.id !== fieldId);
    onFieldsChange(updatedFields);
  };

  const handleDragStart = (e, field) => {
    setDraggedField(field);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetField) => {
    e?.preventDefault();
    if (!draggedField || draggedField?.id === targetField?.id) return;

    const draggedIndex = fields?.findIndex(f => f?.id === draggedField?.id);
    const targetIndex = fields?.findIndex(f => f?.id === targetField?.id);
    
    const newFields = [...fields];
    const [removed] = newFields?.splice(draggedIndex, 1);
    newFields?.splice(targetIndex, 0, removed);
    
    onFieldsChange(newFields);
    setDraggedField(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-medium text-text-primary">Fields</h3>
          <p className="text-sm text-text-secondary mt-1">
            Define the structure and properties of your entity fields
          </p>
        </div>
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
      {fields?.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
          <Icon name="Columns" size={48} className="mx-auto mb-4 text-text-secondary opacity-50" />
          <h4 className="text-lg font-medium text-text-primary mb-2">No fields defined</h4>
          <p className="text-text-secondary mb-4">Start building your entity by adding fields</p>
          <Button
            variant="default"
            iconName="Plus"
            iconPosition="left"
            onClick={handleAddField}
          >
            Add Your First Field
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {fields?.map((field, index) => (
            <div
              key={field?.id}
              draggable
              onDragStart={(e) => handleDragStart(e, field)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, field)}
              className="bg-card border border-border rounded-lg p-4 space-y-4 hover:shadow-subtle transition-smooth cursor-move"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon name="GripVertical" size={16} className="text-text-secondary" />
                  <span className="text-sm font-medium text-text-secondary">
                    Field {index + 1}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Trash2"
                  iconSize={16}
                  onClick={() => handleRemoveField(field?.id)}
                  className="text-error hover:text-error"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Field Name"
                  type="text"
                  placeholder="field_name"
                  value={field?.name}
                  onChange={(e) => handleUpdateField(field?.id, { name: e?.target?.value })}
                  required
                />
                <Select
                  label="Data Type"
                  options={dataTypes}
                  value={field?.type}
                  onChange={(value) => handleUpdateField(field?.id, { type: value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Length/Size"
                  type="text"
                  placeholder="255"
                  value={field?.length}
                  onChange={(e) => handleUpdateField(field?.id, { length: e?.target?.value })}
                  description="For VARCHAR, DECIMAL precision, etc."
                />
                <Input
                  label="Default Value"
                  type="text"
                  placeholder="NULL"
                  value={field?.defaultValue}
                  onChange={(e) => handleUpdateField(field?.id, { defaultValue: e?.target?.value })}
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                <Checkbox
                  label="Auto Increment"
                  checked={field?.autoIncrement}
                  onChange={(e) => handleUpdateField(field?.id, { autoIncrement: e?.target?.checked })}
                />
              </div>

              <Input
                label="Comment"
                type="text"
                placeholder="Field description or notes"
                value={field?.comment}
                onChange={(e) => handleUpdateField(field?.id, { comment: e?.target?.value })}
                description="Optional documentation for this field"
              />
            </div>
          ))}
        </div>
      )}
      {fields?.length > 0 && (
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="text-sm text-text-secondary">
            {fields?.length} field{fields?.length !== 1 ? 's' : ''} defined
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              iconPosition="left"
            >
              Export Schema
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="Upload"
              iconPosition="left"
            >
              Import Fields
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FieldsTab;