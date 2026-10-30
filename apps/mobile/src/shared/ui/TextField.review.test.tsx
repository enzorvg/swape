import { render, screen } from '@testing-library/react-native';

import { TextField } from './TextField';

describe('TextField (review)', () => {
  it('masks the value when secureTextEntry is set', async () => {
    await render(
      <TextField
        label="Mot de passe"
        value="x"
        onChangeText={jest.fn()}
        secureTextEntry
        testID="field"
      />,
    );

    expect(screen.getByTestId('field').props.secureTextEntry).toBe(true);
  });

  it('shows the error message when error is set', async () => {
    await render(
      <TextField
        label="Adresse email"
        value=""
        onChangeText={jest.fn()}
        error="Veuillez renseigner une adresse email valide"
        testID="field"
      />,
    );

    expect(screen.getByText('Veuillez renseigner une adresse email valide')).toBeOnTheScreen();
  });

  it('shows no error message when error is undefined', async () => {
    await render(
      <TextField label="Adresse email" value="" onChangeText={jest.fn()} testID="field" />,
    );

    expect(screen.queryByText(/Veuillez renseigner/)).toBeNull();
  });
});
