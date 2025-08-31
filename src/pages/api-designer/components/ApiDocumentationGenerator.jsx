import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const ApiDocumentationGenerator = ({ isOpen, onClose, nodes = [], currentProject }) => {
  const [docFormat, setDocFormat] = useState('swagger');
  const [includeExamples, setIncludeExamples] = useState(true);
  const [includeAuth, setIncludeAuth] = useState(true);
  const [generatedDocs, setGeneratedDocs] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const docFormats = [
    { value: 'swagger', label: 'OpenAPI 3.0 (Swagger)', description: 'Standard OpenAPI specification' },
    { value: 'postman', label: 'Postman Collection', description: 'Postman collection format' },
    { value: 'insomnia', label: 'Insomnia Collection', description: 'Insomnia collection format' },
    { value: 'markdown', label: 'Markdown', description: 'Human-readable documentation' },
    { value: 'html', label: 'HTML', description: 'Web-ready documentation' }
  ];

  const generateDocumentation = async () => {
    setIsGenerating(true);

    // Simulate documentation generation
    setTimeout(() => {
      const docs = generateDocsByFormat();
      setGeneratedDocs(docs);
      setIsGenerating(false);
    }, 2000);
  };

  const generateDocsByFormat = () => {
    const httpNodes = nodes.filter(node => 
      ['get', 'post', 'put', 'patch', 'delete'].includes(node.type)
    );

    switch (docFormat) {
      case 'swagger':
        return generateSwaggerDocs(httpNodes);
      case 'postman':
        return generatePostmanCollection(httpNodes);
      case 'insomnia':
        return generateInsomniaCollection(httpNodes);
      case 'markdown':
        return generateMarkdownDocs(httpNodes);
      case 'html':
        return generateHtmlDocs(httpNodes);
      default:
        return generateSwaggerDocs(httpNodes);
    }
  };

  const generateSwaggerDocs = (httpNodes) => {
    return `openapi: 3.0.0
info:
  title: ${currentProject?.name || 'API Documentation'}
  description: ${currentProject?.description || 'Generated API documentation'}
  version: ${currentProject?.metadata?.version || '1.0.0'}
  contact:
    name: API Support
    email: support@example.com

servers:
  - url: https://api.example.com/v1
    description: Production server
  - url: https://staging-api.example.com/v1
    description: Staging server

${includeAuth ? `
components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
    ApiKeyAuth:
      type: apiKey
      in: header
      name: X-API-Key
` : ''}

paths:
${httpNodes.map(node => `
  ${node.data?.endpoint || '/api/endpoint'}:
    ${node.type}:
      summary: ${node.name || `${node.type.toUpperCase()} endpoint`}
      description: ${node.data?.description || 'No description provided'}
      ${includeAuth ? `
      security:
        - BearerAuth: []
        - ApiKeyAuth: []
      ` : ''}
      ${node.type === 'post' || node.type === 'put' || node.type === 'patch' ? `
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                example:
                  type: string
                  description: Example property
            example:
              example: "example value"
      ` : ''}
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                  data:
                    type: object
                  timestamp:
                    type: string
                    format: date-time
              example:
                success: true
                data: {}
                timestamp: "2024-01-01T00:00:00Z"
        '400':
          description: Bad request
        '401':
          description: Unauthorized
        '500':
          description: Internal server error
`).join('')}`;
  };

  const generatePostmanCollection = (httpNodes) => {
    return `{
  "info": {
    "name": "${currentProject?.name || 'API Collection'}",
    "description": "${currentProject?.description || 'Generated API collection'}",
    "version": "${currentProject?.metadata?.version || '1.0.0'}"
  },
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "{{jwt_token}}",
        "type": "string"
      }
    ]
  },
  "item": [
${httpNodes.map(node => `
    {
      "name": "${node.name || `${node.type.toUpperCase()} ${node.data?.endpoint || '/api/endpoint'}`}",
      "request": {
        "method": "${node.type.toUpperCase()}",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "url": {
          "raw": "{{base_url}}${node.data?.endpoint || '/api/endpoint'}",
          "host": ["{{base_url}}"],
          "path": ["${node.data?.endpoint?.replace('/api/', '') || 'endpoint'}"]
        }${node.type === 'post' || node.type === 'put' || node.type === 'patch' ? `,
        "body": {
          "mode": "raw",
          "raw": "{\\n  \\"example\\": \\"example value\\"\\n}",
          "options": {
            "raw": {
              "language": "json"
            }
          }
        }` : ''}
      },
      "response": []
    }`).join(',')}
  ]
}`;
  };

  const generateInsomniaCollection = (httpNodes) => {
    return `{
  "_type": "export",
  "__export_format": 4,
  "__export_date": "${new Date().toISOString()}",
  "__export_source": "insomnia.desktop.app:v2023.5.8",
  "resources": [
    {
      "_id": "req_root",
      "parentId": "wrk_${currentProject?.name?.toLowerCase().replace(/\s+/g, '-') || 'api'}",
      "modified": ${Date.now()},
      "created": ${Date.now()},
      "url": "{{ _.base_url }}",
      "name": "Root",
      "description": "",
      "method": "GET",
      "body": {},
      "parameters": [],
      "headers": [],
      "authentication": {},
      "metaSortKey": -${Date.now()},
      "_type": "request"
    },
${httpNodes.map((node, index) => `
    {
      "_id": "req_${node.id || index}",
      "parentId": "wrk_${currentProject?.name?.toLowerCase().replace(/\s+/g, '-') || 'api'}",
      "modified": ${Date.now()},
      "created": ${Date.now()},
      "url": "{{ _.base_url }}${node.data?.endpoint || '/api/endpoint'}",
      "name": "${node.name || `${node.type.toUpperCase()} ${node.data?.endpoint || '/api/endpoint'}`}",
      "description": "${node.data?.description || 'No description provided'}",
      "method": "${node.type.toUpperCase()}",
      "body": ${node.type === 'post' || node.type === 'put' || node.type === 'patch' ? `{
        "mimeType": "application/json",
        "text": "{\\n  \\"example\\": \\"example value\\"\\n}"
      }` : '{}'},
      "parameters": [],
      "headers": [
        {
          "name": "Content-Type",
          "value": "application/json"
        }
      ],
      "authentication": {
        "type": "bearer",
        "token": "{{ _.jwt_token }}"
      },
      "metaSortKey": -${Date.now() - index},
      "_type": "request"
    }`).join(',')}
  ]
}`;
  };

  const generateMarkdownDocs = (httpNodes) => {
    return `# ${currentProject?.name || 'API Documentation'}

${currentProject?.description || 'Generated API documentation'}

## Base URL

\`\`\`
https://api.example.com/v1
\`\`\`

${includeAuth ? `
## Authentication

This API uses Bearer token authentication. Include your JWT token in the Authorization header:

\`\`\`
Authorization: Bearer <your-jwt-token>
\`\`\`

Alternatively, you can use API key authentication:

\`\`\`
X-API-Key: <your-api-key>
\`\`\`
` : ''}

## Endpoints

${httpNodes.map(node => `
### ${node.name || `${node.type.toUpperCase()} ${node.data?.endpoint || '/api/endpoint'}`}

**${node.type.toUpperCase()}** \`${node.data?.endpoint || '/api/endpoint'}\`

${node.data?.description || 'No description provided'}

${node.type === 'post' || node.type === 'put' || node.type === 'patch' ? `
#### Request Body

\`\`\`json
{
  "example": "example value"
}
\`\`\`
` : ''}

#### Response

\`\`\`json
{
  "success": true,
  "data": {},
  "timestamp": "2024-01-01T00:00:00Z"
}
\`\`\`

#### Status Codes

- \`200\` - Success
- \`400\` - Bad Request
- \`401\` - Unauthorized
- \`500\` - Internal Server Error
`).join('\n')}

