import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import ConversationThread from './ConversationThread';

const ThreadSidebar = ({ 
  threads, 
  activeThreadId, 
  onThreadSelect, 
  onNewThread, 
  onDeleteThread, 
  onRenameThread,
  isCollapsed = false,
  onToggleCollapse 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'API Generation', label: 'API Generation' },
    { value: 'Database Schema', label: 'Database Schema' },
    { value: 'Testing', label: 'Testing' },
    { value: 'Deployment', label: 'Deployment' },
    { value: 'General', label: 'General' }
  ];

  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'alphabetical', label: 'Alphabetical' },
    { value: 'category', label: 'By Category' }
  ];

  const filteredAndSortedThreads = threads?.filter(thread => {
      const matchesSearch = thread?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
                           thread?.lastMessage?.toLowerCase()?.includes(searchQuery?.toLowerCase());
      const matchesCategory = filterCategory === 'all' || thread?.category === filterCategory;
      return matchesSearch && matchesCategory;
    })?.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        case 'oldest':
          return new Date(a.updatedAt) - new Date(b.updatedAt);
        case 'alphabetical':
          return a?.title?.localeCompare(b?.title);
        case 'category':
          return a?.category?.localeCompare(b?.category);
        default:
          return 0;
      }
    });

  const groupedThreads = filteredAndSortedThreads?.reduce((acc, thread) => {
    const category = thread?.category;
    if (!acc?.[category]) {
      acc[category] = [];
    }
    acc?.[category]?.push(thread);
    return acc;
  }, {});

  if (isCollapsed) {
    return (
      <div className="w-16 bg-surface border-r border-border h-full flex flex-col">
        <div className="p-4 border-b border-border">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="w-8 h-8"
          >
            <Icon name="ChevronRight" size={16} />
          </Button>
        </div>
        <div className="flex-1 flex flex-col items-center py-4 space-y-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onNewThread}
            className="w-10 h-10"
          >
            <Icon name="Plus" size={18} />
          </Button>
          {threads?.slice(0, 5)?.map(thread => (
            <Button
              key={thread?.id}
              variant={activeThreadId === thread?.id ? "default" : "ghost"}
              size="icon"
              onClick={() => onThreadSelect(thread?.id)}
              className="w-10 h-10"
            >
              <Icon name="MessageCircle" size={16} />
            </Button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-surface border-r border-border h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Conversations</h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onNewThread}
              className="w-8 h-8"
            >
              <Icon name="Plus" size={16} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleCollapse}
              className="w-8 h-8"
            >
              <Icon name="ChevronLeft" size={16} />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Icon 
            name="Search" 
            size={16} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
          />
          <Input
            type="search"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
            className="pl-10"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 gap-2">
          <Select
            options={categoryOptions}
            value={filterCategory}
            onChange={setFilterCategory}
            placeholder="Category"
          />
          <Select
            options={sortOptions}
            value={sortBy}
            onChange={setSortBy}
            placeholder="Sort by"
          />
        </div>
      </div>
      {/* Thread List */}
      <div className="flex-1 overflow-y-auto">
        {filteredAndSortedThreads?.length === 0 ? (
          <div className="p-6 text-center">
            <Icon name="MessageCircle" size={48} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-sm font-medium text-foreground mb-2">No conversations found</h3>
            <p className="text-xs text-muted-foreground mb-4">
              {searchQuery || filterCategory !== 'all' ?'Try adjusting your search or filters' :'Start a new conversation to get help with your API development'
              }
            </p>
            <Button variant="outline" onClick={onNewThread}>
              <Icon name="Plus" size={16} className="mr-2" />
              New Conversation
            </Button>
          </div>
        ) : sortBy === 'category' ? (
          <div className="p-4 space-y-6">
            {Object.entries(groupedThreads)?.map(([category, categoryThreads]) => (
              <div key={category}>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  {category}
                </h3>
                <div className="space-y-2">
                  {categoryThreads?.map(thread => (
                    <ConversationThread
                      key={thread?.id}
                      thread={thread}
                      isActive={activeThreadId === thread?.id}
                      onClick={() => onThreadSelect(thread?.id)}
                      onDelete={onDeleteThread}
                      onRename={onRenameThread}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 space-y-2">
            {filteredAndSortedThreads?.map(thread => (
              <ConversationThread
                key={thread?.id}
                thread={thread}
                isActive={activeThreadId === thread?.id}
                onClick={() => onThreadSelect(thread?.id)}
                onDelete={onDeleteThread}
                onRename={onRenameThread}
              />
            ))}
          </div>
        )}
      </div>
      {/* Footer Stats */}
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground">
          <div className="flex justify-between items-center">
            <span>{filteredAndSortedThreads?.length} conversations</span>
            <span>
              {threads?.reduce((acc, thread) => acc + thread?.messageCount, 0)} messages
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreadSidebar;