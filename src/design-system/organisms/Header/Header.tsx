import type { ReactNode } from 'react';
import { Link, NavLink } from 'react-router';

import { Box } from '../../atoms/Box';
import { DecoSeparator } from '../../atoms/DecoSeparator';
import { Stack } from '../../atoms/Stack';
import { primaryNav } from '../../../data/navigation';
import styles from './Header.module.css';

export interface HeaderProps {
  className?: string | undefined;
  actions?: ReactNode;
  mobileNav?: ReactNode;
}

export function Header({ className, actions, mobileNav }: HeaderProps) {
  const classes = [styles['root'], className].filter(Boolean).join(' ');

  return (
    <header className={classes}>
      <Box paddingBlock="md" paddingInline="lg">
        <Stack
          direction="row"
          gap="lg"
          align="center"
          justify="between"
          wrap
          className={styles['bar']}
        >
          <Link to="/" className={styles['brand']} aria-label="Basement Pickups — home">
            <img
              src="/assets/logo/BP_Gold_horizont.svg"
              alt=""
              width={273}
              height={100}
              className={styles['logo']}
            />
          </Link>
          <div className={styles['rightGroup']}>
            <nav aria-label="Primary" className={styles['nav']}>
              <ul className={styles['navList']} role="list">
                {primaryNav.map((link) => (
                  <li key={link.href} className={styles['navItem']}>
                    <NavLink
                      to={link.href}
                      end={link.href === '/'}
                      className={({ isActive }) =>
                        [styles['navLink'], isActive ? styles['navLinkActive'] : undefined]
                          .filter(Boolean)
                          .join(' ')
                      }
                    >
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
            {mobileNav !== undefined && <div className={styles['mobileNav']}>{mobileNav}</div>}
            {actions !== undefined && <div className={styles['actions']}>{actions}</div>}
          </div>
        </Stack>
      </Box>
      <DecoSeparator variant="crest" />
    </header>
  );
}
