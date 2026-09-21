import { useId, type ReactNode } from 'react';

import { PickupPreview } from '../../atoms/PickupPreview';
import { Select } from '../../atoms/Select';
import { Text } from '../../atoms/Text';
import { TextLink } from '../../atoms/TextLink';
import { VisuallyHidden } from '../../atoms/VisuallyHidden';
import { bobbinColorLabel } from '../../../data/bobbinColors';
import { deriveBobbinLabels } from '../../../data/bobbins';
import { resolveConfig, type PickupConfig } from '../../../data/pickupConfig';
import {
  conductorLabel,
  coverLabel,
  polepieceLabel,
  pottingLabel,
  spacingLabel,
} from '../../../data/pickupLabels';
import type { Choice, Pickup } from '../../../data/pickups';
import type { TestIdProps } from '../../testing';
import styles from './PickupConfigurator.module.css';

export type { PickupConfig };

export interface PickupConfiguratorProps extends TestIdProps {
  pickup: Pickup;
  /** Current build; missing or invalid entries fall back to the pickup's defaults. */
  value: PickupConfig;
  /** Receives the complete, resolved build after any change. */
  onChange: (next: PickupConfig) => void;
  /**
   * Screen-reader name for the whole group of controls (e.g. "White Pearl
   * build"), so identical labels on several configurators stay distinguishable.
   */
  legend: string;
  /** Where the "options may vary" note links to (e.g. `/faq#option-availability`). */
  helpTo?: string | undefined;
  className?: string | undefined;
}

interface OptionFieldProps<T extends string | number> {
  id: string;
  label: string;
  choice: Choice<T>;
  value: T;
  optionLabel: (value: T) => string;
  onChange: (value: T) => void;
  className?: string | undefined;
  testId: string;
}

/**
 * One labelled choice: a compact select when there is something to choose, or
 * the fixed value as read-only text. The pickup's default is marked in the list
 * so a customer always knows what "as standard" means.
 */
function OptionField<T extends string | number>({
  id,
  label,
  choice,
  value,
  optionLabel,
  onChange,
  className,
  testId,
}: OptionFieldProps<T>) {
  const fieldClasses = [styles['field'], className].filter(Boolean).join(' ');
  if (choice.options.length <= 1) {
    return (
      <div className={fieldClasses} data-testid={testId}>
        <Text variant="label" tone="muted" as="span">
          {label}
        </Text>
        <Text variant="body" as="span">
          {optionLabel(value)}
        </Text>
      </div>
    );
  }
  return (
    <label className={fieldClasses} htmlFor={id}>
      <Text variant="label" tone="muted" as="span">
        {label}
      </Text>
      <Select
        id={id}
        className={styles['select']}
        selectSize="sm"
        value={String(value)}
        data-testid={testId}
        onChange={(event) => {
          // Map the select's string back to the typed option it came from.
          const next = choice.options.find((option) => String(option) === event.target.value);
          if (next !== undefined) onChange(next);
        }}
      >
        {choice.options.map((option) => (
          <option key={String(option)} value={String(option)}>
            {option === choice.defaultOption
              ? `${optionLabel(option)} (default)`
              : optionLabel(option)}
          </option>
        ))}
      </Select>
    </label>
  );
}

/**
 * The full build configurator for one pickup: a top-down preview of each coil
 * (bobbin colour + pole-piece finish) beside its colour picker, then the lead
 * wire, pole pieces, cover and — when offered — string spacing. Controlled and
 * pickup-driven: every row comes from the pickup's `Choice` data, nothing here
 * knows about humbuckers. The same molecule drives the product page and each
 * cart line, so both edit a build in exactly the same way.
 */
