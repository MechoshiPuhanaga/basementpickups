/**
 * Test hook shared by every design-system component: an optional `data-testid`
 * forwarded to the component's root element. Tests (Vitest + Playwright) locate
 * elements by test id only, never by text, role or class name.
 */
export interface TestIdProps {
  'data-testid'?: string | undefined;
}
