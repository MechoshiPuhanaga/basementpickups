import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ArticleLayout } from './ArticleLayout';

describe('ArticleLayout', () => {
  it('renders header and body only when hero/aside are omitted', () => {
    render(<ArticleLayout data-testid="art" header={<h1>Head</h1>} body={<p>Body</p>} />);
    const article = screen.getByTestId('art');
    expect(article.tagName).toBe('ARTICLE');
    expect(screen.getByTestId('art-header')).toHaveTextContent('Head');
    expect(screen.getByTestId('art-body')).toHaveTextContent('Body');
    expect(screen.queryByTestId('art-hero')).toBeNull();
    expect(screen.queryByTestId('art-aside')).toBeNull();
  });

  it('renders without test ids when none is given', () => {
    const { container } = render(<ArticleLayout header={<h1>H</h1>} body={<p>B</p>} />);
    expect(container.querySelector('[data-testid]')).toBeNull();
  });

  it('renders hero and aside slots when provided', () => {
    render(
      <ArticleLayout
        data-testid="art"
        className="c"
        hero={<img alt="" />}
        header={<h1>Head</h1>}
        body={<p>Body</p>}
        aside={<p>Aside</p>}
      />,
    );
    expect(screen.getByTestId('art')).toHaveClass('c');
    expect(screen.getByTestId('art-hero').querySelector('img')).not.toBeNull();
    expect(screen.getByTestId('art-aside')).toHaveTextContent('Aside');
    expect(screen.getByTestId('art-aside').tagName).toBe('ASIDE');
  });
});
