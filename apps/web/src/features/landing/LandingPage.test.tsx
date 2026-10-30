import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { LandingPage } from './LandingPage';

describe('LandingPage', () => {
  it('shows the Swape brand', () => {
    render(<LandingPage />);

    expect(screen.getByRole('heading', { level: 1, name: 'Swape' })).toBeInTheDocument();
  });

  it('shows the 3-step "how it works" section', () => {
    render(<LandingPage />);

    expect(screen.getByText('Comment ça marche')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: 'Trois étapes. Zéro friction.' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /Crée ton profil/ })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 3, name: /Swipe les offres qui te parlent/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 3, name: /Match, discute, signe/ }),
    ).toBeInTheDocument();
  });

  it('links to the recruiter login page', () => {
    render(<LandingPage />);

    expect(screen.getByRole('link', { name: 'Espace recruteur' })).toHaveAttribute(
      'href',
      '/recruiter/login',
    );
  });
});
