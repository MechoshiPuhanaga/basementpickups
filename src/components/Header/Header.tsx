import { Mail } from 'lucide-react';
import { FC } from 'react';

import LogoHorizontal from '@assets/logo/BP_Gold_horizont.svg';
import { Link } from '@ui';

import { MainNavigation } from './components';

import styles from './Header.scss';

export const Header: FC = () => {
  return (
    <header className={styles.Container}>
      <div className={styles.LogoContainer}>
        <Link inheritColor to="/">
          <LogoHorizontal width={180} height={'auto'} />
        </Link>
      </div>
      <MainNavigation className={styles.MainNavigation} />
      <div className={styles.ContactsContainer}>
        <a
          aria-label="Send email to contact@basementpickups.com"
          className={styles.SendMail}
          href="mailto:contact@basementpickups.com"
          target="_blank"
          title="contact@basementpickups.com"
          rel="noreferrer"
        >
          <Mail />
        </a>
      </div>
    </header>
  );
};

Header.displayName = 'Header';
