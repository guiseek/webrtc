import { Socket, SignalMessage } from './interfaces';

export abstract class Signaling<T extends Socket> {
  abstract conn: T;

  abstract on(event: string, fn: (message: SignalMessage) => void): void;

  abstract emit<T>(event: string, message: T): void;
}
