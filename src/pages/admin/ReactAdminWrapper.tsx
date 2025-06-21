import React, { Suspense, lazy, useEffect, useState } from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { initializeEmotion } from '@/lib/react-admin/emotion-polyfill';

// Lazy load React-Admin to avoid initialization issues
const ReactAdminApp = lazy(() => 
  import('./ReactAdmin').then(module => ({ 
    default: module.ReactAdminApp 
  }))
);

export const ReactAdminWrapper: React.FC = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        await initializeEmotion();
        // Add small delay to ensure everything is ready
        setTimeout(() => setIsReady(true), 100);
      } catch (error) {
        console.error('Failed to initialize Emotion:', error);
        setIsReady(true); // Continue anyway
      }
    };

    initialize();
  }, []);

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    }>
      <ReactAdminApp />
    </Suspense>
  );
};

export default ReactAdminWrapper;