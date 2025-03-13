export const classer = (...classNames: Array<boolean | string | undefined | null | number>) =>
  classNames.filter(Boolean).join(' ');
