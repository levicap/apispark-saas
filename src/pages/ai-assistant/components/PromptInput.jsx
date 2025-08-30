import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const PromptInput = ({ 
  onSendMessage, 
  onFileUpload, 
  isLoading = false,
  placeholder = "Ask me anything about your API..." 
}) => {
  const [message, setMessage] = useState('');
  const [mode, setMode] = useState('natural');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [selectedFramework, setSelectedFramework] = useState('express');
  const fileInputRef = useRef(null);

  const modeOptions = [
    { value: 'natural', label: 'Natural Language', description: 'Ask questions in plain English' },
    { value: 'code', label: 'Code Generation', description: 'Generate specific code snippets' },
    { value: 'schema', label: 'Schema Analysis', description: 'Analyze uploaded schemas' }
  ];

  const languageOptions = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'csharp', label: 'C#' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' }
  ];

  const frameworkOptions = {
    javascript: [
      { value: 'express', label: 'Express.js' },
      { value: 'fastify', label: 'Fastify' },
      { value: 'koa', label: 'Koa.js' },
      { value: 'nextjs', label: 'Next.js' }
    ],
    typescript: [
      { value: 'express', label: 'Express.js' },
      { value: 'nestjs', label: 'NestJS' },
      { value: 'fastify', label: 'Fastify' }
    ],
    python: [
      { value: 'fastapi', label: 'FastAPI' },
      { value: 'django', label: 'Django' },
      { value: 'flask', label: 'Flask' }
    ],
    java: [
      { value: 'spring', label: 'Spring Boot' },
      { value: 'quarkus', label: 'Quarkus' }
    ],
    csharp: [
      { value: 'aspnet', label: 'ASP.NET Core' }
    ],
    go: [
      { value: 'gin', label: 'Gin' },
      { value: 'echo', label: 'Echo' },
      { value: 'fiber', label: 'Fiber' }
    ],
    rust: [
      { value: 'actix', label: 'Actix Web' },
      { value: 'warp', label: 'Warp' }
    ]
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!message?.trim() || isLoading) return;

    const messageData = {
      content: message,
      mode,
      language: mode === 'code' ? selectedLanguage : undefined,
      framework: mode === 'code' ? selectedFramework : undefined,
      timestamp: new Date()?.toISOString()
    };

    onSendMessage(messageData);
    setMessage('');
  };

  const handleFileSelect = (e) => {
    const file = e?.target?.files?.[0];
    if (file && onFileUpload) {
      onFileUpload(file);
    }
  };

  const handleKeyDown = (e) => {
    if (e?.key === 'Enter' && (e?.metaKey || e?.ctrlKey)) {
      handleSubmit(e);
    }
  };

  const quickPrompts = [
    "Generate a REST API for user management",
    "Create database schema for e-commerce",
    "Add authentication middleware",
    "Generate test cases for my endpoints",
    "Optimize database queries",
    "Add rate limiting to API"
  ];

  return (
    <div className="border-t border-border bg-surface">
      {/* Mode Selector */}
      <div className="px-6 py-3 border-b border-border">
        <div className="flex items-center space-x-4">
          <Select
            options={modeOptions}
            value={mode}
            onChange={setMode}
            className="w-48"
          />
          
          {mode === 'code' && (
            <>
              <Select
                options={languageOptions}
                value={selectedLanguage}
                onChange={setSelectedLanguage}
                className="w-32"
              />
              <Select
                options={frameworkOptions?.[selectedLanguage] || []}
                value={selectedFramework}
                onChange={setSelectedFramework}
                className="w-32"
              />
            </>
          )}
        </div>
      </div>
      {/* Quick Prompts */}
      <div className="px-6 py-3 border-b border-border">
        <div className="flex flex-wrap gap-2">
          {quickPrompts?.map((prompt, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => setMessage(prompt)}
              className="text-xs"
            >
              {prompt}
            </Button>
          ))}
        </div>
      </div>
      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-6">
        <div className="flex items-end space-x-4">
          <div className="flex-1">
            <textarea
              value={message}
              onChange={(e) => setMessage(e?.target?.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              rows={3}
              className="w-full px-4 py-3 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth"
              disabled={isLoading}
            />
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => fileInputRef?.current?.click()}
                  disabled={isLoading}
                >
                  <Icon name="Paperclip" size={16} className="mr-2" />
                  Attach File
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,.yaml,.yml,.sql,.js,.ts,.py"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
              <div className="text-xs text-muted-foreground">
                Press ⌘+Enter to send
              </div>
            </div>
          </div>
          
          <Button
            type="submit"
            disabled={!message?.trim() || isLoading}
            loading={isLoading}
            className="px-6"
          >
            <Icon name="Send" size={16} />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PromptInput;