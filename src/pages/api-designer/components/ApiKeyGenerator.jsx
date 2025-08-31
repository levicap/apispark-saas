import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ApiKeyGenerator = ({ isOpen, onClose, currentProject }) => {
  const [keyType, setKeyType] = useState('jwt');
  const [keyName, setKeyName] = useState('');
  const [expiration, setExpiration] = useState('30d');
  const [permissions, setPermissions] = useState([]);
  const [generatedKey, setGeneratedKey] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const keyTypes = [
    { value: 'jwt', label: 'JWT Token', description: 'JSON Web Token for authentication' },
    { value: 'api_key', label: 'API Key', description: 'Simple API key for basic authentication' },
    { value: 'oauth', label: 'OAuth 2.0', description: 'OAuth 2.0 client credentials' }
  ];

  const expirationOptions = [
    { value: '1h', label: '1 Hour' },
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '1y', label: '1 Year' },
    { value: 'never', label: 'Never Expires' }
  ];

  const availablePermissions = [
    { id: 'read', name: 'Read Access', description: 'Can read data from all endpoints' },
    { id: 'write', name: 'Write Access', description: 'Can create and update data' },
    { id: 'delete', name: 'Delete Access', description: 'Can delete data' },
    { id: 'admin', name: 'Admin Access', description: 'Full administrative access' },
    { id: 'users', name: 'User Management', description: 'Can manage user accounts' },
    { id: 'analytics', name: 'Analytics', description: 'Can access analytics data' },
    { id: 'webhooks', name: 'Webhooks', description: 'Can manage webhooks' }
  ];

  const generateApiKey = async () => {
    if (!keyName.trim()) {
      alert('Please enter a key name');
      return;
    }

    setIsGenerating(true);

    // Simulate API key generation
    setTimeout(() => {
      let key = '';
      if (keyType === 'jwt') {
        key = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`;
      } else if (keyType === 'api_key') {
        key = `ak_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      } else if (keyType === 'oauth') {
        key = `oauth_${Math.random().toString(36).substring(2, 15)}_${Math.random().toString(36).substring(2, 15)}`;
      }

      setGeneratedKey(key);
      setIsGenerating(false);
    }, 2000);
  };

  const handlePermissionToggle = (permissionId) => {
    setPermissions(prev => 
      prev.includes(permissionId)
        ? prev.filter(p => p !== permissionId)
        : [...prev, permissionId]
    );
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedKey);
      alert('API key copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const downloadKey = () => {
    const element = document.createElement('a');
    const file = new Blob([`API Key: ${generatedKey}\nProject: ${currentProject?.name}\nGenerated: ${new Date().toISOString()}`], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `api-key-${keyName}-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background border border-border rounded-lg shadow-elevation-3 w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Generate API Key</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Create a new API key for {currentProject?.name}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <div className="p-6 space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          {/* Key Configuration */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Key Name
              </label>
              <Input
                type="text"
                placeholder="e.g., Production API Key, Development Key"
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Key Type
              </label>
              <Select
                value={keyType}
                onChange={(e) => setKeyType(e.target.value)}
                className="w-full"
              >
                {keyTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                {keyTypes.find(t => t.value === keyType)?.description}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Expiration
              </label>
              <Select
                value={expiration}
                onChange={(e) => setExpiration(e.target.value)}
                className="w-full"
              >
                {expirationOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {/* Permissions */}
          <div>
            <label className="text-sm font-medium text-foreground mb-3 block">
              Permissions
            </label>
            <div className="space-y-2">
              {availablePermissions.map(permission => (
                <label
                  key={permission.id}
                  className="flex items-start space-x-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-smooth"
                >
                  <input
                    type="checkbox"
                    checked={permissions.includes(permission.id)}
                    onChange={() => handlePermissionToggle(permission.id)}
                    className="mt-1 text-primary"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-foreground text-sm">
                      {permission.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {permission.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={generateApiKey}
            disabled={isGenerating || !keyName.trim()}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Icon name="Loader" size={16} className="animate-spin mr-2" />
                Generating API Key...
              </>
            ) : (
              <>
                <Icon name="Key" size={16} className="mr-2" />
                Generate API Key
              </>
            )}
          </Button>

          {/* Generated Key */}
          {generatedKey && (
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Generated API Key
                </label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="text"
                    value={generatedKey}
                    readOnly
                    className="flex-1 font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                  >
                    <Icon name="Copy" size={14} />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadKey}
                  >
                    <Icon name="Download" size={14} />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  ⚠️ Store this key securely. It won't be shown again.
                </p>
              </div>

              {/* Key Details */}
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-medium text-foreground mb-3">Key Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="text-foreground">{keyName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="text-foreground">{keyTypes.find(t => t.value === keyType)?.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expires:</span>
                    <span className="text-foreground">{expirationOptions.find(e => e.value === expiration)?.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Permissions:</span>
                    <span className="text-foreground">{permissions.length} selected</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Generated:</span>
                    <span className="text-foreground">{new Date().toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiKeyGenerator;
