import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const ValidationTab = ({ validationRules = [], onValidationRulesChange, availableFields = [] }) => {
  const [previewMode, setPreviewMode] = useState(false);

  const ruleTypes = [
    { value: 'required', label: 'Required Field' },
    { value: 'min_length', label: 'Minimum Length' },
    { value: 'max_length', label: 'Maximum Length' },
    { value: 'pattern', label: 'Regex Pattern' },
    { value: 'email', label: 'Email Format' },
    { value: 'url', label: 'URL Format' },
    { value: 'numeric', label: 'Numeric Only' },
    { value: 'min_value', label: 'Minimum Value' },
    { value: 'max_value', label: 'Maximum Value' },
    { value: 'date_range', label: 'Date Range' },
    { value: 'custom', label: 'Custom Rule' }
  ];

  const fieldOptions = availableFields?.map(field => ({
    value: field?.name,
    label: field?.name,
    description: `${field?.type}${field?.length ? `(${field?.length})` : ''}`
  }));

  const handleAddRule = () => {
    const newRule = {
      id: Date.now(),
      field: '',
      type: 'required',
      value: '',
      message: '',
      active: true,
      description: ''
    };
    onValidationRulesChange([...validationRules, newRule]);
  };

  const handleUpdateRule = (ruleId, updates) => {
    const updatedRules = validationRules?.map(rule => 
      rule?.id === ruleId ? { ...rule, ...updates } : rule
    );
    onValidationRulesChange(updatedRules);
  };

  const handleRemoveRule = (ruleId) => {
    const updatedRules = validationRules?.filter(rule => rule?.id !== ruleId);
    onValidationRulesChange(updatedRules);
  };

  const getRuleIcon = (type) => {
    const icons = {
      'required': 'AlertCircle',
      'min_length': 'ArrowRight',
      'max_length': 'ArrowLeft',
      'pattern': 'Search',
      'email': 'Mail',
      'url': 'Link',
      'numeric': 'Hash',
      'min_value': 'TrendingUp',
      'max_value': 'TrendingDown',
      'date_range': 'Calendar',
      'custom': 'Code'
    };
    return icons?.[type] || 'Shield';
  };

  const getDefaultMessage = (type, field, value) => {
    const messages = {
      'required': `${field} is required`,
      'min_length': `${field} must be at least ${value} characters`,
      'max_length': `${field} cannot exceed ${value} characters`,
      'pattern': `${field} format is invalid`,
      'email': `${field} must be a valid email address`,
      'url': `${field} must be a valid URL`,
      'numeric': `${field} must contain only numbers`,
      'min_value': `${field} must be at least ${value}`,
      'max_value': `${field} cannot exceed ${value}`,
      'date_range': `${field} must be within the specified date range`,
      'custom': `${field} validation failed`
    };
    return messages?.[type] || `${field} validation failed`;
  };

  const generateValidationCode = (rule) => {
    const codeTemplates = {
      'required': `if (!${rule?.field}) {\n  throw new Error("${rule?.message}");\n}`,
      'min_length': `if (${rule?.field}.length < ${rule?.value}) {\n  throw new Error("${rule?.message}");\n}`,
      'max_length': `if (${rule?.field}.length > ${rule?.value}) {\n  throw new Error("${rule?.message}");\n}`,
      'pattern': `if (!/${rule?.value}/.test(${rule?.field})) {\n  throw new Error("${rule?.message}");\n}`,
      'email': `if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(${rule?.field})) {\n  throw new Error("${rule?.message}");\n}`,
      'numeric': `if (!/^\\d+$/.test(${rule?.field})) {\n  throw new Error("${rule?.message}");\n}`,
      'custom': `// Custom validation logic\n${rule?.value}`
    };
    return codeTemplates?.[rule?.type] || `// Validation for ${rule?.field}`;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-medium text-text-primary">Validation Rules</h3>
          <p className="text-sm text-text-secondary mt-1">
            Define custom validation logic for your entity fields
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={previewMode ? 'default' : 'outline'}
            size="sm"
            iconName="Eye"
            iconPosition="left"
            onClick={() => setPreviewMode(!previewMode)}
          >
            {previewMode ? 'Edit Mode' : 'Preview'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="Plus"
            iconPosition="left"
            onClick={handleAddRule}
          >
            Add Rule
          </Button>
        </div>
      </div>
      {validationRules?.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
          <Icon name="Shield" size={48} className="mx-auto mb-4 text-text-secondary opacity-50" />
          <h4 className="text-lg font-medium text-text-primary mb-2">No validation rules defined</h4>
          <p className="text-text-secondary mb-4">Add validation rules to ensure data integrity</p>
          <Button
            variant="default"
            iconName="Plus"
            iconPosition="left"
            onClick={handleAddRule}
          >
            Add Your First Rule
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {validationRules?.map((rule, index) => (
            <div
              key={rule?.id}
              className={`bg-card border rounded-lg p-4 space-y-4 transition-smooth ${
                rule?.active ? 'border-border hover:shadow-subtle' : 'border-border opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${
                    rule?.active ? 'bg-success/10' : 'bg-muted'
                  }`}>
                    <Icon 
                      name={getRuleIcon(rule?.type)} 
                      size={16} 
                      className={rule?.active ? 'text-success' : 'text-text-secondary'} 
                    />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-text-primary">
                      Rule {index + 1}
                    </span>
                    <p className="text-xs text-text-secondary">
                      {ruleTypes?.find(t => t?.value === rule?.type)?.label}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={rule?.active}
                    onChange={(e) => handleUpdateRule(rule?.id, { active: e?.target?.checked })}
                    label="Active"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="Trash2"
                    iconSize={16}
                    onClick={() => handleRemoveRule(rule?.id)}
                    className="text-error hover:text-error"
                  />
                </div>
              </div>

              {!previewMode ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select
                      label="Field"
                      options={fieldOptions}
                      value={rule?.field}
                      onChange={(value) => handleUpdateRule(rule?.id, { 
                        field: value,
                        message: getDefaultMessage(rule?.type, value, rule?.value)
                      })}
                      placeholder="Select field to validate"
                      searchable
                      required
                    />
                    <Select
                      label="Validation Type"
                      options={ruleTypes}
                      value={rule?.type}
                      onChange={(value) => handleUpdateRule(rule?.id, { 
                        type: value,
                        message: getDefaultMessage(value, rule?.field, rule?.value)
                      })}
                    />
                  </div>

                  {['min_length', 'max_length', 'min_value', 'max_value', 'pattern', 'custom']?.includes(rule?.type) && (
                    <Input
                      label={rule?.type === 'pattern' ? 'Regex Pattern' : rule?.type === 'custom' ? 'Custom Code' : 'Value'}
                      type="text"
                      placeholder={
                        rule?.type === 'pattern' ? '^[a-zA-Z0-9]+$' :
                        rule?.type === 'custom' ? 'if (value < 0) throw new Error("Invalid");' :
                        '10'
                      }
                      value={rule?.value}
                      onChange={(e) => handleUpdateRule(rule?.id, { value: e?.target?.value })}
                      description={
                        rule?.type === 'pattern' ? 'JavaScript regular expression' :
                        rule?.type === 'custom'? 'Custom JavaScript validation code' : 'Validation threshold value'
                      }
                    />
                  )}

                  <Input
                    label="Error Message"
                    type="text"
                    placeholder={getDefaultMessage(rule?.type, rule?.field, rule?.value)}
                    value={rule?.message}
                    onChange={(e) => handleUpdateRule(rule?.id, { message: e?.target?.value })}
                    description="Message shown when validation fails"
                  />

                  <Input
                    label="Description"
                    type="text"
                    placeholder="Describe the purpose of this validation rule"
                    value={rule?.description}
                    onChange={(e) => handleUpdateRule(rule?.id, { description: e?.target?.value })}
                    description="Optional documentation for this rule"
                  />
                </>
              ) : (
                <div className="bg-muted/30 rounded-lg p-4 border border-border">
                  <div className="text-xs font-mono text-text-secondary">
                    <div className="font-semibold mb-2">Generated Validation Code:</div>
                    <div className="bg-surface p-3 rounded border overflow-x-auto">
                      <pre className="whitespace-pre-wrap">
                        {generateValidationCode(rule)}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {validationRules?.length > 0 && (
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="text-sm text-text-secondary">
            {validationRules?.filter(r => r?.active)?.length} of {validationRules?.length} rules active
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Play"
              iconPosition="left"
            >
              Test Rules
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              iconPosition="left"
            >
              Export Code
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ValidationTab;