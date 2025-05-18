import '@testing-library/cypress/add-commands';

declare global {
  namespace Cypress {
    interface Chainable {
      login(email?: string, password?: string): Chainable<void>;
      connectWallet(): Chainable<void>;
    }
  }
}

Cypress.Commands.add('login', (
  email = 'test@example.com',
  password = 'password'
) => {
  cy.session([email, password], () => {
    cy.request({
      method: 'POST',
      url: '/auth/login',
      body: { email, password }
    }).then((response) => {
      window.localStorage.setItem(
        'supabase.auth.token',
        JSON.stringify(response.body)
      );
    });
  });
});

Cypress.Commands.add('connectWallet', () => {
  cy.window().then((win) => {
    win.ethereum = {
      isMetaMask: true,
      request: (args: { method: string; params?: any[] }) => {
        if (args.method === 'eth_requestAccounts') {
          return Promise.resolve(['0x1234567890123456789012345678901234567890']);
        }
        return Promise.resolve();
      },
      on: () => {},
      removeListener: () => {}
    };
  });

  cy.get('[data-testid="connect-wallet"]').click();
});

export {};