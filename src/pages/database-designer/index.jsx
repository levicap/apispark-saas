import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectContext } from '../../contexts/ProjectContext';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import LeftToolbar from './components/LeftToolbar';
import ERDCanvas from './components/ERDCanvas';
import RightInspector from './components/RightInspector';
import BottomPanel from './components/BottomPanel';
import ConnectionConfig from './components/ConnectionConfig';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const DatabaseDesigner = () => {
  const navigate = useNavigate();
  const { currentProject, getCurrentProjectSchema, updateProjectSchema } = useProjectContext();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState('select');
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [isBottomPanelVisible, setIsBottomPanelVisible] = useState(true);
  const [isConnectionConfigOpen, setIsConnectionConfigOpen] = useState(false);
  const [connections, setConnections] = useState([]);
  const [generatedCode, setGeneratedCode] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Mock data
  const mockConnections = [
    {
      id: 1,
      name: 'Production DB',
      type: 'postgresql',
      host: 'prod-db.apiforge.com',
      port: '5432',
      database: 'ecommerce_prod',
      username: 'admin',
      password: '••••••••',
      ssl: true,
      createdAt: '2025-01-10T10:00:00Z',
      updatedAt: '2025-01-13T12:30:00Z'
    },
    {
      id: 2,
      name: 'Development DB',
      type: 'postgresql',
      host: 'localhost',
      port: '5432',
      database: 'ecommerce_dev',
      username: 'developer',
      password: '••••••••',
      ssl: false,
      createdAt: '2025-01-08T14:20:00Z',
      updatedAt: '2025-01-12T16:45:00Z'
    }
  ];

  // Mock user data for header
  const mockUser = {
    name: 'Sarah Chen',
    email: 'sarah.chen@apiforge.com'
  };

  // Initialize mock data
  useEffect(() => {
    setConnections(mockConnections);
    
    // Create sample tables if no project schema exists
    if (!currentProject) {
      const sampleTables = [
        {
          id: 1,
          name: 'users',
          position: { x: 100, y: 100 },
          width: 280,
          height: 200,
          description: 'User accounts and profiles',
          fields: [
            {
              id: 1,
              name: 'id',
              type: 'UUID',
              primaryKey: true,
              nullable: false,
              unique: true,
              defaultValue: 'gen_random_uuid()',
              autoIncrement: false
            },
            {
              id: 2,
              name: 'email',
              type: 'VARCHAR(255)',
              primaryKey: false,
              nullable: false,
              unique: true,
              defaultValue: '',
              autoIncrement: false
            }
          ]
        }
      ];
      setTables(sampleTables);
      setSelectedTable(sampleTables[0]);
    }
  }, [currentProject]);

  // Load project schema when project changes
  useEffect(() => {
    if (currentProject) {
      const schema = getCurrentProjectSchema();
      setTables(schema.entities || []);
    }
  }, [currentProject, getCurrentProjectSchema]);

  const handleTableSelect = (table) => {
    setSelectedTable(table);
  };

  const handleTableUpdate = (updatedTable) => {
    setTables(prev => prev.map(table => 
      table.id === updatedTable.id ? updatedTable : table
    ));
  };

  const handleTableAdd = (tableData) => {
    const newTable = {
      id: Date.now(),
      ...tableData,
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
      width: 280,
      height: 200
    };
    setTables(prev => [...prev, newTable]);
  };

  const handleTableDelete = (tableId) => {
    setTables(prev => prev.filter(table => table.id !== tableId));
    if (selectedTable?.id === tableId) {
      setSelectedTable(null);
    }
  };

  const handleGenerateCode = async () => {
    setIsGenerating(true);
    try {
      // Simulate code generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      setGeneratedCode({
        sql: `-- Generated SQL for ${tables.length} tables\n\n${tables.map(table => 
          `CREATE TABLE ${table.name} (\n  ${table.fields.map(field => 
            `  ${field.name} ${field.type}${field.primaryKey ? ' PRIMARY KEY' : ''}${field.nullable ? '' : ' NOT NULL'}${field.defaultValue ? ` DEFAULT ${field.defaultValue}` : ''}`
          ).join(',\n')}\n);`
        ).join('\n\n')}`,
        typescript: `// Generated TypeScript interfaces\n\n${tables.map(table => 
          `interface ${table.name.charAt(0).toUpperCase() + table.name.slice(1)} {\n  ${table.fields.map(field => 
            `  ${field.name}: ${getTypeScriptType(field.type)};`
          ).join('\n')}\n}`
        ).join('\n\n')}`,
        prisma: `// Generated Prisma schema\n\n${tables.map(table => 
          `model ${table.name.charAt(0).toUpperCase() + table.name.slice(1)} {\n  ${table.fields.map(field => 
            `  ${field.name} ${getPrismaType(field.type)}${field.primaryKey ? ' @id' : ''}${field.defaultValue ? ` @default(${field.defaultValue})` : ''}`
          ).join('\n')}\n}`
        ).join('\n\n')}`
      });
    } catch (error) {
      console.error('Error generating code:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const getTypeScriptType = (dbType) => {
    const typeMap = {
      'UUID': 'string',
      'VARCHAR': 'string',
      'TEXT': 'string',
      'INT': 'number',
      'BIGINT': 'number',
      'DECIMAL': 'number',
      'BOOLEAN': 'boolean',
      'TIMESTAMP': 'Date',
      'DATE': 'Date'
    };
    return typeMap[dbType] || 'any';
  };

  const getPrismaType = (dbType) => {
    const typeMap = {
      'UUID': 'String',
      'VARCHAR': 'String',
      'TEXT': 'String',
      'INT': 'Int',
      'BIGINT': 'BigInt',
      'DECIMAL': 'Decimal',
      'BOOLEAN': 'Boolean',
      'TIMESTAMP': 'DateTime',
      'DATE': 'DateTime'
    };
    return typeMap[dbType] || 'String';
  };

  const handleSaveConnection = (connectionData) => {
    setConnections(prev => {
      const existing = prev?.find(c => c?.id === connectionData?.id);
      if (existing) {
        return prev?.map(c => c?.id === connectionData?.id ? connectionData : c);
      }
      return [...prev, connectionData];
    });
  };

  const handleDeleteConnection = (connectionId) => {
    setConnections(prev => prev?.filter(c => c?.id !== connectionId));
  };

  const handleTestConnection = async (connection) => {
    // Mock connection test
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          success: Math.random() > 0.3,
          message: 'Connection test completed'
        });
      }, 2000);
    });
  };

  const handleImportSchema = () => {
    // Mock schema import
    console.log('Import schema functionality');
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onClose={() => setIsSidebarOpen(false)}
        currentUser={mockUser}
        currentProject={currentProject}
      />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        isSidebarCollapsed ? 'ml-16' : 'ml-64'
      }`}>
        {/* Header */}
        <Header
          currentUser={mockUser}
          currentProject={currentProject}
          onProjectChange={() => {}} // Placeholder for project change handler
          sidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* Page Content */}
        <div className="flex-1 overflow-hidden p-6">
          <div className="h-full flex flex-col">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Button
                  onClick={() => setSelectedTool('table')}
                  variant="outline"
                  size="sm"
                >
                  <Icon name="Table" size={16} className="mr-2" />
                  Table
                </Button>
                <Button
                  onClick={() => setSelectedTool('relationship')}
                  variant="outline"
                  size="sm"
                >
                  <Icon name="Link" size={16} className="mr-2" />
                  Relationship
                </Button>
                <Button
                  onClick={handleImportSchema}
                  variant="outline"
                  size="sm"
                >
                  <Icon name="Import" size={16} className="mr-2" />
                  Import
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => setIsConnectionConfigOpen(true)}
                  variant="outline"
                  size="sm"
                >
                  <Icon name="Settings" size={16} className="mr-2" />
                  Connections
                </Button>
                <Button
                  onClick={() => setIsBottomPanelVisible(!isBottomPanelVisible)}
                  variant="outline"
                  size="sm"
                >
                  <Icon name="PanelBottom" size={16} className="mr-2" />
                  SQL
                </Button>
                <Button
                  onClick={() => navigate('/api-designer')}
                  variant="default"
                  size="sm"
                >
                  <Icon name="ArrowRight" size={16} className="mr-2" />
                  Generate APIs
                </Button>
              </div>
            </div>

            <div className="flex-1 flex">
              <ERDCanvas
                tables={tables}
                onUpdateTable={handleTableUpdate}
                onDeleteTable={handleTableDelete}
                selectedTable={selectedTable}
                onSelectTable={handleTableSelect}
                selectedTool={selectedTool}
                onCreateTable={handleTableAdd}
              />

              <RightInspector
                selectedTable={selectedTable}
                onUpdateTable={handleTableUpdate}
                onGenerateCode={handleGenerateCode}
                generatedCode={generatedCode}
                isGenerating={isGenerating}
              />
            </div>

            <BottomPanel
              tables={tables}
              selectedTable={selectedTable}
              isVisible={isBottomPanelVisible}
              onToggle={() => setIsBottomPanelVisible(!isBottomPanelVisible)}
              onExport={() => console.log('Export functionality')}
            />
          </div>
        </div>
      </div>
      <ConnectionConfig
        isOpen={isConnectionConfigOpen}
        onClose={() => setIsConnectionConfigOpen(false)}
        connections={connections}
        onSaveConnection={handleSaveConnection}
        onTestConnection={handleTestConnection}
        onDeleteConnection={handleDeleteConnection}
      />
    </div>
  );
};

export default DatabaseDesigner;