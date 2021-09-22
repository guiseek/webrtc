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

#### Nossos eventos de sinalização

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

#### O estado da nossa comunicação

Arquivo `libs/ports/src/lib/interfaces/peer-ui-state.ts`
```ts
export interface PeerUiState {
  audio: boolean
  video: boolean
}
```

#### Nossa mensagem de sinalização

Arquivo `libs/ports/src/lib/interfaces/signal-message.ts`
```ts
export interface SignalMessage {
  sdp: RTCSessionDescription;
  ice: RTCIceCandidate;
  meet: string;
  user: string;
}
```

#### O mensageiro da nossa sinalização

Arquivo `libs/ports/src/lib/interfaces/socket.ts`
```ts
import { Callback } from '../types';

export interface Socket {
  on<T>(evt: string, fn: Callback<T>): void;
  emit<T>(evt: string, message: T): void;
}
```

#### Nossa função de retorno em eventos

Arquivo `libs/ports/src/lib/types/callback.ts`
```ts
export type Callback<T> = (value: T) => void;
```

#### Indica quem é a função de retorno pelo nome do evento

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

#### Todas possibilidades de eventos e o tipo de seu respectivo retorno

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

#### Nossos eventos

Arquivo `libs/ports/src/lib/types/peer-event.ts`
```ts
import { PeerEventMap } from './peer-event-map'

export type PeerEvent = keyof PeerEventMap;
```

#### Tudo que precisaremos em cada ponta

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

#### Como nos comunicaremos

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

```sh
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

## Step 2
### Biblioteca adapters

```sh
nx generate @nrwl/workspace:library --name=adapters --strict
```

#### Arquivos
```sh
touch libs/adapters/src/lib/signaling.impl.ts
touch libs/adapters/src/lib/peer.impl.ts
```

Em `libs/adapters/src/lib/signaling.impl.ts`
```ts
import { Signaling, SignalMessage } from '@webrtc/ports';
import { io, Socket } from 'socket.io-client';

export class SignalingImpl implements Signaling<Socket> {
  conn: Socket;

  constructor(readonly signalingServer: string) {
    this.conn = io(signalingServer);
  }

  of(namespace: string, event: string, fn: (message: SignalMessage) => void) {
    this.conn.io.socket(namespace).on(event, fn);
  }

  on(event: string, fn: (message: SignalMessage) => void) {
    this.conn.on(event, fn);
  }

  emit<T>(event: string, message: T) {
    this.conn.emit(event, message);
  }
}
```

```sh
```

Arquivo `libs/adapters/src/lib/peer.impl.ts`
```ts
import {
  Peer,
  Callback,
  PeerEventMap,
  PeerEventCallback,
  SignalMessage,
  PeerUiState,
  Signaling,
  Socket,
} from '@works/ports';
import { BehaviorSubject } from 'rxjs';

export class PeerImpl implements Peer {
  user?: string | undefined;
  meet?: string | undefined;

  conn: RTCPeerConnection;

  stream: MediaStream;
  remote?: MediaStream | undefined;

  uiState: PeerUiState;

  receiveMeta?: string;
  receiveBuffer: ArrayBuffer[] = [];
  public receivedSize = 0;
  
  private _progress = new BehaviorSubject<number>(0);
  public progress$ = this._progress.asObservable();

  private receiveChannel!: RTCDataChannel;
  private sendChannel!: RTCDataChannel;

  events: PeerEventCallback<keyof PeerEventMap>;

  constructor(
    configuration: RTCConfiguration,
    private signaling: Signaling<Socket>
  ) {
    this.conn = new RTCPeerConnection(configuration);

    this.stream = new MediaStream();
    this.user = this.stream.id;

    this.events = new Map();

    this.uiState = {
      audio: false,
      video: false,
    };
  }

  public on<K extends keyof PeerEventMap>(
    key: K,
    fn: Callback<PeerEventMap[K]>
  ): void {
    this.events.set(key, fn as () => void);
  }

  public connect(meet?: string): void {
    if (meet) {
      this.meet = meet;
    }

    this.signalUp();
    this.listen();
  }

  public send(message: string): void {
    this.sendChannel.send(message);
  }

  public upload(file: File): void {
    this.sendChannel.binaryType = 'arraybuffer';

    const chunkSize = 16384;
    const fileReader = new FileReader();
    let offset = 0;

    fileReader.onload = ({ target }: ProgressEvent<FileReader>) => {
      const result = target?.result as ArrayBuffer;

      if (offset === 0) {
        this.send(`${file.name};${file.size}`);
      }

      this.sendChannel.send(result);

      offset += result.byteLength;

      const percentage = (offset / file.size) * 100;
      this._progress.next(percentage);
      
      if (offset < file.size) {
        readSlice(offset);
      } else {
        this._progress.next(0);
      }
    };

    const readSlice = (o: number) => {
      const slice = file.slice(offset, o + chunkSize);
      fileReader.readAsArrayBuffer(slice);
    };

    readSlice(0);
  }

  async signalUp(): Promise<void> {
    await navigator.mediaDevices
      .getUserMedia(this.getConfig())
      .then(this.gotStream());

    this.signaling.on('message', (message) => {
      this.getSignalMessage()(message);
    });
  }

