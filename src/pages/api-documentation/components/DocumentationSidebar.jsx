import React from 'react';
import Icon from '../../../components/AppIcon';

const DocumentationSidebar = ({
  sections,
  activeSection,
  onSectionChange,
  endpoints,
  onEndpointSelect,
  selectedEndpoint
}) => {
  const getMethodColor = (method) => {
    switch (method?.toUpperCase()) {
      case 'GET':
        return 'text-green-600 bg-green-100';
      case 'POST':
        return 'text-blue-600 bg-blue-100';
      case 'PUT':
        return 'text-orange-600 bg-orange-100';
      case 'DELETE':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <div className="h-full flex flex-col bg-surface">
      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="space-y-3">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => onSectionChange(section.id)}
                className={`w-full flex items-center justify-between px-4 py-3 text-base font-medium rounded-lg transition-all duration-200 ${
                  activeSection === section.id
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-foreground hover:bg-muted hover:shadow-sm'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon name={section.icon} size={18} />
                  <span>{section.label}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Endpoints (only show when endpoints section is active) */}
          {activeSection === 'endpoints' && endpoints && endpoints.length > 0 && (
            <div className="mt-8">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4 px-4">
                Endpoints
              </h3>
              <div className="space-y-2">
                {endpoints.map((endpoint) => (
                  <button
                    key={endpoint.id}
                    onClick={() => onEndpointSelect(endpoint)}
                    className={`w-full flex items-center justify-between px-4 py-3 text-sm rounded-lg transition-all duration-200 ${
                      selectedEndpoint?.id === endpoint.id
                        ? 'bg-muted text-foreground shadow-sm'
                        : 'text-muted-foreground hover:bg-muted/50 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getMethodColor(endpoint.method)}`}>
                        {endpoint.method}
                      </span>
                      <span className="font-mono text-xs">{endpoint.path}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentationSidebar;