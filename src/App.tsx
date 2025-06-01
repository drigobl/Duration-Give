import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as Sentry from '@sentry/react';
import { ToastProvider } from './contexts/ToastContext';
import { AuthProvider } from './contexts/AuthContext';
import { Web3Provider } from './contexts/Web3Context';
import { SettingsProvider } from './contexts/SettingsContext';
import { AppRoutes } from './routes';
import { Layout } from './components/layout';
import { ErrorBoundary } from './components/ErrorBoundary';
import { MonitoringService } from './utils/monitoring';
import { ENV } from './config/env';

// Initialize monitoring if enabled
if (ENV.MONITORING_API_KEY && ENV.MONITORING_APP_ID) {
  MonitoringService.getInstance({
    apiKey: ENV.MONITORING_API_KEY,
    appId: ENV.MONITORING_APP_ID,
    environment: ENV.MONITORING_ENVIRONMENT,
    enabledMonitors: ENV.MONITORING_ENABLED_MONITORS
  });
}

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false
    }
  }
});

function App() {
  return (
    <Sentry.ErrorBoundary
      fallback={({ error, resetError }) => (
        <ErrorBoundary fallback={null}>
          <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
              <p className="text-gray-600 mb-6">{error?.message || 'An unexpected error occurred'}</p>
              <button
                onClick={resetError}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Try Again
              </button>
            </div>
          </div>
        </ErrorBoundary>
      )}
      showDialog={false}
    >
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
            <AuthProvider>
              <SettingsProvider>
                <Web3Provider>
                  <BrowserRouter>
                    <Layout>
                      <AppRoutes />
                    </Layout>
                  </BrowserRouter>
                </Web3Provider>
              </SettingsProvider>
            </AuthProvider>
          </ToastProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </Sentry.ErrorBoundary>
  );
}

export default App;