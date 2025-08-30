import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const RolePermissionMatrix = ({ roles, permissions, onUpdatePermissions }) => {
  const [editingRole, setEditingRole] = useState(null);
  const [tempPermissions, setTempPermissions] = useState({});

  const permissionCategories = [
    {
      name: 'Canvas & Design',
      icon: 'Workflow',
      permissions: [
        { key: 'canvas_view', label: 'View Canvas', description: 'View API flow diagrams' },
        { key: 'canvas_edit', label: 'Edit Canvas', description: 'Create and modify API flows' },
        { key: 'canvas_delete', label: 'Delete Elements', description: 'Remove nodes and connections' },
        { key: 'canvas_export', label: 'Export Designs', description: 'Export to various formats' }
      ]
    },
    {
      name: 'API Testing',
      icon: 'TestTube',
      permissions: [
        { key: 'test_run', label: 'Run Tests', description: 'Execute API tests' },
        { key: 'test_create', label: 'Create Tests', description: 'Design test scenarios' },
        { key: 'test_environments', label: 'Manage Environments', description: 'Configure test environments' },
        { key: 'test_reports', label: 'View Reports', description: 'Access test results and analytics' }
      ]
    },
    {
      name: 'Database Schema',
      icon: 'Database',
      permissions: [
        { key: 'schema_view', label: 'View Schemas', description: 'View database designs' },
        { key: 'schema_edit', label: 'Edit Schemas', description: 'Modify database structures' },
        { key: 'schema_migrate', label: 'Run Migrations', description: 'Execute schema changes' },
        { key: 'schema_backup', label: 'Backup & Restore', description: 'Manage schema backups' }
      ]
    },
    {
      name: 'Team & Projects',
      icon: 'Users',
      permissions: [
        { key: 'team_view', label: 'View Team', description: 'See team members and roles' },
        { key: 'team_invite', label: 'Invite Members', description: 'Send team invitations' },
        { key: 'team_manage', label: 'Manage Roles', description: 'Change member permissions' },
        { key: 'project_settings', label: 'Project Settings', description: 'Configure project options' }
      ]
    },
    {
      name: 'Deployment',
      icon: 'Rocket',
      permissions: [
        { key: 'deploy_staging', label: 'Deploy to Staging', description: 'Deploy to staging environment' },
        { key: 'deploy_production', label: 'Deploy to Production', description: 'Deploy to production environment' },
        { key: 'deploy_rollback', label: 'Rollback Deployments', description: 'Revert deployments' },
        { key: 'deploy_logs', label: 'View Deployment Logs', description: 'Access deployment history' }
      ]
    }
  ];

  const handleEditRole = (role) => {
    setEditingRole(role);
    setTempPermissions(permissions?.[role] || {});
  };

  const handleSavePermissions = () => {
    onUpdatePermissions(editingRole, tempPermissions);
    setEditingRole(null);
    setTempPermissions({});
  };

  const handleCancelEdit = () => {
    setEditingRole(null);
    setTempPermissions({});
  };

  const handlePermissionToggle = (permissionKey) => {
    setTempPermissions(prev => ({
      ...prev,
      [permissionKey]: !prev?.[permissionKey]
    }));
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'Owner':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'Editor':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Viewer':
        return 'text-gray-600 bg-gray-50 border-gray-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Roles & Permissions</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Configure what each role can do in your projects
          </p>
        </div>
        
        {editingRole && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleCancelEdit}
              iconName="X"
              iconPosition="left"
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleSavePermissions}
              iconName="Check"
              iconPosition="left"
            >
              Save Changes
            </Button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {roles?.map((role) => (
          <div key={role} className="bg-card border border-border rounded-lg overflow-hidden">
            <div className={`p-4 border-b border-border ${getRoleColor(role)}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{role}</h3>
                  <p className="text-sm opacity-80 mt-1">
                    {role === 'Owner' && 'Full administrative access'}
                    {role === 'Editor' && 'Can create and modify content'}
                    {role === 'Viewer' && 'Read-only access to projects'}
                  </p>
                </div>
                
                {role !== 'Owner' && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditRole(role)}
                    iconName="Edit"
                    iconSize={16}
                  >
                    <span className="sr-only">Edit {role} permissions</span>
                  </Button>
                )}
              </div>
            </div>

            <div className="p-4 space-y-4">
              {permissionCategories?.map((category) => (
                <div key={category?.name}>
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name={category?.icon} size={16} className="text-muted-foreground" />
                    <h4 className="text-sm font-medium text-foreground">{category?.name}</h4>
                  </div>
                  
                  <div className="space-y-2 ml-6">
                    {category?.permissions?.map((permission) => {
                      const isEnabled = editingRole === role 
                        ? tempPermissions?.[permission?.key] 
                        : permissions?.[role]?.[permission?.key];
                      
                      const isDisabled = role === 'Owner' || (editingRole && editingRole !== role);
                      
                      return (
                        <div key={permission?.key} className="flex items-start gap-2">
                          <Checkbox
                            checked={role === 'Owner' ? true : isEnabled || false}
                            onChange={() => editingRole === role && handlePermissionToggle(permission?.key)}
                            disabled={isDisabled}
                            size="sm"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-foreground">{permission?.label}</p>
                            <p className="text-xs text-muted-foreground">{permission?.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* Permission Templates */}
      <div className="bg-muted/50 rounded-lg p-4">
        <h3 className="font-medium text-foreground mb-3">Quick Permission Templates</h3>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => console.log('Apply developer template')}
            iconName="Code"
            iconPosition="left"
          >
            Developer Template
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => console.log('Apply designer template')}
            iconName="Palette"
            iconPosition="left"
          >
            Designer Template
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => console.log('Apply tester template')}
            iconName="Bug"
            iconPosition="left"
          >
            QA Tester Template
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => console.log('Apply manager template')}
            iconName="Shield"
            iconPosition="left"
          >
            Project Manager Template
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RolePermissionMatrix;