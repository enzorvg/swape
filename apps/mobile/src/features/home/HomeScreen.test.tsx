import { render, screen } from '@testing-library/react-native';

import { HomeScreen } from './HomeScreen';

describe('HomeScreen', () => {
  it('shows the Swape brand', async () => {
    await render(<HomeScreen />);

    expect(screen.getByText('Swape')).toBeOnTheScreen();
  });
});
