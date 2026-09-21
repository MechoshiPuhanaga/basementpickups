import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Frame } from './Frame';

describe('Frame', () => {
  it('renders a panel with medium padding by default and a decorative frame', () => {
    render(<Frame data-testid="frame">inside</Frame>);
    const frame = screen.getByTestId('frame');
    expect(frame.tagName).toBe('DIV');
    expect(frame).toHaveAttribute('data-variant', 'panel');
    expect(frame).toHaveAttribute('data-padding', 'md');
    expect(frame).toHaveTextContent('inside');
    expect(frame.querySelectorAll('svg')).toHaveLength(4);
  });

  it('is polymorphic and forwards variant/padding', () => {
    render(
      <Frame data-testid="frame" as="article" variant="hero" padding="none" className="f">
        x
      </Frame>,
    );
    const frame = screen.getByTestId('frame');
    expect(frame.tagName).toBe('ARTICLE');
    expect(frame).toHaveAttribute('data-variant', 'hero');
    expect(frame).toHaveAttribute('data-padding', 'none');
    expect(frame).toHaveClass('f');
  });
});
