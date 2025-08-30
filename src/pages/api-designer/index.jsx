import React, { useState, useEffect, useCallback } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import ComponentLibrary from './components/ComponentLibrary';
import WorkflowCanvas from './components/WorkflowCanvas';
import InspectorPanel from './components/InspectorPanel';
import ProjectManager from './components/ProjectManager';
import CodeEditor from './components/CodeEditor';
import DatabaseExport from '../../components/ui/DatabaseExport';
import DatabaseSchemaPanel from '../../components/ui/DatabaseSchemaPanel';
import GraphQLConfigPanel from '../../components/ui/GraphQLConfigPanel';
import BusinessLogicPanel from '../../components/ui/BusinessLogicPanel';
import AIAgentEffect from '../../components/ui/AIAgentEffect';
import { useProjectContext } from '../../contexts/ProjectContext';
import Button from '../../components/ui/Button';

// Simple Icon component for now
const Icon = ({ name, size = 16, className = '' }) => (
  <span className={`inline-block ${className}`} style={{ width: size, height: size }}>
    {name === 'Plus' && '➕'}
    {name === 'Folder' && '📁'}
    {name === 'Database' && '🗄️'}
    {name === 'Table' && '📊'}
    {name === 'Network' && '🌐'}
    {name === 'Briefcase' && '💼'}
    {name === 'Code' && '💻'}
    {name === 'Import' && '📥'}
    {name === 'Settings' && '⚙️'}
    {name === 'Zap' && '⚡'}
    {name === 'GitBranch' && '🌿'}
  </span>
);

