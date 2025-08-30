import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const MigrationFilters = ({ onFiltersChange, onExport, onBatchOperation }) => {
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    environment: 'all',
    author: 'all',
    dateRange: 'all'
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'applied', label: 'Applied' },
    { value: 'pending', label: 'Pending' },
    { value: 'failed', label: 'Failed' },
    { value: 'rolled_back', label: 'Rolled Back' }
  ];

  const environmentOptions = [
    { value: 'all', label: 'All Environments' },
    { value: 'development', label: 'Development' },
    { value: 'staging', label: 'Staging' },
    { value: 'production', label: 'Production' }
  ];

  const authorOptions = [
    { value: 'all', label: 'All Authors' },
    { value: 'john_doe', label: 'John Doe' },
    { value: 'jane_smith', label: 'Jane Smith' },
    { value: 'mike_wilson', label: 'Mike Wilson' },
    { value: 'sarah_johnson', label: 'Sarah Johnson' }
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      search: '',
      status: 'all',
      environment: 'all',
      author: 'all',
      dateRange: 'all'
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters)?.some(value => value !== '' && value !== 'all');

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-4">
      {/* Primary Filters Row */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 space-y-4 lg:space-y-0">
        
        {/* Search */}
        <div className="flex-1 lg:max-w-sm">
          <Input
            type="search"
            placeholder="Search migrations..."
            value={filters?.search}
            onChange={(e) => handleFilterChange('search', e?.target?.value)}
            className="w-full"
          />
        </div>

        {/* Status Filter */}
        <div className="lg:w-40">
          <Select
            options={statusOptions}
            value={filters?.status}
            onChange={(value) => handleFilterChange('status', value)}
            placeholder="Status"
          />
        </div>

        {/* Environment Filter */}
        <div className="lg:w-40">
          <Select
            options={environmentOptions}
            value={filters?.environment}
            onChange={(value) => handleFilterChange('environment', value)}
            placeholder="Environment"
          />
        </div>

        {/* Advanced Toggle */}
        <Button
          variant="outline"
          size="sm"
          iconName={showAdvanced ? "ChevronUp" : "ChevronDown"}
          iconPosition="right"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          Advanced
        </Button>
      </div>
      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="border-t border-border pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Author Filter */}
            <Select
              label="Author"
              options={authorOptions}
              value={filters?.author}
              onChange={(value) => handleFilterChange('author', value)}
            />

            {/* Date Range Filter */}
            <Select
              label="Date Range"
              options={dateRangeOptions}
              value={filters?.dateRange}
              onChange={(value) => handleFilterChange('dateRange', value)}
            />

            {/* Custom Date Range */}
            {filters?.dateRange === 'custom' && (
              <div className="md:col-span-2 lg:col-span-1">
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="date"
                    label="From"
                    placeholder="Start date"
                  />
                  <Input
                    type="date"
                    label="To"
                    placeholder="End date"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 border-t border-border pt-4">
        
        {/* Filter Status */}
        <div className="flex items-center space-x-3">
          {hasActiveFilters && (
            <>
              <span className="text-sm text-text-secondary">
                Filters active
              </span>
              <Button
                variant="ghost"
                size="sm"
                iconName="X"
                iconSize={14}
                onClick={handleClearFilters}
              >
                Clear All
              </Button>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          
          {/* Batch Operations */}
          <div className="relative group">
            <Button
              variant="outline"
              size="sm"
              iconName="Settings"
              iconPosition="left"
            >
              Batch Actions
            </Button>
            
            {/* Dropdown Menu */}
            <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg shadow-depth opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-smooth z-200">
              <div className="py-2">
                <button
                  onClick={() => onBatchOperation('apply')}
                  className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-muted transition-smooth"
                >
                  <Icon name="Play" size={14} />
                  <span>Apply Selected</span>
                </button>
                <button
                  onClick={() => onBatchOperation('rollback')}
                  className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-muted transition-smooth"
                >
                  <Icon name="RotateCcw" size={14} />
                  <span>Rollback Selected</span>
                </button>
                <div className="border-t border-border my-1" />
                <button
                  onClick={() => onBatchOperation('delete')}
                  className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-error hover:bg-error/5 transition-smooth"
                >
                  <Icon name="Trash2" size={14} />
                  <span>Delete Selected</span>
                </button>
              </div>
            </div>
          </div>

          {/* Export */}
          <div className="relative group">
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              iconPosition="left"
            >
              Export
            </Button>
            
            {/* Export Dropdown */}
            <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg shadow-depth opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-smooth z-200">
              <div className="py-2">
                <button
                  onClick={() => onExport('documentation')}
                  className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-muted transition-smooth"
                >
                  <Icon name="FileText" size={14} />
                  <span>Documentation</span>
                </button>
                <button
                  onClick={() => onExport('sql')}
                  className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-muted transition-smooth"
                >
                  <Icon name="Code" size={14} />
                  <span>SQL Scripts</span>
                </button>
                <button
                  onClick={() => onExport('csv')}
                  className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-muted transition-smooth"
                >
                  <Icon name="Table" size={14} />
                  <span>CSV Report</span>
                </button>
              </div>
            </div>
          </div>

          {/* Refresh */}
          <Button
            variant="ghost"
            size="sm"
            iconName="RefreshCw"
            iconSize={16}
            onClick={() => window.location?.reload()}
            title="Refresh migrations"
          />
        </div>
      </div>
    </div>
  );
};

export default MigrationFilters;