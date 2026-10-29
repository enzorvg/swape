import { describe, expect, it, vi } from 'vitest';

import { createApiClient } from './index';

describe('createApiClient', () => {
  it('calls GET /health and returns the typed body', async () => {
    const fetchMock = vi.fn(() =>
      Promise.resolve(
        new Response(JSON.stringify({ status: 'ok' }), {
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    );
    vi.stubGlobal('fetch', fetchMock);

    const { data } = await createApiClient('http://api.test').GET('/health');

    expect(data?.status).toBe('ok');
    expect(fetchMock).toHaveBeenCalledOnce();
    vi.unstubAllGlobals();
  });
});
