/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard'],
  rules: {
    'selector-class-pattern': null,
    'custom-property-pattern': null,
    'no-descending-specificity': null,
    'selector-max-compound-selectors': 3,
    'max-nesting-depth': 0,
    'selector-nested-pattern': '^$',
  },
};
