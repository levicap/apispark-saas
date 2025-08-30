import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';

const GenerationOptionsPanel = ({ 
  selectedFormats, 
  onFormatChange, 
  selectedDatabase, 
  onDatabaseChange,
  selectedPreset,
  onPresetChange,
  onGenerateAll
}) => {
  const [expandedSections, setExpandedSections] = useState({
    formats: true,
    database: true,
    presets: true
  });

  const formatOptions = [
    {
      id: 'sql',
      label: 'SQL Scripts',
      description: 'Generate CREATE TABLE statements',
      icon: 'Database',
      category: 'SQL'
    },
    {
      id: 'prisma',
      label: 'Prisma Schema',
      description: 'Prisma ORM schema definition',
      icon: 'Code',
      category: 'ORM'
    },
    {
      id: 'sequelize',
      label: 'Sequelize Models',
      description: 'Sequelize model definitions',
      icon: 'FileCode',
      category: 'ORM'
    },
    {
      id: 'mongoose',
      label: 'Mongoose Schemas',
      description: 'MongoDB Mongoose schemas',
      icon: 'Leaf',
      category: 'NoSQL'
    },
    {
      id: 'firestore',
      label: 'Firestore Rules',
      description: 'Firebase security rules',
      icon: 'Shield',
      category: 'NoSQL'
    },
    {
      id: 'typescript',
      label: 'TypeScript Types',
      description: 'TypeScript interface definitions',
      icon: 'FileType',
      category: 'Types'
    },
    {
      id: 'graphql',
      label: 'GraphQL Schema',
      description: 'GraphQL type definitions',
      icon: 'Zap',
      category: 'API'
    },
    {
      id: 'openapi',
      label: 'OpenAPI Spec',
      description: 'REST API documentation',
      icon: 'Book',
      category: 'API'
    }
  ];

  const databaseOptions = [
    { value: 'postgresql', label: 'PostgreSQL' },
    { value: 'mysql', label: 'MySQL' },
    { value: 'sqlite', label: 'SQLite' },
    { value: 'mssql', label: 'Microsoft SQL Server' },
    { value: 'mongodb', label: 'MongoDB' },
    { value: 'firebase', label: 'Firebase Firestore' },
    { value: 'supabase', label: 'Supabase' }
  ];

  const presetOptions = [
    { value: 'full-stack', label: 'Full Stack (All formats)' },
    { value: 'backend-only', label: 'Backend Only (SQL + ORM)' },
    { value: 'frontend-types', label: 'Frontend Types (TS + GraphQL)' },
    { value: 'api-docs', label: 'API Documentation' },
    { value: 'custom', label: 'Custom Selection' }
  ];

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev?.[section]
    }));
  };

  const groupedFormats = formatOptions?.reduce((acc, format) => {
    if (!acc?.[format?.category]) {
      acc[format.category] = [];
    }
    acc?.[format?.category]?.push(format);
    return acc;
  }, {});

  return (
    <div className="w-80 bg-surface border-r border-border h-full overflow-y-auto">
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3 mb-4">
          <Icon name="Settings" size={20} className="text-primary" />
          <h2 className="text-lg font-semibold text-text-primary">Generation Options</h2>
        </div>
        
        <Button
          variant="default"
          size="sm"
          iconName="Play"
          iconPosition="left"
          onClick={onGenerateAll}
          className="w-full"
        >
          Generate All Selected
        </Button>
      </div>
      {/* Output Formats Section */}
      <div className="border-b border-border">
        <button
          onClick={() => toggleSection('formats')}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-muted transition-smooth"
        >
          <div className="flex items-center space-x-3">
            <Icon name="FileCode" size={18} className="text-text-secondary" />
            <span className="font-medium text-text-primary">Output Formats</span>
          </div>
          <Icon 
            name={expandedSections?.formats ? "ChevronDown" : "ChevronRight"} 
            size={16} 
            className="text-text-secondary" 
          />
        </button>

        {expandedSections?.formats && (
          <div className="px-4 pb-4 space-y-4">
            {Object.entries(groupedFormats)?.map(([category, formats]) => (
              <div key={category}>
                <h4 className="text-sm font-medium text-text-secondary mb-2 uppercase tracking-wide">
                  {category}
                </h4>
                <div className="space-y-2">
                  {formats?.map((format) => (
                    <div key={format?.id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-muted/50">
                      <Checkbox
                        checked={selectedFormats?.includes(format?.id)}
                        onChange={(e) => onFormatChange(format?.id, e?.target?.checked)}
                        className="mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <Icon name={format?.icon} size={16} className="text-text-secondary flex-shrink-0" />
                          <span className="text-sm font-medium text-text-primary">{format?.label}</span>
                        </div>
                        <p className="text-xs text-text-secondary mt-1">{format?.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Target Database Section */}
      <div className="border-b border-border">
        <button
          onClick={() => toggleSection('database')}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-muted transition-smooth"
        >
          <div className="flex items-center space-x-3">
            <Icon name="Database" size={18} className="text-text-secondary" />
            <span className="font-medium text-text-primary">Target Database</span>
          </div>
          <Icon 
            name={expandedSections?.database ? "ChevronDown" : "ChevronRight"} 
            size={16} 
            className="text-text-secondary" 
          />
        </button>

        {expandedSections?.database && (
          <div className="px-4 pb-4">
            <Select
              options={databaseOptions}
              value={selectedDatabase}
              onChange={onDatabaseChange}
              placeholder="Select target database"
            />
            
            <div className="mt-3 p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Info" size={14} className="text-accent" />
                <span className="text-xs font-medium text-text-primary">Database Info</span>
              </div>
              <p className="text-xs text-text-secondary">
                {selectedDatabase === 'postgresql' && 'PostgreSQL with advanced features like arrays, JSON, and custom types.'}
                {selectedDatabase === 'mysql' && 'MySQL with InnoDB engine and foreign key constraints.'}
                {selectedDatabase === 'sqlite' && 'SQLite for lightweight, embedded database needs.'}
                {selectedDatabase === 'mongodb' && 'MongoDB with document-based schema and validation.'}
                {selectedDatabase === 'firebase' && 'Firebase Firestore with real-time capabilities.'}
                {selectedDatabase === 'supabase' && 'Supabase with PostgreSQL backend and real-time features.'}
                {!selectedDatabase && 'Select a database to see specific information.'}
              </p>
            </div>
          </div>
        )}
      </div>
      {/* Configuration Presets Section */}
      <div>
        <button
          onClick={() => toggleSection('presets')}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-muted transition-smooth"
        >
          <div className="flex items-center space-x-3">
            <Icon name="Layers" size={18} className="text-text-secondary" />
            <span className="font-medium text-text-primary">Configuration Presets</span>
          </div>
          <Icon 
            name={expandedSections?.presets ? "ChevronDown" : "ChevronRight"} 
            size={16} 
            className="text-text-secondary" 
          />
        </button>

        {expandedSections?.presets && (
          <div className="px-4 pb-4">
            <Select
              options={presetOptions}
              value={selectedPreset}
              onChange={onPresetChange}
              placeholder="Choose a preset"
            />
            
            <div className="mt-3 space-y-2">
              <Button
                variant="outline"
                size="sm"
                iconName="Save"
                iconPosition="left"
                className="w-full"
              >
                Save Current as Preset
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                iconName="RotateCcw"
                iconPosition="left"
                className="w-full"
              >
                Reset to Default
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerationOptionsPanel;