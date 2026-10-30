import { fireEvent, render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import { AuthProvider, useAuth } from './AuthContext';
import { LoginScreen } from './LoginScreen';

function TestAuthConsumer() {
  const { isAuthenticated } = useAuth();
  return <Text>{isAuthenticated ? 'Connecté' : 'Non connecté'}</Text>;
}

describe('LoginScreen', () => {
  it('renders login screen with email and password fields and submit button', async () => {
    await render(
      <AuthProvider>
        <LoginScreen />
      </AuthProvider>,
    );

    expect(screen.getByText('Connexion candidat')).toBeOnTheScreen();
    expect(screen.getByText('Adresse email')).toBeOnTheScreen();
    expect(screen.getByText('Mot de passe')).toBeOnTheScreen();
    expect(screen.getByText('Se connecter')).toBeOnTheScreen();
  });

  it('displays a validation error in French when email is invalid', async () => {
    await render(
      <AuthProvider>
        <LoginScreen />
      </AuthProvider>,
    );

    await fireEvent.changeText(screen.getByPlaceholderText('candidat@example.com'), 'invalide');
    await fireEvent.changeText(screen.getByPlaceholderText('••••••••'), 'secret123');
    await fireEvent.press(screen.getByRole('button', { name: 'Se connecter' }));

    expect(screen.getByText('Veuillez renseigner une adresse email valide')).toBeOnTheScreen();
  });

  it('successfully logs in when credentials are valid', async () => {
    await render(
      <AuthProvider>
        <TestAuthConsumer />
        <LoginScreen />
      </AuthProvider>,
    );

    expect(screen.getByText('Non connecté')).toBeOnTheScreen();

    await fireEvent.changeText(
      screen.getByPlaceholderText('candidat@example.com'),
      'candidat@swape.fr',
    );
    await fireEvent.changeText(screen.getByPlaceholderText('••••••••'), 'motdepasse');
    await fireEvent.press(screen.getByRole('button', { name: 'Se connecter' }));

    expect(screen.getByText('Connecté')).toBeOnTheScreen();
  });
});
