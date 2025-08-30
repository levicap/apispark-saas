import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import TableBlock from './TableBlock';

const ERDCanvas = ({ 
  tables = [], 
  onUpdateTable, 
  onDeleteTable, 
  selectedTable, 
  onSelectTable,
  selectedTool,
  onCreateTable
}) => {
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [connections, setConnections] = useState([]);
  const canvasRef = useRef(null);

  const handleWheel = (e) => {
    e?.preventDefault();
    const delta = e?.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.max(0.1, Math.min(3, scale * delta));
    setScale(newScale);
  };

  const handleMouseDown = (e) => {
    if (selectedTool === 'pan' || e?.button === 1) { // Middle mouse button or pan tool
      setIsPanning(true);
      setPanStart({
        x: e?.clientX - pan?.x,
        y: e?.clientY - pan?.y
      });
    } else if (selectedTool === 'table') {
      // Create new table at click position
      const rect = canvasRef?.current?.getBoundingClientRect();
      const x = (e?.clientX - rect?.left - pan?.x) / scale;
      const y = (e?.clientY - rect?.top - pan?.y) / scale;
      onCreateTable({ x, y });
    }
  };

  const handleMouseMove = (e) => {
    if (isPanning) {
      setPan({
        x: e?.clientX - panStart?.x,
        y: e?.clientY - panStart?.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  useEffect(() => {
    if (isPanning) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isPanning, panStart]);

  const handleZoomIn = () => {
    setScale(prev => Math.min(3, prev * 1.2));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(0.1, prev / 1.2));
  };

  const handleResetView = () => {
    setScale(1);
    setPan({ x: 0, y: 0 });
  };

  const handleFitToScreen = () => {
    if (tables?.length === 0) return;

    const padding = 50;
    const minX = Math.min(...tables?.map(t => t?.position?.x)) - padding;
    const minY = Math.min(...tables?.map(t => t?.position?.y)) - padding;
    const maxX = Math.max(...tables?.map(t => t?.position?.x + (t?.width || 280))) + padding;
    const maxY = Math.max(...tables?.map(t => t?.position?.y + (t?.height || 200))) + padding;

    const contentWidth = maxX - minX;
    const contentHeight = maxY - minY;
    const canvasWidth = canvasRef?.current?.clientWidth;
    const canvasHeight = canvasRef?.current?.clientHeight;

    const scaleX = canvasWidth / contentWidth;
    const scaleY = canvasHeight / contentHeight;
    const newScale = Math.min(scaleX, scaleY, 1);

    setScale(newScale);
    setPan({
      x: (canvasWidth - contentWidth * newScale) / 2 - minX * newScale,
      y: (canvasHeight - contentHeight * newScale) / 2 - minY * newScale
    });
  };

  const getCursorStyle = () => {
    if (selectedTool === 'pan' || isPanning) return 'grab';
    if (selectedTool === 'table') return 'crosshair';
    return 'default';
  };

  return (
    <div className="flex-1 relative bg-background overflow-hidden">
      {/* Canvas */}
      <div
        ref={canvasRef}
        className="w-full h-full relative"
        style={{ cursor: getCursorStyle() }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
      >
        {/* Grid Background */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, #e2e8f0 1px, transparent 1px),
              linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
            `,
            backgroundSize: `${20 * scale}px ${20 * scale}px`,
            transform: `translate(${pan?.x % (20 * scale)}px, ${pan?.y % (20 * scale)}px)`
          }}
        />

        {/* Canvas Content */}
        <div
          className="absolute inset-0"
          style={{
            transform: `translate(${pan?.x}px, ${pan?.y}px) scale(${scale})`,
            transformOrigin: '0 0'
          }}
        >
          {/* Tables */}
          {tables?.map((table) => (
            <TableBlock
              key={table?.id}
              table={table}
              position={table?.position}
              onUpdate={onUpdateTable}
              onDelete={onDeleteTable}
              onConnect={() => {}}
              isSelected={selectedTable?.id === table?.id}
              onSelect={onSelectTable}
              scale={1} // Individual table scale is handled by canvas transform
              connections={connections}
            />
          ))}

          {/* Connection Lines */}
          <svg className="absolute inset-0 pointer-events-none" style={{ overflow: 'visible' }}>
            {connections?.map((connection, index) => (
              <line
                key={index}
                x1={connection?.from?.x}
                y1={connection?.from?.y}
                x2={connection?.to?.x}
                y2={connection?.to?.y}
                stroke="var(--color-primary)"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
              />
            ))}
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
                  fill="var(--color-primary)"
                />
              </marker>
            </defs>
          </svg>
        </div>

        {/* Empty State */}
        {tables?.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-8">
              <Icon name="Database" size={64} className="text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Start Building Your Database
              </h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-md">
                Create your first table by clicking the "Add Table" tool in the left toolbar, 
                then click anywhere on the canvas to place it.
              </p>
              <Button
                variant="default"
                onClick={() => onCreateTable({ x: 100, y: 100 })}
                iconName="Plus"
                iconPosition="left"
              >
                Create First Table
              </Button>
            </div>
          </div>
        )}
      </div>
      {/* Canvas Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
        <div className="bg-surface border border-border rounded-lg shadow-elevation-2 p-2 flex flex-col space-y-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomIn}
            className="w-8 h-8"
          >
            <Icon name="Plus" size={14} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleZoomOut}
            className="w-8 h-8"
          >
            <Icon name="Minus" size={14} />
          </Button>
          <div className="border-t border-border my-1" />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleResetView}
            className="w-8 h-8"
          >
            <Icon name="RotateCcw" size={14} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleFitToScreen}
            className="w-8 h-8"
          >
            <Icon name="Maximize2" size={14} />
          </Button>
        </div>
        
        {/* Scale Indicator */}
        <div className="bg-surface border border-border rounded px-2 py-1 text-xs text-muted-foreground">
          {Math.round(scale * 100)}%
        </div>
      </div>
      {/* Tool Indicator */}
      {selectedTool && selectedTool !== 'select' && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium">
          {selectedTool === 'table' && 'Click to add table'}
          {selectedTool === 'relationship' && 'Click tables to connect'}
          {selectedTool === 'pan' && 'Pan mode active'}
        </div>
      )}
    </div>
  );
};

export default ERDCanvas;