import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ConnectionProfileCard = ({ 
  profile, 
  isSelected = false, 
  onSelect, 
  onTest, 
  onDuplicate, 
  onDelete 
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'text-success';
      case 'disconnected': return 'text-error';
      case 'testing': return 'text-warning';
      default: return 'text-text-secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected': return 'CheckCircle';
      case 'disconnected': return 'XCircle';
      case 'testing': return 'Clock';
      default: return 'Circle';
    }
  };

  const getDatabaseIcon = (type) => {
    const icons = {
      postgresql: 'Database',
      mysql: 'Database',
      sqlite: 'HardDrive',
      mongodb: 'Layers',
      firebase: 'Flame',
      supabase: 'Zap',
      redis: 'Cpu',
      mssql: 'Server'
    };
    return icons?.[type] || 'Database';
  };

  const getEnvironmentColor = (env) => {
    switch (env) {
      case 'production': return 'bg-error/10 text-error';
      case 'staging': return 'bg-warning/10 text-warning';
      case 'development': return 'bg-success/10 text-success';
      default: return 'bg-muted text-text-secondary';
    }
  };

  return (
    <div 
      className={`p-4 border rounded-lg cursor-pointer transition-smooth hover:shadow-interactive ${
        isSelected 
          ? 'border-primary bg-primary/5 shadow-interactive' 
          : 'border-border bg-card hover:border-primary/50'
      }`}
      onClick={() => onSelect(profile)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="flex-shrink-0">
            <Icon 
              name={getDatabaseIcon(profile?.type)} 
              size={20} 
              className="text-primary" 
            />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-text-primary truncate">
              {profile?.name}
            </h3>
            <p className="text-sm text-text-secondary truncate">
              {profile?.host}:{profile?.port}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 ml-2">
          <Icon 
            name={getStatusIcon(profile?.status)} 
            size={16} 
            className={getStatusColor(profile?.status)}
          />
        </div>
      </div>
      {/* Environment & Type */}
      <div className="flex items-center justify-between mb-3">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEnvironmentColor(profile?.environment)}`}>
          {profile?.environment}
        </span>
        <span className="text-xs text-text-secondary uppercase font-medium">
          {profile?.type}
        </span>
      </div>
      {/* Last Tested */}
      <div className="flex items-center justify-between text-xs text-text-secondary mb-3">
        <span>Last tested:</span>
        <span>{profile?.lastTested}</span>
      </div>
      {/* Actions */}
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="xs"
          iconName="Play"
          iconSize={12}
          onClick={(e) => {
            e?.stopPropagation();
            onTest(profile);
          }}
          disabled={profile?.status === 'testing'}
        >
          Test
        </Button>
        
        <Button
          variant="ghost"
          size="xs"
          iconName="Copy"
          iconSize={12}
          onClick={(e) => {
            e?.stopPropagation();
            onDuplicate(profile);
          }}
        />
        
        <Button
          variant="ghost"
          size="xs"
          iconName="Trash2"
          iconSize={12}
          onClick={(e) => {
            e?.stopPropagation();
            onDelete(profile);
          }}
          className="text-error hover:text-error"
        />
      </div>
    </div>
  );
};

export default ConnectionProfileCard;