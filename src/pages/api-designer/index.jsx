import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectContext } from '../../contexts/ProjectContext';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import CanvasToolbar from '../../components/ui/CanvasToolbar';
import ComponentLibrary from './components/ComponentLibrary';
import WorkflowCanvas from './components/WorkflowCanvas';
import InspectorPanel from './components/InspectorPanel';
import ProjectManager from './components/ProjectManager';
import CodeEditor from './components/CodeEditor';
import DatabaseSchemaImport from './components/DatabaseSchemaImport';
import CodeGenerator from './components/CodeGenerator';
import ApiKeyGenerator from './components/ApiKeyGenerator';
import ApiDocumentationGenerator from './components/ApiDocumentationGenerator';
import TeamManagement from './components/TeamManagement';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const APIDesigner = () => {
  const navigate = useNavigate();
  const { 
    currentProject, 
    getCurrentProjectNodes, 
    updateProjectNodes,
    getCurrentProjectSchema
  } = useProjectContext();
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [inspectorCollapsed, setInspectorCollapsed] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [workflowNodes, setWorkflowNodes] = useState([]);
  const [showGrid, setShowGrid] = useState(true);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [saveStatus, setSaveStatus] = useState('saved');
  
  // Modal states
  const [showProjectManager, setShowProjectManager] = useState(false);
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [showDatabaseImport, setShowDatabaseImport] = useState(false);
  const [showCodeGenerator, setShowCodeGenerator] = useState(false);
  const [showApiKeyGenerator, setShowApiKeyGenerator] = useState(false);
  const [showApiDocsGenerator, setShowApiDocsGenerator] = useState(false);
  const [showTeamManagement, setShowTeamManagement] = useState(false);

  // Load project nodes when project changes
  useEffect(() => {
    if (currentProject) {
      const projectNodes = getCurrentProjectNodes();
      setWorkflowNodes(projectNodes || []);
      setSelectedNode(null);
      setHistory([]);
      setHistoryIndex(-1);
      setSaveStatus('saved');
    }
  }, [currentProject, getCurrentProjectNodes]);

  // Auto-save functionality
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (saveStatus === 'unsaved' && currentProject) {
        handleSave();
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [saveStatus, currentProject]);

  const handleSave = useCallback(() => {
    if (!currentProject) return;
    
    setSaveStatus('saving');
    updateProjectNodes(currentProject?.id, workflowNodes);
    
    // Simulate save operation
    setTimeout(() => {
      setSaveStatus('saved');
    }, 1000);
  }, [currentProject, workflowNodes, updateProjectNodes]);

  const handleNodeSelect = useCallback((node) => {
    setSelectedNode(node);
  }, []);

  const handleNodeAdd = useCallback((node) => {
    const newNode = {
      ...node,
      id: node?.id || `node-${Date.now()}`,
      position: node?.position || { x: 200, y: 200 }
    };
    
    setWorkflowNodes(prev => [...prev, newNode]);
    setSaveStatus('unsaved');
    
    // Add to history
    setHistory(prev => [...prev?.slice(0, historyIndex + 1), { type: 'add-node', node: newNode }]);
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  const handleNodeUpdate = useCallback((updatedNode) => {
    setWorkflowNodes(prev => prev?.map(node => 
      node?.id === updatedNode?.id ? updatedNode : node
    ));
    setSaveStatus('unsaved');
  }, []);

  const handleNodeMove = useCallback((nodeId, newPosition) => {
    setWorkflowNodes(prev => prev?.map(node => 
      node?.id === nodeId ? { ...node, position: newPosition } : node
    ));
    setSaveStatus('unsaved');
  }, []);

  const handleNodeDelete = useCallback((nodeId) => {
    setWorkflowNodes(prev => prev?.filter(node => node?.id !== nodeId));
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
    }
    setSaveStatus('unsaved');
  }, [selectedNode]);

  const handleUndo = useCallback(() => {
    if (historyIndex >= 0) {
      const action = history?.[historyIndex];
      if (action?.type === 'add-node') {
        setWorkflowNodes(prev => prev?.filter(n => n?.id !== action?.node?.id));
      }
      setHistoryIndex(prev => prev - 1);
      setSaveStatus('unsaved');
    }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history?.length - 1) {
      const action = history?.[historyIndex + 1];
      if (action?.type === 'add-node') {
        setWorkflowNodes(prev => [...prev, action?.node]);
      }
      setHistoryIndex(prev => prev + 1);
      setSaveStatus('unsaved');
    }
  }, [history, historyIndex]);

  const handleAlignNodes = useCallback(() => {
    // Simple grid alignment
    setWorkflowNodes(prev => prev?.map((node, index) => ({
      ...node,
      position: {
        x: 100 + (index % 4) * 350,
        y: 100 + Math.floor(index / 4) * 250
      }
    })));
    setSaveStatus('unsaved');
  }, []);

  const handleImportDatabaseSchema = (schemas) => {
    // Generate nodes from imported database schemas
    const newNodes = [];
    let xOffset = 100;
    let yOffset = 100;

    schemas.forEach((schema, index) => {
      // Create database table node
      newNodes.push({
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
      newNodes.push({
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
      newNodes.push({
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

    // Add new nodes to existing workflow
    const updatedNodes = [...workflowNodes, ...newNodes];
    setWorkflowNodes(updatedNodes);

    // Auto-save to current project
    if (currentProject) {
      updateProjectNodes(currentProject?.id, updatedNodes);
    }
  };

  const handleImportSchemaEntities = () => {
    const projectSchema = getCurrentProjectSchema();
    const entities = projectSchema?.entities || [];
    
    if (entities.length === 0) {
      alert('No entities found in schema canvas. Please create entities first.');
      return;
    }

    // Generate nodes from schema entities
    const newNodes = [];
    let xOffset = 100;
    let yOffset = 100;

    entities.forEach((entity, index) => {
      // Create entity node
      newNodes.push({
        id: `entity_${entity.name}_${Date.now()}`,
        type: 'entity',
        name: `${entity.name} Entity`,
        color: 'bg-purple-600',
        icon: 'Database',
        position: { x: xOffset + (index * 300), y: yOffset },
        data: {
          method: 'ENTITY',
          endpoint: entity.name,
          description: `Entity: ${entity.name}`,
          parameters: [],
          responses: {},
          entityType: 'entity',
          entity: entity
        },
        connections: []
      });

      // Create GET endpoint for the entity
      newNodes.push({
        id: `get_entity_${entity.name}_${Date.now()}`,
        type: 'get',
        name: `GET ${entity.name}`,
        color: 'bg-green-500',
        icon: 'Download',
        position: { x: xOffset + (index * 300), y: yOffset + 150 },
        data: {
          method: 'GET',
          endpoint: `/api/${entity.name}`,
          description: `Retrieve all ${entity.name}`,
          parameters: [
            { name: 'page', type: 'number', required: false },
            { name: 'limit', type: 'number', required: false }
          ],
          responses: {
            200: { description: 'Success', schema: `${entity.name}[]` },
            400: { description: 'Bad Request' }
          }
        },
        connections: [
          { targetId: `entity_${entity.name}_${Date.now()}`, type: 'default' }
        ]
      });

      // Create POST endpoint for the entity
      newNodes.push({
        id: `post_entity_${entity.name}_${Date.now()}`,
        type: 'post',
        name: `POST ${entity.name}`,
        color: 'bg-blue-500',
        icon: 'Plus',
        position: { x: xOffset + (index * 300), y: yOffset + 300 },
        data: {
          method: 'POST',
          endpoint: `/api/${entity.name}`,
          description: `Create new ${entity.name}`,
          parameters: entity.fields
            ?.filter(field => !field.name.includes('id') && !field.primaryKey)
            ?.map(field => ({
              name: field.name,
              type: field.type === 'bigint' ? 'number' : 
                    field.type === 'varchar' ? 'string' : 
                    field.type === 'text' ? 'string' : 
                    field.type === 'timestamp' ? 'string' : 'string',
              required: !field.nullable
            })) || [],
          responses: {
            201: { description: 'Created', schema: entity.name },
            400: { description: 'Bad Request' }
          }
        },
        connections: [
          { targetId: `entity_${entity.name}_${Date.now()}`, type: 'default' }
        ]
      });
    });

    // Add new nodes to existing workflow
    const updatedNodes = [...workflowNodes, ...newNodes];
    setWorkflowNodes(updatedNodes);
    
    // Auto-save to current project
    if (currentProject) {
      updateProjectNodes(currentProject?.id, updatedNodes);
    }
  };

  const handleGenerateCode = () => {
    setShowCodeGenerator(true);
  };

  const getSaveStatusIcon = () => {
    switch (saveStatus) {
      case 'saving': return 'Loader2';
      case 'saved': return 'Check';
      case 'unsaved': return 'AlertCircle';
      default: return 'Save';
    }
  };

  const getSaveStatusText = () => {
    switch (saveStatus) {
      case 'saving': return 'Saving...';
      case 'saved': return 'All changes saved';
      case 'unsaved': return 'Unsaved changes';
      default: return 'Save';
    }
  };

  if (!currentProject) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="Code" size={64} className="mx-auto mb-4 text-text-secondary opacity-50" />
          <h2 className="text-xl font-semibold text-text-primary mb-2">No Project Selected</h2>
          <p className="text-text-secondary">Please select a project from the header to start designing your API.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <div className="flex-1 flex pt-16">
        {/* Main Sidebar */}
        <Sidebar
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        {/* Content Area */}
        <div className={`flex-1 flex transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-60'}`}>
          
          {/* Component Library */}
          <ComponentLibrary onNodeAdd={handleNodeAdd} />

          {/* Canvas Area */}
          <div className="flex-1 flex flex-col relative">
            
            {/* Project Header */}
            <div className="bg-surface border-b border-border px-6 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div>
                  <h1 className="text-lg font-semibold text-text-primary">{currentProject?.name}</h1>
                  <div className="flex items-center space-x-4 text-sm text-text-secondary">
                    <span>{workflowNodes?.length} nodes</span>
                    <span>Type: {currentProject?.type || 'REST'}</span>
                    <span>Modified {new Date(currentProject?.updatedAt)?.toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {/* Save Status */}
                <div className="flex items-center space-x-2 text-sm">
                  <Icon 
                    name={getSaveStatusIcon()} 
                    size={16} 
                    className={`${
                      saveStatus === 'saving' ? 'animate-spin' : ''
                    } ${
                      saveStatus === 'saved' ? 'text-success' : 
                      saveStatus === 'unsaved'? 'text-warning' : 'text-text-secondary'
                    }`}
                  />
                  <span className="text-text-secondary">{getSaveStatusText()}</span>
                </div>

                {/* Action Buttons */}
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Database"
                  iconPosition="left"
                  onClick={() => setShowDatabaseImport(true)}
                >
                  Import DB
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  iconName="Database"
                  iconPosition="left"
                  onClick={handleImportSchemaEntities}
                >
                  Import Schema
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  iconName="Key"
                  iconPosition="left"
                  onClick={() => setShowApiKeyGenerator(true)}
                >
                  API Keys
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  iconName="FileText"
                  iconPosition="left"
                  onClick={() => setShowApiDocsGenerator(true)}
                >
                  Docs
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  iconName="Users"
                  iconPosition="left"
                  onClick={() => setShowTeamManagement(true)}
                >
                  Team
                </Button>

                <Button
                  variant="default"
                  size="sm"
                  iconName="Code"
                  iconPosition="left"
                  onClick={handleGenerateCode}
                >
                  Generate Code
                </Button>

                {/* Panel Toggles */}
                <div className="flex items-center space-x-1 border-l border-border pl-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="PanelRight"
                    iconSize={16}
                    onClick={() => setInspectorCollapsed(!inspectorCollapsed)}
                    className={inspectorCollapsed ? 'text-text-secondary' : 'text-primary'}
                    title="Toggle Inspector Panel"
                  />
                </div>
              </div>
            </div>

            {/* Canvas */}
            <WorkflowCanvas
              nodes={workflowNodes}
              onNodeSelect={handleNodeSelect}
              onNodeMove={handleNodeMove}
              onNodeUpdate={handleNodeUpdate}
              onNodeAdd={handleNodeAdd}
              selectedNodeId={selectedNode?.id}
              showGrid={showGrid}
            />

            {/* Canvas Toolbar */}
            <CanvasToolbar
              onAddNode={() => handleNodeAdd({
                name: 'New Endpoint',
                type: 'get',
                color: 'bg-green-500',
                icon: 'Download'
              })}
              onAlignNodes={handleAlignNodes}
              onUndo={handleUndo}
              onRedo={handleRedo}
              onZoomIn={() => {}}
              onZoomOut={() => {}}
              onZoomFit={() => {}}
              onToggleGrid={() => setShowGrid(!showGrid)}
              canUndo={historyIndex >= 0}
              canRedo={historyIndex < history?.length - 1}
              showGrid={showGrid}
            />

            {/* Floating Quick Actions */}
            <div className="absolute bottom-6 right-6 flex flex-col space-y-2">
              <Button
                variant="default"
                size="icon"
                onClick={() => setShowDatabaseImport(true)}
                className="w-12 h-12 rounded-full shadow-lg"
                title="Import Database Schema"
              >
                <Icon name="Database" size={20} />
              </Button>
              
              <Button
                variant="default"
                size="icon"
                onClick={handleImportSchemaEntities}
                className="w-12 h-12 rounded-full shadow-lg"
                title="Import Schema Entities"
              >
                <Icon name="Table" size={20} />
              </Button>
              
              <Button
                variant="default"
                size="icon"
                onClick={handleGenerateCode}
                className="w-12 h-12 rounded-full shadow-lg"
                title="Generate Code"
              >
                <Icon name="Code" size={20} />
              </Button>
            </div>
          </div>

          {/* Inspector Panel */}
          <div className={`transition-all duration-300 ${inspectorCollapsed ? 'w-0' : 'w-80'} hidden lg:block`}>
            <InspectorPanel
              selectedNode={selectedNode}
              onNodeUpdate={handleNodeUpdate}
              onNodeDelete={handleNodeDelete}
              onClose={() => setSelectedNode(null)}
              isCollapsed={inspectorCollapsed}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <ProjectManager
        isOpen={showProjectManager}
        onClose={() => setShowProjectManager(false)}
      />

      <CodeEditor
        isOpen={showCodeEditor}
        onClose={() => setShowCodeEditor(false)}
        selectedNode={selectedNode}
        workflowNodes={workflowNodes}
        currentProject={currentProject}
      />

      <DatabaseSchemaImport
        isOpen={showDatabaseImport}
        onClose={() => setShowDatabaseImport(false)}
        onImport={handleImportDatabaseSchema}
      />

      <CodeGenerator
        isOpen={showCodeGenerator}
        onClose={() => setShowCodeGenerator(false)}
        nodes={workflowNodes}
        currentProject={currentProject}
      />

      <ApiKeyGenerator
        isOpen={showApiKeyGenerator}
        onClose={() => setShowApiKeyGenerator(false)}
        currentProject={currentProject}
      />

      <ApiDocumentationGenerator
        isOpen={showApiDocsGenerator}
        onClose={() => setShowApiDocsGenerator(false)}
        nodes={workflowNodes}
        currentProject={currentProject}
      />

      <TeamManagement
        isOpen={showTeamManagement}
        onClose={() => setShowTeamManagement(false)}
        currentProject={currentProject}
      />

      {/* Mobile Bottom Navigation Spacer */}
      <div className="h-16 md:hidden" />
    </div>
  );
};

export default APIDesigner;