import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react-native';
import React from 'react';

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

describe('ApiStatusIndicator (mobile)', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('affiche l état ok quand l API répond nominalement', async () => {
    jest.spyOn(globalThis, 'fetch').mockImplementation(() =>
      Promise.resolve(
        new Response(JSON.stringify({ status: 'ok', version: '0.1.0' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    );

    await renderWithClient(<ApiStatusIndicator />);

    // Après résolution
    const indicator = await screen.findByText(/api : ok/i);
    expect(indicator).toBeOnTheScreen();
    expect(screen.getByText(/v0\.1\.0/)).toBeOnTheScreen();
  });

  it('affiche « API indisponible » quand le fetch échoue sans planter l app', async () => {
    jest
      .spyOn(globalThis, 'fetch')
      .mockImplementation(() => Promise.reject(new Error('Failed to fetch (API down)')));

    await renderWithClient(<ApiStatusIndicator />);

    const errorIndicator = await screen.findByText('API indisponible');
    expect(errorIndicator).toBeOnTheScreen();
  });

  it('affiche « API indisponible » si le statut HTTP est en erreur (503)', async () => {
    jest.spyOn(globalThis, 'fetch').mockImplementation(() =>
      Promise.resolve(
        new Response(JSON.stringify({ detail: 'Service Unavailable' }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    );

    await renderWithClient(<ApiStatusIndicator />);

    const errorIndicator = await screen.findByText('API indisponible');
    expect(errorIndicator).toBeOnTheScreen();
  });
});
