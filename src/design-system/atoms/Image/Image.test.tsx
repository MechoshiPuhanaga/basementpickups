import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { imageManifest } from '../../../assets/imageManifest';
import { Image } from './Image';

const MANIFEST_SRC = '/assets/images/product-photos/chow-chow.png';

describe('Image', () => {
  it('renders manifest entries as a <picture> with avif + webp sources', () => {
    const entry = imageManifest[MANIFEST_SRC];
    if (entry === undefined) throw new Error('fixture missing from manifest');
    render(<Image data-testid="img" src={MANIFEST_SRC} alt="Chow Chow" sizes="50vw" />);
    const picture = screen.getByTestId('img');
    expect(picture.tagName).toBe('PICTURE');
    const sources = picture.querySelectorAll('source');
    expect(sources).toHaveLength(2);
    expect(sources[0]).toHaveAttribute('type', 'image/avif');
    expect(sources[0]).toHaveAttribute('sizes', '50vw');
    expect(sources[0]?.getAttribute('srcset')).toContain(`${entry.avif[0]?.src ?? ''} 480w`);
    expect(sources[1]).toHaveAttribute('type', 'image/webp');
    const img = screen.getByTestId('img-img');
    expect(img).toHaveAttribute('src', MANIFEST_SRC);
    expect(img).toHaveAttribute('alt', 'Chow Chow');
    expect(img).toHaveAttribute('width', String(entry.width));
    expect(img).toHaveAttribute('height', String(entry.height));
    expect(img).toHaveAttribute('loading', 'lazy');
    expect(img).toHaveAttribute('decoding', 'async');
    expect(img).not.toHaveAttribute('fetchpriority');
  });

  it('loads priority images eagerly with high fetch priority', () => {
    render(<Image data-testid="img" src={MANIFEST_SRC} alt="" priority className="c" />);
    const img = screen.getByTestId('img-img');
    expect(img).toHaveAttribute('loading', 'eager');
    expect(img).toHaveAttribute('fetchpriority', 'high');
    expect(img).toHaveClass('c');
  });

  it('falls back to a plain <img> with explicit dimensions for un-optimised sources', () => {
    render(<Image data-testid="img" src="/assets/logo/x.svg" alt="Logo" width={10} height={5} />);
    const img = screen.getByTestId('img');
    expect(img.tagName).toBe('IMG');
    expect(img).toHaveAttribute('width', '10');
    expect(img).toHaveAttribute('height', '5');
    expect(img).toHaveAttribute('loading', 'lazy');
    expect(screen.queryByTestId('img-img')).toBeNull();
  });

  it('renders without test ids when none is given', () => {
    const { container } = render(<Image src={MANIFEST_SRC} alt="" />);
    expect(container.querySelector('[data-testid]')).toBeNull();
  });

  it('falls back with eager loading when priority', () => {
    render(<Image data-testid="img" src="/assets/logo/x.svg" alt="Logo" priority />);
    expect(screen.getByTestId('img')).toHaveAttribute('fetchpriority', 'high');
  });
});
