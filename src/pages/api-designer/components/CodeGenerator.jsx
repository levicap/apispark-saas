import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const CodeGenerator = ({ isOpen, onClose, nodes = [], currentProject }) => {
  const [selectedFramework, setSelectedFramework] = useState('express');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [generationProgress, setGenerationProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedFiles, setGeneratedFiles] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [activeFile, setActiveFile] = useState('');
  const [theme, setTheme] = useState('vs-dark');

  const frameworks = {
    express: {
      name: 'Express.js',
      languages: ['javascript', 'typescript'],
      icon: 'Code'
    },
    fastapi: {
      name: 'FastAPI',
      languages: ['python'],
      icon: 'Zap'
    },
    nestjs: {
      name: 'NestJS',
      languages: ['typescript'],
      icon: 'Server'
    },
    spring: {
      name: 'Spring Boot',
      languages: ['java'],
      icon: 'Leaf'
    },
    graphql: {
      name: 'GraphQL',
      languages: ['javascript', 'typescript'],
      icon: 'Braces'
    }
  };

  const languages = {
    javascript: { name: 'JavaScript', extension: '.js' },
    typescript: { name: 'TypeScript', extension: '.ts' },
    python: { name: 'Python', extension: '.py' },
    java: { name: 'Java', extension: '.java' }
  };

  const themes = [
    { value: 'vs-dark', label: 'Dark' },
    { value: 'light', label: 'Light' },
    { value: 'hc-black', label: 'High Contrast' }
  ];

  const generateCode = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);
    setGeneratedFiles([]);

    // Simulate code generation progress
    const steps = [
      'Analyzing API structure...',
      'Generating models...',
      'Creating routes...',
      'Adding middleware...',
      'Generating documentation...',
      'Creating configuration files...',
      'Finalizing project structure...'
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setGenerationProgress(((i + 1) / steps.length) * 100);
    }

    // Generate mock files based on nodes
    const files = generateMockFiles();
    setGeneratedFiles(files);
    setActiveFile(files[0]?.name || '');
    setIsGenerating(false);
  };

  const generateMockFiles = () => {
    const files = [];
    const projectName = currentProject?.name?.toLowerCase().replace(/\s+/g, '-') || 'api-project';
    
    // Main application file
    if (selectedFramework === 'express') {
      files.push({
        name: 'app.js',
        path: `/${projectName}/app.js`,
        content: generateExpressApp(),
        type: 'file'
      });
      
      files.push({
        name: 'package.json',
        path: `/${projectName}/package.json`,
        content: generatePackageJson(),
        type: 'file'
      });
    } else if (selectedFramework === 'fastapi') {
      files.push({
        name: 'main.py',
        path: `/${projectName}/main.py`,
        content: generateFastAPIApp(),
        type: 'file'
      });
      
      files.push({
        name: 'requirements.txt',
        path: `/${projectName}/requirements.txt`,
        content: generateRequirementsTxt(),
        type: 'file'
      });
    } else if (selectedFramework === 'graphql') {
      files.push({
        name: 'schema.js',
        path: `/${projectName}/schema.js`,
        content: generateGraphQLSchema(),
        type: 'file'
      });
      
      files.push({
        name: 'resolvers.js',
        path: `/${projectName}/resolvers.js`,
        content: generateGraphQLResolvers(),
        type: 'file'
      });
    }

    // Generate route files based on nodes
    const httpNodes = nodes.filter(node => 
      ['get', 'post', 'put', 'patch', 'delete'].includes(node.type)
    );

    if (httpNodes.length > 0) {
      files.push({
        name: 'routes.js',
        path: `/${projectName}/routes.js`,
        content: generateRoutes(httpNodes),
        type: 'file'
      });
    }

    // Generate middleware files
    const middlewareNodes = nodes.filter(node => 
      ['jwt', 'ratelimit', 'logging', 'validation', 'cors'].includes(node.type)
    );

    if (middlewareNodes.length > 0) {
      files.push({
        name: 'middleware.js',
        path: `/${projectName}/middleware.js`,
        content: generateMiddleware(middlewareNodes),
        type: 'file'
      });
    }

    // Generate models based on database nodes
    const databaseNodes = nodes.filter(node => node.type === 'table');
    
    if (databaseNodes.length > 0) {
      files.push({
        name: 'models.js',
        path: `/${projectName}/models.js`,
        content: generateModels(databaseNodes),
        type: 'file'
      });
    }

    // Generate README
    files.push({
      name: 'README.md',
      path: `/${projectName}/README.md`,
      content: generateReadme(),
      type: 'file'
    });

    return files;
  };

  const generateExpressApp = () => {
    return `const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/api', require('./routes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});

module.exports = app;`;
  };

  const generatePackageJson = () => {
    return `{
  "name": "${currentProject?.name?.toLowerCase().replace(/\s+/g, '-') || 'api-project'}",
  "version": "${currentProject?.metadata?.version || '1.0.0'}",
  "description": "${currentProject?.description || 'Generated API project'}",
  "main": "app.js",
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "express-rate-limit": "^6.7.0",
    "jsonwebtoken": "^9.0.0",
    "bcryptjs": "^2.4.3",
    "pg": "^8.11.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.22",
    "jest": "^29.5.0"
  },
  "keywords": ["api", "express", "nodejs"],
  "author": "APIForge",
  "license": "MIT"
}`;
  };

  const generateFastAPIApp = () => {
    return `from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from pydantic import BaseModel
from typing import List, Optional
import uvicorn

app = FastAPI(
    title="${currentProject?.name || 'API Project'}",
    description="${currentProject?.description || 'Generated API project'}",
    version="${currentProject?.metadata?.version || '1.0.0'}"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Models
class User(BaseModel):
    id: Optional[int] = None
    name: str
    email: str

# Routes
@app.get("/api/users", response_model=List[User])
async def get_users():
    """Get all users"""
    return []

@app.post("/api/users", response_model=User)
async def create_user(user: User):
    """Create a new user"""
    return user

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)`;
  };

  const generateRequirementsTxt = () => {
    return `fastapi==0.104.1
uvicorn==0.24.0
pydantic==2.5.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
sqlalchemy==2.0.23
psycopg2-binary==2.9.9`;
  };

  const generateGraphQLSchema = () => {
    return `const { gql } = require('apollo-server-express');

const typeDefs = gql\`
  type User {
    id: ID!
    name: String!
    email: String!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
  }

  input CreateUserInput {
    name: String!
    email: String!
  }

  type Mutation {
    createUser(input: CreateUserInput!): User!
    updateUser(id: ID!, input: CreateUserInput!): User!
    deleteUser(id: ID!): Boolean!
  }
\`;

module.exports = typeDefs;`;
  };

  const generateGraphQLResolvers = () => {
    return `const resolvers = {
  Query: {
    users: async () => {
      // Implementation for getting all users
      return [];
    },
    user: async (_, { id }) => {
      // Implementation for getting user by ID
      return null;
    }
  },
  
  Mutation: {
    createUser: async (_, { input }) => {
      // Implementation for creating user
      return {
        id: Date.now().toString(),
        ...input,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    },
    
    updateUser: async (_, { id, input }) => {
      // Implementation for updating user
      return {
        id,
        ...input,
        updatedAt: new Date().toISOString()
      };
    },
    
    deleteUser: async (_, { id }) => {
      // Implementation for deleting user
      return true;
    }
  }
};

module.exports = resolvers;`;
  };

  const generateRoutes = (httpNodes) => {
    let routes = `const express = require('express');
const router = express.Router();

`;

    httpNodes.forEach(node => {
      const method = node.type.toUpperCase();
      const endpoint = node.data?.endpoint || '/';
      const description = node.data?.description || '';
      
      routes += `// ${description}
router.${node.type}('${endpoint}', async (req, res) => {
  try {
    // TODO: Implement ${method} ${endpoint}
    res.status(200).json({ message: '${method} ${endpoint} endpoint' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

`;
    });

    routes += `module.exports = router;`;
    return routes;
  };

  const generateMiddleware = (middlewareNodes) => {
    let middleware = `const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');

`;

    middlewareNodes.forEach(node => {
      if (node.type === 'jwt') {
        middleware += `// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

`;
      } else if (node.type === 'ratelimit') {
        middleware += `// Rate Limiting Middleware
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

`;
      }
    });

    middleware += `module.exports = {
  authenticateToken,
  rateLimiter
};`;
    return middleware;
  };

  const generateModels = (databaseNodes) => {
    let models = `// Database Models
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

`;

    databaseNodes.forEach(node => {
      const tableName = node.data?.endpoint || 'table';
      const className = tableName.charAt(0).toUpperCase() + tableName.slice(1);
      
      models += `class ${className} {
  static async findAll() {
    const query = 'SELECT * FROM ${tableName}';
    const result = await pool.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM ${tableName} WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async create(data) {
    const query = 'INSERT INTO ${tableName} (name, email) VALUES ($1, $2) RETURNING *';
    const result = await pool.query(query, [data.name, data.email]);
    return result.rows[0];
  }

  static async update(id, data) {
    const query = 'UPDATE ${tableName} SET name = $1, email = $2 WHERE id = $3 RETURNING *';
    const result = await pool.query(query, [data.name, data.email, id]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM ${tableName} WHERE id = $1';
    await pool.query(query, [id]);
    return true;
  }
}

`;
    });

    models += `module.exports = {
  ${databaseNodes.map(node => {
    const tableName = node.data?.endpoint || 'table';
    const className = tableName.charAt(0).toUpperCase() + tableName.slice(1);
    return className;
  }).join(',\n  ')}
};`;
    return models;
  };

  const generateReadme = () => {
    return `# ${currentProject?.name || 'API Project'}

${currentProject?.description || 'Generated API project using APIForge'}

## Features

- RESTful API endpoints
- Authentication middleware
- Rate limiting
- CORS support
- Database integration

## Installation

\`\`\`bash
npm install
\`\`\`

## Environment Variables

Create a \`.env\` file with the following variables:

\`\`\`env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/database
JWT_SECRET=your-secret-key
\`\`\`

## Running the Application

Development:
\`\`\`bash
npm run dev
\`\`\`

Production:
\`\`\`bash
npm start
\`\`\`

## API Endpoints

${nodes.filter(node => ['get', 'post', 'put', 'patch', 'delete'].includes(node.type))
  .map(node => `- \`${node.type.toUpperCase()}\` ${node.data?.endpoint || '/api/endpoint'} - ${node.data?.description || ''}`)
  .join('\n')}

