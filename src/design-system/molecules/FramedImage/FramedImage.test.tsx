import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { FramedImage } from './FramedImage';

describe('FramedImage', () => {
  it('renders the image inside a frame with the landscape ratio by default', () => {
    render(<FramedImage src="/nope/photo.png" alt="A guitar" data-testid="fi" />);
    const frame = screen.getByTestId('fi');
    expect(frame).toHaveAttribute('data-variant', 'image');
    const image = screen.getByTestId('fi-image');
    expect(image).toHaveAttribute('alt', 'A guitar');
    expect(image.parentElement).toHaveAttribute('data-ratio', 'landscape');
  });

  it('supports the square ratio and custom sizes', () => {
    render(
      <FramedImage src="/nope/photo.png" alt="" ratio="square" sizes="100px" data-testid="fi" />,
    );
    expect(screen.getByTestId('fi-image').parentElement).toHaveAttribute('data-ratio', 'square');
  });
});
