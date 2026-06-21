/// <reference types="vite/client" />

declare global {
  interface TrustedScriptURL {
    toString: () => string;
  }

  interface TrustedTypePolicy {
    createScriptURL: (input: string) => TrustedScriptURL;
  }

  interface TrustedTypePolicyFactory {
    createPolicy: (
      policyName: string,
      policyOptions: { createScriptURL: (input: string) => string },
    ) => TrustedTypePolicy;
  }

  interface Window {
    __staticRouterHydrationData?: unknown;
    trustedTypes?: TrustedTypePolicyFactory;
  }
}

export {};
