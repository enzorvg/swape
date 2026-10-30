import { render, screen } from '@testing-library/react-native';

import { ApplicationsScreen } from './ApplicationsScreen';

describe('ApplicationsScreen', () => {
  it('renders applications placeholder', async () => {
    await render(<ApplicationsScreen />);

    expect(screen.getByText('Candidatures')).toBeOnTheScreen();
  });
});
