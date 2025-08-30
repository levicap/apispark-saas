import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const RequestBuilder = ({ 
  request = null, 
  onRequestChange,
  onSendRequest,
  isLoading = false 
}) => {
  const [activeTab, setActiveTab] = useState('headers');

  const methodOptions = [
    { value: 'GET', label: 'GET' },
    { value: 'POST', label: 'POST' },
    { value: 'PUT', label: 'PUT' },
    { value: 'PATCH', label: 'PATCH' },
    { value: 'DELETE', label: 'DELETE' }
  ];

  const authTypeOptions = [
    { value: 'none', label: 'No Auth' },
    { value: 'bearer', label: 'Bearer Token' },
    { value: 'basic', label: 'Basic Auth' },
    { value: 'apikey', label: 'API Key' }
  ];

  const tabs = [
    { id: 'headers', label: 'Headers', icon: 'Settings' },
    { id: 'body', label: 'Body', icon: 'FileText' },
    { id: 'auth', label: 'Auth', icon: 'Shield' },
    { id: 'params', label: 'Params', icon: 'Hash' },
    { id: 'scripts', label: 'Scripts', icon: 'Code' }
  ];

  const handleMethodChange = (method) => {
    onRequestChange({ ...request, method });
  };

  const handleUrlChange = (e) => {
    onRequestChange({ ...request, url: e?.target?.value });
  };

  const handleHeaderChange = (index, field, value) => {
    const newHeaders = [...(request?.headers || [])];
    newHeaders[index] = { ...newHeaders?.[index], [field]: value };
    onRequestChange({ ...request, headers: newHeaders });
  };

  const addHeader = () => {
    const newHeaders = [...(request?.headers || []), { key: '', value: '', enabled: true }];
    onRequestChange({ ...request, headers: newHeaders });
  };

  const removeHeader = (index) => {
    const newHeaders = (request?.headers || [])?.filter((_, i) => i !== index);
    onRequestChange({ ...request, headers: newHeaders });
  };

  const handleBodyChange = (e) => {
    onRequestChange({ ...request, body: e?.target?.value });
  };

  if (!request) {
    return (
      <div className="h-full flex items-center justify-center bg-surface">
        <div className="text-center">
          <Icon name="Send" size={48} className="mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium text-foreground mb-2">No Request Selected</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Select a request from the collections or create a new one to get started
          </p>
          <Button variant="outline">
            Create New Request
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-surface">
      {/* Request Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-24">
            <Select
              options={methodOptions}
              value={request?.method || 'GET'}
              onChange={handleMethodChange}
            />
          </div>
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Enter request URL"
              value={request?.url || ''}
              onChange={handleUrlChange}
              className="font-mono text-sm"
            />
          </div>
          <Button
            variant="default"
            onClick={onSendRequest}
            loading={isLoading}
            iconName="Send"
            iconPosition="left"
            className="px-6"
          >
            Send
          </Button>
        </div>

        {/* Request Name */}
        <div className="flex items-center space-x-2">
          <Icon name="Edit3" size={14} className="text-muted-foreground" />
          <input
            type="text"
            placeholder="Request name"
            value={request?.name || ''}
            onChange={(e) => onRequestChange({ ...request, name: e?.target?.value })}
            className="text-sm font-medium bg-transparent border-none outline-none text-foreground placeholder-muted-foreground"
          />
        </div>
      </div>
      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex space-x-0">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`
                flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors
                ${activeTab === tab?.id
                  ? 'border-primary text-primary bg-primary/5' :'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }
              `}
            >
              <Icon name={tab?.icon} size={14} />
              <span>{tab?.label}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'headers' && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-foreground">Headers</h3>
              <Button variant="outline" size="sm" onClick={addHeader}>
                <Icon name="Plus" size={14} className="mr-2" />
                Add Header
              </Button>
            </div>

            <div className="space-y-2">
              {(request?.headers || [])?.map((header, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-muted/30 rounded-md">
                  <input
                    type="checkbox"
                    checked={header?.enabled}
                    onChange={(e) => handleHeaderChange(index, 'enabled', e?.target?.checked)}
                    className="rounded border-border"
                  />
                  <input
                    type="text"
                    placeholder="Key"
                    value={header?.key}
                    onChange={(e) => handleHeaderChange(index, 'key', e?.target?.value)}
                    className="flex-1 px-3 py-2 text-sm bg-surface border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    value={header?.value}
                    onChange={(e) => handleHeaderChange(index, 'value', e?.target?.value)}
                    className="flex-1 px-3 py-2 text-sm bg-surface border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeHeader(index)}
                    className="h-8 w-8 text-muted-foreground hover:text-error"
                  >
                    <Icon name="Trash2" size={14} />
                  </Button>
                </div>
              ))}

              {(!request?.headers || request?.headers?.length === 0) && (
                <div className="text-center py-8">
                  <Icon name="Settings" size={32} className="mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">No headers added</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'body' && (
          <div className="p-4">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-foreground mb-2">Request Body</h3>
              <div className="flex space-x-2 mb-3">
                <Button variant="outline" size="sm">JSON</Button>
                <Button variant="ghost" size="sm">XML</Button>
                <Button variant="ghost" size="sm">Form Data</Button>
                <Button variant="ghost" size="sm">Raw</Button>
              </div>
            </div>

            <textarea
              placeholder="Enter request body (JSON)"
              value={request?.body || ''}
              onChange={handleBodyChange}
              className="w-full h-64 p-3 text-sm font-mono bg-surface border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>
        )}

        {activeTab === 'auth' && (
          <div className="p-4">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-foreground mb-3">Authentication</h3>
              <Select
                options={authTypeOptions}
                value={request?.authType || 'none'}
                onChange={(authType) => onRequestChange({ ...request, authType })}
                className="mb-4"
              />
            </div>

            {request?.authType === 'bearer' && (
              <Input
                label="Bearer Token"
                type="password"
                placeholder="Enter bearer token"
                value={request?.bearerToken || ''}
                onChange={(e) => onRequestChange({ ...request, bearerToken: e?.target?.value })}
              />
            )}

            {request?.authType === 'basic' && (
              <div className="space-y-3">
                <Input
                  label="Username"
                  type="text"
                  placeholder="Enter username"
                  value={request?.basicAuth?.username || ''}
                  onChange={(e) => onRequestChange({ 
                    ...request, 
                    basicAuth: { ...request?.basicAuth, username: e?.target?.value }
                  })}
                />
                <Input
                  label="Password"
                  type="password"
                  placeholder="Enter password"
                  value={request?.basicAuth?.password || ''}
                  onChange={(e) => onRequestChange({ 
                    ...request, 
                    basicAuth: { ...request?.basicAuth, password: e?.target?.value }
                  })}
                />
              </div>
            )}

            {request?.authType === 'apikey' && (
              <div className="space-y-3">
                <Input
                  label="Key"
                  type="text"
                  placeholder="API key name"
                  value={request?.apiKey?.key || ''}
                  onChange={(e) => onRequestChange({ 
                    ...request, 
                    apiKey: { ...request?.apiKey, key: e?.target?.value }
                  })}
                />
                <Input
                  label="Value"
                  type="password"
                  placeholder="API key value"
                  value={request?.apiKey?.value || ''}
                  onChange={(e) => onRequestChange({ 
                    ...request, 
                    apiKey: { ...request?.apiKey, value: e?.target?.value }
                  })}
                />
                <Select
                  label="Add to"
                  options={[
                    { value: 'header', label: 'Header' },
                    { value: 'query', label: 'Query Params' }
                  ]}
                  value={request?.apiKey?.location || 'header'}
                  onChange={(location) => onRequestChange({ 
                    ...request, 
                    apiKey: { ...request?.apiKey, location }
                  })}
                />
              </div>
            )}
          </div>
        )}

        {activeTab === 'params' && (
          <div className="p-4">
            <div className="mb-4">
              <h3 className="text-sm font-medium text-foreground">Query Parameters</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Parameters will be automatically added to the URL
              </p>
            </div>

            <div className="space-y-2">
              {(request?.params || [])?.map((param, index) => (
                <div key={index} className="flex items-center space-x-2 p-2 bg-muted/30 rounded-md">
                  <input
                    type="checkbox"
                    checked={param?.enabled}
                    className="rounded border-border"
                  />
                  <input
                    type="text"
                    placeholder="Parameter name"
                    value={param?.key}
                    className="flex-1 px-3 py-2 text-sm bg-surface border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    value={param?.value}
                    className="flex-1 px-3 py-2 text-sm bg-surface border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-error">
                    <Icon name="Trash2" size={14} />
                  </Button>
                </div>
              ))}

              <Button variant="outline" size="sm" className="w-full">
                <Icon name="Plus" size={14} className="mr-2" />
                Add Parameter
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'scripts' && (
          <div className="p-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-foreground mb-2">Pre-request Script</h3>
                <textarea
                  placeholder="// JavaScript code to run before request\nconsole.log('Pre-request script');"
                  className="w-full h-32 p-3 text-sm font-mono bg-surface border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>

              <div>
                <h3 className="text-sm font-medium text-foreground mb-2">Post-response Script</h3>
                <textarea
                  placeholder="// JavaScript code to run after response\nif (pm.response.code === 200) {\n  console.log('Success!');\n}"
                  className="w-full h-32 p-3 text-sm font-mono bg-surface border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestBuilder;