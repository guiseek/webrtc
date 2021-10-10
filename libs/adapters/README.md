# adapters

```ts
import { Signaling, SignalMessage } from '@webp2p/ports';
import { io, Socket } from 'socket.io-client';

export class SignalingImpl implements Signaling<Socket> {
  conn: Socket;

  constructor(readonly signalingServer: string) {
    this.conn = io(signalingServer);
  }

  on(event: string, fn: (message: SignalMessage) => void) {
    this.conn.on(event, fn);
  }

  emit<T>(event: string, message: T) {
    this.conn.emit(event, message);
  }
}
```

This library was generated with [Nx](https://nx.dev).

## Running unit tests

Run `nx test adapters` to execute the unit tests via [Jest](https://jestjs.io).
