import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';

import { TextLink } from './TextLink';

describe('TextLink', () => {
  it('renders an in-app router link, keeping any hash', () => {
    render(
      <MemoryRouter>
        <TextLink data-testid="link" to="/faq#option-availability" className="c">
          availability
        </TextLink>
      </MemoryRouter>,
    );
    const link = screen.getByTestId('link');
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/faq#option-availability');
    expect(link).toHaveTextContent('availability');
    expect(link).toHaveClass('c');
  });
});
