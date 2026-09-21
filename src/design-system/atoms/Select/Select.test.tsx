import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Select } from './Select';

describe('Select', () => {
  it('renders a wrapped native select and forwards changes', async () => {
    const onChange = vi.fn();
    render(
      <Select data-testid="sel" name="wire" defaultValue="a" onChange={onChange}>
        <option value="a">A</option>
        <option value="b">B</option>
      </Select>,
    );
    const wrapper = screen.getByTestId('sel');
    expect(wrapper).toHaveAttribute('data-size', 'md');
    expect(wrapper).not.toHaveAttribute('data-invalid');
    const select = screen.getByTestId('sel-select');
    expect(select.tagName).toBe('SELECT');
    expect(select).not.toHaveAttribute('aria-invalid');
    await userEvent.selectOptions(select, 'b');
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(select).toHaveValue('b');
  });

  it('renders without test ids when none is given', () => {
    const { container } = render(
      <Select>
        <option>x</option>
      </Select>,
    );
    expect(container.querySelector('[data-testid]')).toBeNull();
  });

  it('marks invalid state on both wrapper and select', () => {
    render(
      <Select data-testid="sel" selectSize="sm" invalid className="c">
        <option>x</option>
      </Select>,
    );
    expect(screen.getByTestId('sel')).toHaveAttribute('data-invalid', 'true');
    expect(screen.getByTestId('sel')).toHaveAttribute('data-size', 'sm');
    expect(screen.getByTestId('sel')).toHaveClass('c');
    expect(screen.getByTestId('sel-select')).toHaveAttribute('aria-invalid', 'true');
  });
});
