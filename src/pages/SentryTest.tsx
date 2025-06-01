import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Logger } from '@/utils/logger';
import { captureCustomEvent } from '@/lib/sentry';
import { useAuth } from '@/hooks/useAuth';

export default function SentryTest() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const { user } = useAuth();

  const addResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const testJavaScriptError = () => {
    try {
      addResult('Throwing JavaScript error...');
      throw new Error('Test JavaScript Error - This is a test error from Sentry integration');
    } catch (error) {
      addResult('Error thrown and should be captured by Sentry');
      throw error; // Re-throw to let Sentry catch it
    }
  };

  const testLoggerInfo = () => {
    addResult('Sending info log...');
    Logger.info('Test Info Log', {
      testType: 'manual',
      timestamp: new Date().toISOString(),
      user: user?.email
    });
    addResult('Info log sent to Logger (and Sentry in production)');
  };

  const testLoggerWarning = () => {
    addResult('Sending warning log...');
    Logger.warn('Test Warning Log', {
      testType: 'manual',
      warningLevel: 'medium',
      details: 'This is a test warning'
    });
    addResult('Warning log sent to Logger (and Sentry in production)');
  };

  const testLoggerError = () => {
    addResult('Sending error log...');
    Logger.error('Test Error Log', {
      error: new Error('Test error object'),
      severity: 'high',
      context: 'SentryTest component'
    });
    addResult('Error log sent to Logger (and Sentry in production)');
  };

  const testCustomEvent = () => {
    addResult('Sending custom event...');
    captureCustomEvent('test_custom_event', {
      action: 'button_click',
      component: 'SentryTest',
      timestamp: new Date().toISOString()
    });
    addResult('Custom event sent directly to Sentry (in production)');
  };

  const testAsyncError = async () => {
    addResult('Triggering async error...');
    setTimeout(() => {
      throw new Error('Test Async Error - Delayed error after 2 seconds');
    }, 2000);
    addResult('Async error will be thrown in 2 seconds...');
  };

  const testNetworkError = async () => {
    addResult('Triggering network error...');
    try {
      await fetch('https://nonexistent-api-endpoint.example.com/test');
    } catch (error) {
      addResult('Network error occurred and should be captured');
      Logger.error('Network request failed', { error });
    }
  };

  const testReferenceError = () => {
    addResult('Triggering reference error...');
    // @ts-ignore - Intentionally causing error
    nonExistentFunction(); // This will cause a ReferenceError
  };

  const clearResults = () => {
    setTestResults([]);
    addResult('Test results cleared');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Sentry Integration Test Page</h1>
        
        <div className="bg-yellow-50 border border-yellow-200 p-4 mb-6 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> Sentry is only active in production by default. 
            To test in development, temporarily modify <code>src/lib/sentry.ts</code> line 6:
            change <code>if (!import.meta.env.PROD)</code> to <code>if (false)</code>
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Button onClick={testJavaScriptError} variant="danger">
              Throw JavaScript Error
            </Button>
            <Button onClick={testLoggerInfo} variant="secondary">
              Test Logger Info
            </Button>
            <Button onClick={testLoggerWarning} variant="secondary">
              Test Logger Warning
            </Button>
            <Button onClick={testLoggerError} variant="danger">
              Test Logger Error
            </Button>
            <Button onClick={testCustomEvent} variant="primary">
              Send Custom Event
            </Button>
            <Button onClick={testAsyncError} variant="danger">
              Trigger Async Error
            </Button>
            <Button onClick={testNetworkError} variant="secondary">
              Trigger Network Error
            </Button>
            <Button onClick={testReferenceError} variant="danger">
              Trigger Reference Error
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Test Results</h2>
            <Button onClick={clearResults} size="sm" variant="secondary">
              Clear Results
            </Button>
          </div>
          <div className="bg-gray-50 rounded p-4 min-h-[200px]">
            {testResults.length === 0 ? (
              <p className="text-gray-500">No test results yet. Click a button above to test.</p>
            ) : (
              <ul className="space-y-2">
                {testResults.map((result, index) => (
                  <li key={index} className="text-sm font-mono">
                    {result}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">How to Verify in Sentry:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Go to your Sentry dashboard at sentry.io</li>
            <li>Navigate to Issues to see captured errors</li>
            <li>Check the Events tab for custom events and logs</li>
            <li>Look for user context (if logged in)</li>
            <li>Verify error details, stack traces, and metadata</li>
          </ol>
        </div>
      </div>
    </div>
  );
}