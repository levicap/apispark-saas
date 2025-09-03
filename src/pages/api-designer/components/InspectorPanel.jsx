import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const InspectorPanel = ({ selectedNode, onNodeUpdate, onNodeDelete, isCollapsed = false }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [codePreview, setCodePreview] = useState('');
  const [editingParam, setEditingParam] = useState(null);
  const [showAddParam, setShowAddParam] = useState(false);
  const [newParam, setNewParam] = useState({ name: '', type: 'string', required: false, description: '', in: 'query' });
  
  // Draggable and resizable state
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 320, y: 100 });
  const [size, setSize] = useState({ width: 320, height: 600 });
  const [isMinimized, setIsMinimized] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const panelRef = useRef(null);
  const dragHandleRef = useRef(null);
  const resizeHandleRef = useRef(null);

  // Mouse event handlers for dragging and resizing
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        setPosition({
          x: Math.max(0, Math.min(window.innerWidth - size.width, newX)),
          y: Math.max(0, Math.min(window.innerHeight - size.height, newY))
        });
      }
      if (isResizing) {
        const rect = panelRef.current.getBoundingClientRect();
        const newWidth = Math.max(250, e.clientX - rect.left);
        const newHeight = Math.max(300, e.clientY - rect.top);
        setSize({ width: newWidth, height: newHeight });
        
        // Auto-minimize when width gets too small
        if (newWidth < 280) {
          setIsMinimized(true);
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = isDragging ? 'grabbing' : 'nw-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, isResizing, dragOffset, size]);

  const handleDragStart = (e) => {
    const rect = panelRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsDragging(true);
  };

  const handleResizeStart = (e) => {
    e.stopPropagation();
    setIsResizing(true);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
    if (!isMinimized) {
      setSize({ width: 60, height: 60 });
    } else {
      setSize({ width: 320, height: 600 });
    }
  };

  const tabs = [
    { id: 'general', name: 'General', icon: 'Settings' },
    { id: 'parameters', name: 'Parameters', icon: 'Sliders' },
    { id: 'schema', name: 'Schema', icon: 'Braces' },
    { id: 'security', name: 'Security', icon: 'Shield' },
    { id: 'code', name: 'Code', icon: 'Code' }
  ];

  const httpMethods = [
    { value: 'GET', label: 'GET' },
    { value: 'POST', label: 'POST' },
    { value: 'PUT', label: 'PUT' },
    { value: 'PATCH', label: 'PATCH' },
    { value: 'DELETE', label: 'DELETE' }
  ];

  const getNodeType = () => {
    if (selectedNode?.data?.graphqlType) return 'graphql';
    if (selectedNode?.data?.microserviceType) return 'microservice';
    if (selectedNode?.data?.databaseType) return 'database';
    return 'http';
  };

  const handleFieldUpdate = (field, value) => {
    if (!selectedNode || !onNodeUpdate) return;

    const updatedNode = {
      ...selectedNode,
      data: {
        ...selectedNode?.data,
        [field]: value
      }
    };

    onNodeUpdate(updatedNode);
  };

  const renderGeneralTab = () => {
    const nodeType = getNodeType();
    
    return (
      <div className="p-4 space-y-4">
        <Input
          label="Component Name"
          value={selectedNode?.name || ''}
          onChange={(e) => {
            const updatedNode = { ...selectedNode, name: e.target.value };
            if (onNodeUpdate) onNodeUpdate(updatedNode);
          }}
          placeholder="Enter component name"
        />
        
        <Input
          label="Component ID"
          value={selectedNode?.id || ''}
          disabled
          className="bg-muted text-muted-foreground"
          placeholder="Auto-generated ID"
        />

        <Input
          label="Description"
          value={selectedNode?.data?.description || ''}
          onChange={(e) => handleFieldUpdate('description', e.target.value)}
          placeholder="Describe what this component does"
        />
        
        {/* General Parameters Section - Enhanced */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Icon name="Settings" size={16} className="text-primary" />
            <label className="text-sm font-semibold text-foreground">General Parameters</label>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {/* Timeout Setting */}
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-sm font-medium text-foreground">Request Timeout</span>
                  <p className="text-xs text-muted-foreground">Maximum request duration (seconds)</p>
                </div>
                <Input
                  type="number"
                  value={selectedNode?.data?.timeout || 30}
                  onChange={(e) => handleFieldUpdate('timeout', parseInt(e.target.value) || 30)}
                  className="w-20 text-center"
                  placeholder="30"
                  min="1"
                  max="300"
                />
              </div>
            </div>
            
            {/* Retry Count */}
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-sm font-medium text-foreground">Retry Attempts</span>
                  <p className="text-xs text-muted-foreground">Failed request retries</p>
                </div>
                <Input
                  type="number"
                  value={selectedNode?.data?.retries || 0}
                  onChange={(e) => handleFieldUpdate('retries', parseInt(e.target.value) || 0)}
                  className="w-20 text-center"
                  placeholder="0"
                  min="0"
                  max="10"
                />
              </div>
            </div>
            
            {/* Cache Duration */}
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-sm font-medium text-foreground">Cache Duration</span>
                  <p className="text-xs text-muted-foreground">Response cache time (seconds)</p>
                </div>
                <Input
                  type="number"
                  value={selectedNode?.data?.cacheDuration || 0}
                  onChange={(e) => handleFieldUpdate('cacheDuration', parseInt(e.target.value) || 0)}
                  className="w-20 text-center"
                  placeholder="0"
                  min="0"
                  max="3600"
                />
              </div>
            </div>
            
            {/* Rate Limit */}
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-sm font-medium text-foreground">Rate Limit</span>
                  <p className="text-xs text-muted-foreground">Requests per minute</p>
                </div>
                <Input
                  type="number"
                  value={selectedNode?.data?.rateLimit || 0}
                  onChange={(e) => handleFieldUpdate('rateLimit', parseInt(e.target.value) || 0)}
                  className="w-20 text-center"
                  placeholder="0"
                  min="0"
                  max="10000"
                />
              </div>
            </div>
            
            {/* Content Type */}
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Content Type</label>
                <Select
                  options={[
                    { value: 'application/json', label: 'JSON' },
                    { value: 'application/xml', label: 'XML' },
                    { value: 'application/x-www-form-urlencoded', label: 'Form Data' },
                    { value: 'multipart/form-data', label: 'Multipart' },
                    { value: 'text/plain', label: 'Plain Text' },
                    { value: 'text/html', label: 'HTML' }
                  ]}
                  value={selectedNode?.data?.contentType || 'application/json'}
                  onChange={(value) => handleFieldUpdate('contentType', value)}
                />
              </div>
            </div>
            
            {/* HTTP Version */}
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">HTTP Version</label>
                <Select
                  options={[
                    { value: '1.1', label: 'HTTP/1.1' },
                    { value: '2', label: 'HTTP/2' },
                    { value: '3', label: 'HTTP/3' }
                  ]}
                  value={selectedNode?.data?.httpVersion || '1.1'}
                  onChange={(value) => handleFieldUpdate('httpVersion', value)}
                />
              </div>
            </div>
            
            {/* Compression */}
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Compression</label>
                <Select
                  options={[
                    { value: 'none', label: 'None' },
                    { value: 'gzip', label: 'Gzip' },
                    { value: 'deflate', label: 'Deflate' },
                    { value: 'br', label: 'Brotli' }
                  ]}
                  value={selectedNode?.data?.compression || 'none'}
                  onChange={(value) => handleFieldUpdate('compression', value)}
                />
              </div>
            </div>
            
            {/* Performance Monitoring */}
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Performance Monitoring</label>
                
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedNode?.data?.enableMetrics || false}
                    onChange={(e) => handleFieldUpdate('enableMetrics', e.target.checked)}
                    className="rounded border-border"
                  />
                  <span className="text-sm text-foreground">Enable Metrics Collection</span>
                </label>
                
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedNode?.data?.enableTracing || false}
                    onChange={(e) => handleFieldUpdate('enableTracing', e.target.checked)}
                    className="rounded border-border"
                  />
                  <span className="text-sm text-foreground">Enable Request Tracing</span>
                </label>
                
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedNode?.data?.enableLogging || false}
                    onChange={(e) => handleFieldUpdate('enableLogging', e.target.checked)}
                    className="rounded border-border"
                  />
                  <span className="text-sm text-foreground">Enable Request Logging</span>
                </label>
              </div>
            </div>
            
            {/* Load Balancing */}
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Load Balancing Strategy</label>
                <Select
                  options={[
                    { value: 'round-robin', label: 'Round Robin' },
                    { value: 'least-connections', label: 'Least Connections' },
                    { value: 'ip-hash', label: 'IP Hash' },
                    { value: 'weighted', label: 'Weighted' }
                  ]}
                  value={selectedNode?.data?.loadBalancingStrategy || 'round-robin'}
                  onChange={(value) => handleFieldUpdate('loadBalancingStrategy', value)}
                />
              </div>
            </div>
            
            {/* Priority Level */}
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Priority Level</label>
                <Select
                  options={[
                    { value: 'low', label: 'Low Priority' },
                    { value: 'normal', label: 'Normal Priority' },
                    { value: 'high', label: 'High Priority' },
                    { value: 'critical', label: 'Critical Priority' }
                  ]}
                  value={selectedNode?.data?.priority || 'normal'}
                  onChange={(value) => handleFieldUpdate('priority', value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isCollapsed) {
    return null; // Don't render anything when collapsed from parent
  }

  if (!selectedNode) {
    return (
      <div 
        ref={panelRef}
        className="fixed bg-surface border border-border rounded-lg shadow-2xl z-50 flex items-center justify-center"
        style={{
          left: position.x,
          top: position.y,
          width: 300,
          height: 200
        }}
      >
        <div className="text-center max-w-xs px-4">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="MousePointer" size={32} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            Select a Component
          </h3>
          <p className="text-sm text-muted-foreground">
            Click on any component in the canvas to view and edit its properties.
          </p>
        </div>
        
        {/* Drag Handle for empty state */}
        <div 
          ref={dragHandleRef}
          onMouseDown={handleDragStart}
          className="absolute top-2 right-2 w-6 h-6 cursor-move hover:bg-muted rounded flex items-center justify-center"
        >
          <Icon name="Move" size={14} className="text-muted-foreground" />
        </div>
      </div>
    );
  }

  // Minimized state
  if (isMinimized) {
    return (
      <div 
        ref={panelRef}
        className="fixed bg-primary text-primary-foreground rounded-full shadow-2xl z-50 cursor-pointer flex items-center justify-center"
        style={{
          left: position.x,
          top: position.y,
          width: size.width,
          height: size.height
        }}
        onClick={toggleMinimize}
      >
        <Icon name="Settings" size={24} />
      </div>
    );
  }

  return (
    <div 
      ref={panelRef}
      className="fixed bg-surface border border-border rounded-lg shadow-2xl z-50 flex flex-col overflow-hidden"
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height
      }}
    >
      {/* Header with Drag Handle */}
      <div 
        ref={dragHandleRef}
        onMouseDown={handleDragStart}
        className="p-3 border-b border-border flex-shrink-0 cursor-move bg-muted/30 hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 ${selectedNode?.color} rounded-md flex items-center justify-center flex-shrink-0`}>
            <Icon name={selectedNode?.icon} size={16} color="white" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-semibold text-foreground truncate">
              {selectedNode?.name}
            </h2>
            <p className="text-xs text-muted-foreground truncate">
              {selectedNode?.data?.endpoint}
            </p>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={toggleMinimize}
              className="w-6 h-6 rounded hover:bg-background transition-colors flex items-center justify-center"
              title="Minimize Panel"
            >
              <Icon name="Minimize2" size={14} className="text-muted-foreground" />
            </button>
            <div className="flex items-center space-x-1 text-muted-foreground">
              <Icon name="Move" size={12} />
              <span className="text-xs">Drag</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-5 gap-1 bg-muted rounded-lg p-1 mt-3">
          {tabs?.map(tab => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex flex-col items-center justify-center px-1 py-2 text-xs font-medium rounded-md transition-smooth ${
                activeTab === tab?.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title={tab?.name}
            >
              <Icon name={tab?.icon} size={14} />
              <span className="mt-1 text-xs truncate">{tab?.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        {/* General Tab */}
        {activeTab === 'general' && renderGeneralTab()}
        
        {/* Parameters Tab */}
        {activeTab === 'parameters' && (
          <div className="p-4 space-y-4">
            <div className="text-center py-8 text-muted-foreground">
              <Icon name="Sliders" size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">Parameters configuration</p>
            </div>
          </div>
        )}

        {/* Schema Tab */}
        {activeTab === 'schema' && (
          <div className="p-4 space-y-4">
            <div className="text-center py-8 text-muted-foreground">
              <Icon name="Braces" size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">Schema definition</p>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="p-4 space-y-4">
            <div className="text-center py-8 text-muted-foreground">
              <Icon name="Shield" size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">Security configuration</p>
            </div>
          </div>
        )}

        {/* Code Tab */}
        {activeTab === 'code' && (
          <div className="p-4 space-y-4">
            <div className="text-center py-8 text-muted-foreground">
              <Icon name="Code" size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">Generated code preview</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Footer Actions */}
      <div className="p-3 border-t border-border flex-shrink-0">
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onNodeDelete && onNodeDelete(selectedNode?.id)}
          >
            <Icon name="Trash2" size={14} />
            Delete
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            className="flex-1"
            onClick={() => {
              console.log('Saving node changes:', selectedNode);
            }}
          >
            <Icon name="Save" size={14} />
            Save
          </Button>
        </div>
      </div>
      
      {/* Resize Handle */}
      <div 
        ref={resizeHandleRef}
        onMouseDown={handleResizeStart}
        className="absolute bottom-0 right-0 w-4 h-4 cursor-nw-resize bg-muted/50 hover:bg-muted transition-colors"
        style={{
          clipPath: 'polygon(100% 0, 0 100%, 100% 100%)'
        }}
      >
        <div className="absolute bottom-1 right-1">
          <Icon name="Maximize2" size={8} className="text-muted-foreground" />
        </div>
      </div>
    </div>
  );
};

export default InspectorPanel;