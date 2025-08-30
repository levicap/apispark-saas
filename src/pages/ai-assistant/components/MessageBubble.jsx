import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MessageBubble = ({ message, onCopyCode, onApplyCode, onEditCode }) => {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopyCode = async (code, index) => {
    try {
      await navigator.clipboard?.writeText(code);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
      if (onCopyCode) onCopyCode(code);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp)?.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderCodeBlock = (codeBlock, index) => (
    <div key={index} className="mt-4 border border-border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-muted border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Code" size={14} />
          <span className="text-sm font-medium">{codeBlock?.language}</span>
          {codeBlock?.filename && (
            <span className="text-xs text-muted-foreground">
              {codeBlock?.filename}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8"
            onClick={() => handleCopyCode(codeBlock?.content, index)}
          >
            <Icon 
              name={copiedIndex === index ? "Check" : "Copy"} 
              size={14} 
              className={copiedIndex === index ? "text-success" : ""}
            />
          </Button>
          {onEditCode && (
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8"
              onClick={() => onEditCode(codeBlock, index)}
            >
              <Icon name="Edit2" size={14} />
            </Button>
          )}
          {onApplyCode && (
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8"
              onClick={() => onApplyCode(codeBlock)}
            >
              <Icon name="Download" size={14} />
            </Button>
          )}
        </div>
      </div>
      <div className="p-4 bg-surface">
        <pre className="text-sm font-mono overflow-x-auto">
          <code className="language-javascript">{codeBlock?.content}</code>
        </pre>
      </div>
    </div>
  );

  return (
    <div className={`flex ${message?.sender === 'user' ? 'justify-end' : 'justify-start'} mb-6`}>
      <div className={`max-w-4xl ${message?.sender === 'user' ? 'order-2' : 'order-1'}`}>
        <div className="flex items-start space-x-3">
          {message?.sender === 'ai' && (
            <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Bot" size={16} color="white" />
            </div>
          )}
          
          <div className="flex-1">
            <div className={`rounded-lg p-4 ${
              message?.sender === 'user' ?'bg-primary text-primary-foreground ml-12' :'bg-surface border border-border'
            }`}>
              {message?.content && (
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap">{message?.content}</p>
                </div>
              )}
              
              {message?.codeBlocks && message?.codeBlocks?.map(renderCodeBlock)}
              
              {message?.suggestions && (
                <div className="mt-4 space-y-2">
                  <h4 className="text-sm font-medium">Suggestions:</h4>
                  <div className="space-y-2">
                    {message?.suggestions?.map((suggestion, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <Icon name="Lightbulb" size={14} className="text-warning" />
                        <span>{suggestion}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between mt-2 px-1">
              <span className="text-xs text-muted-foreground">
                {formatTimestamp(message?.timestamp)}
              </span>
              
              {message?.sender === 'ai' && (
                <div className="flex items-center space-x-1">
                  <Button variant="ghost" size="icon" className="w-6 h-6">
                    <Icon name="ThumbsUp" size={12} />
                  </Button>
                  <Button variant="ghost" size="icon" className="w-6 h-6">
                    <Icon name="ThumbsDown" size={12} />
                  </Button>
                  <Button variant="ghost" size="icon" className="w-6 h-6">
                    <Icon name="RotateCcw" size={12} />
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {message?.sender === 'user' && (
            <div className="flex-shrink-0 w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
              <Icon name="User" size={16} color="white" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;