import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const SchemaViewer = ({ schema }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'string':
        return 'text-green-600 bg-green-100';
      case 'integer':
      case 'number':
        return 'text-blue-600 bg-blue-100';
      case 'boolean':
        return 'text-orange-600 bg-orange-100';
      case 'array':
        return 'text-purple-600 bg-purple-100';
      case 'object':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const generateJsonExample = (schema) => {
    const example = {};
    Object.entries(schema.properties || {}).forEach(([key, prop]) => {
      switch (prop.type) {
        case 'string':
          if (prop.format === 'date-time') {
            example[key] = '2024-01-15T10:30:00Z';
          } else if (prop.enum) {
            example[key] = prop.enum[0];
          } else {
            example[key] = `example_${key}`;
          }
          break;
        case 'integer':
          example[key] = 123;
          break;
        case 'number':
          example[key] = 99.99;
          break;
        case 'boolean':
          example[key] = true;
          break;
        case 'array':
          example[key] = [];
          break;
        case 'object':
          example[key] = {};
          break;
        default:
          example[key] = null;
      }
    });
    return JSON.stringify(example, null, 2);
  };

  if (!schema) return null;

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Schema Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{schema.name}</h3>
            <p className="text-sm text-muted-foreground">
              {schema.description || `${schema.name} data structure`}
            </p>
          </div>
          <button
            onClick={toggleExpanded}
            className="p-2 hover:bg-muted rounded-md transition-smooth"
          >
            <Icon 
              name={expanded ? "ChevronUp" : "ChevronDown"} 
              size={16} 
              className="text-muted-foreground" 
            />
          </button>
        </div>
      </div>

      {/* Schema Content */}
      {expanded && (
        <div className="p-4 space-y-6">
          {/* Properties Table */}
          <div>
            <h4 className="font-medium text-foreground mb-4">Properties</h4>
            <div className="overflow-x-auto">
              <table className="w-full border border-border rounded-lg">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Property</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Required</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-foreground">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {Object.entries(schema.properties || {}).map(([propName, prop]) => (
                    <tr key={propName} className="hover:bg-muted/50">
                      <td className="px-4 py-3">
                        <code className="text-sm bg-muted px-2 py-1 rounded font-mono text-foreground">
                          {propName}
                        </code>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${getTypeColor(prop.type)}`}>
                          {prop.type}
                          {prop.format && (
                            <span className="ml-1 opacity-75">({prop.format})</span>
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                          prop.required 
                            ? 'text-red-600 bg-red-100' 
                            : 'text-gray-600 bg-gray-100'
                        }`}>
                          {prop.required ? 'Required' : 'Optional'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {prop.description || `${propName} field`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* JSON Example */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-foreground">JSON Example</h4>
              <button
                onClick={() => navigator.clipboard.writeText(generateJsonExample(schema))}
                className="flex items-center space-x-2 px-3 py-1.5 bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground rounded-md transition-smooth"
              >
                <Icon name="Copy" size={14} />
                <span className="text-sm">Copy</span>
              </button>
            </div>
            
            <div className="bg-muted rounded-lg overflow-hidden">
              <div className="px-4 py-2 bg-muted/80 border-b border-border">
                <span className="text-sm text-foreground font-medium">JSON</span>
              </div>
              <pre className="p-4 text-sm text-foreground overflow-x-auto bg-background">
                <code>{generateJsonExample(schema)}</code>
              </pre>
            </div>
          </div>

          {/* Schema Notes */}
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-start space-x-3">
              <Icon name="Info" size={16} className="text-primary" />
              <div className="text-sm text-primary">
                <p className="font-medium mb-1">Schema Notes</p>
                <ul className="space-y-1">
                  <li>• All properties are validated according to their specified types</li>
                  <li>• Date-time fields must be in ISO 8601 format (UTC)</li>
                  <li>• Required fields must be provided in all requests</li>
                  <li>• Nested objects follow their respective schema definitions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchemaViewer;