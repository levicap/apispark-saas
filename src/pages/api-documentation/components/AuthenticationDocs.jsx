import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const AuthenticationDocs = ({ authentication }) => {
  const [copiedToken, setCopiedToken] = useState(false);

  const sampleToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

  const copyToken = () => {
    navigator.clipboard.writeText(sampleToken);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const authExamples = {
    javascript: `// Using fetch with Authorization header
const response = await fetch('/api/endpoint', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer ' + accessToken,
    'Content-Type': 'application/json'
  }
});

// Using axios with default headers
axios.defaults.headers.common['Authorization'] = 'Bearer ' + accessToken;

// Or with individual requests
const response = await axios.get('/api/endpoint', {
  headers: {
    'Authorization': 'Bearer ' + accessToken
  }
});`,
    python: `import requests

# Using requests with headers
headers = {
    'Authorization': f'Bearer {access_token}',
    'Content-Type': 'application/json'
}

response = requests.get('/api/endpoint', headers=headers)

# Using requests session for multiple calls
session = requests.Session()
session.headers.update({'Authorization': f'Bearer {access_token}'})
response = session.get('/api/endpoint')`,
    curl: `# Using cURL with Authorization header
curl -X GET https://api.example.com/endpoint \\
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \ -H"Content-Type: application/json"

# For POST requests with data
curl -X POST https://api.example.com/endpoint \\
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \ -H"Content-Type: application/json" \\
  -d '{"key": "value"}'`
  };

  const [selectedLanguage, setSelectedLanguage] = useState('javascript');

  const languages = [
    { id: 'javascript', label: 'JavaScript' },
    { id: 'python', label: 'Python' },
    { id: 'curl', label: 'cURL' }
  ];

  const authFlow = [
    {
      step: 1,
      title: 'Login Request',
      description: 'Send user credentials to the login endpoint',
      endpoint: 'POST /auth/login',
      icon: 'LogIn'
    },
    {
      step: 2,
      title: 'Receive Tokens',
      description: 'Get access token and refresh token from response',
      endpoint: 'Response: tokens + user info',
      icon: 'Key'
    },
    {
      step: 3,
      title: 'Include in Requests',
      description: 'Add Bearer token to Authorization header',
      endpoint: 'Header: Authorization: Bearer <token>',
      icon: 'Shield'
    },
    {
      step: 4,
      title: 'Token Refresh',
      description: 'Use refresh token when access token expires',
      endpoint: 'POST /auth/refresh',
      icon: 'RefreshCw'
    }
  ];

  return (
    <div className="p-6 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary mb-2">Authentication</h2>
        <div className="prose prose-lg max-w-none text-text-secondary">
          <p>{authentication.description}</p>
        </div>
      </div>

      {/* Authentication Type */}
      <div className="mb-8">
        <div className="bg-surface border border-border rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Icon name="Shield" size={20} color="var(--color-primary)" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-primary">{authentication.type}</h3>
              <p className="text-sm text-text-secondary">Secure token-based authentication</p>
            </div>
          </div>
          
          <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-text-primary">Example Authorization Header</span>
              <button
                onClick={copyToken}
                className="flex items-center space-x-1 px-2 py-1 bg-secondary-100 hover:bg-secondary-200 text-text-secondary hover:text-text-primary rounded transition-all duration-150 ease-out"
              >
                <Icon name={copiedToken ? "Check" : "Copy"} size={12} />
                <span className="text-xs">{copiedToken ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <code className="text-sm font-mono text-text-primary break-all">
              {authentication.example}
            </code>
          </div>
        </div>
      </div>

      {/* Authentication Flow */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-text-primary mb-6">Authentication Flow</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {authFlow.map((step) => (
            <div key={step.step} className="relative">
              <div className="bg-surface border border-border rounded-lg p-4 h-full">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {step.step}
                  </div>
                  <Icon name={step.icon} size={16} color="var(--color-primary)" />
                </div>
                <h4 className="font-medium text-text-primary mb-2">{step.title}</h4>
                <p className="text-sm text-text-secondary mb-3">{step.description}</p>
                <code className="text-xs bg-secondary-100 px-2 py-1 rounded font-mono text-text-primary">
                  {step.endpoint}
                </code>
              </div>
              
              {step.step < authFlow.length && (
                <div className="hidden lg:block absolute top-1/2 -right-2 transform -translate-y-1/2">
                  <Icon name="ArrowRight" size={16} className="text-text-secondary" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Code Examples */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">Implementation Examples</h3>
          <div className="flex items-center space-x-1 bg-secondary-100 rounded-md p-1">
            {languages.map((lang) => (
              <button
                key={lang.id}
                onClick={() => setSelectedLanguage(lang.id)}
                className={`px-3 py-1.5 text-sm rounded transition-all duration-150 ease-out ${
                  selectedLanguage === lang.id
                    ? 'bg-surface text-text-primary shadow-sm'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-secondary-800 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-secondary-700">
            <span className="text-sm text-white font-medium capitalize">{selectedLanguage}</span>
            <button
              onClick={() => navigator.clipboard.writeText(authExamples[selectedLanguage])}
              className="flex items-center space-x-2 px-2 py-1 bg-secondary-600 hover:bg-secondary-500 text-white rounded transition-all duration-150 ease-out"
            >
              <Icon name="Copy" size={12} />
              <span className="text-xs">Copy</span>
            </button>
          </div>
          <pre className="p-4 text-sm text-white overflow-x-auto">
            <code>{authExamples[selectedLanguage]}</code>
          </pre>
        </div>
      </div>

      {/* Security Best Practices */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Security Best Practices</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-success-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon name="Check" size={12} color="var(--color-success)" />
              </div>
              <div>
                <h4 className="font-medium text-text-primary mb-1">Store Tokens Securely</h4>
                <p className="text-sm text-text-secondary">Use secure storage mechanisms like httpOnly cookies or encrypted local storage</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-success-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon name="Check" size={12} color="var(--color-success)" />
              </div>
              <div>
                <h4 className="font-medium text-text-primary mb-1">Implement Token Refresh</h4>
                <p className="text-sm text-text-secondary">Automatically refresh tokens before expiration to maintain session</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-success-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon name="Check" size={12} color="var(--color-success)" />
              </div>
              <div>
                <h4 className="font-medium text-text-primary mb-1">Use HTTPS Only</h4>
                <p className="text-sm text-text-secondary">Always transmit tokens over encrypted connections</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-error-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon name="X" size={12} color="var(--color-error)" />
              </div>
              <div>
                <h4 className="font-medium text-text-primary mb-1">Don't Store in Plain Text</h4>
                <p className="text-sm text-text-secondary">Avoid storing tokens in plain text files or unencrypted databases</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-error-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon name="X" size={12} color="var(--color-error)" />
              </div>
              <div>
                <h4 className="font-medium text-text-primary mb-1">Don't Log Tokens</h4>
                <p className="text-sm text-text-secondary">Never include tokens in application logs or error messages</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-error-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon name="X" size={12} color="var(--color-error)" />
              </div>
              <div>
                <h4 className="font-medium text-text-primary mb-1">Don't Share Tokens</h4>
                <p className="text-sm text-text-secondary">Keep tokens private and don't share them between applications</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Token Information */}
      <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="AlertTriangle" size={20} color="var(--color-warning)" />
          <div>
            <h4 className="font-medium text-warning mb-2">Token Expiration</h4>
            <div className="text-sm text-warning space-y-1">
              <p>• Access tokens expire after 1 hour for security</p>
              <p>• Refresh tokens are valid for 30 days</p>
              <p>• Implement automatic token refresh to avoid interruptions</p>
              <p>• Monitor token expiration in your application logs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthenticationDocs;