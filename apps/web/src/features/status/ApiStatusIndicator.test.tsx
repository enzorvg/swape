import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import type React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ApiStatusIndicator } from './ApiStatusIndicator';

function renderWithClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

describe('ApiStatusIndicator (web)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('affiche l état ok quand l API répond nominalement', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ status: 'ok', version: '0.1.0' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    );

    renderWithClient(<ApiStatusIndicator />);

    // Pendant le chargement
    expect(screen.getByText(/vérification de l'api/i)).toBeInTheDocument();

    // Après résolution
    const indicator = await screen.findByText(/api : ok/i);
    expect(indicator).toBeInTheDocument();
    expect(screen.getByText(/v0\.1\.0/)).toBeInTheDocument();
  });

  it('affiche « API indisponible » quand le fetch échoue sans planter l app', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Failed to fetch (API down)')));

    renderWithClient(<ApiStatusIndicator />);

    const errorIndicator = await screen.findByText('API indisponible');
    expect(errorIndicator).toBeInTheDocument();
  });

  it('affiche « API indisponible » si le statut HTTP est en erreur (503)', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ detail: 'Service Unavailable' }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    );

    renderWithClient(<ApiStatusIndicator />);

    const errorIndicator = await screen.findByText('API indisponible');
    expect(errorIndicator).toBeInTheDocument();
  });
});
