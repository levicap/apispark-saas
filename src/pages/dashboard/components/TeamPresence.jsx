import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const TeamPresence = ({ teamMembers }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-success';
      case 'away': return 'bg-warning';
      case 'busy': return 'bg-error';
      default: return 'bg-muted-foreground';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'online': return 'Online';
      case 'away': return 'Away';
      case 'busy': return 'Busy';
      default: return 'Offline';
    }
  };

  const formatLastSeen = (lastSeen) => {
    if (!lastSeen) return '';
    
    const now = new Date();
    const lastSeenDate = new Date(lastSeen);
    const diffInMinutes = Math.floor((now - lastSeenDate) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Icon name="Users" size={20} />
          Team Presence
        </h3>
      </div>
      <div className="p-4">
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {teamMembers?.length > 0 ? (
            teamMembers?.map((member) => (
              <div key={member?.id} className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
                    {member?.avatar ? (
                      <Image
                        src={member?.avatar}
                        alt={member?.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                        {member?.name?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-card ${getStatusColor(member?.status)}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-foreground truncate">{member?.name}</h4>
                    <span className="text-xs text-muted-foreground">{getStatusText(member?.status)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{member?.role}</p>
                  {member?.currentProject && (
                    <p className="text-xs text-muted-foreground truncate">
                      Working on {member?.currentProject}
                    </p>
                  )}
                  {member?.status === 'offline' && member?.lastSeen && (
                    <p className="text-xs text-muted-foreground">
                      Last seen {formatLastSeen(member?.lastSeen)}
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Icon name="Users" size={48} className="text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No team members</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamPresence;