import type { FaqIconName } from '../design-system/atoms/FaqIcon';

export interface FaqItem {
  readonly id: string;
  readonly question: string;
  readonly answer: string;
  readonly icon: FaqIconName;
}

/**
 * Q&A / FAQ content for the workshop's terms and craft notes. Prepared content;
 * the section/page that renders it is roadmap item 6 (see PROJECT_STATUS.md).
 * Wording is intentionally restrained and editorial, each answer kept under 50
 * words. The list is extensible — more entries may be added over time.
 */
export const FAQ_ITEMS: readonly FaqItem[] = [
  {
    id: 'made-to-order',
    question: 'Are pickups in stock, or made to order?',
    answer:
      'Every pickup is wound to order, built to your specification rather than held in stock. A short lead time is therefore normal; on occasion a finished piece may already be available.',
    icon: 'made-to-order',
  },
  {
    id: 'handwork',
    question: 'Will my pickup be perfectly finished?',
    answer:
      'These are made by hand. You may notice faint tooling marks or small natural variations in the materials — not faults, but the honest signature of work carried out one pickup at a time.',
    icon: 'handwork',
  },
  {
    id: 'batch-variation',
    question: 'Do materials and colours stay the same between orders?',
    answer:
      'Because we source materials in small quantities, some components and bobbin colours may differ slightly from one batch to the next. We always select the closest match available to the original.',
    icon: 'batch-variation',
  },
  {
    id: 'measurement-conditions',
    question: 'Under what conditions are measurements taken?',
    answer:
      'All electrical measurements are taken under controlled conditions — between 18 and 22 °C and 40–50% relative humidity — so the figures we publish remain consistent and fairly comparable.',
    icon: 'measurement-conditions',
  },
  {
    id: 'specifications',
    question: 'Are the published specifications exact?',
    answer:
      'Published specifications are averages, not guarantees. As with any hand-wound pickup, the one you receive may vary slightly from the stated values while remaining faithful to its intended voice.',
    icon: 'specifications',
  },
  {
    id: 'measured',
    question: 'How thoroughly is each pickup tested?',
    answer:
      'Each pickup is measured repeatedly during and after winding — inductance, DC resistance, capacitance, and resonant frequencies — so every piece leaves the bench fully characterised and true to its design.',
    icon: 'measured',
  },
  {
    id: 'packaging',
    question: 'How is my pickup packaged?',
    answer:
      'Each pickup arrives in elegant, protective packaging marked with its own measured values — DC resistance, inductance, capacitance, loaded and self-resonant frequencies — alongside its colour and string spacing, so the details travel with the piece.',
    icon: 'packaging',
  },
  {
    id: 'wiring',
    question: 'How do I know how to wire it up?',
    answer:
      'Every pickup carries a small label on the back of its baseplate listing its measured data and a colour code for the lead wires, so you always know which conductor is which when wiring it in.',
    icon: 'wiring',
  },
  {
    id: 'custom-signature',
    question: 'Can you build a custom or signature pickup?',
    answer:
      'Gladly. Tell us what you have in mind through an enquiry, and we will discuss the wind, materials, and voice together. Pricing for bespoke and signature builds is agreed case by case, according to the work involved.',
    icon: 'signature',
  },
  {
    id: 'wiring-colour-code',
    question: 'What is the standard wiring colour code?',
    answer:
      'Our four-conductor humbuckers follow a consistent code. North coil (slug): start red, finish white. South coil (screws): start black, finish green. For standard series wiring, join white to green; red is hot, black and the bare shield are ground. Splitting leaves the slug coil active.',
    icon: 'coil-wiring',
  },
];
