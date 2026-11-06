import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';

import { api } from '../../shared/api';
import type { Schemas } from '@swape/api-client';

export type HealthResponse = Schemas['HealthResponse'];

const defaultClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

function useSafeQueryClient(): { client: QueryClient; hasClient: boolean } {
  try {
    const client = useQueryClient();
    return { client, hasClient: true };
  } catch {
    return { client: defaultClient, hasClient: false };
  }
}

export function useApiHealth(options?: Partial<UseQueryOptions<HealthResponse>>) {
  const { client, hasClient } = useSafeQueryClient();

  return useQuery(
    {
      queryKey: ['health'],
      queryFn: async () => {
        try {
          const { data } = await api.GET('/health');
          if (!data || (data as { status?: string }).status !== 'ok') {
            throw new Error('API indisponible');
          }
          return data;
        } catch (err) {
          if (err instanceof Error && err.message === 'API indisponible') {
            throw err;
          }
          throw new Error('API indisponible', { cause: err });
        }
      },
      retry: false,
      staleTime: 0,
      gcTime: 0,
      enabled: hasClient,
      ...options,
    },
    client,
  );
}
