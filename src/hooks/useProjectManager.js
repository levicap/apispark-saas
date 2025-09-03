import { useState, useEffect } from 'react';

const useProjectManager = () => {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);

  // Mock projects with comprehensive data
  const mockProjects = [
    {
      id: 'project_1',
      name: 'E-commerce API',
      description: 'Complete e-commerce API with user management, products, orders, and payments',
      type: 'rest',
      status: 'active',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T14:30:00Z',
      metadata: {
        version: '1.0.0',
        framework: 'Express.js',
        language: 'JavaScript',
        database: 'PostgreSQL'
      },
      nodes: [
        {
          id: 'node_1',
          type: 'get',
          name: 'GET Users',
          color: 'bg-green-500',
          icon: 'Download',
          position: { x: 100, y: 100 },
          data: {
            method: 'GET',
            endpoint: '/api/users',
            description: 'Retrieve all users',
            parameters: [
              { name: 'page', type: 'number', required: false },
              { name: 'limit', type: 'number', required: false }
            ],
            responses: {
              200: { description: 'Success', schema: 'User[]' },
              400: { description: 'Bad Request' }
            }
          },
          connections: [
            { targetId: 'node_2', type: 'default' }
          ]
        },
        {
          id: 'node_2',
          type: 'post',
          name: 'POST User',
          color: 'bg-blue-500',
          icon: 'Plus',
          position: { x: 100, y: 250 },
          data: {
            method: 'POST',
            endpoint: '/api/users',
            description: 'Create a new user',
            parameters: [
              { name: 'name', type: 'string', required: true },
              { name: 'email', type: 'string', required: true },
              { name: 'password', type: 'string', required: true }
            ],
            responses: {
              201: { description: 'Created', schema: 'User' },
              400: { description: 'Bad Request' }
            }
          },
          connections: [
            { targetId: 'node_3', type: 'default' }
          ]
        },
        {
          id: 'node_3',
          type: 'jwt',
          name: 'JWT Auth',
          color: 'bg-yellow-500',
          icon: 'Shield',
          position: { x: 100, y: 400 },
          data: {
            method: 'AUTH',
            endpoint: '/api/auth',
            description: 'JWT authentication middleware',
            parameters: [],
            responses: {}
          },
          connections: []
        },
        {
          id: 'node_4',
          type: 'get',
          name: 'GET Products',
          color: 'bg-green-500',
          icon: 'Download',
          position: { x: 400, y: 100 },
          data: {
            method: 'GET',
            endpoint: '/api/products',
            description: 'Retrieve all products',
            parameters: [
              { name: 'category', type: 'string', required: false },
              { name: 'page', type: 'number', required: false }
            ],
            responses: {
              200: { description: 'Success', schema: 'Product[]' },
              400: { description: 'Bad Request' }
            }
          },
          connections: [
            { targetId: 'node_5', type: 'default' }
          ]
        },
        {
          id: 'node_5',
          type: 'post',
          name: 'POST Product',
          color: 'bg-blue-500',
          icon: 'Plus',
          position: { x: 400, y: 250 },
          data: {
            method: 'POST',
            endpoint: '/api/products',
            description: 'Create a new product',
            parameters: [
              { name: 'name', type: 'string', required: true },
              { name: 'price', type: 'number', required: true },
              { name: 'description', type: 'string', required: false }
            ],
            responses: {
              201: { description: 'Created', schema: 'Product' },
              400: { description: 'Bad Request' }
            }
          },
          connections: []
        }
      ]
    },
    {
      id: 'project_2',
      name: 'GraphQL User Service',
      description: 'GraphQL API for user management with real-time subscriptions',
      type: 'graphql',
      status: 'active',
      createdAt: '2024-01-05T00:00:00Z',
      updatedAt: '2024-01-14T10:15:00Z',
      metadata: {
        version: '2.0.0',
        framework: 'Apollo Server',
        language: 'TypeScript',
        database: 'MongoDB'
      },
      nodes: [
        {
          id: 'gql_1',
          type: 'query',
          name: 'User Query',
          color: 'bg-purple-500',
          icon: 'Braces',
          position: { x: 100, y: 100 },
          data: {
            method: 'QUERY',
            endpoint: 'users',
            description: 'GraphQL query for users',
            graphqlType: 'query',
            parameters: [
              { name: 'id', type: 'ID', required: false },
              { name: 'email', type: 'String', required: false }
            ],
            responses: {
              200: { description: 'Success', schema: 'User | User[]' }
            }
          },
          connections: [
            { targetId: 'gql_2', type: 'default' }
          ]
        },
        {
          id: 'gql_2',
          type: 'mutation',
          name: 'User Mutation',
          color: 'bg-orange-500',
          icon: 'Edit',
          position: { x: 100, y: 250 },
          data: {
            method: 'MUTATION',
            endpoint: 'createUser',
            description: 'GraphQL mutation for creating users',
            graphqlType: 'mutation',
            parameters: [
              { name: 'input', type: 'CreateUserInput', required: true }
            ],
            responses: {
              200: { description: 'Success', schema: 'User' }
            }
          },
          connections: [
            { targetId: 'gql_3', type: 'default' }
          ]
        },
        {
          id: 'gql_3',
          type: 'subscription',
          name: 'User Subscription',
          color: 'bg-indigo-500',
          icon: 'Radio',
          position: { x: 100, y: 400 },
          data: {
            method: 'SUBSCRIPTION',
            endpoint: 'userUpdated',
            description: 'GraphQL subscription for user updates',
            graphqlType: 'subscription',
            parameters: [
              { name: 'userId', type: 'ID', required: true }
            ],
            responses: {
              200: { description: 'Success', schema: 'User' }
            }
          },
          connections: []
        }
      ]
    },
    {
      id: 'project_3',
      name: 'Microservices Architecture',
      description: 'Distributed microservices with API gateway and service discovery',
      type: 'microservices',
      status: 'active',
      createdAt: '2024-01-10T00:00:00Z',
      updatedAt: '2024-01-13T16:45:00Z',
      metadata: {
        version: '1.5.0',
        framework: 'NestJS',
        language: 'TypeScript',
        database: 'PostgreSQL + Redis'
      },
      nodes: [
        {
          id: 'ms_1',
          type: 'service',
          name: 'User Service',
          color: 'bg-cyan-500',
          icon: 'Server',
          position: { x: 100, y: 100 },
          data: {
            method: 'SERVICE',
            endpoint: '/users',
            description: 'User management microservice',
            microserviceType: 'service',
            parameters: [],
            responses: {}
          },
          connections: [
            { targetId: 'ms_2', type: 'default' }
          ]
        },
        {
          id: 'ms_2',
          type: 'gateway',
          name: 'API Gateway',
          color: 'bg-pink-500',
          icon: 'Globe',
          position: { x: 100, y: 250 },
          data: {
            method: 'GATEWAY',
            endpoint: '/api',
            description: 'API Gateway for routing requests',
            microserviceType: 'gateway',
            parameters: [],
            responses: {}
          },
          connections: [
            { targetId: 'ms_3', type: 'default' }
          ]
        },
        {
          id: 'ms_3',
          type: 'service',
          name: 'Product Service',
          color: 'bg-cyan-500',
          icon: 'Server',
          position: { x: 100, y: 400 },
          data: {
            method: 'SERVICE',
            endpoint: '/products',
            description: 'Product management microservice',
            microserviceType: 'service',
            parameters: [],
            responses: {}
          },
          connections: [
            { targetId: 'ms_4', type: 'default' }
          ]
        },
        {
          id: 'ms_4',
          type: 'queue',
          name: 'Message Queue',
          color: 'bg-teal-500',
          icon: 'MessageSquare',
          position: { x: 100, y: 550 },
          data: {
            method: 'QUEUE',
            endpoint: '/queue',
            description: 'Message queue for inter-service communication',
            microserviceType: 'queue',
            parameters: [],
            responses: {}
          },
          connections: []
        }
      ]
    }
  ];

  // Load projects from localStorage on mount
  useEffect(() => {
    const savedProjects = localStorage.getItem('apiforge_projects');
    if (savedProjects) {
      const parsedProjects = JSON.parse(savedProjects);
      setProjects(parsedProjects);
      
      // Set current project if exists
      const currentProjectId = localStorage.getItem('apiforge_current_project');
      if (currentProjectId) {
        const current = parsedProjects.find(p => p.id === currentProjectId);
        if (current) {
          setCurrentProject(current);
        }
      }
    } else {
      // Initialize with mock data
      setProjects(mockProjects);
      setCurrentProject(mockProjects[0]);
    }
  }, []);

  // Save projects to localStorage whenever they change
  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem('apiforge_projects', JSON.stringify(projects));
    }
  }, [projects]);

  // Save current project to localStorage whenever it changes
  useEffect(() => {
    if (currentProject) {
      localStorage.setItem('apiforge_current_project', currentProject.id);
    }
  }, [currentProject]);

  const createProject = (projectData) => {
    const newProject = {
      id: `project_${Date.now()}`,
      name: projectData.name,
      description: projectData.description || '',
      type: projectData.type || 'rest',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metadata: {
        version: '1.0.0',
        framework: projectData.framework || 'Express.js',
        language: projectData.language || 'JavaScript',
        database: projectData.database || 'PostgreSQL'
      },
      nodes: []
    };

    setProjects(prev => [...prev, newProject]);
    setCurrentProject(newProject);
    return newProject;
  };

  const updateProject = (projectId, updates) => {
    setProjects(prev => prev.map(project => 
      project.id === projectId 
        ? { ...project, ...updates, updatedAt: new Date().toISOString() }
        : project
    ));

    if (currentProject?.id === projectId) {
      setCurrentProject(prev => ({ ...prev, ...updates, updatedAt: new Date().toISOString() }));
    }
  };

  const deleteProject = (projectId) => {
    setProjects(prev => prev.filter(project => project.id !== projectId));
    
    if (currentProject?.id === projectId) {
      const remainingProjects = projects.filter(project => project.id !== projectId);
      setCurrentProject(remainingProjects[0] || null);
    }
  };

  const duplicateProject = (projectId) => {
    const projectToDuplicate = projects.find(p => p.id === projectId);
    if (!projectToDuplicate) return;

    const duplicatedProject = {
      ...projectToDuplicate,
      id: `project_${Date.now()}`,
      name: `${projectToDuplicate.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setProjects(prev => [...prev, duplicatedProject]);
    return duplicatedProject;
  };

  const updateProjectNodes = (projectId, nodes) => {
    setProjects(prev => prev.map(project => 
      project.id === projectId 
        ? { ...project, nodes, updatedAt: new Date().toISOString() }
        : project
    ));

    if (currentProject?.id === projectId) {
      setCurrentProject(prev => ({ ...prev, nodes, updatedAt: new Date().toISOString() }));
    }
  };

  const getCurrentProjectNodes = () => {
    return currentProject?.nodes || [];
  };

  const getCurrentProjectEndpoints = () => {
    if (!currentProject?.nodes) return [];
    
    // Convert nodes to endpoint format for API documentation
    return currentProject.nodes
      .filter(node => ['get', 'post', 'put', 'patch', 'delete', 'query', 'mutation'].includes(node.type))
      .map(node => ({
        id: node.id,
        name: node.name,
        path: node.data?.endpoint || '',
        method: node.data?.method || node.type.toUpperCase(),
        description: node.data?.description || '',
        category: node.type === 'query' || node.type === 'mutation' ? 'GraphQL' : 'REST',
        parameters: node.data?.parameters || [],
        responses: node.data?.responses || {},
        graphqlType: node.data?.graphqlType,
        nodeType: node.type
      }));
  };

  const getCurrentProjectSchema = () => {
    // Mock schema data - in real app this would come from the schema canvas
    return {
      entities: [
        {
          id: 'entity_1',
          name: 'users',
          type: 'table',
          fields: [
            { name: 'id', type: 'bigint', primaryKey: true, nullable: false },
            { name: 'name', type: 'varchar', nullable: false },
            { name: 'email', type: 'varchar', nullable: false, unique: true },
            { name: 'password_hash', type: 'varchar', nullable: false },
            { name: 'created_at', type: 'timestamp', nullable: false }
          ]
        },
        {
          id: 'entity_2',
          name: 'products',
          type: 'table',
          fields: [
            { name: 'id', type: 'bigint', primaryKey: true, nullable: false },
            { name: 'name', type: 'varchar', nullable: false },
            { name: 'description', type: 'text', nullable: true },
            { name: 'price', type: 'decimal', nullable: false },
            { name: 'category_id', type: 'bigint', nullable: true },
            { name: 'created_at', type: 'timestamp', nullable: false }
          ]
        }
      ],
      connections: [
        {
          id: 'conn_1',
          sourceEntityId: 'entity_1',
          targetEntityId: 'entity_2',
          type: 'one-to-many',
          sourceField: 'id',
          targetField: 'user_id'
        }
      ]
    };
  };

  return {
    projects,
    currentProject,
    setCurrentProject,
    createProject,
    updateProject,
    deleteProject,
    duplicateProject,
    updateProjectNodes,
    getCurrentProjectNodes,
    getCurrentProjectSchema,
    getCurrentProjectEndpoints
  };
};

export default useProjectManager;