const APIDesigner = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [libraryCollapsed, setLibraryCollapsed] = useState(false);
  const [inspectorCollapsed, setInspectorCollapsed] = useState(false);
  const [databaseExportOpen, setDatabaseExportOpen] = useState(false);
  const [databaseSchemaOpen, setDatabaseSchemaOpen] = useState(false);
  const [graphqlConfigOpen, setGraphqlConfigOpen] = useState(false);
  const [businessLogicOpen, setBusinessLogicOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [workflowNodes, setWorkflowNodes] = useState([]);
  const [showProjectManager, setShowProjectManager] = useState(false);
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [importedSchema, setImportedSchema] = useState(null);
  const [graphqlConfig, setGraphqlConfig] = useState(null);
  const [businessLogicConfig, setBusinessLogicConfig] = useState(null);
  const [showAIAgent, setShowAIAgent] = useState(false);
  const [generatedFiles, setGeneratedFiles] = useState({});

  // Project management hook
  const {
    projects,
    currentProject,
    setCurrentProject,
    createProject,
    updateProject,
    deleteProject,
    getCurrentProjectSchema,
    getCurrentProjectEndpoints,
    updateProjectSchema,
    updateProjectWorkflow
  } = useProjectContext();

  // Mock user data
  const mockUser = {
    id: 'user_1',
    name: 'Alex Johnson',
    email: 'alex.johnson@apiforge.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
  };

  // Load workflow when project changes
  useEffect(() => {
    if (currentProject && currentProject.workflow) {
      const nodes = currentProject.workflow.nodes || [];
      setWorkflowNodes(nodes);
      
      if (nodes.length > 0) {
        console.log(`Loaded ${nodes.length} workflow nodes from ${currentProject.name}`);
      }
    } else {
      setWorkflowNodes([]);
    }
  }, [currentProject]);

  // Save workflow when nodes change
  const handleWorkflowChange = useCallback((updatedNodes) => {
    setWorkflowNodes(updatedNodes);
    
    if (currentProject) {
      // Extract connections from nodes
      const connections = [];
      updatedNodes.forEach(node => {
        if (node.connections) {
          node.connections.forEach(conn => {
            connections.push({
              id: `${node.id}-${conn.to}`,
              sourceNodeId: node.id,
              targetNodeId: conn.to,
              type: conn.type || 'data'
            });
          });
        }
      });
      
      updateProjectWorkflow(updatedNodes, connections);
      console.log('Workflow saved successfully!');
    }
  }, [currentProject, updateProjectWorkflow]);

  const handleToggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  const handleProjectChange = (project) => {
    setCurrentProject(project);
    console.log(`Switched to project: ${project.name}`);
  };

  const handleCreateProject = (projectData) => {
    const newProject = createProject(projectData);
    setCurrentProject(newProject);
    setShowProjectManager(false);
    console.log(`Project "${newProject.name}" created successfully!`);
  };

  const handleUpdateProject = (projectId, updatedData) => {
    const updatedProject = updateProject(projectId, updatedData);
    console.log(`Project "${updatedProject.name}" updated successfully!`);
  };

  const handleDeleteProject = (projectId) => {
    const projectToDelete = projects.find(p => p.id === projectId);
    if (projectToDelete) {
      deleteProject(projectId);
      if (currentProject?.id === projectId) {
        setCurrentProject(null);
      }
      console.log(`Project "${projectToDelete.name}" deleted successfully!`);
    }
  };

  const handleDuplicateProject = (projectId) => {
    const originalProject = projects.find(p => p.id === projectId);
    if (originalProject) {
      const duplicatedProject = createProject({
        name: `${originalProject.name} (Copy)`,
        description: originalProject.description,
        databaseType: originalProject.databaseType,
        metadata: originalProject.metadata
      });
      console.log(`Project "${duplicatedProject.name}" duplicated successfully!`);
    }
  };

  const handleNodeSelect = (node) => {
    // Always select the latest node object from workflowNodes
    const latest = workflowNodes.find(n => n.id === node.id) || node;
    console.log('[handleNodeSelect] node:', node, 'latest:', latest);
    setSelectedNode(latest);
  };

  const handleNodesChange = (nodes) => {
    console.log('[handleNodesChange] nodes:', nodes);
    setWorkflowNodes(nodes);
    // If a node is selected, keep it selected after nodes change
    if (selectedNode) {
      const latest = nodes.find(n => n.id === selectedNode.id);
      if (latest) setSelectedNode(latest);
    }
    // Auto-save to current project
    if (currentProject) {
      // Extract connections from nodes
      const connections = [];
      nodes.forEach(node => {
        if (node.connections) {
          node.connections.forEach(conn => {
            connections.push({
              id: `${node.id}-${conn.to}`,
              sourceNodeId: node.id,
              targetNodeId: conn.to,
              type: conn.type || 'data'
            });
          });
        }
      });
      updateProjectWorkflow(nodes, connections);
    }
  };

  const handleNodeUpdate = (updatedNode) => {
    console.log('[handleNodeUpdate] updatedNode:', updatedNode);
    const updatedNodes = workflowNodes?.map(node => {
      if (node?.id === updatedNode?.id) {
        // Always preserve connections array if not present in updatedNode
        return {
          ...updatedNode,
          connections: updatedNode.connections ?? node.connections ?? [],
        };
      }
      return node;
    });
    console.log('[handleNodeUpdate] updatedNodes:', updatedNodes);
    setWorkflowNodes(updatedNodes);
    setSelectedNode(updatedNodes.find(n => n.id === updatedNode.id));
    if (currentProject) {
      // Extract connections from nodes
      const connections = [];
      updatedNodes.forEach(node => {
        if (node.connections) {
          node.connections.forEach(conn => {
            connections.push({
              id: `${node.id}-${conn.to}`,
              sourceNodeId: node.id,
              targetNodeId: conn.to,
              type: conn.type || 'data'
            });
          });
        }
      });
      updateProjectWorkflow(updatedNodes, connections);
    }
  };

  const handleNodeRemove = (nodeId) => {
    const nodeToRemove = workflowNodes.find(n => n.id === nodeId);
    if (nodeToRemove) {
      setWorkflowNodes(prev => prev.filter(n => n.id !== nodeId));
      if (selectedNode?.id === nodeId) {
        setSelectedNode(null);
      }
      console.log(`Removed ${nodeToRemove.name} node from workflow`);
    }
  };

  const handleDragStart = (component) => {
    // Handle drag start from component library
    console.log('Dragging component:', component);
  };

  const handleAddNode = (nodeData) => {
    const newNode = {
      id: `node-${Date.now()}`,
      type: nodeData.type,
      name: nodeData.name,
      position: { x: 100, y: 100 },
      data: nodeData.data || {},
      connections: []
    };
    
    setWorkflowNodes(prev => [...prev, newNode]);
    console.log(`Added ${nodeData.name} node to workflow`);
  };

  const handleDatabaseExport = (exportedData, format) => {
    if (currentProject) {
      // Save exported data to project metadata
      const updatedProject = {
        ...currentProject,
        metadata: {
          ...currentProject.metadata,
          lastExport: {
            timestamp: new Date().toISOString(),
            format: format,
            data: exportedData
          }
        }
      };
      updateProject(updatedProject);
      console.log(`Database exported successfully in ${format} format!`);
    }
  };

  const handleImportSchema = (schema) => {
    setImportedSchema(schema);
    setDatabaseSchemaOpen(false);
    
    if (currentProject) {
      // Save to project metadata
      const updatedProject = {
        ...currentProject,
        metadata: {
          ...currentProject.metadata,
          importedSchema: schema
        }
      };
      updateProject(updatedProject);
      console.log(`Imported ${schema.entities.length} entities from database schema!`);
    }
  };

  const handleGenerateEndpoints = () => {
    if (!importedSchema) {
      console.error('Please import a database schema first');
      return;
    }

    // Generate API endpoints based on imported schema
    const generatedEndpoints = importedSchema.entities.map(entity => ({
      id: `endpoint-${entity.id}`,
      name: entity.name,
      path: `/api/${entity.name}`,
      method: 'GET',
      description: `Retrieve ${entity.name} data`,
      entity: entity
    }));

    // Add to workflow nodes
    const newNodes = generatedEndpoints.map((endpoint, index) => ({
      id: endpoint.id,
      type: 'api-endpoint',
      name: endpoint.name,
      position: { x: 600 + (index * 200), y: 100 + (index * 100) },
      data: endpoint,
      connections: []
    }));

    setWorkflowNodes(prev => [...prev, ...newNodes]);
    console.log(`Generated ${generatedEndpoints.length} API endpoints from database schema!`);
  };

  const handleGraphQLConfigSave = (config) => {
    setGraphqlConfig(config);
    setGraphqlConfigOpen(false);
    
    if (currentProject) {
      // Save to project metadata
      const updatedProject = {
        ...currentProject,
        metadata: {
          ...currentProject.metadata,
          graphql: config
        }
      };
      updateProject(updatedProject);
      console.log('GraphQL configuration saved successfully!');
    }
  };

  const handleBusinessLogicSave = (config) => {
    setBusinessLogicConfig(config);
    if (currentProject) {
      // Save to project metadata
      const updatedProject = {
        ...currentProject,
        metadata: {
          ...currentProject.metadata,
          businessLogic: config
        }
      };
      updateProject(updatedProject);
      console.log('Business logic configuration saved!');
    }
  };

  const handleGenerateCode = () => {
    if (!currentProject) {
      console.error('Please select a project first');
      return;
    }

    if (workflowNodes.length === 0) {
      console.error('Please add some nodes to your workflow first');
      return;
    }

    setShowAIAgent(true);
    console.log('Starting AI code generation...');
  };

  const handleAIGenerationComplete = () => {
    setShowAIAgent(false);
    console.log('Code generation completed successfully!');
    
    // Show code editor with generated code
    setShowCodeEditor(true);
  };

  const handleOpenCodeEditor = () => {
    setShowCodeEditor(true);
    console.log('Code editor opened');
  };

  const handleCloseCodeEditor = () => {
    setShowCodeEditor(false);
    console.log('Code editor closed');
  };

  const handleConnectionCreate = (connection) => {
    // Update the source node with the new connection
    const updatedNodes = workflowNodes.map(node => {
      if (node.id === connection.from) {
        return {
          ...node,
          connections: [...(node.connections || []), { to: connection.to, type: connection.type }]
        };
      }
      return node;
    });
    
    setWorkflowNodes(updatedNodes);
    console.log(`Connected ${connection.from} to ${connection.to}`);
  };

  const handleConnectionRemove = (fromNodeId, toNodeId) => {
    const updatedNodes = workflowNodes.map(node => {
      if (node.id === fromNodeId) {
        return {
          ...node,
          connections: (node.connections || []).filter(conn => conn.to !== toNodeId)
        };
      }
      return node;
    });
    
    setWorkflowNodes(updatedNodes);
    console.log(`Removed connection from ${fromNodeId} to ${toNodeId}`);
  };

  const handleOpenDatabaseExport = () => {
    setDatabaseExportOpen(true);
    console.log('Database export panel opened');
  };

  const handleOpenDatabaseSchema = () => {
    setDatabaseSchemaOpen(true);
    console.log('Database schema panel opened');
  };

  const handleOpenGraphQLConfig = () => {
    setGraphqlConfigOpen(true);
    console.log('GraphQL configuration panel opened');
  };

  const handleOpenBusinessLogic = () => {
    setBusinessLogicOpen(true);
    console.log('Business logic panel opened');
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onToggle={handleToggleSidebar}
        onClose={handleCloseSidebar}
        currentUser={mockUser}
        currentProject={currentProject}
      />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        sidebarCollapsed ? 'ml-16' : 'ml-64'
      }`}>
        {/* Header */}
        <Header
          currentUser={mockUser}
          currentProject={currentProject}
          onProjectChange={handleProjectChange}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={handleToggleSidebar}
        />

        {/* Page Content */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full flex">
            {/* Component Library */}
            <div className={`${libraryCollapsed ? 'w-16' : 'w-64'} transition-all duration-300 border-r border-border flex-shrink-0`}>
              <ComponentLibrary
                onDragStart={handleDragStart}
                onAddNode={handleAddNode}
                isCollapsed={libraryCollapsed}
              />
            </div>

            {/* Workflow Canvas */}
            <div className="flex-1 flex flex-col">
              {/* Toolbar */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={() => setLibraryCollapsed(!libraryCollapsed)}
                    variant="outline"
                    size="sm"
                  >
                    <Icon name="Plus" size={16} className="mr-2" />
                    Add Component
                  </Button>
                  <Button
                    onClick={() => setShowProjectManager(true)}
                    variant="outline"
                    size="sm"
                  >
                    <Icon name="Folder" size={16} className="mr-2" />
                    Projects
                  </Button>
                  <Button
                    onClick={handleOpenDatabaseExport}
                    variant="outline"
                    size="sm"
                  >
                    <Icon name="Database" size={16} className="mr-2" />
                    Database Export
                  </Button>
                  <Button
                    onClick={handleOpenDatabaseSchema}
                    variant="outline"
                    size="sm"
                  >
                    <Icon name="Table" size={16} className="mr-2" />
                    Import Schema
                  </Button>
                  <Button
                    onClick={handleOpenGraphQLConfig}
                    variant="outline"
                    size="sm"
                  >
                    <Icon name="Network" size={16} className="mr-2" />
                    GraphQL Config
                  </Button>
                  <Button
                    onClick={handleOpenBusinessLogic}
                    variant="outline"
                    size="sm"
                  >
                    <Icon name="Briefcase" size={16} className="mr-2" />
                    Business Logic
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={handleGenerateCode}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    size="sm"
                  >
                    <Icon name="Code" size={16} className="mr-2" />
                    Generate Code
                  </Button>
                </div>
              </div>

              {/* Canvas Area */}
              <div className="flex-1 relative overflow-hidden">
                <WorkflowCanvas
                  onNodeSelect={handleNodeSelect}
                  selectedNode={selectedNode}
                  onNodesChange={handleWorkflowChange}
                  nodes={workflowNodes}
                  onConnectionCreate={handleConnectionCreate}
                  onNodeRemove={handleNodeRemove}
                  onConnectionRemove={handleConnectionRemove}
                />
              </div>
            </div>

            {/* Inspector Panel */}
            <div className={`${inspectorCollapsed ? 'w-16' : 'w-80'} transition-all duration-300 border-l border-border flex-shrink-0`}>
              <InspectorPanel
                selectedNode={selectedNode}
                onNodeUpdate={handleNodeUpdate}
                isCollapsed={inspectorCollapsed}
              />
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="h-8 bg-surface border-t border-border flex items-center justify-between px-4 text-xs text-muted-foreground">
          <div className="flex items-center space-x-4">
            <span>Project: {currentProject?.name || 'No project selected'}</span>
            <span>•</span>
            <span>Nodes: {workflowNodes?.length}</span>
            <span>•</span>
            <span>Framework: {currentProject?.metadata?.framework || 'Express.js'}</span>
            {importedSchema && (
              <>
                <span>•</span>
                <span className="text-primary">DB Schema: {importedSchema.entities.length} entities</span>
              </>
            )}
            {graphqlConfig && (
              <>
                <span>•</span>
                <span className="text-purple-500">GraphQL: {graphqlConfig.entities.length} entities</span>
              </>
            )}
            {businessLogicConfig && (
              <>
                <span>•</span>
                <span className="text-green-500">Business Logic: {businessLogicConfig.entities.length} entities</span>
              </>
            )}
            <span>•</span>
            <span className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span>Connected</span>
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              onClick={handleOpenDatabaseExport}
              variant="ghost"
              size="sm"
              className={`text-xs py-1 px-2 h-6 ${
                databaseExportOpen ? 'bg-primary text-primary-foreground' : ''
              }`}
            >
              <Icon name="Database" size={12} className="mr-1" />
              DB Export
            </Button>
            <Button
              onClick={handleOpenDatabaseSchema}
              variant="ghost"
              size="sm"
              className={`text-xs py-1 px-2 h-6 ${
                databaseSchemaOpen ? 'bg-primary text-primary-foreground' : ''
              }`}
            >
              <Icon name="GitBranch" size={12} className="mr-1" />
              DB Import
            </Button>
            <Button
              onClick={handleOpenGraphQLConfig}
              variant="ghost"
              size="sm"
              className={`text-xs py-1 px-2 h-6 ${
                graphqlConfigOpen ? 'bg-primary text-primary-foreground' : ''
              }`}
            >
              <Icon name="Network" size={12} className="mr-1" />
              GraphQL
            </Button>
            <Button
              onClick={handleOpenBusinessLogic}
              variant="ghost"
              size="sm"
              className={`text-xs py-1 px-2 h-6 ${
                businessLogicOpen ? 'bg-primary text-primary-foreground' : ''
              }`}
            >
              <Icon name="Briefcase" size={12} className="mr-1" />
              Business Logic
            </Button>
            <Button
              onClick={handleGenerateCode}
              variant="ghost"
              size="sm"
              className="text-xs py-1 px-2 h-6 bg-primary text-primary-foreground"
            >
              <Icon name="Code" size={12} className="mr-1" />
              Generate Code
            </Button>
            <span>Last saved: 2 minutes ago</span>
            <span>•</span>
            <span>Auto-save: On</span>
          </div>
        </div>
      </div>

      {/* Quick Actions Menu */}
      <div className="fixed bottom-6 right-6 z-40">
        <div className="flex flex-col space-y-3">
          <Button
            onClick={handleOpenDatabaseExport}
            className="w-12 h-12 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 text-white"
            title="Database Export"
          >
            <Icon name="Database" size={20} />
          </Button>
          
          <Button
            onClick={handleOpenDatabaseSchema}
            className="w-12 h-12 rounded-full shadow-lg bg-green-600 hover:bg-green-700 text-white"
            title="Import Database Schema"
          >
            <Icon name="Import" size={20} />
          </Button>
          
          <Button
            onClick={handleOpenGraphQLConfig}
            className="w-12 h-12 rounded-full shadow-lg bg-purple-600 hover:bg-purple-700 text-white"
            title="GraphQL Configuration"
          >
            <Icon name="Code" size={20} />
          </Button>
          
          <Button
            onClick={handleOpenBusinessLogic}
            className="w-12 h-12 rounded-full shadow-lg bg-orange-600 hover:bg-orange-700 text-white"
            title="Business Logic"
          >
            <Icon name="Settings" size={20} />
          </Button>
          
          <Button
            onClick={handleGenerateCode}
            className="w-12 h-12 rounded-full shadow-lg bg-primary hover:bg-primary/90 text-white"
            title="Generate Code"
          >
            <Icon name="Zap" size={20} />
          </Button>
        </div>
      </div>

      {/* Database Export Panel */}
      {databaseExportOpen && (
        <div className="fixed bottom-24 right-6 w-80 bg-popover border border-border rounded-lg shadow-elevation-2 z-40 p-4">
          <DatabaseExport 
            onExport={handleDatabaseExport}
            className="max-h-96 overflow-y-auto"
          />
        </div>
      )}

      {/* Database Schema Import Panel */}
      {databaseSchemaOpen && (
        <div className="fixed bottom-24 right-6 w-80 bg-popover border border-border rounded-lg shadow-elevation-2 z-40 p-4">
          <DatabaseSchemaPanel 
            onImportSchema={handleImportSchema}
            onGenerateEndpoints={handleGenerateEndpoints}
            className="max-h-96 overflow-y-auto"
          />
        </div>
      )}

      {/* GraphQL Configuration Panel */}
      {graphqlConfigOpen && (
        <div className="fixed bottom-24 right-6 w-80 bg-popover border border-border rounded-lg shadow-elevation-2 z-40 p-4">
          <GraphQLConfigPanel 
            onSave={handleGraphQLConfigSave}
            className="max-h-96 overflow-y-auto"
          />
        </div>
      )}

      {/* Business Logic Configuration Panel */}
      {businessLogicOpen && (
        <div className="fixed bottom-24 right-6 w-80 bg-popover border border-border rounded-lg shadow-elevation-2 z-40 p-4">
          <BusinessLogicPanel 
            onSave={handleBusinessLogicSave}
            className="max-h-96 overflow-y-auto"
          />
        </div>
      )}

      {/* Project Manager Modal */}
      <ProjectManager
        projects={projects}
        currentProject={currentProject}
        onCreateProject={handleCreateProject}
        onUpdateProject={handleUpdateProject}
        onDeleteProject={handleDeleteProject}
        onDuplicateProject={handleDuplicateProject}
        onProjectSelect={handleProjectChange}
        isOpen={showProjectManager}
        onClose={() => setShowProjectManager(false)}
      />

      {/* Code Editor */}
      <CodeEditor
        isOpen={showCodeEditor}
        onClose={handleCloseCodeEditor}
        selectedNode={selectedNode}
        workflowNodes={workflowNodes}
        currentProject={currentProject}
        generatedFiles={generatedFiles}
      />

      {/* AI Agent Effect */}
      <AIAgentEffect
        isActive={showAIAgent}
        onComplete={handleAIGenerationComplete}
        projectName={currentProject?.name || 'Project'}
        workflowNodes={workflowNodes}
        currentProject={currentProject}
        onFilesGenerated={setGeneratedFiles}
      />
    </div>
  );
};

export default APIDesigner;