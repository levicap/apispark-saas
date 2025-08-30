import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ConnectionConfig = ({ 
  isOpen = false, 
  onClose, 
  connections = [], 
  onSaveConnection,
  onTestConnection,
  onDeleteConnection
}) => {
  const [activeConnection, setActiveConnection] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'postgresql',
    host: 'localhost',
    port: '5432',
    database: '',
    username: '',
    password: '',
    ssl: false
  });
  const [testResult, setTestResult] = useState(null);
  const [isTesting, setIsTesting] = useState(false);

  const databaseTypes = [
    { value: 'postgresql', label: 'PostgreSQL' },
    { value: 'mysql', label: 'MySQL' },
    { value: 'sqlite', label: 'SQLite' },
    { value: 'mongodb', label: 'MongoDB' },
    { value: 'mssql', label: 'SQL Server' }
  ];

  const defaultPorts = {
    postgresql: '5432',
    mysql: '3306',
    sqlite: '',
    mongodb: '27017',
    mssql: '1433'
  };

  const handleTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      type,
      port: defaultPorts?.[type] || ''
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    if (!formData?.name || !formData?.database) return;
    
    const connectionData = {
      id: activeConnection?.id || Date.now(),
      ...formData,
      createdAt: activeConnection?.createdAt || new Date()?.toISOString(),
      updatedAt: new Date()?.toISOString()
    };
    
    onSaveConnection(connectionData);
    setIsEditing(false);
    setActiveConnection(connectionData);
  };

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    
    try {
      // Simulate connection test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock test result
      const success = Math.random() > 0.3; // 70% success rate for demo
      
      setTestResult({
        success,
        message: success 
          ? 'Connection successful! Database is accessible.' :'Connection failed. Please check your credentials and network settings.',
        timestamp: new Date()?.toISOString()
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Connection test failed with an unexpected error.',
        timestamp: new Date()?.toISOString()
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleNewConnection = () => {
    setActiveConnection(null);
    setFormData({
      name: '',
      type: 'postgresql',
      host: 'localhost',
      port: '5432',
      database: '',
      username: '',
      password: '',
      ssl: false
    });
    setIsEditing(true);
    setTestResult(null);
  };

  const handleEditConnection = (connection) => {
    setActiveConnection(connection);
    setFormData(connection);
    setIsEditing(true);
    setTestResult(null);
  };

  const handleDeleteConnection = (connectionId) => {
    onDeleteConnection(connectionId);
    if (activeConnection?.id === connectionId) {
      setActiveConnection(null);
      setIsEditing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-300 flex items-center justify-center">
      <div className="bg-surface rounded-lg shadow-elevation-3 w-full max-w-4xl h-[80vh] flex overflow-hidden">
        {/* Sidebar - Connection List */}
        <div className="w-80 border-r border-border flex flex-col">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-foreground">Database Connections</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
              >
                <Icon name="X" size={20} />
              </Button>
            </div>
            <Button
              variant="default"
              onClick={handleNewConnection}
              iconName="Plus"
              iconPosition="left"
              className="w-full"
            >
              New Connection
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {connections?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Icon name="Database" size={32} className="mx-auto mb-3" />
                <p className="text-sm">No connections configured</p>
                <p className="text-xs">Create your first database connection</p>
              </div>
            ) : (
              <div className="space-y-2">
                {connections?.map((connection) => (
                  <div
                    key={connection?.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      activeConnection?.id === connection?.id
                        ? 'border-primary bg-primary/5' :'border-border hover:bg-muted'
                    }`}
                    onClick={() => setActiveConnection(connection)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-foreground text-sm">{connection?.name}</h3>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e?.stopPropagation();
                            handleEditConnection(connection);
                          }}
                          className="w-6 h-6"
                        >
                          <Icon name="Edit" size={12} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e?.stopPropagation();
                            handleDeleteConnection(connection?.id);
                          }}
                          className="w-6 h-6 text-error hover:text-error"
                        >
                          <Icon name="Trash2" size={12} />
                        </Button>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <div className="flex items-center space-x-2 mb-1">
                        <Icon name="Database" size={10} />
                        <span>{connection?.type?.toUpperCase()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Icon name="Server" size={10} />
                        <span>{connection?.host}:{connection?.port}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Content - Connection Details */}
        <div className="flex-1 flex flex-col">
          {!activeConnection && !isEditing ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Icon name="Database" size={64} className="text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Select a Connection
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  Choose a connection from the sidebar or create a new one
                </p>
                <Button
                  variant="outline"
                  onClick={handleNewConnection}
                  iconName="Plus"
                  iconPosition="left"
                >
                  Create New Connection
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {isEditing ? (activeConnection ? 'Edit Connection' : 'New Connection') : activeConnection?.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {isEditing ? 'Configure your database connection settings' : 'Connection details and status'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!isEditing && activeConnection && (
                      <Button
                        variant="outline"
                        onClick={() => handleEditConnection(activeConnection)}
                        iconName="Edit"
                        iconPosition="left"
                      >
                        Edit
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      onClick={handleTest}
                      loading={isTesting}
                      iconName="Zap"
                      iconPosition="left"
                    >
                      Test Connection
                    </Button>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {isEditing ? (
                  <div className="space-y-6 max-w-2xl">
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Connection Name"
                        value={formData?.name}
                        onChange={(e) => handleInputChange('name', e?.target?.value)}
                        placeholder="My Database"
                        required
                      />
                      <Select
                        label="Database Type"
                        options={databaseTypes}
                        value={formData?.type}
                        onChange={(value) => handleTypeChange(value)}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2">
                        <Input
                          label="Host"
                          value={formData?.host}
                          onChange={(e) => handleInputChange('host', e?.target?.value)}
                          placeholder="localhost"
                        />
                      </div>
                      <Input
                        label="Port"
                        value={formData?.port}
                        onChange={(e) => handleInputChange('port', e?.target?.value)}
                        placeholder="5432"
                      />
                    </div>

                    <Input
                      label="Database Name"
                      value={formData?.database}
                      onChange={(e) => handleInputChange('database', e?.target?.value)}
                      placeholder="my_database"
                      required
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Username"
                        value={formData?.username}
                        onChange={(e) => handleInputChange('username', e?.target?.value)}
                        placeholder="username"
                      />
                      <Input
                        label="Password"
                        type="password"
                        value={formData?.password}
                        onChange={(e) => handleInputChange('password', e?.target?.value)}
                        placeholder="password"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-border">
                      <Button
                        variant="ghost"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="default"
                        onClick={handleSave}
                        disabled={!formData?.name || !formData?.database}
                      >
                        Save Connection
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 max-w-2xl">
                    {/* Connection Info */}
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-foreground mb-3">Connection Details</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Type:</span>
                            <span className="text-foreground font-medium">{activeConnection?.type?.toUpperCase()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Host:</span>
                            <span className="text-foreground">{activeConnection?.host}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Port:</span>
                            <span className="text-foreground">{activeConnection?.port}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Database:</span>
                            <span className="text-foreground">{activeConnection?.database}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-foreground mb-3">Status</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-success rounded-full"></div>
                            <span className="text-foreground">Connected</span>
                          </div>
                          <div className="text-muted-foreground">
                            Last tested: {new Date()?.toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Test Result */}
                {testResult && (
                  <div className={`mt-6 p-4 rounded-lg border ${
                    testResult?.success 
                      ? 'border-success bg-success/5 text-success' :'border-error bg-error/5 text-error'
                  }`}>
                    <div className="flex items-center space-x-2 mb-2">
                      <Icon 
                        name={testResult?.success ? "CheckCircle" : "XCircle"} 
                        size={16} 
                      />
                      <span className="font-medium">
                        {testResult?.success ? 'Connection Successful' : 'Connection Failed'}
                      </span>
                    </div>
                    <p className="text-sm">{testResult?.message}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConnectionConfig;