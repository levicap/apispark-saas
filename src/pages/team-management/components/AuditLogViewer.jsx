import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Image from '../../../components/AppImage';

const AuditLogViewer = ({ auditLogs = [] }) => {
  const [filters, setFilters] = useState({
    user: '',
    action: '',
    dateRange: '7days',
    search: ''
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const actionTypeOptions = [
    { value: '', label: 'All Actions' },
    { value: 'user_invited', label: 'User Invited' },
    { value: 'user_removed', label: 'User Removed' },
    { value: 'role_changed', label: 'Role Changed' },
    { value: 'project_created', label: 'Project Created' },
    { value: 'project_deleted', label: 'Project Deleted' },
    { value: 'api_deployed', label: 'API Deployed' },
    { value: 'schema_modified', label: 'Schema Modified' },
    { value: 'permissions_updated', label: 'Permissions Updated' }
  ];

  const dateRangeOptions = [
    { value: '1day', label: 'Last 24 hours' },
    { value: '7days', label: 'Last 7 days' },
    { value: '30days', label: 'Last 30 days' },
    { value: '90days', label: 'Last 90 days' },
    { value: 'custom', label: 'Custom range' }
  ];

  const userOptions = [
    { value: '', label: 'All Users' },
    ...Array.from(new Set(auditLogs.map(log => log.user.name)))?.map(name => ({
      value: name,
      label: name
    }))
  ];

  const getActionIcon = (action) => {
    const iconMap = {
      user_invited: 'UserPlus',
      user_removed: 'UserMinus',
      role_changed: 'Shield',
      project_created: 'FolderPlus',
      project_deleted: 'FolderMinus',
      api_deployed: 'Rocket',
      schema_modified: 'Database',
      permissions_updated: 'Settings'
    };
    return iconMap?.[action] || 'Activity';
  };

  const getActionColor = (action) => {
    const colorMap = {
      user_invited: 'text-green-600 bg-green-50',
      user_removed: 'text-red-600 bg-red-50',
      role_changed: 'text-blue-600 bg-blue-50',
      project_created: 'text-purple-600 bg-purple-50',
      project_deleted: 'text-red-600 bg-red-50',
      api_deployed: 'text-orange-600 bg-orange-50',
      schema_modified: 'text-cyan-600 bg-cyan-50',
      permissions_updated: 'text-gray-600 bg-gray-50'
    };
    return colorMap?.[action] || 'text-gray-600 bg-gray-50';
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    
    return date?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date?.getFullYear() !== now?.getFullYear() ? 'numeric' : undefined,
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredLogs = auditLogs?.filter(log => {
    if (filters?.user && log?.user?.name !== filters?.user) return false;
    if (filters?.action && log?.action !== filters?.action) return false;
    if (filters?.search && !log?.description?.toLowerCase()?.includes(filters?.search?.toLowerCase())) return false;
    
    // Date range filtering would be implemented here
    return true;
  });

  const paginatedLogs = filteredLogs?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredLogs?.length / itemsPerPage);

  const handleExport = () => {
    console.log('Exporting audit logs...');
    // Implement export functionality
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Audit Log</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Track all team activities and changes across your projects
          </p>
        </div>
        
        <Button
          variant="outline"
          onClick={handleExport}
          iconName="Download"
          iconPosition="left"
        >
          Export Logs
        </Button>
      </div>
      {/* Filters */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            label="Search"
            type="search"
            placeholder="Search activities..."
            value={filters?.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e?.target?.value }))}
          />
          
          <Select
            label="User"
            options={userOptions}
            value={filters?.user}
            onChange={(value) => setFilters(prev => ({ ...prev, user: value }))}
          />
          
          <Select
            label="Action Type"
            options={actionTypeOptions}
            value={filters?.action}
            onChange={(value) => setFilters(prev => ({ ...prev, action: value }))}
          />
          
          <Select
            label="Date Range"
            options={dateRangeOptions}
            value={filters?.dateRange}
            onChange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))}
          />
        </div>
      </div>
      {/* Audit Log Entries */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="divide-y divide-border">
          {paginatedLogs?.length > 0 ? (
            paginatedLogs?.map((log) => (
              <div key={log?.id} className="p-4 hover:bg-muted/50 transition-colors duration-150">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getActionColor(log?.action)}`}>
                    <Icon name={getActionIcon(log?.action)} size={16} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Image
                        src={log?.user?.avatar}
                        alt={log?.user?.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="font-medium text-foreground">{log?.user?.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {formatTimestamp(log?.timestamp)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-foreground mb-2">{log?.description}</p>
                    
                    {log?.details && (
                      <div className="bg-muted rounded-md p-2 text-xs text-muted-foreground">
                        <pre className="whitespace-pre-wrap font-mono">{JSON.stringify(log?.details, null, 2)}</pre>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>IP: {log?.ipAddress}</span>
                      <span>•</span>
                      <span>Project: {log?.project}</span>
                      {log?.resource && (
                        <>
                          <span>•</span>
                          <span>Resource: {log?.resource}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No audit logs found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters or search criteria
              </p>
            </div>
          )}
        </div>
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredLogs?.length)} of {filteredLogs?.length} entries
          </p>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              iconName="ChevronLeft"
              iconPosition="left"
            >
              Previous
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              iconName="ChevronRight"
              iconPosition="right"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLogViewer;