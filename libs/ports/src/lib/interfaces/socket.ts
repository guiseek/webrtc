import { Callback } from '../types';

export interface Socket {
  on<T>(evt: string, fn: Callback<T>): void;
  emit<T>(evt: string, message: T): void;
}
