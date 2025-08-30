import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import TeamMemberCard from './components/TeamMemberCard';
import InvitationPanel from './components/InvitationPanel';
import RolePermissionMatrix from './components/RolePermissionMatrix';
import AuditLogViewer from './components/AuditLogViewer';
import BulkActionsBar from './components/BulkActionsBar';

const TeamManagement = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('members');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [viewMode, setViewMode] = useState('grid');

  // Mock data for team members
  const [teamMembers] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@company.com',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      role: 'Owner',
      status: 'Active',
      lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000),
      projectsCount: 5,
      isOnline: true
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      role: 'Editor',
      status: 'Active',
      lastActivity: new Date(Date.now() - 30 * 60 * 1000),
      projectsCount: 3,
      isOnline: true
    },
    {
      id: 3,
      name: 'Mike Chen',
      email: 'mike.chen@company.com',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      role: 'Editor',
      status: 'Active',
      lastActivity: new Date(Date.now() - 4 * 60 * 60 * 1000),
      projectsCount: 4,
      isOnline: false
    },
    {
      id: 4,
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@company.com',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      role: 'Viewer',
      status: 'Active',
      lastActivity: new Date(Date.now() - 24 * 60 * 60 * 1000),
      projectsCount: 2,
      isOnline: false
    },
    {
      id: 5,
      name: 'Alex Thompson',
      email: 'alex.thompson@company.com',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      role: 'Editor',
      status: 'Pending',
      lastActivity: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      projectsCount: 1,
      isOnline: false
    },
    {
      id: 6,
      name: 'Lisa Wang',
      email: 'lisa.wang@company.com',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      role: 'Viewer',
      status: 'Inactive',
      lastActivity: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      projectsCount: 1,
      isOnline: false
    }
  ]);

  // Mock projects data
  const projects = [
    { id: 'api-flow-v2', name: 'API Flow Designer v2.0', description: 'Main application project' },
    { id: 'user-management', name: 'User Management System', description: 'Authentication and user handling' },
    { id: 'payment-gateway', name: 'Payment Gateway API', description: 'Payment processing integration' },
    { id: 'analytics-platform', name: 'Analytics Platform', description: 'Data analytics and reporting' }
  ];

  // Mock roles and permissions
  const roles = ['Owner', 'Editor', 'Viewer'];
  const [permissions, setPermissions] = useState({
    Owner: {
      canvas_view: true, canvas_edit: true, canvas_delete: true, canvas_export: true,
      test_run: true, test_create: true, test_environments: true, test_reports: true,
      schema_view: true, schema_edit: true, schema_migrate: true, schema_backup: true,
      team_view: true, team_invite: true, team_manage: true, project_settings: true,
      deploy_staging: true, deploy_production: true, deploy_rollback: true, deploy_logs: true
    },
    Editor: {
      canvas_view: true, canvas_edit: true, canvas_delete: true, canvas_export: true,
      test_run: true, test_create: true, test_environments: true, test_reports: true,
      schema_view: true, schema_edit: true, schema_migrate: false, schema_backup: false,
      team_view: true, team_invite: false, team_manage: false, project_settings: false,
      deploy_staging: true, deploy_production: false, deploy_rollback: false, deploy_logs: true
    },
    Viewer: {
      canvas_view: true, canvas_edit: false, canvas_delete: false, canvas_export: true,
      test_run: false, test_create: false, test_environments: false, test_reports: true,
      schema_view: true, schema_edit: false, schema_migrate: false, schema_backup: false,
      team_view: true, team_invite: false, team_manage: false, project_settings: false,
      deploy_staging: false, deploy_production: false, deploy_rollback: false, deploy_logs: true
    }
  });

  // Mock audit logs
  const auditLogs = [
    {
      id: 1,
      user: { name: 'John Doe', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' },
      action: 'user_invited',
      description: 'Invited Alex Thompson to join the team as Editor',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      ipAddress: '192.168.1.100',
      project: 'API Flow Designer v2.0',
      details: { email: 'alex.thompson@company.com', role: 'Editor' }
    },
    {
      id: 2,
      user: { name: 'Sarah Johnson', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face' },
      action: 'api_deployed',
      description: 'Deployed User Authentication API to staging environment',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      ipAddress: '192.168.1.101',
      project: 'User Management System',
      resource: 'auth-api-v1.2.0'
    },
    {
      id: 3,
      user: { name: 'Mike Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' },
      action: 'schema_modified',
      description: 'Updated user table schema to include new profile fields',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      ipAddress: '192.168.1.102',
      project: 'User Management System',
      details: { table: 'users', changes: ['added profile_image', 'added bio'] }
    },
    {
      id: 4,
      user: { name: 'John Doe', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' },
      action: 'role_changed',
      description: 'Changed Emily Rodriguez role from Editor to Viewer',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      ipAddress: '192.168.1.100',
      project: 'API Flow Designer v2.0',
      details: { previousRole: 'Editor', newRole: 'Viewer' }
    },
    {
      id: 5,
      user: { name: 'Sarah Johnson', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face' },
      action: 'project_created',
      description: 'Created new project: Analytics Platform',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      ipAddress: '192.168.1.101',
      project: 'Analytics Platform'
    }
  ];

  const tabs = [
    { id: 'members', label: 'Team Members', icon: 'Users' },
    { id: 'permissions', label: 'Roles & Permissions', icon: 'Shield' },
    { id: 'audit', label: 'Audit Log', icon: 'FileText' }
  ];

  const roleFilterOptions = [
    { value: '', label: 'All Roles' },
    { value: 'Owner', label: 'Owner' },
    { value: 'Editor', label: 'Editor' },
    { value: 'Viewer', label: 'Viewer' }
  ];

  const statusFilterOptions = [
    { value: '', label: 'All Status' },
    { value: 'Active', label: 'Active' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Inactive', label: 'Inactive' }
  ];

  // Filter team members based on search and filters
  const filteredMembers = teamMembers?.filter(member => {
    const matchesSearch = member?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
                         member?.email?.toLowerCase()?.includes(searchQuery?.toLowerCase());
    const matchesRole = !roleFilter || member?.role === roleFilter;
    const matchesStatus = !statusFilter || member?.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleMemberSelect = (memberId, isSelected) => {
    setSelectedMembers(prev => 
      isSelected 
        ? [...prev, memberId]
        : prev?.filter(id => id !== memberId)
    );
  };

  const handleSelectAll = () => {
    if (selectedMembers?.length === filteredMembers?.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(filteredMembers?.map(member => member?.id));
    }
  };

  const handleBulkAction = async (action, memberIds) => {
    console.log('Bulk action:', action, 'for members:', memberIds);
    // Implement bulk action logic
    setSelectedMembers([]);
  };

  const handleSendInvitation = async (inviteData) => {
    console.log('Sending invitation:', inviteData);
    // Implement invitation logic
  };

  const handleUpdatePermissions = (role, newPermissions) => {
    setPermissions(prev => ({
      ...prev,
      [role]: newPermissions
    }));
    console.log('Updated permissions for', role, ':', newPermissions);
  };

  const handleRoleChange = (member) => {
    console.log('Change role for:', member);
    // Implement role change logic
  };

  const handleRemoveMember = (member) => {
    console.log('Remove member:', member);
    // Implement member removal logic
  };

  const handleViewActivity = (member) => {
    console.log('View activity for:', member);
    // Implement activity viewing logic
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
      />
      <Header />
      <main className={`pt-16 transition-all duration-300 ${
        isSidebarCollapsed ? 'ml-16' : 'ml-60'
      }`}>
        <div className="flex h-[calc(100vh-4rem)]">
          {/* Main Content */}
          <div className="flex-1 overflow-hidden">
            <div className="h-full flex flex-col">
              {/* Page Header */}
              <div className="bg-card border-b border-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-semibold text-foreground">Team Management</h1>
                    <p className="text-muted-foreground mt-1">
                      Manage team members, roles, and collaborative access across your projects
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      iconName="Download"
                      iconPosition="left"
                    >
                      Export Team Data
                    </Button>
                    <Button
                      variant="default"
                      iconName="UserPlus"
                      iconPosition="left"
                    >
                      Invite Member
                    </Button>
                  </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex items-center gap-1 bg-muted p-1 rounded-lg w-fit">
                  {tabs?.map((tab) => (
                    <button
                      key={tab?.id}
                      onClick={() => setActiveTab(tab?.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                        activeTab === tab?.id
                          ? 'bg-background text-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Icon name={tab?.icon} size={16} />
                      {tab?.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto">
                {activeTab === 'members' && (
                  <div className="p-6">
                    {/* Filters and Search */}
                    <div className="bg-card border border-border rounded-lg p-4 mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <Input
                            type="search"
                            placeholder="Search team members..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e?.target?.value)}
                            className="w-64"
                          />
                          
                          <Select
                            options={roleFilterOptions}
                            value={roleFilter}
                            onChange={setRoleFilter}
                            className="w-32"
                          />
                          
                          <Select
                            options={statusFilterOptions}
                            value={statusFilter}
                            onChange={setStatusFilter}
                            className="w-32"
                          />
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant={viewMode === 'grid' ? 'default' : 'outline'}
                            size="icon"
                            onClick={() => setViewMode('grid')}
                            iconName="Grid3X3"
                            iconSize={16}
                          >
                            <span className="sr-only">Grid view</span>
                          </Button>
                          <Button
                            variant={viewMode === 'list' ? 'default' : 'outline'}
                            size="icon"
                            onClick={() => setViewMode('list')}
                            iconName="List"
                            iconSize={16}
                          >
                            <span className="sr-only">List view</span>
                          </Button>
                        </div>
                      </div>
                      
                      {/* Select All */}
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedMembers?.length === filteredMembers?.length && filteredMembers?.length > 0}
                          onChange={handleSelectAll}
                          className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                        />
                        <span className="text-sm text-muted-foreground">
                          Select all ({filteredMembers?.length} members)
                        </span>
                      </div>
                    </div>

                    {/* Bulk Actions */}
                    <BulkActionsBar
                      selectedMembers={selectedMembers}
                      onBulkAction={handleBulkAction}
                      onClearSelection={() => setSelectedMembers([])}
                    />

                    {/* Team Members Grid */}
                    <div className={`grid gap-4 ${
                      viewMode === 'grid' ?'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3' :'grid-cols-1'
                    }`}>
                      {filteredMembers?.map((member) => (
                        <TeamMemberCard
                          key={member?.id}
                          member={member}
                          onRoleChange={handleRoleChange}
                          onRemove={handleRemoveMember}
                          onViewActivity={handleViewActivity}
                          isSelected={selectedMembers?.includes(member?.id)}
                          onSelect={handleMemberSelect}
                        />
                      ))}
                    </div>

                    {filteredMembers?.length === 0 && (
                      <div className="text-center py-12">
                        <Icon name="Users" size={48} className="text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-foreground mb-2">No team members found</h3>
                        <p className="text-muted-foreground">
                          Try adjusting your search criteria or invite new members to get started.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'permissions' && (
                  <div className="p-6">
                    <RolePermissionMatrix
                      roles={roles}
                      permissions={permissions}
                      onUpdatePermissions={handleUpdatePermissions}
                    />
                  </div>
                )}

                {activeTab === 'audit' && (
                  <div className="p-6">
                    <AuditLogViewer auditLogs={auditLogs} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Invitation Panel */}
          {activeTab === 'members' && (
            <InvitationPanel
              onSendInvitation={handleSendInvitation}
              projects={projects}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default TeamManagement;