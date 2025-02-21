import { FC } from 'react';

import styles from './BaseCSS.scss';

export const BaseCSS: FC = () => <div className={styles.Container} data-test="base-css" />;

BaseCSS.displayName = 'BaseCSS';
