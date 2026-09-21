import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';

import { Hero } from './Hero';

describe('Hero', () => {
  it('renders headline, eyebrow, lead, image and both CTAs', () => {
    render(
      <MemoryRouter>
        <Hero
          eyebrow="Basement"
          headline="Tone"
          lead="Lead copy"
          primaryCta={{ label: 'Shop', href: '/shop' }}
          secondaryCta={{ label: 'Read', href: '/articles' }}
          imageSrc="/nope/hero.png"
          imageAlt="A pickup"
          imagePosition="right"
        />
      </MemoryRouter>,
    );
    const hero = screen.getByTestId('hero');
    expect(hero).toHaveAttribute('data-image-position', 'right');
    expect(hero).toHaveTextContent('Basement');
    expect(screen.getByTestId('hero-headline')).toHaveTextContent('Tone');
    expect(hero).toHaveTextContent('Lead copy');
    expect(hero.querySelector('img')).toHaveAttribute('alt', 'A pickup');
    expect(hero.querySelector('img')).toHaveAttribute('loading', 'eager');
    expect(screen.getByTestId('hero-cta-primary')).toHaveAttribute('href', '/shop');
    expect(screen.getByTestId('hero-cta-secondary')).toHaveAttribute('href', '/articles');
  });

  it('omits optional parts and defaults the image to the left', () => {
    render(
      <MemoryRouter>
        <Hero headline="Only" imageSrc="/nope/hero.png" imageAlt="" data-testid="h" />
      </MemoryRouter>,
    );
    const hero = screen.getByTestId('h');
    expect(hero).toHaveAttribute('data-image-position', 'left');
    expect(screen.queryByTestId('h-cta-primary')).toBeNull();
    expect(screen.queryByTestId('h-cta-secondary')).toBeNull();
  });

  it('renders a lone secondary CTA', () => {
    render(
      <MemoryRouter>
        <Hero
          headline="Only"
          imageSrc="/nope/hero.png"
          imageAlt=""
          secondaryCta={{ label: 'Read', href: '/articles' }}
        />
      </MemoryRouter>,
    );
    expect(screen.queryByTestId('hero-cta-primary')).toBeNull();
    expect(screen.getByTestId('hero-cta-secondary')).toBeInTheDocument();
  });
});
