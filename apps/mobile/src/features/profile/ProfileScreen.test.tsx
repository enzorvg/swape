import { fireEvent, render, screen } from '@testing-library/react-native';

import { AuthProvider } from '../auth/AuthContext';
import { ProfileScreen } from './ProfileScreen';

describe('ProfileScreen', () => {
  it('renders profile placeholder with logout button', async () => {
    await render(
      <AuthProvider initialAuthenticated={true}>
        <ProfileScreen />
      </AuthProvider>,
    );

    expect(screen.getByText('Profil')).toBeOnTheScreen();
    expect(screen.getByText('Se déconnecter')).toBeOnTheScreen();
  });

  it('triggers logout when pressing the logout button', async () => {
    await render(
      <AuthProvider initialAuthenticated={true}>
        <ProfileScreen />
      </AuthProvider>,
    );

    await fireEvent.press(screen.getByRole('button', { name: 'Se déconnecter' }));
  });
});
