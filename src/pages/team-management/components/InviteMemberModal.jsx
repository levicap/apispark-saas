import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const InviteMemberModal = ({ isOpen, onClose, onInvite }) => {
  const [formData, setFormData] = useState({
    email: '',
    role: 'Developer',
    projects: [],
    sendWelcomeEmail: true
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const roleOptions = [
    { value: 'Admin', label: 'Admin', description: 'Full access to all features and settings' },
    { value: 'Developer', label: 'Developer', description: 'Can create and modify APIs and databases' },
    { value: 'Read-only', label: 'Read-only', description: 'View-only access to projects' }
  ];

  const projectOptions = [
    { value: 'ecommerce-api', label: 'E-commerce API', description: 'Main product catalog API' },
    { value: 'user-management', label: 'User Management', description: 'Authentication and user data' },
    { value: 'payment-gateway', label: 'Payment Gateway', description: 'Payment processing integration' },
    { value: 'analytics-api', label: 'Analytics API', description: 'Data analytics and reporting' }
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData?.role) {
      newErrors.role = 'Role is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      await onInvite(formData);
      setFormData({
        email: '',
        role: 'Developer',
        projects: [],
        sendWelcomeEmail: true
      });
      setErrors({});
      onClose();
    } catch (error) {
      setErrors({ submit: 'Failed to send invitation. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-300 p-4">
      <div className="bg-white rounded-lg shadow-elevation-3 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Invite Team Member</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <Icon name="X" size={16} />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="Enter email address"
            value={formData?.email}
            onChange={(e) => handleInputChange('email', e?.target?.value)}
            error={errors?.email}
            required
          />
          
          <Select
            label="Role"
            options={roleOptions}
            value={formData?.role}
            onChange={(value) => handleInputChange('role', value)}
            error={errors?.role}
            required
          />
          
          <Select
            label="Project Access"
            description="Select projects this member can access"
            options={projectOptions}
            value={formData?.projects}
            onChange={(value) => handleInputChange('projects', value)}
            multiple
            searchable
            placeholder="Select projects..."
          />
          
          <Checkbox
            label="Send welcome email"
            description="Send an email with login instructions"
            checked={formData?.sendWelcomeEmail}
            onChange={(e) => handleInputChange('sendWelcomeEmail', e?.target?.checked)}
          />
          
          {errors?.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{errors?.submit}</p>
            </div>
          )}
          
          <div className="flex items-center justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isLoading}
              iconName="Send"
              iconPosition="left"
            >
              Send Invitation
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteMemberModal;