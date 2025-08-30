import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MigrationTimeline = ({ migrations, onSelectMigration, selectedMigration, onExecuteMigration, onRollbackMigration }) => {
  const [expandedMigrations, setExpandedMigrations] = useState(new Set());

  const toggleExpanded = (migrationId) => {
    const newExpanded = new Set(expandedMigrations);
    if (newExpanded?.has(migrationId)) {
      newExpanded?.delete(migrationId);
    } else {
      newExpanded?.add(migrationId);
    }
    setExpandedMigrations(newExpanded);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'applied': return { icon: 'CheckCircle', color: 'text-success' };
      case 'pending': return { icon: 'Clock', color: 'text-warning' };
      case 'failed': return { icon: 'XCircle', color: 'text-error' };
      case 'rolled_back': return { icon: 'RotateCcw', color: 'text-secondary' };
      default: return { icon: 'Circle', color: 'text-muted-foreground' };
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    switch (status) {
      case 'applied': return `${baseClasses} bg-success/10 text-success`;
      case 'pending': return `${baseClasses} bg-warning/10 text-warning`;
      case 'failed': return `${baseClasses} bg-error/10 text-error`;
      case 'rolled_back': return `${baseClasses} bg-secondary/10 text-secondary`;
      default: return `${baseClasses} bg-muted text-muted-foreground`;
    }
  };

  return (
    <div className="space-y-4">
      {migrations?.map((migration, index) => {
        const statusInfo = getStatusIcon(migration?.status);
        const isExpanded = expandedMigrations?.has(migration?.id);
        const isSelected = selectedMigration?.id === migration?.id;

        return (
          <div
            key={migration?.id}
            className={`border border-border rounded-lg bg-card transition-smooth ${
              isSelected ? 'ring-2 ring-primary shadow-interactive' : 'hover:shadow-subtle'
            }`}
          >
            {/* Migration Header */}
            <div
              className="p-4 cursor-pointer"
              onClick={() => onSelectMigration(migration)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  {/* Timeline Connector */}
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                      migration?.status === 'applied' ? 'border-success bg-success/10' :
                      migration?.status === 'pending' ? 'border-warning bg-warning/10' :
                      migration?.status === 'failed'? 'border-error bg-error/10' : 'border-secondary bg-secondary/10'
                    }`}>
                      <Icon name={statusInfo?.icon} size={16} className={statusInfo?.color} />
                    </div>
                    {index < migrations?.length - 1 && (
                      <div className="w-0.5 h-8 bg-border mt-2" />
                    )}
                  </div>

                  {/* Migration Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-base font-semibold text-text-primary truncate">
                        {migration?.name}
                      </h3>
                      <span className={getStatusBadge(migration?.status)}>
                        {migration?.status?.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-text-secondary mb-2">
                      <div className="flex items-center space-x-1">
                        <Icon name="Calendar" size={14} />
                        <span>{migration?.timestamp}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Icon name="User" size={14} />
                        <span>{migration?.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Icon name="Database" size={14} />
                        <span>{migration?.environment}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-text-secondary">
                        Affected: <span className="font-medium text-text-primary">{migration?.affectedTables?.length} tables</span>
                      </span>
                      {migration?.dataLossRisk && (
                        <div className="flex items-center space-x-1 text-warning">
                          <Icon name="AlertTriangle" size={14} />
                          <span className="font-medium">Data Loss Risk</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 ml-4">
                  {migration?.status === 'pending' && (
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="Play"
                      iconSize={14}
                      onClick={(e) => {
                        e?.stopPropagation();
                        onExecuteMigration(migration);
                      }}
                    >
                      Apply
                    </Button>
                  )}
                  {migration?.status === 'applied' && migration?.canRollback && (
                    <Button
                      variant="outline"
                      size="sm"
                      iconName="RotateCcw"
                      iconSize={14}
                      onClick={(e) => {
                        e?.stopPropagation();
                        onRollbackMigration(migration);
                      }}
                    >
                      Rollback
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
                    iconSize={16}
                    onClick={(e) => {
                      e?.stopPropagation();
                      toggleExpanded(migration?.id);
                    }}
                  />
                </div>
              </div>
            </div>
            {/* Expanded Details */}
            {isExpanded && (
              <div className="border-t border-border bg-muted/30">
                <div className="p-4 space-y-4">
                  {/* Description */}
                  {migration?.description && (
                    <div>
                      <h4 className="text-sm font-medium text-text-primary mb-2">Description</h4>
                      <p className="text-sm text-text-secondary">{migration?.description}</p>
                    </div>
                  )}

                  {/* Affected Tables */}
                  <div>
                    <h4 className="text-sm font-medium text-text-primary mb-2">Affected Tables</h4>
                    <div className="flex flex-wrap gap-2">
                      {migration?.affectedTables?.map((table) => (
                        <span
                          key={table}
                          className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-md font-mono"
                        >
                          {table}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Change Summary */}
                  <div>
                    <h4 className="text-sm font-medium text-text-primary mb-2">Changes</h4>
                    <div className="space-y-1">
                      {migration?.changes?.map((change, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-sm">
                          <Icon 
                            name={
                              change?.type === 'create' ? 'Plus' :
                              change?.type === 'modify' ? 'Edit' :
                              change?.type === 'delete' ? 'Trash2' : 'Circle'
                            } 
                            size={14} 
                            className={
                              change?.type === 'create' ? 'text-success' :
                              change?.type === 'modify' ? 'text-warning' :
                              change?.type === 'delete' ? 'text-error' : 'text-text-secondary'
                            }
                          />
                          <span className="text-text-secondary">{change?.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Execution Details */}
                  {migration?.status !== 'pending' && (
                    <div>
                      <h4 className="text-sm font-medium text-text-primary mb-2">Execution Details</h4>
                      <div className="text-sm text-text-secondary space-y-1">
                        <div>Duration: {migration?.executionTime || 'N/A'}</div>
                        {migration?.error && (
                          <div className="text-error">Error: {migration?.error}</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
      {migrations?.length === 0 && (
        <div className="text-center py-12 text-text-secondary">
          <Icon name="GitBranch" size={48} className="mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-text-primary mb-2">No Migrations Found</h3>
          <p>No migration history available for the current filters.</p>
        </div>
      )}
    </div>
  );
};

export default MigrationTimeline;