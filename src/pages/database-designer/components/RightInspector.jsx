import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const RightInspector = ({ 
  selectedTable, 
  onUpdateTable, 
  onGenerateCode,
  generatedCode = null,
  isGenerating = false
}) => {
  const [activeTab, setActiveTab] = useState('properties');
  const [codeLanguage, setCodeLanguage] = useState('sql');

  const dataTypeOptions = [
    { value: 'VARCHAR(255)', label: 'VARCHAR(255)' },
    { value: 'TEXT', label: 'TEXT' },
    { value: 'INT', label: 'INTEGER' },
    { value: 'BIGINT', label: 'BIGINT' },
    { value: 'DECIMAL(10,2)', label: 'DECIMAL' },
    { value: 'FLOAT', label: 'FLOAT' },
    { value: 'BOOLEAN', label: 'BOOLEAN' },
    { value: 'DATE', label: 'DATE' },
    { value: 'DATETIME', label: 'DATETIME' },
    { value: 'TIMESTAMP', label: 'TIMESTAMP' },
    { value: 'JSON', label: 'JSON' },
    { value: 'UUID', label: 'UUID' }
  ];

  const codeLanguageOptions = [
    { value: 'sql', label: 'SQL' },
    { value: 'prisma', label: 'Prisma' },
    { value: 'sequelize', label: 'Sequelize' },
    { value: 'typeorm', label: 'TypeORM' },
    { value: 'mongoose', label: 'Mongoose' }
  ];

  const tabs = [
    { id: 'properties', label: 'Properties', icon: 'Settings' },
    { id: 'relationships', label: 'Relations', icon: 'GitBranch' },
    { id: 'indexes', label: 'Indexes', icon: 'Zap' },
    { id: 'code', label: 'Code Gen', icon: 'Code' }
  ];

  const handleFieldUpdate = (fieldIndex, updates) => {
    if (!selectedTable) return;
    
    const updatedFields = [...selectedTable?.fields];
    updatedFields[fieldIndex] = { ...updatedFields?.[fieldIndex], ...updates };
    onUpdateTable(selectedTable?.id, { ...selectedTable, fields: updatedFields });
  };

  const handleAddField = () => {
    if (!selectedTable) return;
    
    const newField = {
      id: Date.now(),
      name: 'new_field',
      type: 'VARCHAR(255)',
      nullable: true,
      primaryKey: false,
      unique: false,
      defaultValue: '',
      autoIncrement: false
    };
    
    onUpdateTable(selectedTable?.id, {
      ...selectedTable,
      fields: [...selectedTable?.fields, newField]
    });
  };

  const handleDeleteField = (fieldIndex) => {
    if (!selectedTable) return;
    
    const updatedFields = selectedTable?.fields?.filter((_, index) => index !== fieldIndex);
    onUpdateTable(selectedTable?.id, { ...selectedTable, fields: updatedFields });
  };

  const handleGenerateCode = () => {
    if (onGenerateCode) {
      onGenerateCode(selectedTable, codeLanguage);
    }
  };

  if (!selectedTable) {
    return (
      <div className="w-80 bg-surface border-l border-border h-full flex items-center justify-center">
        <div className="text-center p-6">
          <Icon name="MousePointer" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-sm font-medium text-foreground mb-2">No Table Selected</h3>
          <p className="text-xs text-muted-foreground">
            Select a table to view and edit its properties
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-surface border-l border-border h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-2 mb-3">
          <Icon name="Table" size={16} className="text-primary" />
          <h2 className="text-sm font-semibold text-foreground truncate">
            {selectedTable?.name}
          </h2>
        </div>
        
        {/* Tabs */}
        <div className="flex space-x-1">
          {tabs?.map((tab) => (
            <Button
              key={tab?.id}
              variant={activeTab === tab?.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab?.id)}
              className="text-xs px-2 py-1 h-7"
              iconName={tab?.icon}
              iconSize={12}
            >
              {tab?.label}
            </Button>
          ))}
        </div>
      </div>
      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'properties' && (
          <div className="p-4 space-y-4">
            {/* Table Info */}
            <div>
              <Input
                label="Table Name"
                value={selectedTable?.name}
                onChange={(e) => onUpdateTable(selectedTable?.id, { 
                  ...selectedTable, 
                  name: e?.target?.value 
                })}
                className="mb-3"
              />
              <Input
                label="Description"
                value={selectedTable?.description || ''}
                onChange={(e) => onUpdateTable(selectedTable?.id, { 
                  ...selectedTable, 
                  description: e?.target?.value 
                })}
                placeholder="Optional table description"
              />
            </div>

            {/* Fields */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Fields ({selectedTable?.fields?.length})
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddField}
                  iconName="Plus"
                  iconSize={12}
                  className="text-xs h-6"
                >
                  Add Field
                </Button>
              </div>

              <div className="space-y-3">
                {selectedTable?.fields?.map((field, index) => (
                  <div key={field?.id} className="p-3 border border-border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <Input
                        value={field?.name}
                        onChange={(e) => handleFieldUpdate(index, { name: e?.target?.value })}
                        className="flex-1 mr-2"
                        placeholder="Field name"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteField(index)}
                        className="w-6 h-6 text-error hover:text-error"
                      >
                        <Icon name="Trash2" size={12} />
                      </Button>
                    </div>

                    <Select
                      options={dataTypeOptions}
                      value={field?.type}
                      onChange={(value) => handleFieldUpdate(index, { type: value })}
                      placeholder="Select data type"
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <Checkbox
                        label="Primary Key"
                        checked={field?.primaryKey || false}
                        onChange={(e) => handleFieldUpdate(index, { primaryKey: e?.target?.checked })}
                      />
                      <Checkbox
                        label="Unique"
                        checked={field?.unique || false}
                        onChange={(e) => handleFieldUpdate(index, { unique: e?.target?.checked })}
                      />
                      <Checkbox
                        label="Nullable"
                        checked={field?.nullable !== false}
                        onChange={(e) => handleFieldUpdate(index, { nullable: e?.target?.checked })}
                      />
                      <Checkbox
                        label="Auto Increment"
                        checked={field?.autoIncrement || false}
                        onChange={(e) => handleFieldUpdate(index, { autoIncrement: e?.target?.checked })}
                      />
                    </div>

                    <Input
                      label="Default Value"
                      value={field?.defaultValue || ''}
                      onChange={(e) => handleFieldUpdate(index, { defaultValue: e?.target?.value })}
                      placeholder="Optional default value"
                    />
                  </div>
                ))}

                {selectedTable?.fields?.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Icon name="Plus" size={24} className="mx-auto mb-2" />
                    <p className="text-xs">No fields yet. Add your first field.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'relationships' && (
          <div className="p-4">
            <div className="text-center py-8 text-muted-foreground">
              <Icon name="GitBranch" size={24} className="mx-auto mb-2" />
              <p className="text-xs">Relationship management coming soon</p>
            </div>
          </div>
        )}

        {activeTab === 'indexes' && (
          <div className="p-4">
            <div className="text-center py-8 text-muted-foreground">
              <Icon name="Zap" size={24} className="mx-auto mb-2" />
              <p className="text-xs">Index management coming soon</p>
            </div>
          </div>
        )}

        {activeTab === 'code' && (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Code Generation
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerateCode}
                loading={isGenerating}
                iconName="Code"
                iconSize={12}
                className="text-xs"
              >
                Generate
              </Button>
            </div>

            <Select
              label="Target Language/ORM"
              options={codeLanguageOptions}
              value={codeLanguage}
              onChange={setCodeLanguage}
            />

            {generatedCode && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-foreground">Generated Code</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Copy"
                    iconSize={12}
                    className="text-xs"
                  >
                    Copy
                  </Button>
                </div>
                <div className="bg-muted rounded-lg p-3 font-mono text-xs overflow-x-auto">
                  <pre className="whitespace-pre-wrap text-foreground">
                    {generatedCode}
                  </pre>
                </div>
              </div>
            )}

            {!generatedCode && (
              <div className="text-center py-8 text-muted-foreground">
                <Icon name="Code" size={24} className="mx-auto mb-2" />
                <p className="text-xs">Click Generate to create code for this table</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RightInspector;