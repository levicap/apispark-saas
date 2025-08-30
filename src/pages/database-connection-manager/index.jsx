import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import ConnectionProfilesList from './components/ConnectionProfilesList';
import ConnectionConfigurationForm from './components/ConnectionConfigurationForm';

const DatabaseConnectionManager = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [isNewConnection, setIsNewConnection] = useState(false);
  const [profiles, setProfiles] = useState([]);

  // Mock data for connection profiles
  const mockProfiles = [
    {
      id: 1,
      name: "Production PostgreSQL",
      type: "postgresql",
      environment: "production",
      host: "prod-db.company.com",
      port: "5432",
      database: "main_app",
      username: "app_user",
      password: "secure_password",
      ssl: true,
      status: "connected",
      lastTested: "2025-08-30 08:45:22",
      connectionTimeout: 30,
      maxConnections: 20,
      additionalParams: "sslmode=require"
    },
    {
      id: 2,
      name: "Development MySQL",
      type: "mysql",
      environment: "development",
      host: "localhost",
      port: "3306",
      database: "dev_app",
      username: "dev_user",
      password: "dev_password",
      ssl: false,
      status: "connected",
      lastTested: "2025-08-30 09:15:10",
      connectionTimeout: 30,
      maxConnections: 10,
      additionalParams: "charset=utf8mb4"
    },
    {
      id: 3,
      name: "Analytics MongoDB",
      type: "mongodb",
      environment: "staging",
      host: "staging-mongo.company.com",
      port: "27017",
      database: "analytics",
      username: "analytics_user",
      password: "analytics_password",
      ssl: true,
      status: "disconnected",
      lastTested: "2025-08-29 16:30:45",
      connectionTimeout: 45,
      maxConnections: 15,
      additionalParams: "authSource=admin"
    },
    {
      id: 4,
      name: "Cache Redis",
      type: "redis",
      environment: "production",
      host: "redis-cluster.company.com",
      port: "6379",
      database: "0",
      username: "",
      password: "redis_password",
      ssl: true,
      status: "connected",
      lastTested: "2025-08-30 09:00:15",
      connectionTimeout: 15,
      maxConnections: 50,
      additionalParams: "db=0"
    },
    {
      id: 5,
      name: "Firebase Project",
      type: "firebase",
      environment: "production",
      host: "firestore.googleapis.com",
      port: "",
      database: "my-firebase-project",
      username: "",
      password: "",
      ssl: true,
      status: "testing",
      lastTested: "2025-08-30 09:20:30",
      connectionTimeout: 60,
      maxConnections: 1,
      additionalParams: `{
  "type": "service_account",
  "project_id": "my-firebase-project",
  "private_key_id": "key123",
  "client_email": "firebase-adminsdk@my-firebase-project.iam.gserviceaccount.com"
}`
    },
    {
      id: 6,
      name: "Supabase Backend",
      type: "supabase",
      environment: "development",
      host: "db.supabase.co",
      port: "5432",
      database: "postgres",
      username: "postgres",
      password: "supabase_password",
      ssl: true,
      status: "connected",
      lastTested: "2025-08-30 08:30:12",
      connectionTimeout: 30,
      maxConnections: 10,
      additionalParams: "sslmode=require"
    }
  ];

  // Mock user data for header
  const mockUser = {
    name: 'Sarah Chen',
    email: 'sarah.chen@apiforge.com'
  };

  useEffect(() => {
    setProfiles(mockProfiles);
  }, []);

  const handleSelectProfile = (profile) => {
    setSelectedProfile(profile);
    setIsNewConnection(false);
  };

  const handleCreateNew = () => {
    setSelectedProfile(null);
    setIsNewConnection(true);
  };

  const handleTestProfile = (profile) => {
    setProfiles(prev => prev?.map(p => 
      p?.id === profile?.id 
        ? { ...p, status: 'testing' }
        : p
    ));

    // Simulate test result after 2 seconds
    setTimeout(() => {
      const success = Math.random() > 0.3;
      setProfiles(prev => prev?.map(p => 
        p?.id === profile?.id 
          ? { 
              ...p, 
              status: success ? 'connected' : 'disconnected',
              lastTested: new Date()?.toLocaleString()
            }
          : p
      ));
    }, 2000);
  };

  const handleDuplicateProfile = (profile) => {
    const newProfile = {
      ...profile,
      id: Date.now(),
      name: `${profile?.name} (Copy)`,
      status: 'disconnected',
      lastTested: 'Never'
    };
    setProfiles(prev => [...prev, newProfile]);
  };

  const handleDeleteProfile = (profile) => {
    if (window.confirm(`Are you sure you want to delete "${profile?.name}"?`)) {
      setProfiles(prev => prev?.filter(p => p?.id !== profile?.id));
      if (selectedProfile?.id === profile?.id) {
        setSelectedProfile(null);
        setIsNewConnection(false);
      }
    }
  };

  const handleSaveProfile = (profileData) => {
    if (isNewConnection) {
      setProfiles(prev => [...prev, profileData]);
    } else {
      setProfiles(prev => prev?.map(p => 
        p?.id === profileData?.id ? profileData : p
      ));
    }
    setSelectedProfile(profileData);
    setIsNewConnection(false);
  };

  const handleCancelEdit = () => {
    setSelectedProfile(null);
    setIsNewConnection(false);
  };

  const handleTestConnection = (formData, success) => {
    // Update the profile status based on test result
    if (selectedProfile) {
      setProfiles(prev => prev?.map(p => 
        p?.id === selectedProfile?.id 
          ? { 
              ...p, 
              status: success ? 'connected' : 'disconnected',
              lastTested: new Date()?.toLocaleString()
            }
          : p
      ));
    }
  };

  return (
    <>
      <Helmet>
        <title>Database Connection Manager - DataFlow Designer</title>
        <meta name="description" content="Configure, test, and manage multiple database connections across different providers and environments with DataFlow Designer." />
      </Helmet>

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

        <main className={`transition-smooth ${
          sidebarCollapsed ? 'md:ml-16' : 'md:ml-60'
        } pt-16 pb-16 md:pb-0`}>
          <div className="h-screen pt-16 flex">
            
            {/* Left Panel - Connection Profiles List */}
            <div className="w-full md:w-80 lg:w-96 flex-shrink-0">
              <ConnectionProfilesList
                profiles={profiles}
                selectedProfile={selectedProfile}
                onSelectProfile={handleSelectProfile}
                onTestProfile={handleTestProfile}
                onDuplicateProfile={handleDuplicateProfile}
                onDeleteProfile={handleDeleteProfile}
                onCreateNew={handleCreateNew}
              />
            </div>

            {/* Right Panel - Configuration Form */}
            <div className="hidden md:flex flex-1 bg-surface">
              {(selectedProfile || isNewConnection) ? (
                <ConnectionConfigurationForm
                  selectedProfile={selectedProfile}
                  onSave={handleSaveProfile}
                  onTest={handleTestConnection}
                  onCancel={handleCancelEdit}
                  isNew={isNewConnection}
                />
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center max-w-md mx-auto p-8">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 1.79 4 4 4h8c2.21 0 4-1.79 4-4V7c0-2.21-1.79-4-4-4H8c-2.21 0-4 1.79-4 4z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 11l3 3 3-3" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-text-primary mb-2">
                      Database Connection Manager
                    </h3>
                    <p className="text-text-secondary mb-6">
                      Select a connection profile from the left panel to view and edit its configuration, 
                      or create a new connection to get started.
                    </p>
                    <div className="space-y-3">
                      <button
                        onClick={handleCreateNew}
                        className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-smooth"
                      >
                        Create New Connection
                      </button>
                      <p className="text-sm text-text-secondary">
                        Supports PostgreSQL, MySQL, MongoDB, Firebase, Supabase, and more
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default DatabaseConnectionManager;