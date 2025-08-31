import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProjectContext } from '../../contexts/ProjectContext';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import CanvasToolbar from '../../components/ui/CanvasToolbar';
import SchemaExplorer from './components/SchemaExplorer';
import CanvasWorkspace from './components/CanvasWorkspace';
import PropertyInspector from './components/PropertyInspector';
import CollaborationIndicators from './components/CollaborationIndicators';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const SchemaCanvasDesigner = () => {
  const navigate = useNavigate();
  const { 
    currentProject, 
    getCurrentProjectSchema, 
    updateProjectSchema 
  } = useProjectContext();
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [explorerCollapsed, setExplorerCollapsed] = useState(false);
  const [inspectorCollapsed, setInspectorCollapsed] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [entities, setEntities] = useState([]);
  const [connections, setConnections] = useState([]);
  const [connectionMode, setConnectionMode] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [saveStatus, setSaveStatus] = useState('saved');

  // Load project schema when project changes
  useEffect(() => {
    if (currentProject) {
      const projectSchema = getCurrentProjectSchema();
      setEntities(projectSchema.entities || []);
      setConnections(projectSchema.connections || []);
      setSelectedEntity(null);
      setSelectedConnection(null);
      setHistory([]);
      setHistoryIndex(-1);
      setSaveStatus('saved');
    }
  }, [currentProject, getCurrentProjectSchema]);

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
    updateProjectSchema(entities, connections);
    
    // Simulate save operation
    setTimeout(() => {
      setSaveStatus('saved');
    }, 1000);
  }, [currentProject, entities, connections, updateProjectSchema]);

  const handleEntitySelect = useCallback((entity) => {
    setSelectedEntity(entity);
    setSelectedConnection(null);
  }, []);

  const handleConnectionSelect = useCallback((connection) => {
    setSelectedConnection(connection);
    setSelectedEntity(null);
  }, []);

  const handleEntityAdd = useCallback((entity) => {
    const newEntity = {
      ...entity,
      id: entity?.id || `entity-${Date.now()}`,
      position: entity?.position || { x: 200, y: 200 }
    };
    
    setEntities(prev => [...prev, newEntity]);
    setSaveStatus('unsaved');
    
    // Add to history
    setHistory(prev => [...prev?.slice(0, historyIndex + 1), { type: 'add-entity', entity: newEntity }]);
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  const handleEntityUpdate = useCallback((updatedEntity) => {
    setEntities(prev => prev?.map(entity => 
      entity?.id === updatedEntity?.id ? updatedEntity : entity
    ));
    setSaveStatus('unsaved');
  }, []);

  const handleEntityMove = useCallback((entityId, newPosition) => {
    setEntities(prev => prev?.map(entity => 
      entity?.id === entityId ? { ...entity, position: newPosition } : entity
    ));
    setSaveStatus('unsaved');
  }, []);

  const handleConnectionCreate = useCallback((connection) => {
    // connection is now a complete connection object instead of from/to entities
    setConnections(prev => [...prev, connection]);
    setConnectionMode(false);
    setSaveStatus('unsaved');
    
    // Add to history
    setHistory(prev => [...prev?.slice(0, historyIndex + 1), { type: 'add-connection', connection }]);
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  const handleConnectionUpdate = useCallback((updatedConnection) => {
    setConnections(prev => prev?.map(conn => 
      conn?.id === updatedConnection?.id ? updatedConnection : conn
    ));
    setSaveStatus('unsaved');
  }, []);

  const handleUndo = useCallback(() => {
    if (historyIndex >= 0) {
      const action = history?.[historyIndex];
      if (action?.type === 'add-entity') {
        setEntities(prev => prev?.filter(e => e?.id !== action?.entity?.id));
      } else if (action?.type === 'add-connection') {
        setConnections(prev => prev?.filter(c => c?.id !== action?.connection?.id));
      }
      setHistoryIndex(prev => prev - 1);
      setSaveStatus('unsaved');
    }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history?.length - 1) {
      const action = history?.[historyIndex + 1];
      if (action?.type === 'add-entity') {
        setEntities(prev => [...prev, action?.entity]);
      } else if (action?.type === 'add-connection') {
        setConnections(prev => [...prev, action?.connection]);
      }
      setHistoryIndex(prev => prev + 1);
      setSaveStatus('unsaved');
    }
  }, [history, historyIndex]);

  const handleAlignEntities = useCallback(() => {
    // Simple grid alignment
    setEntities(prev => prev?.map((entity, index) => ({
      ...entity,
      position: {
        x: 100 + (index % 4) * 350,
        y: 100 + Math.floor(index / 4) * 250
      }
    })));
    setSaveStatus('unsaved');
  }, []);

  const handleExport = () => {
    navigate('/code-generation-export');
  };

  const handleDatabaseConnection = () => {
    navigate('/database-connection-manager');
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
          <Icon name="Database" size={64} className="mx-auto mb-4 text-text-secondary opacity-50" />
          <h2 className="text-xl font-semibold text-text-primary mb-2">No Project Selected</h2>
          <p className="text-text-secondary">Please select a project from the header to view its schema.</p>
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
          
          {/* Schema Explorer */}
          <div className={`transition-all duration-300 ${explorerCollapsed ? 'w-0' : 'w-80'} hidden lg:block`}>
            <SchemaExplorer
              entities={entities}
              onEntitySelect={handleEntitySelect}
              onEntityDrag={handleEntityAdd}
              selectedEntityId={selectedEntity?.id}
              isCollapsed={explorerCollapsed}
              onToggleCollapse={() => setExplorerCollapsed(!explorerCollapsed)}
            />
          </div>

          {/* Canvas Area */}
          <div className="flex-1 flex flex-col relative">
            
            {/* Project Header */}
            <div className="bg-surface border-b border-border px-6 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div>
                  <h1 className="text-lg font-semibold text-text-primary">{currentProject?.name}</h1>
                  <div className="flex items-center space-x-4 text-sm text-text-secondary">
                    <span>{entities?.length} entities</span>
                    <span>{connections?.length} connections</span>
                    <span>Database: {currentProject?.databaseType}</span>
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
                  onClick={handleDatabaseConnection}
                >
                  Connect DB
                </Button>
                
                <Button
                  variant="default"
                  size="sm"
                  iconName="Download"
                  iconPosition="left"
                  onClick={handleExport}
                >
                  Export
                </Button>

                {/* Panel Toggles */}
                <div className="flex items-center space-x-1 border-l border-border pl-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="PanelLeft"
                    iconSize={16}
                    onClick={() => setExplorerCollapsed(!explorerCollapsed)}
                    className={explorerCollapsed ? 'text-text-secondary' : 'text-primary'}
                    title="Toggle Schema Explorer"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="PanelRight"
                    iconSize={16}
                    onClick={() => setInspectorCollapsed(!inspectorCollapsed)}
                    className={inspectorCollapsed ? 'text-text-secondary' : 'text-primary'}
                    title="Toggle Property Inspector"
                  />
                </div>
              </div>
            </div>

            {/* Canvas */}
            <CanvasWorkspace
              entities={entities}
              connections={connections}
              onEntitySelect={handleEntitySelect}
              onEntityMove={handleEntityMove}
              onEntityUpdate={handleEntityUpdate}
              onEntityAdd={handleEntityAdd}
              onConnectionCreate={handleConnectionCreate}
              selectedEntityId={selectedEntity?.id}
              showGrid={showGrid}
              connectionMode={connectionMode}
            />

            {/* Canvas Toolbar */}
            <CanvasToolbar
              onAddEntity={() => handleEntityAdd({
                name: 'new_entity',
                type: 'table',
                fields: [{ name: 'id', type: 'bigint', primaryKey: true }]
              })}
              onToggleConnectionMode={() => setConnectionMode(!connectionMode)}
              onAlignEntities={handleAlignEntities}
              onUndo={handleUndo}
              onRedo={handleRedo}
              onZoomIn={() => {}}
              onZoomOut={() => {}}
              onZoomFit={() => {}}
              onToggleGrid={() => setShowGrid(!showGrid)}
              connectionMode={connectionMode}
              canUndo={historyIndex >= 0}
              canRedo={historyIndex < history?.length - 1}
              showGrid={showGrid}
            />
          </div>

          {/* Property Inspector */}
          <div className={`transition-all duration-300 ${inspectorCollapsed ? 'w-0' : 'w-80'} hidden lg:block`}>
            <PropertyInspector
              selectedEntity={selectedEntity}
              selectedConnection={selectedConnection}
              onEntityUpdate={handleEntityUpdate}
              onConnectionUpdate={handleConnectionUpdate}
              onClose={() => {
                setSelectedEntity(null);
                setSelectedConnection(null);
              }}
              isCollapsed={inspectorCollapsed}
            />
          </div>
        </div>
      </div>
      {/* Collaboration Indicators */}
      <CollaborationIndicators />
      {/* Mobile Bottom Navigation Spacer */}
      <div className="h-16 md:hidden" />
      {/* Keyboard Shortcuts */}
      <div className="sr-only">
        <div>Keyboard shortcuts:</div>
        <div>Ctrl+S: Save</div>
        <div>Ctrl+Z: Undo</div>
        <div>Ctrl+Y: Redo</div>
        <div>Ctrl+A: Select All</div>
        <div>Delete: Delete Selected</div>
        <div>Space: Pan Mode</div>
        <div>Ctrl++: Zoom In</div>
        <div>Ctrl+-: Zoom Out</div>
        <div>Ctrl+0: Fit to Screen</div>
      </div>
    </div>
  );
};

export default SchemaCanvasDesigner;