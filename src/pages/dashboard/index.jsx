import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import MetricsCard from './components/MetricsCard';
import ProjectCard from './components/ProjectCard';
import ProjectListItem from './components/ProjectListItem';
import ActivityFeed from './components/ActivityFeed';
import TeamPresence from './components/TeamPresence';
import QuickStartTemplates from './components/QuickStartTemplates';
import ProjectFilters from './components/ProjectFilters';
import BulkActions from './components/BulkActions';
import ProjectDetailsModal from './components/ProjectDetailsModal';

const Dashboard = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('lastModified');
  const [selectedProjectDetails, setSelectedProjectDetails] = useState(null);
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const navigate = useNavigate();

  // Mock data
  const metricsData = [
    {
      title: "Active Projects",
      value: "12",
      change: "+2 this week",
      changeType: "positive",
      icon: "FolderOpen",
      iconColor: "text-primary"
    },
    {
      title: "Team Members",
      value: "8",
      change: "+1 this month",
      changeType: "positive",
      icon: "Users",
      iconColor: "text-success"
    },
    {
      title: "API Endpoints",
      value: "247",
      change: "+18 this week",
      changeType: "positive",
      icon: "Globe",
      iconColor: "text-accent"
    },
    {
      title: "Recent Activity",
      value: "34",
      change: "Last 24 hours",
      changeType: "neutral",
      icon: "Activity",
      iconColor: "text-warning"
    }
  ];

  const projectsData = [
    {
      id: 1,
      name: "E-commerce API v2.0",
      description: "Complete REST API for e-commerce platform with payment integration, inventory management, and user authentication.",
      status: "active",
      lastModified: "2025-08-28T08:30:00Z",
      createdAt: "2025-07-15T10:00:00Z",
      createdBy: { name: "John Smith", id: 1, role: "Lead Developer" },
      endpoints: 45,
      entities: 12,
      collaborators: 5,
      thumbnail: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop",
      recentCollaborators: [
        { id: 1, name: "Sarah Johnson", avatar: "https://randomuser.me/api/portraits/women/1.jpg", role: "Frontend Developer", joinedAt: "2025-07-20T09:00:00Z" },
        { id: 2, name: "Mike Chen", avatar: "https://randomuser.me/api/portraits/men/2.jpg", role: "Backend Developer", joinedAt: "2025-07-18T14:30:00Z" },
        { id: 3, name: "Emily Davis", avatar: null, role: "QA Engineer", joinedAt: "2025-07-25T11:15:00Z" },
        { id: 4, name: "Alex Rodriguez", avatar: "https://randomuser.me/api/portraits/men/4.jpg", role: "DevOps Engineer", joinedAt: "2025-08-01T08:45:00Z" }
      ],
      apiKeys: [
        { id: 1, name: "Production Key", key: "pk_live_51H***************", createdBy: "John Smith", createdAt: "2025-08-01T10:00:00Z", lastUsed: "2025-08-28T07:30:00Z", status: "active" },
        { id: 2, name: "Staging Key", key: "pk_test_51H***************", createdBy: "Sarah Johnson", createdAt: "2025-07-25T14:20:00Z", lastUsed: "2025-08-27T16:45:00Z", status: "active" },
        { id: 3, name: "Development Key", key: "pk_dev_51H***************", createdBy: "Mike Chen", createdAt: "2025-07-20T09:15:00Z", lastUsed: "2025-08-28T08:00:00Z", status: "active" }
      ],
      recentEndpoints: [
        { id: 1, method: "POST", path: "/api/v1/orders/checkout", createdBy: "Sarah Johnson", createdAt: "2025-08-28T08:45:00Z", status: "active" },
        { id: 2, method: "GET", path: "/api/v1/products/search", createdBy: "Mike Chen", createdAt: "2025-08-27T15:20:00Z", status: "active" },
        { id: 3, method: "PUT", path: "/api/v1/users/profile", createdBy: "Emily Davis", createdAt: "2025-08-26T11:30:00Z", status: "active" },
        { id: 4, method: "DELETE", path: "/api/v1/cart/items", createdBy: "Alex Rodriguez", createdAt: "2025-08-25T14:10:00Z", status: "active" }
      ],
      recentEntities: [
        { id: 1, name: "Order", fields: 8, createdBy: "John Smith", createdAt: "2025-08-20T10:00:00Z", lastModified: "2025-08-28T07:15:00Z" },
        { id: 2, name: "Product", fields: 12, createdBy: "Sarah Johnson", createdAt: "2025-08-18T14:30:00Z", lastModified: "2025-08-27T09:20:00Z" },
        { id: 3, name: "User", fields: 15, createdBy: "Mike Chen", createdAt: "2025-08-15T11:45:00Z", lastModified: "2025-08-26T16:30:00Z" },
        { id: 4, name: "Cart", fields: 6, createdBy: "Emily Davis", createdAt: "2025-08-12T13:20:00Z", lastModified: "2025-08-25T10:45:00Z" }
      ]
    },
    {
      id: 2,
      name: "User Management System",
      description: "Comprehensive user authentication and authorization service with role-based access control and multi-factor authentication.",
      status: "draft",
      lastModified: "2025-08-27T15:45:00Z",
      createdAt: "2025-07-10T09:30:00Z",
      createdBy: { name: "Lisa Wang", id: 2, role: "System Architect" },
      endpoints: 28,
      entities: 8,
      collaborators: 3,
      thumbnail: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?w=400&h=300&fit=crop",
      recentCollaborators: [
        { id: 1, name: "Sarah Johnson", avatar: "https://randomuser.me/api/portraits/women/1.jpg", role: "Frontend Developer", joinedAt: "2025-07-15T10:30:00Z" },
        { id: 5, name: "David Kim", avatar: "https://randomuser.me/api/portraits/men/5.jpg", role: "Security Specialist", joinedAt: "2025-07-12T14:00:00Z" },
        { id: 6, name: "Lisa Wang", avatar: null, role: "System Architect", joinedAt: "2025-07-10T09:30:00Z" }
      ],
      apiKeys: [
        { id: 1, name: "Test Environment", key: "uk_test_51M***************", createdBy: "Lisa Wang", createdAt: "2025-07-15T11:00:00Z", lastUsed: "2025-08-27T14:20:00Z", status: "active" },
        { id: 2, name: "Local Development", key: "uk_dev_51M***************", createdBy: "David Kim", createdAt: "2025-07-20T16:30:00Z", lastUsed: "2025-08-27T15:45:00Z", status: "active" }
      ],
      recentEndpoints: [
        { id: 1, method: "POST", path: "/api/auth/login", createdBy: "Lisa Wang", createdAt: "2025-08-27T15:45:00Z", status: "active" },
        { id: 2, method: "POST", path: "/api/auth/register", createdBy: "David Kim", createdAt: "2025-08-26T10:15:00Z", status: "active" },
        { id: 3, method: "GET", path: "/api/users/profile", createdBy: "Sarah Johnson", createdAt: "2025-08-25T14:20:00Z", status: "active" }
      ],
      recentEntities: [
        { id: 1, name: "User", fields: 18, createdBy: "Lisa Wang", createdAt: "2025-07-12T10:00:00Z", lastModified: "2025-08-27T13:30:00Z" },
        { id: 2, name: "Role", fields: 5, createdBy: "David Kim", createdAt: "2025-07-15T11:20:00Z", lastModified: "2025-08-25T09:45:00Z" },
        { id: 3, name: "Permission", fields: 7, createdBy: "Sarah Johnson", createdAt: "2025-07-18T16:10:00Z", lastModified: "2025-08-24T14:15:00Z" }
      ]
    },
    {
      id: 3,
      name: "Analytics Dashboard API",
      description: "Real-time analytics and reporting API with data aggregation, visualization endpoints, and custom dashboard creation.",
      status: "active",
      lastModified: "2025-08-28T06:20:00Z",
      endpoints: 62,
      collaborators: 7,
      thumbnail: "https://images.pixabay.com/photo/2016/11/27/21/42/stock-1863880_1280.jpg?w=400&h=300&fit=crop",
      recentCollaborators: [
        { id: 2, name: "Mike Chen", avatar: "https://randomuser.me/api/portraits/men/2.jpg" },
        { id: 7, name: "Jennifer Lee", avatar: "https://randomuser.me/api/portraits/women/7.jpg" },
        { id: 8, name: "Robert Taylor", avatar: null },
        { id: 9, name: "Maria Garcia", avatar: "https://randomuser.me/api/portraits/women/9.jpg" }
      ]
    },
    {
      id: 4,
      name: "Payment Gateway Integration",
      description: "Secure payment processing API with support for multiple payment providers, subscription management, and fraud detection.",
      status: "active",
      lastModified: "2025-08-26T11:15:00Z",
      endpoints: 33,
      collaborators: 4,
      thumbnail: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=300&fit=crop",
      recentCollaborators: [
        { id: 3, name: "Emily Davis", avatar: null },
        { id: 10, name: "James Wilson", avatar: "https://randomuser.me/api/portraits/men/10.jpg" },
        { id: 11, name: "Anna Brown", avatar: "https://randomuser.me/api/portraits/women/11.jpg" }
      ]
    },
    {
      id: 5,
      name: "Notification Service",
      description: "Multi-channel notification system supporting email, SMS, push notifications, and in-app messaging with template management.",
      status: "draft",
      lastModified: "2025-08-25T14:30:00Z",
      endpoints: 19,
      collaborators: 2,
      thumbnail: "https://images.pexels.com/photos/1591062/pexels-photo-1591062.jpeg?w=400&h=300&fit=crop",
      recentCollaborators: [
        { id: 12, name: "Chris Anderson", avatar: "https://randomuser.me/api/portraits/men/12.jpg" },
        { id: 13, name: "Sophie Miller", avatar: null }
      ]
    },
    {
      id: 6,
      name: "Content Management API",
      description: "Headless CMS API for managing articles, media files, and dynamic content with version control and publishing workflows.",
      status: "archived",
      lastModified: "2025-08-20T09:45:00Z",
      endpoints: 41,
      collaborators: 6,
      thumbnail: "https://images.pixabay.com/photo/2016/11/29/06/15/plans-1867745_1280.jpg?w=400&h=300&fit=crop",
      recentCollaborators: [
        { id: 14, name: "Tom Johnson", avatar: "https://randomuser.me/api/portraits/men/14.jpg" },
        { id: 15, name: "Rachel Green", avatar: "https://randomuser.me/api/portraits/women/15.jpg" }
      ]
    }
  ];

  const activitiesData = [
    {
      id: 1,
      type: "api_endpoint_added",
      user: { name: "Sarah Johnson", avatar: "https://randomuser.me/api/portraits/women/1.jpg" },
      description: "Added new endpoint POST /api/v1/orders/checkout",
      project: "E-commerce API v2.0",
      timestamp: "2025-08-28T08:45:00Z"
    },
    {
      id: 2,
      type: "schema_modified",
      user: { name: "Mike Chen", avatar: "https://randomuser.me/api/portraits/men/2.jpg" },
      description: "Updated User schema to include profile preferences",
      project: "User Management System",
      timestamp: "2025-08-28T08:30:00Z"
    },
    {
      id: 3,
      type: "test_run",
      user: { name: "Emily Davis", avatar: null },
      description: "Ran integration tests for payment processing endpoints",
      project: "Payment Gateway Integration",
      timestamp: "2025-08-28T08:15:00Z"
    },
    {
      id: 4,
      type: "team_member_added",
      user: { name: "Alex Rodriguez", avatar: "https://randomuser.me/api/portraits/men/4.jpg" },
      description: "Added Jennifer Lee as Editor to the project",
      project: "Analytics Dashboard API",
      timestamp: "2025-08-28T07:50:00Z"
    },
    {
      id: 5,
      type: "comment_added",
      user: { name: "David Kim", avatar: "https://randomuser.me/api/portraits/men/5.jpg" },
      description: "Commented on authentication middleware implementation",
      project: "User Management System",
      timestamp: "2025-08-28T07:30:00Z"
    },
    {
      id: 6,
      type: "deployment",
      user: { name: "Lisa Wang", avatar: null },
      description: "Deployed v1.2.3 to staging environment",
      project: "E-commerce API v2.0",
      timestamp: "2025-08-28T06:45:00Z"
    }
  ];

  const teamMembersData = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Senior API Developer",
      status: "online",
      avatar: "https://randomuser.me/api/portraits/women/1.jpg",
      currentProject: "E-commerce API v2.0"
    },
    {
      id: 2,
      name: "Mike Chen",
      role: "Full Stack Developer",
      status: "online",
      avatar: "https://randomuser.me/api/portraits/men/2.jpg",
      currentProject: "Analytics Dashboard API"
    },
    {
      id: 3,
      name: "Emily Davis",
      role: "DevOps Engineer",
      status: "away",
      avatar: null,
      currentProject: "Payment Gateway Integration"
    },
    {
      id: 4,
      name: "Alex Rodriguez",
      role: "Technical Lead",
      status: "busy",
      avatar: "https://randomuser.me/api/portraits/men/4.jpg",
      currentProject: "User Management System"
    },
    {
      id: 5,
      name: "David Kim",
      role: "Backend Developer",
      status: "offline",
      avatar: "https://randomuser.me/api/portraits/men/5.jpg",
      lastSeen: "2025-08-28T06:30:00Z"
    },
    {
      id: 6,
      name: "Lisa Wang",
      role: "QA Engineer",
      status: "online",
      avatar: null,
      currentProject: "Notification Service"
    }
  ];

  const templatesData = [
    {
      id: 1,
      name: "REST API Starter",
      description: "Complete REST API template with CRUD operations, authentication, and documentation setup.",
      type: "rest_api",
      estimatedTime: "15 min",
      popularity: "4.8"
    },
    {
      id: 2,
      name: "GraphQL API",
      description: "GraphQL API template with schema definition, resolvers, and subscription support.",
      type: "graphql",
      estimatedTime: "20 min",
      popularity: "4.6"
    },
    {
      id: 3,
      name: "Microservice Template",
      description: "Microservice architecture template with service discovery, load balancing, and monitoring.",
      type: "microservice",
      estimatedTime: "30 min",
      popularity: "4.7"
    },
    {
      id: 4,
      name: "CRUD API Generator",
      description: "Automatically generate CRUD operations for your database models with validation and testing.",
      type: "crud_api",
      estimatedTime: "10 min",
      popularity: "4.9"
    },
    {
      id: 5,
      name: "Authentication Service",
      description: "Complete authentication service with JWT, OAuth2, and multi-factor authentication support.",
      type: "auth_service",
      estimatedTime: "25 min",
      popularity: "4.5"
    },
    {
      id: 6,
      name: "Webhook Handler",
      description: "Webhook processing template with validation, retry logic, and event routing capabilities.",
      type: "webhook",
      estimatedTime: "12 min",
      popularity: "4.4"
    }
  ];

  // Filter and sort projects
  const filteredProjects = projectsData?.filter(project => {
    const matchesSearch = project?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
                         project?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project?.status === statusFilter;
    return matchesSearch && matchesStatus;
  })?.sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a?.name?.localeCompare(b?.name);
      case 'created':
        return new Date(b.lastModified) - new Date(a.lastModified);
      case 'endpoints':
        return b?.endpoints - a?.endpoints;
      case 'collaborators':
        return b?.collaborators - a?.collaborators;
      default: // lastModified
        return new Date(b.lastModified) - new Date(a.lastModified);
    }
  });

  // Project actions
  const handleOpenProject = (project) => {
    console.log('Opening project:', project?.name);
    navigate('/visual-api-designer', { state: { projectId: project?.id } });
  };

  const handleDuplicateProject = (project) => {
    console.log('Duplicating project:', project?.name);
    // Implement duplication logic
  };

  const handleShareProject = (project) => {
    console.log('Sharing project:', project?.name);
    // Implement sharing logic
  };

  const handleDeleteProject = (project) => {
    console.log('Deleting project:', project?.name);
    // Implement deletion logic with confirmation
  };

  const handleViewProjectDetails = (project) => {
    setSelectedProjectDetails(project);
    setShowProjectDetails(true);
  };

  const handleCloseProjectDetails = () => {
    setShowProjectDetails(false);
    setSelectedProjectDetails(null);
  };

  const handleCreateFromTemplate = (template) => {
    console.log('Creating project from template:', template?.name);
    navigate('/visual-api-designer', { state: { templateId: template?.id } });
  };

  const handleBulkAction = (action, projects) => {
    console.log(`Executing ${action} on ${projects?.length} projects`);
    // Implement bulk actions
    setSelectedProjects([]);
  };

  const handleProjectSelection = (projectId, isSelected) => {
    if (isSelected) {
      setSelectedProjects(prev => [...prev, projectId]);
    } else {
      setSelectedProjects(prev => prev?.filter(id => id !== projectId));
    }
  };

  const handleSelectAllProjects = () => {
    if (selectedProjects?.length === filteredProjects?.length) {
      setSelectedProjects([]);
    } else {
      setSelectedProjects(filteredProjects?.map(p => p?.id));
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setSortBy('lastModified');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
      />
      <main className={`pt-16 transition-all duration-300 ${
        isSidebarCollapsed ? 'pl-16' : 'pl-60'
      }`}>
        <div className="p-6">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's an overview of your API development projects and team activity.
            </p>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            {metricsData?.map((metric, index) => (
              <MetricsCard key={index} {...metric} />
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Main Content Area */}
            <div className="xl:col-span-3 space-y-6">
              {/* Project Management Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-foreground mb-1">Projects</h2>
                  <p className="text-muted-foreground">
                    {filteredProjects?.length} of {projectsData?.length} projects
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  {/* View Toggle */}
                  <div className="flex items-center bg-muted rounded-lg p-1">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      iconName="Grid3X3"
                      iconSize={16}
                    />
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      iconName="List"
                      iconSize={16}
                    />
                  </div>
                  
                  {/* Select All */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAllProjects}
                    iconName={selectedProjects?.length === filteredProjects?.length ? "CheckSquare" : "Square"}
                    iconSize={16}
                  >
                    Select All
                  </Button>
                  
                  {/* New Project */}
                  <Button
                    variant="default"
                    onClick={() => navigate('/visual-api-designer')}
                    iconName="Plus"
                    iconSize={16}
                  >
                    New Project
                  </Button>
                </div>
              </div>

              {/* Filters */}
              <ProjectFilters
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                sortBy={sortBy}
                onSortByChange={setSortBy}
                onClearFilters={handleClearFilters}
              />

              {/* Bulk Actions */}
              <BulkActions
                selectedProjects={selectedProjects}
                onBulkAction={handleBulkAction}
                onClearSelection={() => setSelectedProjects([])}
              />

              {/* Projects Grid/List */}
              {filteredProjects?.length > 0 ? (
                <div className={
                  viewMode === 'grid' 
                    ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" :"space-y-4"
                }>
                  {filteredProjects?.map((project) => (
                    <div key={project?.id} className="relative">
                      {/* Selection Checkbox */}
                      <div className="absolute top-3 left-3 z-10">
                        <input
                          type="checkbox"
                          checked={selectedProjects?.includes(project?.id)}
                          onChange={(e) => handleProjectSelection(project?.id, e?.target?.checked)}
                          className="w-4 h-4 text-primary bg-card border-border rounded focus:ring-primary focus:ring-2"
                        />
                      </div>
                      
                      {viewMode === 'grid' ? (
                        <ProjectCard
                          project={project}
                          onOpen={handleOpenProject}
                          onDuplicate={handleDuplicateProject}
                          onShare={handleShareProject}
                          onDelete={handleDeleteProject}
                          onViewDetails={handleViewProjectDetails}
                        />
                      ) : (
                        <ProjectListItem
                          project={project}
                          onOpen={handleOpenProject}
                          onDuplicate={handleDuplicateProject}
                          onShare={handleShareProject}
                          onDelete={handleDeleteProject}
                          onViewDetails={handleViewProjectDetails}
                        />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Icon name="FolderOpen" size={64} className="text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No projects found</h3>
                  <p className="text-muted-foreground mb-6">
                    {searchQuery || statusFilter !== 'all' 
                      ? "Try adjusting your filters or search terms." :"Get started by creating your first API project."
                    }
                  </p>
                  <Button
                    variant="default"
                    onClick={() => navigate('/visual-api-designer')}
                    iconName="Plus"
                    iconSize={16}
                  >
                    Create New Project
                  </Button>
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="xl:col-span-1 space-y-6">
              <ActivityFeed activities={activitiesData} />
              <TeamPresence teamMembers={teamMembersData} />
              <QuickStartTemplates 
                templates={templatesData}
                onCreateFromTemplate={handleCreateFromTemplate}
              />
            </div>
          </div>
        </div>
      </main>
      
      {/* Project Details Modal */}
      <ProjectDetailsModal
        project={selectedProjectDetails}
        isOpen={showProjectDetails}
        onClose={handleCloseProjectDetails}
      />
    </div>
  );
};

export default Dashboard;