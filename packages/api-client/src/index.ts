import createClient from 'openapi-fetch';

import type { components, paths } from './generated/schema';

/**
 * Typed client for the Swape API, generated from FastAPI's OpenAPI schema.
 * Never edit src/generated/ by hand: run `make api-types`.
 */
export function createApiClient(baseUrl: string) {
  return createClient<paths>({ baseUrl });
}

export type ApiClient = ReturnType<typeof createApiClient>;
export type Schemas = components['schemas'];
export type { components, paths };
