import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { LandingPage } from './LandingPage';

describe('LandingPage', () => {
  it('shows the Swape brand', () => {
    render(<LandingPage />);

    expect(screen.getByRole('heading', { level: 1, name: 'Swape' })).toBeInTheDocument();
  });
});
