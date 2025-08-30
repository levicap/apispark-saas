import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import ConnectionProfileCard from './ConnectionProfileCard';

const ConnectionProfilesList = ({ 
  profiles, 
  selectedProfile, 
  onSelectProfile, 
  onTestProfile, 
  onDuplicateProfile, 
  onDeleteProfile, 
  onCreateNew 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterEnvironment, setFilterEnvironment] = useState('all');

  const databaseTypeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'postgresql', label: 'PostgreSQL' },
    { value: 'mysql', label: 'MySQL' },
    { value: 'sqlite', label: 'SQLite' },
    { value: 'mongodb', label: 'MongoDB' },
    { value: 'firebase', label: 'Firebase' },
    { value: 'supabase', label: 'Supabase' },
    { value: 'redis', label: 'Redis' },
    { value: 'mssql', label: 'SQL Server' }
  ];

  const environmentOptions = [
    { value: 'all', label: 'All Environments' },
    { value: 'development', label: 'Development' },
    { value: 'staging', label: 'Staging' },
    { value: 'production', label: 'Production' },
    { value: 'testing', label: 'Testing' }
  ];

  const filteredProfiles = profiles?.filter(profile => {
    const matchesSearch = profile?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         profile?.host?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         profile?.database?.toLowerCase()?.includes(searchTerm?.toLowerCase());
    
    const matchesType = filterType === 'all' || profile?.type === filterType;
    const matchesEnvironment = filterEnvironment === 'all' || profile?.environment === filterEnvironment;
    
    return matchesSearch && matchesType && matchesEnvironment;
  });

  const getStatusCounts = () => {
    return profiles?.reduce((acc, profile) => {
      acc[profile.status] = (acc?.[profile?.status] || 0) + 1;
      return acc;
    }, {});
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="h-full flex flex-col bg-surface border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">Connections</h2>
            <p className="text-sm text-text-secondary">
              {profiles?.length} profile{profiles?.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <Button
            variant="default"
            size="sm"
            iconName="Plus"
            iconPosition="left"
            onClick={onCreateNew}
          >
            New
          </Button>
        </div>

        {/* Status Summary */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center p-2 bg-success/10 rounded-lg">
            <div className="text-lg font-semibold text-success">
              {statusCounts?.connected || 0}
            </div>
            <div className="text-xs text-text-secondary">Connected</div>
          </div>
          <div className="text-center p-2 bg-error/10 rounded-lg">
            <div className="text-lg font-semibold text-error">
              {statusCounts?.disconnected || 0}
            </div>
            <div className="text-xs text-text-secondary">Disconnected</div>
          </div>
          <div className="text-center p-2 bg-warning/10 rounded-lg">
            <div className="text-lg font-semibold text-warning">
              {statusCounts?.testing || 0}
            </div>
            <div className="text-xs text-text-secondary">Testing</div>
          </div>
        </div>

        {/* Search */}
        <Input
          type="search"
          placeholder="Search connections..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e?.target?.value)}
          className="mb-3"
        />

        {/* Filters */}
        <div className="space-y-2">
          <Select
            placeholder="Filter by type"
            options={databaseTypeOptions}
            value={filterType}
            onChange={setFilterType}
          />
          
          <Select
            placeholder="Filter by environment"
            options={environmentOptions}
            value={filterEnvironment}
            onChange={setFilterEnvironment}
          />
        </div>
      </div>
      {/* Profiles List */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredProfiles?.length > 0 ? (
          <div className="space-y-3">
            {filteredProfiles?.map((profile) => (
              <ConnectionProfileCard
                key={profile?.id}
                profile={profile}
                isSelected={selectedProfile?.id === profile?.id}
                onSelect={onSelectProfile}
                onTest={onTestProfile}
                onDuplicate={onDuplicateProfile}
                onDelete={onDeleteProfile}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            {profiles?.length === 0 ? (
              <>
                <Icon name="Database" size={48} className="mx-auto mb-3 text-text-secondary opacity-50" />
                <h3 className="text-base font-medium text-text-primary mb-2">
                  No connections yet
                </h3>
                <p className="text-sm text-text-secondary mb-4">
                  Create your first database connection to get started
                </p>
                <Button
                  variant="default"
                  iconName="Plus"
                  iconPosition="left"
                  onClick={onCreateNew}
                >
                  Create Connection
                </Button>
              </>
            ) : (
              <>
                <Icon name="Search" size={48} className="mx-auto mb-3 text-text-secondary opacity-50" />
                <h3 className="text-base font-medium text-text-primary mb-2">
                  No matches found
                </h3>
                <p className="text-sm text-text-secondary mb-4">
                  Try adjusting your search or filter criteria
                </p>
                <Button
                  variant="outline"
                  iconName="X"
                  iconPosition="left"
                  onClick={() => {
                    setSearchTerm('');
                    setFilterType('all');
                    setFilterEnvironment('all');
                  }}
                >
                  Clear Filters
                </Button>
              </>
            )}
          </div>
        )}
      </div>
      {/* Quick Actions */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconSize={14}
            className="flex-1"
          >
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="Upload"
            iconSize={14}
            className="flex-1"
          >
            Import
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConnectionProfilesList;