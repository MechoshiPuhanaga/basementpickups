import { Link } from 'react-router';

import { Box } from '../../atoms/Box';
import { DecoCorner } from '../../atoms/DecoCorner';
import { Grid } from '../../atoms/Grid';
import { Heading } from '../../atoms/Heading';
import { Stack } from '../../atoms/Stack';
import { Text } from '../../atoms/Text';
import { primaryNav } from '../../../data/navigation';
import styles from './Footer.module.css';

export interface FooterProps {
  className?: string | undefined;
}

export function Footer({ className }: FooterProps) {
  const classes = [styles['root'], className].filter(Boolean).join(' ');
  const year = new Date().getFullYear();

  return (
    <footer className={classes}>
      <div className={styles['borderRow']} aria-hidden="true">
        <DecoCorner variant="simple" position="top-left" size={16} className={styles['corner']} />
        <span className={styles['borderLine']} />
        <DecoCorner variant="simple" position="top-right" size={16} className={styles['corner']} />
      </div>
      <Box paddingBlock="xl" paddingInline="lg">
        <Stack direction="column" gap="xl" align="stretch">
          <Grid columns={2} gap="xl" align="start">
            <Stack direction="column" gap="sm" align="start">
              <Link to="/" className={styles['brand']} aria-label="Basement Pickups — home">
                <img src="/assets/logo/BP_Gold_horizont.svg" alt="" className={styles['logo']} />
              </Link>
              <Text variant="editorial" tone="muted">
                Handcrafted boutique guitar pickups. Wound and voiced in the workshop.
              </Text>
            </Stack>
            <Stack direction="column" gap="sm" align="start">
              <Heading level={2} variant="section">
                Navigate
              </Heading>
              <nav aria-label="Footer">
                <ul className={styles['navList']} role="list">
                  {primaryNav.map((link) => (
                    <li key={link.href}>
                      <Link to={link.href} className={styles['navLink']}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </Stack>
          </Grid>
          <div className={styles['copyrightRow']}>
            <Text variant="meta" tone="muted" align="center">
              © {String(year)} Basement Pickups. All rights reserved.
            </Text>
          </div>
        </Stack>
      </Box>
    </footer>
  );
}
