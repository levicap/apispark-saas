import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const BulkActions = ({ selectedProjects, onBulkAction, onClearSelection }) => {
  const [selectedAction, setSelectedAction] = useState('');

  const actionOptions = [
    { value: '', label: 'Select action...' },
    { value: 'duplicate', label: 'Duplicate Projects' },
    { value: 'archive', label: 'Archive Projects' },
    { value: 'delete', label: 'Delete Projects' },
    { value: 'export', label: 'Export Projects' },
    { value: 'share', label: 'Share Projects' }
  ];

  const handleExecuteAction = () => {
    if (selectedAction && selectedProjects?.length > 0) {
      onBulkAction(selectedAction, selectedProjects);
      setSelectedAction('');
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'duplicate': return 'Copy';
      case 'archive': return 'Archive';
      case 'delete': return 'Trash2';
      case 'export': return 'Download';
      case 'share': return 'Share2';
      default: return 'Play';
    }
  };

  const getActionVariant = (action) => {
    switch (action) {
      case 'delete': return 'destructive';
      case 'archive': return 'secondary';
      default: return 'default';
    }
  };

  if (selectedProjects?.length === 0) {
    return null;
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Icon name="CheckSquare" size={20} className="text-primary" />
            <span className="font-medium text-foreground">
              {selectedProjects?.length} project{selectedProjects?.length !== 1 ? 's' : ''} selected
            </span>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            iconName="X"
            iconSize={16}
          >
            Clear Selection
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-48">
            <Select
              options={actionOptions}
              value={selectedAction}
              onChange={setSelectedAction}
              placeholder="Select action..."
            />
          </div>
          
          <Button
            variant={getActionVariant(selectedAction)}
            onClick={handleExecuteAction}
            disabled={!selectedAction}
            iconName={getActionIcon(selectedAction)}
            iconSize={16}
          >
            Execute
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BulkActions;