import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ResponseViewer = ({ response = null, isLoading = false }) => {
  const [activeTab, setActiveTab] = useState('body');
  const [bodyFormat, setBodyFormat] = useState('pretty');

  const tabs = [
    { id: 'body', label: 'Body', icon: 'FileText' },
    { id: 'headers', label: 'Headers', icon: 'Settings' },
    { id: 'cookies', label: 'Cookies', icon: 'Cookie' },
    { id: 'test-results', label: 'Test Results', icon: 'CheckCircle' }
  ];

  const getStatusColor = (status) => {
    if (status >= 200 && status < 300) return 'text-green-600 bg-green-50';
    if (status >= 300 && status < 400) return 'text-blue-600 bg-blue-50';
    if (status >= 400 && status < 500) return 'text-orange-600 bg-orange-50';
    if (status >= 500) return 'text-red-600 bg-red-50';
    return 'text-gray-600 bg-gray-50';
  };

  const formatJson = (jsonString) => {
    try {
      return JSON.stringify(JSON.parse(jsonString), null, 2);
    } catch {
      return jsonString;
    }
  };

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-surface border-l border-border">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Sending request...</p>
        </div>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="h-full flex items-center justify-center bg-surface border-l border-border">
        <div className="text-center">
          <Icon name="Activity" size={48} className="mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium text-foreground mb-2">No Response</h3>
          <p className="text-sm text-muted-foreground">
            Send a request to see the response here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-surface border-l border-border">
      {/* Response Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 text-sm font-medium rounded-md ${getStatusColor(response?.status)}`}>
              {response?.status} {response?.statusText}
            </span>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span className="flex items-center space-x-1">
                <Icon name="Clock" size={14} />
                <span>{response?.time}ms</span>
              </span>
              <span className="flex items-center space-x-1">
                <Icon name="Download" size={14} />
                <span>{formatSize(response?.size)}</span>
              </span>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm">
              <Icon name="Copy" size={14} className="mr-2" />
              Copy
            </Button>
            <Button variant="ghost" size="sm">
              <Icon name="Download" size={14} className="mr-2" />
              Save
            </Button>
          </div>
        </div>
      </div>
      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex space-x-0">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`
                flex items-center space-x-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors
                ${activeTab === tab?.id
                  ? 'border-primary text-primary bg-primary/5' :'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }
              `}
            >
              <Icon name={tab?.icon} size={14} />
              <span>{tab?.label}</span>
              {tab?.id === 'headers' && response?.headers && (
                <span className="text-xs bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
                  {Object.keys(response?.headers)?.length}
                </span>
              )}
              {tab?.id === 'test-results' && response?.testResults && (
                <span className={`
                  text-xs px-1.5 py-0.5 rounded
                  ${response?.testResults?.passed === response?.testResults?.total
                    ? 'bg-green-100 text-green-700' :'bg-red-100 text-red-700'
                  }
                `}>
                  {response?.testResults?.passed}/{response?.testResults?.total}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'body' && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-foreground">Response Body</h3>
              <div className="flex space-x-2">
                <Button
                  variant={bodyFormat === 'pretty' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setBodyFormat('pretty')}
                >
                  Pretty
                </Button>
                <Button
                  variant={bodyFormat === 'raw' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setBodyFormat('raw')}
                >
                  Raw
                </Button>
                <Button
                  variant={bodyFormat === 'preview' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setBodyFormat('preview')}
                >
                  Preview
                </Button>
              </div>
            </div>

            <div className="bg-muted/30 rounded-md p-4">
              <pre className="text-sm font-mono text-foreground whitespace-pre-wrap overflow-x-auto">
                {bodyFormat === 'pretty' && response?.contentType?.includes('json')
                  ? formatJson(response?.body)
                  : response?.body
                }
              </pre>
            </div>
          </div>
        )}

        {activeTab === 'headers' && (
          <div className="p-4">
            <h3 className="text-sm font-medium text-foreground mb-4">Response Headers</h3>
            <div className="space-y-2">
              {response?.headers && Object.entries(response?.headers)?.map(([key, value]) => (
                <div key={key} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-md">
                  <span className="text-sm font-medium text-foreground min-w-0 flex-shrink-0">
                    {key}:
                  </span>
                  <span className="text-sm text-muted-foreground font-mono break-all">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'cookies' && (
          <div className="p-4">
            <h3 className="text-sm font-medium text-foreground mb-4">Cookies</h3>
            {response?.cookies && response?.cookies?.length > 0 ? (
              <div className="space-y-2">
                {response?.cookies?.map((cookie, index) => (
                  <div key={index} className="p-3 bg-muted/30 rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">{cookie?.name}</span>
                      <span className="text-xs text-muted-foreground">{cookie?.domain}</span>
                    </div>
                    <p className="text-sm text-muted-foreground font-mono break-all">
                      {cookie?.value}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                      <span>Path: {cookie?.path}</span>
                      <span>Expires: {cookie?.expires}</span>
                      {cookie?.httpOnly && <span className="text-orange-600">HttpOnly</span>}
                      {cookie?.secure && <span className="text-green-600">Secure</span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Icon name="Cookie" size={32} className="mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No cookies in response</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'test-results' && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-foreground">Test Results</h3>
              {response?.testResults && (
                <div className="flex items-center space-x-2">
                  <span className={`
                    text-sm font-medium
                    ${response?.testResults?.passed === response?.testResults?.total
                      ? 'text-green-600' :'text-red-600'
                    }
                  `}>
                    {response?.testResults?.passed}/{response?.testResults?.total} passed
                  </span>
                </div>
              )}
            </div>

            {response?.testResults && response?.testResults?.tests ? (
              <div className="space-y-2">
                {response?.testResults?.tests?.map((test, index) => (
                  <div key={index} className={`
                    flex items-center space-x-3 p-3 rounded-md
                    ${test?.passed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}
                  `}>
                    <Icon 
                      name={test?.passed ? "CheckCircle" : "XCircle"} 
                      size={16} 
                      className={test?.passed ? 'text-green-600' : 'text-red-600'}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{test?.name}</p>
                      {test?.error && (
                        <p className="text-xs text-red-600 mt-1">{test?.error}</p>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">{test?.duration}ms</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Icon name="TestTube" size={32} className="mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-3">No test results available</p>
                <Button variant="outline" size="sm">
                  Add Tests
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResponseViewer;