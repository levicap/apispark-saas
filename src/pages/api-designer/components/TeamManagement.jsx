import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const TeamManagement = ({ isOpen, onClose, currentProject }) => {
  const [activeTab, setActiveTab] = useState('members');
  const [inviteEmail, setInviteEmail] = useState('');

  // Mock team data
  const mockTeamMembers = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'admin',
      avatar: 'JD',
      status: 'online',
      lastActive: '2 minutes ago',
      workingOn: 'API Designer - User endpoints',
      permissions: ['read', 'write', 'admin']
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'developer',
      avatar: 'JS',
      status: 'online',
      lastActive: '5 minutes ago',
      workingOn: 'API Designer - Authentication',
      permissions: ['read', 'write']
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike@example.com',
      role: 'viewer',
      avatar: 'MJ',
      status: 'away',
      lastActive: '1 hour ago',
      workingOn: 'API Designer - Documentation',
      permissions: ['read']
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      role: 'developer',
      avatar: 'SW',
      status: 'offline',
      lastActive: '3 hours ago',
      workingOn: 'API Designer - Database schema',
      permissions: ['read', 'write']
    }
  ];

  const mockInvitations = [
    {
      id: 1,
      email: 'alex@example.com',
      role: 'developer',
      invitedBy: 'John Doe',
      invitedAt: '2024-01-15T10:30:00Z',
      expiresAt: '2024-01-22T10:30:00Z'
    },
    {
      id: 2,
      email: 'emma@example.com',
      role: 'viewer',
      invitedBy: 'Jane Smith',
      invitedAt: '2024-01-14T15:45:00Z',
      expiresAt: '2024-01-21T15:45:00Z'
    }
  ];

  const mockActivityLog = [
    {
      id: 1,
      user: 'John Doe',
      action: 'created endpoint',
      target: 'POST /api/users',
      timestamp: '2024-01-15T14:30:00Z',
      type: 'create'
    },
    {
      id: 2,
      user: 'Jane Smith',
      action: 'updated endpoint',
      target: 'GET /api/products',
      timestamp: '2024-01-15T13:15:00Z',
      type: 'update'
    },
    {
      id: 3,
      user: 'Mike Johnson',
      action: 'viewed documentation',
      target: 'API Documentation',
      timestamp: '2024-01-15T12:00:00Z',
      type: 'view'
    },
    {
      id: 4,
      user: 'Sarah Wilson',
      action: 'added database table',
      target: 'users table',
      timestamp: '2024-01-15T11:45:00Z',
      type: 'create'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'developer': return 'bg-blue-100 text-blue-800';
      case 'viewer': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionIcon = (type) => {
    switch (type) {
      case 'create': return 'Plus';
      case 'update': return 'Edit';
      case 'delete': return 'Trash';
      case 'view': return 'Eye';
      default: return 'Activity';
    }
  };

  const handleInvite = () => {
    if (!inviteEmail.trim()) {
      alert('Please enter an email address');
      return;
    }
    // Simulate invitation
    alert(`Invitation sent to ${inviteEmail}`);
    setInviteEmail('');
  };

  const handleRemoveMember = (memberId) => {
    if (confirm('Are you sure you want to remove this team member?')) {
      alert('Team member removed');
    }
  };

  const handleCancelInvitation = (invitationId) => {
    if (confirm('Are you sure you want to cancel this invitation?')) {
      alert('Invitation cancelled');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background border border-border rounded-lg shadow-elevation-3 w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Team Management</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Manage team members for {currentProject?.name}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Left Panel - Tabs */}
          <div className="w-64 bg-surface border-r border-border">
            <div className="p-4 space-y-2">
              <button
                onClick={() => setActiveTab('members')}
                className={`w-full text-left px-3 py-2 rounded-lg transition-smooth ${
                  activeTab === 'members'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon name="Users" size={16} />
                  <span>Team Members</span>
                  <span className="ml-auto text-xs bg-white/20 px-2 py-0.5 rounded">
                    {mockTeamMembers.length}
                  </span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('invitations')}
                className={`w-full text-left px-3 py-2 rounded-lg transition-smooth ${
                  activeTab === 'invitations'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon name="Mail" size={16} />
                  <span>Invitations</span>
                  <span className="ml-auto text-xs bg-white/20 px-2 py-0.5 rounded">
                    {mockInvitations.length}
                  </span>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('activity')}
                className={`w-full text-left px-3 py-2 rounded-lg transition-smooth ${
                  activeTab === 'activity'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Icon name="Activity" size={16} />
                  <span>Activity Log</span>
                </div>
              </button>
            </div>
          </div>

          {/* Right Panel - Content */}
          <div className="flex-1 flex flex-col">
            {activeTab === 'members' && (
              <div className="flex-1 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-foreground">Team Members</h3>
                  <Button size="sm">
                    <Icon name="Plus" size={14} className="mr-2" />
                    Invite Member
                  </Button>
                </div>

                <div className="space-y-4">
                  {mockTeamMembers.map(member => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-medium">
                            {member.avatar}
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(member.status)} rounded-full border-2 border-background`}></div>
                        </div>
                        
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-foreground">{member.name}</h4>
                            <span className={`px-2 py-1 text-xs rounded-full ${getRoleColor(member.role)}`}>
                              {member.role}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                          <p className="text-xs text-muted-foreground">
                            Working on: {member.workingOn}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Last active: {member.lastActive}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Icon name="MessageSquare" size={14} />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Icon name="Settings" size={14} />
                        </Button>
                        {member.role !== 'admin' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveMember(member.id)}
                          >
                            <Icon name="UserMinus" size={14} />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'invitations' && (
              <div className="flex-1 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-foreground">Pending Invitations</h3>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className="w-64"
                    />
                    <Button size="sm" onClick={handleInvite}>
                      <Icon name="Send" size={14} className="mr-2" />
                      Invite
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {mockInvitations.map(invitation => (
                    <div
                      key={invitation.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-foreground">{invitation.email}</h4>
                          <span className={`px-2 py-1 text-xs rounded-full ${getRoleColor(invitation.role)}`}>
                            {invitation.role}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Invited by {invitation.invitedBy} on {new Date(invitation.invitedAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Expires: {new Date(invitation.expiresAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Icon name="RefreshCw" size={14} className="mr-2" />
                          Resend
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelInvitation(invitation.id)}
                        >
                          <Icon name="X" size={14} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="flex-1 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-foreground">Recent Activity</h3>
                  <Button variant="outline" size="sm">
                    <Icon name="Download" size={14} className="mr-2" />
                    Export Log
                  </Button>
                </div>

                <div className="space-y-3">
                  {mockActivityLog.map(activity => (
                    <div
                      key={activity.id}
                      className="flex items-center space-x-3 p-3 border border-border rounded-lg"
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.type === 'create' ? 'bg-green-100 text-green-600' :
                        activity.type === 'update' ? 'bg-blue-100 text-blue-600' :
                        activity.type === 'delete' ? 'bg-red-100 text-red-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        <Icon name={getActionIcon(activity.type)} size={14} />
                      </div>
                      
                      <div className="flex-1">
                        <p className="text-sm text-foreground">
                          <span className="font-medium">{activity.user}</span> {activity.action}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.target} • {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamManagement;
