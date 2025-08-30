import React, { useState } from 'react';
import { useProjectContext } from '../../contexts/ProjectContext';
import Button from './Button';
import Icon from '../AppIcon';

const DatabaseExport = ({ onExport, className = '' }) => {
  const { currentProject, getCurrentProjectSchema } = useProjectContext();
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState('sql');

  const exportFormats = [
    { id: 'sql', label: 'SQL', icon: 'Database', description: 'Database creation scripts' },
    { id: 'prisma', label: 'Prisma', icon: 'Code', description: 'Prisma ORM schema' },
    { id: 'typescript', label: 'TypeScript', icon: 'FileText', description: 'Type definitions' },
    { id: 'openapi', label: 'OpenAPI', icon: 'Globe', description: 'API specification' },
    { id: 'json', label: 'JSON', icon: 'FileJson', description: 'Raw schema data' }
  ];

  const handleExport = async (format = exportFormat) => {
    if (!currentProject) {
      alert('Please select a project first');
      return;
    }

    setIsExporting(true);
    try {
      const schema = getCurrentProjectSchema();
      const exportedData = await generateExportData(schema, format);
      
      if (onExport) {
        onExport(exportedData, format);
      } else {
        downloadFile(exportedData, format);
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const generateExportData = async (schema, format) => {
    const { entities, connections } = schema;
    
    switch (format) {
      case 'sql':
        return generateSQL(entities, connections);
      case 'prisma':
        return generatePrisma(entities, connections);
      case 'typescript':
        return generateTypeScript(entities, connections);
      case 'openapi':
        return generateOpenAPI(entities, connections);
      case 'json':
        return JSON.stringify(schema, null, 2);
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  };

  const generateSQL = (entities, connections) => {
    let sql = `-- Database Schema for ${currentProject.name}\n`;
    sql += `-- Generated on ${new Date().toLocaleString()}\n\n`;
    
    // Create tables
    entities.forEach(entity => {
      sql += `CREATE TABLE ${entity.name} (\n`;
      sql += entity.fields.map(field => {
        let fieldDef = `  ${field.name} ${field.type}`;
        if (field.primaryKey) fieldDef += ' PRIMARY KEY';
        if (!field.nullable) fieldDef += ' NOT NULL';
        if (field.unique && !field.primaryKey) fieldDef += ' UNIQUE';
        if (field.defaultValue) fieldDef += ` DEFAULT ${field.defaultValue}`;
        return fieldDef;
      }).join(',\n');
      sql += '\n);\n\n';
    });

    // Create indexes
    entities.forEach(entity => {
      entity.indexes.forEach(index => {
        if (index.unique) {
          sql += `CREATE UNIQUE INDEX ${index.name} ON ${entity.name} (${index.fields.join(', ')});\n`;
        } else {
          sql += `CREATE INDEX ${index.name} ON ${entity.name} (${index.fields.join(', ')});\n`;
        }
      });
    });

    // Create foreign key constraints
    connections.forEach(conn => {
      const sourceEntity = entities.find(e => e.id === conn.sourceEntityId);
      const targetEntity = entities.find(e => e.id === conn.targetEntityId);
      if (sourceEntity && targetEntity) {
        sql += `ALTER TABLE ${sourceEntity.name} ADD CONSTRAINT fk_${sourceEntity.name}_${conn.sourceField} `;
        sql += `FOREIGN KEY (${conn.sourceField}) REFERENCES ${targetEntity.name}(${conn.targetField}) `;
        sql += `ON DELETE ${conn.onDelete} ON UPDATE ${conn.onUpdate};\n`;
      }
    });

    return sql;
  };

  const generatePrisma = (entities, connections) => {
    let prisma = `// Prisma Schema for ${currentProject.name}\n`;
    prisma += `// Generated on ${new Date().toLocaleString()}\n\n`;
    prisma += `generator client {\n  provider = "prisma-client-js"\n}\n\n`;
    prisma += `datasource db {\n  provider = "${currentProject.databaseType?.toLowerCase() || 'postgresql'}"\n  url      = env("DATABASE_URL")\n}\n\n`;

    entities.forEach(entity => {
      prisma += `model ${entity.name.charAt(0).toUpperCase() + entity.name.slice(1)} {\n`;
      
      // Fields
      entity.fields.forEach(field => {
        let fieldDef = `  ${field.name} ${getPrismaType(field.type)}`;
        if (field.primaryKey) fieldDef += ' @id';
        if (field.unique && !field.primaryKey) fieldDef += ' @unique';
        if (field.defaultValue && field.defaultValue !== '') {
          if (field.defaultValue === 'gen_random_uuid()') {
            fieldDef += ' @default(uuid())';
          } else if (field.defaultValue === 'CURRENT_TIMESTAMP') {
            fieldDef += ' @default(now())';
          } else if (field.defaultValue === 'AUTO_INCREMENT') {
            fieldDef += ' @default(autoincrement())';
          } else {
            fieldDef += ` @default("${field.defaultValue}")`;
          }
        }
        prisma += fieldDef + '\n';
      });

      // Relations
      connections.forEach(conn => {
        if (conn.sourceEntityId === entity.id) {
          const targetEntity = entities.find(e => e.id === conn.targetEntityId);
          if (targetEntity) {
            const relationName = conn.name || `${targetEntity.name}Relation`;
            prisma += `  ${relationName} ${targetEntity.name.charAt(0).toUpperCase() + targetEntity.name.slice(1)} @relation(fields: [${conn.sourceField}], references: [${conn.targetField}], onDelete: ${conn.onDelete?.toLowerCase()}, onUpdate: ${conn.onUpdate?.toLowerCase()})\n`;
          }
        }
      });

      prisma += '}\n\n';
    });

    return prisma;
  };

  const generateTypeScript = (entities, connections) => {
    let typescript = `// TypeScript interfaces for ${currentProject.name}\n`;
    typescript += `// Generated on ${new Date().toLocaleString()}\n\n`;

    // Generate interfaces
    entities.forEach(entity => {
      typescript += `export interface ${entity.name.charAt(0).toUpperCase() + entity.name.slice(1)} {\n`;
      entity.fields.forEach(field => {
        typescript += `  ${field.name}: ${getTypeScriptType(field.type)};\n`;
      });
      typescript += '}\n\n';
    });

    // Generate enums for enum fields
    const enumFields = new Set();
    entities.forEach(entity => {
      entity.fields.forEach(field => {
        if (field.type.startsWith('enum(')) {
          const enumName = field.name.charAt(0).toUpperCase() + field.name.slice(1);
          if (!enumFields.has(enumName)) {
            enumFields.add(enumName);
            const enumValues = field.type.match(/enum\("([^"]+)"(?:,"([^"]+)")*\)/);
            if (enumValues) {
              typescript += `export enum ${enumName} {\n`;
              enumValues.slice(1).forEach(value => {
                if (value) {
                  typescript += `  ${value.toUpperCase()} = '${value}',\n`;
                }
              });
              typescript += '}\n\n';
            }
          }
        }
      });
    });

    return typescript;
  };

  const generateOpenAPI = (entities, connections) => {
    let openapi = `openapi: 3.0.0\n`;
    openapi += `info:\n`;
    openapi += `  title: ${currentProject.name} API\n`;
    openapi += `  description: API for ${currentProject.name} database\n`;
    openapi += `  version: 1.0.0\n\n`;
    openapi += `paths:\n`;

    // Generate paths for each entity
    entities.forEach(entity => {
      const entityName = entity.name;
      const entityNameSingular = entityName.endsWith('s') ? entityName.slice(0, -1) : entityName;
      
      // GET /{entity}
      openapi += `  /${entityName}:\n`;
      openapi += `    get:\n`;
      openapi += `      summary: Get all ${entityName}\n`;
      openapi += `      responses:\n`;
      openapi += `        '200':\n`;
      openapi += `          description: List of ${entityName}\n`;
      openapi += `          content:\n`;
      openapi += `            application/json:\n`;
      openapi += `              schema:\n`;
      openapi += `                type: array\n`;
      openapi += `                items:\n`;
      openapi += `                  $ref: '#/components/schemas/${entityName.charAt(0).toUpperCase() + entityName.slice(1)}'\n\n`;

      // POST /{entity}
      openapi += `    post:\n`;
      openapi += `      summary: Create a new ${entityNameSingular}\n`;
      openapi += `      requestBody:\n`;
      openapi += `        required: true\n`;
      openapi += `        content:\n`;
      openapi += `          application/json:\n`;
      openapi += `            schema:\n`;
      openapi += `              $ref: '#/components/schemas/${entityName.charAt(0).toUpperCase() + entityName.slice(1)}Input'\n`;
      openapi += `      responses:\n`;
      openapi += `        '201':\n`;
      openapi += `          description: ${entityNameSingular} created successfully\n\n`;

      // GET /{entity}/{id}
      openapi += `  /${entityName}/{id}:\n`;
      openapi += `    get:\n`;
      openapi += `      summary: Get ${entityNameSingular} by ID\n`;
      openapi += `      parameters:\n`;
      openapi += `        - name: id\n`;
      openapi += `          in: path\n`;
      openapi += `          required: true\n`;
      openapi += `          schema:\n`;
      openapi += `            type: string\n`;
      openapi += `      responses:\n`;
      openapi += `        '200':\n`;
      openapi += `          description: ${entityNameSingular} details\n`;
      openapi += `          content:\n`;
      openapi += `            application/json:\n`;
      openapi += `              schema:\n`;
      openapi += `                $ref: '#/components/schemas/${entityName.charAt(0).toUpperCase() + entityName.slice(1)}'\n\n`;
    });

    // Generate schemas
    openapi += `components:\n`;
    openapi += `  schemas:\n`;

    entities.forEach(entity => {
      const entityName = entity.name.charAt(0).toUpperCase() + entity.name.slice(1);
      
      openapi += `    ${entityName}:\n`;
      openapi += `      type: object\n`;
      openapi += `      properties:\n`;
      
      entity.fields.forEach(field => {
        openapi += `        ${field.name}:\n`;
        openapi += `          type: ${getOpenAPIType(field.type)}\n`;
        if (field.description) {
          openapi += `          description: ${field.description}\n`;
        }
      });

      openapi += `      required:\n`;
      entity.fields.filter(f => !f.nullable).forEach(field => {
        openapi += `        - ${field.name}\n`;
      });

      // Input schema (without auto-generated fields)
      openapi += `    ${entityName}Input:\n`;
      openapi += `      type: object\n`;
      openapi += `      properties:\n`;
      
      entity.fields.filter(f => !f.primaryKey && f.name !== 'created_at' && f.name !== 'updated_at').forEach(field => {
        openapi += `        ${field.name}:\n`;
        openapi += `          type: ${getOpenAPIType(field.type)}\n`;
      });

      openapi += `      required:\n`;
      entity.fields.filter(f => !f.nullable && !f.primaryKey && f.name !== 'created_at' && f.name !== 'updated_at').forEach(field => {
        openapi += `        - ${field.name}\n`;
      });
    });

    return openapi;
  };

  const getPrismaType = (dbType) => {
    const typeMap = {
      'uuid': 'String',
      'varchar': 'String',
      'text': 'String',
      'int': 'Int',
      'bigint': 'BigInt',
      'decimal': 'Decimal',
      'boolean': 'Boolean',
      'timestamp': 'DateTime',
      'date': 'DateTime',
      'jsonb': 'Json'
    };
    return typeMap[dbType.toLowerCase()] || 'String';
  };

  const getTypeScriptType = (dbType) => {
    const typeMap = {
      'uuid': 'string',
      'varchar': 'string',
      'text': 'string',
      'int': 'number',
      'bigint': 'number',
      'decimal': 'number',
      'boolean': 'boolean',
      'timestamp': 'Date',
      'date': 'Date',
      'jsonb': 'any'
    };
    return typeMap[dbType.toLowerCase()] || 'any';
  };

  const getOpenAPIType = (dbType) => {
    const typeMap = {
      'uuid': 'string',
      'varchar': 'string',
      'text': 'string',
      'int': 'integer',
      'bigint': 'integer',
      'decimal': 'number',
      'boolean': 'boolean',
      'timestamp': 'string',
      'date': 'string',
      'jsonb': 'object'
    };
    return typeMap[dbType.toLowerCase()] || 'string';
  };

  const downloadFile = (content, format) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentProject.name.toLowerCase().replace(/\s+/g, '_')}_schema.${format === 'json' ? 'json' : format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!currentProject) {
    return (
      <div className={`text-center p-4 ${className}`}>
        <Icon name="Database" size={24} className="text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">Select a project to export database schema</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Export Database Schema</h3>
          <p className="text-sm text-muted-foreground">
            Export {currentProject.name} schema in various formats
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
            className="px-3 py-1 text-sm border border-border rounded-md bg-background"
          >
            {exportFormats.map(format => (
              <option key={format.id} value={format.id}>
                {format.label}
              </option>
            ))}
          </select>
          <Button
            onClick={() => handleExport()}
            disabled={isExporting}
            iconName="Download"
            iconPosition="left"
          >
            {isExporting ? 'Exporting...' : 'Export'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {exportFormats.map(format => (
          <button
            key={format.id}
            onClick={() => handleExport(format.id)}
            disabled={isExporting}
            className={`p-3 text-left border rounded-lg transition-smooth hover:border-primary ${
              exportFormat === format.id ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted'
            }`}
          >
            <div className="flex items-center space-x-2 mb-2">
              <Icon name={format.icon} size={16} className="text-primary" />
              <span className="font-medium text-foreground">{format.label}</span>
            </div>
            <p className="text-xs text-muted-foreground">{format.description}</p>
          </button>
        ))}
      </div>

      <div className="text-xs text-muted-foreground text-center">
        Schema includes {getCurrentProjectSchema().entities?.length || 0} entities and {getCurrentProjectSchema().connections?.length || 0} relationships
      </div>
    </div>
  );
};

export default DatabaseExport; 