import { fireEvent, render, screen } from '@testing-library/react-native';

import { AuthProvider } from '../auth/AuthContext';
import { CandidateApp } from './CandidateApp';

describe('CandidateApp', () => {
  it('renders login screen when unauthenticated', async () => {
    await render(
      <AuthProvider initialAuthenticated={false}>
        <CandidateApp />
      </AuthProvider>,
    );

    expect(screen.getByText('Connexion candidat')).toBeOnTheScreen();
    expect(screen.queryByText('Swipe')).not.toBeOnTheScreen();
  });

  it('renders 4 tabs when authenticated in simulated state', async () => {
    await render(
      <AuthProvider initialAuthenticated={true}>
        <CandidateApp />
      </AuthProvider>,
    );

    expect(screen.getByTestId('tab-swipe')).toBeOnTheScreen();
    expect(screen.getByTestId('tab-applications')).toBeOnTheScreen();
    expect(screen.getByTestId('tab-chat')).toBeOnTheScreen();
    expect(screen.getByTestId('tab-profile')).toBeOnTheScreen();
  });

  it('switches between tabs', async () => {
    await render(
      <AuthProvider initialAuthenticated={true}>
        <CandidateApp />
      </AuthProvider>,
    );

    // Initial tab is Swipe
    expect(
      screen.getByText('Découvrez les opportunités qui vous correspondent.'),
    ).toBeOnTheScreen();

    // Switch to Candidatures
    await fireEvent.press(screen.getByTestId('tab-applications'));
    expect(screen.getByText("Suivez l'état de vos candidatures et matchs.")).toBeOnTheScreen();

    // Switch to Chat
    await fireEvent.press(screen.getByTestId('tab-chat'));
    expect(screen.getByText('Échangez avec les recruteurs après un match.')).toBeOnTheScreen();

    // Switch to Profil
    await fireEvent.press(screen.getByTestId('tab-profile'));
    expect(screen.getByText('Gérez vos informations, CV et préférences.')).toBeOnTheScreen();
  });
});
