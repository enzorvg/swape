import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { LandingPage } from './LandingPage';
import source from './LandingPage.tsx?raw';

const STEPS = [/profil/i, /swip/i, /match/i];

function classTokens(): string[] {
  return [...source.matchAll(/className=(?:"([^"]*)"|\{`([^`]*)`\})/g)].flatMap((match) =>
    (match[1] ?? match[2] ?? '').split(/\s+/),
  );
}

describe('LandingPage (review #25)', () => {
  it('shows one main title in the display font', () => {
    render(<LandingPage />);

    const titles = screen.getAllByRole('heading', { level: 1 });

    expect(titles).toHaveLength(1);
    expect(titles[0]).toHaveClass('font-display');
    expect(titles[0]).not.toBeEmptyDOMElement();
  });

  it('shows a tagline next to the title', () => {
    const { container } = render(<LandingPage />);

    expect(container.querySelector('p')?.textContent.trim()).toBeTruthy();
  });

  it('shows the three steps in the expected order', () => {
    render(<LandingPage />);

    const steps = screen.getAllByRole('listitem');

    expect(steps).toHaveLength(3);
    STEPS.forEach((step, index) => {
      expect(steps[index]).toHaveTextContent(step);
    });
  });

  it('illustrates every step', () => {
    render(<LandingPage />);

    for (const step of screen.getAllByRole('listitem')) {
      const illustrated = step.querySelector('svg, img') ?? within(step).queryByRole('img');
      expect(illustrated).not.toBeNull();
    }
  });

  it('points the recruiter link at the login page', () => {
    render(<LandingPage />);

    const link = screen.getByRole('link', { name: /espace recruteur/i });

    expect(link).toHaveAttribute('href', '/recruiter/login');
  });

  it('uses no hardcoded color in the source', () => {
    expect(source).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);
    expect(source).not.toMatch(/\b(rgb|rgba|hsl|hsla)\(/);
    expect(source).not.toMatch(/style=\{\{/);
  });

  it('uses no arbitrary value or default Tailwind palette color', () => {
    const palette =
      /^(?:[a-z]+:)*(?:bg|text|border|ring|fill|stroke|from|to|via)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|black|white)(?:-\d+)?$/;

    const tokens = classTokens();

    expect(tokens.length).toBeGreaterThan(0);
    expect(tokens.filter((token) => palette.test(token))).toEqual([]);
    expect(tokens.filter((token) => /(?:bg|text|border|fill|stroke)-\[/.test(token))).toEqual([]);
  });
});
