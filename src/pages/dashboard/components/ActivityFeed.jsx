import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ActivityFeed = ({ activities }) => {
  const formatTimeAgo = (date) => {
    const now = new Date();
    const activityDate = new Date(date);
    const diffInMinutes = Math.floor((now - activityDate) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return activityDate?.toLocaleDateString();
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'project_created': return 'Plus';
      case 'project_updated': return 'Edit';
      case 'api_endpoint_added': return 'Globe';
      case 'schema_modified': return 'Database';
      case 'team_member_added': return 'UserPlus';
      case 'comment_added': return 'MessageCircle';
      case 'test_run': return 'TestTube';
      case 'deployment': return 'Rocket';
      default: return 'Activity';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'project_created': return 'text-success';
      case 'project_updated': return 'text-accent';
      case 'api_endpoint_added': return 'text-primary';
      case 'schema_modified': return 'text-warning';
      case 'team_member_added': return 'text-success';
      case 'comment_added': return 'text-accent';
      case 'test_run': return 'text-primary';
      case 'deployment': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          <Icon name="Activity" size={20} />
          Recent Activity
        </h3>
      </div>
      <div className="p-4">
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {activities?.length > 0 ? (
            activities?.map((activity) => (
              <div key={activity?.id} className="flex items-start gap-3">
                <div className={`p-2 rounded-full bg-muted ${getActivityColor(activity?.type)}`}>
                  <Icon name={getActivityIcon(activity?.type)} size={16} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-full overflow-hidden bg-muted flex-shrink-0">
                      {activity?.user?.avatar ? (
                        <Image
                          src={activity?.user?.avatar}
                          alt={activity?.user?.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
                          {activity?.user?.name?.charAt(0)}
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-medium text-foreground">{activity?.user?.name}</span>
                    <span className="text-xs text-muted-foreground">{formatTimeAgo(activity?.timestamp)}</span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">{activity?.description}</p>
                  
                  {activity?.project && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      in <span className="font-medium">{activity?.project}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Icon name="Activity" size={48} className="text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No recent activity</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityFeed;