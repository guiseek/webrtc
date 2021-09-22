# Webrtc

## Ports

Biblioteca ports para abstrações

```sh
nx generate @nrwl/workspace:library --name=ports
```

### Diretórios

```sh
mkdir -p libs/ports/src/lib/enums
mkdir -p libs/ports/src/lib/interfaces
mkdir -p libs/ports/src/lib/types
```

### Arquivos

```sh
touch libs/ports/src/lib/enums/signaling-events.ts
touch libs/ports/src/lib/interfaces/peer-ui-state.ts
touch libs/ports/src/lib/interfaces/signal-message.ts
touch libs/ports/src/lib/interfaces/socket.ts
touch libs/ports/src/lib/types/callback.ts
touch libs/ports/src/lib/types/peer-event-callback.ts
touch libs/ports/src/lib/types/peer-event-map.ts
touch libs/ports/src/lib/types/peer-event.ts
touch libs/ports/src/lib/peer.ts
touch libs/ports/src/lib/signaling.ts
```

#### 

Arquivo `libs/ports/src/lib/enums/signaling-events.ts`
```ts
export enum SignalingEvent {
  KnockKnock = 'knock-knock',
  Connection = 'connection',
  Available = 'available',
  Message = 'message',
  Answer = 'answer',
  Offer = 'offer',
}
```

#### 

Arquivo `libs/ports/src/lib/interfaces/peer-ui-state.ts`
```ts
export interface PeerUiState {
  audio: boolean
  video: boolean
}
```

#### 

Arquivo `libs/ports/src/lib/interfaces/signal-message.ts`
```ts
export interface SignalMessage {
  sdp: RTCSessionDescription;
  ice: RTCIceCandidate;
  meet: string;
  user: string;
}
```

#### 

Arquivo `libs/ports/src/lib/interfaces/socket.ts`
```ts
import { Callback } from '../types';

export interface Socket {
  on<T>(evt: string, fn: Callback<T>): void;
  emit<T>(evt: string, message: T): void;
}
```

#### 

Arquivo `libs/ports/src/lib/types/callback.ts`
```ts
export type Callback<T> = (value: T) => void;
```

#### 

Arquivo `libs/ports/src/lib/types/peer-event-callback.ts`
```ts
import { PeerEventMap } from './peer-event-map';
import { PeerEvent } from './peer-event';
import { Callback } from './callback';

export type PeerEventCallback<K extends PeerEvent> = Map<
  K,
  Callback<PeerEventMap[K]>
>;
```

#### 

Arquivo `libs/ports/src/lib/types/peer-event-map.ts`
```ts
export type PeerEventMap = {
  /**
   * A nova mídia de entrada foi negociada para um
   * determinado RTCRtpReceivere esse receptor track foi
   * adicionado a quaisquer MediaStreams remotos associados.
   */
  track: MediaStreamTrack;

  /**
   * Stream local disponível
   */
  stream: MediaStream;

  /**
   * O estado de sinalização mudou. Essa mudança
   * de estado é o resultado de um setLocalDescriptionou
   * de setRemoteDescriptionser invocado.
   */
  signalingChange: RTCSignalingState;

  /**
   * A RTCPeerConnectionState mudou.
   */
  connectionChange: RTCPeerConnectionState;

  /**
   * Um novo RTCIceCandidate está disponível.
   */
  iceCandidateChange: RTCIceCandidate;

  /**
   * O estado ICE mudou.
   */
  iceGatheringChange: RTCIceGatheringState;

  /**
   * O RTCPeerConnectionIceEvent da conexão ICE mudou.
   */
  iceConnectionChange: RTCPeerConnectionIceEvent;


  /**
   * Um novo RTCDataChannel é despachado para o script
   * em resposta ao outro par criando um canal.
   */
  dataChannel: RTCDataChannel;

  /**
   * Um novo RTCDataChannel é despachado para o script
   * em resposta ao outro par criando um canal.
   */
  data: ArrayBuffer | string;
};
```

#### 

Arquivo `libs/ports/src/lib/types/peer-event.ts`
```ts
import { PeerEventMap } from './peer-event-map'

export type PeerEvent = keyof PeerEventMap;
```

#### 

Arquivo `libs/ports/src/lib/peer.ts`
```ts
import { Observable } from 'rxjs';

import { PeerUiState, SignalMessage } from './interfaces';
import { Callback, PeerEvent, PeerEventCallback, PeerEventMap } from './types';

export abstract class Peer {
  abstract uuid?: string;
  abstract meet?: string;

  abstract conn: RTCPeerConnection;

  abstract stream: MediaStream;
  abstract remote?: MediaStream;

  abstract uiState: PeerUiState;

  abstract receiveBuffer: ArrayBuffer[];
  public abstract receivedSize: number;
  public abstract progress$: Observable<number>;

  abstract readonly events: PeerEventCallback<PeerEvent>;

  public abstract on<K extends keyof PeerEventMap>(
    key: K,
    fn: Callback<PeerEventMap[K]>
  ): void;

  public abstract connect(uuid?: string): void;

  public abstract send(message: string): void;

  public abstract upload(message: File): void;

  abstract signalUp(): Promise<void>

  abstract listen(): void;

  abstract gotStream(): (stream: MediaStream) => void;

  abstract setDescription(): (value: RTCSessionDescriptionInit) => void;

  abstract getSignalMessage(): (message: SignalMessage) => void;

  abstract getIceCandidate(): (event: RTCPeerConnectionIceEvent) => void;

  abstract onReceiveMessageCallback(event: MessageEvent<ArrayBuffer>): void;

  abstract toggleAudio(stream: MediaStream): void

  abstract toggleVideo(stream: MediaStream): void

  abstract errorHandler(error: Event): void;

  abstract close(): void;
}
```

#### 

Arquivo `libs/ports/src/lib/signaling.ts`
```ts
import { Socket, SignalMessage } from './interfaces';

export abstract class Signaling<T extends Socket> {
  abstract conn: T;

  abstract on(event: string, fn: (message: SignalMessage) => void): void;

  abstract of(meet: string, event: string, fn: (message: SignalMessage) => void): void;

  abstract emit<T>(event: string, message: T): void;
}
```

### Facilitar a exportação

```ssh
touch libs/ports/src/lib/enums/index.ts
touch libs/ports/src/lib/interfaces/index.ts
touch libs/ports/src/lib/types/index.ts

```


Em `touch libs/ports/src/lib/enums/index.ts`
```sh
export * from './signaling-events';
```

Em `touch libs/ports/src/lib/interfaces/index.ts`
```sh
export * from './peer-ui-state';
export * from './signal-message';
export * from './socket';
```

Em `touch libs/ports/src/lib/types/index.ts`
```sh
export * from './callback';
export * from './peer-event-callback';
export * from './peer-event-map';
export * from './peer-event';
```

### API pública


Em `libs/ports/src/index.ts`
```sh
export * from './lib/interfaces';
export * from './lib/signaling';
export * from './lib/enums';
export * from './lib/types';
export * from './lib/peer';
```

### 

```sh
```
