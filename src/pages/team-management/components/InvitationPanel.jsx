import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const InvitationPanel = ({ onSendInvitation, projects = [] }) => {
  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: 'Viewer',
    message: '',
    selectedProjects: [],
    sendWelcomeEmail: true
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const roleOptions = [
    { value: 'Owner', label: 'Owner', description: 'Full access to all features and settings' },
    { value: 'Editor', label: 'Editor', description: 'Can edit APIs, schemas, and collaborate' },
    { value: 'Viewer', label: 'Viewer', description: 'Read-only access to view projects' }
  ];

  const projectOptions = projects?.map(project => ({
    value: project?.id,
    label: project?.name,
    description: project?.description
  }));

  const validateForm = () => {
    const newErrors = {};
    
    if (!inviteForm?.email) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/?.test(inviteForm?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (inviteForm?.selectedProjects?.length === 0) {
      newErrors.projects = 'Please select at least one project';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      await onSendInvitation(inviteForm);
      // Reset form on success
      setInviteForm({
        email: '',
        role: 'Viewer',
        message: '',
        selectedProjects: [],
        sendWelcomeEmail: true
      });
      setErrors({});
    } catch (error) {
      setErrors({ submit: 'Failed to send invitation. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProjectToggle = (projectId) => {
    setInviteForm(prev => ({
      ...prev,
      selectedProjects: prev?.selectedProjects?.includes(projectId)
        ? prev?.selectedProjects?.filter(id => id !== projectId)
        : [...prev?.selectedProjects, projectId]
    }));
  };

  return (
    <div className="w-80 bg-card border-l border-border h-full overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Icon name="UserPlus" size={20} className="text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Invite Team Member</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="colleague@company.com"
            value={inviteForm?.email}
            onChange={(e) => setInviteForm(prev => ({ ...prev, email: e?.target?.value }))}
            error={errors?.email}
            required
          />

          <Select
            label="Role"
            options={roleOptions}
            value={inviteForm?.role}
            onChange={(value) => setInviteForm(prev => ({ ...prev, role: value }))}
            description="Choose the appropriate access level"
          />

          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">
              Project Access
            </label>
            <div className="space-y-2 max-h-40 overflow-y-auto border border-border rounded-md p-3">
              {projectOptions?.map((project) => (
                <Checkbox
                  key={project?.value}
                  label={project?.label}
                  description={project?.description}
                  checked={inviteForm?.selectedProjects?.includes(project?.value)}
                  onChange={() => handleProjectToggle(project?.value)}
                />
              ))}
            </div>
            {errors?.projects && (
              <p className="text-sm text-error">{errors?.projects}</p>
            )}
          </div>

          <Input
            label="Personal Message (Optional)"
            type="text"
            placeholder="Welcome to our team! Looking forward to collaborating..."
            value={inviteForm?.message}
            onChange={(e) => setInviteForm(prev => ({ ...prev, message: e?.target?.value }))}
            description="Add a personal touch to the invitation"
          />

          <Checkbox
            label="Send welcome email"
            description="Include onboarding information and getting started guide"
            checked={inviteForm?.sendWelcomeEmail}
            onChange={(e) => setInviteForm(prev => ({ ...prev, sendWelcomeEmail: e?.target?.checked }))}
          />

          {errors?.submit && (
            <div className="p-3 bg-error/10 border border-error/20 rounded-md">
              <p className="text-sm text-error">{errors?.submit}</p>
            </div>
          )}

          <Button
            type="submit"
            variant="default"
            fullWidth
            loading={isLoading}
            iconName="Send"
            iconPosition="left"
          >
            Send Invitation
          </Button>
        </form>

        {/* Recent Invitations */}
        <div className="mt-8">
          <h3 className="text-sm font-medium text-foreground mb-3">Recent Invitations</h3>
          <div className="space-y-2">
            {[
              { email: 'sarah.johnson@company.com', status: 'Pending', sentAt: '2 hours ago' },
              { email: 'mike.chen@company.com', status: 'Accepted', sentAt: '1 day ago' },
              { email: 'alex.rodriguez@company.com', status: 'Expired', sentAt: '1 week ago' }
            ]?.map((invitation, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{invitation?.email}</p>
                  <p className="text-xs text-muted-foreground">{invitation?.sentAt}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  invitation?.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                  invitation?.status === 'Pending'? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                }`}>
                  {invitation?.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvitationPanel;