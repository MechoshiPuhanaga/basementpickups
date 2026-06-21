export interface HtmlShell {
  readonly head: string;
  readonly tail: string;
}

const HEAD_PLACEHOLDER = '<!--ssr-head-->';
const OUTLET_PLACEHOLDER = '<!--ssr-outlet-->';

export function splitTemplate(template: string, headHtml: string): HtmlShell {
  const withHead = template.replace(HEAD_PLACEHOLDER, headHtml);
  const idx = withHead.indexOf(OUTLET_PLACEHOLDER);

  if (idx === -1) {
    throw new Error(`Template is missing ${OUTLET_PLACEHOLDER}`);
  }

  return {
    head: withHead.slice(0, idx),
    tail: withHead.slice(idx + OUTLET_PLACEHOLDER.length),
  };
}
