import React, { useState, useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const SchemaExplorer = ({ entities = [], onEntitySelect, onEntityDrag, selectedEntityId, isCollapsed = false, onToggleCollapse }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedGroups, setExpandedGroups] = useState(new Set(['tables', 'views']));
  const [filterType, setFilterType] = useState('all');

  const mockEntities = [
    {
      id: 'user-1',
      name: 'users',
      type: 'table',
      fields: [
        { name: 'id', type: 'bigint', primaryKey: true },
        { name: 'email', type: 'varchar', unique: true },
        { name: 'password', type: 'varchar' },
        { name: 'created_at', type: 'timestamp' }
      ],
      relationships: 2
    },
    {
      id: 'post-1',
      name: 'posts',
      type: 'table',
      fields: [
        { name: 'id', type: 'bigint', primaryKey: true },
        { name: 'user_id', type: 'bigint', foreignKey: true },
        { name: 'title', type: 'varchar' },
        { name: 'content', type: 'text' },
        { name: 'published_at', type: 'timestamp' }
      ],
      relationships: 3
    },
    {
      id: 'comment-1',
      name: 'comments',
      type: 'table',
      fields: [
        { name: 'id', type: 'bigint', primaryKey: true },
        { name: 'post_id', type: 'bigint', foreignKey: true },
        { name: 'user_id', type: 'bigint', foreignKey: true },
        { name: 'content', type: 'text' }
      ],
      relationships: 2
    },
    {
      id: 'category-1',
      name: 'categories',
      type: 'table',
      fields: [
        { name: 'id', type: 'bigint', primaryKey: true },
        { name: 'name', type: 'varchar', unique: true },
        { name: 'slug', type: 'varchar', unique: true }
      ],
      relationships: 1
    },
    {
      id: 'user-posts-view',
      name: 'user_posts_view',
      type: 'view',
      fields: [
        { name: 'user_email', type: 'varchar' },
        { name: 'post_title', type: 'varchar' },
        { name: 'post_count', type: 'bigint' }
      ],
      relationships: 0
    }
  ];

  const allEntities = entities?.length > 0 ? entities : mockEntities;

  const filteredEntities = useMemo(() => {
    return allEntities?.filter(entity => {
      const matchesSearch = entity?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase());
      const matchesFilter = filterType === 'all' || entity?.type === filterType;
      return matchesSearch && matchesFilter;
    });
  }, [allEntities, searchTerm, filterType]);

  const groupedEntities = useMemo(() => {
    const groups = {
      tables: filteredEntities?.filter(e => e?.type === 'table'),
      views: filteredEntities?.filter(e => e?.type === 'view'),
      functions: filteredEntities?.filter(e => e?.type === 'function')
    };
    return groups;
  }, [filteredEntities]);

  const toggleGroup = (groupName) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded?.has(groupName)) {
      newExpanded?.delete(groupName);
    } else {
      newExpanded?.add(groupName);
    }
    setExpandedGroups(newExpanded);
  };

  const handleEntityDragStart = (e, entity) => {
    e?.dataTransfer?.setData('application/json', JSON.stringify({
      type: 'entity',
      entity: entity
    }));
    if (onEntityDrag) {
      onEntityDrag(entity);
    }
  };

  const getEntityIcon = (type) => {
    switch (type) {
      case 'table': return 'Table';
      case 'view': return 'Eye';
      case 'function': return 'Zap';
      default: return 'Database';
    }
  };

  const getFieldIcon = (field) => {
    if (field?.primaryKey) return 'Key';
    if (field?.foreignKey) return 'Link';
    if (field?.unique) return 'Hash';
    return 'Minus';
  };

  if (isCollapsed) {
    return (
      <div 
        className="w-12 bg-surface border-r border-border h-full flex flex-col items-center py-4 space-y-3" 
        style={{ position: 'relative', zIndex: 1100 }}
      >
        <button
          onClick={onToggleCollapse}
          className="w-8 h-8 rounded flex items-center justify-center hover:bg-muted transition-smooth"
          title="Expand Schema Explorer"
        >
          <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
        </button>
        <Icon name="Database" size={20} className="text-primary" />
        <div className="w-6 h-px bg-border" />
        {groupedEntities?.tables?.slice(0, 3)?.map((entity) => (
          <button
            key={entity?.id}
            onClick={() => onEntitySelect && onEntitySelect(entity)}
            className={`w-8 h-8 rounded flex items-center justify-center transition-smooth ${
              selectedEntityId === entity?.id
                ? 'bg-primary text-primary-foreground'
                : 'text-text-secondary hover:text-text-primary hover:bg-muted'
            }`}
            title={entity?.name}
          >
            <Icon name={getEntityIcon(entity?.type)} size={14} />
          </button>
        ))}
      </div>
    );
  }

  return (
    <div 
      className={`w-80 bg-surface border-r border-border h-full flex flex-col`} 
      style={{ position: 'relative', zIndex: 1100 }}
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Icon name="Database" size={20} className="text-primary" />
            <h2 className="text-lg font-semibold text-text-primary">Schema Explorer</h2>
          </div>
          <button
            onClick={onToggleCollapse}
            className="w-8 h-8 rounded flex items-center justify-center hover:bg-muted transition-smooth"
            title="Collapse Schema Explorer"
          >
            <Icon name="ChevronLeft" size={16} className="text-muted-foreground" />
          </button>
        </div>

        {/* Search */}
        <Input
          type="search"
          placeholder="Search entities..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e?.target?.value)}
          className="mb-3"
        />

        {/* Filter Tabs */}
        <div className="flex space-x-1">
          {[
            { key: 'all', label: 'All', count: allEntities?.length },
            { key: 'table', label: 'Tables', count: groupedEntities?.tables?.length },
            { key: 'view', label: 'Views', count: groupedEntities?.views?.length }
          ]?.map((filter) => (
            <button
              key={filter?.key}
              onClick={() => setFilterType(filter?.key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-smooth ${
                filterType === filter?.key
                  ? 'bg-primary text-primary-foreground'
                  : 'text-text-secondary hover:text-text-primary hover:bg-muted'
              }`}
            >
              {filter?.label} ({filter?.count})
            </button>
          ))}
        </div>
      </div>
      {/* Entity Groups */}
      <div className="flex-1 overflow-y-auto">
        {Object.entries(groupedEntities)?.map(([groupName, entities]) => {
          if (entities?.length === 0) return null;
          
          const isExpanded = expandedGroups?.has(groupName);
          const groupLabel = groupName?.charAt(0)?.toUpperCase() + groupName?.slice(1);
          
          return (
            <div key={groupName} className="border-b border-border last:border-b-0">
              <button
                onClick={() => toggleGroup(groupName)}
                className="w-full flex items-center justify-between p-3 text-sm font-medium text-text-primary hover:bg-muted transition-smooth"
              >
                <div className="flex items-center space-x-2">
                  <Icon 
                    name={isExpanded ? 'ChevronDown' : 'ChevronRight'} 
                    size={16} 
                  />
                  <span>{groupLabel}</span>
                  <span className="text-xs text-text-secondary bg-muted px-2 py-0.5 rounded">
                    {entities?.length}
                  </span>
                </div>
              </button>
              {isExpanded && (
                <div className="pb-2">
                  {entities?.map((entity) => (
                    <div
                      key={entity?.id}
                      draggable
                      onDragStart={(e) => handleEntityDragStart(e, entity)}
                      className={`mx-3 mb-2 p-3 rounded-lg border cursor-pointer transition-smooth ${
                        selectedEntityId === entity?.id
                          ? 'border-primary bg-primary/5 shadow-selection'
                          : 'border-border hover:border-accent hover:bg-muted/50'
                      }`}
                      onClick={() => onEntitySelect && onEntitySelect(entity)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Icon 
                            name={getEntityIcon(entity?.type)} 
                            size={16} 
                            className="text-primary" 
                          />
                          <span className="font-medium text-text-primary text-sm">
                            {entity?.name}
                          </span>
                        </div>
                        {entity?.relationships > 0 && (
                          <span className="text-xs text-text-secondary bg-accent/10 text-accent px-2 py-0.5 rounded">
                            {entity?.relationships} rel
                          </span>
                        )}
                      </div>

                      <div className="space-y-1">
                        {entity?.fields?.slice(0, 3)?.map((field, index) => (
                          <div key={index} className="flex items-center space-x-2 text-xs">
                            <Icon 
                              name={getFieldIcon(field)} 
                              size={12} 
                              className={`${
                                field?.primaryKey ? 'text-warning' : 
                                field?.foreignKey ? 'text-accent': 'text-text-secondary'
                              }`}
                            />
                            <span className="text-text-secondary truncate">
                              {field?.name}
                            </span>
                            <span className="text-text-secondary/70 text-xs">
                              {field?.type}
                            </span>
                          </div>
                        ))}
                        {entity?.fields?.length > 3 && (
                          <div className="text-xs text-text-secondary/70 pl-4">
                            +{entity?.fields?.length - 3} more fields
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {filteredEntities?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-text-secondary">
            <Icon name="Search" size={48} className="mb-3 opacity-50" />
            <p className="text-sm">No entities found</p>
            <p className="text-xs opacity-70">Try adjusting your search or filter</p>
          </div>
        )}
      </div>
      {/* Footer Actions */}
      <div className="p-4 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          iconName="Plus"
          iconPosition="left"
          className="w-full"
          onClick={() => onEntitySelect && onEntitySelect(null)}
        >
          Add New Entity
        </Button>
      </div>
    </div>
  );
};

export default SchemaExplorer;