export function PickupConfigurator({
  pickup,
  value,
  onChange,
  legend,
  helpTo,
  className,
  'data-testid': testId = 'pickup-configurator',
}: PickupConfiguratorProps) {
  const baseId = useId();
  const resolved = resolveConfig(pickup, value);
  const bobbins = pickup.hardware.bobbins ?? [];
  const labels = deriveBobbinLabels(bobbins);
  const spacing = pickup.hardware.spacingMm;
  const classes = [styles['configurator'], className].filter(Boolean).join(' ');

  const finish = resolved.polepieces ?? pickup.hardware.polepieces.defaultOption;
  const previewLabel = [
    ...bobbins.map(
      (bobbin, index) =>
        `${labels[index] ?? bobbin.style} ${bobbinColorLabel(resolved.bobbins?.[bobbin.id] ?? bobbin.defaultColor).toLowerCase()}`,
    ),
    `${polepieceLabel(finish).toLowerCase()} pole pieces`,
  ].join(', ');

  const update = (patch: PickupConfig): void => {
    onChange(resolveConfig(pickup, { ...resolved, ...patch }));
  };

  const rows: ReactNode[] = [];
  if (resolved.conductors !== undefined) {
    rows.push(
      <OptionField
        key="conductors"
        id={`${baseId}-conductors`}
        testId={`${testId}-conductors`}
        className={styles['wide']}
        label="Wire"
        choice={pickup.conductors}
        value={resolved.conductors}
        optionLabel={conductorLabel}
        onChange={(conductors) => {
          update({ conductors });
        }}
      />,
    );
  }
  if (resolved.polepieces !== undefined) {
    rows.push(
      <OptionField
        key="polepieces"
        id={`${baseId}-polepieces`}
        testId={`${testId}-polepieces`}
        label="Pole pieces"
        choice={pickup.hardware.polepieces}
        value={resolved.polepieces}
        optionLabel={polepieceLabel}
        onChange={(polepieces) => {
          update({ polepieces });
        }}
      />,
    );
  }
  if (resolved.cover !== undefined && pickup.hardware.cover !== undefined) {
    rows.push(
      <OptionField
        key="cover"
        id={`${baseId}-cover`}
        testId={`${testId}-cover`}
        label="Cover"
        choice={pickup.hardware.cover}
        value={resolved.cover}
        optionLabel={coverLabel}
        onChange={(cover) => {
          update({ cover });
        }}
      />,
    );
  }
  if (resolved.potting !== undefined) {
    rows.push(
      <OptionField
        key="potting"
        id={`${baseId}-potting`}
        testId={`${testId}-potting`}
        label="Potting"
        choice={pickup.potting}
        value={resolved.potting}
        optionLabel={pottingLabel}
        onChange={(potting) => {
          update({ potting });
        }}
      />,
    );
  }
  if (resolved.spacingMm !== undefined && typeof spacing === 'object') {
    rows.push(
      <OptionField
        key="spacing"
        id={`${baseId}-spacing`}
        testId={`${testId}-spacing`}
        label="String spacing"
        choice={spacing}
        value={resolved.spacingMm}
        optionLabel={spacingLabel}
        onChange={(spacingMm) => {
          update({ spacingMm });
        }}
      />,
    );
  }

  return (
    <fieldset className={classes} data-testid={testId}>
      <VisuallyHidden as="legend">{legend}</VisuallyHidden>
      {bobbins.length > 0 && (
        <div className={styles['coils']}>
          <PickupPreview
            className={styles['preview']}
            data-testid={`${testId}-preview`}
            type={pickup.type}
            coils={bobbins.map((bobbin) => ({
              style: bobbin.style,
              color: resolved.bobbins?.[bobbin.id] ?? bobbin.defaultColor,
            }))}
            polepieces={finish}
            label={previewLabel}
          />
          <div className={styles['coilFields']}>
            {bobbins.map((bobbin, index) => (
              <OptionField
                key={bobbin.id}
                id={`${baseId}-${bobbin.id}`}
                testId={`${testId}-bobbin-${bobbin.id}`}
                label={labels[index] ?? bobbin.style}
                choice={{ options: bobbin.palette, defaultOption: bobbin.defaultColor }}
                value={resolved.bobbins?.[bobbin.id] ?? bobbin.defaultColor}
                optionLabel={bobbinColorLabel}
                onChange={(color) => {
                  update({ bobbins: { ...(resolved.bobbins ?? {}), [bobbin.id]: color } });
                }}
              />
            ))}
          </div>
        </div>
      )}
      {rows.length > 0 && <div className={styles['options']}>{rows}</div>}
      {helpTo !== undefined && (
        <Text variant="meta" tone="muted" className={styles['note']}>
          Not every option is always available.{' '}
          <TextLink to={helpTo} data-testid={`${testId}-help`}>
            What happens if my choice is not in stock?
          </TextLink>
        </Text>
      )}
    </fieldset>
  );
}
