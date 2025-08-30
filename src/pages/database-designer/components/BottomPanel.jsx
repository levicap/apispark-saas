import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const BottomPanel = ({ 
  tables = [], 
  selectedTable, 
  isVisible = true, 
  onToggle,
  onExport
}) => {
  const [activeTab, setActiveTab] = useState('sql');
  const [sqlDialect, setSqlDialect] = useState('postgresql');

  const tabs = [
    { id: 'sql', label: 'SQL Schema', icon: 'Database' },
    { id: 'prisma', label: 'Prisma', icon: 'Code' },
    { id: 'sequelize', label: 'Sequelize', icon: 'Code2' },
    { id: 'typeorm', label: 'TypeORM', icon: 'FileCode' }
  ];

  const sqlDialectOptions = [
    { value: 'postgresql', label: 'PostgreSQL' },
    { value: 'mysql', label: 'MySQL' },
    { value: 'sqlite', label: 'SQLite' },
    { value: 'mssql', label: 'SQL Server' }
  ];

  const generateSQL = () => {
    if (!selectedTable) {
      return `-- Select a table to view its SQL schema
-- Or view all tables by selecting "All Tables" option`;
    }

    const fields = selectedTable?.fields?.map(field => {
      let sql = `  ${field?.name} ${field?.type}`;
      
      if (field?.primaryKey) sql += ' PRIMARY KEY';
      if (field?.autoIncrement && sqlDialect === 'postgresql') sql += ' SERIAL';
      if (field?.autoIncrement && sqlDialect === 'mysql') sql += ' AUTO_INCREMENT';
      if (!field?.nullable) sql += ' NOT NULL';
      if (field?.unique) sql += ' UNIQUE';
      if (field?.defaultValue) sql += ` DEFAULT '${field?.defaultValue}'`;
      
      return sql;
    })?.join(',\n');

    return `CREATE TABLE ${selectedTable?.name} (
${fields}
);`;
  };

  const generatePrisma = () => {
    if (!selectedTable) {
      return `// Select a table to view its Prisma schema
// This will generate the model definition`;
    }

    const fields = selectedTable?.fields?.map(field => {
      let prismaField = `  ${field?.name} `;
      
      // Map SQL types to Prisma types
      const typeMap = {
        'VARCHAR(255)': 'String',
        'TEXT': 'String',
        'INT': 'Int',
        'BIGINT': 'BigInt',
        'DECIMAL': 'Decimal',
        'FLOAT': 'Float',
        'BOOLEAN': 'Boolean',
        'DATE': 'DateTime',
        'DATETIME': 'DateTime',
        'TIMESTAMP': 'DateTime',
        'JSON': 'Json',
        'UUID': 'String'
      };
      
      prismaField += typeMap?.[field?.type] || 'String';
      
      const attributes = [];
      if (field?.primaryKey) attributes?.push('@id');
      if (field?.autoIncrement) attributes?.push('@default(autoincrement())');
      if (field?.unique) attributes?.push('@unique');
      if (field?.defaultValue && !field?.autoIncrement) {
        attributes?.push(`@default("${field?.defaultValue}")`);
      }
      if (!field?.nullable) attributes?.push('');
      else prismaField += '?';
      
      if (attributes?.length > 0) {
        prismaField += ' ' + attributes?.join(' ');
      }
      
      return prismaField;
    })?.join('\n');

    return `model ${selectedTable?.name} {
${fields}
}`;
  };

  const generateSequelize = () => {
    if (!selectedTable) {
      return `// Select a table to view its Sequelize model
// This will generate the model definition`;
    }

    const fields = selectedTable?.fields?.map(field => {
      const typeMap = {
        'VARCHAR(255)': 'DataTypes.STRING',
        'TEXT': 'DataTypes.TEXT',
        'INT': 'DataTypes.INTEGER',
        'BIGINT': 'DataTypes.BIGINT',
        'DECIMAL': 'DataTypes.DECIMAL',
        'FLOAT': 'DataTypes.FLOAT',
        'BOOLEAN': 'DataTypes.BOOLEAN',
        'DATE': 'DataTypes.DATE',
        'DATETIME': 'DataTypes.DATE',
        'TIMESTAMP': 'DataTypes.DATE',
        'JSON': 'DataTypes.JSON',
        'UUID': 'DataTypes.UUID'
      };

      let fieldDef = `    ${field?.name}: {
      type: ${typeMap?.[field?.type] || 'DataTypes.STRING'}`;
      
      if (field?.primaryKey) fieldDef += ',\n      primaryKey: true';
      if (field?.autoIncrement) fieldDef += ',\n      autoIncrement: true';
      if (!field?.nullable) fieldDef += ',\n      allowNull: false';
      if (field?.unique) fieldDef += ',\n      unique: true';
      if (field?.defaultValue) fieldDef += `,\n      defaultValue: '${field?.defaultValue}'`;
      
      fieldDef += '\n    }';
      return fieldDef;
    })?.join(',\n');

    return `const ${selectedTable?.name} = sequelize.define('${selectedTable?.name}', {
${fields}
}, {
  tableName: '${selectedTable?.name}',
  timestamps: true
});`;
  };

  const generateTypeORM = () => {
    if (!selectedTable) {
      return `// Select a table to view its TypeORM entity
// This will generate the entity class`;
    }

    const fields = selectedTable?.fields?.map(field => {
      const typeMap = {
        'VARCHAR(255)': 'string',
        'TEXT': 'string',
        'INT': 'number',
        'BIGINT': 'number',
        'DECIMAL': 'number',
        'FLOAT': 'number',
        'BOOLEAN': 'boolean',
        'DATE': 'Date',
        'DATETIME': 'Date',
        'TIMESTAMP': 'Date',
        'JSON': 'object',
        'UUID': 'string'
      };

      let decorators = [];
      if (field?.primaryKey) {
        decorators?.push('  @PrimaryGeneratedColumn()');
      } else {
        decorators?.push('  @Column()');
      }
      
      const fieldType = typeMap?.[field?.type] || 'string';
      const nullable = field?.nullable ? '?' : '';
      
      return `${decorators?.join('\n')}\n  ${field?.name}${nullable}: ${fieldType};`;
    })?.join('\n\n');

    return `import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('${selectedTable?.name}')
export class ${selectedTable?.name} {
${fields}
}`;
  };

  const getGeneratedCode = () => {
    switch (activeTab) {
      case 'sql': return generateSQL();
      case 'prisma': return generatePrisma();
      case 'sequelize': return generateSequelize();
      case 'typeorm': return generateTypeORM();
      default: return '';
    }
  };

  const handleCopyCode = () => {
    const code = getGeneratedCode();
    navigator.clipboard?.writeText(code);
  };

  const handleExportCode = () => {
    const code = getGeneratedCode();
    const filename = `${selectedTable?.name || 'schema'}.${activeTab === 'sql' ? 'sql' : 'js'}`;
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a?.click();
    URL.revokeObjectURL(url);
  };

  if (!isVisible) {
    return (
      <div className="h-8 bg-surface border-t border-border flex items-center justify-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          iconName="ChevronUp"
          iconSize={14}
          className="text-xs"
        >
          Show Code Panel
        </Button>
      </div>
    );
  }

  return (
    <div className="h-80 bg-surface border-t border-border flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border">
        <div className="flex items-center space-x-4">
          <h3 className="text-sm font-semibold text-foreground">Generated Code</h3>
          
          {/* Tabs */}
          <div className="flex space-x-1">
            {tabs?.map((tab) => (
              <Button
                key={tab?.id}
                variant={activeTab === tab?.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab(tab?.id)}
                className="text-xs px-3 py-1 h-7"
                iconName={tab?.icon}
                iconSize={12}
              >
                {tab?.label}
              </Button>
            ))}
          </div>

          {/* SQL Dialect Selector */}
          {activeTab === 'sql' && (
            <Select
              options={sqlDialectOptions}
              value={sqlDialect}
              onChange={setSqlDialect}
              className="w-32"
            />
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyCode}
            iconName="Copy"
            iconSize={14}
            className="text-xs"
          >
            Copy
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCode}
            iconName="Download"
            iconSize={14}
            className="text-xs"
          >
            Export
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="w-6 h-6"
          >
            <Icon name="ChevronDown" size={14} />
          </Button>
        </div>
      </div>
      {/* Code Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full bg-muted p-4 font-mono text-xs overflow-auto">
          <pre className="text-foreground whitespace-pre-wrap">
            {getGeneratedCode()}
          </pre>
        </div>
      </div>
      {/* Footer */}
      <div className="p-2 border-t border-border bg-muted">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-4">
            <span>Tables: {tables?.length}</span>
            {selectedTable && (
              <span>Fields: {selectedTable?.fields?.length}</span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Database" size={12} />
            <span>Ready to export</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomPanel;