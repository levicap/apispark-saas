import React, { useState, useRef, useCallback, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CanvasWorkspace = ({ 
  entities = [], 
  connections = [], 
  onEntitySelect, 
  onEntityMove, 
  onEntityUpdate,
  onEntityAdd,
  onConnectionCreate,
  selectedEntityId,
  showGrid = true,
  connectionMode = false 
}) => {
  const canvasRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedEntities, setSelectedEntities] = useState(new Set());
  const [connectionStart, setConnectionStart] = useState(null);
  
  // New state for entity dragging
  const [draggingEntity, setDraggingEntity] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // New state for relationship type selection
  const [showRelationshipDialog, setShowRelationshipDialog] = useState(false);
  const [pendingConnection, setPendingConnection] = useState(null);
  const [selectedRelationshipType, setSelectedRelationshipType] = useState('one-to-many');

  // Field editing state
  const [editingField, setEditingField] = useState(null);
  const [showFieldContextMenu, setShowFieldContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [contextMenuField, setContextMenuField] = useState(null);

  // Entity editing state
  const [editingEntityName, setEditingEntityName] = useState(null);

  const relationshipTypes = [
    { value: 'one-to-one', label: 'One to One (1:1)', description: 'Each record in the first entity relates to exactly one record in the second entity' },
    { value: 'one-to-many', label: 'One to Many (1:N)', description: 'Each record in the first entity can relate to multiple records in the second entity' },
    { value: 'many-to-one', label: 'Many to One (N:1)', description: 'Multiple records in the first entity can relate to one record in the second entity' },
    { value: 'many-to-many', label: 'Many to Many (N:N)', description: 'Multiple records in both entities can relate to multiple records in the other entity' }
  ];

  const fieldTypes = [
    { value: 'varchar', label: 'VARCHAR' },
    { value: 'char', label: 'CHAR' },
    { value: 'text', label: 'TEXT' },
    { value: 'longtext', label: 'LONGTEXT' },
    { value: 'int', label: 'INTEGER' },
    { value: 'bigint', label: 'BIGINT' },
    { value: 'smallint', label: 'SMALLINT' },
    { value: 'tinyint', label: 'TINYINT' },
    { value: 'decimal', label: 'DECIMAL' },
    { value: 'float', label: 'FLOAT' },
    { value: 'double', label: 'DOUBLE' },
    { value: 'boolean', label: 'BOOLEAN' },
    { value: 'date', label: 'DATE' },
    { value: 'datetime', label: 'DATETIME' },
    { value: 'timestamp', label: 'TIMESTAMP' },
    { value: 'time', label: 'TIME' },
    { value: 'year', label: 'YEAR' },
    { value: 'json', label: 'JSON' },
    { value: 'uuid', label: 'UUID' },
    { value: 'binary', label: 'BINARY' },
    { value: 'varbinary', label: 'VARBINARY' },
    { value: 'blob', label: 'BLOB' },
    { value: 'enum', label: 'ENUM' },
    { value: 'set', label: 'SET' }
  ];

  const mockEntities = [
    {
      id: 'user-1',
      name: 'users',
      type: 'table',
      position: { x: 100, y: 100 },
      fields: [
        { name: 'id', type: 'bigint', primaryKey: true },
        { name: 'email', type: 'varchar', unique: true },
        { name: 'password', type: 'varchar' },
        { name: 'first_name', type: 'varchar' },
        { name: 'last_name', type: 'varchar' },
        { name: 'created_at', type: 'timestamp' },
        { name: 'updated_at', type: 'timestamp' }
      ]
    },
    {
      id: 'post-1',
      name: 'posts',
      type: 'table',
      position: { x: 400, y: 150 },
      fields: [
        { name: 'id', type: 'bigint', primaryKey: true },
        { name: 'user_id', type: 'bigint', foreignKey: true },
        { name: 'title', type: 'varchar' },
        { name: 'content', type: 'text' },
        { name: 'status', type: 'varchar' },
        { name: 'published_at', type: 'timestamp' },
        { name: 'created_at', type: 'timestamp' }
      ]
    },
    {
      id: 'comment-1',
      name: 'comments',
      type: 'table',
      position: { x: 700, y: 200 },
      fields: [
        { name: 'id', type: 'bigint', primaryKey: true },
        { name: 'post_id', type: 'bigint', foreignKey: true },
        { name: 'user_id', type: 'bigint', foreignKey: true },
        { name: 'content', type: 'text' },
        { name: 'created_at', type: 'timestamp' }
      ]
    },
    {
      id: 'category-1',
      name: 'categories',
      type: 'table',
      position: { x: 250, y: 400 },
      fields: [
        { name: 'id', type: 'bigint', primaryKey: true },
        { name: 'name', type: 'varchar', unique: true },
        { name: 'slug', type: 'varchar', unique: true },
        { name: 'description', type: 'text' }
      ]
    },
    {
      id: 'post-category-1',
      name: 'post_categories',
      type: 'table',
      position: { x: 450, y: 350 },
      fields: [
        { name: 'post_id', type: 'bigint', primaryKey: true, foreignKey: true },
        { name: 'category_id', type: 'bigint', primaryKey: true, foreignKey: true },
        { name: 'created_at', type: 'timestamp' }
      ]
    }
  ];

  const mockConnections = [
    {
      id: 'conn-1',
      from: 'user-1',
      to: 'post-1',
      type: 'one-to-many',
      fromField: 'id',
      toField: 'user_id'
    },
    {
      id: 'conn-2',
      from: 'post-1',
      to: 'comment-1',
      type: 'one-to-many',
      fromField: 'id',
      toField: 'post_id'
    },
    {
      id: 'conn-3',
      from: 'user-1',
      to: 'comment-1',
      type: 'one-to-many',
      fromField: 'id',
      toField: 'user_id'
    },
    {
      id: 'conn-4',
      from: 'post-1',
      to: 'post-category-1',
      type: 'one-to-many',
      fromField: 'id',
      toField: 'post_id'
    },
    {
      id: 'conn-5',
      from: 'category-1',
      to: 'post-category-1',
      type: 'one-to-many',
      fromField: 'id',
      toField: 'category_id'
    },
    {
      id: 'conn-6',
      from: 'post-1',
      to: 'category-1',
      type: 'many-to-many',
      fromField: 'id',
      toField: 'id',
      junction: 'post-category-1'
    }
  ];

  const allEntities = entities?.length > 0 ? entities : mockEntities;
  const allConnections = connections?.length > 0 ? connections : mockConnections;

  const handleCanvasMouseDown = (e) => {
    if (e?.target === canvasRef?.current) {
      setIsDragging(true);
      setDragStart({ x: e?.clientX - pan?.x, y: e?.clientY - pan?.y });
      setSelectedEntities(new Set());
    }
  };

  const handleCanvasMouseMove = useCallback((e) => {
    if (isDragging) {
      setPan({
        x: e?.clientX - dragStart?.x,
        y: e?.clientY - dragStart?.y
      });
    }
    
    // Handle entity dragging
    if (draggingEntity) {
      const rect = canvasRef?.current?.getBoundingClientRect();
      const newX = (e?.clientX - rect?.left - pan?.x - dragOffset?.x) / zoom;
      const newY = (e?.clientY - rect?.top - pan?.y - dragOffset?.y) / zoom;
      
      onEntityMove && onEntityMove(draggingEntity?.id, { x: Math.max(0, newX), y: Math.max(0, newY) });
    }
  }, [isDragging, dragStart, draggingEntity, dragOffset, pan, zoom, onEntityMove]);

  const handleCanvasMouseUp = useCallback(() => {
    setIsDragging(false);
    setDraggingEntity(null);
    setDragOffset({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    if (isDragging || draggingEntity) {
      document.addEventListener('mousemove', handleCanvasMouseMove);
      document.addEventListener('mouseup', handleCanvasMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleCanvasMouseMove);
        document.removeEventListener('mouseup', handleCanvasMouseUp);
      };
    }
  }, [isDragging, draggingEntity, handleCanvasMouseMove, handleCanvasMouseUp]);

  const handleEntityMouseDown = (entity, e) => {
    if (!connectionMode) {
      e?.stopPropagation();
      const rect = canvasRef?.current?.getBoundingClientRect();
      const entityRect = e?.currentTarget?.getBoundingClientRect();
      
      setDraggingEntity(entity);
      setDragOffset({
        x: e?.clientX - entityRect?.left,
        y: e?.clientY - entityRect?.top
      });
    }
  };

  const handleEntityClick = (entity, e) => {
    e?.stopPropagation();
    if (connectionMode) {
      if (!connectionStart) {
        setConnectionStart(entity);
      } else if (connectionStart?.id !== entity?.id) {
        // Show relationship type selection dialog instead of creating connection immediately
        setPendingConnection({
          from: connectionStart,
          to: entity
        });
        setShowRelationshipDialog(true);
      }
    } else {
      onEntitySelect && onEntitySelect(entity);
      setSelectedEntities(new Set([entity.id]));
    }
  };

  const handleCreateConnection = () => {
    if (pendingConnection && onConnectionCreate) {
      const newConnection = {
        id: `conn-${Date.now()}`,
        from: pendingConnection.from.id,
        to: pendingConnection.to.id,
        type: selectedRelationshipType,
        fromField: 'id',
        toField: `${pendingConnection.from.name}_id`
      };
      
      onConnectionCreate(newConnection);
    }
    
    // Reset connection mode and dialog
    setShowRelationshipDialog(false);
    setPendingConnection(null);
    setConnectionStart(null);
    setSelectedRelationshipType('one-to-many');
  };

  const handleCancelConnection = () => {
    setShowRelationshipDialog(false);
    setPendingConnection(null);
    setConnectionStart(null);
    setConnectionMode(false);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.2, 0.1));
  };

  const handleZoomFit = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleCanvasDrop = (e) => {
    e?.preventDefault();
    const data = e?.dataTransfer?.getData('application/json');
    if (data) {
      const { type, entity } = JSON.parse(data);
      if (type === 'entity') {
        const rect = canvasRef?.current?.getBoundingClientRect();
        const x = (e?.clientX - rect?.left - pan?.x) / zoom;
        const y = (e?.clientY - rect?.top - pan?.y) / zoom;
        
        onEntityAdd && onEntityAdd({
          ...entity,
          position: { x, y }
        });
      }
    }
  };

  const handleCanvasDragOver = (e) => {
    e?.preventDefault();
  };

  const getFieldIcon = (field) => {
    if (field?.primaryKey) return 'Key';
    if (field?.foreignKey) return 'Link';
    if (field?.unique) return 'Hash';
    return 'Minus';
  };

  const getConnectionPath = (from, to, type) => {
    const fromEntity = allEntities?.find(e => e?.id === from);
    const toEntity = allEntities?.find(e => e?.id === to);
    
    if (!fromEntity || !toEntity) return '';

    const fromX = fromEntity?.position?.x + 300; // Right side of entity
    const fromY = fromEntity?.position?.y + 60;  // Center height
    const toX = toEntity?.position?.x;           // Left side of entity
    const toY = toEntity?.position?.y + 60;

    // Calculate control points for smooth curves
    const distance = Math.abs(toX - fromX);
    const controlOffset = Math.min(distance / 2, 100);
    
    const fromControlX = fromX + controlOffset;
    const toControlX = toX - controlOffset;
    
    return `M ${fromX} ${fromY} C ${fromControlX} ${fromY}, ${toControlX} ${toY}, ${toX} ${toY}`;
  };

  const getRelationshipLabel = (type) => {
    switch (type) {
      case 'one-to-one': return '1:1';
      case 'one-to-many': return '1:N';
      case 'many-to-many': return 'N:N';
      default: return '1:N';
    }
  };

  const getRelationshipMarkers = (type) => {
    switch (type) {
      case 'one-to-one':
        return { start: '1', end: '1' };
      case 'one-to-many':
        return { start: '1', end: '∞' };
      case 'many-to-many':
        return { start: '∞', end: '∞' };
      default:
        return { start: '1', end: '∞' };
    }
  };

  const handleFieldDoubleClick = (field, entity) => {
    setEditingField({ ...field, entityId: entity.id });
  };

  const handleFieldContextMenu = (e, field, entity) => {
    e.preventDefault();
    e.stopPropagation();
    
    setContextMenuField({ ...field, entityId: entity.id });
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setShowFieldContextMenu(true);
  };

  const handleFieldUpdate = (fieldId, updates) => {
    if (!editingField || !onEntityUpdate) return;
    
    // Find the entity and update its fields
    const entityToUpdate = allEntities.find(entity => entity.id === editingField.entityId);
    if (!entityToUpdate) return;
    
    const updatedEntity = {
      ...entityToUpdate,
      fields: entityToUpdate.fields.map(field => 
        field.id === fieldId ? { ...field, ...updates } : field
      )
    };
    
    // Call the parent's entity update function
    onEntityUpdate(updatedEntity);
    
    setEditingField(null);
  };

  const closeContextMenu = () => {
    setShowFieldContextMenu(false);
    setContextMenuField(null);
  };

  useEffect(() => {
    const handleClickOutside = () => {
      closeContextMenu();
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleAddFieldToEntity = (entity) => {
    const newField = {
      id: `field-${Date.now()}`,
      name: 'new_field',
      type: 'varchar',
      nullable: true,
      primaryKey: false,
      unique: false,
      autoIncrement: false,
      length: 255,
      defaultValue: 'NULL',
      comment: '',
      foreignKey: false,
      foreignEntity: null,
      foreignField: null
    };

    onEntityUpdate && onEntityUpdate({
      ...entity,
      fields: [...entity.fields, newField]
    });
  };

  const handleEntityNameEdit = (entity) => {
    setEditingEntityName({ ...entity });
  };

  const handleEntityNameSave = () => {
    if (editingEntityName && onEntityUpdate) {
      onEntityUpdate(editingEntityName);
      setEditingEntityName(null);
    }
  };

  const handleEntityNameCancel = () => {
    setEditingEntityName(null);
  };

  return (
    <div className="flex-1 relative overflow-hidden bg-background">
      {/* Canvas */}
      <div
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleCanvasMouseDown}
        onDrop={handleCanvasDrop}
        onDragOver={handleCanvasDragOver}
        style={{
          backgroundImage: showGrid ? `
            radial-gradient(circle, #e2e8f0 1px, transparent 1px)
          ` : 'none',
          backgroundSize: showGrid ? `${20 * zoom}px ${20 * zoom}px` : 'auto',
          backgroundPosition: `${pan?.x}px ${pan?.y}px`
        }}
      >
        <div
          style={{
            transform: `translate(${pan?.x}px, ${pan?.y}px) scale(${zoom})`,
            transformOrigin: '0 0'
          }}
        >
          {/* Connection Lines */}
          <svg className="absolute inset-0 pointer-events-none" style={{ width: '4000px', height: '4000px' }}>
            <defs>
              {/* Arrow marker for relationships */}
              <marker id="arrow" markerWidth="10" markerHeight="7" 
                refX="9" refY="3.5" orient="auto" markerUnits="strokeWidth">
                <polygon points="0 0, 10 3.5, 0 7" fill="var(--color-accent)" />
              </marker>
              
              {/* Circle marker for many relationships */}
              <marker id="circle" markerWidth="8" markerHeight="8" 
                refX="4" refY="4" markerUnits="strokeWidth">
                <circle cx="4" cy="4" r="3" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" />
              </marker>
            </defs>
            
            {allConnections?.map((connection) => {
              const fromEntity = allEntities?.find(e => e?.id === connection?.from);
              const toEntity = allEntities?.find(e => e?.id === connection?.to);
              
              if (!fromEntity || !toEntity) return null;
              
              const fromX = fromEntity?.position?.x + 300;
              const fromY = fromEntity?.position?.y + 60;
              const toX = toEntity?.position?.x;
              const toY = toEntity?.position?.y + 60;
              
              const pathD = getConnectionPath(connection?.from, connection?.to, connection?.type);
              const midX = (fromX + toX) / 2;
              const midY = (fromY + toY) / 2;
              
              const markers = getRelationshipMarkers(connection?.type);
              const relationshipLabel = getRelationshipLabel(connection?.type);
              
              return (
                <g key={connection?.id} className="connection-group">
                  {/* Main connection path */}
                  <path
                    d={pathD}
                    stroke="var(--color-accent)"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray={connection?.type === 'many-to-many' ? '8,4' : 'none'}
                    markerEnd="url(#arrow)"
                    className="transition-all duration-200 hover:stroke-width-3"
                  />
                  
                  {/* Start point marker */}
                  <circle
                    cx={fromX}
                    cy={fromY}
                    r="4"
                    fill="var(--color-accent)"
                    className="transition-all duration-200"
                  />
                  
                  {/* End point marker */}
                  <circle
                    cx={toX}
                    cy={toY}
                    r="4"
                    fill="var(--color-accent)"
                    className="transition-all duration-200"
                  />
                  
                  {/* Relationship type label */}
                  <g transform={`translate(${midX}, ${midY})`}>
                    {/* Label background */}
                    <rect
                      x="-15"
                      y="-10"
                      width="30"
                      height="20"
                      rx="10"
                      fill="var(--color-surface)"
                      stroke="var(--color-accent)"
                      strokeWidth="1.5"
                      className="transition-all duration-200"
                    />
                    
                    {/* Label text */}
                    <text
                      x="0"
                      y="0"
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="10"
                      fontWeight="600"
                      fill="var(--color-accent)"
                      className="pointer-events-none select-none"
                    >
                      {relationshipLabel}
                    </text>
                  </g>
                  
                  {/* Relationship markers at ends */}
                  <g transform={`translate(${fromX - 20}, ${fromY - 8})`}>
                    <circle cx="8" cy="8" r="8" fill="var(--color-surface)" stroke="var(--color-accent)" strokeWidth="1"/>
                    <text x="8" y="8" textAnchor="middle" dominantBaseline="central" fontSize="10" fontWeight="bold" fill="var(--color-accent)">
                      {markers?.start}
                    </text>
                  </g>
                  
                  <g transform={`translate(${toX + 5}, ${toY - 8})`}>
                    <circle cx="8" cy="8" r="8" fill="var(--color-surface)" stroke="var(--color-accent)" strokeWidth="1"/>
                    <text x="8" y="8" textAnchor="middle" dominantBaseline="central" fontSize="10" fontWeight="bold" fill="var(--color-accent)">
                      {markers?.end}
                    </text>
                  </g>
                  
                  {/* Hover effect area */}
                  <path
                    d={pathD}
                    stroke="transparent"
                    strokeWidth="10"
                    fill="none"
                    className="pointer-events-auto cursor-pointer hover:stroke-accent/20"
                    onClick={() => onEntitySelect && onEntitySelect(connection)}
                  />
                </g>
              );
            })}
          </svg>

          {/* Entity Nodes */}
          {allEntities?.map((entity) => (
            <div
              key={entity?.id}
              className={`absolute bg-surface border-2 rounded-lg shadow-interactive transition-smooth ${
                selectedEntityId === entity?.id || selectedEntities?.has(entity?.id)
                  ? 'border-primary shadow-depth ring-2 ring-primary/20'
                  : connectionStart?.id === entity?.id
                  ? 'border-accent shadow-depth ring-2 ring-accent/20'
                  : draggingEntity?.id === entity?.id
                  ? 'border-accent shadow-depth ring-2 ring-accent/30 cursor-grabbing'
                  : 'border-border hover:border-accent hover:shadow-depth cursor-grab'
              } ${connectionMode ? 'cursor-pointer' : ''}`}
              style={{
                left: entity?.position?.x,
                top: entity?.position?.y,
                width: '300px',
                minHeight: '120px',
                zIndex: draggingEntity?.id === entity?.id ? 1000 : 1
              }}
              onMouseDown={(e) => handleEntityMouseDown(entity, e)}
              onClick={(e) => handleEntityClick(entity, e)}
            >
              {/* Entity Header */}
              <div 
                className={`p-3 border-b border-border bg-muted/30 rounded-t-lg ${
                  !connectionMode ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'
                }`}
                title={`${entity?.name} (${entity?.fields?.length || 0} fields)${entity?.description ? ` - ${entity.description}` : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon name="Table" size={16} className="text-primary" />
                    {editingEntityName?.id === entity?.id ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={editingEntityName.name}
                          onChange={(e) => setEditingEntityName(prev => ({ ...prev, name: e.target.value }))}
                          className="px-2 py-1 text-sm font-semibold bg-background border border-accent rounded text-text-primary"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleEntityNameSave();
                            if (e.key === 'Escape') handleEntityNameCancel();
                          }}
                        />
                        <button
                          onClick={handleEntityNameSave}
                          className="p-1 hover:bg-muted rounded text-success hover:text-success/80 transition-colors"
                          title="Save"
                        >
                          <Icon name="Check" size={12} />
                        </button>
                        <button
                          onClick={handleEntityNameCancel}
                          className="p-1 hover:bg-muted rounded text-error hover:text-error/80 transition-colors"
                          title="Cancel"
                        >
                          <Icon name="X" size={12} />
                        </button>
                      </div>
                    ) : (
                      <span 
                        className="font-semibold text-text-primary cursor-pointer hover:text-primary transition-colors"
                        onDoubleClick={() => handleEntityNameEdit(entity)}
                        title="Double-click to rename"
                      >
                        {entity?.name}
                      </span>
                    )}
                    {entity?.modified && (
                      <Icon name="Circle" size={8} className="text-warning animate-pulse" title="Modified" />
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-text-secondary bg-primary/10 text-primary px-2 py-1 rounded">
                      {entity?.type}
                    </span>
                    <span className="text-xs text-text-secondary bg-muted px-2 py-1 rounded">
                      {entity?.fields?.length || 0} fields
                    </span>
                    {!connectionMode && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddFieldToEntity(entity);
                        }}
                        className="p-1 hover:bg-muted rounded text-text-secondary hover:text-primary transition-colors"
                        title="Add Field"
                      >
                        <Icon name="Plus" size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Entity Fields */}
              <div 
                className="p-2 max-h-48 overflow-y-auto"
                onContextMenu={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleAddFieldToEntity(entity);
                }}
              >
                {entity?.fields?.map((field, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-1.5 px-2 text-sm hover:bg-muted/50 rounded group cursor-pointer"
                    onDoubleClick={() => handleFieldDoubleClick(field, entity)}
                    onContextMenu={(e) => handleFieldContextMenu(e, field, entity)}
                  >
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      <Icon 
                        name={getFieldIcon(field)} 
                        size={12} 
                        className={`flex-shrink-0 ${
                          field?.primaryKey ? 'text-warning' : 
                          field?.foreignKey ? 'text-accent': 'text-text-secondary'
                        }`}
                      />
                      <span className="font-medium text-text-primary truncate">
                        {field?.name}
                      </span>
                      {field?.autoIncrement && (
                        <Icon name="ArrowUp" size={10} className="text-success" title="Auto Increment" />
                      )}
                      {field?.unique && !field?.primaryKey && (
                        <Icon name="Hash" size={10} className="text-info" title="Unique" />
                      )}
                    </div>
                    <div className="flex items-center space-x-2 ml-2 flex-shrink-0">
                      <span className="text-xs text-text-secondary">
                        {field?.type?.toUpperCase()}
                        {field?.length && field?.type !== 'text' && field?.type !== 'longtext' && `(${field.length})`}
                      </span>
                      {field?.nullable === false && (
                        <span className="text-xs text-error font-medium">NOT NULL</span>
                      )}
                    </div>
                  </div>
                ))}
                {(!entity?.fields || entity?.fields?.length === 0) && (
                  <div 
                    className="text-center py-4 text-text-secondary cursor-pointer hover:bg-muted/50 rounded"
                    onClick={() => handleAddFieldToEntity(entity)}
                    title="Click to add first field"
                  >
                    <Icon name="Columns" size={16} className="mx-auto mb-1 opacity-50" />
                    <p className="text-xs">No fields defined</p>
                    <p className="text-xs text-accent mt-1">Click to add field</p>
                  </div>
                )}
              </div>

              {/* Connection Points */}
              <div className="absolute -left-2 top-1/2 w-4 h-4 bg-accent rounded-full border-2 border-surface opacity-0 group-hover:opacity-100 hover:opacity-100 transition-smooth cursor-pointer" 
                   title="Connection point" />
              <div className="absolute -right-2 top-1/2 w-4 h-4 bg-accent rounded-full border-2 border-surface opacity-0 group-hover:opacity-100 hover:opacity-100 transition-smooth cursor-pointer"
                   title="Connection point" />
              
              {/* Drag handle indicator */}
              {!connectionMode && (
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-60 transition-smooth">
                  <Icon name="Move" size={14} className="text-text-secondary" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Canvas Controls */}
      <div className="absolute bottom-6 right-6 flex flex-col space-y-2">
        <div className="bg-surface border border-border rounded-lg shadow-depth p-2">
          <div className="flex flex-col space-y-1">
            <Button
              variant="ghost"
              size="sm"
              iconName="ZoomIn"
              iconSize={16}
              onClick={handleZoomIn}
              title="Zoom In (Ctrl++)"
            />
            <Button
              variant="ghost"
              size="sm"
              iconName="ZoomOut"
              iconSize={16}
              onClick={handleZoomOut}
              title="Zoom Out (Ctrl+-)"
            />
            <Button
              variant="ghost"
              size="sm"
              iconName="Maximize2"
              iconSize={16}
              onClick={handleZoomFit}
              title="Fit to Screen (Ctrl+0)"
            />
          </div>
        </div>
        
        <div className="bg-surface border border-border rounded-lg shadow-depth p-2">
          <div className="text-xs text-text-secondary text-center">
            {Math.round(zoom * 100)}%
          </div>
        </div>
      </div>
      {/* Connection Mode Indicator */}
      {connectionMode && (
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-accent text-accent-foreground px-4 py-2 rounded-lg shadow-depth">
          <div className="flex items-center space-x-2">
            <Icon name="GitBranch" size={16} />
            <span className="text-sm font-medium">
              {connectionStart ? 'Select target entity' : 'Select source entity'}
            </span>
          </div>
        </div>
      )}
      {/* Empty State */}
      {allEntities?.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <Icon name="Database" size={64} className="mx-auto mb-4 text-text-secondary opacity-50" />
            <h3 className="text-lg font-medium text-text-primary mb-2">No entities in schema</h3>
            <p className="text-text-secondary mb-4">
              Drag entities from the sidebar or create new ones to get started
            </p>
            <Button
              variant="default"
              iconName="Plus"
              iconPosition="left"
              onClick={() => onEntityAdd && onEntityAdd({
                id: `entity-${Date.now()}`,
                name: 'new_entity',
                type: 'table',
                position: { x: 200, y: 200 },
                fields: [
                  { name: 'id', type: 'bigint', primaryKey: true }
                ]
              })}
            >
              Add First Entity
            </Button>
          </div>
        </div>
      )}

      {/* Field Context Menu */}
      {showFieldContextMenu && contextMenuField && (
        <div 
          className="fixed bg-surface border border-border rounded-lg shadow-depth py-2 z-[2000] min-w-48"
          style={{
            left: contextMenuPosition.x,
            top: contextMenuPosition.y
          }}
        >
          <div className="px-3 py-2 border-b border-border">
            <div className="text-sm font-medium text-text-primary">{contextMenuField.name}</div>
            <div className="text-xs text-text-secondary">{contextMenuField.type}</div>
          </div>
          
          <div className="py-1">
            <button
              className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center space-x-2"
              onClick={() => {
                if (contextMenuField && onEntityUpdate) {
                  const entityToUpdate = allEntities.find(e => e.id === contextMenuField.entityId);
                  if (entityToUpdate) {
                    const newField = {
                      id: `field-${Date.now()}`,
                      name: 'new_field',
                      type: 'varchar',
                      nullable: true,
                      primaryKey: false,
                      unique: false,
                      autoIncrement: false,
                      length: 255,
                      defaultValue: '',
                      comment: ''
                    };
                    
                    onEntityUpdate({
                      ...entityToUpdate,
                      fields: [...entityToUpdate.fields, newField]
                    });
                  }
                }
                closeContextMenu();
              }}
            >
              <Icon name="Plus" size={14} />
              <span>Add Field</span>
            </button>
            <button
              className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center space-x-2"
              onClick={() => {
                setEditingField(contextMenuField);
                closeContextMenu();
              }}
            >
              <Icon name="Edit" size={14} />
              <span>Edit Field</span>
            </button>
            <button
              className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center space-x-2"
              onClick={() => {
                // Duplicate field logic
                if (contextMenuField && onEntityUpdate) {
                  const entityToUpdate = allEntities.find(e => e.id === contextMenuField.entityId);
                  if (entityToUpdate) {
                    const duplicatedField = {
                      ...contextMenuField,
                      id: `field-${Date.now()}`,
                      name: `${contextMenuField.name}_copy`
                    };
                    
                    onEntityUpdate({
                      ...entityToUpdate,
                      fields: [...entityToUpdate.fields, duplicatedField]
                    });
                  }
                }
                closeContextMenu();
              }}
            >
              <Icon name="Copy" size={14} />
              <span>Duplicate Field</span>
            </button>
            <button
              className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center space-x-2 text-error hover:bg-error/10"
              onClick={() => {
                // Delete field logic
                if (contextMenuField && onEntityUpdate) {
                  const entityToUpdate = allEntities.find(e => e.id === contextMenuField.entityId);
                  if (entityToUpdate) {
                    onEntityUpdate({
                      ...entityToUpdate,
                      fields: entityToUpdate.fields.filter(f => f.id !== contextMenuField.id)
                    });
                  }
                }
                closeContextMenu();
              }}
            >
              <Icon name="Trash2" size={14} />
              <span>Delete Field</span>
            </button>
          </div>
        </div>
      )}

      {/* Field Editing Dialog */}
      {editingField && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[2000]">
          <div className="bg-surface border border-border rounded-lg shadow-depth p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary">Edit Field</h3>
              <Button
                variant="ghost"
                size="sm"
                iconName="X"
                iconSize={16}
                onClick={() => setEditingField(null)}
              />
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Field Name</label>
                <input
                  type="text"
                  value={editingField.name || ''}
                  onChange={(e) => setEditingField(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-text-primary"
                  placeholder="field_name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Field Type</label>
                <select
                  value={editingField.type || 'varchar'}
                  onChange={(e) => setEditingField(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-text-primary"
                >
                  {fieldTypes?.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Length</label>
                  <input
                    type="text"
                    value={editingField.length || ''}
                    onChange={(e) => setEditingField(prev => ({ ...prev, length: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-text-primary"
                    placeholder="255"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Default Value</label>
                  <input
                    type="text"
                    value={editingField.defaultValue || ''}
                    onChange={(e) => setEditingField(prev => ({ ...prev, defaultValue: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-text-primary"
                    placeholder="NULL"
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={editingField.nullable !== false}
                    onChange={(e) => setEditingField(prev => ({ ...prev, nullable: e.target.checked }))}
                    className="text-accent"
                  />
                  <span className="text-sm text-text-primary">Nullable</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={editingField.primaryKey === true}
                    onChange={(e) => setEditingField(prev => ({ ...prev, primaryKey: e.target.checked }))}
                    className="text-accent"
                  />
                  <span className="text-sm text-text-primary">Primary Key</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={editingField.unique === true}
                    onChange={(e) => setEditingField(prev => ({ ...prev, unique: e.target.checked }))}
                    className="text-accent"
                  />
                  <span className="text-sm text-text-primary">Unique</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={editingField.autoIncrement === true}
                    onChange={(e) => setEditingField(prev => ({ ...prev, autoIncrement: e.target.checked }))}
                    className="text-accent"
                  />
                  <span className="text-sm text-text-primary">Auto Increment</span>
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">Comment</label>
                <input
                  type="text"
                  value={editingField.comment || ''}
                  onChange={(e) => setEditingField(prev => ({ ...prev, comment: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-text-primary"
                  placeholder="Field description"
                />
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingField(null)}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                iconName="Save"
                iconPosition="left"
                onClick={() => handleFieldUpdate(editingField.id, editingField)}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Relationship Type Selection Dialog */}
      {showRelationshipDialog && pendingConnection && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[2000]">
          <div className="bg-surface border border-border rounded-lg shadow-depth p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <Icon name="GitBranch" size={24} className="text-accent" />
              <h3 className="text-lg font-semibold text-text-primary">Define Relationship</h3>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-text-secondary mb-3">
                Creating connection from <strong>{pendingConnection.from.name}</strong> to <strong>{pendingConnection.to.name}</strong>
              </p>
              
              <div className="space-y-3">
                {relationshipTypes.map((type) => (
                  <label key={type.value} className="flex items-start space-x-3 p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer">
                    <input
                      type="radio"
                      name="relationshipType"
                      value={type.value}
                      checked={selectedRelationshipType === type.value}
                      onChange={(e) => setSelectedRelationshipType(e.target.value)}
                      className="mt-1 text-accent"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-text-primary">{type.label}</div>
                      <div className="text-sm text-text-secondary">{type.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancelConnection}
              >
                Cancel
              </Button>
              <Button
                variant="default"
                size="sm"
                iconName="GitBranch"
                iconPosition="left"
                onClick={handleCreateConnection}
              >
                Create Connection
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CanvasWorkspace;