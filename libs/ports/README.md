# WebRTC Ports


## Signaling

```ts
export abstract class Signaling<T extends Socket> {
  abstract conn: T;

  abstract on(event: string, fn: (message: SignalMessage) => void): void;

  abstract emit<T>(event: string, message: T): void;
}
```

### Exemplo

Exemplo de implementação em [signaling.impl.ts](../adapters/src/lib/signaling.impl.ts 'Signaling') na biblioteca [adapters](../adapters/README.md 'Adapters')


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


### English

Base abstraction library dedicated to developing key pieces in an application for streaming audio, video and p2p data with WebRTC.

For now we have implementation recommendations here for signaling and meeting

**This library does not implement anything**, here we only have abstractions for implementation contracts and usage in cases of dependency injection.

Need a ready-made implementation? See our [adapters](../adapters/README.md 'Adapters')!

---

### Português

Biblioteca de abstração base dedicada ao desenvolvimento das principais peças em um aplicativo para streaming de áudio, vídeo e dados p2p com WebRTC.

Por enquanto temos aqui recomendações de implementação para sinalização e reunião.

Esta biblioteca não implementa nada, aqui temos somente abstrações para contratos de implementações e uso em casos de injeção de dependência.

Precisa de uma implementação pronta? Veja nossos [adapters](../adapters/README.md 'Adapters')!

---

## Install

### npm

```sh
npm install @webp2p/ports
```

### yarn

```sh
yarn add @webp2p/ports
```
