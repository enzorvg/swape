import { fireEvent, render, screen } from '@testing-library/react-native';

import { Button } from './Button';

describe('Button', () => {
  it('renders title correctly', async () => {
    await render(<Button title="Se connecter" />);

    expect(screen.getByText('Se connecter')).toBeOnTheScreen();
  });

  it('handles press events', async () => {
    const handlePress = jest.fn();
    await render(<Button title="Valider" onPress={handlePress} />);

    await fireEvent.press(screen.getByRole('button', { name: 'Valider' }));

    expect(handlePress).toHaveBeenCalledTimes(1);
  });

  it('does not fire press when disabled', async () => {
    const handlePress = jest.fn();
    await render(<Button title="Valider" onPress={handlePress} disabled />);

    await fireEvent.press(screen.getByRole('button', { name: 'Valider' }));

    expect(handlePress).not.toHaveBeenCalled();
  });
});
