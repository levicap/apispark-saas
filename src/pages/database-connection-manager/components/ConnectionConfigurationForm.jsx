import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const ConnectionConfigurationForm = ({ 
  selectedProfile, 
  onSave, 
  onTest, 
  onCancel,
  isNew = false 
}) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    name: '',
    type: 'postgresql',
    environment: 'development',
    host: '',
    port: '',
    database: '',
    username: '',
    password: '',
    ssl: false,
    connectionTimeout: 30,
    maxConnections: 10,
    additionalParams: ''
  });

  const [testResult, setTestResult] = useState(null);
  const [isTesting, setIsTesting] = useState(false);

  const databaseTypes = [
    { value: 'postgresql', label: 'PostgreSQL' },
    { value: 'mysql', label: 'MySQL' },
    { value: 'sqlite', label: 'SQLite' },
    { value: 'mongodb', label: 'MongoDB' },
    { value: 'firebase', label: 'Firebase' },
    { value: 'supabase', label: 'Supabase' },
    { value: 'redis', label: 'Redis' },
    { value: 'mssql', label: 'SQL Server' }
  ];

  const environments = [
    { value: 'development', label: 'Development' },
    { value: 'staging', label: 'Staging' },
    { value: 'production', label: 'Production' },
    { value: 'testing', label: 'Testing' }
  ];

  const tabs = [
    { id: 'basic', label: 'Basic', icon: 'Settings' },
    { id: 'advanced', label: 'Advanced', icon: 'Sliders' },
    { id: 'security', label: 'Security', icon: 'Shield' },
    { id: 'test', label: 'Test', icon: 'Play' }
  ];

  useEffect(() => {
    if (selectedProfile) {
      setFormData(selectedProfile);
    }
  }, [selectedProfile]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    
    // Simulate connection test
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% success rate for demo
      setTestResult({
        success,
        message: success 
          ? "Connection successful! Database is accessible and responding." :"Connection failed: Unable to connect to database. Please check your credentials and network settings.",
        details: success 
          ? `Connected to ${formData?.type} database "${formData?.database}" on ${formData?.host}:${formData?.port}`
          : "Error: ECONNREFUSED - Connection refused by server",
        timestamp: new Date()?.toLocaleString()
      });
      setIsTesting(false);
      
      if (onTest) {
        onTest(formData, success);
      }
    }, 2000);
  };

  const handleSave = () => {
    if (onSave) {
      onSave({
        ...formData,
        id: selectedProfile?.id || Date.now(),
        status: testResult?.success ? 'connected' : 'disconnected',
        lastTested: testResult ? testResult?.timestamp : 'Never'
      });
    }
  };

  const getDefaultPort = (type) => {
    const ports = {
      postgresql: '5432',
      mysql: '3306',
      mongodb: '27017',
      redis: '6379',
      mssql: '1433',
      sqlite: '',
      firebase: '',
      supabase: '5432'
    };
    return ports?.[type] || '';
  };

  useEffect(() => {
    if (formData?.type && !formData?.port) {
      handleInputChange('port', getDefaultPort(formData?.type));
    }
  }, [formData?.type]);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="Database" size={20} className="text-primary" />
          <div>
            <h2 className="text-lg font-semibold text-text-primary">
              {isNew ? 'New Connection' : 'Edit Connection'}
            </h2>
            <p className="text-sm text-text-secondary">
              {formData?.name || 'Configure database connection'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            size="sm"
            iconName="Save"
            iconPosition="left"
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
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
      <div className="flex-1 overflow-y-auto p-6">
        
        {/* Basic Tab */}
        {activeTab === 'basic' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Connection Name"
                type="text"
                placeholder="My Database Connection"
                value={formData?.name}
                onChange={(e) => handleInputChange('name', e?.target?.value)}
                required
              />
              
              <Select
                label="Database Type"
                options={databaseTypes}
                value={formData?.type}
                onChange={(value) => handleInputChange('type', value)}
                required
              />
            </div>

            <Select
              label="Environment"
              options={environments}
              value={formData?.environment}
              onChange={(value) => handleInputChange('environment', value)}
              required
            />

            {formData?.type !== 'sqlite' && formData?.type !== 'firebase' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Input
                    label="Host"
                    type="text"
                    placeholder="localhost"
                    value={formData?.host}
                    onChange={(e) => handleInputChange('host', e?.target?.value)}
                    required
                  />
                </div>
                <Input
                  label="Port"
                  type="text"
                  placeholder={getDefaultPort(formData?.type)}
                  value={formData?.port}
                  onChange={(e) => handleInputChange('port', e?.target?.value)}
                />
              </div>
            )}

            {formData?.type === 'sqlite' && (
              <Input
                label="Database File Path"
                type="text"
                placeholder="/path/to/database.db"
                value={formData?.database}
                onChange={(e) => handleInputChange('database', e?.target?.value)}
                required
              />
            )}

            {formData?.type !== 'sqlite' && formData?.type !== 'firebase' && (
              <>
                <Input
                  label="Database Name"
                  type="text"
                  placeholder="my_database"
                  value={formData?.database}
                  onChange={(e) => handleInputChange('database', e?.target?.value)}
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Username"
                    type="text"
                    placeholder="username"
                    value={formData?.username}
                    onChange={(e) => handleInputChange('username', e?.target?.value)}
                    required
                  />
                  
                  <Input
                    label="Password"
                    type="password"
                    placeholder="password"
                    value={formData?.password}
                    onChange={(e) => handleInputChange('password', e?.target?.value)}
                    required
                  />
                </div>
              </>
            )}

            {formData?.type === 'firebase' && (
              <div className="space-y-4">
                <Input
                  label="Project ID"
                  type="text"
                  placeholder="my-firebase-project"
                  value={formData?.database}
                  onChange={(e) => handleInputChange('database', e?.target?.value)}
                  required
                />
                
                <Input
                  label="Service Account Key (JSON)"
                  type="text"
                  placeholder="Paste your service account key JSON here"
                  value={formData?.additionalParams}
                  onChange={(e) => handleInputChange('additionalParams', e?.target?.value)}
                  required
                />
              </div>
            )}
          </div>
        )}

        {/* Advanced Tab */}
        {activeTab === 'advanced' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Connection Timeout (seconds)"
                type="number"
                placeholder="30"
                value={formData?.connectionTimeout}
                onChange={(e) => handleInputChange('connectionTimeout', parseInt(e?.target?.value))}
              />
              
              <Input
                label="Max Connections"
                type="number"
                placeholder="10"
                value={formData?.maxConnections}
                onChange={(e) => handleInputChange('maxConnections', parseInt(e?.target?.value))}
              />
            </div>

            <Input
              label="Additional Parameters"
              type="text"
              placeholder="charset=utf8&timezone=UTC"
              value={formData?.additionalParams}
              onChange={(e) => handleInputChange('additionalParams', e?.target?.value)}
              description="Additional connection parameters (key=value&key2=value2)"
            />
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <Checkbox
              label="Enable SSL/TLS"
              description="Use encrypted connection to database"
              checked={formData?.ssl}
              onChange={(e) => handleInputChange('ssl', e?.target?.checked)}
            />

            {formData?.ssl && (
              <div className="ml-6 space-y-4 border-l-2 border-primary/20 pl-4">
                <Input
                  label="SSL Certificate Path"
                  type="text"
                  placeholder="/path/to/cert.pem"
                />
                
                <Input
                  label="SSL Key Path"
                  type="text"
                  placeholder="/path/to/key.pem"
                />
                
                <Input
                  label="SSL CA Path"
                  type="text"
                  placeholder="/path/to/ca.pem"
                />
              </div>
            )}

            <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
              <div className="flex items-start space-x-3">
                <Icon name="AlertTriangle" size={20} className="text-warning flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-warning mb-1">Security Notice</h4>
                  <p className="text-sm text-text-secondary">
                    Credentials are encrypted and stored securely. For production environments, 
                    consider using environment variables or secret management systems.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Test Tab */}
        {activeTab === 'test' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-medium text-text-primary">Connection Test</h3>
                <p className="text-sm text-text-secondary">
                  Test your database connection to verify configuration
                </p>
              </div>
              
              <Button
                variant="default"
                iconName="Play"
                iconPosition="left"
                onClick={handleTestConnection}
                loading={isTesting}
                disabled={!formData?.name || !formData?.host}
              >
                {isTesting ? 'Testing...' : 'Test Connection'}
              </Button>
            </div>

            {testResult && (
              <div className={`p-4 border rounded-lg ${
                testResult?.success 
                  ? 'bg-success/10 border-success/20' :'bg-error/10 border-error/20'
              }`}>
                <div className="flex items-start space-x-3">
                  <Icon 
                    name={testResult?.success ? 'CheckCircle' : 'XCircle'} 
                    size={20} 
                    className={`flex-shrink-0 mt-0.5 ${
                      testResult?.success ? 'text-success' : 'text-error'
                    }`} 
                  />
                  <div className="flex-1">
                    <h4 className={`font-medium mb-1 ${
                      testResult?.success ? 'text-success' : 'text-error'
                    }`}>
                      {testResult?.success ? 'Connection Successful' : 'Connection Failed'}
                    </h4>
                    <p className="text-sm text-text-secondary mb-2">
                      {testResult?.message}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {testResult?.details}
                    </p>
                    <p className="text-xs text-text-secondary mt-2">
                      Tested at: {testResult?.timestamp}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {!testResult && !isTesting && (
              <div className="text-center py-8 text-text-secondary">
                <Icon name="Database" size={48} className="mx-auto mb-3 opacity-50" />
                <p>Click "Test Connection" to verify your database configuration</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectionConfigurationForm;