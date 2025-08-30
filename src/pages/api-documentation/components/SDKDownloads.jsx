import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const SDKDownloads = ({ apiInfo }) => {
  const [selectedSDK, setSelectedSDK] = useState('javascript');

  const sdks = [
    {
      id: 'javascript',
      name: 'JavaScript SDK',
      language: 'JavaScript',
      description: 'Full-featured SDK for Node.js and browser environments with TypeScript support',
      version: '2.1.0',
      size: '45 KB',
      icon: 'Code',
      features: ['Promise-based API', 'TypeScript definitions', 'Automatic retries', 'Request/response interceptors'],
      installation: 'npm install @ecommerce-api/javascript-sdk',
      example: `import { EcommerceAPI } from '@ecommerce-api/javascript-sdk';

const api = new EcommerceAPI({
  apiKey: 'your-api-key',
  baseURL: 'https://api.ecommerce-demo.com/v2'
});

// Get products
const products = await api.products.list({
  category: 'electronics',
  limit: 20
});

// Create order
const order = await api.orders.create({
  items: [{ product_id: 1001, quantity: 2 }],
  shipping_address: {
    name: 'John Doe',
    street: '123 Main St',
    city: 'New York',
    state: 'NY',
    zip: '10001'
  }
});`
    },
    {
      id: 'python',
      name: 'Python SDK',
      language: 'Python',
      description: 'Pythonic SDK with async support and comprehensive error handling',
      version: '2.0.5',
      size: '120 KB',
      icon: 'Code',
      features: ['Async/await support', 'Pydantic models', 'Automatic pagination', 'Built-in validation'],
      installation: 'pip install ecommerce-api-python',
      example: `from ecommerce_api import EcommerceAPI

# Initialize client
api = EcommerceAPI(
    api_key='your-api-key',
    base_url='https://api.ecommerce-demo.com/v2'
)

# Get products
products = api.products.list(
    category='electronics',
    limit=20
)

# Create order
order = api.orders.create({
    'items': [{'product_id': 1001, 'quantity': 2}],
    'shipping_address': {
        'name': 'John Doe',
        'street': '123 Main St',
        'city': 'New York',
        'state': 'NY',
        'zip': '10001'
    }
})`
    },
    {
      id: 'php',
      name: 'PHP SDK',
      language: 'PHP',
      description: 'Modern PHP SDK with PSR-4 autoloading and comprehensive documentation',
      version: '1.8.2',
      size: '85 KB',
      icon: 'Code',
      features: ['PSR-4 autoloading', 'Guzzle HTTP client', 'Exception handling', 'Laravel integration'],
      installation: 'composer require ecommerce-api/php-sdk',
      example: `<?php
use EcommerceAPI\\Client;

$api = new Client([
    'api_key' => 'your-api-key',
    'base_url' => 'https://api.ecommerce-demo.com/v2'
]);

// Get products
$products = $api->products()->list([
    'category' => 'electronics',
    'limit' => 20
]);

// Create order
$order = $api->orders()->create([
    'items' => [
        ['product_id' => 1001, 'quantity' => 2]
    ],
    'shipping_address' => [
        'name' => 'John Doe',
        'street' => '123 Main St',
        'city' => 'New York',
        'state' => 'NY',
        'zip' => '10001'
    ]
]);`
    },
    {
      id: 'ruby',
      name: 'Ruby SDK',
      language: 'Ruby',
      description: 'Elegant Ruby SDK following Rails conventions with comprehensive testing',
      version: '1.5.0',
      size: '65 KB',
      icon: 'Code',
      features: ['Rails integration', 'ActiveModel support', 'Comprehensive specs', 'Flexible configuration'],
      installation: 'gem install ecommerce_api',
      example: `require 'ecommerce_api'

# Configure client
EcommerceAPI.configure do |config|
  config.api_key = 'your-api-key'
  config.base_url = 'https://api.ecommerce-demo.com/v2'
end

# Get products
products = EcommerceAPI::Product.list(
  category: 'electronics',
  limit: 20
)

# Create order
order = EcommerceAPI::Order.create(
  items: [{ product_id: 1001, quantity: 2 }],
  shipping_address: {
    name: 'John Doe',
    street: '123 Main St',
    city: 'New York',
    state: 'NY',
    zip: '10001'
  }
)`
    },
    {
      id: 'go',
      name: 'Go SDK',
      language: 'Go',
      description: 'High-performance Go SDK with context support and structured logging',
      version: '1.3.1',
      size: '2.1 MB',
      icon: 'Code',
      features: ['Context support', 'Structured logging', 'Connection pooling', 'Comprehensive testing'],
      installation: 'go get github.com/ecommerce-api/go-sdk',
      example: `package main

import (
    "context" "github.com/ecommerce-api/go-sdk"
)

func main() {
    client := ecommerce.NewClient(&ecommerce.Config{
        APIKey:  "your-api-key",
        BaseURL: "https://api.ecommerce-demo.com/v2",
    })

    // Get products
    products, err := client.Products.List(context.Background(), &ecommerce.ProductListParams{
        Category: "electronics",
        Limit:    20,
    })

    // Create order
    order, err := client.Orders.Create(context.Background(), &ecommerce.OrderCreateParams{
        Items: []ecommerce.OrderItem{
            {ProductID: 1001, Quantity: 2},
        },
        ShippingAddress: ecommerce.Address{
            Name:   "John Doe",
            Street: "123 Main St",
            City:   "New York",
            State:  "NY",
            Zip:    "10001",
        },
    })
}`
    },
    {
      id: 'csharp',
      name: 'C# SDK',
      language: 'C#',
      description: '.NET SDK with async/await support and strong typing throughout',
      version: '2.2.0',
      size: '180 KB',
      icon: 'Code',
      features: ['Async/await support', 'Strong typing', 'NuGet package', 'Comprehensive documentation'],
      installation: 'Install-Package EcommerceAPI.SDK',
      example: `using EcommerceAPI;

var client = new EcommerceAPIClient(new EcommerceAPIConfig
{
    ApiKey = "your-api-key",
    BaseUrl = "https://api.ecommerce-demo.com/v2"
});

// Get products
var products = await client.Products.ListAsync(new ProductListRequest
{
    Category = "electronics",
    Limit = 20
});

// Create order
var order = await client.Orders.CreateAsync(new OrderCreateRequest
{
    Items = new[]
    {
        new OrderItem { ProductId = 1001, Quantity = 2 }
    },
    ShippingAddress = new Address
    {
        Name = "John Doe",
        Street = "123 Main St",
        City = "New York",
        State = "NY",
        Zip = "10001"
    }
});`
    }
  ];

  const currentSDK = sdks.find(sdk => sdk.id === selectedSDK);

  const handleDownload = (sdkId) => {
    console.log(`Downloading SDK: ${sdkId}`);
    // Download logic would go here
  };

  const copyInstallCommand = (command) => {
    navigator.clipboard.writeText(command);
  };

  const copyExample = (example) => {
    navigator.clipboard.writeText(example);
  };

  return (
    <div className="p-6 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-text-primary mb-2">SDK Downloads</h2>
        <p className="text-text-secondary">
          Official SDKs and libraries to integrate with the {apiInfo.title} in your preferred programming language.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* SDK List */}
        <div className="lg:col-span-1">
          <h3 className="font-semibold text-text-primary mb-4">Available SDKs</h3>
          <div className="space-y-2">
            {sdks.map((sdk) => (
              <button
                key={sdk.id}
                onClick={() => setSelectedSDK(sdk.id)}
                className={`w-full text-left p-4 rounded-lg border transition-all duration-150 ease-out ${
                  selectedSDK === sdk.id
                    ? 'border-primary bg-primary-50 text-primary' :'border-border bg-surface hover:border-secondary-300 text-text-secondary hover:text-text-primary'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon name={sdk.icon} size={20} />
                  <div className="flex-1">
                    <div className="font-medium">{sdk.name}</div>
                    <div className="text-sm opacity-75">v{sdk.version} • {sdk.size}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* SDK Details */}
        <div className="lg:col-span-2">
          {currentSDK && (
            <div className="bg-surface border border-border rounded-lg overflow-hidden">
              {/* Header */}
              <div className="px-6 py-4 border-b border-border bg-secondary-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary">{currentSDK.name}</h3>
                    <p className="text-sm text-text-secondary mt-1">{currentSDK.description}</p>
                  </div>
                  <button
                    onClick={() => handleDownload(currentSDK.id)}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary text-white hover:bg-primary-700 rounded-md transition-all duration-150 ease-out"
                  >
                    <Icon name="Download" size={16} />
                    <span>Download</span>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Features */}
                <div className="mb-6">
                  <h4 className="font-medium text-text-primary mb-3">Features</h4>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {currentSDK.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Icon name="Check" size={14} color="var(--color-success)" />
                        <span className="text-sm text-text-secondary">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Installation */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-text-primary">Installation</h4>
                    <button
                      onClick={() => copyInstallCommand(currentSDK.installation)}
                      className="flex items-center space-x-1 px-2 py-1 bg-secondary-100 hover:bg-secondary-200 text-text-secondary hover:text-text-primary rounded transition-all duration-150 ease-out"
                    >
                      <Icon name="Copy" size={12} />
                      <span className="text-xs">Copy</span>
                    </button>
                  </div>
                  <div className="bg-secondary-800 rounded-lg p-3">
                    <code className="text-sm text-white font-mono">{currentSDK.installation}</code>
                  </div>
                </div>

                {/* Example */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-text-primary">Quick Start Example</h4>
                    <button
                      onClick={() => copyExample(currentSDK.example)}
                      className="flex items-center space-x-1 px-2 py-1 bg-secondary-100 hover:bg-secondary-200 text-text-secondary hover:text-text-primary rounded transition-all duration-150 ease-out"
                    >
                      <Icon name="Copy" size={12} />
                      <span className="text-xs">Copy</span>
                    </button>
                  </div>
                  <div className="bg-secondary-800 rounded-lg overflow-hidden">
                    <div className="px-4 py-2 bg-secondary-700 border-b border-secondary-600">
                      <span className="text-sm text-white font-medium">{currentSDK.language}</span>
                    </div>
                    <pre className="p-4 text-sm text-white overflow-x-auto">
                      <code>{currentSDK.example}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Additional Resources */}
      <div className="mt-8 grid md:grid-cols-3 gap-6">
        <div className="bg-surface border border-border rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Icon name="BookOpen" size={20} color="var(--color-primary)" />
            </div>
            <h3 className="font-semibold text-text-primary">Documentation</h3>
          </div>
          <p className="text-sm text-text-secondary mb-4">
            Comprehensive guides and API reference for each SDK with examples and best practices.
          </p>
          <button className="text-primary hover:text-primary-700 text-sm font-medium">
            View Documentation →
          </button>
        </div>

        <div className="bg-surface border border-border rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
              <Icon name="Github" size={20} color="var(--color-success)" />
            </div>
            <h3 className="font-semibold text-text-primary">Source Code</h3>
          </div>
          <p className="text-sm text-text-secondary mb-4">
            All SDKs are open source. View the code, contribute, or report issues on GitHub.
          </p>
          <button className="text-primary hover:text-primary-700 text-sm font-medium">
            View on GitHub →
          </button>
        </div>

        <div className="bg-surface border border-border rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center">
              <Icon name="MessageCircle" size={20} color="var(--color-warning)" />
            </div>
            <h3 className="font-semibold text-text-primary">Support</h3>
          </div>
          <p className="text-sm text-text-secondary mb-4">
            Get help with SDK integration, report bugs, or request new features from our support team.
          </p>
          <button className="text-primary hover:text-primary-700 text-sm font-medium">
            Get Support →
          </button>
        </div>
      </div>
    </div>
  );
};

export default SDKDownloads;