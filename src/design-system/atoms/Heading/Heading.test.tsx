import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Heading } from './Heading';

describe('Heading', () => {
  it('renders an h2 display heading by default', () => {
    render(<Heading data-testid="h">Title</Heading>);
    const heading = screen.getByTestId('h');
    expect(heading.tagName).toBe('H2');
    expect(heading).toHaveAttribute('data-variant', 'display');
    expect(heading).not.toHaveAttribute('data-align');
    expect(heading).not.toHaveAttribute('data-tone');
    expect(heading).toHaveTextContent('Title');
  });

  it.each([1, 2, 3, 4, 5, 6] as const)('renders level %i as the matching tag', (level) => {
    render(
      <Heading data-testid="h" level={level}>
        x
      </Heading>,
    );
    expect(screen.getByTestId('h').tagName).toBe(`H${String(level)}`);
  });

  it('forwards variant, align, tone and className', () => {
    render(
      <Heading data-testid="h" variant="hero" align="center" tone="gold" className="c">
        x
      </Heading>,
    );
    const heading = screen.getByTestId('h');
    expect(heading).toHaveAttribute('data-variant', 'hero');
    expect(heading).toHaveAttribute('data-align', 'center');
    expect(heading).toHaveAttribute('data-tone', 'gold');
    expect(heading).toHaveClass('c');
  });
});
