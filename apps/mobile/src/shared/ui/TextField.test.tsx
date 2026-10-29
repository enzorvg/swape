import { fireEvent, render, screen } from '@testing-library/react-native';

import { TextField } from './TextField';

describe('TextField', () => {
  it('renders label and placeholder', async () => {
    await render(
      <TextField
        label="Adresse email"
        value=""
        onChangeText={jest.fn()}
        placeholder="candidat@example.com"
      />,
    );

    expect(screen.getByText('Adresse email')).toBeOnTheScreen();
  });

  it('handles text input change', async () => {
    const handleChange = jest.fn();
    await render(
      <TextField
        label="Adresse email"
        value=""
        onChangeText={handleChange}
        placeholder="candidat@example.com"
      />,
    );

    await fireEvent.changeText(
      screen.getByPlaceholderText('candidat@example.com'),
      'test@swape.fr',
    );

    expect(handleChange).toHaveBeenCalledWith('test@swape.fr');
  });

  it('renders error message in French when error is provided', async () => {
    await render(
      <TextField
        label="Adresse email"
        value="invalide"
        onChangeText={jest.fn()}
        error="Veuillez renseigner une adresse email valide"
      />,
    );

    expect(screen.getByText('Veuillez renseigner une adresse email valide')).toBeOnTheScreen();
  });
});
