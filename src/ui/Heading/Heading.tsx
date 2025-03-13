import React from 'react';

import { classer } from '@services/ui';

import styles from './Heading.scss';

interface HeadingProps {
  children: React.ReactNode;
  kind: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export const Heading: React.FC<HeadingProps> = ({ children, kind: Tag }) => {
  return <Tag className={classer(styles.Container, styles[Tag.toUpperCase()])}>{children}</Tag>;
};

Heading.displayName = 'Heading';
