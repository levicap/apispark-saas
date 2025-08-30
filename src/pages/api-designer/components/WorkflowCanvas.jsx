"use client"

import React, { useState, useRef, useCallback } from "react"

// Simple Icon component for now
const Icon = ({ name, size = 16, className = '', color = 'currentColor' }) => (
  <span className={`inline-block ${className}`} style={{ width: size, height: size, color }}>
    {name === 'ZoomIn' && '🔍+'}
    {name === 'ZoomOut' && '🔍-'}
    {name === 'Grid3x3' && '⊞'}
    {name === 'RotateCcw' && '🔄'}
    {name === 'CheckCircle' && '✅'}
    {name === 'Workflow' && '⚙️'}
    {name === 'MousePointer' && '👆'}
    {name === 'Link' && '🔗'}
    {name === 'MoreHorizontal' && '⋯'}
    {name === 'Move' && '↔️'}
  </span>
);

const WorkflowCanvas = ({ onNodeSelect, selectedNode, onNodesChange, nodes = [], onConnectionCreate, onNodeRemove, onConnectionRemove }) => {
  const [zoom, setZoom] = useState(100)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [showGrid, setShowGrid] = useState(true)
  const [draggedNode, setDraggedNode] = useState(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionStart, setConnectionStart] = useState(null)
  const [tempConnection, setTempConnection] = useState(null)
  const canvasRef = useRef(null)

  const getNodeCenter = (node) => {
    return {
      x: node.position.x + 96, // half of min-w-48 (192px / 2)
      y: node.position.y + 40, // approximate center height
    }
  }

  const createConnection = (fromNodeId, toNodeId) => {
    console.log('[createConnection] from:', fromNodeId, 'to:', toNodeId, 'nodes:', nodes);
    const updatedNodes = nodes.map((node) => {
      if (node.id === fromNodeId) {
        const existingConnection = (node.connections || []).find((conn) => conn.to === toNodeId);
        if (!existingConnection) {
          return {
            ...node,
            connections: [...(node.connections || []), { to: toNodeId, type: "data" }],
          };
        }
      }
      return { ...node, connections: node.connections ? [...node.connections] : [] };
    });
    console.log('[createConnection] updatedNodes:', updatedNodes);
    if (onNodesChange) {
      onNodesChange(updatedNodes);
    }
    // After connection, select the source node so InspectorPanel stays open
    if (onNodeSelect) {
      const src = updatedNodes.find(n => n.id === fromNodeId);
      if (src) onNodeSelect(src);
    }
  };

  const removeConnection = (fromNodeId, toNodeId) => {
    const updatedNodes = nodes.map((node) => {
      if (node.id === fromNodeId) {
        return {
          ...node,
          connections: (node.connections || []).filter((conn) => conn.to !== toNodeId),
        }
      }
      return node
    })

    if (onNodesChange) {
      onNodesChange(updatedNodes)
    }
  }

  const handleConnectionPointClick = (e, nodeId, isOutput = true) => {
    e.stopPropagation()

    if (!isConnecting) {
      // Start connection
      setIsConnecting(true)
      setConnectionStart({ nodeId, isOutput })
    } else {
      // Complete connection
      if (connectionStart && connectionStart.nodeId !== nodeId) {
        if (connectionStart.isOutput && !isOutput) {
          // Valid connection: output to input
          createConnection(connectionStart.nodeId, nodeId)
        } else if (!connectionStart.isOutput && isOutput) {
          // Valid connection: input to output (reverse)
          createConnection(nodeId, connectionStart.nodeId)
        }
      }

      // Reset connection state
      setIsConnecting(false)
      setConnectionStart(null)
      setTempConnection(null)
    }
  }

  const handleCanvasMouseMove = (e) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    } else if (isConnecting && connectionStart) {
      const rect = canvasRef.current?.getBoundingClientRect()
      if (rect) {
        const mouseX = (e.clientX - rect.left - pan.x) / (zoom / 100)
        const mouseY = (e.clientY - rect.top - pan.y) / (zoom / 100)
        
        const startNode = nodes.find(n => n.id === connectionStart.nodeId)
        if (startNode) {
          const start = getNodeCenter(startNode)
          setTempConnection({
            start: { x: start.x, y: start.y },
            end: { x: mouseX, y: mouseY }
          })
        }
      }
    }
  }

  const renderConnections = () => {
    const connections = []
    console.log('[renderConnections] nodes:', nodes.map(n => ({id: n.id, connections: n.connections})));

    nodes.forEach((node) => {
      if (node.connections) {
        node.connections.forEach((connection) => {
          const targetNode = nodes.find((n) => n.id === connection.to)
          if (targetNode) {
            const fromPos = getNodeCenter(node)
            const toPos = getNodeCenter(targetNode)
            console.log('[renderConnections] drawing from', node.id, 'to', connection.to, 'fromPos', fromPos, 'toPos', toPos);

            // Create curved path
            const midX = (fromPos.x + toPos.x) / 2
            const curve = Math.abs(toPos.x - fromPos.x) * 0.3

            const path = `M ${fromPos.x} ${fromPos.y} C ${fromPos.x + curve} ${fromPos.y}, ${toPos.x - curve} ${toPos.y}, ${toPos.x} ${toPos.y}`

            connections.push(
              <g key={`${node.id}-${connection.to}`}>
                <path
                  d={path}
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                  fill="none"
                  className="hover:stroke-primary/80 cursor-pointer"
                  onClick={() => removeConnection(node.id, connection.to)}
                />
                {/* Arrow marker */}
                <circle cx={toPos.x - 8} cy={toPos.y} r="3" fill="hsl(var(--primary))" />
              </g>,
            )
          } else {
            console.log('[renderConnections] targetNode not found for', connection.to);
          }
        })
      }
    })

    // Add temporary connection line
    if (tempConnection) {
      const midX = (tempConnection.start.x + tempConnection.end.x) / 2
      const curve = Math.abs(tempConnection.end.x - tempConnection.start.x) * 0.3
      const path = `M ${tempConnection.start.x} ${tempConnection.start.y} C ${tempConnection.start.x + curve} ${tempConnection.start.y}, ${tempConnection.end.x - curve} ${tempConnection.end.y}, ${tempConnection.end.x} ${tempConnection.end.y}`

      connections.push(
        <path
          key="temp-connection"
          d={path}
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          strokeDasharray="5,5"
          fill="none"
          opacity="0.6"
        />,
      )
    }

    return connections
  }

  const handleDrop = useCallback(
    (e) => {
      e?.preventDefault()
      const rect = canvasRef?.current?.getBoundingClientRect()
      const x = (e?.clientX - rect?.left - pan?.x) / (zoom / 100)
      const y = (e?.clientY - rect?.top - pan?.y) / (zoom / 100)

      try {
        const componentData = JSON.parse(e?.dataTransfer?.getData("application/json"))
        const newNode = {
          id: `node_${Date.now()}`,
          type: componentData?.id,
          name: componentData?.name,
          color: componentData?.color,
          icon: componentData?.icon,
          position: { x, y },
          data: {
            method: componentData?.name,
            endpoint:
              componentData?.id === "get"
                ? "/api/users"
                : componentData?.id === "post"
                  ? "/api/users"
                  : componentData?.id === "put"
                    ? "/api/users/:id"
                    : componentData?.id === "patch"
                      ? "/api/users/:id"
                      : componentData?.id === "delete"
                        ? "/api/users/:id"
                        : "/api/endpoint",
            description: componentData?.description,
            parameters: [],
            responses: {},
          },
          connections: [],
        }

        const updatedNodes = [...nodes, newNode]
        if (onNodesChange) {
          onNodesChange(updatedNodes)
        }
      } catch (error) {
        console.error("Error parsing dropped data:", error)
      }
    },
    [nodes, onNodesChange, pan, zoom],
  )

  const handleDragOver = useCallback((e) => {
    e?.preventDefault()
  }, [])

  const handleMouseDown = (e) => {
    if (e?.target === canvasRef?.current) {
      setIsDragging(true)
      setDragStart({ x: e?.clientX - pan?.x, y: e?.clientY - pan?.y })
    }
  }

  const handleMouseMove = handleCanvasMouseMove

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isConnecting) {
        setIsConnecting(false)
        setConnectionStart(null)
        setTempConnection(null)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isConnecting])

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 25, 200))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 25, 25))
  }

  const handleResetView = () => {
    setZoom(100)
    setPan({ x: 0, y: 0 })
  }

  const handleNodeClick = (node) => {
    if (!isConnecting && onNodeSelect) {
      onNodeSelect(node)
    }
  }

  const handleNodeDragStart = (e, node) => {
    if (!isConnecting) {
      setDraggedNode(node)
      e.dataTransfer.effectAllowed = "move"
    }
  }

  const handleNodeDrag = (e, nodeId) => {
    if (!draggedNode || isConnecting) return

    const rect = canvasRef?.current?.getBoundingClientRect()
    const x = (e?.clientX - rect?.left - pan?.x) / (zoom / 100)
    const y = (e?.clientY - rect?.top - pan?.y) / (zoom / 100)

    const updatedNodes = nodes?.map((node) => (node?.id === nodeId ? { ...node, position: { x, y } } : node))

    if (onNodesChange) {
      onNodesChange(updatedNodes)
    }
  }

  return (
    <div className="flex-1 relative bg-background overflow-hidden">
      {/* Canvas */}
      <div
        ref={canvasRef}
        className={`w-full h-full relative ${isConnecting ? "cursor-crosshair" : "cursor-grab active:cursor-grabbing"}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {/* Grid Background */}
        {showGrid && (
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `radial-gradient(circle, #888 1px, transparent 1px)`,
              backgroundSize: `${20 * (zoom / 100)}px ${20 * (zoom / 100)}px`,
            }}
          />
        )}

        {/* SVG Layer for Connections */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom / 100})`,
            transformOrigin: '0 0',
          }}
        >
          {/* Render existing connections */}
          {nodes.map((node) =>
            (node.connections || []).map((connection, index) => {
              const targetNode = nodes.find((n) => n.id === connection.to);
              if (!targetNode) return null;

              const start = getNodeCenter(node);
              const end = getNodeCenter(targetNode);

              return (
                <g key={`${node.id}-${connection.to}-${index}`}>
                  {/* Connection line */}
                  <path
                    d={`M ${start.x} ${start.y} L ${end.x} ${end.y}`}
                    stroke="#888"
                    strokeWidth="2"
                    fill="none"
                    markerEnd="url(#arrowhead)"
                  />
                  {/* Connection label */}
                  <text
                    x={(start.x + end.x) / 2}
                    y={(start.y + end.y) / 2 - 10}
                    textAnchor="middle"
                    className="text-xs fill-muted-foreground"
                    style={{ fontSize: '10px' }}
                  >
                    {connection.type || 'data'}
                  </text>
                </g>
              );
            })
          )}

          {/* Render temporary connection while dragging */}
          {isConnecting && connectionStart && tempConnection && (
            <path
              d={`M ${tempConnection.start.x} ${tempConnection.start.y} L ${tempConnection.end.x} ${tempConnection.end.y}`}
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
              <polygon points="0 0, 10 3.5, 0 7" fill="#888" />
            </marker>
          </defs>
        </svg>

        {/* Nodes */}
        {nodes?.map((node) => (
          <div
            key={node?.id}
            draggable={!isConnecting}
            onDragStart={(e) => handleNodeDragStart(e, node)}
            onDrag={(e) => handleNodeDrag(e, node?.id)}
            onClick={() => handleNodeClick(node)}
            className={`absolute min-w-48 bg-card border border-border rounded-lg shadow-depth p-3 cursor-move ${
              isConnecting && connectionStart?.nodeId === node.id
                ? "ring-2 ring-primary ring-offset-2"
                : ""
            }`}
            style={{
              left: node?.position?.x,
              top: node?.position?.y,
            }}
          >
            <div className="flex items-center space-x-3 mb-2">
              <div className={`w-8 h-8 ${node?.color} rounded-md flex items-center justify-center`}>
                <Icon name={node?.icon} size={16} color="white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-foreground truncate">{node?.name}</h3>
                <p className="text-xs text-muted-foreground truncate">{node?.data?.endpoint}</p>
              </div>
            </div>

            {/* Node Status */}
            <div className="flex items-center justify-between">
              <span className="text-xs px-2 py-1 bg-success/10 text-success rounded-full">Valid</span>
              <Icon name="MoreHorizontal" size={14} className="text-muted-foreground" />
            </div>

            {/* Output Connection Point */}
            <div
              className={`absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full border-2 border-background cursor-pointer hover:scale-110 transition-transform ${
                isConnecting && connectionStart?.nodeId === node.id && connectionStart?.isOutput
                  ? "bg-primary ring-2 ring-primary/30"
                  : "bg-primary hover:bg-primary/80"
              }`}
              onClick={(e) => handleConnectionPointClick(e, node.id, true)}
              title="Output - Click to connect"
            />

            {/* Input Connection Point */}
            <div
              className={`absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full border-2 border-background cursor-pointer hover:scale-110 transition-transform ${
                isConnecting && connectionStart?.nodeId === node.id && !connectionStart?.isOutput
                  ? "bg-muted ring-2 ring-primary/30"
                  : "bg-muted hover:bg-muted-foreground"
              }`}
              onClick={(e) => handleConnectionPointClick(e, node.id, false)}
              title="Input - Click to connect"
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
                <h3 className="text-lg font-medium text-foreground mb-2">Start Building Your API</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Drag components from the library to create your API workflow. Connect endpoints, add middleware, and
                  configure responses visually.
                </p>
                <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
                  <Icon name="MousePointer" size={14} />
                  <span>Drag & Drop to get started</span>
                </div>
              </div>
            </div>
          )}
        </div>

      {isConnecting && (
        <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-2 rounded-lg shadow-elevation-2 flex items-center space-x-2">
          <Icon name="Link" size={16} />
          <span className="text-sm font-medium">Connection Mode</span>
          <span className="text-xs opacity-80">Press ESC to cancel</span>
        </div>
      )}

      {/* Floating Toolbar */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-card border border-border rounded-lg shadow-elevation-2 p-2 flex items-center space-x-2">
        <button 
          className="p-2 hover:bg-muted rounded transition-colors"
          onClick={handleZoomOut}
          title="Zoom Out"
        >
          <Icon name="ZoomOut" size={16} />
        </button>

        <span className="text-sm font-medium text-foreground px-2 min-w-16 text-center">{zoom}%</span>

        <button 
          className="p-2 hover:bg-muted rounded transition-colors"
          onClick={handleZoomIn}
          title="Zoom In"
        >
          <Icon name="ZoomIn" size={16} />
        </button>

        <div className="w-px h-6 bg-border mx-1"></div>

        <button
          className={`p-2 rounded transition-colors ${showGrid ? "bg-muted" : "hover:bg-muted"}`}
          onClick={() => setShowGrid(!showGrid)}
          title="Toggle Grid"
        >
          <Icon name="Grid3x3" size={16} />
        </button>

        <button 
          className="p-2 hover:bg-muted rounded transition-colors"
          onClick={handleResetView}
          title="Reset View"
        >
          <Icon name="RotateCcw" size={16} />
        </button>

        <div className="w-px h-6 bg-border mx-1"></div>

        <div className="flex items-center space-x-1 px-2">
          <div className="w-2 h-2 bg-success rounded-full"></div>
          <span className="text-xs text-muted-foreground">{nodes?.length} nodes</span>
        </div>
      </div>

      {/* Validation Status */}
      <div className="absolute top-4 right-4 bg-card border border-border rounded-lg shadow-elevation-1 p-3">
        <div className="flex items-center space-x-2">
          <Icon name="CheckCircle" size={16} className="text-success" />
          <span className="text-sm font-medium text-foreground">Workflow Valid</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">All endpoints configured correctly</p>
      </div>
    </div>
  )
}

export default WorkflowCanvas
