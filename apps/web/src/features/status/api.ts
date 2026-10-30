import { useQuery } from '@tanstack/react-query';
import type { UseQueryOptions } from '@tanstack/react-query';

import { api } from '../../shared/api';
import type { Schemas } from '@swape/api-client';

export type HealthResponse = Schemas['HealthResponse'];

export function useApiHealth(options?: Partial<UseQueryOptions<HealthResponse>>) {
  return useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      try {
        const { data } = await api.GET('/health');
        if (!data) {
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
    ...options,
  });
}
