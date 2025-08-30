import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RequestCollections = ({ 
  collections = [], 
  selectedRequest = null, 
  onRequestSelect,
  onCreateRequest,
  onCreateCollection 
}) => {
  const [expandedCollections, setExpandedCollections] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const toggleCollection = (collectionId) => {
    const newExpanded = new Set(expandedCollections);
    if (newExpanded?.has(collectionId)) {
      newExpanded?.delete(collectionId);
    } else {
      newExpanded?.add(collectionId);
    }
    setExpandedCollections(newExpanded);
  };

  const filteredCollections = collections?.filter(collection =>
    collection?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    collection?.requests?.some(req => 
      req?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      req?.url?.toLowerCase()?.includes(searchQuery?.toLowerCase())
    )
  );

  const getMethodColor = (method) => {
    const colors = {
      GET: 'text-green-600 bg-green-50',
      POST: 'text-blue-600 bg-blue-50',
      PUT: 'text-orange-600 bg-orange-50',
      PATCH: 'text-yellow-600 bg-yellow-50',
      DELETE: 'text-red-600 bg-red-50'
    };
    return colors?.[method] || 'text-gray-600 bg-gray-50';
  };

  return (
    <div className="h-full flex flex-col bg-surface border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground">Collections</h2>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={onCreateCollection}
              className="h-7 w-7"
            >
              <Icon name="FolderPlus" size={14} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onCreateRequest}
              className="h-7 w-7"
            >
              <Icon name="Plus" size={14} />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Icon 
            name="Search" 
            size={14} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
          />
          <input
            type="text"
            placeholder="Search requests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-muted border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          />
        </div>
      </div>
      {/* Collections List */}
      <div className="flex-1 overflow-y-auto">
        {filteredCollections?.length === 0 ? (
          <div className="p-4 text-center">
            <Icon name="Folder" size={32} className="mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-3">No collections found</p>
            <Button variant="outline" size="sm" onClick={onCreateCollection}>
              Create Collection
            </Button>
          </div>
        ) : (
          <div className="p-2">
            {filteredCollections?.map((collection) => (
              <div key={collection?.id} className="mb-2">
                {/* Collection Header */}
                <div
                  className="flex items-center justify-between p-2 hover:bg-muted rounded-md cursor-pointer group"
                  onClick={() => toggleCollection(collection?.id)}
                >
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <Icon 
                      name={expandedCollections?.has(collection?.id) ? "ChevronDown" : "ChevronRight"} 
                      size={14} 
                      className="text-muted-foreground flex-shrink-0"
                    />
                    <Icon name="Folder" size={14} className="text-primary flex-shrink-0" />
                    <span className="text-sm font-medium text-foreground truncate">
                      {collection?.name}
                    </span>
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      ({collection?.requests?.length})
                    </span>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => {
                        e?.stopPropagation();
                        onCreateRequest(collection?.id);
                      }}
                    >
                      <Icon name="Plus" size={12} />
                    </Button>
                  </div>
                </div>

                {/* Collection Requests */}
                {expandedCollections?.has(collection?.id) && (
                  <div className="ml-6 space-y-1">
                    {collection?.requests?.map((request) => (
                      <div
                        key={request?.id}
                        className={`
                          flex items-center space-x-2 p-2 rounded-md cursor-pointer transition-colors
                          ${selectedRequest?.id === request?.id 
                            ? 'bg-primary text-primary-foreground' 
                            : 'hover:bg-muted'
                          }
                        `}
                        onClick={() => onRequestSelect(request)}
                      >
                        <span className={`
                          px-2 py-0.5 text-xs font-medium rounded-md flex-shrink-0
                          ${selectedRequest?.id === request?.id 
                            ? 'bg-primary-foreground text-primary' 
                            : getMethodColor(request?.method)
                          }
                        `}>
                          {request?.method}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className={`
                            text-sm font-medium truncate
                            ${selectedRequest?.id === request?.id 
                              ? 'text-primary-foreground' 
                              : 'text-foreground'
                            }
                          `}>
                            {request?.name}
                          </p>
                          <p className={`
                            text-xs truncate
                            ${selectedRequest?.id === request?.id 
                              ? 'text-primary-foreground/70' 
                              : 'text-muted-foreground'
                            }
                          `}>
                            {request?.url}
                          </p>
                        </div>
                        {request?.status && (
                          <div className={`
                            w-2 h-2 rounded-full flex-shrink-0
                            ${request?.status === 'success' ? 'bg-green-500' : 
                              request?.status === 'error' ? 'bg-red-500' : 'bg-yellow-500'}
                          `} />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Footer Stats */}
      <div className="p-3 border-t border-border bg-muted/30">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{collections?.length} collections</span>
          <span>
            {collections?.reduce((total, col) => total + col?.requests?.length, 0)} requests
          </span>
        </div>
      </div>
    </div>
  );
};

export default RequestCollections;