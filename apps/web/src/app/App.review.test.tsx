import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { App } from './App';

describe('App (review #23)', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('shows the API status indicator when the app is opened and the API is up', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ status: 'ok', version: '1.2.3' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    );

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/API : ok/i)).toBeInTheDocument();
    });
  });

  it('shows "API indisponible" when the app is opened and the API is down, without crashing', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network error')));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/API indisponible/i)).toBeInTheDocument();
    });
  });
});
