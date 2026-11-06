import { render, screen, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { AuthProvider } from '../auth/AuthContext';
import { CandidateApp } from '../navigation/CandidateApp';

function renderApp() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider initialAuthenticated={true}>
        <CandidateApp />
      </AuthProvider>
    </QueryClientProvider>,
  );
}

describe('CandidateApp status integration (review #23)', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('shows the API status indicator when the app is opened and the API is up', async () => {
    jest.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ status: 'ok', version: '1.2.3' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    await renderApp();

    await waitFor(() => {
      expect(screen.getByText(/API : ok/i)).toBeOnTheScreen();
    });
  });

  it('shows "API indisponible" when the app is opened and the API is down, without crashing', async () => {
    jest.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('network error'));

    await renderApp();

    await waitFor(() => {
      expect(screen.getByText(/API indisponible/i)).toBeOnTheScreen();
    });
  });
});
