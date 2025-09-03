import React, { useState, useRef, useCallback, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WorkflowCanvas = ({ onNodeSelect, selectedNode, onNodesChange, nodes = [] }) => {
  const [zoom, setZoom] = useState(100);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);
  const [draggedNode, setDraggedNode] = useState(null);
  const [connections, setConnections] = useState([]);
  const [connectionMode, setConnectionMode] = useState(false);
  const [selectedConnectionPoint, setSelectedConnectionPoint] = useState(null);
  const canvasRef = useRef(null);
  const [draggingNodeId, setDraggingNodeId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Load connections from nodes
  useEffect(() => {
    const allConnections = [];
    nodes.forEach(node => {
      if (node.connections) {
        node.connections.forEach(conn => {
          allConnections.push({
            id: `${node.id}_${conn.targetId}`,
            sourceId: node.id,
            targetId: conn.targetId,
            type: conn.type || 'default'
          });
        });
      }
    });
    setConnections(allConnections);
  }, [nodes]);

  const handleDrop = useCallback((e) => {
    e?.preventDefault();
    const rect = canvasRef?.current?.getBoundingClientRect();
    const x = (e?.clientX - rect?.left - pan?.x) / (zoom / 100);
    const y = (e?.clientY - rect?.top - pan?.y) / (zoom / 100);

    try {
      const componentData = JSON.parse(e?.dataTransfer?.getData('application/json'));
      const newNode = {
        id: `node_${Date.now()}`,
        type: componentData?.id,
        name: componentData?.name,
        color: componentData?.color,
        icon: componentData?.icon,
        position: { x, y },
        data: {
          method: componentData?.name,
          endpoint: componentData?.id === 'get' ? '/api/users' : 
                   componentData?.id === 'post' ? '/api/users' :
                   componentData?.id === 'put' ? '/api/users/:id' :
                   componentData?.id === 'patch' ? '/api/users/:id' :
                   componentData?.id === 'delete' ? '/api/users/:id' :
                   componentData?.id === 'query' ? 'query { users }' :
                   componentData?.id === 'mutation' ? 'mutation { createUser }' :
                   componentData?.id === 'subscription' ? 'subscription { userUpdates }' :
                   componentData?.id === 'service' ? '/api/service' :
                   componentData?.id === 'gateway' ? '/api/gateway' :
                   componentData?.id === 'loadbalancer' ? '/api/loadbalancer' :
                   componentData?.id === 'table' ? '/api/table' :
                   componentData?.id === 'view' ? '/api/view' :
                   componentData?.id === 'storedprocedure' ? '/api/storedprocedure' :
                   '/api/endpoint',
          description: componentData?.description,
          parameters: [],
          responses: {},
          // Add specific data for different node types
          graphqlType: componentData?.id === 'query' || componentData?.id === 'mutation' || componentData?.id === 'subscription' ? componentData?.id : null,
          microserviceType: componentData?.id === 'service' || componentData?.id === 'gateway' || componentData?.id === 'loadbalancer' ? componentData?.id : null,
          databaseType: componentData?.id === 'table' || componentData?.id === 'view' || componentData?.id === 'storedprocedure' ? componentData?.id : null
        },
        connections: []
      };

      const updatedNodes = [...nodes, newNode];
      if (onNodesChange) {
        onNodesChange(updatedNodes);
      }
    } catch (error) {
      console.error('Error parsing dropped data:', error);
    }
  }, [nodes, onNodesChange, pan, zoom]);

  const handleDragOver = useCallback((e) => {
    e?.preventDefault();
  }, []);

  const handleMouseDown = (e) => {
    if (e?.target === canvasRef?.current) {
      setIsDragging(true);
      setDragStart({ x: e?.clientX - pan?.x, y: e?.clientY - pan?.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPan({
        x: e?.clientX - dragStart?.x,
        y: e?.clientY - dragStart?.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 25));
  };

  const handleResetView = () => {
    setZoom(100);
    setPan({ x: 0, y: 0 });
  };

  const handleNodeClick = (node) => {
    if (onNodeSelect) {
      onNodeSelect(node);
    }
  };
  
  const startNodeDrag = (e, node) => {
    e.stopPropagation();
    e.preventDefault();
    
    // Only start dragging if it's a left mouse button click and not on a connection point
    if (e.button !== 0 || e.target.classList.contains('connection-point')) return;
    
    setDraggingNodeId(node.id);
    
    // Calculate offset considering canvas position
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - canvasRect.left;
    const mouseY = e.clientY - canvasRect.top;
    
    // Convert to canvas coordinates considering pan and zoom
    const canvasX = (mouseX - pan.x) / (zoom / 100);
    const canvasY = (mouseY - pan.y) / (zoom / 100);
    
    setDragOffset({
      x: canvasX - node.position.x,
      y: canvasY - node.position.y
    });
    
    console.log("Starting node drag", node.id, {
      mouse: { x: mouseX, y: mouseY },
      canvas: { x: canvasX, y: canvasY },
      nodePos: node.position,
      offset: { x: canvasX - node.position.x, y: canvasY - node.position.y }
    });
  };
  
  const handleDocumentMouseMove = useCallback((e) => {
    if (!draggingNodeId || !canvasRef.current) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    // Calculate position considering canvas position
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - canvasRect.left;
    const mouseY = e.clientY - canvasRect.top;
    
    // Convert to canvas coordinates considering pan and zoom
    const canvasX = (mouseX - pan.x) / (zoom / 100);
    const canvasY = (mouseY - pan.y) / (zoom / 100);
    
    const updatedNodes = nodes.map(node => {
      if (node.id === draggingNodeId) {
        return {
          ...node,
          position: {
            x: Math.max(0, canvasX - dragOffset.x), // Prevent negative positions
            y: Math.max(0, canvasY - dragOffset.y)
          }
        };
      }
      return node;
    });
    
    if (onNodesChange) {
      onNodesChange(updatedNodes);
    }
  }, [draggingNodeId, dragOffset, nodes, onNodesChange, pan, zoom]);
  
  const handleDocumentMouseUp = useCallback(() => {
    if (draggingNodeId) {
      console.log("Ending drag for node:", draggingNodeId);
      setDraggingNodeId(null);
      setDraggedNode(null);
      
      // Remove event listeners
      document.removeEventListener('mousemove', handleDocumentMouseMove);
      document.removeEventListener('mouseup', handleDocumentMouseUp);
    }
  }, [draggingNodeId, handleDocumentMouseMove]);
  

  // Add/remove document event listeners when dragging starts/stops
  useEffect(() => {
    if (draggingNodeId) {
      document.addEventListener('mousemove', handleDocumentMouseMove);
      document.addEventListener('mouseup', handleDocumentMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleDocumentMouseMove);
        document.removeEventListener('mouseup', handleDocumentMouseUp);
      };
    }
  }, [draggingNodeId, handleDocumentMouseMove, handleDocumentMouseUp]);

  const handleDeleteNode = (nodeId) => {
    // Remove the node
    const updatedNodes = nodes.filter(n => n.id !== nodeId);
    
    // Remove any connections involving this node
    const updatedConnections = connections.filter(conn => 
      conn.sourceId !== nodeId && conn.targetId !== nodeId
    );
    setConnections(updatedConnections);
    
    // Update remaining nodes to remove references to deleted node
    const cleanedNodes = updatedNodes.map(node => ({
      ...node,
      connections: (node.connections || []).filter(conn => conn.targetId !== nodeId)
    }));
    
    if (onNodesChange) {
      onNodesChange(cleanedNodes);
    }
    
    // Clear selection if deleted node was selected
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
    }
  };
  
  // Toggle connection mode
  const toggleConnectionMode = () => {
    setConnectionMode(!connectionMode);
    setSelectedConnectionPoint(null);
  };
  
  // Delete connection function
  const handleDeleteConnection = (connectionId) => {
    const updatedConnections = connections.filter(conn => conn.id !== connectionId);
    setConnections(updatedConnections);
    
    // Update nodes to remove connection references
    const updatedNodes = nodes.map(node => ({
      ...node,
      connections: (node.connections || []).filter(conn => {
        const connToDelete = connections.find(c => c.id === connectionId);
        return connToDelete ? conn.targetId !== connToDelete.targetId : true;
      })
    }));
    
    if (onNodesChange) {
      onNodesChange(updatedNodes);
    }
  };

  // Simple click-to-connect logic
  const handleConnectionPointClick = (e, nodeId, isOutput) => {
    e.stopPropagation();
    
    if (!connectionMode) {
      // Start connection mode
      setConnectionMode(true);
      setSelectedConnectionPoint({ nodeId, isOutput });
      console.log('Connection mode started from node:', nodeId, 'output:', isOutput);
    } else {
      // Complete connection
      if (selectedConnectionPoint && selectedConnectionPoint.nodeId !== nodeId) {
        const sourceId = selectedConnectionPoint.isOutput ? selectedConnectionPoint.nodeId : nodeId;
        const targetId = selectedConnectionPoint.isOutput ? nodeId : selectedConnectionPoint.nodeId;
        
        // Check if connection already exists
        const existingConnection = connections.find(conn => 
          (conn.sourceId === sourceId && conn.targetId === targetId) ||
          (conn.sourceId === targetId && conn.targetId === sourceId)
        );
        
        if (!existingConnection) {
          // Create new connection
          const newConnection = {
            id: `conn_${sourceId}_${targetId}_${Date.now()}`,
            sourceId,
            targetId,
            type: 'default'
          };
          
          setConnections(prev => [...prev, newConnection]);
          
          // Update nodes with connections
          const updatedNodes = nodes.map(node => {
            if (node.id === sourceId) {
              return {
                ...node,
                connections: [...(node.connections || []), { targetId, type: 'default' }]
              };
            }
            return node;
          });
          
          if (onNodesChange) {
            onNodesChange(updatedNodes);
          }
          
          console.log('Connection created:', newConnection);
        } else {
          console.log('Connection already exists');
        }
      }
      
      // Reset connection mode
      setConnectionMode(false);
      setSelectedConnectionPoint(null);
    }
  };

  const getNodePosition = (nodeId) => {
    const node = nodes.find(n => n.id === nodeId);
    return node ? node.position : { x: 0, y: 0 };
  };

  const drawConnection = (ctx, start, end, type = 'default') => {
    const startPos = getNodePosition(start.sourceId);
    const endPos = getNodePosition(start.targetId);
    
    const startX = startPos.x + 200; // Output connection point
    const startY = startPos.y + 40;
    const endX = endPos.x; // Input connection point
    const endY = endPos.y + 40;

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    
    // Create curved line
    const controlPoint1X = startX + (endX - startX) * 0.5;
    const controlPoint1Y = startY;
    const controlPoint2X = startX + (endX - startX) * 0.5;
    const controlPoint2Y = endY;
    
    ctx.bezierCurveTo(controlPoint1X, controlPoint1Y, controlPoint2X, controlPoint2Y, endX, endY);
    
    ctx.strokeStyle = type === 'default' ? '#3b82f6' : '#ef4444';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw arrow
    const angle = Math.atan2(endY - controlPoint2Y, endX - controlPoint2X);
    const arrowLength = 10;
    const arrowAngle = Math.PI / 6;

    ctx.beginPath();
    ctx.moveTo(endX, endY);
    ctx.lineTo(
      endX - arrowLength * Math.cos(angle - arrowAngle),
      endY - arrowLength * Math.sin(angle - arrowAngle)
    );
    ctx.moveTo(endX, endY);
    ctx.lineTo(
      endX - arrowLength * Math.cos(angle + arrowAngle),
      endY - arrowLength * Math.sin(angle + arrowAngle)
    );
    ctx.stroke();
  };

  return (
    <div className="flex-1 relative bg-background overflow-hidden">
      {/* Canvas */}
      <div
        ref={canvasRef}
        className="w-full h-full relative cursor-grab active:cursor-grabbing"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{
          backgroundImage: showGrid ? `
            radial-gradient(circle, #e2e8f0 1px, transparent 1px)
          ` : 'none',
          backgroundSize: showGrid ? `${20 * (zoom / 100)}px ${20 * (zoom / 100)}px` : 'auto',
          backgroundPosition: `${pan?.x}px ${pan?.y}px`
        }}
      >
        {/* SVG for drawing connections */}
        <svg 
          className="absolute inset-0 pointer-events-none"
          style={{
            width: '100%',
            height: '100%',
            transform: `translate(${pan?.x}px, ${pan?.y}px) scale(${zoom / 100})`,
            transformOrigin: '0 0',
            zIndex: 1
          }}
        >
          {/* Draw existing connections */}
          {connections.map(connection => {
            const startPos = getNodePosition(connection.sourceId);
            const endPos = getNodePosition(connection.targetId);
            
            const startX = startPos.x + 200;
            const startY = startPos.y + 40;
            const endX = endPos.x;
            const endY = endPos.y + 40;
            
            const controlPoint1X = startX + (endX - startX) * 0.5;
            const controlPoint1Y = startY;
            const controlPoint2X = startX + (endX - startX) * 0.5;
            const controlPoint2Y = endY;

            return (
              <g key={connection.id} className="group">
              {/* Connection path - clickable for deletion */}
                <path
                  d={`M ${startX} ${startY} C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${endX} ${endY}`}
                  stroke={connection.color || '#6366F1'}
                  strokeWidth="3"
                  fill="none"
                  markerEnd="url(#arrowhead)"
                  className={`transition-all duration-200 ${connection.animated ? 'animate-pulse' : ''} cursor-pointer hover:stroke-red-500`}
                  style={{
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                    pointerEvents: 'stroke'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('Delete this connection?')) {
                      handleDeleteConnection(connection.id);
                    }
                  }}
                />
                
                {/* Invisible wider path for easier clicking */}
                <path
                  d={`M ${startX} ${startY} C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${endX} ${endY}`}
                  stroke="transparent"
                  strokeWidth="12"
                  fill="none"
                  className="cursor-pointer hover:stroke-red-500 hover:stroke-opacity-20"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('Delete this connection?')) {
                      handleDeleteConnection(connection.id);
                    }
                  }}
                />
                
                {/* Connection label */}
                <text
                  x={(startX + endX) / 2}
                  y={(startY + endY) / 2 - 10}
                  fill="#6B7280"
                  fontSize="10"
                  textAnchor="middle"
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                >
                  {connection.type}
                </text>
                
                {/* Delete button on hover */}
                <circle
                  cx={(startX + endX) / 2}
                  cy={(startY + endY) / 2}
                  r="8"
                  fill="#EF4444"
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteConnection(connection.id);
                  }}
                />
                <text
                  x={(startX + endX) / 2}
                  y={(startY + endY) / 2 + 3}
                  fill="white"
                  fontSize="10"
                  textAnchor="middle"
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
                >
                  ×
                </text>
              </g>
            );
          })}

          
          {/* Arrow marker definition */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="#6366F1"
              />
            </marker>
          </defs>
        </svg>

        {/* Transform Container */}
        <div
          style={{
            transform: `translate(${pan?.x}px, ${pan?.y}px) scale(${zoom / 100})`,
            transformOrigin: '0 0',
            zIndex: 10
          }}
          className="absolute inset-0"
        >
          {/* Workflow Nodes */}
          {nodes?.map((node) => (
            <div
              key={node?.id}
              // Custom drag logic
              onMouseDown={e => startNodeDrag(e, node)}
              draggable="false"
              onClick={() => handleNodeClick(node)}
              className={`group absolute p-4 bg-card border-2 rounded-lg shadow-elevation-1 cursor-pointer transition-smooth min-w-48 ${
                selectedNode?.id === node?.id 
                  ? 'border-primary shadow-elevation-2' 
                  : 'border-border hover:border-primary/50 hover:shadow-elevation-2'
              }`}
              style={{
                left: node?.position?.x,
                top: node?.position?.y
              }}
            >
              {/* Node Actions Menu */}
              <div 
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-smooth flex space-x-1"
                style={{ zIndex: 200 }}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteNode(node.id);
                  }}
                  className="w-6 h-6 bg-destructive hover:bg-destructive/80 text-destructive-foreground rounded flex items-center justify-center transition-smooth"
                  title="Delete node"
                >
                  <Icon name="X" size={12} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Copy node logic here
                  }}
                  className="w-6 h-6 bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground rounded flex items-center justify-center transition-smooth"
                  title="Duplicate node"
                >
                  <Icon name="Copy" size={12} />
                </button>
              </div>
              
              <div className="flex items-center space-x-3 mb-2">
                <div className={`w-8 h-8 ${node?.color} rounded-md flex items-center justify-center`}>
                  <Icon name={node?.icon} size={16} color="white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-foreground truncate">
                    {node?.name}
                  </h3>
                  <p className="text-xs text-muted-foreground truncate">
                    {node?.data?.endpoint}
                  </p>
                </div>
              </div>
              
              {/* Node Status */}
              <div className="flex items-center justify-between">
                <span className="text-xs px-2 py-1 bg-success/10 text-success rounded-full">
                  Valid
                </span>
                <Icon name="MoreHorizontal" size={14} className="text-muted-foreground" />
              </div>

              {/* Connection Points */}
              <div 
                className={`absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full border-2 border-background cursor-pointer transition-smooth z-50 ${
                  connectionMode && selectedConnectionPoint?.nodeId === node.id && selectedConnectionPoint?.isOutput
                    ? 'bg-green-500 animate-pulse'
                    : connectionMode
                    ? 'bg-blue-500 hover:bg-blue-400'
                    : 'bg-indigo-500 hover:bg-primary/80'
                }`}
                style={{ zIndex: 100 }}
                onClick={(e) => handleConnectionPointClick(e, node.id, true)}
                title={connectionMode ? 'Click to connect' : 'Output connection point - click to start connecting'}
              />
              <div 
                className={`absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full border-2 border-background cursor-pointer transition-smooth z-50 ${
                  connectionMode && selectedConnectionPoint?.nodeId === node.id && !selectedConnectionPoint?.isOutput
                    ? 'bg-green-500 animate-pulse'
                    : connectionMode
                    ? 'bg-green-500 hover:bg-green-400'
                    : 'bg-indigo-500 hover:bg-muted/80'
                }`}
                style={{ zIndex: 100 }}
                onClick={(e) => handleConnectionPointClick(e, node.id, false)}
                title={connectionMode ? 'Click to connect' : 'Input connection point - click to start connecting'}
              />
            </div>
          ))}

          {/* Empty State */}
          {nodes?.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center max-w-md">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Workflow" size={32} className="text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Start Building Your API
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Drag components from the library to create your API workflow. Connect endpoints, add middleware, and configure responses visually.
                </p>
                <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
                  <Icon name="MousePointer" size={14} />
                  <span>Drag & Drop to get started</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Floating Toolbar */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-card border border-border rounded-lg shadow-elevation-2 p-2 flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleConnectionMode}
          className={connectionMode ? 'bg-primary text-primary-foreground' : ''}
          title={connectionMode ? 'Exit connection mode' : 'Enter connection mode'}
        >
          <Icon name="Link" size={16} />
        </Button>
        
        <div className="w-px h-6 bg-border mx-1"></div>
        
        <Button variant="ghost" size="icon" onClick={handleZoomOut}>
          <Icon name="ZoomOut" size={16} />
        </Button>
        
        <span className="text-sm font-medium text-foreground px-2 min-w-16 text-center">
          {zoom}%
        </span>
        
        <Button variant="ghost" size="icon" onClick={handleZoomIn}>
          <Icon name="ZoomIn" size={16} />
        </Button>
        
        <div className="w-px h-6 bg-border mx-1"></div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setShowGrid(!showGrid)}
          className={showGrid ? 'bg-muted' : ''}
        >
          <Icon name="Grid3x3" size={16} />
        </Button>
        
        <Button variant="ghost" size="icon" onClick={handleResetView}>
          <Icon name="RotateCcw" size={16} />
        </Button>

        <div className="w-px h-6 bg-border mx-1"></div>

        <div className="flex items-center space-x-1 px-2">
          {connectionMode ? (
            <>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-foreground font-medium">
                Connection Mode: Click nodes to connect
              </span>
            </>
          ) : (
            <>
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-xs text-muted-foreground">
                {nodes?.length} nodes
              </span>
            </>
          )}
        </div>
      </div>
      {/* Validation Status */}
      <div className="absolute top-4 right-4 bg-card border border-border rounded-lg shadow-elevation-1 p-3">
        <div className="flex items-center space-x-2">
          <Icon name="CheckCircle" size={16} className="text-success" />
          <span className="text-sm font-medium text-foreground">Workflow Valid</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          All endpoints configured correctly
        </p>
      </div>
    </div>
  );
};

export default WorkflowCanvas;