import { render, screen } from '@testing-library/react-native';

import { SwipeScreen } from './SwipeScreen';

describe('SwipeScreen', () => {
  it('renders swipe placeholder', async () => {
    await render(<SwipeScreen />);

    expect(screen.getByText('Swipe')).toBeOnTheScreen();
  });
});
