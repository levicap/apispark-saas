import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ConversationThread = ({ 
  thread, 
  isActive, 
  onClick, 
  onDelete, 
  onRename 
}) => {
  const getThreadIcon = (category) => {
    const iconMap = {
      'API Generation': 'Code',
      'Database Schema': 'Database',
      'Testing': 'TestTube',
      'Deployment': 'Rocket',
      'General': 'MessageCircle'
    };
    return iconMap?.[category] || 'MessageCircle';
  };

  const formatDate = (date) => {
    const now = new Date();
    const threadDate = new Date(date);
    const diffInHours = (now - threadDate) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return threadDate?.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } else if (diffInHours < 168) {
      return threadDate?.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return threadDate?.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  return (
    <div 
      className={`group relative p-3 rounded-lg cursor-pointer transition-smooth border ${
        isActive 
          ? 'bg-primary/10 border-primary/20 text-primary' :'hover:bg-muted border-transparent'
      }`}
      onClick={onClick}
    >
      <div className="flex items-start space-x-3">
        <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
          isActive ? 'bg-primary text-primary-foreground' : 'bg-muted'
        }`}>
          <Icon name={getThreadIcon(thread?.category)} size={16} />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium truncate">
            {thread?.title}
          </h4>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {thread?.lastMessage}
          </p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-muted-foreground">
              {formatDate(thread?.updatedAt)}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              thread?.category === 'API Generation' ? 'bg-blue-100 text-blue-700' :
              thread?.category === 'Database Schema' ? 'bg-green-100 text-green-700' :
              thread?.category === 'Testing' ? 'bg-purple-100 text-purple-700' :
              thread?.category === 'Deployment'? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'
            }`}>
              {thread?.messageCount}
            </span>
          </div>
        </div>
      </div>
      {/* Action buttons - shown on hover */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-smooth">
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="icon"
            className="w-6 h-6"
            onClick={(e) => {
              e?.stopPropagation();
              onRename(thread?.id);
            }}
          >
            <Icon name="Edit2" size={12} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="w-6 h-6 text-error hover:text-error"
            onClick={(e) => {
              e?.stopPropagation();
              onDelete(thread?.id);
            }}
          >
            <Icon name="Trash2" size={12} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConversationThread;