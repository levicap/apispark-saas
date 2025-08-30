import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const EntityHeader = ({ 
  entityName = '',
  databaseType = 'PostgreSQL',
  onNameChange,
  onDuplicate,
  onDelete,
  onClose 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(entityName);

  const handleSaveName = () => {
    if (tempName?.trim()) {
      onNameChange(tempName?.trim());
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setTempName(entityName);
    setIsEditing(false);
  };

  const getDatabaseIcon = (type) => {
    const icons = {
      'PostgreSQL': 'Database',
      'MySQL': 'Database',
      'SQLite': 'HardDrive',
      'MongoDB': 'Layers',
      'Firebase': 'Flame',
      'Supabase': 'Zap'
    };
    return icons?.[type] || 'Database';
  };

  return (
    <div className="flex items-center justify-between p-6 border-b border-border bg-surface">
      <div className="flex items-center space-x-4 flex-1">
        <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
          <Icon name="Table" size={20} className="text-primary" />
        </div>
        
        <div className="flex-1">
          {isEditing ? (
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e?.target?.value)}
                placeholder="Enter entity name"
                className="text-lg font-semibold"
                onKeyDown={(e) => {
                  if (e?.key === 'Enter') handleSaveName();
                  if (e?.key === 'Escape') handleCancelEdit();
                }}
                autoFocus
              />
              <Button
                variant="ghost"
                size="sm"
                iconName="Check"
                iconSize={16}
                onClick={handleSaveName}
                className="text-success"
              />
              <Button
                variant="ghost"
                size="sm"
                iconName="X"
                iconSize={16}
                onClick={handleCancelEdit}
                className="text-error"
              />
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-semibold text-text-primary">
                {entityName || 'Untitled Entity'}
              </h1>
              <Button
                variant="ghost"
                size="sm"
                iconName="Edit2"
                iconSize={14}
                onClick={() => setIsEditing(true)}
                className="opacity-60 hover:opacity-100"
              />
            </div>
          )}
          
          <div className="flex items-center space-x-2 mt-1">
            <Icon name={getDatabaseIcon(databaseType)} size={14} className="text-text-secondary" />
            <span className="text-sm text-text-secondary">{databaseType}</span>
            <span className="text-xs text-text-secondary bg-muted px-2 py-1 rounded">
              Entity
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          iconName="Copy"
          iconSize={16}
          onClick={onDuplicate}
          title="Duplicate Entity"
        />
        <Button
          variant="ghost"
          size="sm"
          iconName="Trash2"
          iconSize={16}
          onClick={onDelete}
          className="text-error hover:text-error"
          title="Delete Entity"
        />
        <div className="w-px h-6 bg-border mx-2" />
        <Button
          variant="ghost"
          size="sm"
          iconName="X"
          iconSize={18}
          onClick={onClose}
          title="Close Panel"
        />
      </div>
    </div>
  );
};

export default EntityHeader;