import { Request } from 'express';
import { FC, ForwardedRef, ReactNode } from 'react';

// TODO: Think how we can type this:
export type InitialState<T> = T;

export interface SSRContext {
  data: InitialState<unknown>;
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
  loadData?: (args: LoadDataArgs) => Promise<InitialState<unknown>>;
  pages?: SSRRoute[];
}

export interface SSRRoute extends SSRRouteConfig {
  element: FC<{ children?: ReactNode }>;
  exact: boolean;
  path: string;
}
