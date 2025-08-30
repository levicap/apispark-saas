import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const ProjectContext = createContext();

export const useProjectContext = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjectContext must be used within a ProjectProvider');
  }
  return context;
};

export const ProjectProvider = ({ children }) => {
  const [currentProject, setCurrentProject] = useState(null);
  const [projects, setProjects] = useState([
    {
      id: 'project-1',
      name: 'E-commerce Platform',
      description: 'Complete e-commerce database schema with user management, products, orders, and payments',
      createdAt: '2025-01-15T10:00:00Z',
      updatedAt: '2025-01-20T14:30:00Z',
      collaborators: 3,
      status: 'active',
      databaseType: 'PostgreSQL',
      metadata: {
        framework: 'Express.js',
        language: 'Node.js',
        database: 'PostgreSQL',
        deployment: 'Docker'
      },
      workflow: {
        nodes: [
          {
            id: 'node-1',
            type: 'gateway',
            name: 'API Gateway',
            position: { x: 100, y: 100 },
            data: {
              baseUrl: 'https://api.ecommerce.com/v1',
              rateLimit: '2000/hour',
              authentication: 'JWT + OAuth2'
            },
            connections: [
              { to: 'node-2', type: 'auth' },
              { to: 'node-3', type: 'routing' }
            ]
          },
          {
            id: 'node-2',
            type: 'jwt',
            name: 'JWT Validation',
            position: { x: 100, y: 300 },
            data: {
              method: 'JWT',
              providers: ['local', 'google', 'facebook'],
              sessionTimeout: '24h'
            },
            connections: [
              { to: 'node-4', type: 'user-data' }
            ]
          },
          {
            id: 'node-3',
            type: 'service',
            name: 'User Service',
            position: { x: 400, y: 100 },
            data: {
              endpoints: ['GET /users', 'POST /users', 'PUT /users/:id', 'DELETE /users/:id'],
              database: 'users_table'
            },
            connections: [
              { to: 'node-5', type: 'user-requests' }
            ]
          },
          {
            id: 'node-4',
            type: 'service',
            name: 'Product Service',
            position: { x: 400, y: 300 },
            data: {
              endpoints: ['GET /products', 'POST /products', 'PUT /products/:id', 'DELETE /products/:id'],
              database: 'products_table'
            },
            connections: [
              { to: 'node-6', type: 'product-requests' }
            ]
          },
          {
            id: 'node-5',
            type: 'service',
            name: 'Order Service',
            position: { x: 700, y: 100 },
            data: {
              endpoints: ['GET /orders', 'POST /orders', 'PUT /orders/:id', 'DELETE /orders/:id'],
              database: 'orders_table'
            },
            connections: []
          },
          {
            id: 'node-6',
            type: 'service',
            name: 'Payment Service',
            position: { x: 700, y: 300 },
            data: {
              endpoints: ['POST /payments', 'GET /payments/:id', 'PUT /payments/:id'],
              database: 'payments_table'
            },
            connections: []
          }
        ],
        connections: []
      }
    },
    {
      id: 'project-2',
      name: 'Blog CMS',
      description: 'Content management system with user roles, articles, categories, and comments',
      createdAt: '2025-01-10T09:00:00Z',
      updatedAt: '2025-01-18T16:45:00Z',
      collaborators: 2,
      status: 'active',
      databaseType: 'MySQL',
      metadata: {
        framework: 'FastAPI',
        language: 'Python',
        database: 'MySQL',
        deployment: 'Kubernetes'
      },
      workflow: {
        nodes: [
          {
            id: 'node-1',
            type: 'gateway',
            name: 'Blog CMS Gateway',
            position: { x: 100, y: 100 },
            data: {
              baseUrl: 'https://api.blogcms.com/v1',
              rateLimit: '1000/hour',
              authentication: 'JWT'
            },
            connections: [
              { to: 'node-2', type: 'auth' },
              { to: 'node-3', type: 'routing' }
            ]
          },
          {
            id: 'node-2',
            type: 'jwt',
            name: 'JWT Validation',
            position: { x: 100, y: 300 },
            data: {
              method: 'JWT',
              providers: ['local'],
              sessionTimeout: '12h'
            },
            connections: [
              { to: 'node-4', type: 'user-data' }
            ]
          },
          {
            id: 'node-3',
            type: 'service',
            name: 'User Service',
            position: { x: 400, y: 100 },
            data: {
              endpoints: ['GET /users', 'POST /users', 'PUT /users/:id', 'DELETE /users/:id'],
              database: 'users_table'
            },
            connections: [
              { to: 'node-5', type: 'user-requests' }
            ]
          },
          {
            id: 'node-4',
            type: 'service',
            name: 'Article Service',
            position: { x: 400, y: 300 },
            data: {
              endpoints: ['GET /articles', 'POST /articles', 'PUT /articles/:id', 'DELETE /articles/:id'],
              database: 'articles_table'
            },
            connections: [
              { to: 'node-6', type: 'article-requests' }
            ]
          },
          {
            id: 'node-5',
            type: 'service',
            name: 'Category Service',
            position: { x: 700, y: 100 },
            data: {
              endpoints: ['GET /categories', 'POST /categories', 'PUT /categories/:id', 'DELETE /categories/:id'],
              database: 'categories_table'
            },
            connections: []
          },
          {
            id: 'node-6',
            type: 'service',
            name: 'Comment Service',
            position: { x: 700, y: 300 },
            data: {
              endpoints: ['GET /comments', 'POST /comments', 'PUT /comments/:id', 'DELETE /comments/:id'],
              database: 'comments_table'
            },
            connections: []
          }
        ],
        connections: []
      }
    },
    {
      id: 'project-3',
      name: 'Task Management App',
      description: 'Project and task management with teams, projects, tasks, and time tracking',
      createdAt: '2025-01-05T11:00:00Z',
      updatedAt: '2025-01-15T13:20:00Z',
      collaborators: 4,
      status: 'active',
      databaseType: 'PostgreSQL',
      metadata: {
        framework: 'Spring Boot',
        language: 'Java',
        database: 'PostgreSQL',
        deployment: 'AWS'
      },
      workflow: {
        nodes: [
          {
            id: 'node-1',
            type: 'gateway',
            name: 'Task Management Gateway',
            position: { x: 100, y: 100 },
            data: {
              baseUrl: 'https://api.taskmanager.com/v1',
              rateLimit: '1500/hour',
              authentication: 'JWT'
            },
            connections: [
              { to: 'node-2', type: 'auth' },
              { to: 'node-3', type: 'routing' }
            ]
          },
          {
            id: 'node-2',
            type: 'jwt',
            name: 'JWT Validation',
            position: { x: 100, y: 300 },
            data: {
              method: 'JWT',
              providers: ['local', 'ldap'],
              sessionTimeout: '12h'
            },
            connections: [
              { to: 'node-4', type: 'user-data' }
            ]
          },
          {
            id: 'node-3',
            type: 'service',
            name: 'User Service',
            position: { x: 400, y: 100 },
            data: {
              endpoints: ['GET /users', 'POST /users', 'PUT /users/:id', 'DELETE /users/:id'],
              database: 'users_table'
            },
            connections: [
              { to: 'node-5', type: 'user-requests' }
            ]
          },
          {
            id: 'node-4',
            type: 'service',
            name: 'Team Service',
            position: { x: 400, y: 300 },
            data: {
              endpoints: ['GET /teams', 'POST /teams', 'PUT /teams/:id', 'DELETE /teams/:id'],
              database: 'teams_table'
            },
            connections: [
              { to: 'node-6', type: 'team-requests' }
            ]
          },
          {
            id: 'node-5',
            type: 'service',
            name: 'Project Service',
            position: { x: 700, y: 100 },
            data: {
              endpoints: ['GET /projects', 'POST /projects', 'PUT /projects/:id', 'DELETE /projects/:id'],
              database: 'projects_table'
            },
            connections: [
              { to: 'node-7', type: 'project-requests' }
            ]
          },
          {
            id: 'node-6',
            type: 'service',
            name: 'Task Service',
            position: { x: 700, y: 300 },
            data: {
              endpoints: ['GET /tasks', 'POST /tasks', 'PUT /tasks/:id', 'DELETE /tasks/:id'],
              database: 'tasks_table'
            },
            connections: []
          },
          {
            id: 'node-7',
            type: 'scheduler',
            name: 'Time Tracking Service',
            position: { x: 1000, y: 200 },
            data: {
              endpoints: ['POST /time-entries', 'GET /time-entries', 'PUT /time-entries/:id'],
              database: 'time_entries_table'
            },
            connections: []
          }
        ],
        connections: []
      }
    },
    {
      id: 'project-4',
      name: 'Inventory System',
      description: 'Warehouse and inventory management with products, locations, and transactions',
      createdAt: '2025-01-01T08:00:00Z',
      updatedAt: '2025-01-12T10:15:00Z',
      collaborators: 2,
      status: 'draft',
      databaseType: 'MySQL',
      metadata: {
        framework: 'Laravel',
        language: 'PHP',
        database: 'MySQL',
        deployment: 'VPS'
      },
      workflow: {
        nodes: [
          {
            id: 'node-1',
            type: 'gateway',
            name: 'Inventory Gateway',
            position: { x: 100, y: 100 },
            data: {
              baseUrl: 'https://api.inventory.com/v1',
              rateLimit: '800/hour',
              authentication: 'API Key'
            },
            connections: [
              { to: 'node-2', type: 'auth' },
              { to: 'node-3', type: 'routing' }
            ]
          },
          {
            id: 'node-2',
            type: 'apikey',
            name: 'API Key Validation',
            position: { x: 100, y: 300 },
            data: {
              method: 'API Key',
              providers: ['api-key'],
              sessionTimeout: '24h'
            },
            connections: [
              { to: 'node-4', type: 'auth-data' }
            ]
          },
          {
            id: 'node-3',
            type: 'service',
            name: 'Warehouse Service',
            position: { x: 400, y: 100 },
            data: {
              endpoints: ['GET /warehouses', 'POST /warehouses', 'PUT /warehouses/:id', 'DELETE /warehouses/:id'],
              database: 'warehouses_table'
            },
            connections: [
              { to: 'node-5', type: 'warehouse-requests' }
            ]
          },
          {
            id: 'node-4',
            type: 'service',
            name: 'Inventory Service',
            position: { x: 400, y: 300 },
            data: {
              endpoints: ['GET /inventory', 'POST /inventory', 'PUT /inventory/:id', 'DELETE /inventory/:id'],
              database: 'inventory_table'
            },
            connections: [
              { to: 'node-6', type: 'inventory-requests' }
            ]
          },
          {
            id: 'node-5',
            type: 'service',
            name: 'Stock Service',
            position: { x: 700, y: 100 },
            data: {
              endpoints: ['GET /stock', 'POST /stock', 'PUT /stock/:id', 'DELETE /stock/:id'],
              database: 'stock_table'
            },
            connections: [
              { to: 'node-7', type: 'stock-requests' }
            ]
          },
          {
            id: 'node-6',
            type: 'service',
            name: 'Supplier Service',
            position: { x: 700, y: 300 },
            data: {
              endpoints: ['GET /suppliers', 'POST /suppliers', 'PUT /suppliers/:id', 'DELETE /suppliers/:id'],
              database: 'suppliers_table'
            },
            connections: []
          },
          {
            id: 'node-7',
            type: 'logging',
            name: 'Report Service',
            position: { x: 1000, y: 200 },
            data: {
              endpoints: ['GET /reports/inventory', 'GET /reports/stock', 'GET /reports/suppliers'],
              database: 'reports_table'
            },
            connections: []
          }
        ],
        connections: []
      }
    }
  ]);

  // Mock schemas for each project
  const mockSchemas = {
    'project-1': {
      entities: [
        {
          id: 'user-1',
          name: 'users',
          type: 'table',
          position: { x: 100, y: 100 },
          fields: [
            { name: 'id', type: 'bigint', primaryKey: true, required: true },
            { name: 'email', type: 'varchar(255)', unique: true, required: true },
            { name: 'password_hash', type: 'varchar(255)', required: true },
            { name: 'first_name', type: 'varchar(100)', required: true },
            { name: 'last_name', type: 'varchar(100)', required: true },
            { name: 'created_at', type: 'timestamp', defaultValue: 'CURRENT_TIMESTAMP' },
            { name: 'updated_at', type: 'timestamp', defaultValue: 'CURRENT_TIMESTAMP' }
          ]
        },
        {
          id: 'product-1',
          name: 'products',
          type: 'table',
          position: { x: 400, y: 100 },
          fields: [
            { name: 'id', type: 'bigint', primaryKey: true, required: true },
            { name: 'name', type: 'varchar(255)', required: true },
            { name: 'description', type: 'text' },
            { name: 'price', type: 'decimal(10,2)', required: true },
            { name: 'sku', type: 'varchar(100)', unique: true, required: true },
            { name: 'category_id', type: 'bigint', foreignKey: true },
            { name: 'stock_quantity', type: 'int', defaultValue: '0' },
            { name: 'created_at', type: 'timestamp', defaultValue: 'CURRENT_TIMESTAMP' },
            { name: 'updated_at', type: 'timestamp', defaultValue: 'CURRENT_TIMESTAMP' }
          ]
        },
        {
          id: 'category-1',
          name: 'categories',
          type: 'table',
          position: { x: 700, y: 100 },
          fields: [
            { name: 'id', type: 'bigint', primaryKey: true, required: true },
            { name: 'name', type: 'varchar(100)', required: true },
            { name: 'description', type: 'text' },
            { name: 'created_at', type: 'timestamp', defaultValue: 'CURRENT_TIMESTAMP' }
          ]
        },
        {
          id: 'order-1',
          name: 'orders',
          type: 'table',
          position: { x: 100, y: 400 },
          fields: [
            { name: 'id', type: 'bigint', primaryKey: true, required: true },
            { name: 'user_id', type: 'bigint', foreignKey: true, required: true },
            { name: 'total_amount', type: 'decimal(10,2)', required: true },
            { name: 'status', type: 'enum("pending","processing","shipped","delivered","cancelled")', defaultValue: "'pending'" },
            { name: 'created_at', type: 'timestamp', defaultValue: 'CURRENT_TIMESTAMP' },
            { name: 'updated_at', type: 'timestamp', defaultValue: 'CURRENT_TIMESTAMP' }
          ]
        },
        {
          id: 'order-item-1',
          name: 'order_items',
          type: 'table',
          position: { x: 400, y: 400 },
          fields: [
            { name: 'id', type: 'bigint', primaryKey: true, required: true },
            { name: 'order_id', type: 'bigint', foreignKey: true, required: true },
            { name: 'product_id', type: 'bigint', foreignKey: true, required: true },
            { name: 'quantity', type: 'int', required: true },
            { name: 'unit_price', type: 'decimal(10,2)', required: true },
            { name: 'total_price', type: 'decimal(10,2)', required: true }
          ]
        },
        {
          id: 'payment-1',
          name: 'payments',
          type: 'table',
          position: { x: 700, y: 400 },
          fields: [
            { name: 'id', type: 'bigint', primaryKey: true, required: true },
            { name: 'order_id', type: 'bigint', foreignKey: true, required: true },
            { name: 'amount', type: 'decimal(10,2)', required: true },
            { name: 'payment_method', type: 'enum("credit_card","paypal","stripe")', required: true },
            { name: 'status', type: 'enum("pending","completed","failed","refunded")', defaultValue: "'pending'" },
            { name: 'created_at', type: 'timestamp', defaultValue: 'CURRENT_TIMESTAMP' }
          ]
        }
      ],
      connections: [
        {
          id: 'conn-1',
          from: 'user-1',
          to: 'order-1',
          type: 'one-to-many',
          fromField: 'id',
          toField: 'user_id'
        },
        {
          id: 'conn-2',
          from: 'category-1',
          to: 'product-1',
          type: 'one-to-many',
          fromField: 'id',
          toField: 'category_id'
        },
        {
          id: 'conn-3',
          from: 'order-1',
          to: 'order-item-1',
          type: 'one-to-many',
          fromField: 'id',
          toField: 'order_id'
        },
        {
          id: 'conn-4',
          from: 'product-1',
          to: 'order-item-1',
          type: 'one-to-many',
          fromField: 'id',
          toField: 'product_id'
        },
        {
          id: 'conn-5',
          from: 'order-1',
          to: 'payment-1',
          type: 'one-to-one',
          fromField: 'id',
          toField: 'order_id'
        }
      ],
      endpoints: [
        {
          id: 'endpoint-1',
          name: 'Get Users',
          path: '/api/users',
          method: 'GET',
          description: 'Retrieve a list of users with pagination and filtering',
          category: 'Authentication',
          parameters: [
            { name: 'page', type: 'integer', required: false, description: 'Page number for pagination' },
            { name: 'limit', type: 'integer', required: false, description: 'Number of items per page' },
            { name: 'search', type: 'string', required: false, description: 'Search term for username or email' },
            { name: 'status', type: 'string', required: false, description: 'Filter by user status' }
          ],
          responses: {
            200: { description: 'List of users retrieved successfully' },
            400: { description: 'Invalid parameters' },
            401: { description: 'Unauthorized' },
            403: { description: 'Forbidden' }
          }
        },
        {
          id: 'endpoint-2',
          name: 'Create User',
          path: '/api/users',
          method: 'POST',
          description: 'Create a new user account',
          category: 'Authentication',
          parameters: [
            { name: 'email', type: 'string', required: true, description: 'User email address' },
            { name: 'username', type: 'string', required: true, description: 'Username' },
            { name: 'password', type: 'string', required: true, description: 'User password' },
            { name: 'first_name', type: 'string', required: false, description: 'First name' },
            { name: 'last_name', type: 'string', required: false, description: 'Last name' }
          ],
          responses: {
            201: { description: 'User created successfully' },
            400: { description: 'Invalid input data' },
            409: { description: 'User already exists' }
          }
        },
        {
          id: 'endpoint-3',
          name: 'Get Products',
          path: '/api/products',
          method: 'GET',
          description: 'Retrieve products with filtering and pagination',
          category: 'Products',
          parameters: [
            { name: 'page', type: 'integer', required: false, description: 'Page number' },
            { name: 'limit', type: 'integer', required: false, description: 'Items per page' },
            { name: 'category', type: 'string', required: false, description: 'Filter by category' },
            { name: 'search', type: 'string', required: false, description: 'Search term' },
            { name: 'min_price', type: 'number', required: false, description: 'Minimum price' },
            { name: 'max_price', type: 'number', required: false, description: 'Maximum price' }
          ],
          responses: {
            200: { description: 'Products retrieved successfully' },
            400: { description: 'Invalid parameters' }
          }
        },
        {
          id: 'endpoint-4',
          name: 'Create Product',
          path: '/api/products',
          method: 'POST',
          description: 'Create a new product',
          category: 'Products',
          parameters: [
            { name: 'name', type: 'string', required: true, description: 'Product name' },
            { name: 'description', type: 'string', required: false, description: 'Product description' },
            { name: 'price', type: 'number', required: true, description: 'Product price' },
            { name: 'sku', type: 'string', required: true, description: 'Stock keeping unit' },
            { name: 'category_id', type: 'string', required: false, description: 'Category ID' },
            { name: 'stock_quantity', type: 'integer', required: true, description: 'Initial stock quantity' }
          ],
          responses: {
            201: { description: 'Product created successfully' },
            400: { description: 'Invalid input data' },
            409: { description: 'SKU already exists' }
          }
        },
        {
          id: 'endpoint-5',
          name: 'Get Orders',
          path: '/api/orders',
          method: 'GET',
          description: 'Retrieve orders with filtering',
          category: 'Orders',
          parameters: [
            { name: 'page', type: 'integer', required: false, description: 'Page number' },
            { name: 'limit', type: 'integer', required: false, description: 'Items per page' },
            { name: 'user_id', type: 'string', required: false, description: 'Filter by user' },
            { name: 'status', type: 'string', required: false, description: 'Filter by status' },
            { name: 'date_from', type: 'string', required: false, description: 'Start date' },
            { name: 'date_to', type: 'string', required: false, description: 'End date' }
          ],
          responses: {
            200: { description: 'Orders retrieved successfully' },
            400: { description: 'Invalid parameters' },
            401: { description: 'Unauthorized' }
          }
        },
        {
          id: 'endpoint-6',
          name: 'Create Order',
          path: '/api/orders',
          method: 'POST',
          description: 'Create a new order',
          category: 'Orders',
          parameters: [
            { name: 'user_id', type: 'string', required: true, description: 'User ID' },
            { name: 'items', type: 'array', required: true, description: 'Order items' },
            { name: 'shipping_address', type: 'object', required: true, description: 'Shipping address' },
            { name: 'billing_address', type: 'object', required: false, description: 'Billing address' }
          ],
          responses: {
            201: { description: 'Order created successfully' },
            400: { description: 'Invalid input data' },
            401: { description: 'Unauthorized' },
            422: { description: 'Validation error' }
          }
        }
      ]
    },
    'project-2': {
      entities: [
        {
          id: 'entity-1',
          name: 'users',
          type: 'table',
          position: { x: 100, y: 100 },
          fields: [
            { id: 1, name: 'id', type: 'int', primaryKey: true, nullable: false, unique: true, defaultValue: 'AUTO_INCREMENT' },
            { id: 2, name: 'username', type: 'varchar(50)', primaryKey: false, nullable: false, unique: true, defaultValue: '' },
            { id: 3, name: 'email', type: 'varchar(100)', primaryKey: false, nullable: false, unique: true, defaultValue: '' },
            { id: 4, name: 'role', type: 'enum("admin","editor","author","viewer")', primaryKey: false, nullable: false, unique: false, defaultValue: 'viewer' },
            { id: 5, name: 'created_at', type: 'timestamp', primaryKey: false, nullable: false, unique: false, defaultValue: 'CURRENT_TIMESTAMP' }
          ],
          relationships: [],
          indexes: [
            { id: 1, name: 'idx_users_username', fields: ['username'], type: 'btree', unique: true },
            { id: 2, name: 'idx_users_email', fields: ['email'], type: 'btree', unique: true }
          ]
        },
        {
          id: 'entity-2',
          name: 'articles',
          type: 'table',
          position: { x: 400, y: 100 },
          fields: [
            { id: 1, name: 'id', type: 'int', primaryKey: true, nullable: false, unique: true, defaultValue: 'AUTO_INCREMENT' },
            { id: 2, name: 'title', type: 'varchar(255)', primaryKey: false, nullable: false, unique: false, defaultValue: '' },
            { id: 3, name: 'content', type: 'longtext', primaryKey: false, nullable: false, unique: false, defaultValue: '' },
            { id: 4, name: 'author_id', type: 'int', primaryKey: false, nullable: false, unique: false, defaultValue: '' },
            { id: 5, name: 'category_id', type: 'int', primaryKey: false, nullable: true, unique: false, defaultValue: '' },
            { id: 6, name: 'status', type: 'enum("draft","published","archived")', primaryKey: false, nullable: false, unique: false, defaultValue: 'draft' },
            { id: 7, name: 'published_at', type: 'timestamp', primaryKey: false, nullable: true, unique: false, defaultValue: '' },
            { id: 8, name: 'created_at', type: 'timestamp', primaryKey: false, nullable: false, unique: false, defaultValue: 'CURRENT_TIMESTAMP' }
          ],
          relationships: [
            { id: 1, name: 'article_author', type: 'many-to-one', targetEntity: 'users', sourceField: 'author_id', targetField: 'id', onDelete: 'CASCADE', onUpdate: 'CASCADE' },
            { id: 2, name: 'article_category', type: 'many-to-one', targetEntity: 'categories', sourceField: 'category_id', targetField: 'id', onDelete: 'SET NULL', onUpdate: 'CASCADE' }
          ],
          indexes: [
            { id: 1, name: 'idx_articles_author', fields: ['author_id'], type: 'btree', unique: false },
            { id: 2, name: 'idx_articles_category', fields: ['category_id'], type: 'btree', unique: false },
            { id: 3, name: 'idx_articles_status', fields: ['status'], type: 'btree', unique: false }
          ]
        },
        {
          id: 'entity-3',
          name: 'categories',
          type: 'table',
          position: { x: 400, y: 350 },
          fields: [
            { id: 1, name: 'id', type: 'int', primaryKey: true, nullable: false, unique: true, defaultValue: 'AUTO_INCREMENT' },
            { id: 2, name: 'name', type: 'varchar(100)', primaryKey: false, nullable: false, unique: false, defaultValue: '' },
            { id: 3, name: 'slug', type: 'varchar(100)', primaryKey: false, nullable: false, unique: true, defaultValue: '' },
            { id: 4, name: 'description', type: 'text', primaryKey: false, nullable: true, unique: false, defaultValue: '' }
          ],
          relationships: [],
          indexes: [
            { id: 1, name: 'idx_categories_slug', fields: ['slug'], type: 'btree', unique: true }
          ]
        }
      ],
      connections: [
        {
          id: 'conn-1',
          sourceEntityId: 'entity-2',
          targetEntityId: 'entity-1',
          sourceField: 'author_id',
          targetField: 'id',
          type: 'many-to-one',
          label: 'written by',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
          isRequired: true,
          lineStyle: 'solid'
        },
        {
          id: 'conn-2',
          sourceEntityId: 'entity-2',
          targetEntityId: 'entity-3',
          sourceField: 'category_id',
          targetField: 'id',
          type: 'many-to-one',
          label: 'categorized as',
          onDelete: 'SET NULL',
          onUpdate: 'CASCADE',
          isRequired: false,
          lineStyle: 'solid'
        }
      ],
      endpoints: [
        {
          id: 'endpoint-1',
          name: 'Get Users',
          path: '/api/users',
          method: 'GET',
          description: 'Retrieve users with role-based filtering',
          category: 'Authentication',
          parameters: [
            { name: 'page', type: 'integer', required: false, description: 'Page number' },
            { name: 'limit', type: 'integer', required: false, description: 'Items per page' },
            { name: 'role', type: 'string', required: false, description: 'Filter by user role' },
            { name: 'search', type: 'string', required: false, description: 'Search term' }
          ],
          responses: {
            200: { description: 'Users retrieved successfully' },
            400: { description: 'Invalid parameters' },
            401: { description: 'Unauthorized' }
          }
        },
        {
          id: 'endpoint-2',
          name: 'Create User',
          path: '/api/users',
          method: 'POST',
          description: 'Create a new user account',
          category: 'Authentication',
          parameters: [
            { name: 'username', type: 'string', required: true, description: 'Username' },
            { name: 'email', type: 'string', required: true, description: 'Email address' },
            { name: 'role', type: 'string', required: true, description: 'User role' }
          ],
          responses: {
            201: { description: 'User created successfully' },
            400: { description: 'Invalid input data' },
            409: { description: 'User already exists' }
          }
        },
        {
          id: 'endpoint-3',
          name: 'Get Articles',
          path: '/api/articles',
          method: 'GET',
          description: 'Retrieve articles with filtering',
          category: 'Content',
          parameters: [
            { name: 'page', type: 'integer', required: false, description: 'Page number' },
            { name: 'limit', type: 'integer', required: false, description: 'Items per page' },
            { name: 'author_id', type: 'integer', required: false, description: 'Filter by author' },
            { name: 'category_id', type: 'integer', required: false, description: 'Filter by category' },
            { name: 'status', type: 'string', required: false, description: 'Filter by status' },
            { name: 'search', type: 'string', required: false, description: 'Search term' }
          ],
          responses: {
            200: { description: 'Articles retrieved successfully' },
            400: { description: 'Invalid parameters' }
          }
        },
        {
          id: 'endpoint-4',
          name: 'Create Article',
          path: '/api/articles',
          method: 'POST',
          description: 'Create a new article',
          category: 'Content',
          parameters: [
            { name: 'title', type: 'string', required: true, description: 'Article title' },
            { name: 'content', type: 'string', required: true, description: 'Article content' },
            { name: 'author_id', type: 'integer', required: true, description: 'Author ID' },
            { name: 'category_id', type: 'integer', required: false, description: 'Category ID' },
            { name: 'status', type: 'string', required: true, description: 'Article status' }
          ],
          responses: {
            201: { description: 'Article created successfully' },
            400: { description: 'Invalid input data' },
            401: { description: 'Unauthorized' }
          }
        },
        {
          id: 'endpoint-5',
          name: 'Get Categories',
          path: '/api/categories',
          method: 'GET',
          description: 'Retrieve all categories',
          category: 'Content',
          parameters: [],
          responses: {
            200: { description: 'Categories retrieved successfully' }
          }
        }
      ]
    },
    'project-3': {
      entities: [
        {
          id: 'entity-1',
          name: 'teams',
          type: 'table',
          position: { x: 100, y: 100 },
          fields: [
            { id: 1, name: 'id', type: 'uuid', primaryKey: true, nullable: false, unique: true, defaultValue: 'gen_random_uuid()' },
            { id: 2, name: 'name', type: 'varchar(100)', primaryKey: false, nullable: false, unique: false, defaultValue: '' },
            { id: 3, name: 'description', type: 'text', primaryKey: false, nullable: true, unique: false, defaultValue: '' },
            { id: 4, name: 'created_at', type: 'timestamp', primaryKey: false, nullable: false, unique: false, defaultValue: 'CURRENT_TIMESTAMP' }
          ],
          relationships: [],
          indexes: []
        },
        {
          id: 'entity-2',
          name: 'projects',
          type: 'table',
          position: { x: 400, y: 100 },
          fields: [
            { id: 1, name: 'id', type: 'uuid', primaryKey: true, nullable: false, unique: true, defaultValue: 'gen_random_uuid()' },
            { id: 2, name: 'name', type: 'varchar(255)', primaryKey: false, nullable: false, unique: false, defaultValue: '' },
            { id: 3, name: 'description', type: 'text', primaryKey: false, nullable: true, unique: false, defaultValue: '' },
            { id: 4, name: 'team_id', type: 'uuid', primaryKey: false, nullable: false, unique: false, defaultValue: '' },
            { id: 5, name: 'status', type: 'enum("planning","active","completed","on-hold")', primaryKey: false, nullable: false, unique: false, defaultValue: 'planning' },
            { id: 6, name: 'start_date', type: 'date', primaryKey: false, nullable: true, unique: false, defaultValue: '' },
            { id: 7, name: 'end_date', type: 'date', primaryKey: false, nullable: true, unique: false, defaultValue: '' },
            { id: 8, name: 'created_at', type: 'timestamp', primaryKey: false, nullable: false, unique: false, defaultValue: 'CURRENT_TIMESTAMP' }
          ],
          relationships: [
            { id: 1, name: 'project_team', type: 'many-to-one', targetEntity: 'teams', sourceField: 'team_id', targetField: 'id', onDelete: 'CASCADE', onUpdate: 'CASCADE' }
          ],
          indexes: [
            { id: 1, name: 'idx_projects_team', fields: ['team_id'], type: 'btree', unique: false },
            { id: 2, name: 'idx_projects_status', fields: ['status'], type: 'btree', unique: false }
          ]
        },
        {
          id: 'entity-3',
          name: 'tasks',
          type: 'table',
          position: { x: 700, y: 100 },
          fields: [
            { id: 1, name: 'id', type: 'uuid', primaryKey: true, nullable: false, unique: true, defaultValue: 'gen_random_uuid()' },
            { id: 2, name: 'title', type: 'varchar(255)', primaryKey: false, nullable: false, unique: false, defaultValue: '' },
            { id: 3, name: 'description', type: 'text', primaryKey: false, nullable: true, unique: false, defaultValue: '' },
            { id: 4, name: 'project_id', type: 'uuid', primaryKey: false, nullable: false, unique: false, defaultValue: '' },
            { id: 5, name: 'assigned_to', type: 'uuid', primaryKey: false, nullable: true, unique: false, defaultValue: '' },
            { id: 6, name: 'status', type: 'enum("todo","in-progress","review","done")', primaryKey: false, nullable: false, unique: false, defaultValue: 'todo' },
            { id: 7, name: 'priority', type: 'enum("low","medium","high","urgent")', primaryKey: false, nullable: false, unique: false, defaultValue: 'medium' },
            { id: 8, name: 'due_date', type: 'date', primaryKey: false, nullable: true, unique: false, defaultValue: '' },
            { id: 9, name: 'created_at', type: 'timestamp', primaryKey: false, nullable: false, unique: false, defaultValue: 'CURRENT_TIMESTAMP' }
          ],
          relationships: [
            { id: 1, name: 'task_project', type: 'many-to-one', targetEntity: 'projects', sourceField: 'project_id', targetField: 'id', onDelete: 'CASCADE', onUpdate: 'CASCADE' }
          ],
          indexes: [
            { id: 1, name: 'idx_tasks_project', fields: ['project_id'], type: 'btree', unique: false },
            { id: 2, name: 'idx_tasks_status', fields: ['status'], type: 'btree', unique: false },
            { id: 3, name: 'idx_tasks_priority', fields: ['priority'], type: 'btree', unique: false }
          ]
        }
      ],
      connections: [
        {
          id: 'conn-1',
          sourceEntityId: 'entity-2',
          targetEntityId: 'entity-1',
          sourceField: 'team_id',
          targetField: 'id',
          type: 'many-to-one',
          label: 'managed by',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
          isRequired: true,
          lineStyle: 'solid'
        },
        {
          id: 'conn-2',
          sourceEntityId: 'entity-3',
          targetEntityId: 'entity-2',
          sourceField: 'project_id',
          targetField: 'id',
          type: 'many-to-one',
          label: 'belongs to',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
          isRequired: true,
          lineStyle: 'solid'
        }
      ],
      endpoints: [
        {
          id: 'endpoint-1',
          name: 'Get Teams',
          path: '/api/teams',
          method: 'GET',
          description: 'Retrieve all teams',
          category: 'Teams',
          parameters: [
            { name: 'page', type: 'integer', required: false, description: 'Page number' },
            { name: 'limit', type: 'integer', required: false, description: 'Items per page' }
          ],
          responses: {
            200: { description: 'Teams retrieved successfully' }
          }
        },
        {
          id: 'endpoint-2',
          name: 'Create Team',
          path: '/api/teams',
          method: 'POST',
          description: 'Create a new team',
          category: 'Teams',
          parameters: [
            { name: 'name', type: 'string', required: true, description: 'Team name' },
            { name: 'description', type: 'string', required: false, description: 'Team description' }
          ],
          responses: {
            201: { description: 'Team created successfully' },
            400: { description: 'Invalid input data' }
          }
        },
        {
          id: 'endpoint-3',
          name: 'Get Projects',
          path: '/api/projects',
          method: 'GET',
          description: 'Retrieve projects with filtering',
          category: 'Projects',
          parameters: [
            { name: 'page', type: 'integer', required: false, description: 'Page number' },
            { name: 'limit', type: 'integer', required: false, description: 'Items per page' },
            { name: 'team_id', type: 'string', required: false, description: 'Filter by team' },
            { name: 'status', type: 'string', required: false, description: 'Filter by status' },
            { name: 'search', type: 'string', required: false, description: 'Search term' }
          ],
          responses: {
            200: { description: 'Projects retrieved successfully' },
            400: { description: 'Invalid parameters' }
          }
        },
        {
          id: 'endpoint-4',
          name: 'Create Project',
          path: '/api/projects',
          method: 'POST',
          description: 'Create a new project',
          category: 'Projects',
          parameters: [
            { name: 'name', type: 'string', required: true, description: 'Project name' },
            { name: 'description', type: 'string', required: false, description: 'Project description' },
            { name: 'team_id', type: 'string', required: true, description: 'Team ID' },
            { name: 'status', type: 'string', required: true, description: 'Project status' },
            { name: 'start_date', type: 'string', required: false, description: 'Start date' },
            { name: 'end_date', type: 'string', required: false, description: 'End date' }
          ],
          responses: {
            201: { description: 'Project created successfully' },
            400: { description: 'Invalid input data' }
          }
        },
        {
          id: 'endpoint-5',
          name: 'Get Tasks',
          path: '/api/tasks',
          method: 'GET',
          description: 'Retrieve tasks with filtering',
          category: 'Tasks',
          parameters: [
            { name: 'page', type: 'integer', required: false, description: 'Page number' },
            { name: 'limit', type: 'integer', required: false, description: 'Items per page' },
            { name: 'project_id', type: 'string', required: false, description: 'Filter by project' },
            { name: 'assigned_to', type: 'string', required: false, description: 'Filter by assignee' },
            { name: 'status', type: 'string', required: false, description: 'Filter by status' },
            { name: 'priority', type: 'string', required: false, description: 'Filter by priority' }
          ],
          responses: {
            200: { description: 'Tasks retrieved successfully' },
            400: { description: 'Invalid parameters' }
          }
        },
        {
          id: 'endpoint-6',
          name: 'Create Task',
          path: '/api/tasks',
          method: 'POST',
          description: 'Create a new task',
          category: 'Tasks',
          parameters: [
            { name: 'title', type: 'string', required: true, description: 'Task title' },
            { name: 'description', type: 'string', required: false, description: 'Task description' },
            { name: 'project_id', type: 'string', required: true, description: 'Project ID' },
            { name: 'assigned_to', type: 'string', required: false, description: 'Assignee ID' },
            { name: 'status', type: 'string', required: true, description: 'Task status' },
            { name: 'priority', type: 'string', required: true, description: 'Task priority' },
            { name: 'due_date', type: 'string', required: false, description: 'Due date' }
          ],
          responses: {
            201: { description: 'Task created successfully' },
            400: { description: 'Invalid input data' }
          }
        }
      ]
    },
    'project-4': {
      entities: [
        {
          id: 'entity-1',
          name: 'warehouses',
          type: 'table',
          position: { x: 100, y: 100 },
          fields: [
            { id: 1, name: 'id', type: 'int', primaryKey: true, nullable: false, unique: true, defaultValue: 'AUTO_INCREMENT' },
            { id: 2, name: 'name', type: 'varchar(100)', primaryKey: false, nullable: false, unique: false, defaultValue: '' },
            { id: 3, name: 'location', type: 'varchar(255)', primaryKey: false, nullable: false, unique: false, defaultValue: '' },
            { id: 4, name: 'capacity', type: 'int', primaryKey: false, nullable: true, unique: false, defaultValue: '' }
          ],
          relationships: [],
          indexes: []
        },
        {
          id: 'entity-2',
          name: 'inventory_items',
          type: 'table',
          position: { x: 400, y: 100 },
          fields: [
            { id: 1, name: 'id', type: 'int', primaryKey: true, nullable: false, unique: true, defaultValue: 'AUTO_INCREMENT' },
            { id: 2, name: 'name', type: 'varchar(255)', primaryKey: false, nullable: false, unique: false, defaultValue: '' },
            { id: 3, name: 'sku', type: 'varchar(100)', primaryKey: false, nullable: false, unique: true, defaultValue: '' },
            { id: 4, name: 'warehouse_id', type: 'int', primaryKey: false, nullable: false, unique: false, defaultValue: '' },
            { id: 5, name: 'quantity', type: 'int', primaryKey: false, nullable: false, unique: false, defaultValue: '0' },
            { id: 6, name: 'reorder_level', type: 'int', primaryKey: false, nullable: false, unique: false, defaultValue: '10' }
          ],
          relationships: [
            { id: 1, name: 'item_warehouse', type: 'many-to-one', targetEntity: 'warehouses', sourceField: 'warehouse_id', targetField: 'id', onDelete: 'CASCADE', onUpdate: 'CASCADE' }
          ],
          indexes: [
            { id: 1, name: 'idx_inventory_sku', fields: ['sku'], type: 'btree', unique: true },
            { id: 2, name: 'idx_inventory_warehouse', fields: ['warehouse_id'], type: 'btree', unique: false }
          ]
        }
      ],
      connections: [
        {
          id: 'conn-1',
          sourceEntityId: 'entity-2',
          targetEntityId: 'entity-1',
          sourceField: 'warehouse_id',
          targetField: 'id',
          type: 'many-to-one',
          label: 'stored in',
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
          isRequired: true,
          lineStyle: 'solid'
        }
      ],
      endpoints: [
        {
          id: 'endpoint-1',
          name: 'Get Warehouses',
          path: '/api/warehouses',
          method: 'GET',
          description: 'Retrieve all warehouses',
          category: 'Warehouses',
          parameters: [
            { name: 'page', type: 'integer', required: false, description: 'Page number' },
            { name: 'limit', type: 'integer', required: false, description: 'Items per page' }
          ],
          responses: {
            200: { description: 'Warehouses retrieved successfully' }
          }
        },
        {
          id: 'endpoint-2',
          name: 'Create Warehouse',
          path: '/api/warehouses',
          method: 'POST',
          description: 'Create a new warehouse',
          category: 'Warehouses',
          parameters: [
            { name: 'name', type: 'string', required: true, description: 'Warehouse name' },
            { name: 'location', type: 'string', required: true, description: 'Warehouse location' },
            { name: 'capacity', type: 'integer', required: false, description: 'Warehouse capacity' }
          ],
          responses: {
            201: { description: 'Warehouse created successfully' },
            400: { description: 'Invalid input data' }
          }
        },
        {
          id: 'endpoint-3',
          name: 'Get Inventory Items',
          path: '/api/inventory-items',
          method: 'GET',
          description: 'Retrieve inventory items with filtering',
          category: 'Inventory',
          parameters: [
            { name: 'page', type: 'integer', required: false, description: 'Page number' },
            { name: 'limit', type: 'integer', required: false, description: 'Items per page' },
            { name: 'warehouse_id', type: 'integer', required: false, description: 'Filter by warehouse' },
            { name: 'search', type: 'string', required: false, description: 'Search term' },
            { name: 'low_stock', type: 'boolean', required: false, description: 'Filter low stock items' }
          ],
          responses: {
            200: { description: 'Inventory items retrieved successfully' },
            400: { description: 'Invalid parameters' }
          }
        },
        {
          id: 'endpoint-4',
          name: 'Create Inventory Item',
          path: '/api/inventory-items',
          method: 'POST',
          description: 'Create a new inventory item',
          category: 'Inventory',
          parameters: [
            { name: 'name', type: 'string', required: true, description: 'Item name' },
            { name: 'sku', type: 'string', required: true, description: 'Stock keeping unit' },
            { name: 'warehouse_id', type: 'integer', required: true, description: 'Warehouse ID' },
            { name: 'quantity', type: 'integer', required: true, description: 'Initial quantity' },
            { name: 'reorder_level', type: 'integer', required: true, description: 'Reorder level' }
          ],
          responses: {
            201: { description: 'Inventory item created successfully' },
            400: { description: 'Invalid input data' },
            409: { description: 'SKU already exists' }
          }
        },
        {
          id: 'endpoint-5',
          name: 'Update Stock',
          path: '/api/inventory-items/{id}/stock',
          method: 'PATCH',
          description: 'Update item stock quantity',
          category: 'Inventory',
          parameters: [
            { name: 'id', type: 'integer', required: true, description: 'Item ID' },
            { name: 'quantity', type: 'integer', required: true, description: 'New quantity' },
            { name: 'operation', type: 'string', required: true, description: 'add, subtract, or set' }
          ],
          responses: {
            200: { description: 'Stock updated successfully' },
            400: { description: 'Invalid input data' },
            404: { description: 'Item not found' }
          }
        }
      ]
    }
  };

  // Initialize with first project
  useEffect(() => {
    if (projects.length > 0 && !currentProject) {
      setCurrentProject(projects[0]);
    }
  }, [projects, currentProject]);

  const getCurrentProjectSchema = useCallback(() => {
    if (!currentProject) return { entities: [], connections: [] };
    return mockSchemas[currentProject.id] || { entities: [], connections: [] };
  }, [currentProject]);

  const getCurrentProjectEndpoints = useCallback(() => {
    if (!currentProject) return [];
    const schema = mockSchemas[currentProject.id];
    return schema?.endpoints || [];
  }, [currentProject]);

  const updateProjectSchema = useCallback((entities, connections) => {
    if (!currentProject) return;
    
    setProjects(prev => prev.map(project => 
      project.id === currentProject.id 
        ? { ...project, schema: { entities, connections } }
        : project
    ));
  }, [currentProject]);

  const updateProjectWorkflow = useCallback((nodes, connections) => {
    if (!currentProject) return;
    
    setProjects(prev => prev.map(project => 
      project.id === currentProject.id 
        ? { 
            ...project, 
            workflow: { 
              nodes: nodes || [], 
              connections: connections || [] 
            } 
          }
        : project
    ));
  }, [currentProject]);

  const createProject = useCallback((projectData) => {
    const newProject = {
      id: `project-${Date.now()}`,
      ...projectData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      collaborators: 1,
      status: 'draft',
      workflow: {
        nodes: [],
        connections: []
      }
    };
    setProjects(prev => [...prev, newProject]);
    return newProject;
  }, []);

  const deleteProject = useCallback((projectId) => {
    setProjects(prev => prev.filter(project => project.id !== projectId));
    if (currentProject?.id === projectId) {
      setCurrentProject(projects[0] || null);
    }
  }, [currentProject, projects]);

  const updateProject = useCallback((projectId, updates) => {
    const updatedProject = {
      ...projects.find(p => p.id === projectId),
      ...updates,
      updatedAt: new Date().toISOString()
    };

    setProjects(prev => prev.map(p => 
      p.id === projectId ? updatedProject : p
    ));

    if (currentProject?.id === projectId) {
      setCurrentProject(updatedProject);
    }

    return updatedProject;
  }, [projects, currentProject]);

  const value = {
    currentProject,
    setCurrentProject,
    projects,
    getCurrentProjectSchema,
    getCurrentProjectEndpoints,
    updateProjectSchema,
    updateProjectWorkflow,
    createProject,
    deleteProject,
    updateProject
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
}; 