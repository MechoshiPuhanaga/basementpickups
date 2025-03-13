import { Request } from 'express';
import { FC, ForwardedRef, ReactNode } from 'react';

interface PickupVariant {
  dcr: number;
  inductance: number;
  magnet: string;
  position: string;
  spacing: number;
}
export interface Pickup {
  description: string;
  id: string;
  images: Array<string>;
  name: string;
  type: string;
  variants: Array<PickupVariant>;
}

export interface Products {
  humbuckers: Array<Pickup>;
}

export interface AppState {
  products: Products;
}

export interface SSRContext {
  data: AppState;
  params: Request['params'];
  query?: Request['query'];
  url: Request['url'];
}

export interface LoadDataArgs {
  params: Request['params'];
  query?: Request['query'];
  url: Request['url'];
}

export interface Ref {
  ref: ForwardedRef<HTMLElement>;
}

export interface SSRRouteConfig {
  loadData?: (args: LoadDataArgs) => Promise<AppState>;
  pages?: SSRRoute[];
}

export interface SSRRoute extends SSRRouteConfig {
  element: FC<{ children?: ReactNode }>;
  exact: boolean;
  path: string;
}
