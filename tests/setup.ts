// Global test setup
import { notifyManager } from '@tanstack/react-query';

// Make TanStack Query notify synchronously so state updates don't fire
// in a deferred setTimeout outside React's act() boundary.
notifyManager.setScheduler((cb) => cb());

// Suppress known React 19 + react-test-renderer + TanStack Query cosmetic warnings.
// These fire when the notifyManager batch runs synchronously inside/outside act()
// and react-test-renderer's concurrent-mode env check fires. Tests still pass correctly.
const originalError = console.error.bind(console);
console.error = (...args: Parameters<typeof console.error>) => {
  const msg = typeof args[0] === 'string' ? args[0] : '';
  if (
    msg.includes('not configured to support act') ||
    msg.includes('inside a test was not wrapped in act')
  ) {
    return;
  }
  originalError(...args);
};

jest.mock('../src/core/reference/reference.service', () => ({
  referenceService: {
    getReference: jest.fn(() => Promise.resolve(jest.requireActual('./fixtures/reference').REFERENCE)),
  },
}));

// Native Google sign-in module: unavailable under Jest.
jest.mock('@react-native-google-signin/google-signin', () => ({
  GoogleSignin: {
    configure: jest.fn(),
    hasPlayServices: jest.fn(() => Promise.resolve(true)),
    hasPreviousSignIn: jest.fn(() => false),
    signIn: jest.fn(() => Promise.resolve({ type: 'cancelled', data: null })),
    signOut: jest.fn(() => Promise.resolve(null)),
  },
  isCancelledResponse: (response: { type: string }) => response.type === 'cancelled',
  isErrorWithCode: (error: unknown) =>
    error instanceof Error && typeof (error as Error & { code?: unknown }).code === 'string',
  statusCodes: {
    SIGN_IN_CANCELLED: 'SIGN_IN_CANCELLED',
    IN_PROGRESS: 'IN_PROGRESS',
    PLAY_SERVICES_NOT_AVAILABLE: 'PLAY_SERVICES_NOT_AVAILABLE',
    SIGN_IN_REQUIRED: 'SIGN_IN_REQUIRED',
  },
}));
