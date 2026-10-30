import { render, screen } from '@testing-library/react-native';

import { ChatScreen } from './ChatScreen';

describe('ChatScreen', () => {
  it('renders chat placeholder', async () => {
    await render(<ChatScreen />);

    expect(screen.getByText('Chat')).toBeOnTheScreen();
  });
});
