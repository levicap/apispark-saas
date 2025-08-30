import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MigrationPreview = ({ migration, onExecute, onRollback }) => {
  const [activeTab, setActiveTab] = useState('diff');

  if (!migration) {
    return (
      <div className="h-full flex items-center justify-center text-text-secondary">
        <div className="text-center">
          <Icon name="FileText" size={48} className="mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-text-primary mb-2">No Migration Selected</h3>
          <p>Select a migration from the timeline to view details and preview changes.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'diff', label: 'Schema Diff', icon: 'GitCompare' },
    { id: 'sql', label: 'SQL Script', icon: 'Code' },
    { id: 'impact', label: 'Impact Analysis', icon: 'AlertTriangle' }
  ];

  return (
    <div className="h-full flex flex-col bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="FileText" size={20} className="text-primary" />
          <div>
            <h3 className="text-lg font-semibold text-text-primary">{migration?.name}</h3>
            <p className="text-sm text-text-secondary">
              {migration?.timestamp} • {migration?.author}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {migration?.status === 'pending' && (
            <Button
              variant="default"
              size="sm"
              iconName="Play"
              iconPosition="left"
              onClick={() => onExecute(migration)}
            >
              Execute Migration
            </Button>
          )}
          {migration?.status === 'applied' && migration?.canRollback && (
            <Button
              variant="outline"
              size="sm"
              iconName="RotateCcw"
              iconPosition="left"
              onClick={() => onRollback(migration)}
            >
              Rollback
            </Button>
          )}
        </div>
      </div>
      {/* Tabs */}
      <div className="flex border-b border-border">
        {tabs?.map((tab) => (
          <button
            key={tab?.id}
            onClick={() => setActiveTab(tab?.id)}
            className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-smooth ${
              activeTab === tab?.id
                ? 'border-primary text-primary bg-primary/5' :'border-transparent text-text-secondary hover:text-text-primary hover:bg-muted'
            }`}
          >
            <Icon name={tab?.icon} size={16} />
            <span>{tab?.label}</span>
          </button>
        ))}
      </div>
      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        
        {/* Schema Diff Tab */}
        {activeTab === 'diff' && (
          <div className="h-full p-4 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
              
              {/* Before State */}
              <div className="border border-border rounded-lg overflow-hidden">
                <div className="bg-muted px-4 py-2 border-b border-border">
                  <h4 className="text-sm font-medium text-text-primary flex items-center space-x-2">
                    <Icon name="Minus" size={16} className="text-error" />
                    <span>Before (Current Schema)</span>
                  </h4>
                </div>
                <div className="p-4 font-mono text-sm bg-surface overflow-y-auto max-h-96">
                  <pre className="text-text-secondary whitespace-pre-wrap">
                    {migration?.schemaBefore || `-- Current schema state
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  content TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);`}
                  </pre>
                </div>
              </div>

              {/* After State */}
              <div className="border border-border rounded-lg overflow-hidden">
                <div className="bg-muted px-4 py-2 border-b border-border">
                  <h4 className="text-sm font-medium text-text-primary flex items-center space-x-2">
                    <Icon name="Plus" size={16} className="text-success" />
                    <span>After (Target Schema)</span>
                  </h4>
                </div>
                <div className="p-4 font-mono text-sm bg-surface overflow-y-auto max-h-96">
                  <pre className="text-text-secondary whitespace-pre-wrap">
                    {migration?.schemaAfter || `-- Target schema state
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  username VARCHAR(100) NOT NULL UNIQUE,
  profile_image VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  status VARCHAR(20) DEFAULT 'draft',
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_status ON posts(status);`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SQL Script Tab */}
        {activeTab === 'sql' && (
          <div className="h-full p-4 overflow-y-auto">
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="bg-muted px-4 py-2 border-b border-border flex items-center justify-between">
                <h4 className="text-sm font-medium text-text-primary">Migration SQL Script</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Copy"
                  iconSize={14}
                  onClick={() => navigator.clipboard?.writeText(migration?.sqlScript)}
                >
                  Copy
                </Button>
              </div>
              <div className="p-4 font-mono text-sm bg-surface">
                <pre className="text-text-secondary whitespace-pre-wrap">
                  {migration?.sqlScript || `-- Migration: ${migration?.name}
-- Author: ${migration?.author}
-- Date: ${migration?.timestamp}

BEGIN;

-- Add new columns to users table
ALTER TABLE users 
  ADD COLUMN username VARCHAR(100) NOT NULL UNIQUE,
  ADD COLUMN profile_image VARCHAR(500),
  ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();

-- Add unique constraint to email
ALTER TABLE users ADD CONSTRAINT users_email_unique UNIQUE (email);

-- Add new columns to posts table
ALTER TABLE posts 
  ADD COLUMN status VARCHAR(20) DEFAULT 'draft',
  ADD COLUMN published_at TIMESTAMP,
  ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();

-- Update foreign key constraint with cascade delete
ALTER TABLE posts DROP CONSTRAINT posts_user_id_fkey;
ALTER TABLE posts ADD CONSTRAINT posts_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Create indexes for better performance
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_status ON posts(status);

-- Update existing data
UPDATE posts SET status = 'published' WHERE created_at < NOW() - INTERVAL '1 day';

COMMIT;`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Impact Analysis Tab */}
        {activeTab === 'impact' && (
          <div className="h-full p-4 overflow-y-auto space-y-6">
            
            {/* Risk Assessment */}
            <div className="border border-border rounded-lg p-4">
              <h4 className="text-base font-medium text-text-primary mb-4 flex items-center space-x-2">
                <Icon name="AlertTriangle" size={18} className="text-warning" />
                <span>Risk Assessment</span>
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-error/5 border border-error/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Icon name="AlertCircle" size={16} className="text-error" />
                    <span className="text-sm font-medium text-text-primary">Data Loss Risk</span>
                  </div>
                  <span className="text-xs px-2 py-1 bg-error/10 text-error rounded-full font-medium">HIGH</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-warning/5 border border-warning/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Icon name="Clock" size={16} className="text-warning" />
                    <span className="text-sm font-medium text-text-primary">Downtime Required</span>
                  </div>
                  <span className="text-xs px-2 py-1 bg-warning/10 text-warning rounded-full font-medium">MEDIUM</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-success/5 border border-success/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Icon name="Shield" size={16} className="text-success" />
                    <span className="text-sm font-medium text-text-primary">Rollback Available</span>
                  </div>
                  <span className="text-xs px-2 py-1 bg-success/10 text-success rounded-full font-medium">YES</span>
                </div>
              </div>
            </div>

            {/* Affected Data */}
            <div className="border border-border rounded-lg p-4">
              <h4 className="text-base font-medium text-text-primary mb-4">Affected Data</h4>
              
              <div className="space-y-3">
                {migration?.affectedTables?.map((table) => (
                  <div key={table} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Icon name="Database" size={16} className="text-primary" />
                      <span className="text-sm font-medium text-text-primary font-mono">{table}</span>
                    </div>
                    <div className="text-sm text-text-secondary">
                      ~{Math.floor(Math.random() * 10000)?.toLocaleString()} rows
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="border border-border rounded-lg p-4">
              <h4 className="text-base font-medium text-text-primary mb-4">Recommendations</h4>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
                  <Icon name="Info" size={16} className="text-primary mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-text-primary mb-1">Backup Database</p>
                    <p className="text-text-secondary">Create a full backup before executing this migration due to high data loss risk.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 bg-warning/5 border border-warning/20 rounded-lg">
                  <Icon name="Clock" size={16} className="text-warning mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-text-primary mb-1">Schedule Maintenance Window</p>
                    <p className="text-text-secondary">Estimated execution time: 5-10 minutes. Schedule during low traffic periods.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 bg-success/5 border border-success/20 rounded-lg">
                  <Icon name="CheckCircle" size={16} className="text-success mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-text-primary mb-1">Test in Staging</p>
                    <p className="text-text-secondary">Migration has been successfully tested in staging environment.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MigrationPreview;