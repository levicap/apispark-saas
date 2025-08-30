import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { useToast } from '../../../contexts/ToastContext';

const EndpointDetails = ({ endpoint, isSelected, onSelect }) => {
  const [copiedCode, setCopiedCode] = useState(null);
  const { success } = useToast();

  if (!endpoint) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <div className="text-center">
          <Icon name="FileText" size={48} className="mx-auto mb-4 opacity-50" />
          <p>Select an endpoint to view documentation</p>
        </div>
      </div>
    );
  }

  const getMethodColor = (method) => {
    switch (method?.toUpperCase()) {
      case 'GET':
        return 'text-green-600 bg-green-100 border-green-300';
      case 'POST':
        return 'text-blue-600 bg-blue-100 border-blue-300';
      case 'PUT':
        return 'text-orange-600 bg-orange-100 border-orange-300';
      case 'DELETE':
        return 'text-red-600 bg-red-100 border-red-300';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(type);
    success('Code copied to clipboard!');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getStatusCodeColor = (code) => {
    if (code >= 200 && code < 300) return 'text-green-600 bg-green-100';
    if (code >= 400 && code < 500) return 'text-orange-600 bg-orange-100';
    if (code >= 500) return 'text-red-600 bg-red-100';
    return 'text-muted-foreground bg-muted';
  };

  return (
    <div className={`p-8 border rounded-xl transition-all duration-200 ${
      isSelected ? 'border-primary bg-primary/5 shadow-lg' : 'border-border hover:border-primary/50 hover:shadow-md'
    }`}>
      {/* Endpoint Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <span className={`px-4 py-2 text-sm font-medium rounded-lg border ${getMethodColor(endpoint.method)}`}>
            {endpoint.method}
          </span>
          <code className="text-xl font-mono bg-muted px-4 py-2 rounded-lg text-foreground">
            {endpoint.path}
          </code>
        </div>
        
        <h2 className="text-2xl font-semibold text-foreground mb-4">{endpoint.name}</h2>
        <div className="prose prose-lg max-w-none text-muted-foreground">
          <p className="text-lg leading-relaxed">{endpoint.description}</p>
        </div>
      </div>

      {/* Parameters */}
      {endpoint.parameters && endpoint.parameters.length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-foreground mb-6">Parameters</h3>
          <div className="overflow-x-auto">
            <table className="w-full border border-border rounded-xl">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Required</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-foreground">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {endpoint.parameters.map((param, index) => (
                  <tr key={index} className="hover:bg-muted/50">
                    <td className="px-6 py-4">
                      <code className="text-sm bg-muted px-3 py-1 rounded-lg text-foreground">{param.name}</code>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{param.type}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                        param.required 
                          ? 'text-red-600 bg-red-100' : 'text-muted-foreground bg-muted'
                      }`}>
                        {param.required ? 'Required' : 'Optional'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{param.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Responses */}
      {endpoint.responses && Object.keys(endpoint.responses).length > 0 && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-foreground mb-6">Responses</h3>
          <div className="space-y-6">
            {Object.entries(endpoint.responses).map(([code, response]) => (
              <div key={code} className="border border-border rounded-xl p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <span className={`px-3 py-1 text-sm font-medium rounded-lg ${getStatusCodeColor(parseInt(code))}`}>
                    {code}
                  </span>
                  <span className="text-base font-medium text-foreground">{response.description}</span>
                </div>
                {response.schema && (
                  <div className="bg-muted p-4 rounded-lg">
                    <pre className="text-sm text-foreground overflow-x-auto">
                      <code>{JSON.stringify(response.schema, null, 2)}</code>
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Code Examples */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-foreground mb-6">Code Examples</h3>
        <div className="space-y-6">
          {/* cURL Example */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-base font-medium text-foreground">cURL</h4>
              <button
                onClick={() => copyToClipboard(`curl -X ${endpoint.method} "https://api.example.com${endpoint.path}"`, 'curl')}
                className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon name={copiedCode === 'curl' ? 'Check' : 'Copy'} size={16} />
                <span>{copiedCode === 'curl' ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <pre className="text-sm text-foreground overflow-x-auto">
                <code>{`curl -X ${endpoint.method} "https://api.example.com${endpoint.path}"`}</code>
              </pre>
            </div>
          </div>

          {/* JavaScript Example */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-base font-medium text-foreground">JavaScript</h4>
              <button
                onClick={() => copyToClipboard(`fetch("https://api.example.com${endpoint.path}", {
  method: "${endpoint.method}",
  headers: {
    "Content-Type": "application/json"
  }
})`, 'js')}
                className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon name={copiedCode === 'js' ? 'Check' : 'Copy'} size={16} />
                <span>{copiedCode === 'js' ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <pre className="text-sm text-foreground overflow-x-auto">
                <code>{`fetch("https://api.example.com${endpoint.path}", {
  method: "${endpoint.method}",
  headers: {
    "Content-Type": "application/json"
  }
})`}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EndpointDetails;