import React, { PropsWithChildren } from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { Web3Provider } from '@/contexts/Web3Context';

export function renderWithProviders(
  ui: React.ReactElement,
  { route = '/' } = {}
) {
  window.history.pushState({}, 'Test page', route);

  return render(ui, {
    wrapper: ({ children }: PropsWithChildren) => (
      <BrowserRouter>
        <ToastProvider>
          <AuthProvider>
            <Web3Provider>
              {children}
            </Web3Provider>
          </AuthProvider>
        </ToastProvider>
      </BrowserRouter>
    )
  });
}

export * from '@testing-library/react';