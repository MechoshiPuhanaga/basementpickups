/// <reference types="vite/client" />

declare global {
  interface Window {
    __staticRouterHydrationData?: unknown;
  }
}

export {};
