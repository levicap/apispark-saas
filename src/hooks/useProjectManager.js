import { useState, useEffect } from 'react';

const useProjectManager = () => {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);

  // Mock initial data
  useEffect(() => {
    const mockProjects = [
      {
        id: 'proj_1',
        name: 'E-commerce API',
        description: 'REST API for online store management',
        createdAt: new Date('2025-01-10'),
        updatedAt: new Date('2025-01-13'),
        status: 'active',
        nodes: [],
        metadata: {
          version: '1.0.0',
          framework: 'Express.js',
          database: 'PostgreSQL'
        }
      },
      {
        id: 'proj_2',
        name: 'User Management System',
        description: 'Authentication and user profile APIs',
        createdAt: new Date('2025-01-08'),
        updatedAt: new Date('2025-01-12'),
        status: 'active',
        nodes: [],
        metadata: {
          version: '1.2.0',
          framework: 'Express.js',
          database: 'MongoDB'
        }
      },
      {
        id: 'proj_3',
        name: 'Analytics Dashboard',
        description: 'Data aggregation and reporting APIs',
        createdAt: new Date('2025-01-05'),
        updatedAt: new Date('2025-01-11'),
        status: 'archived',
        nodes: [],
        metadata: {
          version: '2.1.0',
          framework: 'FastAPI',
          database: 'MySQL'
        }
      }
    ];

    setProjects(mockProjects);
    setCurrentProject(mockProjects?.[0]);
  }, []);

  const createProject = (projectData) => {
    const newProject = {
      id: `proj_${Date.now()}`,
      ...projectData,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'active',
      nodes: [],
      metadata: {
        version: '1.0.0',
        framework: projectData?.metadata?.framework || 'Express.js',
        database: projectData?.metadata?.database || 'PostgreSQL'
      }
    };

    setProjects(prev => [newProject, ...prev]);
    setCurrentProject(newProject);
    return newProject;
  };

  const updateProject = (projectId, updates) => {
    const updatedProject = {
      ...projects?.find(p => p?.id === projectId),
      ...updates,
      updatedAt: new Date()
    };

    setProjects(prev => prev?.map(p => 
      p?.id === projectId ? updatedProject : p
    ));

    if (currentProject?.id === projectId) {
      setCurrentProject(updatedProject);
    }

    return updatedProject;
  };

  const deleteProject = (projectId) => {
    setProjects(prev => prev?.filter(p => p?.id !== projectId));
    
    if (currentProject?.id === projectId) {
      const remainingProjects = projects?.filter(p => p?.id !== projectId);
      setCurrentProject(remainingProjects?.[0] || null);
    }
  };

  const duplicateProject = (projectId) => {
    const originalProject = projects?.find(p => p?.id === projectId);
    if (!originalProject) return null;

    const duplicatedProject = {
      ...originalProject,
      id: `proj_${Date.now()}`,
      name: `${originalProject?.name} (Copy)`,
      createdAt: new Date(),
      updatedAt: new Date(),
      nodes: [...(originalProject?.nodes || [])]
    };

    setProjects(prev => [duplicatedProject, ...prev]);
    return duplicatedProject;
  };

  const updateProjectNodes = (projectId, nodes) => {
    updateProject(projectId, { nodes });
  };

  return {
    projects,
    currentProject,
    setCurrentProject,
    createProject,
    updateProject,
    deleteProject,
    duplicateProject,
    updateProjectNodes
  };
};

export default useProjectManager;