import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TestRunner = ({ 
  testSuites = [], 
  onRunTests, 
  onRunCollection,
  isRunning = false,
  testResults = null 
}) => {
  const [selectedSuite, setSelectedSuite] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const handleRunSuite = (suite) => {
    setSelectedSuite(suite);
    onRunTests(suite);
    setShowResults(true);
  };

  const getResultIcon = (status) => {
    switch (status) {
      case 'passed': return { name: 'CheckCircle', color: 'text-green-600' };
      case 'failed': return { name: 'XCircle', color: 'text-red-600' };
      case 'skipped': return { name: 'Minus', color: 'text-yellow-600' };
      default: return { name: 'Clock', color: 'text-gray-600' };
    }
  };

  const formatDuration = (ms) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000)?.toFixed(2)}s`;
  };

  return (
    <div className="bg-surface border-t border-border">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="TestTube" size={18} className="text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Test Runner</h3>
          {testResults && (
            <div className="flex items-center space-x-2 text-sm">
              <span className={`
                font-medium
                ${testResults?.summary?.failed === 0 ? 'text-green-600' : 'text-red-600'}
              `}>
                {testResults?.summary?.passed}/{testResults?.summary?.total} passed
              </span>
              <span className="text-muted-foreground">
                ({formatDuration(testResults?.summary?.duration)})
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowResults(!showResults)}
            disabled={!testResults}
          >
            <Icon name={showResults ? "ChevronDown" : "ChevronUp"} size={14} className="mr-2" />
            {showResults ? 'Hide Results' : 'Show Results'}
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => onRunCollection()}
            loading={isRunning}
            iconName="Play"
            iconPosition="left"
          >
            Run All
          </Button>
        </div>
      </div>
      {/* Test Suites */}
      {!showResults && (
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {testSuites?.map((suite) => (
              <div key={suite?.id} className="bg-muted/30 rounded-lg p-4 border border-border">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-1">{suite?.name}</h4>
                    <p className="text-xs text-muted-foreground">{suite?.description}</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-muted-foreground">
                      {suite?.tests?.length} tests
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {suite?.lastRun && (
                      <>
                        <Icon 
                          name={suite?.lastRun?.status === 'passed' ? 'CheckCircle' : 'XCircle'} 
                          size={14} 
                          className={suite?.lastRun?.status === 'passed' ? 'text-green-600' : 'text-red-600'}
                        />
                        <span className="text-xs text-muted-foreground">
                          {formatDuration(suite?.lastRun?.duration)}
                        </span>
                      </>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRunSuite(suite)}
                    loading={isRunning && selectedSuite?.id === suite?.id}
                  >
                    <Icon name="Play" size={12} className="mr-1" />
                    Run
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {testSuites?.length === 0 && (
            <div className="text-center py-8">
              <Icon name="TestTube" size={32} className="mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-3">No test suites found</p>
              <Button variant="outline" size="sm">
                Create Test Suite
              </Button>
            </div>
          )}
        </div>
      )}
      {/* Test Results */}
      {showResults && testResults && (
        <div className="max-h-96 overflow-y-auto">
          <div className="p-4">
            {/* Summary */}
            <div className="bg-muted/30 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-lg font-semibold text-foreground">
                    {testResults?.summary?.total}
                  </div>
                  <div className="text-xs text-muted-foreground">Total</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-green-600">
                    {testResults?.summary?.passed}
                  </div>
                  <div className="text-xs text-muted-foreground">Passed</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-red-600">
                    {testResults?.summary?.failed}
                  </div>
                  <div className="text-xs text-muted-foreground">Failed</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-yellow-600">
                    {testResults?.summary?.skipped}
                  </div>
                  <div className="text-xs text-muted-foreground">Skipped</div>
                </div>
              </div>
            </div>

            {/* Test Details */}
            <div className="space-y-3">
              {testResults?.tests?.map((test, index) => {
                const resultIcon = getResultIcon(test?.status);
                return (
                  <div key={index} className={`
                    p-3 rounded-lg border
                    ${test?.status === 'passed' ? 'bg-green-50 border-green-200' :
                      test?.status === 'failed'? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'}
                  `}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <Icon name={resultIcon?.name} size={16} className={resultIcon?.color} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-sm font-medium text-foreground">
                              {test?.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {test?.method} {test?.endpoint}
                            </span>
                          </div>
                          {test?.error && (
                            <p className="text-xs text-red-600 mt-1">{test?.error}</p>
                          )}
                          {test?.assertions && (
                            <div className="mt-2 space-y-1">
                              {test?.assertions?.map((assertion, idx) => (
                                <div key={idx} className="flex items-center space-x-2 text-xs">
                                  <Icon 
                                    name={assertion?.passed ? "Check" : "X"} 
                                    size={12} 
                                    className={assertion?.passed ? 'text-green-600' : 'text-red-600'}
                                  />
                                  <span className="text-muted-foreground">{assertion?.description}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDuration(test?.duration)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestRunner;