declare module '*.jpg' {
  const url: string;
  export default url;
}

declare module '*.png' {
  const url: string;
  export default url;
}

declare module '*.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

interface Window {
  __INITIAL_STATE__: unknown;
}
