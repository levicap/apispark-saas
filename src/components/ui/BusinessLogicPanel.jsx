import React, { useState } from 'react';
import { useProjectContext } from '../../contexts/ProjectContext';
import Button from './Button';
import Icon from '../AppIcon';
import Input from './Input';

const BusinessLogicPanel = ({ onSave, className = '' }) => {
  const { currentProject, getCurrentProjectSchema } = useProjectContext();
  const [selectedEntities, setSelectedEntities] = useState(new Set());
  const [businessRules, setBusinessRules] = useState({});
  const [validationRules, setValidationRules] = useState({});
  const [dataTransformations, setDataTransformations] = useState({});
  const [workflowConfig, setWorkflowConfig] = useState({
    enableAsyncProcessing: false,
    enableEventDriven: false,
    enableCaching: true,
    enableRateLimiting: true
  });

  if (!currentProject) {
    return (
      <div className={`text-center p-4 ${className}`}>
        <Icon name="Briefcase" size={24} className="text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">Select a project to configure business logic</p>
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

  const handleBusinessRuleChange = (entityId, ruleType, value) => {
    setBusinessRules(prev => ({
      ...prev,
      [entityId]: {
        ...prev[entityId],
        [ruleType]: value
      }
    }));
  };

  const handleValidationRuleChange = (entityId, fieldName, ruleType, value) => {
    setValidationRules(prev => ({
      ...prev,
      [entityId]: {
        ...prev[entityId],
        [fieldName]: {
          ...prev[entityId]?.[fieldName],
          [ruleType]: value
        }
      }
    }));
  };

  const handleDataTransformationChange = (entityId, transformationType, value) => {
    setDataTransformations(prev => ({
      ...prev,
      [entityId]: {
        ...prev[entityId],
        [transformationType]: value
      }
    }));
  };

  const handleSaveBusinessLogic = () => {
    if (selectedEntities.size === 0) {
      alert('Please select at least one entity to configure business logic');
      return;
    }

    const businessLogicConfig = {
      entities: Array.from(selectedEntities).map(entityId => {
        const entity = entities.find(e => e.id === entityId);
        return {
          ...entity,
          businessRules: businessRules[entityId] || {},
          validationRules: validationRules[entityId] || {},
          dataTransformations: dataTransformations[entityId] || {}
        };
      }),
      workflow: workflowConfig,
      connections
    };

    if (onSave) {
      onSave(businessLogicConfig);
    }
  };

  const generateBusinessLogicCode = () => {
    let code = `// Business Logic Configuration for ${currentProject.name}\n`;
    code += `// Generated on ${new Date().toLocaleString()}\n\n`;

    selectedEntities.forEach(entityId => {
      const entity = entities.find(e => e.id === entityId);
      if (!entity) return;

      code += `// ${entity.name} Business Logic\n`;
      code += `class ${entity.name.charAt(0).toUpperCase() + entity.name.slice(1)}BusinessLogic {\n`;
      
      // Business rules
      const rules = businessRules[entityId] || {};
      if (rules.preCreate || rules.preUpdate || rules.preDelete) {
        code += `  // Pre-operation hooks\n`;
        if (rules.preCreate) {
          code += `  async beforeCreate(data) {\n`;
          code += `    ${rules.preCreate}\n`;
          code += `    return data;\n`;
          code += `  }\n\n`;
        }
        if (rules.preUpdate) {
          code += `  async beforeUpdate(id, data) {\n`;
          code += `    ${rules.preUpdate}\n`;
          code += `    return data;\n`;
          code += `  }\n\n`;
        }
        if (rules.preDelete) {
          code += `  async beforeDelete(id) {\n`;
          code += `    ${rules.preDelete}\n`;
          code += `    return true;\n`;
          code += `  }\n\n`;
        }
      }

      // Validation rules
      const validations = validationRules[entityId] || {};
      if (Object.keys(validations).length > 0) {
        code += `  // Validation rules\n`;
        code += `  validate(data) {\n`;
        code += `    const errors = [];\n`;
        Object.entries(validations).forEach(([fieldName, rules]) => {
          if (rules.required) {
            code += `    if (!data.${fieldName}) {\n`;
            code += `      errors.push('${fieldName} is required');\n`;
            code += `    }\n`;
          }
          if (rules.minLength) {
            code += `    if (data.${fieldName} && data.${fieldName}.length < ${rules.minLength}) {\n`;
            code += `      errors.push('${fieldName} must be at least ${rules.minLength} characters');\n`;
            code += `    }\n`;
          }
          if (rules.maxLength) {
            code += `    if (data.${fieldName} && data.${fieldName}.length > ${rules.maxLength}) {\n`;
            code += `      errors.push('${fieldName} must be at most ${rules.maxLength} characters');\n`;
            code += `    }\n`;
          }
          if (rules.pattern) {
            code += `    if (data.${fieldName} && !/${rules.pattern}/.test(data.${fieldName})) {\n`;
            code += `      errors.push('${fieldName} format is invalid');\n`;
            code += `    }\n`;
          }
        });
        code += `    return errors;\n`;
        code += `  }\n\n`;
      }

      // Data transformations
      const transformations = dataTransformations[entityId] || {};
      if (transformations.preProcess || transformations.postProcess) {
        code += `  // Data transformations\n`;
        if (transformations.preProcess) {
          code += `  preProcess(data) {\n`;
          code += `    ${transformations.preProcess}\n`;
          code += `    return data;\n`;
          code += `  }\n\n`;
        }
        if (transformations.postProcess) {
          code += `  postProcess(data) {\n`;
          code += `    ${transformations.postProcess}\n`;
          code += `    return data;\n`;
          code += `  }\n\n`;
        }
      }

      code += `}\n\n`;
    });

    return code;
  };

  const downloadCode = () => {
    const code = generateBusinessLogicCode();
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentProject.name.toLowerCase().replace(/\s+/g, '_')}_business_logic.js`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Business Logic Configuration</h3>
          <p className="text-sm text-muted-foreground">
            Configure business rules, validation, and data transformations for {currentProject.name}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={downloadCode}
          >
            <Icon name="Download" size={16} className="mr-2" />
            Download Code
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleSaveBusinessLogic}
          >
            <Icon name="Save" size={16} className="mr-2" />
            Save Configuration
          </Button>
        </div>
      </div>

      {/* Workflow Configuration */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Workflow Settings</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Async Processing</label>
            <input
              type="checkbox"
              checked={workflowConfig.enableAsyncProcessing}
              onChange={(e) => setWorkflowConfig(prev => ({ ...prev, enableAsyncProcessing: e.target.checked }))}
              className="rounded border-border"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Event Driven</label>
            <input
              type="checkbox"
              checked={workflowConfig.enableEventDriven}
              onChange={(e) => setWorkflowConfig(prev => ({ ...prev, enableEventDriven: e.target.checked }))}
              className="rounded border-border"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Enable Caching</label>
            <input
              type="checkbox"
              checked={workflowConfig.enableCaching}
              onChange={(e) => setWorkflowConfig(prev => ({ ...prev, enableCaching: e.target.checked }))}
              className="rounded border-border"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Rate Limiting</label>
            <input
              type="checkbox"
              checked={workflowConfig.enableRateLimiting}
              onChange={(e) => setWorkflowConfig(prev => ({ ...prev, enableRateLimiting: e.target.checked }))}
              className="rounded border-border"
            />
          </div>
        </div>
      </div>

      {/* Entity Selection */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-foreground">Select Entities for Business Logic</h4>
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
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <Icon name="Briefcase" size={16} className="text-white" />
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

              {/* Business Logic Configuration */}
              {selectedEntities.has(entity.id) && (
                <div className="space-y-4 pt-3 border-t border-border">
                  {/* Business Rules */}
                  <div className="space-y-3">
                    <h5 className="text-xs font-medium text-foreground">Business Rules</h5>
                    <div className="space-y-2">
                      <div>
                        <label className="text-xs text-muted-foreground">Pre-Create Logic</label>
                        <textarea
                          placeholder="Custom logic before creating entity..."
                          value={businessRules[entity.id]?.preCreate || ''}
                          onChange={(e) => handleBusinessRuleChange(entity.id, 'preCreate', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background resize-none"
                          rows="2"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Pre-Update Logic</label>
                        <textarea
                          placeholder="Custom logic before updating entity..."
                          value={businessRules[entity.id]?.preUpdate || ''}
                          onChange={(e) => handleBusinessRuleChange(entity.id, 'preUpdate', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background resize-none"
                          rows="2"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Pre-Delete Logic</label>
                        <textarea
                          placeholder="Custom logic before deleting entity..."
                          value={businessRules[entity.id]?.preDelete || ''}
                          onChange={(e) => handleBusinessRuleChange(entity.id, 'preDelete', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background resize-none"
                          rows="2"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Validation Rules */}
                  <div className="space-y-3">
                    <h5 className="text-xs font-medium text-foreground">Field Validation</h5>
                    <div className="space-y-2">
                      {entity.fields?.slice(0, 5).map((field) => (
                        <div key={field.name} className="space-y-2">
                          <label className="text-xs text-muted-foreground">{field.name}</label>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <input
                                type="checkbox"
                                checked={validationRules[entity.id]?.[field.name]?.required || false}
                                onChange={(e) => handleValidationRuleChange(entity.id, field.name, 'required', e.target.checked)}
                                className="rounded border-border mr-2"
                              />
                              <span className="text-xs text-muted-foreground">Required</span>
                            </div>
                            <div>
                              <input
                                type="number"
                                placeholder="Min length"
                                value={validationRules[entity.id]?.[field.name]?.minLength || ''}
                                onChange={(e) => handleValidationRuleChange(entity.id, field.name, 'minLength', e.target.value)}
                                className="w-full px-2 py-1 text-xs border border-border rounded bg-background"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Data Transformations */}
                  <div className="space-y-3">
                    <h5 className="text-xs font-medium text-foreground">Data Transformations</h5>
                    <div className="space-y-2">
                      <div>
                        <label className="text-xs text-muted-foreground">Pre-Process</label>
                        <textarea
                          placeholder="Transform data before processing..."
                          value={dataTransformations[entity.id]?.preProcess || ''}
                          onChange={(e) => handleDataTransformationChange(entity.id, 'preProcess', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background resize-none"
                          rows="2"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Post-Process</label>
                        <textarea
                          placeholder="Transform data after processing..."
                          value={dataTransformations[entity.id]?.postProcess || ''}
                          onChange={(e) => handleDataTransformationChange(entity.id, 'postProcess', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background resize-none"
                          rows="2"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Code Preview */}
      {selectedEntities.size > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Generated Business Logic Code</h4>
          <div className="bg-muted p-4 rounded-lg">
            <pre className="text-xs text-muted-foreground overflow-x-auto">
              {generateBusinessLogicCode()}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessLogicPanel; 