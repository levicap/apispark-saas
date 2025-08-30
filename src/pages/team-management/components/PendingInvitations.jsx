import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PendingInvitations = ({ onResend, onRevoke }) => {
  const [isLoading, setIsLoading] = useState({});

  const pendingInvites = [
    {
      id: 1,
      email: 'emma.wilson@company.com',
      role: 'Developer',
      invitedBy: 'David Kim',
      invitedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      expiresDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      projects: ['E-commerce API', 'User Management']
    },
    {
      id: 2,
      email: 'john.doe@external.com',
      role: 'Read-only',
      invitedBy: 'Sarah Johnson',
      invitedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      expiresDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      projects: ['Analytics API']
    },
    {
      id: 3,
      email: 'maria.garcia@partner.com',
      role: 'Developer',
      invitedBy: 'Michael Rodriguez',
      invitedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      expiresDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
      projects: ['Payment Gateway', 'Analytics API']
    }
  ];

  const handleResend = async (inviteId) => {
    setIsLoading(prev => ({ ...prev, [`resend-${inviteId}`]: true }));
    try {
      await onResend(inviteId);
    } finally {
      setIsLoading(prev => ({ ...prev, [`resend-${inviteId}`]: false }));
    }
  };

  const handleRevoke = async (inviteId) => {
    setIsLoading(prev => ({ ...prev, [`revoke-${inviteId}`]: true }));
    try {
      await onRevoke(inviteId);
    } finally {
      setIsLoading(prev => ({ ...prev, [`revoke-${inviteId}`]: false }));
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'Admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Developer':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Read-only':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (date) => {
    return date?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntilExpiry = (expiresDate) => {
    const now = new Date();
    const diffInDays = Math.ceil((expiresDate - now) / (1000 * 60 * 60 * 24));
    return diffInDays;
  };

  const getExpiryStatus = (expiresDate) => {
    const daysLeft = getDaysUntilExpiry(expiresDate);
    if (daysLeft <= 0) return { text: 'Expired', color: 'text-red-600 bg-red-100' };
    if (daysLeft <= 2) return { text: `${daysLeft}d left`, color: 'text-yellow-600 bg-yellow-100' };
    return { text: `${daysLeft}d left`, color: 'text-green-600 bg-green-100' };
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Pending Invitations</h3>
            <p className="text-sm text-gray-600 mt-1">
              {pendingInvites?.length} invitation{pendingInvites?.length !== 1 ? 's' : ''} awaiting response
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              iconName="RefreshCw"
              iconPosition="left"
              size="sm"
            >
              Refresh
            </Button>
          </div>
        </div>
      </div>
      <div className="divide-y divide-gray-200">
        {pendingInvites?.length === 0 ? (
          <div className="p-8 text-center">
            <Icon name="Mail" size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No pending invitations</p>
          </div>
        ) : (
          pendingInvites?.map((invite) => {
            const expiryStatus = getExpiryStatus(invite?.expiresDate);
            
            return (
              <div key={invite?.id} className="p-6 hover:bg-gray-50 transition-smooth">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <Icon name="Mail" size={16} className="text-gray-500" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-gray-900">{invite?.email}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getRoleColor(invite?.role)}`}>
                            {invite?.role}
                          </span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${expiryStatus?.color}`}>
                            {expiryStatus?.text}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="ml-13 space-y-1">
                      <p className="text-sm text-gray-600">
                        Invited by <span className="font-medium">{invite?.invitedBy}</span> on {formatDate(invite?.invitedDate)}
                      </p>
                      
                      {invite?.projects?.length > 0 && (
                        <div className="flex items-center space-x-2">
                          <Icon name="Folder" size={12} className="text-gray-400" />
                          <span className="text-xs text-gray-500">
                            Access to: {invite?.projects?.join(', ')}
                          </span>
                        </div>
                      )}
                      
                      <p className="text-xs text-gray-500">
                        Expires on {formatDate(invite?.expiresDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleResend(invite?.id)}
                      loading={isLoading?.[`resend-${invite?.id}`]}
                      iconName="Send"
                      iconPosition="left"
                    >
                      Resend
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRevoke(invite?.id)}
                      loading={isLoading?.[`revoke-${invite?.id}`]}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      Revoke
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default PendingInvitations;