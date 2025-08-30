import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const GenerationStatusBar = ({ 
  isGenerating = false,
  progress = 0,
  currentStep = '',
  totalFiles = 0,
  generatedFiles = 0,
  errors = [],
  onCancelGeneration,
  onRetryGeneration,
  onClearErrors
}) => {
  const hasErrors = errors?.length > 0;
  const isComplete = !isGenerating && generatedFiles > 0 && !hasErrors;

  if (!isGenerating && generatedFiles === 0 && errors?.length === 0) {
    return null;
  }

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-100 border-t border-border shadow-depth ${
      hasErrors ? 'bg-error/5' : isComplete ? 'bg-success/5' : 'bg-surface'
    }`}>
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Status Info */}
          <div className="flex items-center space-x-4">
            {isGenerating && (
              <>
                <Icon name="Loader2" size={20} className="animate-spin text-accent" />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-text-primary">Generating Code...</span>
                    <span className="text-sm text-text-secondary">
                      {generatedFiles}/{totalFiles} files
                    </span>
                  </div>
                  {currentStep && (
                    <p className="text-sm text-text-secondary">{currentStep}</p>
                  )}
                </div>
              </>
            )}

            {hasErrors && (
              <>
                <Icon name="AlertCircle" size={20} className="text-error" />
                <div>
                  <span className="font-medium text-error">
                    {errors?.length} Error{errors?.length !== 1 ? 's' : ''} Occurred
                  </span>
                  <p className="text-sm text-text-secondary">
                    {generatedFiles} of {totalFiles} files generated successfully
                  </p>
                </div>
              </>
            )}

            {isComplete && (
              <>
                <Icon name="CheckCircle" size={20} className="text-success" />
                <div>
                  <span className="font-medium text-success">Generation Complete</span>
                  <p className="text-sm text-text-secondary">
                    {generatedFiles} files generated successfully
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {isGenerating && (
              <Button
                variant="outline"
                size="sm"
                iconName="X"
                iconPosition="left"
                onClick={onCancelGeneration}
              >
                Cancel
              </Button>
            )}

            {hasErrors && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="RotateCcw"
                  iconPosition="left"
                  onClick={onRetryGeneration}
                >
                  Retry
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="X"
                  onClick={onClearErrors}
                >
                  Clear
                </Button>
              </>
            )}

            {isComplete && (
              <Button
                variant="ghost"
                size="sm"
                iconName="X"
                onClick={onClearErrors}
              >
                Dismiss
              </Button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {isGenerating && (
          <div className="mt-3">
            <div className="w-full bg-border rounded-full h-2">
              <div 
                className="bg-accent h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Error Details */}
        {hasErrors && (
          <div className="mt-3 max-h-32 overflow-y-auto">
            <div className="space-y-2">
              {errors?.map((error, index) => (
                <div key={index} className="flex items-start space-x-2 p-2 bg-error/10 rounded-lg">
                  <Icon name="AlertTriangle" size={14} className="text-error mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-error">{error?.file || 'Unknown File'}</p>
                    <p className="text-xs text-text-secondary">{error?.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerationStatusBar;