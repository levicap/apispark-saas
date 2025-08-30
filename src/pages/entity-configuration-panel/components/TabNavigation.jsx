import React from 'react';
import Icon from '../../../components/AppIcon';

const TabNavigation = ({ activeTab, onTabChange, tabs }) => {
  return (
    <div className="flex border-b border-border bg-surface">
      {tabs?.map((tab) => (
        <button
          key={tab?.id}
          onClick={() => onTabChange(tab?.id)}
          className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-smooth min-w-0 flex-1 md:flex-none ${
            activeTab === tab?.id
              ? 'border-primary text-primary bg-primary/5' :'border-transparent text-text-secondary hover:text-text-primary hover:bg-muted'
          }`}
        >
          <Icon name={tab?.icon} size={16} />
          <span className="truncate">{tab?.label}</span>
          {tab?.count !== undefined && (
            <span className={`px-2 py-1 text-xs rounded-full ${
              activeTab === tab?.id 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted text-text-secondary'
            }`}>
              {tab?.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;