  getConfig() {
    let audio: string | Partial<MediaDeviceInfo> =
      localStorage.getItem('audio') ?? 'true';
    let video: string | Partial<MediaDeviceInfo> =
      localStorage.getItem('video') ?? 'true';

    if (audio) {
      const { deviceId } = JSON.parse(audio as string);
      audio = { deviceId };
    }
    if (video) {
      const { deviceId } = JSON.parse(video as string);
      video = { deviceId };
    }

    return { audio, video } as MediaStreamConstraints;
  }

  listen(): void {
    this.conn.onicecandidate = this.getIceCandidate();

    this.conn.ondatachannel = (evt) => {
      this.receiveChannel = evt.channel;
      this.receiveChannel.onmessage = (message) => {
        if (typeof message.data === 'string') {
          this.receiveMeta = message.data;
          const event = this.events.get('data');
          if (event) event(message.data);
        }

        if (message.data instanceof ArrayBuffer) {
          this.onReceiveMessageCallback(message);
          const event = this.events.get('data');
          if (event) event(message.data);
        }
      };
    };

    this.sendChannel = this.conn.createDataChannel('sendDataChannel');
    this.sendChannel.onopen = () => {
      const event = this.events.get('dataChannel');
      if (event) event(this.sendChannel);
    };
  }

  gotStream(): (stream: MediaStream) => void {
    return (stream) => {
      this.stream = stream;

      const onStreamEvent = this.events.get('stream');
      if (onStreamEvent) onStreamEvent(stream);

      const [videoTrack] = this.stream.getVideoTracks();
      const [audioTrack] = this.stream.getAudioTracks();

      this.conn.addTrack(videoTrack);
      this.conn.addTrack(audioTrack);

      this.remote = new MediaStream();

      this.conn.ontrack = ({ isTrusted, track }) => {
        if (this.remote && isTrusted && track) {
          this.remote.addTrack(track);
        }

        const onTrackEvent = this.events.get('track');
        if (onTrackEvent) onTrackEvent(track);
      };

      this.conn
        .createOffer()
        .then(this.setDescription())
        .catch(this.errorHandler);
    };
  }

  setDescription(): (description: RTCSessionDescriptionInit) => void {
    return (description) => {
      this.conn.setLocalDescription(description).then(() => {
        const message = {
          sdp: this.conn.localDescription,
          meet: this.meet,
          user: this.user,
        };
        this.signaling.emit('message', message);
      });
    };
  }

  getSignalMessage(): (message: SignalMessage) => void {
    return ({ user, sdp, ice }) => {
      if (user === this.user) {
        return;
      }

      if (sdp) {
        this.conn
          .setRemoteDescription(new RTCSessionDescription(sdp))
          .then(() => {
            if (sdp.type === 'offer') {
              this.conn
                .createAnswer()
                .then(this.setDescription())
                .catch(this.errorHandler);
            }
          })
          .catch(this.errorHandler);
      } else if (ice) {
        this.conn
          .addIceCandidate(new RTCIceCandidate(ice))
          .catch(this.errorHandler);

        const onCandidateEvent = this.events.get('iceCandidateChange');
        if (onCandidateEvent) onCandidateEvent(ice);
      }
    };
  }

  getIceCandidate(): (event: RTCPeerConnectionIceEvent) => void {
    return (event) => {
      const onIceConnectionEvent = this.events.get('iceConnectionChange');
      if (onIceConnectionEvent) onIceConnectionEvent(event);

      if (event.candidate != null) {
        const message = {
          ice: event.candidate,
          meet: this.meet,
          user: this.user,
        };
        this.signaling.emit('message', message);
      }
    };
  }

  onReceiveMessageCallback({ data }: MessageEvent<ArrayBuffer>): void {
    this.receiveBuffer.push(data);
    this.receivedSize += data.byteLength;

    let name = '';

    if (this.receiveMeta) {
      const meta = this.receiveMeta?.split(';');
      const [filename, size] = meta ? meta : [];
      const percentage = (this.receivedSize / +size) * 100;
      this._progress.next(percentage);

      name = filename;

      
    }
    if (data.byteLength < 16384) {
      const received = new Blob(this.receiveBuffer);

      this.receiveBuffer = [];
      this.receivedSize = 0;

      const link = document.createElement('a');
      link.href = URL.createObjectURL(received);
      link.download = name;
      link.click();

      delete this.receiveMeta;
      this._progress.next(0);
    }
  }

  toggleAudio(stream: MediaStream) {
    const tracks = stream.getAudioTracks();
    tracks.forEach((t) => (t.enabled = !t.enabled));

    this.uiState.audio = !this.uiState.audio;
  }

  toggleVideo(stream: MediaStream) {
    const tracks = stream.getVideoTracks();
    tracks.forEach((t) => (t.enabled = !t.enabled));

    this.uiState.video = !this.uiState.video;
  }

  errorHandler(error: RTCPeerConnectionIceErrorEvent): void {
    console.error(error);
  }

  close() {
    const tracks = this.stream.getTracks();
    tracks.forEach((t) => t.stop());
    this.conn.close();
  }
}
```

```sh
rm libs/adapters/src/lib/adapters*
```
