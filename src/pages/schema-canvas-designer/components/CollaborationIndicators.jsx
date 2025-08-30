import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const CollaborationIndicators = ({ 
  collaborators = [], 
  currentUser = null,
  showCursors = true,
  showPresence = true 
}) => {
  const [cursors, setCursors] = useState([]);
  const [lastSaved, setLastSaved] = useState(new Date());

  const mockCollaborators = [
    {
      id: 'user-1',
      name: 'Sarah Chen',
      email: 'sarah.chen@company.com',
      avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
      color: '#3b82f6',
      isActive: true,
      cursor: { x: 450, y: 200 },
      lastActivity: new Date(Date.now() - 30000)
    },
    {
      id: 'user-2',
      name: 'Mike Rodriguez',
      email: 'mike.rodriguez@company.com',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
      color: '#10b981',
      isActive: true,
      cursor: { x: 650, y: 350 },
      lastActivity: new Date(Date.now() - 120000)
    },
    {
      id: 'user-3',
      name: 'Emma Thompson',
      email: 'emma.thompson@company.com',
      avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
      color: '#f59e0b',
      isActive: false,
      cursor: null,
      lastActivity: new Date(Date.now() - 300000)
    }
  ];

  const mockCurrentUser = {
    id: 'current-user',
    name: 'John Doe',
    email: 'john.doe@company.com',
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg'
  };

  const allCollaborators = collaborators?.length > 0 ? collaborators : mockCollaborators;
  const user = currentUser || mockCurrentUser;

  useEffect(() => {
    // Simulate cursor movements
    const interval = setInterval(() => {
      setCursors(prev => 
        allCollaborators?.filter(c => c?.isActive && c?.cursor)?.map(c => ({
            ...c,
            cursor: {
              x: c?.cursor?.x + (Math.random() - 0.5) * 20,
              y: c?.cursor?.y + (Math.random() - 0.5) * 20
            }
          }))
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [allCollaborators]);

  useEffect(() => {
    // Simulate auto-save
    const saveInterval = setInterval(() => {
      setLastSaved(new Date());
    }, 30000);

    return () => clearInterval(saveInterval);
  }, []);

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <>
      {/* Collaboration Header */}
      {showPresence && (
        <div className="fixed top-4 right-4 z-150">
          <div className="bg-surface border border-border rounded-lg shadow-depth p-3">
            <div className="flex items-center space-x-3">
              {/* Active Collaborators */}
              <div className="flex -space-x-2">
                {allCollaborators?.filter(c => c?.isActive)?.slice(0, 3)?.map((collaborator) => (
                    <div
                      key={collaborator?.id}
                      className="relative"
                      title={`${collaborator?.name} - ${formatTimeAgo(collaborator?.lastActivity)}`}
                    >
                      <img
                        src={collaborator?.avatar}
                        alt={collaborator?.name}
                        className="w-8 h-8 rounded-full border-2 border-surface"
                        style={{ borderColor: collaborator?.color }}
                      />
                      <div 
                        className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-surface"
                        style={{ backgroundColor: collaborator?.color }}
                      />
                    </div>
                  ))}
                
                {allCollaborators?.filter(c => c?.isActive)?.length > 3 && (
                  <div className="w-8 h-8 rounded-full bg-muted border-2 border-surface flex items-center justify-center">
                    <span className="text-xs font-medium text-text-secondary">
                      +{allCollaborators?.filter(c => c?.isActive)?.length - 3}
                    </span>
                  </div>
                )}
              </div>

              {/* Save Status */}
              <div className="flex items-center space-x-2 text-sm">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-success rounded-full" />
                  <span className="text-text-secondary">
                    Saved {formatTimeAgo(lastSaved)}
                  </span>
                </div>
              </div>

              {/* Share Button */}
              <button className="flex items-center space-x-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-smooth">
                <Icon name="Share2" size={14} />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Live Cursors */}
      {showCursors && (
        <div className="fixed inset-0 pointer-events-none z-100">
          {(cursors?.length > 0 ? cursors : allCollaborators?.filter(c => c?.isActive && c?.cursor))?.map((collaborator) => (
            <div
              key={collaborator?.id}
              className="absolute transition-all duration-200 ease-out"
              style={{
                left: collaborator?.cursor?.x || 0,
                top: collaborator?.cursor?.y || 0,
                transform: 'translate(-2px, -2px)'
              }}
            >
              {/* Cursor */}
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className="drop-shadow-sm"
              >
                <path
                  d="M2 2L18 8L8 12L2 18V2Z"
                  fill={collaborator?.color}
                  stroke="white"
                  strokeWidth="1"
                />
              </svg>
              
              {/* Name Tag */}
              <div
                className="absolute top-5 left-2 px-2 py-1 rounded text-xs font-medium text-white shadow-sm whitespace-nowrap"
                style={{ backgroundColor: collaborator?.color }}
              >
                {collaborator?.name?.split(' ')?.[0]}
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Collaboration Panel (Hidden by default, can be toggled) */}
      <div className="hidden fixed bottom-4 right-4 w-80 bg-surface border border-border rounded-lg shadow-depth z-150">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-text-primary">Collaborators</h3>
            <button className="text-text-secondary hover:text-text-primary">
              <Icon name="X" size={16} />
            </button>
          </div>

          <div className="space-y-3">
            {allCollaborators?.map((collaborator) => (
              <div key={collaborator?.id} className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={collaborator?.avatar}
                    alt={collaborator?.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div 
                    className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-surface ${
                      collaborator?.isActive ? 'bg-success' : 'bg-muted'
                    }`}
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-text-primary truncate">
                    {collaborator?.name}
                  </div>
                  <div className="text-xs text-text-secondary">
                    {collaborator?.isActive ? 'Active now' : formatTimeAgo(collaborator?.lastActivity)}
                  </div>
                </div>

                {collaborator?.isActive && (
                  <div className="flex items-center space-x-1">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: collaborator?.color }}
                    />
                    <span className="text-xs text-text-secondary">Editing</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CollaborationIndicators;