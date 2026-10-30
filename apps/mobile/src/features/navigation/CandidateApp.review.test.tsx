import { fireEvent, render, screen } from '@testing-library/react-native';

import { AuthProvider } from '../auth/AuthContext';
import { CandidateApp } from './CandidateApp';

function renderApp() {
  return render(
    <AuthProvider>
      <CandidateApp />
    </AuthProvider>,
  );
}

async function login() {
  await fireEvent.changeText(screen.getByTestId('login-email-input'), 'candidat@example.com');
  await fireEvent.changeText(screen.getByTestId('login-password-input'), 'secret123');
  await fireEvent.press(screen.getByTestId('login-submit-button'));
}

describe('CandidateApp (review)', () => {
  it('shows the login screen when not authenticated', async () => {
    await renderApp();

    expect(screen.getByTestId('login-email-input')).toBeOnTheScreen();
    expect(screen.getByTestId('login-password-input')).toBeOnTheScreen();
    expect(screen.queryByTestId('tab-swipe')).toBeNull();
  });

  it('shows a French error and stays on the login screen for an invalid email', async () => {
    await renderApp();

    await fireEvent.changeText(screen.getByTestId('login-email-input'), 'pas-un-email');
    await fireEvent.changeText(screen.getByTestId('login-password-input'), 'secret123');
    await fireEvent.press(screen.getByTestId('login-submit-button'));

    expect(screen.getByText('Veuillez renseigner une adresse email valide')).toBeOnTheScreen();
    expect(screen.queryByTestId('tab-swipe')).toBeNull();
  });

  it('shows a French error and stays on the login screen for an empty password', async () => {
    await renderApp();

    await fireEvent.changeText(screen.getByTestId('login-email-input'), 'candidat@example.com');
    await fireEvent.press(screen.getByTestId('login-submit-button'));

    expect(screen.getByText('Veuillez renseigner votre mot de passe')).toBeOnTheScreen();
    expect(screen.queryByTestId('tab-swipe')).toBeNull();
  });

  it('reveals exactly the 4 expected tabs after a valid login, with Swipe active by default', async () => {
    await renderApp();
    await login();

    expect(screen.getByTestId('tab-swipe')).toBeOnTheScreen();
    expect(screen.getByTestId('tab-applications')).toBeOnTheScreen();
    expect(screen.getByTestId('tab-chat')).toBeOnTheScreen();
    expect(screen.getByTestId('tab-profile')).toBeOnTheScreen();
    expect(screen.queryByTestId('login-email-input')).toBeNull();

    // Swipe is active by default: its screen content is visible, the others are not.
    expect(
      screen.getByText('Découvrez les opportunités qui vous correspondent.'),
    ).toBeOnTheScreen();
    expect(screen.queryByText("Suivez l'état de vos candidatures et matchs.")).toBeNull();
  });

  it('switches screen content when another tab is pressed, showing only one screen at a time', async () => {
    await renderApp();
    await login();

    await fireEvent.press(screen.getByTestId('tab-chat'));

    expect(screen.getByText('Échangez avec les recruteurs après un match.')).toBeOnTheScreen();
    expect(screen.queryByText('Découvrez les opportunités qui vous correspondent.')).toBeNull();
  });

  it('returns to the login screen after logout, with no access to the tabs left', async () => {
    await renderApp();
    await login();

    await fireEvent.press(screen.getByTestId('tab-profile'));
    await fireEvent.press(screen.getByTestId('profile-logout-button'));

    expect(screen.getByTestId('login-email-input')).toBeOnTheScreen();
    expect(screen.queryByTestId('tab-swipe')).toBeNull();
    expect(screen.queryByTestId('tab-profile')).toBeNull();
  });
});
