import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const EnvironmentManager = ({ 
  environments = [], 
  currentEnvironment = null,
  onEnvironmentChange,
  onEnvironmentUpdate,
  onCreateEnvironment 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingEnv, setEditingEnv] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEnvName, setNewEnvName] = useState('');

  const environmentOptions = environments?.map(env => ({
    value: env.id,
    label: env.name,
    description: env.description
  }));

  const handleEditEnvironment = (env) => {
    setEditingEnv({ ...env });
    setIsEditing(true);
  };

  const handleSaveEnvironment = () => {
    onEnvironmentUpdate(editingEnv);
    setIsEditing(false);
    setEditingEnv(null);
  };

  const handleCreateEnvironment = () => {
    if (newEnvName?.trim()) {
      onCreateEnvironment({
        name: newEnvName,
        variables: [
          { key: 'baseUrl', value: '', enabled: true },
          { key: 'apiKey', value: '', enabled: true }
        ]
      });
      setNewEnvName('');
      setShowCreateModal(false);
    }
  };

  const handleVariableChange = (index, field, value) => {
    const newVariables = [...editingEnv?.variables];
    newVariables[index] = { ...newVariables?.[index], [field]: value };
    setEditingEnv({ ...editingEnv, variables: newVariables });
  };

  const addVariable = () => {
    setEditingEnv({
      ...editingEnv,
      variables: [...editingEnv?.variables, { key: '', value: '', enabled: true }]
    });
  };

  const removeVariable = (index) => {
    const newVariables = editingEnv?.variables?.filter((_, i) => i !== index);
    setEditingEnv({ ...editingEnv, variables: newVariables });
  };

  return (
    <div className="bg-surface border border-border rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="Settings" size={18} className="text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Environment Variables</h3>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-48">
            <Select
              options={environmentOptions}
              value={currentEnvironment?.id || ''}
              onChange={(envId) => {
                const env = environments?.find(e => e?.id === envId);
                onEnvironmentChange(env);
              }}
              placeholder="Select environment..."
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCreateModal(true)}
          >
            <Icon name="Plus" size={14} className="mr-2" />
            New
          </Button>
          {currentEnvironment && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEditEnvironment(currentEnvironment)}
            >
              <Icon name="Edit" size={14} className="mr-2" />
              Edit
            </Button>
          )}
        </div>
      </div>
      {/* Environment Variables Display */}
      {!isEditing && currentEnvironment && (
        <div className="p-4">
          <div className="space-y-2">
            {currentEnvironment?.variables?.map((variable, index) => (
              <div key={index} className="flex items-center space-x-3 p-2 bg-muted/30 rounded-md">
                <div className={`w-2 h-2 rounded-full ${variable?.enabled ? 'bg-green-500' : 'bg-gray-400'}`} />
                <span className="text-sm font-medium text-foreground min-w-0 flex-1">
                  {variable?.key}
                </span>
                <span className="text-sm text-muted-foreground font-mono truncate max-w-xs">
                  {variable?.value ? '••••••••' : 'Not set'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Environment Variables Editor */}
      {isEditing && editingEnv && (
        <div className="p-4">
          <div className="mb-4">
            <Input
              label="Environment Name"
              value={editingEnv?.name}
              onChange={(e) => setEditingEnv({ ...editingEnv, name: e?.target?.value })}
              className="mb-3"
            />
            <Input
              label="Description"
              value={editingEnv?.description || ''}
              onChange={(e) => setEditingEnv({ ...editingEnv, description: e?.target?.value })}
            />
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-foreground">Variables</h4>
              <Button variant="outline" size="sm" onClick={addVariable}>
                <Icon name="Plus" size={14} className="mr-2" />
                Add Variable
              </Button>
            </div>

            <div className="space-y-2">
              {editingEnv?.variables?.map((variable, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-muted/30 rounded-md">
                  <input
                    type="checkbox"
                    checked={variable?.enabled}
                    onChange={(e) => handleVariableChange(index, 'enabled', e?.target?.checked)}
                    className="rounded border-border"
                  />
                  <input
                    type="text"
                    placeholder="Variable name"
                    value={variable?.key}
                    onChange={(e) => handleVariableChange(index, 'key', e?.target?.value)}
                    className="flex-1 px-3 py-2 text-sm bg-surface border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    value={variable?.value}
                    onChange={(e) => handleVariableChange(index, 'value', e?.target?.value)}
                    className="flex-1 px-3 py-2 text-sm bg-surface border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeVariable(index)}
                    className="h-8 w-8 text-muted-foreground hover:text-error"
                  >
                    <Icon name="Trash2" size={14} />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end space-x-2">
            <Button
              variant="ghost"
              onClick={() => {
                setIsEditing(false);
                setEditingEnv(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="default" onClick={handleSaveEnvironment}>
              Save Changes
            </Button>
          </div>
        </div>
      )}
      {/* No Environment Selected */}
      {!currentEnvironment && !isEditing && (
        <div className="p-8 text-center">
          <Icon name="Settings" size={32} className="mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-3">No environment selected</p>
          <Button variant="outline" onClick={() => setShowCreateModal(true)}>
            Create Environment
          </Button>
        </div>
      )}
      {/* Create Environment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-300">
          <div className="bg-surface rounded-lg p-6 w-96 max-w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Create Environment</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowCreateModal(false)}
              >
                <Icon name="X" size={16} />
              </Button>
            </div>

            <div className="mb-6">
              <Input
                label="Environment Name"
                placeholder="e.g., Development, Staging, Production"
                value={newEnvName}
                onChange={(e) => setNewEnvName(e?.target?.value)}
                required
              />
            </div>

            <div className="flex items-center justify-end space-x-2">
              <Button
                variant="ghost"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                onClick={handleCreateEnvironment}
                disabled={!newEnvName?.trim()}
              >
                Create
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnvironmentManager;