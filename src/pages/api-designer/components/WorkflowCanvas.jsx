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
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStart, setConnectionStart] = useState(null);
  const [connectionEnd, setConnectionEnd] = useState(null);
  const canvasRef = useRef(null);

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

    // Update connection end point when connecting
    if (isConnecting) {
      const rect = canvasRef?.current?.getBoundingClientRect();
      const x = (e?.clientX - rect?.left - pan?.x) / (zoom / 100);
      const y = (e?.clientY - rect?.top - pan?.y) / (zoom / 100);
      setConnectionEnd({ x, y });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    
    // End connection if connecting
    if (isConnecting) {
      setIsConnecting(false);
      setConnectionStart(null);
      setConnectionEnd(null);
    }
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

  const handleNodeDragStart = (e, node) => {
    setDraggedNode(node);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleNodeDrag = (e, nodeId) => {
    if (!draggedNode) return;
    
    const rect = canvasRef?.current?.getBoundingClientRect();
    const x = (e?.clientX - rect?.left - pan?.x) / (zoom / 100);
    const y = (e?.clientY - rect?.top - pan?.y) / (zoom / 100);

    const updatedNodes = nodes?.map(node => 
      node?.id === nodeId 
        ? { ...node, position: { x, y } }
        : node
    );

    if (onNodesChange) {
      onNodesChange(updatedNodes);
    }
  };

  const handleConnectionStart = (e, nodeId, isOutput = true) => {
    e.stopPropagation();
    setIsConnecting(true);
    const node = nodes.find(n => n.id === nodeId);
    setConnectionStart({
      nodeId,
      x: node.position.x + (isOutput ? 200 : 0), // Adjust based on node width
      y: node.position.y + 40, // Adjust based on node height
      isOutput
    });
  };

  const handleConnectionEnd = (e, nodeId, isInput = true) => {
    e.stopPropagation();
    if (isConnecting && connectionStart && connectionStart.nodeId !== nodeId) {
      // Create connection
      const newConnection = {
        id: `${connectionStart.nodeId}_${nodeId}`,
        sourceId: connectionStart.isOutput ? connectionStart.nodeId : nodeId,
        targetId: connectionStart.isOutput ? nodeId : connectionStart.nodeId,
        type: 'default'
      };

      // Update nodes with connections
      const updatedNodes = nodes.map(node => {
        if (node.id === connectionStart.nodeId) {
          return {
            ...node,
            connections: [...(node.connections || []), {
              targetId: nodeId,
              type: 'default'
            }]
          };
        }
        return node;
      });

      if (onNodesChange) {
        onNodesChange(updatedNodes);
      }
    }
    
    setIsConnecting(false);
    setConnectionStart(null);
    setConnectionEnd(null);
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
        {/* SVG for connections */}
        <svg
          className="absolute inset-0 pointer-events-none"
          style={{
            transform: `translate(${pan?.x}px, ${pan?.y}px) scale(${zoom / 100})`,
            transformOrigin: '0 0'
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
              <g key={connection.id}>
                <path
                  d={`M ${startX} ${startY} C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${endX} ${endY}`}
                  stroke={connection.type === 'default' ? '#3b82f6' : '#ef4444'}
                  strokeWidth="2"
                  fill="none"
                  markerEnd="url(#arrowhead)"
                />
              </g>
            );
          })}
          
          {/* Draw connecting line */}
          {isConnecting && connectionStart && connectionEnd && (
            <path
              d={`M ${connectionStart.x} ${connectionStart.y} L ${connectionEnd.x} ${connectionEnd.y}`}
              stroke="#3b82f6"
              strokeWidth="2"
              strokeDasharray="5,5"
              fill="none"
            />
          )}
          
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
                fill="#3b82f6"
              />
            </marker>
          </defs>
        </svg>

        {/* Transform Container */}
        <div
          style={{
            transform: `translate(${pan?.x}px, ${pan?.y}px) scale(${zoom / 100})`,
            transformOrigin: '0 0'
          }}
          className="absolute inset-0"
        >
          {/* Workflow Nodes */}
          {nodes?.map((node) => (
            <div
              key={node?.id}
              draggable
              onDragStart={(e) => handleNodeDragStart(e, node)}
              onDrag={(e) => handleNodeDrag(e, node?.id)}
              onClick={() => handleNodeClick(node)}
              className={`absolute p-4 bg-card border-2 rounded-lg shadow-elevation-1 cursor-pointer transition-smooth min-w-48 ${
                selectedNode?.id === node?.id 
                  ? 'border-primary shadow-elevation-2' 
                  : 'border-border hover:border-primary/50 hover:shadow-elevation-2'
              }`}
              style={{
                left: node?.position?.x,
                top: node?.position?.y
              }}
            >
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
                className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-primary rounded-full border-2 border-background cursor-crosshair hover:bg-primary/80 transition-smooth"
                onMouseDown={(e) => handleConnectionStart(e, node.id, true)}
                onMouseUp={(e) => handleConnectionEnd(e, node.id, false)}
                title="Output connection point"
              ></div>
              <div 
                className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-muted rounded-full border-2 border-background cursor-crosshair hover:bg-muted/80 transition-smooth"
                onMouseDown={(e) => handleConnectionStart(e, node.id, false)}
                onMouseUp={(e) => handleConnectionEnd(e, node.id, true)}
                title="Input connection point"
              ></div>
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
          <div className="w-2 h-2 bg-success rounded-full"></div>
          <span className="text-xs text-muted-foreground">
            {nodes?.length} nodes
          </span>
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