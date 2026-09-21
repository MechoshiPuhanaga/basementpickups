import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';

import { routes } from '../../app/routes';
import { brandValues } from '../../data/brandValues';

describe('AboutPage', () => {
  it('renders the story, the framed photo and every brand value', () => {
    render(<RouterProvider router={createMemoryRouter(routes, { initialEntries: ['/about'] })} />);
    const page = screen.getByTestId('about-page');
    expect(page.querySelector('h1')).toHaveTextContent('Passion for sound');
    expect(page).toHaveTextContent('Founder');
    expect(screen.getByTestId('about-photo-image')).toBeInTheDocument();
    const values = screen.getByTestId('about-values');
    expect(values.querySelector('h2')).toHaveTextContent('Three quiet rules');
    for (const value of brandValues) {
      expect(screen.getByTestId(`brand-value-${value.id}`)).toHaveTextContent(value.title);
    }
  });
});
