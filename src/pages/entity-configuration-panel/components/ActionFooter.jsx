import React from 'react';
import Button from '../../../components/ui/Button';

const ActionFooter = ({ 
  onSave, 
  onCancel, 
  onDelete, 
  hasChanges = false,
  isSaving = false 
}) => {
  return (
    <div className="flex items-center justify-between p-6 border-t border-border bg-muted/30">
      <div className="flex items-center space-x-3">
        <Button
          variant="outline"
          iconName="Trash2"
          iconPosition="left"
          onClick={onDelete}
          className="text-error hover:text-error"
        >
          Delete Entity
        </Button>
        
        {hasChanges && (
          <div className="flex items-center space-x-2 text-sm text-warning">
            <div className="w-2 h-2 bg-warning rounded-full"></div>
            <span>Unsaved changes</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-3">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isSaving}
        >
          Cancel
        </Button>
        <Button
          variant="default"
          iconName="Save"
          iconPosition="left"
          onClick={onSave}
          loading={isSaving}
          disabled={!hasChanges}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default ActionFooter;