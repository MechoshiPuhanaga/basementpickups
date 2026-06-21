import type { ReactNode } from 'react';

import { Heading } from '../../atoms/Heading';
import { Stack } from '../../atoms/Stack';
import { Text } from '../../atoms/Text';
import type { BrandValue, BrandValueIcon } from '../../../data/brandValues';
import styles from './BrandValueCard.module.css';

export interface BrandValueCardProps {
  value: BrandValue;
  className?: string | undefined;
}

function renderIcon(icon: BrandValueIcon): ReactNode {
  switch (icon) {
    case 'handwound':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="square"
        >
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="5.5" strokeOpacity="0.7" />
          <circle cx="12" cy="12" r="3" strokeOpacity="0.5" />
          <circle cx="12" cy="12" r="1" fill="currentColor" />
        </svg>
      );
    case 'materials':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="square"
        >
          <rect x="6" y="4" width="12" height="16" />
          <line x1="6" y1="12" x2="18" y2="12" strokeOpacity="0.6" />
          <line x1="9" y1="8" x2="15" y2="8" strokeOpacity="0.5" />
          <line x1="9" y1="16" x2="15" y2="16" strokeOpacity="0.5" />
        </svg>
      );
    case 'tone':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="square"
        >
          <path d="M3 12 Q 7.5 4 12 12 T 21 12" />
          <path d="M3 16 Q 8 22 12 16 T 21 16" strokeOpacity="0.55" />
        </svg>
      );
    case 'workshop':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="square"
        >
          <path d="M12 3 L20 12 L12 21 L4 12 Z" />
          <line x1="12" y1="3" x2="12" y2="21" strokeOpacity="0.5" />
          <line x1="4" y1="12" x2="20" y2="12" strokeOpacity="0.5" />
        </svg>
      );
  }
}

export function BrandValueCard({ value, className }: BrandValueCardProps) {
  const classes = [styles['root'], className].filter(Boolean).join(' ');

  return (
    <article className={classes}>
      <Stack direction="column" gap="sm" align="center">
        <div className={styles['icon']} aria-hidden="true">
          {renderIcon(value.icon)}
        </div>
        <Heading level={3} variant="section" align="center">
          {value.title}
        </Heading>
        <Text variant="editorial" tone="muted" align="center">
          {value.description}
        </Text>
      </Stack>
    </article>
  );
}
