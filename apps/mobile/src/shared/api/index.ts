import { createApiClient } from '@swape/api-client';
import type { ApiClient } from '@swape/api-client';

const rawEnvUrl: unknown = process.env.EXPO_PUBLIC_API_URL;
export const API_URL: string =
  typeof rawEnvUrl === 'string' && rawEnvUrl.length > 0 ? rawEnvUrl : 'http://localhost:8000';

export const api: ApiClient = createApiClient(API_URL);

// Delegate requests to globalThis.fetch dynamically at call time so
// network mocks (e.g. global.fetch = jest.fn(...)) work seamlessly in tests.
api.use({
  async onRequest({ request }) {
    return globalThis.fetch(request);
  },
});

export { createApiClient };
export type { ApiClient };
