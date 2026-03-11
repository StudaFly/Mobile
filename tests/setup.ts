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
