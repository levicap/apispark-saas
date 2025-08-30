import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TableBlock = ({ 
  table, 
  position, 
  onUpdate, 
  onDelete, 
  onConnect, 
  isSelected, 
  onSelect,
  scale = 1,
  connections = []
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tableName, setTableName] = useState(table?.name);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [size, setSize] = useState({ width: table?.width || 280, height: table?.height || 200 });
  const tableRef = useRef(null);

  const dataTypes = [
    'VARCHAR(255)', 'TEXT', 'INT', 'BIGINT', 'DECIMAL', 'FLOAT', 
    'BOOLEAN', 'DATE', 'DATETIME', 'TIMESTAMP', 'JSON', 'UUID'
  ];

  const handleMouseDown = (e) => {
    if (e?.target?.closest('.field-row') || e?.target?.closest('.resize-handle')) return;
    
    setIsDragging(true);
    setDragStart({
      x: e?.clientX - position?.x,
      y: e?.clientY - position?.y
    });
    onSelect(table?.id);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const newPosition = {
      x: e?.clientX - dragStart?.x,
      y: e?.clientY - dragStart?.y
    };
    
    onUpdate(table?.id, { ...table, position: newPosition });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  const handleTableNameSave = () => {
    if (tableName?.trim()) {
      onUpdate(table?.id, { ...table, name: tableName?.trim() });
      setIsEditing(false);
    }
  };

  const handleFieldUpdate = (fieldIndex, updates) => {
    const updatedFields = [...table?.fields];
    updatedFields[fieldIndex] = { ...updatedFields?.[fieldIndex], ...updates };
    onUpdate(table?.id, { ...table, fields: updatedFields });
  };

  const handleAddField = () => {
    const newField = {
      id: Date.now(),
      name: 'new_field',
      type: 'VARCHAR(255)',
      nullable: true,
      primaryKey: false,
      unique: false,
      defaultValue: ''
    };
    onUpdate(table?.id, { ...table, fields: [...table?.fields, newField] });
  };

  const handleDeleteField = (fieldIndex) => {
    const updatedFields = table?.fields?.filter((_, index) => index !== fieldIndex);
    onUpdate(table?.id, { ...table, fields: updatedFields });
  };

  const getConnectionPoints = () => {
    return {
      top: { x: position?.x + size?.width / 2, y: position?.y },
      right: { x: position?.x + size?.width, y: position?.y + size?.height / 2 },
      bottom: { x: position?.x + size?.width / 2, y: position?.y + size?.height },
      left: { x: position?.x, y: position?.y + size?.height / 2 }
    };
  };

  return (
    <div
      ref={tableRef}
      className={`absolute bg-white border-2 rounded-lg shadow-elevation-2 cursor-move select-none transition-all duration-200 ${
        isSelected ? 'border-primary shadow-elevation-3' : 'border-border hover:border-secondary'
      }`}
      style={{
        left: position?.x,
        top: position?.y,
        width: size?.width,
        minHeight: size?.height,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        zIndex: isSelected ? 20 : 10
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Connection Points */}
      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full opacity-0 hover:opacity-100 transition-opacity cursor-crosshair" />
      <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-primary rounded-full opacity-0 hover:opacity-100 transition-opacity cursor-crosshair" />
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full opacity-0 hover:opacity-100 transition-opacity cursor-crosshair" />
      <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-primary rounded-full opacity-0 hover:opacity-100 transition-opacity cursor-crosshair" />
      {/* Table Header */}
      <div className="flex items-center justify-between p-3 bg-muted rounded-t-lg border-b border-border">
        {isEditing ? (
          <input
            type="text"
            value={tableName}
            onChange={(e) => setTableName(e?.target?.value)}
            onBlur={handleTableNameSave}
            onKeyDown={(e) => e?.key === 'Enter' && handleTableNameSave()}
            className="flex-1 px-2 py-1 text-sm font-semibold bg-white border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            autoFocus
          />
        ) : (
          <h3 
            className="flex-1 text-sm font-semibold text-foreground cursor-text"
            onClick={() => setIsEditing(true)}
          >
            {table?.name}
          </h3>
        )}
        
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e?.stopPropagation();
              handleAddField();
            }}
            className="w-6 h-6"
          >
            <Icon name="Plus" size={12} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e?.stopPropagation();
              onDelete(table?.id);
            }}
            className="w-6 h-6 text-error hover:text-error"
          >
            <Icon name="Trash2" size={12} />
          </Button>
        </div>
      </div>
      {/* Fields List */}
      <div className="p-2 space-y-1 max-h-64 overflow-y-auto">
        {table?.fields?.map((field, index) => (
          <div key={field?.id} className="field-row group flex items-center space-x-2 p-2 hover:bg-muted rounded text-xs">
            <div className="flex items-center space-x-1 flex-1 min-w-0">
              {field?.primaryKey && (
                <Icon name="Key" size={10} className="text-warning flex-shrink-0" />
              )}
              <input
                type="text"
                value={field?.name}
                onChange={(e) => handleFieldUpdate(index, { name: e?.target?.value })}
                className="flex-1 min-w-0 px-1 py-0.5 bg-transparent border-none focus:outline-none focus:bg-white focus:border focus:border-primary rounded text-xs"
              />
            </div>
            
            <select
              value={field?.type}
              onChange={(e) => handleFieldUpdate(index, { type: e?.target?.value })}
              className="px-1 py-0.5 text-xs bg-transparent border-none focus:outline-none focus:bg-white focus:border focus:border-primary rounded"
            >
              {dataTypes?.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            <div className="flex items-center space-x-1">
              {!field?.nullable && (
                <span className="text-error text-xs">*</span>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteField(index)}
                className="w-4 h-4 opacity-0 group-hover:opacity-100 text-error hover:text-error"
              >
                <Icon name="X" size={8} />
              </Button>
            </div>
          </div>
        ))}
        
        {table?.fields?.length === 0 && (
          <div className="text-center py-4 text-muted-foreground text-xs">
            No fields yet. Click + to add fields.
          </div>
        )}
      </div>
      {/* Resize Handle */}
      <div
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize opacity-0 hover:opacity-100 transition-opacity"
        onMouseDown={(e) => {
          e?.stopPropagation();
          setIsResizing(true);
        }}
      >
        <Icon name="GripHorizontal" size={12} className="text-muted-foreground" />
      </div>
    </div>
  );
};

export default TableBlock;