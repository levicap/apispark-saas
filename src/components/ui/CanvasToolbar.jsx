import React, { useState, useRef, useCallback, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const CanvasToolbar = ({ 
  onAddEntity,
  onToggleConnectionMode,
  onAlignEntities,
  onUndo,
  onRedo,
  onZoomIn,
  onZoomOut,
  onZoomFit,
  onToggleGrid,
  connectionMode = false,
  canUndo = false,
  canRedo = false,
  showGrid = true
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const toolbarRef = useRef(null);

  // Load saved position from localStorage
  useEffect(() => {
    const savedPosition = localStorage.getItem('canvasToolbarPosition');
    if (savedPosition) {
      try {
        setToolbarPosition(JSON.parse(savedPosition));
      } catch (e) {
        console.warn('Failed to parse saved toolbar position');
      }
    } else {
      // Default position (top-right)
      setToolbarPosition({ x: window.innerWidth - 100, y: 80 });
    }
  }, []);

  // Save position to localStorage
  const savePosition = useCallback((position) => {
    localStorage.setItem('canvasToolbarPosition', JSON.stringify(position));
  }, []);

  // Reset toolbar position to default
  const resetPosition = useCallback(() => {
    const defaultPosition = { x: window.innerWidth - 100, y: 80 };
    setToolbarPosition(defaultPosition);
    savePosition(defaultPosition);
  }, [savePosition]);

  // Keyboard shortcuts for toolbar positioning
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey) {
        switch (e.key) {
          case 'T':
            e.preventDefault();
            resetPosition();
            break;
          case 'H':
            e.preventDefault();
            setToolbarPosition(prev => ({ ...prev, x: 20 }));
            break;
          case 'J':
            e.preventDefault();
            setToolbarPosition(prev => ({ ...prev, y: window.innerHeight - 200 }));
            break;
          case 'K':
            e.preventDefault();
            setToolbarPosition(prev => ({ ...prev, y: 80 }));
            break;
          case 'L':
            e.preventDefault();
            setToolbarPosition(prev => ({ ...prev, x: window.innerWidth - 100 }));
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [resetPosition]);

  const handleMouseDown = (e) => {
    if (e.target.closest('button')) return; // Don't drag when clicking buttons
    
    setIsDragging(true);
    const rect = toolbarRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    
    // Constrain to viewport bounds
    const maxX = window.innerWidth - 80; // Toolbar width
    const maxY = window.innerHeight - 200; // Toolbar height
    
    const constrainedX = Math.max(0, Math.min(newX, maxX));
    const constrainedY = Math.max(0, Math.min(newY, maxY));
    
    setToolbarPosition({ x: constrainedX, y: constrainedY });
  }, [isDragging, dragOffset]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      savePosition(toolbarPosition);
    }
  }, [isDragging, toolbarPosition, savePosition]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const primaryActions = [
    {
      id: 'add-entity',
      label: 'Add Entity',
      icon: 'Plus',
      onClick: onAddEntity,
      variant: 'default'
    },
    {
      id: 'connection-mode',
      label: connectionMode ? 'Exit Connection' : 'Connect Entities',
      icon: connectionMode ? 'X' : 'GitBranch',
      onClick: onToggleConnectionMode,
      variant: connectionMode ? 'destructive' : 'outline',
      active: connectionMode
    }
  ];

  const secondaryActions = [
    {
      id: 'align',
      label: 'Align Entities',
      icon: 'AlignCenter',
      onClick: onAlignEntities
    },
    {
      id: 'undo',
      label: 'Undo',
      icon: 'Undo2',
      onClick: onUndo,
      disabled: !canUndo,
      shortcut: 'Ctrl+Z'
    },
    {
      id: 'redo',
      label: 'Redo',
      icon: 'Redo2',
      onClick: onRedo,
      disabled: !canRedo,
      shortcut: 'Ctrl+Y'
    },
    {
      id: 'zoom-in',
      label: 'Zoom In',
      icon: 'ZoomIn',
      onClick: onZoomIn,
      shortcut: 'Ctrl++'
    },
    {
      id: 'zoom-out',
      label: 'Zoom Out',
      icon: 'ZoomOut',
      onClick: onZoomOut,
      shortcut: 'Ctrl+-'
    },
    {
      id: 'zoom-fit',
      label: 'Fit to Screen',
      icon: 'Maximize2',
      onClick: onZoomFit,
      shortcut: 'Ctrl+0'
    },
    {
      id: 'toggle-grid',
      label: showGrid ? 'Hide Grid' : 'Show Grid',
      icon: 'Grid3X3',
      onClick: onToggleGrid,
      active: showGrid
    }
  ];

  return (
    <>
      {/* Desktop Toolbar */}
      <div 
        ref={toolbarRef}
        className="hidden md:block fixed z-150"
        style={{
          left: `${toolbarPosition.x}px`,
          top: `${toolbarPosition.y}px`
        }}
      >
        <div 
          className={`bg-surface border border-border rounded-lg shadow-depth p-2 transition-all duration-200 ${
            isDragging ? 'cursor-grabbing shadow-2xl scale-105' : 'cursor-grab hover:shadow-lg'
          }`}
          onMouseDown={handleMouseDown}
        >
          {/* Drag Handle */}
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-border">
            <div className="flex items-center space-x-2">
              <Icon name="GripVertical" size={14} className="text-text-secondary" />
              <span className="text-xs text-text-secondary font-medium">Toolbar</span>
            </div>
            <div className="flex items-center space-x-1">
              <button
                onClick={resetPosition}
                className="p-1 hover:bg-muted rounded text-text-secondary hover:text-text-primary transition-colors"
                title="Reset Position (Ctrl+Shift+T)"
              >
                <Icon name="RotateCcw" size={12} />
              </button>
              <Icon name="Move" size={14} className="text-text-secondary" />
            </div>
          </div>
          
          {/* Primary Actions */}
          <div className="flex flex-col space-y-2 mb-3">
            {primaryActions?.map((action) => (
              <Button
                key={action?.id}
                variant={action?.variant || 'outline'}
                size="sm"
                iconName={action?.icon}
                iconSize={16}
                onClick={action?.onClick}
                className={`justify-start ${action?.active ? 'ring-2 ring-accent' : ''}`}
                title={`${action?.label}${action?.shortcut ? ` (${action?.shortcut})` : ''}`}
              >
                {action?.label}
              </Button>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-border mb-3" />

          {/* Secondary Actions */}
          <div className="flex flex-col space-y-1">
            {secondaryActions?.map((action) => (
              <Button
                key={action?.id}
                variant="ghost"
                size="sm"
                iconName={action?.icon}
                iconSize={16}
                onClick={action?.onClick}
                disabled={action?.disabled}
                className={`justify-start ${action?.active ? 'bg-accent/10 text-accent' : ''}`}
                title={`${action?.label}${action?.shortcut ? ` (${action?.shortcut})` : ''}`}
              >
                {action?.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
      {/* Mobile Toolbar */}
      <div className="md:hidden fixed bottom-20 left-4 right-4 z-150">
        <div className="bg-surface border border-border rounded-lg shadow-depth">
          
          {/* Primary Actions Row */}
          <div className="flex items-center justify-center p-3 space-x-2">
            {primaryActions?.map((action) => (
              <Button
                key={action?.id}
                variant={action?.variant || 'outline'}
                size="sm"
                iconName={action?.icon}
                iconSize={18}
                onClick={action?.onClick}
                className={`flex-1 ${action?.active ? 'ring-2 ring-accent' : ''}`}
              >
                {action?.label}
              </Button>
            ))}
            
            <Button
              variant="ghost"
              size="sm"
              iconName={isExpanded ? 'ChevronDown' : 'ChevronUp'}
              iconSize={18}
              onClick={() => setIsExpanded(!isExpanded)}
            />
          </div>

          {/* Expanded Secondary Actions */}
          {isExpanded && (
            <div className="border-t border-border p-3">
              <div className="grid grid-cols-3 gap-2">
                {secondaryActions?.map((action) => (
                  <Button
                    key={action?.id}
                    variant="ghost"
                    size="sm"
                    iconName={action?.icon}
                    iconSize={16}
                    onClick={action?.onClick}
                    disabled={action?.disabled}
                    className={`flex flex-col items-center space-y-1 h-auto py-2 ${
                      action?.active ? 'bg-accent/10 text-accent' : ''
                    }`}
                  >
                    <Icon name={action?.icon} size={16} />
                    <span className="text-xs">{action?.label?.split(' ')?.[0]}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Keyboard Shortcuts Handler */}
      <div className="sr-only">
        <div>Keyboard shortcuts:</div>
        <div>Ctrl+Z: Undo</div>
        <div>Ctrl+Y: Redo</div>
        <div>Ctrl++: Zoom In</div>
        <div>Ctrl+-: Zoom Out</div>
        <div>Ctrl+0: Fit to Screen</div>
        <div>Ctrl+Shift+T: Reset Toolbar Position</div>
        <div>Ctrl+Shift+H: Move Toolbar Left</div>
        <div>Ctrl+Shift+J: Move Toolbar Bottom</div>
        <div>Ctrl+Shift+K: Move Toolbar Top</div>
        <div>Ctrl+Shift+L: Move Toolbar Right</div>
      </div>
    </>
  );
};

export default CanvasToolbar;