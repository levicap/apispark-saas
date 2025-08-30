import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';

const QuickActionToolbar = ({ context = 'builder', selectedElement = null, onAction }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [position, setPosition] = useState({ x: 20, y: 100 });
  const [isDragging, setIsDragging] = useState(false);

  // Context-specific action sets
  const actionSets = {
    builder: [
      { id: 'add-endpoint', icon: 'Plus', label: 'Add Endpoint', shortcut: 'Ctrl+N' },
      { id: 'duplicate', icon: 'Copy', label: 'Duplicate', shortcut: 'Ctrl+D' },
      { id: 'delete', icon: 'Trash2', label: 'Delete', shortcut: 'Del' },
      { id: 'undo', icon: 'Undo', label: 'Undo', shortcut: 'Ctrl+Z' },
      { id: 'redo', icon: 'Redo', label: 'Redo', shortcut: 'Ctrl+Y' },
      { id: 'zoom-in', icon: 'ZoomIn', label: 'Zoom In', shortcut: 'Ctrl++' },
      { id: 'zoom-out', icon: 'ZoomOut', label: 'Zoom Out', shortcut: 'Ctrl+-' },
    ],
    database: [
      { id: 'add-table', icon: 'Plus', label: 'Add Table', shortcut: 'Ctrl+T' },
      { id: 'add-relation', icon: 'Link', label: 'Add Relation', shortcut: 'Ctrl+R' },
      { id: 'edit-schema', icon: 'Edit', label: 'Edit Schema', shortcut: 'Ctrl+E' },
      { id: 'export-sql', icon: 'Download', label: 'Export SQL', shortcut: 'Ctrl+S' },
      { id: 'validate', icon: 'CheckCircle', label: 'Validate', shortcut: 'Ctrl+V' },
    ],
    documentation: [
      { id: 'generate-docs', icon: 'FileText', label: 'Generate Docs', shortcut: 'Ctrl+G' },
      { id: 'export-pdf', icon: 'Download', label: 'Export PDF', shortcut: 'Ctrl+P' },
      { id: 'test-endpoint', icon: 'Play', label: 'Test Endpoint', shortcut: 'Ctrl+T' },
      { id: 'copy-curl', icon: 'Terminal', label: 'Copy cURL', shortcut: 'Ctrl+C' },
    ]
  };

  const currentActions = actionSets[context] || actionSets.builder;

  // Filter actions based on selected element
  const getAvailableActions = () => {
    if (!selectedElement) {
      return currentActions.filter(action => 
        !['duplicate', 'delete', 'edit-schema'].includes(action.id)
      );
    }
    return currentActions;
  };

  const handleAction = (actionId) => {
    if (onAction) {
      onAction(actionId, selectedElement);
    }
    console.log(`Action: ${actionId}`, selectedElement);
  };

  const handleKeyboardShortcuts = (e) => {
    const action = currentActions.find(action => {
      const shortcut = action.shortcut.toLowerCase();
      const key = e.key.toLowerCase();
      const ctrlKey = e.ctrlKey || e.metaKey;
      
      if (shortcut.includes('ctrl+')) {
        const shortcutKey = shortcut.replace('ctrl+', '');
        return ctrlKey && (key === shortcutKey || key === shortcutKey.replace('+', '='));
      }
      return key === shortcut;
    });

    if (action) {
      e.preventDefault();
      handleAction(action.id);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyboardShortcuts);
    return () => document.removeEventListener('keydown', handleKeyboardShortcuts);
  }, [currentActions]);

  const handleMouseDown = (e) => {
    if (e.target.closest('.toolbar-drag-handle')) {
      setIsDragging(true);
      const rect = e.currentTarget.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const offsetY = e.clientY - rect.top;

      const handleMouseMove = (e) => {
        setPosition({
          x: e.clientX - offsetX,
          y: e.clientY - offsetY
        });
      };

      const handleMouseUp = () => {
        setIsDragging(false);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
  };

  if (!isVisible) return null;

  const availableActions = getAvailableActions();

  return (
    <>
      {/* Desktop Floating Toolbar */}
      <div
        className="hidden lg:block fixed bg-surface border border-border rounded-lg shadow-lg z-1000 select-none"
        style={{ left: position.x, top: position.y }}
        onMouseDown={handleMouseDown}
      >
        {/* Drag Handle */}
        <div className="toolbar-drag-handle flex items-center justify-between px-3 py-2 border-b border-border cursor-move bg-secondary-50 rounded-t-lg">
          <span className="text-xs font-medium text-text-secondary uppercase tracking-wide">
            Quick Actions
          </span>
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 hover:bg-secondary-100 rounded transition-all duration-150 ease-out"
          >
            <Icon name="X" size={12} />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="p-2 space-y-1">
          {availableActions.map((action) => (
            <button
              key={action.id}
              onClick={() => handleAction(action.id)}
              className="w-full flex items-center justify-between px-3 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-secondary-50 rounded-md transition-all duration-150 ease-out group"
              title={`${action.label} (${action.shortcut})`}
            >
              <div className="flex items-center space-x-2">
                <Icon name={action.icon} size={16} />
                <span>{action.label}</span>
              </div>
              <span className="text-xs text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                {action.shortcut}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Bottom Toolbar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-border z-1000 safe-area-pb">
        <div className="flex items-center justify-around px-4 py-3">
          {availableActions.slice(0, 5).map((action) => (
            <button
              key={action.id}
              onClick={() => handleAction(action.id)}
              className="flex flex-col items-center space-y-1 p-2 text-text-secondary hover:text-text-primary transition-all duration-150 ease-out"
            >
              <Icon name={action.icon} size={20} />
              <span className="text-xs">{action.label.split(' ')[0]}</span>
            </button>
          ))}
          
          {availableActions.length > 5 && (
            <button className="flex flex-col items-center space-y-1 p-2 text-text-secondary hover:text-text-primary transition-all duration-150 ease-out">
              <Icon name="MoreHorizontal" size={20} />
              <span className="text-xs">More</span>
            </button>
          )}
        </div>
      </div>

      {/* Restore Button (when toolbar is hidden) */}
      {!isVisible && (
        <button
          onClick={() => setIsVisible(true)}
          className="hidden lg:block fixed bottom-6 right-6 w-12 h-12 bg-primary text-white rounded-full shadow-lg hover:bg-primary-700 transition-all duration-150 ease-out z-1000"
          title="Show Quick Actions"
        >
          <Icon name="Wrench" size={20} />
        </button>
      )}
    </>
  );
};

export default QuickActionToolbar;