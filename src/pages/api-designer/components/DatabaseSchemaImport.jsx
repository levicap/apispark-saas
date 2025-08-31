import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const DatabaseSchemaImport = ({ onImport, onClose, isOpen }) => {
  const [importType, setImportType] = useState('file');
  const [connectionString, setConnectionString] = useState('');
  const [selectedTables, setSelectedTables] = useState([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [availableTables, setAvailableTables] = useState([]);

  // Mock database schemas for demonstration
  const mockSchemas = {
    postgresql: [
      {
        name: 'users',
        columns: [
          { name: 'id', type: 'SERIAL PRIMARY KEY', nullable: false },
          { name: 'name', type: 'VARCHAR(255)', nullable: false },
          { name: 'email', type: 'VARCHAR(255)', nullable: false, unique: true },
          { name: 'password_hash', type: 'VARCHAR(255)', nullable: false },
          { name: 'created_at', type: 'TIMESTAMP DEFAULT NOW()', nullable: false },
          { name: 'updated_at', type: 'TIMESTAMP DEFAULT NOW()', nullable: false }
        ]
      },
      {
        name: 'products',
        columns: [
          { name: 'id', type: 'SERIAL PRIMARY KEY', nullable: false },
          { name: 'name', type: 'VARCHAR(255)', nullable: false },
          { name: 'description', type: 'TEXT', nullable: true },
          { name: 'price', type: 'DECIMAL(10,2)', nullable: false },
          { name: 'category_id', type: 'INTEGER REFERENCES categories(id)', nullable: true },
          { name: 'created_at', type: 'TIMESTAMP DEFAULT NOW()', nullable: false }
        ]
      },
      {
        name: 'orders',
        columns: [
          { name: 'id', type: 'SERIAL PRIMARY KEY', nullable: false },
          { name: 'user_id', type: 'INTEGER REFERENCES users(id)', nullable: false },
          { name: 'status', type: 'VARCHAR(50)', nullable: false },
          { name: 'total_amount', type: 'DECIMAL(10,2)', nullable: false },
          { name: 'created_at', type: 'TIMESTAMP DEFAULT NOW()', nullable: false }
        ]
      }
    ],
    mysql: [
      {
        name: 'users',
        columns: [
          { name: 'id', type: 'INT AUTO_INCREMENT PRIMARY KEY', nullable: false },
          { name: 'name', type: 'VARCHAR(255)', nullable: false },
          { name: 'email', type: 'VARCHAR(255)', nullable: false, unique: true },
          { name: 'password_hash', type: 'VARCHAR(255)', nullable: false },
          { name: 'created_at', type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP', nullable: false },
          { name: 'updated_at', type: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP', nullable: false }
        ]
      }
    ],
    mongodb: [
      {
        name: 'users',
        columns: [
          { name: '_id', type: 'ObjectId', nullable: false },
          { name: 'name', type: 'String', nullable: false },
          { name: 'email', type: 'String', nullable: false, unique: true },
          { name: 'password_hash', type: 'String', nullable: false },
          { name: 'created_at', type: 'Date', nullable: false },
          { name: 'updated_at', type: 'Date', nullable: false }
        ]
      }
    ]
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    
    // Simulate connection delay
    setTimeout(() => {
      // Mock connection - in real app, this would connect to actual database
      const databaseType = connectionString.includes('postgres') ? 'postgresql' : 
                          connectionString.includes('mysql') ? 'mysql' : 'mongodb';
      setAvailableTables(mockSchemas[databaseType] || []);
      setIsConnecting(false);
    }, 2000);
  };

  const handleTableToggle = (tableName) => {
    setSelectedTables(prev => 
      prev.includes(tableName) 
        ? prev.filter(t => t !== tableName)
        : [...prev, tableName]
    );
  };

  const handleImport = () => {
    const selectedSchemas = availableTables.filter(table => 
      selectedTables.includes(table.name)
    );
    
    if (onImport) {
      onImport(selectedSchemas);
    }
    
    if (onClose) {
      onClose();
    }
  };

  const generateNodesFromSchema = (schemas) => {
    const nodes = [];
    let xOffset = 100;
    let yOffset = 100;

    schemas.forEach((schema, index) => {
      // Create database table node
      nodes.push({
        id: `table_${schema.name}_${Date.now()}`,
        type: 'table',
        name: `${schema.name} Table`,
        color: 'bg-gray-600',
        icon: 'Table',
        position: { x: xOffset + (index * 300), y: yOffset },
        data: {
          method: 'TABLE',
          endpoint: schema.name,
          description: `Database table: ${schema.name}`,
          parameters: [],
          responses: {},
          databaseType: 'table',
          schema: schema
        },
        connections: []
      });

      // Create GET endpoint for the table
      nodes.push({
        id: `get_${schema.name}_${Date.now()}`,
        type: 'get',
        name: `GET ${schema.name}`,
        color: 'bg-green-500',
        icon: 'Download',
        position: { x: xOffset + (index * 300), y: yOffset + 150 },
        data: {
          method: 'GET',
          endpoint: `/api/${schema.name}`,
          description: `Retrieve all ${schema.name}`,
          parameters: [
            { name: 'page', type: 'number', required: false },
            { name: 'limit', type: 'number', required: false }
          ],
          responses: {
            200: { description: 'Success', schema: `${schema.name}[]` },
            400: { description: 'Bad Request' }
          }
        },
        connections: [
          { targetId: `table_${schema.name}_${Date.now()}`, type: 'default' }
        ]
      });

      // Create POST endpoint for the table
      nodes.push({
        id: `post_${schema.name}_${Date.now()}`,
        type: 'post',
        name: `POST ${schema.name}`,
        color: 'bg-blue-500',
        icon: 'Plus',
        position: { x: xOffset + (index * 300), y: yOffset + 300 },
        data: {
          method: 'POST',
          endpoint: `/api/${schema.name}`,
          description: `Create new ${schema.name}`,
          parameters: schema.columns
            .filter(col => !col.name.includes('id') && !col.name.includes('created_at') && !col.name.includes('updated_at'))
            .map(col => ({
              name: col.name,
              type: col.type.includes('VARCHAR') ? 'string' : 
                    col.type.includes('INT') ? 'number' : 
                    col.type.includes('DECIMAL') ? 'number' : 'string',
              required: !col.nullable
            })),
          responses: {
            201: { description: 'Created', schema: schema.name },
            400: { description: 'Bad Request' }
          }
        },
        connections: [
          { targetId: `table_${schema.name}_${Date.now()}`, type: 'default' }
        ]
      });
    });

    return nodes;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background border border-border rounded-lg shadow-elevation-3 w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Import Database Schema</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Import database tables to automatically generate API endpoints
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Left Panel - Connection */}
          <div className="w-1/2 p-6 border-r border-border">
            <div className="space-y-6">
              {/* Import Type */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Import Method
                </label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value="file"
                      checked={importType === 'file'}
                      onChange={(e) => setImportType(e.target.value)}
                      className="text-primary"
                    />
                    <span className="text-sm">Upload Schema File</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value="connection"
                      checked={importType === 'connection'}
                      onChange={(e) => setImportType(e.target.value)}
                      className="text-primary"
                    />
                    <span className="text-sm">Database Connection</span>
                  </label>
                </div>
              </div>

              {/* Connection String */}
              {importType === 'connection' && (
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Database Connection String
                  </label>
                  <Input
                    type="text"
                    placeholder="postgresql://user:password@localhost:5432/database"
                    value={connectionString}
                    onChange={(e) => setConnectionString(e.target.value)}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Supported: PostgreSQL, MySQL, MongoDB
                  </p>
                </div>
              )}

              {/* File Upload */}
              {importType === 'file' && (
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Schema File
                  </label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <Icon name="Upload" size={32} className="text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Drop your schema file here or click to browse
                    </p>
                    <Button variant="outline" size="sm">
                      Choose File
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      Supports: .sql, .json, .yaml, .xml
                    </p>
                  </div>
                </div>
              )}

              {/* Connect Button */}
              {importType === 'connection' && (
                <Button
                  onClick={handleConnect}
                  disabled={!connectionString || isConnecting}
                  className="w-full"
                >
                  {isConnecting ? (
                    <>
                      <Icon name="Loader" size={16} className="animate-spin mr-2" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Icon name="Database" size={16} className="mr-2" />
                      Connect to Database
                    </>
                  )}
                </Button>
              )}

              {/* Mock Connection for Demo */}
              <div className="border-t border-border pt-4">
                <p className="text-xs text-muted-foreground mb-2">Demo Mode - Available Schemas:</p>
                <div className="space-y-2">
                  {Object.keys(mockSchemas).map(dbType => (
                    <Button
                      key={dbType}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setAvailableTables(mockSchemas[dbType]);
                        setConnectionString(`${dbType}://demo-connection`);
                      }}
                      className="w-full justify-start"
                    >
                      <Icon name="Database" size={14} className="mr-2" />
                      {dbType.toUpperCase()} Sample Schema
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Table Selection */}
          <div className="w-1/2 p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-foreground">Available Tables</h3>
                {availableTables.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedTables(availableTables.map(t => t.name))}
                    >
                      Select All
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedTables([])}
                    >
                      Clear All
                    </Button>
                  </div>
                )}
              </div>

              {availableTables.length === 0 ? (
                <div className="text-center py-8">
                  <Icon name="Database" size={48} className="text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">
                    Connect to a database or upload a schema file to see available tables
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {availableTables.map(table => (
                    <div
                      key={table.name}
                      className={`p-4 border rounded-lg cursor-pointer transition-smooth ${
                        selectedTables.includes(table.name)
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => handleTableToggle(table.name)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={selectedTables.includes(table.name)}
                            onChange={() => handleTableToggle(table.name)}
                            className="text-primary"
                          />
                          <h4 className="font-medium text-foreground">{table.name}</h4>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {table.columns.length} columns
                        </span>
                      </div>
                      
                      {/* Column Preview */}
                      <div className="space-y-1">
                        {table.columns.slice(0, 3).map(column => (
                          <div key={column.name} className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <span className="font-mono">{column.name}</span>
                            <span>•</span>
                            <span>{column.type}</span>
                            {!column.nullable && <span className="text-red-500">*</span>}
                          </div>
                        ))}
                        {table.columns.length > 3 && (
                          <div className="text-xs text-muted-foreground">
                            +{table.columns.length - 3} more columns
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Import Button */}
              {selectedTables.length > 0 && (
                <div className="border-t border-border pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-foreground">
                      {selectedTables.length} table{selectedTables.length !== 1 ? 's' : ''} selected
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Will generate {selectedTables.length * 3} API nodes
                    </span>
                  </div>
                  <Button
                    onClick={handleImport}
                    className="w-full"
                    disabled={selectedTables.length === 0}
                  >
                    <Icon name="Download" size={16} className="mr-2" />
                    Import Selected Tables
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseSchemaImport;
