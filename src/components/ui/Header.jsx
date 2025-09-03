import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import ProjectSelector from './ProjectSelector';

const Header = ({ 
  user = null,
  onMenuClick = null
}) => {
  const location = useLocation();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    if (e?.key === 'Enter' || e?.key === 'k' && (e?.metaKey || e?.ctrlKey)) {
      e?.preventDefault();
      // Implement command palette logic
    }
  };

  const getPageTitle = () => {
    const pathMap = {
      '/api-designer': 'API Designer',
      '/database-designer': 'Database Designer',
      '/entity-configuration-panel': 'Entity Configuration',
      '/database-connection-manager': 'Database Connections',
      '/migration-history-management': 'Migration History',
      '/code-generation-export': 'Code Generation',
      '/schema-canvas-designer': 'Schema Canvas',
      '/ai-assistant': 'AI Assistant',
      '/api-testing': 'API Testing',
      '/api-documentation': 'API Documentation',
      '/deployment': 'Deployment',
      '/team-management': 'Team Management',
      '/marketplace': 'Marketplace'
    };
    return pathMap?.[location?.pathname] || 'APIForge';
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-surface border-b border-border z-200 shadow-elevation-1">
      <div className="flex items-center justify-between h-full px-4">
        {/* Left Section - Logo and Navigation Toggle */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Icon name="Menu" size={20} />
          </Button>

          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2L2 7L12 12L22 7L12 2Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 17L12 22L22 17"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 12L12 17L22 12"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-foreground">APISpark</h1>
            </div>
          </div>

          {/* Page Title - Hidden on mobile */}
          <div className="hidden md:block">
            <span className="text-sm text-muted-foreground">/</span>
            <span className="ml-2 text-sm font-medium text-foreground">
              {getPageTitle()}
            </span>
          </div>
        </div>

        {/* Center Section - Project Selector and Search */}
        <div className="flex items-center space-x-4 flex-1 max-w-md mx-4">
          {/* Project Selector */}
          <div className="hidden sm:block min-w-0 flex-1">
            <ProjectSelector />
          </div>

          {/* Global Search */}
          <div className="relative flex-1 max-w-sm">
            <div className="relative">
              <Icon 
                name="Search" 
                size={16} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
              />
              <input
                type="text"
                placeholder="Search... (⌘K)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e?.target?.value)}
                onKeyDown={handleSearch}
                className="w-full pl-10 pr-4 py-2 text-sm bg-muted border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
              />
            </div>
          </div>
        </div>

        {/* Right Section - Actions and User Menu */}
        <div className="flex items-center space-x-2">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Icon name="Bell" size={18} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full"></span>
          </Button>

          {/* Help */}
          <Button variant="ghost" size="icon">
            <Icon name="HelpCircle" size={18} />
          </Button>

          {/* User Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-2 px-3"
            >
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <Icon name="User" size={16} color="white" />
              </div>
              <span className="hidden sm:block text-sm font-medium">
                {user?.name || 'User Name'}
              </span>
              <Icon name="ChevronDown" size={14} />
            </Button>

            {/* User Dropdown */}
            {isUserMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-popover border border-border rounded-md shadow-elevation-2 z-300">
                <div className="p-3 border-b border-border">
                  <p className="text-sm font-medium text-foreground">
                    {user?.name || 'User Name'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user?.email || 'user@example.com'}
                  </p>
                </div>
                <div className="py-1">
                  <button className="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-muted transition-smooth flex items-center space-x-2">
                    <Icon name="User" size={14} />
                    <span>Profile</span>
                  </button>
                  <button className="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-muted transition-smooth flex items-center space-x-2">
                    <Icon name="Settings" size={14} />
                    <span>Settings</span>
                  </button>
                  <button className="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-muted transition-smooth flex items-center space-x-2">
                    <Icon name="CreditCard" size={14} />
                    <span>Billing</span>
                  </button>
                  <div className="border-t border-border my-1"></div>
                  <button className="w-full px-3 py-2 text-left text-sm text-error hover:bg-muted transition-smooth flex items-center space-x-2">
                    <Icon name="LogOut" size={14} />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;