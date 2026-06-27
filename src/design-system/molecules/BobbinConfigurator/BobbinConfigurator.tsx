import { useId } from 'react';

import { Select } from '../../atoms/Select';
import { Swatch } from '../../atoms/Swatch';
import { Text } from '../../atoms/Text';
import { bobbinColorLabel } from '../../../data/bobbinColors';
import { deriveBobbinLabels, type BobbinSelection } from '../../../data/bobbins';
import type { PickupBobbin } from '../../../data/pickups';
import styles from './BobbinConfigurator.module.css';

export type { BobbinSelection };

export interface BobbinConfiguratorProps {
  bobbins: readonly PickupBobbin[];
  /** Current selection; a missing entry falls back to the bobbin's defaultColor. */
  value: BobbinSelection;
  onChange: (bobbinId: string, color: string) => void;
  className?: string | undefined;
}

/**
 * One row per bobbin: an Art Deco colour swatch, the coil label, and a colour
 * picker. A bobbin with a single available colour renders read-only (no choice
 * to make). Controlled — the caller owns the selection state, so the same
 * configurator drives both the product page and each cart line.
 */
export function BobbinConfigurator({
  bobbins,
  value,
  onChange,
  className,
}: BobbinConfiguratorProps) {
  const labels = deriveBobbinLabels(bobbins);
  const baseId = useId();
  const classes = [styles['configurator'], className].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {bobbins.map((bobbin, index) => {
        const selected = value[bobbin.id] ?? bobbin.defaultColor;
        const label = labels[index] ?? bobbin.style;
        const canChoose = bobbin.palette.length > 1;
        const selectId = `${baseId}-${bobbin.id}`;

        return (
          <div key={bobbin.id} className={styles['row']}>
            <Swatch color={selected} label={bobbinColorLabel(selected)} size="md" />
            {canChoose ? (
              <label className={styles['field']} htmlFor={selectId}>
                <Text variant="label" tone="muted" as="span">
                  {label}
                </Text>
                <Select
                  id={selectId}
                  selectSize="sm"
                  value={selected}
                  onChange={(event) => {
                    onChange(bobbin.id, event.target.value);
                  }}
                >
                  {bobbin.palette.map((color) => (
                    <option key={color} value={color}>
                      {bobbinColorLabel(color)}
                    </option>
                  ))}
                </Select>
              </label>
            ) : (
              <div className={styles['field']}>
                <Text variant="label" tone="muted" as="span">
                  {label}
                </Text>
                <Text variant="body" as="span">
                  {bobbinColorLabel(selected)}
                </Text>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
