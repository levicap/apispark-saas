import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import MigrationTimeline from './components/MigrationTimeline';
import MigrationPreview from './components/MigrationPreview';
import MigrationFilters from './components/MigrationFilters';
import ExecutionDialog from './components/ExecutionDialog';

const MigrationHistoryManagement = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedMigration, setSelectedMigration] = useState(null);
  const [filteredMigrations, setFilteredMigrations] = useState([]);
  const [executionDialog, setExecutionDialog] = useState({ isOpen: false, type: 'execute', migration: null });

  // Mock user data for header
  const mockUser = {
    name: 'Sarah Chen',
    email: 'sarah.chen@apiforge.com'
  };

  // Mock migration data
  const mockMigrations = [
    {
      id: 1,
      name: "Add user authentication fields",
      description: "Add username, profile_image, and updated_at columns to users table with unique constraints",
      timestamp: "2025-08-30 08:45:23",
      author: "John Doe",
      environment: "production",
      status: "applied",
      affectedTables: ["users", "posts"],
      dataLossRisk: false,
      canRollback: true,
      executionTime: "2.3s",
      changes: [
        { type: "modify", description: "Add username column to users table" },
        { type: "modify", description: "Add profile_image column to users table" },
        { type: "modify", description: "Add updated_at column to users table" },
        { type: "create", description: "Add unique constraint on email column" }
      ],
      sqlScript: `-- Migration: Add user authentication fields
-- Author: John Doe
-- Date: 2025-08-30 08:45:23

BEGIN;

ALTER TABLE users 
  ADD COLUMN username VARCHAR(100) NOT NULL UNIQUE,
  ADD COLUMN profile_image VARCHAR(500),
  ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();

ALTER TABLE users ADD CONSTRAINT users_email_unique UNIQUE (email);

COMMIT;`,
      schemaBefore: `CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);`,
      schemaAfter: `CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  username VARCHAR(100) NOT NULL UNIQUE,
  profile_image VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);`
    },
    {
      id: 2,
      name: "Create posts table with relationships",
      description: "Create posts table with foreign key relationships and indexes for better performance",
      timestamp: "2025-08-29 14:22:15",
      author: "Jane Smith",
      environment: "production",
      status: "applied",
      affectedTables: ["posts"],
      dataLossRisk: false,
      canRollback: true,
      executionTime: "1.8s",
      changes: [
        { type: "create", description: "Create posts table" },
        { type: "create", description: "Add foreign key constraint to users" },
        { type: "create", description: "Create index on user_id column" },
        { type: "create", description: "Create index on status column" }
      ],
      sqlScript: `-- Migration: Create posts table with relationships
-- Author: Jane Smith
-- Date: 2025-08-29 14:22:15

BEGIN;

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
CREATE INDEX idx_posts_status ON posts(status);

COMMIT;`
    },
    {
      id: 3,
      name: "Remove deprecated user fields",
      description: "Remove old_password and legacy_id columns from users table",
      timestamp: "2025-08-28 11:30:45",
      author: "Mike Wilson",
      environment: "staging",
      status: "pending",
      affectedTables: ["users"],
      dataLossRisk: true,
      canRollback: false,
      changes: [
        { type: "delete", description: "Drop old_password column from users" },
        { type: "delete", description: "Drop legacy_id column from users" }
      ],
      sqlScript: `-- Migration: Remove deprecated user fields
-- Author: Mike Wilson
-- Date: 2025-08-28 11:30:45

BEGIN;

ALTER TABLE users DROP COLUMN old_password;
ALTER TABLE users DROP COLUMN legacy_id;

COMMIT;`
    },
    {
      id: 4,
      name: "Add comments table",
      description: "Create comments table with nested comment support and moderation features",
      timestamp: "2025-08-27 16:15:30",
      author: "Sarah Johnson",
      environment: "development",
      status: "failed",
      affectedTables: ["comments"],
      dataLossRisk: false,
      canRollback: false,
      error: "Table 'posts' does not exist",
      changes: [
        { type: "create", description: "Create comments table" },
        { type: "create", description: "Add foreign key to posts table" },
        { type: "create", description: "Add self-referencing parent_id for nested comments" }
      ],
      sqlScript: `-- Migration: Add comments table
-- Author: Sarah Johnson
-- Date: 2025-08-27 16:15:30

BEGIN;

CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  parent_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);

COMMIT;`
    },
    {
      id: 5,
      name: "Update user roles system",
      description: "Migrate from simple admin flag to comprehensive role-based permissions",
      timestamp: "2025-08-26 09:45:12",
      author: "John Doe",
      environment: "production",
      status: "rolled_back",
      affectedTables: ["users", "roles", "permissions"],
      dataLossRisk: true,
      canRollback: false,
      executionTime: "8.7s",
      changes: [
        { type: "create", description: "Create roles table" },
        { type: "create", description: "Create permissions table" },
        { type: "create", description: "Create role_permissions junction table" },
        { type: "modify", description: "Add role_id column to users table" },
        { type: "delete", description: "Remove is_admin column from users" }
      ],
      sqlScript: `-- Migration: Update user roles system
-- Author: John Doe
-- Date: 2025-08-26 09:45:12

BEGIN;

CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE permissions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE role_permissions (
  role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
  permission_id INTEGER REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

ALTER TABLE users ADD COLUMN role_id INTEGER REFERENCES roles(id);
ALTER TABLE users DROP COLUMN is_admin;

COMMIT;`
    }
  ];

  useEffect(() => {
    setFilteredMigrations(mockMigrations);
    // Auto-select first migration for preview
    if (mockMigrations?.length > 0) {
      setSelectedMigration(mockMigrations?.[0]);
    }
  }, []);

  const handleFiltersChange = (filters) => {
    let filtered = [...mockMigrations];

    // Apply search filter
    if (filters?.search) {
      const searchTerm = filters?.search?.toLowerCase();
      filtered = filtered?.filter(migration =>
        migration?.name?.toLowerCase()?.includes(searchTerm) ||
        migration?.author?.toLowerCase()?.includes(searchTerm) ||
        migration?.description?.toLowerCase()?.includes(searchTerm)
      );
    }

    // Apply status filter
    if (filters?.status !== 'all') {
      filtered = filtered?.filter(migration => migration?.status === filters?.status);
    }

    // Apply environment filter
    if (filters?.environment !== 'all') {
      filtered = filtered?.filter(migration => migration?.environment === filters?.environment);
    }

    // Apply author filter
    if (filters?.author !== 'all') {
      filtered = filtered?.filter(migration => migration?.author?.toLowerCase()?.replace(' ', '_') === filters?.author);
    }

    setFilteredMigrations(filtered);
  };

  const handleExecuteMigration = (migration) => {
    setExecutionDialog({
      isOpen: true,
      type: 'execute',
      migration
    });
  };

  const handleRollbackMigration = (migration) => {
    setExecutionDialog({
      isOpen: true,
      type: 'rollback',
      migration
    });
  };

  const handleConfirmExecution = async (migration) => {
    // Simulate migration execution
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update migration status
    const updatedMigrations = mockMigrations?.map(m => 
      m?.id === migration?.id 
        ? { ...m, status: executionDialog?.type === 'execute' ? 'applied' : 'rolled_back' }
        : m
    );
    setFilteredMigrations(updatedMigrations);
    
    // Close dialog
    setExecutionDialog({ isOpen: false, type: 'execute', migration: null });
  };

  const handleExport = (type) => {
    console.log(`Exporting ${type}...`);
    // Implement export functionality
  };

  const handleBatchOperation = (operation) => {
    console.log(`Batch operation: ${operation}`);
    // Implement batch operations
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        user={mockUser}
        onMenuClick={() => setIsSidebarOpen(true)}
      />
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      {/* Main Content */}
      <main className={`transition-smooth ${
        sidebarCollapsed ? 'md:ml-16' : 'md:ml-60'
      } pt-16 pb-16 md:pb-0`}>
        <div className="p-6 space-y-6">
          
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">Migration History & Management</h1>
              <p className="text-text-secondary mt-1">
                Track, execute, and manage database schema migrations with comprehensive rollback capabilities.
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="text-sm text-text-secondary">
                {filteredMigrations?.length} migrations
              </div>
            </div>
          </div>

          {/* Filters */}
          <MigrationFilters
            onFiltersChange={handleFiltersChange}
            onExport={handleExport}
            onBatchOperation={handleBatchOperation}
          />

          {/* Split Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 min-h-[600px]">
            
            {/* Migration Timeline */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-text-primary">Migration Timeline</h2>
                <div className="text-sm text-text-secondary">
                  {filteredMigrations?.filter(m => m?.status === 'applied')?.length} applied, {' '}
                  {filteredMigrations?.filter(m => m?.status === 'pending')?.length} pending
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-4 max-h-[600px] overflow-y-auto">
                <MigrationTimeline
                  migrations={filteredMigrations}
                  selectedMigration={selectedMigration}
                  onSelectMigration={setSelectedMigration}
                  onExecuteMigration={handleExecuteMigration}
                  onRollbackMigration={handleRollbackMigration}
                />
              </div>
            </div>

            {/* Migration Preview */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-text-primary">Migration Preview</h2>
              
              <div className="h-[600px]">
                <MigrationPreview
                  migration={selectedMigration}
                  onExecute={handleExecuteMigration}
                  onRollback={handleRollbackMigration}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Execution Dialog */}
      <ExecutionDialog
        isOpen={executionDialog?.isOpen}
        onClose={() => setExecutionDialog({ isOpen: false, type: 'execute', migration: null })}
        migration={executionDialog?.migration}
        type={executionDialog?.type}
        onConfirm={handleConfirmExecution}
      />
    </div>
  );
};

export default MigrationHistoryManagement;