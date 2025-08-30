import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ContextualSuggestions = ({ 
  suggestions, 
  onSuggestionClick, 
  currentProject 
}) => {
  const getSuggestionIcon = (type) => {
    const iconMap = {
      'optimization': 'Zap',
      'security': 'Shield',
      'performance': 'TrendingUp',
      'testing': 'TestTube',
      'documentation': 'FileText',
      'deployment': 'Rocket',
      'database': 'Database',
      'api': 'Code'
    };
    return iconMap?.[type] || 'Lightbulb';
  };

  const getSuggestionColor = (type) => {
    const colorMap = {
      'optimization': 'text-blue-600 bg-blue-50',
      'security': 'text-red-600 bg-red-50',
      'performance': 'text-green-600 bg-green-50',
      'testing': 'text-purple-600 bg-purple-50',
      'documentation': 'text-gray-600 bg-gray-50',
      'deployment': 'text-orange-600 bg-orange-50',
      'database': 'text-teal-600 bg-teal-50',
      'api': 'text-indigo-600 bg-indigo-50'
    };
    return colorMap?.[type] || 'text-gray-600 bg-gray-50';
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      'high': { color: 'bg-red-100 text-red-700', label: 'High' },
      'medium': { color: 'bg-yellow-100 text-yellow-700', label: 'Medium' },
      'low': { color: 'bg-green-100 text-green-700', label: 'Low' }
    };
    return priorityConfig?.[priority] || priorityConfig?.['medium'];
  };

  return (
    <div className="space-y-6">
      {/* Project Context */}
      {currentProject && (
        <div className="bg-surface border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Folder" size={16} color="white" />
            </div>
            <div>
              <h3 className="text-sm font-medium">{currentProject?.name}</h3>
              <p className="text-xs text-muted-foreground">
                {currentProject?.type} • {currentProject?.endpoints} endpoints
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-muted-foreground">Status:</span>
              <span className={`ml-2 px-2 py-1 rounded-full ${
                currentProject?.status === 'active' ? 'bg-green-100 text-green-700' :
                currentProject?.status === 'development'? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
              }`}>
                {currentProject?.status}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Last Updated:</span>
              <span className="ml-2">{currentProject?.lastUpdated}</span>
            </div>
          </div>
        </div>
      )}
      {/* Quick Actions */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Quick Actions</h3>
        <div className="grid grid-cols-1 gap-2">
          <Button
            variant="outline"
            className="justify-start h-auto p-3"
            onClick={() => onSuggestionClick('generate-endpoint')}
          >
            <Icon name="Plus" size={16} className="mr-3" />
            <div className="text-left">
              <div className="text-sm font-medium">Generate New Endpoint</div>
              <div className="text-xs text-muted-foreground">Create API endpoint from description</div>
            </div>
          </Button>
          
          <Button
            variant="outline"
            className="justify-start h-auto p-3"
            onClick={() => onSuggestionClick('optimize-schema')}
          >
            <Icon name="Database" size={16} className="mr-3" />
            <div className="text-left">
              <div className="text-sm font-medium">Optimize Database Schema</div>
              <div className="text-xs text-muted-foreground">Analyze and improve performance</div>
            </div>
          </Button>
          
          <Button
            variant="outline"
            className="justify-start h-auto p-3"
            onClick={() => onSuggestionClick('generate-tests')}
          >
            <Icon name="TestTube" size={16} className="mr-3" />
            <div className="text-left">
              <div className="text-sm font-medium">Generate Test Cases</div>
              <div className="text-xs text-muted-foreground">Auto-create comprehensive tests</div>
            </div>
          </Button>
        </div>
      </div>
      {/* Contextual Suggestions */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Suggestions</h3>
        <div className="space-y-3">
          {suggestions?.map((suggestion, index) => {
            const priorityConfig = getPriorityBadge(suggestion?.priority);
            const colorClasses = getSuggestionColor(suggestion?.type);
            
            return (
              <div
                key={index}
                className="bg-surface border border-border rounded-lg p-4 hover:shadow-elevation-1 transition-smooth cursor-pointer"
                onClick={() => onSuggestionClick(suggestion)}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorClasses}`}>
                    <Icon name={getSuggestionIcon(suggestion?.type)} size={16} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium">{suggestion?.title}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${priorityConfig?.color}`}>
                        {priorityConfig?.label}
                      </span>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-3">
                      {suggestion?.description}
                    </p>
                    
                    {suggestion?.impact && (
                      <div className="flex items-center space-x-4 text-xs">
                        <div className="flex items-center space-x-1">
                          <Icon name="TrendingUp" size={12} className="text-success" />
                          <span className="text-muted-foreground">Impact:</span>
                          <span className="font-medium">{suggestion?.impact}</span>
                        </div>
                        {suggestion?.effort && (
                          <div className="flex items-center space-x-1">
                            <Icon name="Clock" size={12} className="text-muted-foreground" />
                            <span className="text-muted-foreground">Effort:</span>
                            <span className="font-medium">{suggestion?.effort}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Recent Activity */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Recent Activity</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted transition-smooth">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
              <Icon name="Code" size={12} className="text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium">Generated user authentication endpoint</p>
              <p className="text-xs text-muted-foreground">2 minutes ago</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted transition-smooth">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
              <Icon name="Database" size={12} className="text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium">Optimized user table schema</p>
              <p className="text-xs text-muted-foreground">15 minutes ago</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted transition-smooth">
            <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
              <Icon name="TestTube" size={12} className="text-purple-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium">Created integration tests</p>
              <p className="text-xs text-muted-foreground">1 hour ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContextualSuggestions;