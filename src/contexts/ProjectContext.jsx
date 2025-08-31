import React, { createContext, useContext } from 'react';
import useProjectManager from '../hooks/useProjectManager';

const ProjectContext = createContext();

export const useProjectContext = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjectContext must be used within a ProjectProvider');
  }
  return context;
};

export const ProjectProvider = ({ children }) => {
  const projectManager = useProjectManager();

  const value = {
    ...projectManager,
    // Add any additional context-specific functions here if needed
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
}; 