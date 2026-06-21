import styles from './Price.module.css';

export type PriceSize = 'sm' | 'md' | 'lg';
export type PriceTone = 'primary' | 'gold' | 'muted';

export interface PriceProps {
  amount: number | string;
  currency?: string | undefined;
  size?: PriceSize | undefined;
  tone?: PriceTone | undefined;
  className?: string | undefined;
}

function formatAmount(amount: number | string): string {
  if (typeof amount === 'string') return amount;
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function Price({
  amount,
  currency = '€',
  size = 'md',
  tone = 'primary',
  className,
}: PriceProps) {
  const classes = [styles['price'], className].filter(Boolean).join(' ');
  const formatted = formatAmount(amount);

  return (
    <span className={classes} data-size={size} data-tone={tone}>
      <span className={styles['currency']} aria-hidden="true">
        {currency}
      </span>
      <span className={styles['amount']}>{formatted}</span>
    </span>
  );
}
