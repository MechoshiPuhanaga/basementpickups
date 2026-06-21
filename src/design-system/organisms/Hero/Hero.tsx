import { Button } from '../../atoms/Button';
import { Frame } from '../../atoms/Frame';
import { Heading } from '../../atoms/Heading';
import { Image } from '../../atoms/Image';
import { Stack } from '../../atoms/Stack';
import { Text } from '../../atoms/Text';
import styles from './Hero.module.css';

export interface HeroCta {
  readonly label: string;
  readonly href: string;
}

export interface HeroProps {
  eyebrow?: string | undefined;
  headline: string;
  lead?: string | undefined;
  primaryCta?: HeroCta | undefined;
  secondaryCta?: HeroCta | undefined;
  imageSrc: string;
  imageAlt: string;
  imagePosition?: 'left' | 'right' | undefined;
  className?: string | undefined;
}

export function Hero({
  eyebrow,
  headline,
  lead,
  primaryCta,
  secondaryCta,
  imageSrc,
  imageAlt,
  imagePosition = 'left',
  className,
}: HeroProps) {
  const classes = [styles['root'], className].filter(Boolean).join(' ');

  return (
    <section className={classes} data-image-position={imagePosition}>
      <div className={styles['layout']}>
        <div className={styles['imageSide']}>
          <Frame variant="hero" padding="sm">
            <div className={styles['imageWrap']}>
              <Image
                src={imageSrc}
                alt={imageAlt}
                sizes="(max-width: 768px) 90vw, 45vw"
                priority
                className={styles['image']}
              />
            </div>
          </Frame>
        </div>
        <div className={styles['contentSide']}>
          <Stack direction="column" gap="md" align="start">
            {eyebrow !== undefined && (
              <Text variant="label" tone="gold">
                {eyebrow}
              </Text>
            )}
            <Heading level={1} variant="hero" align="start">
              {headline}
            </Heading>
            {lead !== undefined && (
              <Text variant="lead" tone="muted">
                {lead}
              </Text>
            )}
            {(primaryCta !== undefined || secondaryCta !== undefined) && (
              <div className={styles['ctaRow']}>
                {primaryCta !== undefined && (
                  <Button linkTo={primaryCta.href} variant="primary" size="lg">
                    {primaryCta.label}
                  </Button>
                )}
                {secondaryCta !== undefined && (
                  <Button linkTo={secondaryCta.href} variant="ghost" size="lg">
                    {secondaryCta.label}
                  </Button>
                )}
              </div>
            )}
          </Stack>
        </div>
      </div>
    </section>
  );
}
