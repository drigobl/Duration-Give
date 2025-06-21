import React, { Suspense, lazy } from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

// Lazy load React-Admin to avoid initialization issues
const ReactAdminApp = lazy(() => 
  import('./ReactAdmin').then(module => ({ 
    default: module.ReactAdminApp 
  }))
);

export const ReactAdminWrapper: React.FC = () => {
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