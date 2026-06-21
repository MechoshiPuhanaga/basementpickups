import type { ReactNode } from 'react';
import { Link, NavLink } from 'react-router';

import { Box } from '../../atoms/Box';
import { DecoCorner } from '../../atoms/DecoCorner';
import { Stack } from '../../atoms/Stack';
import { primaryNav } from '../../../data/navigation';
import styles from './Header.module.css';

export interface HeaderProps {
  className?: string | undefined;
  actions?: ReactNode;
}

export function Header({ className, actions }: HeaderProps) {
  const classes = [styles['root'], className].filter(Boolean).join(' ');

  return (
    <header className={classes}>
      <Box paddingBlock="md" paddingInline="lg">
        <Stack direction="row" gap="lg" align="center" justify="between" wrap>
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
            {actions !== undefined && <div className={styles['actions']}>{actions}</div>}
          </div>
        </Stack>
      </Box>
      <div className={styles['borderRow']} aria-hidden="true">
        <DecoCorner
          variant="simple"
          position="bottom-left"
          size={16}
          className={styles['corner']}
        />
        <span className={styles['borderLine']} />
        <DecoCorner
          variant="simple"
          position="bottom-right"
          size={16}
          className={styles['corner']}
        />
      </div>
    </header>
  );
}
