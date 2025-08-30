import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';

const AuditLogPanel = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('7days');

  const filterOptions = [
    { value: 'all', label: 'All Activities' },
    { value: 'member', label: 'Member Changes' },
    { value: 'permission', label: 'Permission Changes' },
    { value: 'security', label: 'Security Events' },
    { value: 'project', label: 'Project Access' }
  ];

  const dateRangeOptions = [
    { value: '24hours', label: 'Last 24 Hours' },
    { value: '7days', label: 'Last 7 Days' },
    { value: '30days', label: 'Last 30 Days' },
    { value: '90days', label: 'Last 90 Days' }
  ];

  const auditLogs = [
    {
      id: 1,
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      actor: 'Sarah Johnson',
      action: 'Updated role',
      target: 'Michael Rodriguez',
      details: 'Changed role from Developer to Admin',
      type: 'member',
      severity: 'medium'
    },
    {
      id: 2,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      actor: 'System',
      action: 'Failed login attempt',
      target: 'alex.chen@company.com',
      details: 'Multiple failed login attempts detected',
      type: 'security',
      severity: 'high'
    },
    {
      id: 3,
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      actor: 'David Kim',
      action: 'Invited member',
      target: 'emma.wilson@company.com',
      details: 'Sent invitation with Developer role',
      type: 'member',
      severity: 'low'
    },
    {
      id: 4,
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      actor: 'Sarah Johnson',
      action: 'Granted project access',
      target: 'Payment Gateway API',
      details: 'Added Lisa Park to project team',
      type: 'project',
      severity: 'medium'
    },
    {
      id: 5,
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      actor: 'Michael Rodriguez',
      action: 'Revoked permissions',
      target: 'John Smith',
      details: 'Removed API deployment permissions',
      type: 'permission',
      severity: 'medium'
    }
  ];

  const getActionIcon = (type) => {
    switch (type) {
      case 'member': return 'Users';
      case 'permission': return 'Shield';
      case 'security': return 'AlertTriangle';
      case 'project': return 'Folder';
      default: return 'Activity';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTimestamp = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const filteredLogs = auditLogs?.filter(log => {
    const matchesFilter = selectedFilter === 'all' || log?.type === selectedFilter;
    const matchesSearch = searchQuery === '' || 
      log?.actor?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      log?.action?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
      log?.target?.toLowerCase()?.includes(searchQuery?.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Audit Log</h3>
          <Button
            variant="outline"
            iconName="Download"
            iconPosition="left"
            size="sm"
          >
            Export
          </Button>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <Input
              type="search"
              placeholder="Search audit logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e?.target?.value)}
            />
          </div>
          
          <Select
            options={filterOptions}
            value={selectedFilter}
            onChange={setSelectedFilter}
            placeholder="Filter by type"
            className="w-48"
          />
          
          <Select
            options={dateRangeOptions}
            value={dateRange}
            onChange={setDateRange}
            className="w-48"
          />
        </div>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {filteredLogs?.length === 0 ? (
          <div className="p-8 text-center">
            <Icon name="Search" size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No audit logs found matching your criteria</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredLogs?.map((log) => (
              <div key={log?.id} className="p-4 hover:bg-gray-50 transition-smooth">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon name={getActionIcon(log?.type)} size={14} className="text-blue-600" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900">
                        {log?.actor} {log?.action?.toLowerCase()} {log?.target}
                      </p>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(log?.severity)}`}>
                          {log?.severity}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatTimestamp(log?.timestamp)}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600">{log?.details}</p>
                    
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span>IP: 192.168.1.100</span>
                      <span>Session: abc123def</span>
                      <span>{log?.timestamp?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLogPanel;