import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const CodePreviewPanel = ({ 
  generatedCode, 
  activeTab, 
  onTabChange, 
  onCopyCode,
  onDownloadFile,
  isGenerating = false 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);

  const mockGeneratedCode = {
    'sql': {
      name: 'schema.sql',
      language: 'sql',
      content: `-- Generated SQL Schema for PostgreSQL
-- Generated on: ${new Date()?.toLocaleDateString()}

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    slug VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'draft',
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_published_at ON posts(published_at);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);`
    },
    'prisma': {
      name: 'schema.prisma',
      language: 'prisma',
      content: `// Generated Prisma Schema
// Generated on: ${new Date()?.toLocaleDateString()}

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           Int       @id @default(autoincrement())
  email        String    @unique
  username     String    @unique
  passwordHash String    @map("password_hash")
  firstName    String?   @map("first_name")
  lastName     String?   @map("last_name")
  avatarUrl    String?   @map("avatar_url")
  isActive     Boolean   @default(true) @map("is_active")
  createdAt    DateTime  @default(now()) @map("created_at")
  updatedAt    DateTime  @updatedAt @map("updated_at")
  
  posts        Post[]
  comments     Comment[]
  
  @@map("users")
}

model Post {
  id          Int       @id @default(autoincrement())
  userId      Int       @map("user_id")
  title       String
  content     String?
  slug        String    @unique
  status      String    @default("draft")
  publishedAt DateTime? @map("published_at")
  createdAt   DateTime  @default(now()) @map("created_at")
  updatedAt   DateTime  @updatedAt @map("updated_at")
  
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  comments    Comment[]
  
  @@index([userId])
  @@index([status])
  @@index([publishedAt])
  @@map("posts")
}

model Comment {
  id        Int       @id @default(autoincrement())
  postId    Int       @map("post_id")
  userId    Int       @map("user_id")
  content   String
  parentId  Int?      @map("parent_id")
  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime  @updatedAt @map("updated_at")
  
  post      Post      @relation(fields: [postId], references: [id], onDelete: Cascade)
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  parent    Comment?  @relation("CommentReplies", fields: [parentId], references: [id], onDelete: Cascade)
  replies   Comment[] @relation("CommentReplies")
  
  @@index([postId])
  @@index([userId])
  @@map("comments")
}`
    },
    'typescript': {
      name: 'types.ts',
      language: 'typescript',
      content: `// Generated TypeScript Types
// Generated on: ${new Date()?.toLocaleDateString()}

export interface User {
  id: number;
  email: string;
  username: string;
  passwordHash: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Post {
  id: number;
  userId: number;
  title: string;
  content?: string;
  slug: string;
  status: PostStatus;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  comments?: Comment[];
}

export interface Comment {
  id: number;
  postId: number;
  userId: number;
  content: string;
  parentId?: number;
  createdAt: Date;
  updatedAt: Date;
  post?: Post;
  user?: User;
  parent?: Comment;
  replies?: Comment[];
}

export type PostStatus = 'draft' | 'published' | 'archived';

export interface CreateUserInput {
  email: string;
  username: string;
  passwordHash: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
}

export interface UpdateUserInput {
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  isActive?: boolean;
}

export interface CreatePostInput {
  userId: number;
  title: string;
  content?: string;
  slug: string;
  status?: PostStatus;
}

export interface UpdatePostInput {
  title?: string;
  content?: string;
  slug?: string;
  status?: PostStatus;
  publishedAt?: Date;
}`
    }
  };

  const availableTabs = Object.keys(mockGeneratedCode);
  const currentCode = mockGeneratedCode?.[activeTab] || mockGeneratedCode?.['sql'];

  useEffect(() => {
    if (searchTerm && currentCode?.content) {
      const regex = new RegExp(searchTerm, 'gi');
      const matches = [...currentCode?.content?.matchAll(regex)];
      setSearchResults(matches);
      setCurrentSearchIndex(0);
    } else {
      setSearchResults([]);
      setCurrentSearchIndex(0);
    }
  }, [searchTerm, currentCode?.content]);

  const highlightSearchTerm = (text) => {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text?.split(regex)?.map((part, index) => 
      regex?.test(part) ? (
        <span key={index} className="bg-warning/30 text-warning-foreground px-1 rounded">
          {part}
        </span>
      ) : part
    );
  };

  const navigateSearch = (direction) => {
    if (searchResults?.length === 0) return;
    
    if (direction === 'next') {
      setCurrentSearchIndex((prev) => (prev + 1) % searchResults?.length);
    } else {
      setCurrentSearchIndex((prev) => (prev - 1 + searchResults?.length) % searchResults?.length);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-surface">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="Code" size={20} className="text-primary" />
          <h2 className="text-lg font-semibold text-text-primary">Code Preview</h2>
          {isGenerating && (
            <div className="flex items-center space-x-2 text-accent">
              <Icon name="Loader2" size={16} className="animate-spin" />
              <span className="text-sm">Generating...</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Copy"
            iconPosition="left"
            onClick={() => onCopyCode(currentCode?.content)}
          >
            Copy
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconPosition="left"
            onClick={() => onDownloadFile(currentCode)}
          >
            Download
          </Button>
        </div>
      </div>
      {/* Search Bar */}
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <Input
              type="search"
              placeholder="Search in code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e?.target?.value)}
              className="pr-20"
            />
            {searchResults?.length > 0 && (
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1 text-xs text-text-secondary">
                <span>{currentSearchIndex + 1} of {searchResults?.length}</span>
              </div>
            )}
          </div>
          
          {searchResults?.length > 0 && (
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                iconName="ChevronUp"
                onClick={() => navigateSearch('prev')}
                disabled={searchResults?.length === 0}
              />
              <Button
                variant="ghost"
                size="sm"
                iconName="ChevronDown"
                onClick={() => navigateSearch('next')}
                disabled={searchResults?.length === 0}
              />
            </div>
          )}
        </div>
      </div>
      {/* Tabs */}
      <div className="flex border-b border-border bg-muted/20 overflow-x-auto">
        {availableTabs?.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-smooth whitespace-nowrap ${
              activeTab === tab
                ? 'border-primary text-primary bg-surface' :'border-transparent text-text-secondary hover:text-text-primary hover:bg-muted/50'
            }`}
          >
            <Icon 
              name={
                tab === 'sql' ? 'Database' :
                tab === 'prisma' ? 'Code' :
                tab === 'typescript' ? 'FileType' :
                tab === 'mongoose' ? 'Leaf' :
                tab === 'graphql' ? 'Zap' : 'FileCode'
              } 
              size={16} 
            />
            <span>{mockGeneratedCode?.[tab]?.name || tab}</span>
          </button>
        ))}
      </div>
      {/* Code Content */}
      <div className="flex-1 overflow-hidden">
        {isGenerating ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Icon name="Loader2" size={48} className="mx-auto mb-4 text-accent animate-spin" />
              <h3 className="text-lg font-medium text-text-primary mb-2">Generating Code...</h3>
              <p className="text-text-secondary">Please wait while we generate your schema files</p>
            </div>
          </div>
        ) : (
          <div className="h-full overflow-auto">
            <pre className="p-6 text-sm font-mono leading-relaxed text-text-primary bg-surface">
              <code>
                {highlightSearchTerm(currentCode?.content)}
              </code>
            </pre>
          </div>
        )}
      </div>
      {/* Footer Stats */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted/20 text-xs text-text-secondary">
        <div className="flex items-center space-x-4">
          <span>Language: {currentCode?.language?.toUpperCase()}</span>
          <span>Lines: {currentCode?.content?.split('\n')?.length || 0}</span>
          <span>Characters: {currentCode?.content?.length || 0}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Icon name="Clock" size={12} />
          <span>Last generated: {new Date()?.toLocaleTimeString()}</span>
        </div>
      </div>
    </div>
  );
};

export default CodePreviewPanel;