import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const ExecutionDialog = ({ 
  isOpen, 
  onClose, 
  migration, 
  type = 'execute', // 'execute' or 'rollback'
  onConfirm 
}) => {
  const [confirmChecks, setConfirmChecks] = useState({
    backup: false,
    downtime: false,
    dataLoss: false
  });
  const [isExecuting, setIsExecuting] = useState(false);

  if (!isOpen || !migration) return null;

  const isExecute = type === 'execute';
  const allChecksComplete = Object.values(confirmChecks)?.every(Boolean);

  const handleConfirm = async () => {
    if (!allChecksComplete) return;
    
    setIsExecuting(true);
    try {
      await onConfirm(migration);
      onClose();
    } catch (error) {
      console.error('Migration execution failed:', error);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleCheckChange = (key, checked) => {
    setConfirmChecks(prev => ({ ...prev, [key]: checked }));
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-panel z-300"
        onClick={onClose}
      />
      {/* Dialog */}
      <div className="fixed inset-0 flex items-center justify-center z-300 p-4">
        <div className="bg-surface border border-border rounded-lg shadow-depth w-full max-w-2xl max-h-[90vh] overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                isExecute ? 'bg-primary/10' : 'bg-warning/10'
              }`}>
                <Icon 
                  name={isExecute ? "Play" : "RotateCcw"} 
                  size={20} 
                  className={isExecute ? 'text-primary' : 'text-warning'} 
                />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-text-primary">
                  {isExecute ? 'Execute Migration' : 'Rollback Migration'}
                </h2>
                <p className="text-sm text-text-secondary">{migration?.name}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              iconSize={20}
              onClick={onClose}
            />
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-96">
            
            {/* Warning Banner */}
            <div className={`p-4 rounded-lg border mb-6 ${
              migration?.dataLossRisk 
                ? 'bg-error/5 border-error/20' :'bg-warning/5 border-warning/20'
            }`}>
              <div className="flex items-start space-x-3">
                <Icon 
                  name="AlertTriangle" 
                  size={20} 
                  className={migration?.dataLossRisk ? 'text-error' : 'text-warning'} 
                />
                <div>
                  <h3 className="font-medium text-text-primary mb-2">
                    {migration?.dataLossRisk ? 'High Risk Operation' : 'Caution Required'}
                  </h3>
                  <p className="text-sm text-text-secondary">
                    {isExecute 
                      ? `This migration will ${migration?.dataLossRisk ? 'permanently modify' : 'modify'} your database schema and may affect existing data.`
                      : 'Rolling back this migration may result in data loss and schema inconsistencies.'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Migration Details */}
            <div className="space-y-4 mb-6">
              <div>
                <h4 className="text-sm font-medium text-text-primary mb-2">Migration Details</h4>
                <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Author:</span>
                    <span className="text-text-primary font-medium">{migration?.author}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Created:</span>
                    <span className="text-text-primary font-medium">{migration?.timestamp}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Environment:</span>
                    <span className="text-text-primary font-medium">{migration?.environment}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Affected Tables:</span>
                    <span className="text-text-primary font-medium">{migration?.affectedTables?.length}</span>
                  </div>
                </div>
              </div>

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

              {/* Changes Summary */}
              <div>
                <h4 className="text-sm font-medium text-text-primary mb-2">Changes</h4>
                <div className="space-y-2">
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
            </div>

            {/* Confirmation Checklist */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-text-primary">
                Please confirm the following before proceeding:
              </h4>
              
              <div className="space-y-3">
                <Checkbox
                  label="I have created a backup of the database"
                  description="Essential for recovery in case of issues"
                  checked={confirmChecks?.backup}
                  onChange={(e) => handleCheckChange('backup', e?.target?.checked)}
                />
                
                <Checkbox
                  label="I understand this operation may cause downtime"
                  description="Application may be temporarily unavailable"
                  checked={confirmChecks?.downtime}
                  onChange={(e) => handleCheckChange('downtime', e?.target?.checked)}
                />
                
                {migration?.dataLossRisk && (
                  <Checkbox
                    label="I acknowledge the risk of data loss"
                    description="This operation may permanently delete or modify data"
                    checked={confirmChecks?.dataLoss}
                    onChange={(e) => handleCheckChange('dataLoss', e?.target?.checked)}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-border bg-muted/30">
            <div className="text-sm text-text-secondary">
              {isExecute ? 'Estimated time: 5-10 minutes' : 'Rollback time: 2-5 minutes'}
            </div>
            
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isExecuting}
              >
                Cancel
              </Button>
              <Button
                variant={isExecute ? "default" : "warning"}
                iconName={isExecute ? "Play" : "RotateCcw"}
                iconPosition="left"
                onClick={handleConfirm}
                disabled={!allChecksComplete}
                loading={isExecuting}
              >
                {isExecuting 
                  ? (isExecute ? 'Executing...' : 'Rolling back...') 
                  : (isExecute ? 'Execute Migration' : 'Rollback Migration')
                }
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExecutionDialog;