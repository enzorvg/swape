import { fireEvent, render, screen } from '@testing-library/react-native';

import { Button } from './Button';

describe('Button (review)', () => {
  it('does not call onPress when disabled', async () => {
    const onPress = jest.fn();
    await render(<Button title="Valider" onPress={onPress} disabled testID="btn" />);

    await fireEvent.press(screen.getByTestId('btn'));

    expect(onPress).not.toHaveBeenCalled();
  });

  it('exposes its disabled state to assistive technologies', async () => {
    await render(<Button title="Valider" disabled testID="btn" />);

    expect(screen.getByTestId('btn').props.accessibilityState).toMatchObject({ disabled: true });
  });

  it('calls onPress exactly once per press when enabled', async () => {
    const onPress = jest.fn();
    await render(<Button title="Valider" onPress={onPress} testID="btn" />);

    await fireEvent.press(screen.getByTestId('btn'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('falls back to the title as its accessible name when no accessibilityLabel is given', async () => {
    await render(<Button title="Se connecter" testID="btn" />);

    expect(screen.getByTestId('btn').props.accessibilityLabel).toBe('Se connecter');
  });
});
