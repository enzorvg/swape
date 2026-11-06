import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router';

import { ApiStatusIndicator } from '../features/status';
import { queryClient } from './queryClient';
import { router } from './router';

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="fixed top-2 right-2 z-50">
        <ApiStatusIndicator />
      </div>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
