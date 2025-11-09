import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

// Ensure DOM cleanup between tests to avoid element duplication across cases
afterEach(() => {
  cleanup();
});
