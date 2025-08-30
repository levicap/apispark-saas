import React, { useState, useEffect, useRef } from 'react';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import ThreadSidebar from './components/ThreadSidebar';
import MessageBubble from './components/MessageBubble';
import ContextualSuggestions from './components/ContextualSuggestions';
import PromptInput from './components/PromptInput';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const AIAssistant = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [threadSidebarCollapsed, setThreadSidebarCollapsed] = useState(false);
  const [activeThreadId, setActiveThreadId] = useState('thread-1');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Mock data
  const mockThreads = [
    {
      id: 'thread-1',
      title: 'User Authentication API',
      category: 'API Generation',
      lastMessage: 'Generated JWT authentication middleware with refresh token support',
      messageCount: 12,
      updatedAt: new Date(Date.now() - 900000),
      createdAt: new Date(Date.now() - 3600000)
    },
    {
      id: 'thread-2',
      title: 'E-commerce Database Schema',
      category: 'Database Schema',
      lastMessage: 'Created optimized schema with proper indexing for product catalog',
      messageCount: 8,
      updatedAt: new Date(Date.now() - 1800000),
      createdAt: new Date(Date.now() - 7200000)
    },
    {
      id: 'thread-3',
      title: 'API Testing Strategy',
      category: 'Testing',
      lastMessage: 'Generated comprehensive test suite with edge cases',
      messageCount: 15,
      updatedAt: new Date(Date.now() - 3600000),
      createdAt: new Date(Date.now() - 10800000)
    },
    {
      id: 'thread-4',
      title: 'Docker Deployment Setup',
      category: 'Deployment',
      lastMessage: 'Created multi-stage Dockerfile with production optimizations',
      messageCount: 6,
      updatedAt: new Date(Date.now() - 7200000),
      createdAt: new Date(Date.now() - 14400000)
    },
    {
      id: 'thread-5',
      title: 'Rate Limiting Implementation',
      category: 'API Generation',
      lastMessage: 'Added Redis-based rate limiting with sliding window',
      messageCount: 9,
      updatedAt: new Date(Date.now() - 10800000),
      createdAt: new Date(Date.now() - 18000000)
    }
  ];

  const [threads, setThreads] = useState(mockThreads);

  const mockMessages = {
    'thread-1': [
      {
        id: 'msg-1',
        sender: 'user',
        content: 'I need to create a user authentication system for my REST API. It should support JWT tokens and refresh tokens.',
        timestamp: new Date(Date.now() - 3600000)
      },
      {
        id: 'msg-2',
        sender: 'ai',
        content: `I'll help you create a comprehensive user authentication system with JWT and refresh tokens. Here's a complete implementation:`,
        codeBlocks: [
          {
            language: 'javascript',
            filename: 'auth.js',
            content: `const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');

// Generate JWT tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId, type: 'access' },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: '15m' }
  );
  
  const refreshToken = jwt.sign(
    { userId, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
  
  return { accessToken, refreshToken };
};

// Login endpoint
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate tokens
    const { accessToken, refreshToken } = generateTokens(user._id);
    
    // Save refresh token to database
    user.refreshToken = refreshToken;
    await user.save();
    
    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      },
      accessToken,
      refreshToken
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { login, generateTokens };`
          },
          {
            language: 'javascript',
            filename: 'authMiddleware.js',
            content: `const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    
    if (decoded.type !== 'access') {
      return res.status(401).json({ error: 'Invalid token type' });
    }
    
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(403).json({ error: 'Invalid token' });
  }
};

module.exports = { authenticateToken };`
          }
        ],
        suggestions: [
          'Add password reset functionality',
          'Implement email verification',
          'Add rate limiting to login attempts',
          'Create user registration endpoint'
        ],
        timestamp: new Date(Date.now() - 3000000)
      },
      {
        id: 'msg-3',
        sender: 'user',
        content: 'This looks great! Can you also add the refresh token endpoint?',
        timestamp: new Date(Date.now() - 1800000)
      },
      {
        id: 'msg-4',
        sender: 'ai',
        content: `Absolutely! Here's the refresh token endpoint that works with the authentication system:`,
        codeBlocks: [
          {
            language: 'javascript',
            filename: 'refreshToken.js',
            content: `const jwt = require('jsonwebtoken');
const User = require('../models/User');

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }
    
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    if (decoded.type !== 'refresh') {
      return res.status(401).json({ error: 'Invalid token type' });
    }
    
    // Find user and verify stored refresh token
    const user = await User.findById(decoded.userId);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }
    
    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id);
    
    // Update stored refresh token
    user.refreshToken = newRefreshToken;
    await user.save();
    
    res.json({
      accessToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Refresh token expired' });
    }
    return res.status(403).json({ error: 'Invalid refresh token' });
  }
};

// Logout endpoint
const logout = async (req, res) => {
  try {
    const user = req.user; // From auth middleware
    
    // Clear refresh token
    user.refreshToken = null;
    await user.save();
    
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { refreshToken, logout };`
          }
        ],
        timestamp: new Date(Date.now() - 900000)
      }
    ]
  };

  const [messages, setMessages] = useState(mockMessages?.[activeThreadId] || []);

  const mockCurrentProject = {
    id: 'proj-1',
    name: 'E-commerce API',
    type: 'REST API',
    endpoints: 24,
    status: 'development',
    lastUpdated: '2 hours ago'
  };

  const mockSuggestions = [
    {
      id: 'sugg-1',
      type: 'security',
      title: 'Add Input Validation',
      description: 'Your endpoints are missing input validation middleware. This could lead to security vulnerabilities.',
      priority: 'high',
      impact: 'High',
      effort: '2 hours'
    },
    {
      id: 'sugg-2',
      type: 'performance',
      title: 'Optimize Database Queries',
      description: 'Several endpoints are making N+1 queries. Consider adding eager loading or query optimization.',
      priority: 'medium',
      impact: 'Medium',
      effort: '4 hours'
    },
    {
      id: 'sugg-3',
      type: 'testing',
      title: 'Increase Test Coverage',
      description: 'Current test coverage is 65%. Add tests for edge cases and error scenarios.',
      priority: 'medium',
      impact: 'Medium',
      effort: '6 hours'
    },
    {
      id: 'sugg-4',
      type: 'documentation',
      title: 'Update API Documentation',
      description: 'Several new endpoints are missing documentation. Update OpenAPI spec.',
      priority: 'low',
      impact: 'Low',
      effort: '1 hour'
    }
  ];

  useEffect(() => {
    setMessages(mockMessages?.[activeThreadId] || []);
  }, [activeThreadId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (messageData) => {
    setIsLoading(true);
    
    // Add user message
    const userMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      content: messageData?.content,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        content: generateAIResponse(messageData),
        codeBlocks: messageData?.mode === 'code' ? [generateCodeBlock(messageData)] : undefined,
        suggestions: Math.random() > 0.5 ? [
          'Consider adding error handling',
          'Add input validation',
          'Include unit tests'
        ] : undefined,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
      
      // Update thread last message
      setThreads(prev => prev?.map(thread => 
        thread?.id === activeThreadId 
          ? { ...thread, lastMessage: aiResponse?.content?.substring(0, 100) + '...', updatedAt: new Date() }
          : thread
      ));
    }, 2000);
  };

  const generateAIResponse = (messageData) => {
    const responses = [
      `I'll help you with that. Based on your request, here's what I recommend:`,
      `Great question! Let me provide you with a comprehensive solution:`,
      `I understand what you're looking for. Here's a detailed approach:`,
      `That's an excellent use case. Let me walk you through the implementation:`
    ];
    return responses?.[Math.floor(Math.random() * responses?.length)];
  };

  const generateCodeBlock = (messageData) => {
    const codeExamples = {
      javascript: `// Example ${messageData?.framework} implementation
const express = require('express');
const app = express();

app.get('/api/example', (req, res) => {
  res.json({ message: 'Hello World' });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});`,
      python: `# Example ${messageData?.framework} implementation
from fastapi import FastAPI

app = FastAPI()

@app.get("/api/example")
async def read_example():
    return {"message": "Hello World"}`,
      typescript: `// Example ${messageData?.framework} implementation
import express from 'express';

const app = express();

app.get('/api/example', (req, res) => {
  res.json({ message: 'Hello World' });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});`
    };

    return {
      language: messageData?.language,
      filename: `example.${messageData?.language === 'python' ? 'py' : messageData?.language === 'typescript' ? 'ts' : 'js'}`,
      content: codeExamples?.[messageData?.language] || codeExamples?.javascript
    };
  };

  const handleNewThread = () => {
    const newThread = {
      id: `thread-${Date.now()}`,
      title: 'New Conversation',
      category: 'General',
      lastMessage: 'New conversation started',
      messageCount: 0,
      updatedAt: new Date(),
      createdAt: new Date()
    };
    
    setThreads(prev => [newThread, ...prev]);
    setActiveThreadId(newThread?.id);
    setMessages([]);
  };

  const handleDeleteThread = (threadId) => {
    setThreads(prev => prev?.filter(thread => thread?.id !== threadId));
    if (activeThreadId === threadId && threads?.length > 1) {
      const remainingThreads = threads?.filter(thread => thread?.id !== threadId);
      setActiveThreadId(remainingThreads?.[0]?.id);
    }
  };

  const handleRenameThread = (threadId) => {
    const newTitle = prompt('Enter new conversation title:');
    if (newTitle) {
      setThreads(prev => prev?.map(thread => 
        thread?.id === threadId ? { ...thread, title: newTitle } : thread
      ));
    }
  };

  const handleSuggestionClick = (suggestion) => {
    if (typeof suggestion === 'string') {
      // Handle quick action
      const messageData = {
        content: suggestion,
        mode: 'natural',
        timestamp: new Date()?.toISOString()
      };
      handleSendMessage(messageData);
    } else {
      // Handle contextual suggestion
      const messageData = {
        content: `Help me with: ${suggestion?.title}. ${suggestion?.description}`,
        mode: 'natural',
        timestamp: new Date()?.toISOString()
      };
      handleSendMessage(messageData);
    }
  };

  const handleCopyCode = (code) => {
    // Code copied feedback could be shown here
    console.log('Code copied to clipboard');
  };

  const handleApplyCode = (codeBlock) => {
    // Integration with project would happen here
    console.log('Applying code to project:', codeBlock);
  };

  const handleEditCode = (codeBlock, index) => {
    // Open code editor modal would happen here
    console.log('Editing code block:', codeBlock, index);
  };

  const handleFileUpload = (file) => {
    console.log('File uploaded:', file?.name);
    // Handle file upload and analysis
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        isCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        currentProject={mockCurrentProject}
        onProjectChange={() => {}}
      />
      <div className="flex pt-16">
        <Sidebar
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        
        <div className={`flex-1 flex transition-all ${sidebarCollapsed ? 'ml-16' : 'ml-60'}`}>
          {/* Thread Sidebar */}
          <ThreadSidebar
            threads={threads}
            activeThreadId={activeThreadId}
            onThreadSelect={setActiveThreadId}
            onNewThread={handleNewThread}
            onDeleteThread={handleDeleteThread}
            onRenameThread={handleRenameThread}
            isCollapsed={threadSidebarCollapsed}
            onToggleCollapse={() => setThreadSidebarCollapsed(!threadSidebarCollapsed)}
          />
          
          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="border-b border-border bg-surface px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <Icon name="Bot" size={16} color="white" />
                  </div>
                  <div>
                    <h1 className="text-lg font-semibold">AI Assistant</h1>
                    <p className="text-sm text-muted-foreground">
                      {threads?.find(t => t?.id === activeThreadId)?.title || 'New Conversation'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon">
                    <Icon name="MoreVertical" size={16} />
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {messages?.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center max-w-md">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon name="Bot" size={32} className="text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Welcome to AI Assistant</h3>
                    <p className="text-muted-foreground mb-6">
                      I'm here to help you build better APIs. Ask me anything about code generation, 
                      database design, testing, or deployment.
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleSendMessage({
                          content: "Generate a REST API for user management",
                          mode: "natural"
                        })}
                      >
                        Generate a REST API for user management
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleSendMessage({
                          content: "Help me design a database schema",
                          mode: "natural"
                        })}
                      >
                        Help me design a database schema
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleSendMessage({
                          content: "Create test cases for my API",
                          mode: "natural"
                        })}
                      >
                        Create test cases for my API
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {messages?.map(message => (
                    <MessageBubble
                      key={message?.id}
                      message={message}
                      onCopyCode={handleCopyCode}
                      onApplyCode={handleApplyCode}
                      onEditCode={handleEditCode}
                    />
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                          <Icon name="Bot" size={16} color="white" />
                        </div>
                        <div className="bg-surface border border-border rounded-lg p-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            <span className="text-sm text-muted-foreground ml-2">AI is thinking...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
            
            {/* Input Area */}
            <PromptInput
              onSendMessage={handleSendMessage}
              onFileUpload={handleFileUpload}
              isLoading={isLoading}
            />
          </div>
          
          {/* Contextual Suggestions Sidebar */}
          <div className="w-80 bg-surface border-l border-border overflow-y-auto">
            <div className="p-6">
              <ContextualSuggestions
                suggestions={mockSuggestions}
                onSuggestionClick={handleSuggestionClick}
                currentProject={mockCurrentProject}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;