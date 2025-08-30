import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const BulkActionsBar = ({ selectedMembers, onBulkAction, onClearSelection }) => {
  const [bulkAction, setBulkAction] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const bulkActionOptions = [
    { value: '', label: 'Choose action...' },
    { value: 'change_role', label: 'Change Role' },
    { value: 'assign_projects', label: 'Assign to Projects' },
    { value: 'remove_projects', label: 'Remove from Projects' },
    { value: 'deactivate', label: 'Deactivate Members' },
    { value: 'remove', label: 'Remove Members' }
  ];

  const roleOptions = [
    { value: 'Owner', label: 'Owner' },
    { value: 'Editor', label: 'Editor' },
    { value: 'Viewer', label: 'Viewer' }
  ];

  const handleBulkAction = async () => {
    if (!bulkAction || selectedMembers?.length === 0) return;

    setIsProcessing(true);
    try {
      await onBulkAction(bulkAction, selectedMembers);
      setBulkAction('');
    } catch (error) {
      console.error('Bulk action failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getActionIcon = (action) => {
    const iconMap = {
      change_role: 'Shield',
      assign_projects: 'FolderPlus',
      remove_projects: 'FolderMinus',
      deactivate: 'UserX',
      remove: 'Trash2'
    };
    return iconMap?.[action] || 'Settings';
  };

  const getActionColor = (action) => {
    if (action === 'remove' || action === 'deactivate') {
      return 'destructive';
    }
    return 'default';
  };

  if (selectedMembers?.length === 0) {
    return null;
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Icon name="Users" size={20} className="text-primary" />
            <span className="font-medium text-foreground">
              {selectedMembers?.length} member{selectedMembers?.length !== 1 ? 's' : ''} selected
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Select
              options={bulkActionOptions}
              value={bulkAction}
              onChange={setBulkAction}
              placeholder="Choose action..."
              className="w-48"
            />
            
            {bulkAction && (
              <Button
                variant={getActionColor(bulkAction)}
                onClick={handleBulkAction}
                loading={isProcessing}
                iconName={getActionIcon(bulkAction)}
                iconPosition="left"
              >
                Apply Action
              </Button>
            )}
          </div>
        </div>
        
        <Button
          variant="ghost"
          onClick={onClearSelection}
          iconName="X"
          iconPosition="left"
        >
          Clear Selection
        </Button>
      </div>
      {/* Action-specific options */}
      {bulkAction === 'change_role' && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-foreground">New Role:</label>
            <Select
              options={roleOptions}
              value=""
              onChange={(value) => console.log('Role selected:', value)}
              placeholder="Select role..."
              className="w-32"
            />
          </div>
        </div>
      )}
      {(bulkAction === 'assign_projects' || bulkAction === 'remove_projects') && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-foreground">Projects:</label>
            <Select
              options={[
                { value: 'api-flow-v2', label: 'API Flow Designer v2.0' },
                { value: 'user-management', label: 'User Management System' },
                { value: 'payment-gateway', label: 'Payment Gateway API' }
              ]}
              value=""
              onChange={(value) => console.log('Project selected:', value)}
              placeholder="Select projects..."
              multiple
              className="w-64"
            />
          </div>
        </div>
      )}
      {(bulkAction === 'remove' || bulkAction === 'deactivate') && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="bg-warning/10 border border-warning/20 rounded-md p-3">
            <div className="flex items-start gap-2">
              <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
              <div>
                <p className="text-sm font-medium text-warning">
                  {bulkAction === 'remove' ? 'Remove Members' : 'Deactivate Members'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {bulkAction === 'remove' ?'This action will permanently remove the selected members from all projects. They will lose access immediately.' :'This action will deactivate the selected members. They will lose access but can be reactivated later.'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkActionsBar;