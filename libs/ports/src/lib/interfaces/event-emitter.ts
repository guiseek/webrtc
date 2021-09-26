import { EventCallback, Callback, HashMap } from '../types';

export interface EventEmitter<T extends HashMap<T>> {
  events: EventCallback<T>;

  on<K extends keyof T>(key: K, fn: Callback<T[K]>): void;

  get<K extends keyof T>(key: K): Callback<T[K]>[];
}
