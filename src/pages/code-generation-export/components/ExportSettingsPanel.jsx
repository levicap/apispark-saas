import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const ExportSettingsPanel = ({ 
  settings, 
  onSettingsChange, 
  onBatchExport,
  onDirectDeploy,
  exportProgress = null 
}) => {
  const [expandedSections, setExpandedSections] = useState({
    naming: true,
    structure: true,
    deployment: false,
    advanced: false
  });

  const namingConventions = [
    { value: 'camelCase', label: 'camelCase' },
    { value: 'snake_case', label: 'snake_case' },
    { value: 'PascalCase', label: 'PascalCase' },
    { value: 'kebab-case', label: 'kebab-case' }
  ];

  const directoryStructures = [
    { value: 'flat', label: 'Flat Structure' },
    { value: 'feature', label: 'Feature-based' },
    { value: 'layer', label: 'Layer-based' },
    { value: 'domain', label: 'Domain-driven' }
  ];

  const deploymentTargets = [
    { value: 'github', label: 'GitHub Repository' },
    { value: 'gitlab', label: 'GitLab Repository' },
    { value: 'bitbucket', label: 'Bitbucket Repository' },
    { value: 'vercel', label: 'Vercel Deployment' },
    { value: 'netlify', label: 'Netlify Deployment' },
    { value: 'railway', label: 'Railway Deployment' }
  ];

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev?.[section]
    }));
  };

  const mockSettings = {
    fileNaming: 'snake_case',
    directoryStructure: 'feature',
    includeComments: true,
    includeTimestamps: true,
    generateMigrations: true,
    generateSeeds: false,
    deploymentTarget: 'github',
    repositoryUrl: '',
    branchName: 'main',
    commitMessage: 'Generated schema files',
    ...settings
  };

  return (
    <div className="w-80 bg-surface border-l border-border h-full overflow-y-auto">
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3 mb-4">
          <Icon name="Settings2" size={20} className="text-primary" />
          <h2 className="text-lg font-semibold text-text-primary">Export Settings</h2>
        </div>
        
        <div className="space-y-2">
          <Button
            variant="default"
            size="sm"
            iconName="Package"
            iconPosition="left"
            onClick={onBatchExport}
            className="w-full"
            disabled={exportProgress !== null}
          >
            {exportProgress ? 'Exporting...' : 'Batch Export'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            iconName="Rocket"
            iconPosition="left"
            onClick={onDirectDeploy}
            className="w-full"
          >
            Direct Deploy
          </Button>
        </div>

        {exportProgress && (
          <div className="mt-4 p-3 bg-accent/10 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Loader2" size={14} className="animate-spin text-accent" />
              <span className="text-sm font-medium text-text-primary">Exporting Files</span>
            </div>
            <div className="w-full bg-border rounded-full h-2">
              <div 
                className="bg-accent h-2 rounded-full transition-all duration-300"
                style={{ width: `${exportProgress}%` }}
              />
            </div>
            <p className="text-xs text-text-secondary mt-1">{exportProgress}% complete</p>
          </div>
        )}
      </div>
      {/* File Naming Section */}
      <div className="border-b border-border">
        <button
          onClick={() => toggleSection('naming')}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-muted transition-smooth"
        >
          <div className="flex items-center space-x-3">
            <Icon name="FileText" size={18} className="text-text-secondary" />
            <span className="font-medium text-text-primary">File Naming</span>
          </div>
          <Icon 
            name={expandedSections?.naming ? "ChevronDown" : "ChevronRight"} 
            size={16} 
            className="text-text-secondary" 
          />
        </button>

        {expandedSections?.naming && (
          <div className="px-4 pb-4 space-y-4">
            <Select
              label="Naming Convention"
              options={namingConventions}
              value={mockSettings?.fileNaming}
              onChange={(value) => onSettingsChange({ fileNaming: value })}
            />
            
            <div className="space-y-3">
              <Checkbox
                label="Include Comments"
                description="Add descriptive comments to generated files"
                checked={mockSettings?.includeComments}
                onChange={(e) => onSettingsChange({ includeComments: e?.target?.checked })}
              />
              
              <Checkbox
                label="Include Timestamps"
                description="Add generation timestamps to files"
                checked={mockSettings?.includeTimestamps}
                onChange={(e) => onSettingsChange({ includeTimestamps: e?.target?.checked })}
              />
            </div>
          </div>
        )}
      </div>
      {/* Directory Structure Section */}
      <div className="border-b border-border">
        <button
          onClick={() => toggleSection('structure')}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-muted transition-smooth"
        >
          <div className="flex items-center space-x-3">
            <Icon name="FolderTree" size={18} className="text-text-secondary" />
            <span className="font-medium text-text-primary">Directory Structure</span>
          </div>
          <Icon 
            name={expandedSections?.structure ? "ChevronDown" : "ChevronRight"} 
            size={16} 
            className="text-text-secondary" 
          />
        </button>

        {expandedSections?.structure && (
          <div className="px-4 pb-4 space-y-4">
            <Select
              label="Structure Type"
              options={directoryStructures}
              value={mockSettings?.directoryStructure}
              onChange={(value) => onSettingsChange({ directoryStructure: value })}
            />
            
            <div className="p-3 bg-muted/30 rounded-lg">
              <h4 className="text-sm font-medium text-text-primary mb-2">Preview Structure</h4>
              <div className="text-xs font-mono text-text-secondary space-y-1">
                {mockSettings?.directoryStructure === 'feature' && (
                  <>
                    <div>📁 src/</div>
                    <div>&nbsp;&nbsp;📁 features/</div>
                    <div>&nbsp;&nbsp;&nbsp;&nbsp;📁 users/</div>
                    <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;📄 schema.sql</div>
                    <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;📄 model.ts</div>
                    <div>&nbsp;&nbsp;&nbsp;&nbsp;📁 posts/</div>
                    <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;📄 schema.sql</div>
                    <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;📄 model.ts</div>
                  </>
                )}
                {mockSettings?.directoryStructure === 'flat' && (
                  <>
                    <div>📁 generated/</div>
                    <div>&nbsp;&nbsp;📄 schema.sql</div>
                    <div>&nbsp;&nbsp;📄 models.ts</div>
                    <div>&nbsp;&nbsp;📄 types.ts</div>
                  </>
                )}
              </div>
            </div>
            
            <div className="space-y-3">
              <Checkbox
                label="Generate Migrations"
                description="Create migration files for schema changes"
                checked={mockSettings?.generateMigrations}
                onChange={(e) => onSettingsChange({ generateMigrations: e?.target?.checked })}
              />
              
              <Checkbox
                label="Generate Seed Files"
                description="Create sample data seed files"
                checked={mockSettings?.generateSeeds}
                onChange={(e) => onSettingsChange({ generateSeeds: e?.target?.checked })}
              />
            </div>
          </div>
        )}
      </div>
      {/* Deployment Section */}
      <div className="border-b border-border">
        <button
          onClick={() => toggleSection('deployment')}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-muted transition-smooth"
        >
          <div className="flex items-center space-x-3">
            <Icon name="Rocket" size={18} className="text-text-secondary" />
            <span className="font-medium text-text-primary">Deployment</span>
          </div>
          <Icon 
            name={expandedSections?.deployment ? "ChevronDown" : "ChevronRight"} 
            size={16} 
            className="text-text-secondary" 
          />
        </button>

        {expandedSections?.deployment && (
          <div className="px-4 pb-4 space-y-4">
            <Select
              label="Deployment Target"
              options={deploymentTargets}
              value={mockSettings?.deploymentTarget}
              onChange={(value) => onSettingsChange({ deploymentTarget: value })}
            />
            
            <Input
              label="Repository URL"
              type="url"
              placeholder="https://github.com/user/repo"
              value={mockSettings?.repositoryUrl}
              onChange={(e) => onSettingsChange({ repositoryUrl: e?.target?.value })}
            />
            
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Branch"
                type="text"
                placeholder="main"
                value={mockSettings?.branchName}
                onChange={(e) => onSettingsChange({ branchName: e?.target?.value })}
              />
              <Button
                variant="outline"
                size="sm"
                iconName="TestTube"
                className="mt-6"
              >
                Test Connection
              </Button>
            </div>
            
            <Input
              label="Commit Message"
              type="text"
              placeholder="Generated schema files"
              value={mockSettings?.commitMessage}
              onChange={(e) => onSettingsChange({ commitMessage: e?.target?.value })}
            />
          </div>
        )}
      </div>
      {/* Advanced Settings Section */}
      <div>
        <button
          onClick={() => toggleSection('advanced')}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-muted transition-smooth"
        >
          <div className="flex items-center space-x-3">
            <Icon name="Sliders" size={18} className="text-text-secondary" />
            <span className="font-medium text-text-primary">Advanced</span>
          </div>
          <Icon 
            name={expandedSections?.advanced ? "ChevronDown" : "ChevronRight"} 
            size={16} 
            className="text-text-secondary" 
          />
        </button>

        {expandedSections?.advanced && (
          <div className="px-4 pb-4 space-y-4">
            <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="AlertTriangle" size={14} className="text-warning" />
                <span className="text-sm font-medium text-text-primary">Advanced Settings</span>
              </div>
              <p className="text-xs text-text-secondary">
                These settings are for advanced users. Incorrect configuration may cause issues.
              </p>
            </div>
            
            <div className="space-y-3">
              <Checkbox
                label="Minify Output"
                description="Remove whitespace and comments from generated files"
               
                onChange={() => {}}
              />
              
              <Checkbox
                label="Generate Documentation"
                description="Create API documentation alongside code"
                checked
                onChange={() => {}}
              />
              
              <Checkbox
                label="Enable Validation"
                description="Add runtime validation to generated models"
                checked
                onChange={() => {}}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExportSettingsPanel;