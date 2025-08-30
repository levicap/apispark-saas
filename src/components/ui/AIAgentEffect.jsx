import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import Icon from '../AppIcon';

const AIAgentEffect = ({ 
  isActive, 
  onComplete, 
  projectName = 'Project',
  files = [],
  workflowNodes = [],
  currentProject = null,
  onFilesGenerated = null
}) => {
  const [currentFile, setCurrentFile] = useState(0);
  const [currentLine, setCurrentLine] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [typedContent, setTypedContent] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [status, setStatus] = useState('initializing');
  const [generatedFiles, setGeneratedFiles] = useState({});
  const [activeFile, setActiveFile] = useState('main.js');

  const generateProjectFiles = () => {
    if (files.length > 0) return files;

    const framework = currentProject?.metadata?.framework || 'Express.js';
    const language = framework === 'Express.js' ? 'javascript' : 
                    framework === 'FastAPI' ? 'python' : 
                    framework === 'Spring Boot' ? 'java' : 'javascript';

    const baseFiles = {
      'package.json': generatePackageJson(),
      'README.md': generateReadme(),
      '.env.example': generateEnvExample(),
      '.gitignore': generateGitignore()
    };

    if (language === 'javascript') {
      Object.assign(baseFiles, {
        'main.js': generateMainJS(),
        'routes/index.js': generateRoutesJS(),
        'middleware/auth.js': generateAuthMiddleware(),
        'middleware/validation.js': generateValidationMiddleware(),
        'config/database.js': generateDatabaseConfig(),
        'controllers/userController.js': generateUserController(),
        'controllers/productController.js': generateProductController(),
        'models/userModel.js': generateUserModel(),
        'models/productModel.js': generateProductModel(),
        'utils/logger.js': generateLogger(),
        'utils/response.js': generateResponseUtils()
      });
    } else if (language === 'python') {
      Object.assign(baseFiles, {
        'main.py': generateMainPython(),
        'requirements.txt': generateRequirementsTxt(),
        'app/__init__.py': generateAppInit(),
        'app/routes.py': generatePythonRoutes(),
        'app/models.py': generatePythonModels(),
        'app/config.py': generatePythonConfig()
      });
    }

    return baseFiles;
  };

  const generatePackageJson = () => {
    const gatewayNode = workflowNodes.find(n => n.type === 'api-gateway');
    const rateLimit = gatewayNode?.data?.rateLimit?.split('/')[0] || '1000';
    
    return `{
  "name": "${projectName.toLowerCase().replace(/\\s+/g, '-')}",
  "version": "1.0.0",
  "description": "Generated API for ${projectName}",
  "main": "main.js",
  "scripts": {
    "start": "node main.js",
    "dev": "nodemon main.js",
    "test": "jest",
    "lint": "eslint .",
    "build": "npm run lint && npm test"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "express-rate-limit": "^6.7.0",
    "joi": "^17.9.2",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0",
    "dotenv": "^16.0.3",
    "pg": "^8.11.3",
    "winston": "^3.11.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "jest": "^29.6.2",
    "eslint": "^8.45.0",
    "supertest": "^6.3.3"
  },
  "engines": {
    "node": ">=16.0.0"
  },
  "keywords": ["api", "express", "rest", "generated"],
  "author": "APIForge",
  "license": "MIT"
}`;
  };

  const generateMainJS = () => {
    const gatewayNode = workflowNodes.find(n => n.type === 'gateway');
    const authNode = workflowNodes.find(n => n.type === 'service' && n.name.toLowerCase().includes('auth'));
    const rateLimit = gatewayNode?.data?.rateLimit?.split('/')[0] || '1000';
    
    return `// ${projectName} - Main Application File
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const logger = require('./utils/logger');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: ${rateLimit}, // limit each IP to requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Import routes
const apiRoutes = require('./routes');

// Use routes
app.use('/api', apiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: '${projectName}',
    version: '1.0.0'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  logger.info(\`🚀 ${projectName} server running on port \${PORT}\`);
  logger.info(\`📖 API Documentation: http://localhost:\${PORT}/api/docs\`);
  logger.info(\`🏥 Health Check: http://localhost:\${PORT}/health\`);
});

module.exports = app;`;
  };

  const generateRoutesJS = () => {
    const serviceNodes = workflowNodes.filter(n => n.type === 'service');
    
    return `// ${projectName} - API Routes
const express = require('express');
const router = express.Router();

// Import controllers
${serviceNodes.map(node => `const ${node.name.toLowerCase().replace(/\s+/g, '')}Controller = require('../controllers/${node.name.toLowerCase().replace(/\s+/g, '')}Controller');`).join('\n')}

// Import middleware
const authMiddleware = require('../middleware/auth');
const validateRequest = require('../middleware/validation');

${serviceNodes.map(node => {
  const endpoints = node.data?.endpoints || [];
  return endpoints.map(endpoint => {
    const [method, path] = endpoint.split(' ');
    const controllerName = node.name.toLowerCase().replace(/\s+/g, '');
    const actionName = method.toLowerCase() + path.split('/').pop().replace(/[^a-zA-Z]/g, '');
    
    return `// ${endpoint}
router.${method.toLowerCase()}('${path}', authMiddleware, validateRequest, ${controllerName}Controller.${actionName});`;
  }).join('\n');
}).join('\n\n')}

module.exports = router;`;
  };

  const generateAuthMiddleware = () => {
    const authNode = workflowNodes.find(n => n.type === 'service' && n.name.toLowerCase().includes('auth'));
    const authMethod = authNode?.data?.method || 'JWT';
    
    return `// ${projectName} - Authentication Middleware
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    logger.info(\`User \${decoded.id} authenticated\`);
    next();
  } catch (error) {
    logger.warn('Authentication failed:', error.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;`;
  };

  const generateValidationMiddleware = () => {
    return `// ${projectName} - Validation Middleware
const Joi = require('joi');
const logger = require('../utils/logger');

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body);
    if (error) {
      logger.warn('Validation failed:', error.details);
      return res.status(400).json({ 
        error: 'Validation failed',
        details: error.details 
      });
    }
    req.validatedBody = value;
    next();
  };
};

module.exports = validateRequest;`;
  };

  const generateDatabaseConfig = () => {
    const dbType = currentProject?.databaseType || 'PostgreSQL';
    
    return `// ${projectName} - Database Configuration
const { Pool } = require('pg');
const logger = require('../utils/logger');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || '${projectName.toLowerCase().replace(/\s+/g, '_')}',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('connect', () => {
  logger.info('Connected to database');
});

pool.on('error', (err) => {
  logger.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = pool;`;
  };

  const generateUserController = () => {
    return `// ${projectName} - User Controller
const userModel = require('../models/userModel');
const logger = require('../utils/logger');
const { successResponse, errorResponse } = require('../utils/response');

const getUsers = async (req, res) => {
  try {
    const users = await userModel.findAll();
    logger.info('Retrieved users successfully');
    return successResponse(res, users, 'Users retrieved successfully');
  } catch (error) {
    logger.error('Error retrieving users:', error);
    return errorResponse(res, 'Failed to retrieve users', 500);
  }
};

const createUser = async (req, res) => {
  try {
    const user = await userModel.create(req.validatedBody);
    logger.info(\`User created: \${user.id}\`);
    return successResponse(res, user, 'User created successfully', 201);
  } catch (error) {
    logger.error('Error creating user:', error);
    return errorResponse(res, 'Failed to create user', 500);
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.update(id, req.validatedBody);
    logger.info(\`User updated: \${id}\`);
    return successResponse(res, user, 'User updated successfully');
  } catch (error) {
    logger.error('Error updating user:', error);
    return errorResponse(res, 'Failed to update user', 500);
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await userModel.delete(id);
    logger.info(\`User deleted: \${id}\`);
    return successResponse(res, null, 'User deleted successfully');
  } catch (error) {
    logger.error('Error deleting user:', error);
    return errorResponse(res, 'Failed to delete user', 500);
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser
};`;
  };

  const generateProductController = () => {
    return `// ${projectName} - Product Controller
const productModel = require('../models/productModel');
const logger = require('../utils/logger');
const { successResponse, errorResponse } = require('../utils/response');

const getProducts = async (req, res) => {
  try {
    const products = await productModel.findAll();
    logger.info('Retrieved products successfully');
    return successResponse(res, products, 'Products retrieved successfully');
  } catch (error) {
    logger.error('Error retrieving products:', error);
    return errorResponse(res, 'Failed to retrieve products', 500);
  }
};

const createProduct = async (req, res) => {
  try {
    const product = await productModel.create(req.validatedBody);
    logger.info(\`Product created: \${product.id}\`);
    return successResponse(res, product, 'Product created successfully', 201);
  } catch (error) {
    logger.error('Error creating product:', error);
    return errorResponse(res, 'Failed to create product', 500);
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.update(id, req.validatedBody);
    logger.info(\`Product updated: \${id}\`);
    return successResponse(res, product, 'Product updated successfully');
  } catch (error) {
    logger.error('Error updating product:', error);
    return errorResponse(res, 'Failed to update product', 500);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await productModel.delete(id);
    logger.info(\`Product deleted: \${id}\`);
    return successResponse(res, null, 'Product deleted successfully');
  } catch (error) {
    logger.error('Error deleting product:', error);
    return errorResponse(res, 'Failed to delete product', 500);
  }
};

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
};`;
  };

  const generateUserModel = () => {
    return `// ${projectName} - User Model
const pool = require('../config/database');

class UserModel {
  static async findAll() {
    const query = 'SELECT * FROM users ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async create(userData) {
    const { email, username, first_name, last_name, password_hash } = userData;
    const query = \`
      INSERT INTO users (email, username, first_name, last_name, password_hash, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING *
    \`;
    const result = await pool.query(query, [email, username, first_name, last_name, password_hash]);
    return result.rows[0];
  }

  static async update(id, userData) {
    const { email, username, first_name, last_name } = userData;
    const query = \`
      UPDATE users 
      SET email = $1, username = $2, first_name = $3, last_name = $4, updated_at = NOW()
      WHERE id = $5
      RETURNING *
    \`;
    const result = await pool.query(query, [email, username, first_name, last_name, id]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM users WHERE id = $1';
    await pool.query(query, [id]);
    return true;
  }
}

module.exports = UserModel;`;
  };

  const generateProductModel = () => {
    return `// ${projectName} - Product Model
const pool = require('../config/database');

class ProductModel {
  static async findAll() {
    const query = 'SELECT * FROM products ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM products WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async create(productData) {
    const { name, description, price, sku, category_id, stock_quantity } = productData;
    const query = \`
      INSERT INTO products (name, description, price, sku, category_id, stock_quantity, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING *
    \`;
    const result = await pool.query(query, [name, description, price, sku, category_id, stock_quantity]);
    return result.rows[0];
  }

  static async update(id, productData) {
    const { name, description, price, sku, category_id, stock_quantity } = productData;
    const query = \`
      UPDATE products 
      SET name = $1, description = $2, price = $3, sku = $4, category_id = $5, stock_quantity = $6, updated_at = NOW()
      WHERE id = $7
      RETURNING *
    \`;
    const result = await pool.query(query, [name, description, price, sku, category_id, stock_quantity, id]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM products WHERE id = $1';
    await pool.query(query, [id]);
    return true;
  }
}

module.exports = ProductModel;`;
  };

  const generateLogger = () => {
    return `// ${projectName} - Logger Utility
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: '${projectName.toLowerCase().replace(/\s+/g, '-')}' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = logger;`;
  };

  const generateResponseUtils = () => {
    return `// ${projectName} - Response Utility Functions

const successResponse = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

const errorResponse = (res, message = 'Error', statusCode = 500, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  successResponse,
  errorResponse
};`;
  };

  const generateEnvExample = () => {
    return `# ${projectName} Environment Variables
# Copy this file to .env and fill in your values

# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=${projectName.toLowerCase().replace(/\s+/g, '_')}
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=24h

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000

# Logging
LOG_LEVEL=info`;
  };

  const generateGitignore = () => {
    return `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# nyc test coverage
.nyc_output

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db`;
  };

  const generateReadme = () => {
    const framework = currentProject?.metadata?.framework || 'Express.js';
    const dbType = currentProject?.databaseType || 'PostgreSQL';
    
    return `# ${projectName}

This API was generated using APIForge's AI-powered code generation system.

## Features

- RESTful API endpoints
- Automatic validation
- Error handling
- Security middleware
- Database integration ready
- Rate limiting
- JWT authentication
- Comprehensive logging

## Tech Stack

- **Framework**: ${framework}
- **Database**: ${dbType}
- **Language**: ${framework === 'Express.js' ? 'JavaScript (Node.js)' : framework === 'FastAPI' ? 'Python' : 'Java'}

## Getting Started

1. Install dependencies: \`npm install\`
2. Copy \`.env.example\` to \`.env\` and configure your environment variables
3. Set up your database and run migrations
4. Start the server: \`npm start\`
5. For development: \`npm run dev\`

## API Endpoints

${workflowNodes.filter(n => n.type === 'service').map(node => {
  const endpoints = node.data?.endpoints || [];
  return endpoints.map(endpoint => `- ${endpoint} - ${node.name}`).join('\n');
}).join('\n')}

## Environment Variables

- PORT - Server port (default: 3000)
- JWT_SECRET - Secret key for JWT tokens
- DB_HOST - Database host
- DB_PORT - Database port
- DB_NAME - Database name
- DB_USER - Database user
- DB_PASSWORD - Database password

## Development

\`\`\`bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run tests
npm test

# Lint code
npm run lint
\`\`\`

## Project Structure

\`\`\`
├── main.js                 # Application entry point
├── routes/                 # API route definitions
├── controllers/            # Request handlers
├── models/                 # Database models
├── middleware/             # Custom middleware
├── config/                 # Configuration files
├── utils/                  # Utility functions
└── logs/                   # Application logs
\`\`\`

## License

Generated by APIForge`;
  };

  const generateMainPython = () => {
    return `# ${projectName} - Main Application File
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
import uvicorn
from contextlib import asynccontextmanager

# Create FastAPI app
app = FastAPI(
    title="${projectName}",
    description="Generated API for ${projectName}",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "OK",
        "service": "${projectName}",
        "version": "1.0.0"
    }

# Start server
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)`;
  };

  const generateRequirementsTxt = () => {
    return `fastapi==0.104.1
uvicorn[standard]==0.24.0
pydantic==2.5.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
sqlalchemy==2.0.23
psycopg2-binary==2.9.9
python-dotenv==1.0.0`;
  };

  const generateAppInit = () => {
    return `# ${projectName} - App Initialization
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

def create_app():
    app = FastAPI(
        title="${projectName}",
        description="Generated API for ${projectName}",
        version="1.0.0"
    )
    
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    return app`;
  };

  const generatePythonRoutes = () => {
    return `# ${projectName} - Python Routes
from fastapi import APIRouter, HTTPException
from app.models import User, Product

router = APIRouter()

@router.get("/users")
async def get_users():
    return {"message": "Get users endpoint"}

@router.post("/users")
async def create_user():
    return {"message": "Create user endpoint"}`;
  };

  const generatePythonModels = () => {
    return `# ${projectName} - Python Models
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class User(BaseModel):
    id: Optional[int] = None
    email: str
    username: str
    first_name: str
    last_name: str
    created_at: Optional[datetime] = None

class Product(BaseModel):
    id: Optional[int] = None
    name: str
    description: Optional[str] = None
    price: float
    sku: str
    created_at: Optional[datetime] = None`;
  };

  const generatePythonConfig = () => {
    return `# ${projectName} - Python Configuration
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/dbname")
    SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key")
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 30`;
  };

  const mockFiles = generateProjectFiles();

  useEffect(() => {
    if (!isActive) return;

    setStatus('initializing');
    setCurrentFile(0);
    setCurrentLine(0);
    setTypedContent('');
    setIsTyping(false);
    setGeneratedFiles(mockFiles);
    setActiveFile(Object.keys(mockFiles)[0]);

    // Pass generated files to parent component
    if (onFilesGenerated) {
      onFilesGenerated(mockFiles);
    }

    // Start the AI agent effect
    const timer = setTimeout(() => {
      setStatus('analyzing');
      setTimeout(() => {
        setStatus('generating');
        startTyping();
      }, 1000);
    }, 500);

    return () => clearTimeout(timer);
  }, [isActive, onFilesGenerated]);

  const startTyping = () => {
    const fileNames = Object.keys(mockFiles);
    if (currentFile >= fileNames.length) {
      setStatus('completed');
      onComplete?.();
      return;
    }

    const fileName = fileNames[currentFile];
    const fileContent = mockFiles[fileName];
    const lines = fileContent.split('\n');
    
    if (currentLine >= lines.length) {
      // Move to next file
      setCurrentFile(prev => prev + 1);
      setCurrentLine(0);
      setTypedContent('');
      setActiveFile(fileNames[currentFile + 1] || fileName);
      setTimeout(startTyping, 500);
      return;
    }

    const line = lines[currentLine];
    setIsTyping(true);
    
    // Simulate typing the line
    let charIndex = 0;
    const typeInterval = setInterval(() => {
      if (charIndex >= line.length) {
        clearInterval(typeInterval);
        setIsTyping(false);
        setTypedContent(prev => prev + line + '\n');
        setCurrentLine(prev => prev + 1);
        
        // Continue to next line after a short delay
        setTimeout(startTyping, 100);
        return;
      }
      
      setTypedContent(prev => prev + line[charIndex]);
      charIndex++;
    }, 30); // Typing speed
  };

  // Cursor blink effect
  useEffect(() => {
    if (!isTyping) return;
    
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    
    return () => clearInterval(interval);
  }, [isTyping]);

  if (!isActive) return null;

  const getStatusIcon = () => {
    switch (status) {
      case 'initializing':
        return <Icon name="Loader2" size={20} className="animate-spin text-blue-500" />;
      case 'analyzing':
        return <Icon name="Search" size={20} className="text-yellow-500" />;
      case 'generating':
        return <Icon name="Code" size={20} className="text-green-500" />;
      case 'completed':
        return <Icon name="CheckCircle" size={20} className="text-green-600" />;
      default:
        return <Icon name="Loader2" size={20} className="animate-spin text-blue-500" />;
    }
  };

  const getStatusText = () => {
    const fileNames = Object.keys(mockFiles);
    switch (status) {
      case 'initializing':
        return 'Initializing AI Agent...';
      case 'analyzing':
        return 'Analyzing project structure...';
      case 'generating':
        return `Generating ${fileNames[currentFile] || 'files'}...`;
      case 'completed':
        return 'Code generation completed!';
      default:
        return 'Processing...';
    }
  };

  const getProgressPercentage = () => {
    if (status === 'completed') return 100;
    if (status === 'initializing' || status === 'analyzing') return 25;
    
    const fileNames = Object.keys(mockFiles);
    const totalLines = fileNames.reduce((acc, fileName) => acc + mockFiles[fileName].split('\n').length, 0);
    const completedLines = fileNames.slice(0, currentFile).reduce((acc, fileName) => acc + mockFiles[fileName].split('\n').length, 0) + currentLine;
    
    return Math.min(25 + (completedLines / totalLines) * 75, 100);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-border px-6 py-4">
          <div className="flex items-center space-x-3">
            {getStatusIcon()}
            <div>
              <h2 className="text-xl font-semibold text-foreground">AI Code Generation</h2>
              <p className="text-muted-foreground">{getStatusText()}</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 border-b border-border">
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>Progress</span>
            <span>{Math.round(getProgressPercentage())}%</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 h-[60vh]">
            {/* File List */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Generated Files</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {Object.keys(mockFiles).map((fileName, index) => (
                  <div
                    key={fileName}
                    className={`flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200 ${
                      index === currentFile && status === 'generating'
                        ? 'border-primary bg-primary/5'
                        : index < currentFile
                        ? 'border-green-200 bg-green-50'
                        : 'border-border bg-muted/30'
                    }`}
                  >
                    <Icon 
                      name={index < currentFile ? 'CheckCircle' : index === currentFile ? 'Loader2' : 'File'} 
                      size={16} 
                      className={
                        index < currentFile 
                          ? 'text-green-600' 
                          : index === currentFile 
                          ? 'text-primary animate-spin' 
                          : 'text-muted-foreground'
                      } 
                    />
                    <span className={`font-mono text-sm ${
                      index === currentFile && status === 'generating'
                        ? 'text-primary font-medium'
                        : index < currentFile
                        ? 'text-green-700'
                        : 'text-muted-foreground'
                    }`}>
                      {fileName}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Monaco Editor */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-lg font-medium text-foreground">Code Preview</h3>
              {status === 'generating' && (
                <div className="border border-border rounded-lg overflow-hidden h-full">
                  <div className="bg-muted px-4 py-2 border-b border-border">
                    <span className="text-sm font-medium text-foreground">
                      {activeFile}
                    </span>
                  </div>
                  <div className="h-96">
                    <Editor
                      height="100%"
                      language="javascript"
                      theme="vs-dark"
                      value={typedContent}
                      options={{
                        readOnly: true,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        fontSize: 14,
                        lineNumbers: 'on',
                        wordWrap: 'on'
                      }}
                    />
                  </div>
                </div>
              )}
              
              {status === 'completed' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <Icon name="CheckCircle" size={48} className="mx-auto mb-3 text-green-600" />
                  <h4 className="text-lg font-medium text-green-800 mb-2">Generation Complete!</h4>
                  <p className="text-green-700">
                    Successfully generated {Object.keys(mockFiles).length} files for your project.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {status === 'generating' && (
                <span>Generating: {activeFile}</span>
              )}
            </div>
            
            {status === 'completed' && (
              <button
                onClick={() => onComplete?.()}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Continue
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAgentEffect; 