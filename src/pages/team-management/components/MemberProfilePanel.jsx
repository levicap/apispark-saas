import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const MemberProfilePanel = ({ member, isOpen, onClose, onUpdateRole, onUpdatePermissions }) => {
  const [selectedRole, setSelectedRole] = useState(member?.role || 'Developer');
  const [permissions, setPermissions] = useState(member?.permissions || {});
  const [isLoading, setIsLoading] = useState(false);

  const roleOptions = [
    { value: 'Admin', label: 'Admin', description: 'Full access to all features' },
    { value: 'Developer', label: 'Developer', description: 'Can create and modify APIs' },
    { value: 'Read-only', label: 'Read-only', description: 'View-only access' }
  ];

  const permissionCategories = [
    {
      name: 'API Management',
      permissions: [
        { key: 'api_create', label: 'Create APIs', description: 'Create new API endpoints' },
        { key: 'api_edit', label: 'Edit APIs', description: 'Modify existing APIs' },
        { key: 'api_delete', label: 'Delete APIs', description: 'Remove API endpoints' },
        { key: 'api_deploy', label: 'Deploy APIs', description: 'Deploy to production' }
      ]
    },
    {
      name: 'Database Management',
      permissions: [
        { key: 'db_create', label: 'Create Schemas', description: 'Create database schemas' },
        { key: 'db_edit', label: 'Edit Schemas', description: 'Modify database structure' },
        { key: 'db_delete', label: 'Delete Schemas', description: 'Remove database objects' }
      ]
    },
    {
      name: 'Team Management',
      permissions: [
        { key: 'team_invite', label: 'Invite Members', description: 'Send team invitations' },
        { key: 'team_manage', label: 'Manage Roles', description: 'Change member roles' },
        { key: 'team_remove', label: 'Remove Members', description: 'Remove team members' }
      ]
    }
  ];

  const activityData = [
    {
      id: 1,
      action: 'Created API endpoint',
      target: 'User Authentication API',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      type: 'create'
    },
    {
      id: 2,
      action: 'Updated database schema',
      target: 'Users table',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      type: 'update'
    },
    {
      id: 3,
      action: 'Deployed to staging',
      target: 'E-commerce API v2.1',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      type: 'deploy'
    }
  ];

  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      await onUpdateRole(member?.id, selectedRole);
      await onUpdatePermissions(member?.id, permissions);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePermissionChange = (key, checked) => {
    setPermissions(prev => ({ ...prev, [key]: checked }));
  };

  const getActionIcon = (type) => {
    switch (type) {
      case 'create': return 'Plus';
      case 'update': return 'Edit';
      case 'deploy': return 'Rocket';
      case 'delete': return 'Trash2';
      default: return 'Activity';
    }
  };

  const formatTimestamp = (date) => {
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  if (!isOpen || !member) return null;

  return (
    <div className="fixed right-0 top-16 bottom-0 w-96 bg-white border-l border-gray-200 shadow-elevation-2 z-200 overflow-y-auto">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Member Profile</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <Icon name="X" size={16} />
          </Button>
        </div>

        {/* Member Info */}
        <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <Image
            src={member?.avatar}
            alt={member?.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{member?.name}</h3>
            <p className="text-sm text-gray-600">{member?.email}</p>
            <p className="text-xs text-gray-500 mt-1">
              Joined {new Date(member.joinedDate)?.toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Role Assignment */}
        <div className="mb-6">
          <Select
            label="Role"
            description="Change member's role and permissions"
            options={roleOptions}
            value={selectedRole}
            onChange={setSelectedRole}
          />
        </div>

        {/* Permissions */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Permissions</h4>
          <div className="space-y-4">
            {permissionCategories?.map((category) => (
              <div key={category?.name} className="border border-gray-200 rounded-lg p-4">
                <h5 className="text-sm font-medium text-gray-900 mb-3">{category?.name}</h5>
                <div className="space-y-2">
                  {category?.permissions?.map((permission) => (
                    <Checkbox
                      key={permission?.key}
                      label={permission?.label}
                      description={permission?.description}
                      checked={permissions?.[permission?.key] || false}
                      onChange={(e) => handlePermissionChange(permission?.key, e?.target?.checked)}
                      size="sm"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity History */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Recent Activity</h4>
          <div className="space-y-3">
            {activityData?.map((activity) => (
              <div key={activity?.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name={getActionIcon(activity?.type)} size={14} className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity?.action}</p>
                  <p className="text-sm text-gray-600 truncate">{activity?.target}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatTimestamp(activity?.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          <Button
            variant="default"
            onClick={handleSaveChanges}
            loading={isLoading}
            iconName="Save"
            iconPosition="left"
            fullWidth
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MemberProfilePanel;