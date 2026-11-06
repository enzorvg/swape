import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react-native';
import React from 'react';

import { useApiHealth } from './api';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe('useApiHealth (mobile)', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renvoie les données de santé quand l API est joignable', async () => {
    jest.spyOn(globalThis, 'fetch').mockImplementation(() =>
      Promise.resolve(
        new Response(JSON.stringify({ status: 'ok', version: '0.2.0' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    );

    const { result } = await renderHook(() => useApiHealth(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
    expect(result.current.data).toEqual({ status: 'ok', version: '0.2.0' });
  });

  it('échoue proprement quand l API est inaccessible', async () => {
    jest
      .spyOn(globalThis, 'fetch')
      .mockImplementation(() => Promise.reject(new Error('Connection refused')));

    const { result } = await renderHook(() => useApiHealth(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
    expect(result.current.error?.message).toBe('API indisponible');
  });
});
