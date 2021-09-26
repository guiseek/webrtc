import { Callback } from './callback';
import { HashMap } from './hash-map';

export type EventCallback<M extends HashMap<Callback<keyof M>>> = Map<
  keyof M,
  Callback<M[keyof M]>[]
>;
