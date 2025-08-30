import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const LeftToolbar = ({ 
  onCreateTable, 
  onCreateRelationship, 
  selectedTool, 
  onToolSelect,
  onImportSchema,
  templates = []
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isTemplatesExpanded, setIsTemplatesExpanded] = useState(false);

  const tools = [
    {
      id: 'select',
      name: 'Select',
      icon: 'MousePointer',
      description: 'Select and move tables'
    },
    {
      id: 'table',
      name: 'Add Table',
      icon: 'Table',
      description: 'Create new database table'
    },
    {
      id: 'relationship',
      name: 'Add Relationship',
      icon: 'GitBranch',
      description: 'Connect tables with relationships'
    },
    {
      id: 'pan',
      name: 'Pan',
      icon: 'Move',
      description: 'Pan around the canvas'
    }
  ];

  const schemaTemplates = [
    {
      id: 'ecommerce',
      name: 'E-commerce',
      description: 'Users, Products, Orders, Categories',
      tables: ['users', 'products', 'orders', 'categories', 'order_items']
    },
    {
      id: 'blog',
      name: 'Blog System',
      description: 'Posts, Authors, Comments, Tags',
      tables: ['users', 'posts', 'comments', 'tags', 'post_tags']
    },
    {
      id: 'crm',
      name: 'CRM System',
      description: 'Contacts, Companies, Deals, Activities',
      tables: ['contacts', 'companies', 'deals', 'activities', 'tasks']
    },
    {
      id: 'social',
      name: 'Social Network',
      description: 'Users, Posts, Follows, Likes',
      tables: ['users', 'posts', 'follows', 'likes', 'comments']
    }
  ];

  const filteredTemplates = schemaTemplates?.filter(template =>
    template?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    template?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );

  const handleToolClick = (toolId) => {
    onToolSelect(toolId);
    
    if (toolId === 'table') {
      onCreateTable();
    } else if (toolId === 'relationship') {
      onCreateRelationship();
    }
  };

  const handleTemplateSelect = (template) => {
    // This would typically create multiple tables based on the template
    console.log('Selected template:', template);
    // Implementation would create tables with predefined schema
  };

  return (
    <div className="w-64 bg-surface border-r border-border h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground mb-2">Database Tools</h2>
        <Input
          type="search"
          placeholder="Search tools and templates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e?.target?.value)}
          className="text-xs"
        />
      </div>
      {/* Tools Section */}
      <div className="p-4 border-b border-border">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Design Tools
        </h3>
        <div className="space-y-1">
          {tools?.map((tool) => (
            <Button
              key={tool?.id}
              variant={selectedTool === tool?.id ? "default" : "ghost"}
              onClick={() => handleToolClick(tool?.id)}
              className="w-full justify-start text-xs h-8"
              iconName={tool?.icon}
              iconPosition="left"
              iconSize={14}
            >
              <div className="flex flex-col items-start flex-1 min-w-0">
                <span className="font-medium">{tool?.name}</span>
                <span className="text-xs text-muted-foreground truncate w-full">
                  {tool?.description}
                </span>
              </div>
            </Button>
          ))}
        </div>
      </div>
      {/* Quick Actions */}
      <div className="p-4 border-b border-border">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Quick Actions
        </h3>
        <div className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onImportSchema}
            className="w-full justify-start text-xs"
            iconName="Upload"
            iconPosition="left"
            iconSize={14}
          >
            Import Schema
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start text-xs"
            iconName="Download"
            iconPosition="left"
            iconSize={14}
          >
            Export SQL
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start text-xs"
            iconName="RefreshCw"
            iconPosition="left"
            iconSize={14}
          >
            Auto Layout
          </Button>
        </div>
      </div>
      {/* Schema Templates */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Schema Templates
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsTemplatesExpanded(!isTemplatesExpanded)}
              className="w-4 h-4"
            >
              <Icon 
                name={isTemplatesExpanded ? "ChevronUp" : "ChevronDown"} 
                size={12} 
              />
            </Button>
          </div>
          
          {isTemplatesExpanded && (
            <div className="space-y-2">
              {filteredTemplates?.map((template) => (
                <div
                  key={template?.id}
                  onClick={() => handleTemplateSelect(template)}
                  className="p-3 border border-border rounded-lg hover:bg-muted cursor-pointer transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-xs font-medium text-foreground">
                      {template?.name}
                    </h4>
                    <Icon name="Plus" size={12} className="text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {template?.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {template?.tables?.slice(0, 3)?.map((table) => (
                      <span
                        key={table}
                        className="px-2 py-0.5 bg-secondary text-secondary-foreground text-xs rounded"
                      >
                        {table}
                      </span>
                    ))}
                    {template?.tables?.length > 3 && (
                      <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded">
                        +{template?.tables?.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <Icon name="Database" size={14} />
          <span>PostgreSQL Compatible</span>
        </div>
      </div>
    </div>
  );
};

export default LeftToolbar;