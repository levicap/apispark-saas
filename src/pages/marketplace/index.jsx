import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import { useProjectContext } from '../../contexts/ProjectContext';
import { useToast } from '../../contexts/ToastContext';
import Icon from '../../components/AppIcon';

const Marketplace = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showTemplateDetails, setShowTemplateDetails] = useState(false);

  // Project context
  const { currentProject, createProject } = useProjectContext();
  const { success, error: showError } = useToast();

  // Mock user data
  const mockUser = {
    id: 'user_1',
    name: 'Alex Johnson',
    email: 'alex.johnson@apiforge.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
  };

  // Mock marketplace data
  const templates = [
    {
      id: 'template-1',
      name: 'E-commerce API Suite',
      description: 'Complete e-commerce API with user management, product catalog, orders, and payments',
      category: 'ecommerce',
      price: 99.99,
      rating: 4.8,
      reviews: 127,
      downloads: 1543,
      tags: ['REST API', 'PostgreSQL', 'Node.js', 'Express'],
      features: [
        'User authentication & authorization',
        'Product catalog management',
        'Shopping cart & checkout',
        'Order processing',
        'Payment integration',
        'Inventory management',
        'Analytics dashboard'
      ],
      preview: {
        entities: 8,
        endpoints: 24,
        database: 'PostgreSQL',
        framework: 'Express.js'
      },
      author: {
        name: 'API Forge Team',
        verified: true,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
      },
      lastUpdated: '2025-01-15',
      version: '2.1.0'
    },
    {
      id: 'template-2',
      name: 'Blog CMS API',
      description: 'Content management system API with user roles, articles, categories, and comments',
      category: 'cms',
      price: 49.99,
      rating: 4.6,
      reviews: 89,
      downloads: 892,
      tags: ['REST API', 'MySQL', 'Python', 'FastAPI'],
      features: [
        'Multi-user role management',
        'Article creation & editing',
        'Category organization',
        'Comment system',
        'Media management',
        'SEO optimization',
        'Content scheduling'
      ],
      preview: {
        entities: 6,
        endpoints: 18,
        database: 'MySQL',
        framework: 'FastAPI'
      },
      author: {
        name: 'DevTemplates Pro',
        verified: true,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face'
      },
      lastUpdated: '2025-01-10',
      version: '1.8.2'
    },
    {
      id: 'template-3',
      name: 'Task Management System',
      description: 'Project and task management API with teams, projects, tasks, and time tracking',
      category: 'productivity',
      price: 79.99,
      rating: 4.7,
      reviews: 156,
      downloads: 1123,
      tags: ['REST API', 'PostgreSQL', 'Java', 'Spring Boot'],
      features: [
        'Team collaboration',
        'Project management',
        'Task tracking',
        'Time logging',
        'Progress reporting',
        'File attachments',
        'Real-time notifications'
      ],
      preview: {
        entities: 7,
        endpoints: 22,
        database: 'PostgreSQL',
        framework: 'Spring Boot'
      },
      author: {
        name: 'Enterprise Solutions',
        verified: true,
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=32&h=32&fit=crop&crop=face'
      },
      lastUpdated: '2025-01-08',
      version: '3.0.1'
    },
    {
      id: 'template-4',
      name: 'Inventory Management API',
      description: 'Warehouse and inventory management with products, locations, and transactions',
      category: 'inventory',
      price: 69.99,
      rating: 4.5,
      reviews: 73,
      downloads: 567,
      tags: ['REST API', 'MySQL', 'PHP', 'Laravel'],
      features: [
        'Product catalog',
        'Warehouse management',
        'Stock tracking',
        'Barcode scanning',
        'Purchase orders',
        'Sales tracking',
        'Reporting dashboard'
      ],
      preview: {
        entities: 5,
        endpoints: 16,
        database: 'MySQL',
        framework: 'Laravel'
      },
      author: {
        name: 'Business Tools Inc',
        verified: true,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face'
      },
      lastUpdated: '2025-01-05',
      version: '2.3.0'
    },
    {
      id: 'template-5',
      name: 'Social Media API',
      description: 'Social networking API with user profiles, posts, friends, and messaging',
      category: 'social',
      price: 89.99,
      rating: 4.4,
      reviews: 94,
      downloads: 734,
      tags: ['REST API', 'MongoDB', 'Node.js', 'Express'],
      features: [
        'User profiles',
        'Post creation',
        'Friend connections',
        'Messaging system',
        'Content sharing',
        'Activity feed',
        'Privacy controls'
      ],
      preview: {
        entities: 9,
        endpoints: 28,
        database: 'MongoDB',
        framework: 'Express.js'
      },
      author: {
        name: 'SocialDev Labs',
        verified: true,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
      },
      lastUpdated: '2025-01-12',
      version: '1.6.5'
    },
    {
      id: 'template-6',
      name: 'Financial Management API',
      description: 'Personal finance API with accounts, transactions, budgets, and reporting',
      category: 'finance',
      price: 119.99,
      rating: 4.9,
      reviews: 203,
      downloads: 1892,
      tags: ['REST API', 'PostgreSQL', 'Python', 'Django'],
      features: [
        'Account management',
        'Transaction tracking',
        'Budget planning',
        'Investment tracking',
        'Financial reporting',
        'Tax calculations',
        'Security compliance'
      ],
      preview: {
        entities: 10,
        endpoints: 32,
        database: 'PostgreSQL',
        framework: 'Django'
      },
      author: {
        name: 'FinTech Solutions',
        verified: true,
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=32&h=32&fit=crop&crop=face'
      },
      lastUpdated: '2025-01-18',
      version: '4.2.1'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Templates', count: templates.length },
    { id: 'ecommerce', name: 'E-commerce', count: templates.filter(t => t.category === 'ecommerce').length },
    { id: 'cms', name: 'Content Management', count: templates.filter(t => t.category === 'cms').length },
    { id: 'productivity', name: 'Productivity', count: templates.filter(t => t.category === 'productivity').length },
    { id: 'inventory', name: 'Inventory', count: templates.filter(t => t.category === 'inventory').length },
    { id: 'social', name: 'Social Media', count: templates.filter(t => t.category === 'social').length },
    { id: 'finance', name: 'Finance', count: templates.filter(t => t.category === 'finance').length }
  ];

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const handleSidebarOpen = () => {
    setSidebarOpen(true);
  };

  const handleProjectChange = (project) => {
    // This function is called by the Header component
    // The actual project change logic is handled by the ProjectContext
  };

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setShowTemplateDetails(true);
  };

  const handleCloseTemplateDetails = () => {
    setShowTemplateDetails(false);
    setSelectedTemplate(null);
  };

  const handlePurchaseTemplate = async (template) => {
    // Simulate purchase process
    try {
      // Here you would integrate with a payment processor
      console.log(`Purchasing template: ${template.name}`);
      
      // Create a new project from the template
      const newProject = createProject({
        name: `${template.name} - Copy`,
        description: template.description,
        databaseType: template.preview.database,
        metadata: {
          framework: template.preview.framework,
          language: template.preview.framework.includes('Node.js') ? 'JavaScript' : 
                   template.preview.framework.includes('Python') ? 'Python' : 
                   template.preview.framework.includes('Java') ? 'Java' : 'PHP',
          database: template.preview.database,
          deployment: 'Cloud',
          templateSource: template.id,
          originalAuthor: template.author.name
        }
      });

      // Close the template details
      handleCloseTemplateDetails();
      
      // Show success message (you could add a toast notification here)
      success(`Template "${template.name}" purchased successfully! A new project has been created.`);
      
    } catch (error) {
      console.error('Error purchasing template:', error);
      showError('Error purchasing template. Please try again.');
    }
  };

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onToggle={handleSidebarToggle}
        onClose={handleSidebarClose}
        currentUser={mockUser}
        currentProject={currentProject}
      />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        sidebarCollapsed ? 'ml-16' : 'ml-64'
      }`}>
        {/* Header */}
        <Header
          currentUser={mockUser}
          currentProject={currentProject}
          onProjectChange={handleProjectChange}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={handleToggleSidebar}
        />

        {/* Page Content */}
        <div className="flex-1 overflow-hidden p-6">
          <div className="h-full flex flex-col">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                API Templates Marketplace
              </h1>
              <p className="text-lg text-muted-foreground">
                Discover and import pre-built API templates to accelerate your development
              </p>
            </div>

          {/* Search and Filters */}
          <div className="bg-surface border border-border rounded-lg p-6 mb-6">
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Icon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search templates..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="flex space-x-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {category.name}
                    <span className="ml-2 text-xs opacity-75">({category.count})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Templates Grid */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleTemplateSelect(template)}
                >
                  {/* Template Header */}
                  <div className="p-6 border-b border-border">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Icon name="Package" size={20} className="text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{template.name}</h3>
                          <p className="text-sm text-muted-foreground">{template.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-foreground">${template.price}</div>
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <Icon name="Star" size={14} className="text-yellow-500" />
                          <span>{template.rating}</span>
                          <span>({template.reviews})</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {template.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-muted text-xs text-muted-foreground rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {template.tags.length > 3 && (
                        <span className="px-2 py-1 bg-muted text-xs text-muted-foreground rounded">
                          +{template.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Template Footer */}
                  <div className="p-4 bg-muted/30">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Icon name="Download" size={14} className="text-muted-foreground" />
                          <span className="text-muted-foreground">{template.downloads}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Icon name="Calendar" size={14} className="text-muted-foreground" />
                          <span className="text-muted-foreground">{template.lastUpdated}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">v{template.version}</span>
                        <button className="px-3 py-1 bg-primary text-primary-foreground text-xs rounded hover:bg-primary/90 transition-colors">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Template Details Modal */}
      {showTemplateDetails && selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h2 className="text-2xl font-bold text-foreground">{selectedTemplate.name}</h2>
                <p className="text-muted-foreground">{selectedTemplate.description}</p>
              </div>
              <button
                onClick={handleCloseTemplateDetails}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <Icon name="X" size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Features */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">Features</h3>
                    <ul className="space-y-2">
                      {selectedTemplate.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <Icon name="Check" size={16} className="text-green-500" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Technical Details */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">Technical Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Database</div>
                        <div className="font-medium text-foreground">{selectedTemplate.preview.database}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Framework</div>
                        <div className="font-medium text-foreground">{selectedTemplate.preview.framework}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Entities</div>
                        <div className="font-medium text-foreground">{selectedTemplate.preview.entities}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Endpoints</div>
                        <div className="font-medium text-foreground">{selectedTemplate.preview.endpoints}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Pricing */}
                  <div className="bg-muted/30 p-6 rounded-lg">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-foreground">${selectedTemplate.price}</div>
                      <div className="text-muted-foreground mb-4">One-time purchase</div>
                      <button
                        onClick={() => handlePurchaseTemplate(selectedTemplate)}
                        className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                      >
                        Purchase Template
                      </button>
                    </div>
                  </div>

                  {/* Author Info */}
                  <div className="border border-border rounded-lg p-4">
                    <h4 className="font-medium text-foreground mb-3">Author</h4>
                    <div className="flex items-center space-x-3">
                      <img
                        src={selectedTemplate.author.avatar}
                        alt={selectedTemplate.author.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div>
                        <div className="font-medium text-foreground">{selectedTemplate.author.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {selectedTemplate.author.verified ? 'Verified Author' : 'Author'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="text-lg font-bold text-foreground">{selectedTemplate.rating}</div>
                      <div className="text-muted-foreground">Rating</div>
                    </div>
                    <div className="text-center p-3 bg-muted/30 rounded-lg">
                      <div className="text-lg font-bold text-foreground">{selectedTemplate.downloads}</div>
                      <div className="text-muted-foreground">Downloads</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default Marketplace; 