## Error Responses

All error responses follow this format:

\`\`\`json
{
  "error": "Error message",
  "message": "Detailed error description"
}
\`\`\`

---

*Generated on ${new Date().toLocaleDateString()} by APIForge*
`;
  };

  const generateHtmlDocs = (httpNodes) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${currentProject?.name || 'API Documentation'}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #333; border-bottom: 2px solid #007acc; padding-bottom: 10px; }
        h2 { color: #555; margin-top: 30px; }
        h3 { color: #666; }
        .endpoint { background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 6px; padding: 20px; margin: 20px 0; }
        .method { display: inline-block; padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 12px; text-transform: uppercase; }
        .get { background: #28a745; color: white; }
        .post { background: #007bff; color: white; }
        .put { background: #ffc107; color: black; }
        .patch { background: #fd7e14; color: white; }
        .delete { background: #dc3545; color: white; }
        .url { font-family: monospace; background: #e9ecef; padding: 8px 12px; border-radius: 4px; margin: 10px 0; }
        pre { background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 4px; padding: 15px; overflow-x: auto; }
        code { font-family: 'Courier New', monospace; }
        .auth { background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 4px; padding: 15px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>${currentProject?.name || 'API Documentation'}</h1>
        <p>${currentProject?.description || 'Generated API documentation'}</p>
        
        <h2>Base URL</h2>
        <div class="url">https://api.example.com/v1</div>
        
        ${includeAuth ? `
        <div class="auth">
            <h3>Authentication</h3>
            <p>This API uses Bearer token authentication. Include your JWT token in the Authorization header:</p>
            <pre><code>Authorization: Bearer &lt;your-jwt-token&gt;</code></pre>
            <p>Alternatively, you can use API key authentication:</p>
            <pre><code>X-API-Key: &lt;your-api-key&gt;</code></pre>
        </div>
        ` : ''}
        
        <h2>Endpoints</h2>
        
        ${httpNodes.map(node => `
        <div class="endpoint">
            <h3>${node.name || `${node.type.toUpperCase()} ${node.data?.endpoint || '/api/endpoint'}`}</h3>
            <span class="method ${node.type}">${node.type.toUpperCase()}</span>
            <div class="url">${node.data?.endpoint || '/api/endpoint'}</div>
            <p>${node.data?.description || 'No description provided'}</p>
            
            ${node.type === 'post' || node.type === 'put' || node.type === 'patch' ? `
            <h4>Request Body</h4>
            <pre><code>{
  "example": "example value"
}</code></pre>
            ` : ''}
            
            <h4>Response</h4>
            <pre><code>{
  "success": true,
  "data": {},
  "timestamp": "2024-01-01T00:00:00Z"
}</code></pre>
            
            <h4>Status Codes</h4>
            <ul>
                <li><code>200</code> - Success</li>
                <li><code>400</code> - Bad Request</li>
                <li><code>401</code> - Unauthorized</li>
                <li><code>500</code> - Internal Server Error</li>
            </ul>
        </div>
        `).join('')}
        
        <h2>Error Responses</h2>
        <p>All error responses follow this format:</p>
        <pre><code>{
  "error": "Error message",
  "message": "Detailed error description"
}</code></pre>
        
        <hr>
        <p><em>Generated on ${new Date().toLocaleDateString()} by APIForge</em></p>
    </div>
</body>
</html>`;
  };

  const downloadDocs = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedDocs], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    
    let extension = 'txt';
    if (docFormat === 'swagger') extension = 'yaml';
    else if (docFormat === 'postman' || docFormat === 'insomnia') extension = 'json';
    else if (docFormat === 'markdown') extension = 'md';
    else if (docFormat === 'html') extension = 'html';
    
    element.download = `api-docs-${currentProject?.name?.toLowerCase().replace(/\s+/g, '-') || 'api'}-${Date.now()}.${extension}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background border border-border rounded-lg shadow-elevation-3 w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Generate API Documentation</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Create comprehensive documentation for {currentProject?.name}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Left Panel - Configuration */}
          <div className="w-80 p-6 border-r border-border flex flex-col">
            <div className="space-y-6">
              {/* Format Selection */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Documentation Format
                </label>
                <Select
                  value={docFormat}
                  onChange={(e) => setDocFormat(e.target.value)}
                  className="w-full"
                >
                  {docFormats.map(format => (
                    <option key={format.value} value={format.value}>
                      {format.label}
                    </option>
                  ))}
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  {docFormats.find(f => f.value === docFormat)?.description}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={includeExamples}
                    onChange={(e) => setIncludeExamples(e.target.checked)}
                    className="text-primary"
                  />
                  <span className="text-sm text-foreground">Include request/response examples</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={includeAuth}
                    onChange={(e) => setIncludeAuth(e.target.checked)}
                    className="text-primary"
                  />
                  <span className="text-sm text-foreground">Include authentication documentation</span>
                </label>
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
                    <span className="text-muted-foreground">Endpoints:</span>
                    <span className="ml-2 text-foreground">{nodes.filter(n => ['get', 'post', 'put', 'patch', 'delete'].includes(n.type)).length}</span>
                  </div>
                </div>
              </div>

              {/* Generate Button */}
              <Button
                onClick={generateDocumentation}
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Icon name="Loader" size={16} className="animate-spin mr-2" />
                    Generating Documentation...
                  </>
                ) : (
                  <>
                    <Icon name="FileText" size={16} className="mr-2" />
                    Generate Documentation
                  </>
                )}
              </Button>

              {/* Download Button */}
              {generatedDocs && (
                <Button
                  onClick={downloadDocs}
                  variant="outline"
                  className="w-full"
                >
                  <Icon name="Download" size={16} className="mr-2" />
                  Download Documentation
                </Button>
              )}
            </div>
          </div>

          {/* Right Panel - Generated Documentation */}
          <div className="flex-1 flex flex-col">
            <div className="h-8 bg-surface border-b border-border flex items-center justify-between px-4">
              <span className="text-sm font-medium text-foreground">
                Generated Documentation
              </span>
              <span className="text-xs text-muted-foreground">
                {docFormats.find(f => f.value === docFormat)?.label}
              </span>
            </div>
            <div className="flex-1 p-4">
              {generatedDocs ? (
                <pre className="bg-muted rounded-lg p-4 text-sm overflow-auto h-full font-mono">
                  <code>{generatedDocs}</code>
                </pre>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Icon name="FileText" size={48} className="text-muted-foreground mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">
                      Configure your options and click "Generate Documentation" to create your API docs
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiDocumentationGenerator;