## Generated by APIForge

This project was generated using APIForge - a visual API design tool.
`;
  };

  const handleDownload = () => {
    // In a real implementation, this would create and download a zip file
    console.log('Downloading generated files...');
    alert('Download functionality would create a zip file with all generated code!');
  };

  const getCurrentFileContent = () => {
    const currentFile = generatedFiles.find(file => file.name === activeFile);
    return currentFile?.content || '';
  };

  const getLanguageForFile = (fileName) => {
    if (fileName.endsWith('.js') || fileName.endsWith('.ts')) return 'javascript';
    if (fileName.endsWith('.py')) return 'python';
    if (fileName.endsWith('.java')) return 'java';
    if (fileName.endsWith('.json')) return 'json';
    if (fileName.endsWith('.md')) return 'markdown';
    return 'javascript';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background border border-border rounded-lg shadow-elevation-3 w-full max-w-7xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Generate Code</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Generate production-ready code from your API design
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              options={themes}
              className="w-32"
            />
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>

        <div className="flex h-[calc(95vh-120px)]">
          {/* Left Panel - Configuration */}
          <div className="w-80 p-6 border-r border-border flex flex-col">
            <div className="space-y-6">
              {/* Framework Selection */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Framework
                </label>
                <Select
                  value={selectedFramework}
                  onChange={(e) => setSelectedFramework(e.target.value)}
                  className="w-full"
                >
                  {Object.entries(frameworks).map(([key, framework]) => (
                    <option key={key} value={key}>
                      {framework.name}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Language Selection */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Language
                </label>
                <Select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full"
                >
                  {frameworks[selectedFramework]?.languages.map(lang => (
                    <option key={lang} value={lang}>
                      {languages[lang].name}
                    </option>
                  ))}
                </Select>
              </div>

              {/* Project Info */}
              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="font-medium text-foreground mb-2">Project Information</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Name:</span>
                    <span className="ml-2 text-foreground">{currentProject?.name}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Version:</span>
                    <span className="ml-2 text-foreground">{currentProject?.metadata?.version}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Nodes:</span>
                    <span className="ml-2 text-foreground">{nodes.length}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Type:</span>
                    <span className="ml-2 text-foreground capitalize">{currentProject?.type || 'rest'}</span>
                  </div>
                </div>
              </div>

              {/* Generate Button */}
              <Button
                onClick={generateCode}
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Icon name="Loader" size={16} className="animate-spin mr-2" />
                    Generating Code...
                  </>
                ) : (
                  <>
                    <Icon name="Code" size={16} className="mr-2" />
                    Generate Code
                  </>
                )}
              </Button>

              {/* Progress Bar */}
              {isGenerating && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="text-foreground">{Math.round(generationProgress)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${generationProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Download Button */}
              {generatedFiles.length > 0 && !isGenerating && (
                <Button
                  onClick={handleDownload}
                  variant="outline"
                  className="w-full"
                >
                  <Icon name="Download" size={16} className="mr-2" />
                  Download Project
                </Button>
              )}
            </div>
          </div>

          {/* Center Panel - File Explorer */}
          {generatedFiles.length > 0 && (
            <div className="w-64 bg-surface border-r border-border flex flex-col">
              <div className="h-8 bg-muted border-b border-border flex items-center px-3">
                <span className="text-xs font-medium text-muted-foreground">GENERATED FILES</span>
              </div>
              <div className="flex-1 p-2">
                {generatedFiles.map((file, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveFile(file.name)}
                    className={`w-full text-left px-2 py-1 text-sm rounded transition-smooth ${
                      activeFile === file.name
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon 
                      name={
                        file.name.endsWith('.js') || file.name.endsWith('.ts') ? 'FileText' :
                        file.name.endsWith('.json') ? 'Braces' :
                        file.name.endsWith('.md') ? 'FileText' :
                        file.name.endsWith('.py') ? 'FileText' :
                        file.name.endsWith('.java') ? 'FileText' : 'File'
                      } 
                      size={14} 
                      className="inline mr-2" 
                    />
                    {file.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Right Panel - Monaco Editor */}
          <div className="flex-1 flex flex-col">
            {generatedFiles.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <Icon name="Code" size={48} className="text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">
                    Configure your framework and language, then click "Generate Code" to create your project files
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="h-8 bg-surface border-b border-border flex items-center justify-between px-4">
                  <span className="text-sm font-medium text-foreground">
                    {activeFile || 'Select a file'}
                  </span>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <span>Lines: {getCurrentFileContent().split('\n').length}</span>
                    <span>•</span>
                    <span>Characters: {getCurrentFileContent().length}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <Editor
                    height="100%"
                    language={getLanguageForFile(activeFile)}
                    theme={theme}
                    value={getCurrentFileContent()}
                    options={{
                      readOnly: true,
                      minimap: { enabled: true },
                      fontSize: 14,
                      lineNumbers: 'on',
                      roundedSelection: false,
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      wordWrap: 'on',
                      folding: true,
                      lineHeight: 24,
                      fontFamily: "'Fira Code', 'Monaco', 'Menlo', monospace",
                      fontLigatures: true,
                      bracketPairColorization: { enabled: true },
                      guides: {
                        bracketPairs: true,
                        indentation: true
                      }
                    }}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeGenerator;
