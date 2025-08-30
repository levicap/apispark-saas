import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickStartTemplates = ({ templates, onCreateFromTemplate }) => {
  const getTemplateIcon = (type) => {
    switch (type) {
      case 'rest_api': return 'Globe';
      case 'graphql': return 'GitBranch';
      case 'microservice': return 'Boxes';
      case 'crud_api': return 'Database';
      case 'auth_service': return 'Shield';
      case 'webhook': return 'Webhook';
      default: return 'FileText';
    }
  };

  const getTemplateColor = (type) => {
    switch (type) {
      case 'rest_api': return 'text-primary';
      case 'graphql': return 'text-accent';
      case 'microservice': return 'text-success';
      case 'crud_api': return 'text-warning';
      case 'auth_service': return 'text-error';
      case 'webhook': return 'text-secondary';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Icon name="Zap" size={20} />
          Quick Start Templates
        </h3>
      </div>
      <div className="p-4">
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {templates?.length > 0 ? (
            templates?.map((template) => (
              <div key={template?.id} className="border border-border rounded-lg p-3 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg bg-muted ${getTemplateColor(template?.type)}`}>
                    <Icon name={getTemplateIcon(template?.type)} size={20} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground mb-1">{template?.name}</h4>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{template?.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Icon name="Clock" size={12} />
                        <span>{template?.estimatedTime}</span>
                        <Icon name="Star" size={12} />
                        <span>{template?.popularity}</span>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onCreateFromTemplate(template)}
                        iconName="Plus"
                        iconSize={14}
                      >
                        Use Template
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Icon name="Zap" size={48} className="text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No templates available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickStartTemplates;