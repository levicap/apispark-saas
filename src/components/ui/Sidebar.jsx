import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useProjectContext } from '../../contexts/ProjectContext';
import Icon from '../AppIcon';
import Button from './Button';

const Sidebar = ({ 
  isCollapsed = false, 
  onToggle,
  isOpen = false,
  onClose 
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentProject } = useProjectContext();

  const navigationItems = [
    {
      label: 'API Designer',
      path: '/api-designer',
      icon: 'Code',
      tooltip: 'Design and build API workflows',
      phase: 'design'
    },
    {
      label: 'Marketplace',
      path: '/marketplace',
      icon: 'Store',
      tooltip: 'Browse and purchase prebuilt templates',
      phase: 'design'
    },
    {
      label: 'API Testing',
      path: '/api-testing',
      icon: 'TestTube',
      tooltip: 'Test and validate your APIs',
      phase: 'design'
    },
    {
      label: 'Database Connections',
      path: '/database-connection-manager',
      icon: 'Link',
      tooltip: 'Manage database connections and profiles',
      phase: 'db-design'
    },
    {
      label: 'Migration History',
      path: '/migration-history-management',
      icon: 'History',
      tooltip: 'Track and manage database migrations',
      phase: 'db-design'
    },
    {
      label: 'Code Generation',
      path: '/code-generation-export',
      icon: 'Code',
      tooltip: 'Generate and export database code',
      phase: 'db-design'
    },
    {
      label: 'Schema Canvas',
      path: '/schema-canvas-designer',
      icon: 'Palette',
      tooltip: 'Visual schema design and collaboration',
      phase: 'db-design'
    },
    {
      label: 'API documentation',
      path: '/api-documentation',
      icon: 'TestTube',
      tooltip: 'Test endpoints and validate responses',
      phase: 'validate'
    },
    {
      label: 'Deployment',
      path: '/deployment',
      icon: 'Rocket',
      tooltip: 'Deploy APIs to production environments',
      phase: 'deploy'
    },
    {
      label: 'Team Management',
      path: '/team-management',
      icon: 'Users',
      tooltip: 'Manage team members and permissions',
      phase: 'admin'
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (onClose) {
      onClose();
    }
  };

  const isActive = (path) => location?.pathname === path;

  const getPhaseLabel = (phase) => {
    const phaseLabels = {
      design: 'Design & Build',
      'db-design': 'DB Design',
      validate: 'Validate & Test',
      deploy: 'Deploy & Manage',
      admin: 'Administration'
    };
    return phaseLabels?.[phase] || '';
  };

  const groupedItems = navigationItems?.reduce((acc, item) => {
    if (!acc?.[item?.phase]) {
      acc[item.phase] = [];
    }
    acc?.[item?.phase]?.push(item);
    return acc;
  }, {});

  const phaseOrder = ['design', 'db-design', 'validate', 'deploy', 'admin'];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-150 lg:hidden"
          onClick={onClose}
        />
      )}
      {/* Sidebar */}
      <aside 
        className={`
          fixed left-0 top-16 bottom-0 bg-surface border-r border-border z-200 shadow-elevation-1 transition-spatial
          ${isCollapsed ? 'w-16' : 'w-60'}
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <h2 className="text-sm font-semibold text-foreground">Navigation</h2>
                {currentProject && (
                  <div className="mt-1 text-xs text-muted-foreground truncate">
                    {currentProject.name}
                  </div>
                )}
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="hidden lg:flex"
            >
              <Icon 
                name={isCollapsed ? "ChevronRight" : "ChevronLeft"} 
                size={16} 
              />
            </Button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto py-4">
            <div className="space-y-6">
              {phaseOrder?.map((phase) => {
                const items = groupedItems?.[phase];
                if (!items) return null;

                return (
                  <div key={phase}>
                    {/* Phase Label */}
                    {!isCollapsed && (
                      <div className="px-4 mb-2">
                        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          {getPhaseLabel(phase)}
                        </h3>
                      </div>
                    )}
                    {/* Phase Items */}
                    <div className="space-y-1 px-2">
                      {items?.map((item) => (
                        <div key={item?.path} className="relative group">
                          <button
                            onClick={() => handleNavigation(item?.path)}
                            className={`
                              w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-smooth
                              ${isActive(item?.path)
                                ? 'bg-primary text-primary-foreground shadow-sm'
                                : 'text-foreground hover:bg-muted hover:text-foreground'
                              }
                              ${isCollapsed ? 'justify-center' : 'justify-start space-x-3'}
                            `}
                          >
                            <Icon 
                              name={item?.icon} 
                              size={18}
                              className={isActive(item?.path) ? 'text-primary-foreground' : ''}
                            />
                            {!isCollapsed && (
                              <span className="truncate">{item?.label}</span>
                            )}
                          </button>

                          {/* Tooltip for collapsed state */}
                          {isCollapsed && (
                            <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded-md shadow-elevation-2 opacity-0 group-hover:opacity-100 transition-smooth pointer-events-none whitespace-nowrap z-300">
                              {item?.label}
                              <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-popover"></div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </nav>

          {/* AI Assistant Toggle */}
          <div className="p-4 border-t border-border">
            <Button
              variant="outline"
              className={`w-full ${isCollapsed ? 'px-0' : 'justify-start'}`}
              iconName="Bot"
              iconPosition="left"
            >
              {!isCollapsed && 'AI Assistant'}
            </Button>
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-border">
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'}`}>
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <Icon name="Zap" size={14} className="text-primary" />
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">
                    Pro Plan
                  </p>
                  <p className="text-xs text-muted-foreground">
                    5 projects remaining
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;