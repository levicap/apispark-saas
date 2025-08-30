import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import EntityHeader from './components/EntityHeader';
import TabNavigation from './components/TabNavigation';
import FieldsTab from './components/FieldsTab';
import RelationshipsTab from './components/RelationshipsTab';
import IndexesTab from './components/IndexesTab';
import ValidationTab from './components/ValidationTab';
import ActionFooter from './components/ActionFooter';

const EntityConfigurationPanel = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const entityId = searchParams?.get('entityId');
  
  const [activeTab, setActiveTab] = useState('fields');
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Mock entity data
  const [entityData, setEntityData] = useState({
    id: entityId || 'entity_1',
    name: 'User',
    databaseType: 'PostgreSQL',
    fields: [
      {
        id: 1,
        name: 'id',
        type: 'uuid',
        length: '',
        nullable: false,
        primaryKey: true,
        unique: true,
        autoIncrement: false,
        defaultValue: 'gen_random_uuid()',
        comment: 'Primary key identifier'
      },
      {
        id: 2,
        name: 'email',
        type: 'varchar',
        length: '255',
        nullable: false,
        primaryKey: false,
        unique: true,
        autoIncrement: false,
        defaultValue: '',
        comment: 'User email address'
      },
      {
        id: 3,
        name: 'first_name',
        type: 'varchar',
        length: '100',
        nullable: false,
        primaryKey: false,
        unique: false,
        autoIncrement: false,
        defaultValue: '',
        comment: 'User first name'
      },
      {
        id: 4,
        name: 'last_name',
        type: 'varchar',
        length: '100',
        nullable: false,
        primaryKey: false,
        unique: false,
        autoIncrement: false,
        defaultValue: '',
        comment: 'User last name'
      },
      {
        id: 5,
        name: 'created_at',
        type: 'timestamp',
        length: '',
        nullable: false,
        primaryKey: false,
        unique: false,
        autoIncrement: false,
        defaultValue: 'CURRENT_TIMESTAMP',
        comment: 'Record creation timestamp'
      }
    ],
    relationships: [
      {
        id: 1,
        name: 'user_posts',
        type: 'one-to-many',
        targetEntity: 'post_entity',
        sourceField: 'user_id',
        targetField: 'id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        nullable: false,
        description: 'User can have multiple posts'
      }
    ],
    indexes: [
      {
        id: 1,
        name: 'idx_user_email',
        fields: ['email'],
        type: 'btree',
        unique: true,
        partial: false,
        condition: '',
        comment: 'Unique index on email for fast lookups'
      },
      {
        id: 2,
        name: 'idx_user_name',
        fields: ['first_name', 'last_name'],
        type: 'btree',
        unique: false,
        partial: false,
        condition: '',
        comment: 'Composite index for name searches'
      }
    ],
    validationRules: [
      {
        id: 1,
        field: 'email',
        type: 'email',
        value: '',
        message: 'Please enter a valid email address',
        active: true,
        description: 'Validates email format'
      },
      {
        id: 2,
        field: 'first_name',
        type: 'min_length',
        value: '2',
        message: 'First name must be at least 2 characters',
        active: true,
        description: 'Ensures minimum name length'
      }
    ]
  });

  // Mock available entities for relationships
  const availableEntities = [
    { id: 'post_entity', name: 'Post', fields: [{ name: 'id' }, { name: 'title' }, { name: 'content' }] },
    { id: 'comment_entity', name: 'Comment', fields: [{ name: 'id' }, { name: 'content' }, { name: 'user_id' }] },
    { id: 'category_entity', name: 'Category', fields: [{ name: 'id' }, { name: 'name' }, { name: 'slug' }] }
  ];

  // Mock user data for header
  const mockUser = {
    name: 'Sarah Chen',
    email: 'sarah.chen@apiforge.com'
  };

  const tabs = [
    { 
      id: 'fields', 
      label: 'Fields', 
      icon: 'Columns',
      count: entityData?.fields?.length
    },
    { 
      id: 'relationships', 
      label: 'Relations', 
      icon: 'GitBranch',
      count: entityData?.relationships?.length
    },
    { 
      id: 'indexes', 
      label: 'Indexes', 
      icon: 'Zap',
      count: entityData?.indexes?.length
    },
    { 
      id: 'validation', 
      label: 'Validation', 
      icon: 'Shield',
      count: entityData?.validationRules?.filter(r => r?.active)?.length
    }
  ];

  const handleNameChange = (newName) => {
    setEntityData(prev => ({ ...prev, name: newName }));
    setHasChanges(true);
  };

  const handleFieldsChange = (newFields) => {
    setEntityData(prev => ({ ...prev, fields: newFields }));
    setHasChanges(true);
  };

  const handleRelationshipsChange = (newRelationships) => {
    setEntityData(prev => ({ ...prev, relationships: newRelationships }));
    setHasChanges(true);
  };

  const handleIndexesChange = (newIndexes) => {
    setEntityData(prev => ({ ...prev, indexes: newIndexes }));
    setHasChanges(true);
  };

  const handleValidationRulesChange = (newRules) => {
    setEntityData(prev => ({ ...prev, validationRules: newRules }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Saving entity:', entityData);
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving entity:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      const confirmCancel = window.confirm('You have unsaved changes. Are you sure you want to cancel?');
      if (!confirmCancel) return;
    }
    navigate('/schema-canvas-designer');
  };

  const handleDelete = () => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the "${entityData?.name}" entity? This action cannot be undone.`);
    if (confirmDelete) {
      console.log('Deleting entity:', entityData?.id);
      navigate('/schema-canvas-designer');
    }
  };

  const handleDuplicate = () => {
    const duplicatedEntity = {
      ...entityData,
      id: `${entityData?.id}_copy`,
      name: `${entityData?.name}_Copy`
    };
    console.log('Duplicating entity:', duplicatedEntity);
    setHasChanges(true);
  };

  const handleClose = () => {
    handleCancel();
  };

  // Auto-save functionality
  useEffect(() => {
    if (hasChanges) {
      const autoSaveTimer = setTimeout(() => {
        console.log('Auto-saving entity...');
        // Auto-save logic here
      }, 30000); // Auto-save after 30 seconds of inactivity

      return () => clearTimeout(autoSaveTimer);
    }
  }, [hasChanges, entityData]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'fields':
        return (
          <FieldsTab
            fields={entityData?.fields}
            onFieldsChange={handleFieldsChange}
          />
        );
      case 'relationships':
        return (
          <RelationshipsTab
            relationships={entityData?.relationships}
            onRelationshipsChange={handleRelationshipsChange}
            availableEntities={availableEntities}
          />
        );
      case 'indexes':
        return (
          <IndexesTab
            indexes={entityData?.indexes}
            onIndexesChange={handleIndexesChange}
            availableFields={entityData?.fields}
          />
        );
      case 'validation':
        return (
          <ValidationTab
            validationRules={entityData?.validationRules}
            onValidationRulesChange={handleValidationRulesChange}
            availableFields={entityData?.fields}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header 
        user={mockUser}
        onMenuClick={() => setIsSidebarOpen(true)}
      />

      {/* Sidebar */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Desktop Layout */}
      <div className="hidden md:flex h-screen pt-16">
        {/* Main Panel */}
        <div className="flex-1 flex flex-col">
          <EntityHeader
            entityName={entityData?.name}
            databaseType={entityData?.databaseType}
            onNameChange={handleNameChange}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
            onClose={handleClose}
          />

          <TabNavigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabs={tabs}
          />

          <div className="flex-1 overflow-y-auto">
            {renderTabContent()}
          </div>

          <ActionFooter
            onSave={handleSave}
            onCancel={handleCancel}
            onDelete={handleDelete}
            hasChanges={hasChanges}
            isSaving={isSaving}
          />
        </div>
      </div>
      {/* Mobile Layout */}
      <div className="md:hidden pt-16">
        <EntityHeader
          entityName={entityData?.name}
          databaseType={entityData?.databaseType}
          onNameChange={handleNameChange}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
          onClose={handleClose}
        />

        <TabNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          tabs={tabs}
        />

        <div className="pb-20">
          {renderTabContent()}
        </div>

        {/* Mobile Action Footer */}
        <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border p-4 space-y-3">
          {hasChanges && (
            <div className="flex items-center justify-center space-x-2 text-sm text-warning">
              <div className="w-2 h-2 bg-warning rounded-full"></div>
              <span>Unsaved changes</span>
            </div>
          )}
          <div className="flex space-x-3">
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="flex-1 px-4 py-2 text-sm font-medium text-text-secondary border border-border rounded-lg hover:bg-muted transition-smooth"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              className="flex-1 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-smooth disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntityConfigurationPanel;