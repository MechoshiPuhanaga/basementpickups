import type { TestIdProps } from '../../testing';
import styles from './Separator.module.css';

export type SeparatorOrientation = 'horizontal' | 'vertical';
export type SeparatorTone = 'line' | 'gold';

export interface SeparatorProps extends TestIdProps {
  orientation?: SeparatorOrientation | undefined;
  tone?: SeparatorTone | undefined;
  className?: string | undefined;
}

export function Separator({
  orientation = 'horizontal',
  tone = 'line',
  className,
  'data-testid': testId,
}: SeparatorProps) {
  const classes = [styles['separator'], className].filter(Boolean).join(' ');

  return (
    <hr
      className={classes}
      data-orientation={orientation}
      data-tone={tone}
      aria-orientation={orientation}
      data-testid={testId}
    />
  );
}
