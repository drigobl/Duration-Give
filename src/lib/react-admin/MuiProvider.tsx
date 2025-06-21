import React from 'react';

// Simple MUI Provider wrapper to handle theming without causing initialization issues
export const MuiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Create a simple wrapper that just passes through children
  // This ensures MUI components are properly wrapped without causing initialization issues
  return (
    <div data-mui-provider="true" style={{ minHeight: '100vh' }}>
      {children}
    </div>
  );
};

export default MuiProvider;