import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { ProductGallery } from './ProductGallery';

const images = [
  { src: '/nope/a.png', alt: 'First' },
  { src: '/nope/b.png' },
  { src: '/nope/c.png', alt: 'Third' },
];

describe('ProductGallery', () => {
  it('renders nothing for an empty image list', () => {
    const { container } = render(<ProductGallery images={[]} productName="X" />);
    expect(container).toBeEmptyDOMElement();
  });

  it('shows a single image without thumbnails', () => {
    render(<ProductGallery images={images.slice(0, 1)} productName="X" />);
    expect(screen.getByTestId('product-gallery-image')).toHaveAttribute('alt', 'First');
    expect(screen.queryByTestId('product-gallery-thumb-0')).toBeNull();
  });

  it('switches the main image via the thumbnail tabs', async () => {
    const user = userEvent.setup();
    render(<ProductGallery images={images} productName="Rockroach" data-testid="g" />);
    expect(screen.getByTestId('g-thumb-0')).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByTestId('g-thumb-0')).toHaveAttribute('data-selected', 'true');
    expect(screen.getByTestId('g-image')).toHaveAttribute('src', '/nope/a.png');

    await user.click(screen.getByTestId('g-thumb-1'));
    expect(screen.getByTestId('g-thumb-1')).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByTestId('g-thumb-0')).not.toHaveAttribute('data-selected');
    const main = screen.getByTestId('g-image');
    expect(main).toHaveAttribute('src', '/nope/b.png');
    // Missing alt falls back to the product name.
    expect(main).toHaveAttribute('alt', 'Rockroach');
  });

  it('clamps the active index when the list shrinks', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<ProductGallery images={images} productName="X" data-testid="g" />);
    await user.click(screen.getByTestId('g-thumb-2'));
    rerender(<ProductGallery images={images.slice(0, 2)} productName="X" data-testid="g" />);
    expect(screen.getByTestId('g-image')).toHaveAttribute('src', '/nope/b.png');
  });
});
