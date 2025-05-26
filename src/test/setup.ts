import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
import { setupServer } from 'msw/node';
import { handlers } from './mocks/handlers';

// Mock TextEncoder/TextDecoder
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock window.crypto
Object.defineProperty(window, 'crypto', {
  value: {
    subtle: {
      digest: jest.fn()
    },
    getRandomValues: jest.fn()
  }
});

// Setup MSW
export const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null
});
window.IntersectionObserver = mockIntersectionObserver;

// Mock ResizeObserver
window.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn()
}));