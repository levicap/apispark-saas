import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const TeamMemberCard = ({ member, onRoleChange, onRemove, onViewActivity, isSelected, onSelect }) => {
  const getRoleColor = (role) => {
    switch (role) {
      case 'Owner':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Editor':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Viewer':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Inactive':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatLastActivity = (date) => {
    const now = new Date();
    const activityDate = new Date(date);
    const diffInHours = Math.floor((now - activityDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return activityDate?.toLocaleDateString();
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-4 hover:shadow-md transition-all duration-200 ${
      isSelected ? 'ring-2 ring-primary border-primary' : ''
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => onSelect(member?.id, e?.target?.checked)}
              className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
            />
            <div className="relative">
              <Image
                src={member?.avatar}
                alt={member?.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              {member?.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
              )}
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium text-foreground truncate">{member?.name}</h3>
              {member?.role === 'Owner' && (
                <Icon name="Crown" size={16} className="text-yellow-500 flex-shrink-0" />
              )}
            </div>
            <p className="text-sm text-muted-foreground truncate mb-2">{member?.email}</p>
            
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getRoleColor(member?.role)}`}>
                {member?.role}
              </span>
              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(member?.status)}`}>
                {member?.status}
              </span>
            </div>
            
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>Last active: {formatLastActivity(member?.lastActivity)}</span>
              <span>•</span>
              <span>{member?.projectsCount} projects</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1 ml-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onViewActivity(member)}
            iconName="Activity"
            iconSize={16}
          >
            <span className="sr-only">View activity</span>
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRoleChange(member)}
            iconName="Settings"
            iconSize={16}
          >
            <span className="sr-only">Manage permissions</span>
          </Button>
          
          {member?.role !== 'Owner' && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemove(member)}
              iconName="Trash2"
              iconSize={16}
              className="text-error hover:text-error"
            >
              <span className="sr-only">Remove member</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamMemberCard;