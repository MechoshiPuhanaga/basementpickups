import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Section } from './Section';

describe('Section', () => {
  it('renders a section with large spacing and default width', () => {
    render(<Section data-testid="s">x</Section>);
    const section = screen.getByTestId('s');
    expect(section.tagName).toBe('SECTION');
    expect(section).toHaveAttribute('data-spacing', 'lg');
    expect(section).toHaveAttribute('data-max-width', 'default');
    expect(section).toHaveTextContent('x');
  });

  it('forwards spacing, maxWidth, className and element type', () => {
    render(
      <Section data-testid="s" as="div" spacing="sm" maxWidth="wide" className="c">
        x
      </Section>,
    );
    const section = screen.getByTestId('s');
    expect(section.tagName).toBe('DIV');
    expect(section).toHaveAttribute('data-spacing', 'sm');
    expect(section).toHaveAttribute('data-max-width', 'wide');
    expect(section).toHaveClass('c');
  });
});
