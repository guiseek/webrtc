 1. [Ports](#Ports)
	* 1.1. [Diretórios](#Diretrios)
	* 1.2. [Arquivos](#Arquivos)
		* 1.2.1. [Nossos eventos de sinalização](#Nossoseventosdesinalizao)
		* 1.2.2. [O estado da nossa comunicação](#Oestadodanossacomunicao)
		* 1.2.3. [Nossa mensagem de sinalização](#Nossamensagemdesinalizao)
		* 1.2.4. [O mensageiro da nossa sinalização](#Omensageirodanossasinalizao)
		* 1.2.5. [Nossa função de retorno em eventos](#Nossafunoderetornoemeventos)
		* 1.2.6. [Indica quem é a função de retorno pelo nome do evento](#Indicaquemafunoderetornopelonomedoevento)
		* 1.2.7. [Todas possibilidades de eventos e o tipo de seu respectivo retorno](#Todaspossibilidadesdeeventoseotipodeseurespectivoretorno)
		* 1.2.8. [Nossos eventos](#Nossoseventos)
		* 1.2.9. [Tudo que precisaremos em cada ponta](#Tudoqueprecisaremosemcadaponta)
		* 1.2.10. [Como nos comunicaremos](#Comonoscomunicaremos)
	* 1.3. [API pública](#APIpblica)
2. [Adapters](#Adapters)
	* 2.1. [Arquivos](#Arquivos-1)
	* 2.2. [Signaling](#Signaling)
	* 2.3. [Oscilloscope](#Oscilloscope)
	* 2.4. [Peer](#Peer)
	* 2.5. [API pública](#APIpblica-1)
3. [Gateway](#Gateway)
	* 3.1. [Inicialize o plugin nx nest](#Inicializeopluginnxnest)
	* 3.2. [Nosso app para comunicação inicial](#Nossoappparacomunicaoinicial)
	* 3.3. [Nosso gateway de sinalização](#Nossogatewaydesinalizao)
	* 3.4. [Mova para raiz do projeto](#Movapararaizdoprojeto)
4. [Web App](#WebApp)
	* 4.1. [Inicialize o plugin nx angular](#Inicializeopluginnxangular)
	* 4.2. [Gerando o aplicativo](#Gerandooaplicativo)
	* 4.3. [Home](#Home)
	* 4.4. [Config](#Config)
		* 4.4.1. [Guard](#Guard)
		* 4.4.2. [Component](#Component)
	* 4.5. [Meet](#Meet)
	* 4.6. [App Routing](#AppRouting)
	* 4.7. [App](#App)
		* 4.7.1. [Module](#Module)
		* 4.7.2. [Component](#Component-1)
	* 4.8. [Styles](#Styles)
		* 4.8.1. [Typography](#Typography)
	* 4.9. [Index HTML](#IndexHTML)

# Webrtc

##  1. <a name='Ports'></a>Ports

Biblioteca ports para abstrações

```sh
nx generate @nrwl/workspace:library --name=ports
```

###  1.1. <a name='Diretrios'></a>Diretórios

```sh
mkdir -p libs/ports/src/lib/enums
mkdir -p libs/ports/src/lib/interfaces
mkdir -p libs/ports/src/lib/types
```

###  1.2. <a name='Arquivos'></a>Arquivos

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

####  1.2.1. <a name='Nossoseventosdesinalizao'></a>Nossos eventos de sinalização

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

####  1.2.2. <a name='Oestadodanossacomunicao'></a>O estado da nossa comunicação

Arquivo `libs/ports/src/lib/interfaces/peer-ui-state.ts`
```ts
export interface PeerUiState {
  audio: boolean
  video: boolean
}
```

####  1.2.3. <a name='Nossamensagemdesinalizao'></a>Nossa mensagem de sinalização

Arquivo `libs/ports/src/lib/interfaces/signal-message.ts`
```ts
export interface SignalMessage {
  sdp: RTCSessionDescription;
  ice: RTCIceCandidate;
  meet: string;
  user: string;
}
```

####  1.2.4. <a name='Omensageirodanossasinalizao'></a>O mensageiro da nossa sinalização

Arquivo `libs/ports/src/lib/interfaces/socket.ts`
```ts
import { Callback } from '../types';

export interface Socket {
  on<T>(evt: string, fn: Callback<T>): void;
  emit<T>(evt: string, message: T): void;
}
```

####  1.2.5. <a name='Nossafunoderetornoemeventos'></a>Nossa função de retorno em eventos

Arquivo `libs/ports/src/lib/types/callback.ts`
```ts
export type Callback<T> = (value: T) => void;
```

####  1.2.6. <a name='Indicaquemafunoderetornopelonomedoevento'></a>Indica quem é a função de retorno pelo nome do evento

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

####  1.2.7. <a name='Todaspossibilidadesdeeventoseotipodeseurespectivoretorno'></a>Todas possibilidades de eventos e o tipo de seu respectivo retorno

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

####  1.2.8. <a name='Nossoseventos'></a>Nossos eventos

Arquivo `libs/ports/src/lib/types/peer-event.ts`
```ts
import { PeerEventMap } from './peer-event-map'

export type PeerEvent = keyof PeerEventMap;
```

####  1.2.9. <a name='Tudoqueprecisaremosemcadaponta'></a>Tudo que precisaremos em cada ponta

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

####  1.2.10. <a name='Comonoscomunicaremos'></a>Como nos comunicaremos

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

##### Barrel files

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

###  1.3. <a name='APIpblica'></a>API pública


Em `libs/ports/src/index.ts`
```sh
export * from './lib/interfaces';
export * from './lib/signaling';
export * from './lib/enums';
export * from './lib/types';
export * from './lib/peer';
```

##  2. <a name='Adapters'></a>Adapters

```sh
nx generate @nrwl/workspace:library --name=adapters --strict
```

###  2.1. <a name='Arquivos-1'></a>Arquivos
```sh
touch libs/adapters/src/lib/signaling.impl.ts
touch libs/adapters/src/lib/peer.impl.ts

mkdir -p libs/adapters/src/lib/utils
touch libs/adapters/src/lib/utils/draw-oscilloscope.ts

rm libs/adapters/src/lib/adapters*
```

###  2.2. <a name='Signaling'></a>Signaling 

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


###  2.3. <a name='Oscilloscope'></a>Oscilloscope

Arquivo `libs/adapters/src/lib/utils/draw-oscilloscope.ts`
```ts
const defaultValue = {
  fill: '#fff',
  stroke: '#111',
};

export function drawOscilloscope(
  canvas: HTMLCanvasElement,
  analyser: AnalyserNode,
  style: {
    fill: string;
    stroke: string;
  } = defaultValue
) {
  if (!(canvas as any).isDestroyed) {
    requestAnimationFrame(() => {
      drawOscilloscope(canvas, analyser, style);
    });
  }

  const canvasCtx = <CanvasRenderingContext2D>(
    (<HTMLCanvasElement>canvas).getContext('2d')
  );

  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  analyser.getByteTimeDomainData(dataArray);

  if (canvas.parentElement?.style.backgroundColor) {
    canvasCtx.fillStyle = canvas.parentElement?.style.backgroundColor;
  }

  canvasCtx.fillStyle = style.fill;
  canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

  canvasCtx.lineWidth = 2;
  canvasCtx.strokeStyle = style.stroke;

  canvasCtx.beginPath();

  const sliceWidth = (canvas.width * 1.0) / bufferLength;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    const v = dataArray[i] / 128.0;
    const y = (v * canvas.height) / 2;

    if (i === 0) {
      canvasCtx.moveTo(x, y);
    } else {
      canvasCtx.lineTo(x, y);
    }

    x += sliceWidth;
  }

  canvasCtx.lineTo(canvas.width, canvas.height / 2);
  canvasCtx.stroke();
}
```

###  2.4. <a name='Peer'></a>Peer

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

###  2.5. <a name='APIpblica-1'></a>API pública
Em `libs/adapters/src/index.ts`
```ts
export * from './lib/utils/draw-oscilloscope';
export * from './lib/signaling.impl';
export * from './lib/peer.impl';
```

---

```sh
npm i -D @nrwl/angular @nrwl/nest
```



##  3. <a name='Gateway'></a>Gateway

###  3.1. <a name='Inicializeopluginnxnest'></a>Inicialize o plugin nx nest

```sh
npx nx g @nrwl/nest:init
```

###  3.2. <a name='Nossoappparacomunicaoinicial'></a>Nosso app para comunicação inicial

```sh
nx generate @nrwl/nest:application --name=gateway
```

###  3.3. <a name='Nossogatewaydesinalizao'></a>Nosso gateway de sinalização

```sh
nx generate @nrwl/nest:gateway --name=signaling --project=gateway
```

###  3.4. <a name='Movapararaizdoprojeto'></a>Mova para raiz do projeto

Move o arquivo `apps/gateway/src/app/app.module.ts` para o diretório `src` (1 para trás), ficando junto ao `main.ts` e `signaling.gateway.ts` que acabamos de criar.

O que restar no diretório `app` pode ser apagado.

Então ficaremos desta forma

Arquivo: `apps/gateway/src/main.ts`
```ts
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

(async () => {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3333;
  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port);
  });
})()
```

Arquivo: `apps/gateway/src/app.module.ts`
```ts
import { SignalingGateway } from './signaling.gateway';
import { Module } from '@nestjs/common';

@Module({
  providers: [SignalingGateway],
})
export class AppModule {}
```

Arquivo: `apps/gateway/src/signaling.gateway.ts`
```ts
import {
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { SignalingEvent, SignalMessage } from '@webrtc/ports';
import { Server, Socket } from 'socket.io';


@WebSocketGateway({ cors: true })
export class SignalingGateway implements OnGatewayConnection {
  @WebSocketServer()
  private server: Server;

  handleConnection(@ConnectedSocket() client: Socket) {
    client.emit(SignalingEvent.Connection, { id: client.id });
  }

  @SubscribeMessage(SignalingEvent.KnockKnock)
  knockKnock(
    @ConnectedSocket() contact: Socket,
    @MessageBody() payload: SignalMessage
  ) {
    const room = this.takeOrStartRoom(payload);
    if (room.length >= 0 && room.length < 5) {
      console.log(payload);
      
      contact.emit(SignalingEvent.Available, true);
    } else {
      contact.emit(SignalingEvent.Available, false);
    }
  }

  @SubscribeMessage(SignalingEvent.Message)
  onMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: SignalMessage
  ) {
    if (socket.rooms.has(payload.meet)) {
      socket.to(payload.meet).emit('message', payload);
    } else {
      socket.join(payload.meet);
      socket.broadcast.emit('message', payload);
    }
  }

  private takeOrStartRoom({ meet }: SignalMessage) {
    const adapter = this.server.sockets.adapter;
    return adapter.rooms[meet] ?? { length: 0 };
  }
}
```

##  4. <a name='WebApp'></a>Web App


###  4.1. <a name='Inicializeopluginnxangular'></a>Inicialize o plugin nx angular

```sh
npx nx g @nrwl/angular:init
```

Se ainda estiver configurado como nest, troque para angular, como mostrado abaixo

Arquivo: `workspace.json`
```sh
# De
"cli": {
  "defaultCollection": "@nrwl/nest"
},

# Para
"cli": {
  "defaultCollection": "@nrwl/angular"
},
```

###  4.2. <a name='Gerandooaplicativo'></a>Gerando o aplicativo

```sh
nx generate @nrwl/angular:application --name=webapp --backendProject=gateway --e2eTestRunner=none --routing
```

###  4.3. <a name='Home'></a>Home

```sh
nx g c home --project webapp
```

Arquivo: `apps/webapp/src/app/home/home.component.ts`
```ts
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { uuid } from '../utils/uuid';

@Component({
  selector: 'webrtc-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  form = this._fb.group({
    nickname: ['', Validators.required],
    meet: ['', Validators.required],
  });
  
  constructor(
    private _fb: FormBuilder,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.form.patchValue({ meet: uuid() });
  }

  onSubmit(form: FormGroup) {
    if (form.valid) {
      const { meet } = this.form.value
      this._router.navigate(['/', 'meet', meet], this.form.value)
    }
  }
}
```

Arquivo: `apps/webapp/src/app/home/home.component.scss`
```scss
:host {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;

  form {
    gap: 16px;

    .mat-form-field {
      width: 100%;
    }

    section {
      display: flex;
      flex-direction: row;
      margin-top: 8px;

      .mat-form-field {
        width: 260px;
      }

      .mat-button-base {
        margin-top: 2px;
        margin-left: 12px;
        margin-bottom: 22px;
        padding-left: 22px;
        padding-right: 22px;
      }
    }
  }
}
```

Arquivo: `apps/webapp/src/app/home/home.component.html`
```html
<form [formGroup]="form" (ngSubmit)="onSubmit(form)">
  <mat-form-field appearance="fill" color="accent">
    <mat-label>Sala</mat-label>
    <input matInput formControlName="meet" placeholder="Sala" />
    <mat-icon matSuffix>sentiment_very_satisfied</mat-icon>
    <mat-hint>Este código foi gerado aleatoriamente, mas é possível altera-lo</mat-hint>
  </mat-form-field>

  <section>
    <mat-form-field appearance="fill">
      <mat-label>Nickname</mat-label>
      <input matInput autofocus formControlName="nickname" placeholder="Qual seu apelido?" />
      <mat-icon matSuffix>sentiment_very_satisfied</mat-icon>
    </mat-form-field>

    <button mat-stroked-button [disabled]="form.invalid">Entrar na sala</button>
  </section>
</form>
```

###  4.4. <a name='Config'></a>Config

```sh
nx g c config --module app --project webapp
```

```sh
nx g g config/config --project webapp
# Enter em branco
```


```sh
mkdir apps/webapp/src/app/config/utils
```

```sh
touch apps/webapp/src/app/config/utils/some-one-selected.validator.ts
```

Arquivo `apps/webapp/src/app/config/utils/some-one-selected.validator.ts`
```ts
import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

export const someOneSelectedValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const audio = control.get('audio');
  const video = control.get('video');

  const someOne = !audio?.value && !video?.value;
  return someOne ? { someOneSelected: true } : null;
};
```


```sh
mkdir -p apps/webapp/src/app/utils
```

```sh
touch apps/webapp/src/app/utils/cast.ts
```

Arquivo `apps/webapp/src/app/utils/cast.ts`
```ts
export type ObjOf<T = unknown> = Record<string, T>

export const toJson = <R>(data: string) => JSON.parse(data) as R;
export const toText = <T extends ObjOf<T[keyof T]>>(data: T) => JSON.stringify(data);
```

```sh
touch apps/webapp/src/app/utils/uuid.ts
```

Arquivo `apps/webapp/src/app/utils/uuid.ts`
```ts
export function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  })
}
```

####  4.4.1. <a name='Guard'></a>Guard

Arquivo: `apps/webapp/src/app/config/config.guard.ts`
```ts
import { ActivatedRouteSnapshot, CanActivate, UrlTree } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfigComponent } from './config.component';
import { Injectable } from '@angular/core';
import { toJson } from '../utils/cast';
import { Observable } from 'rxjs';

@Injectable()
export class ConfigGuard implements CanActivate {
  constructor(readonly dialog: MatDialog) { }

  canActivate(
    route: ActivatedRouteSnapshot
  ): Observable<boolean | UrlTree> | boolean {
    let audio: null | string | Partial<MediaDeviceInfo> =
      localStorage.getItem('audio');
    let video: null | string | Partial<MediaDeviceInfo> =
      localStorage.getItem('video');

    if (audio) {
      const { deviceId } = toJson<MediaDeviceInfo>(audio as string);
      audio = { deviceId };
    }
    if (video) {
      const { deviceId } = toJson<MediaDeviceInfo>(video as string);
      video = { deviceId };
    }

    if (!audio && !video) {
      return this.openConfiguration(route);
    }

    return true;
  }

  openConfiguration(route: ActivatedRouteSnapshot) {
    return this.dialog
      .open(ConfigComponent, {
        data: route.paramMap.get('meet'),
        closeOnNavigation: false,
        disableClose: true,
      })
      .afterClosed();
  }
}
```

####  4.4.2. <a name='Component'></a>Component

Arquivo: `apps/webapp/src/app/config/config.component.ts`
```ts
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

import { toJson, toText } from '../utils/cast';
import { someOneSelectedValidator } from './utils/some-one-selected.validator';

@Component({
  selector: 'webrtc-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss'],
})
export class ConfigComponent implements OnInit {
  private _audio = new BehaviorSubject<MediaDeviceInfo[]>([]);
  public audio$ = this._audio.asObservable();

  private _video = new BehaviorSubject<MediaDeviceInfo[]>([]);
  public video$ = this._video.asObservable();

  deviceState = new FormGroup({
    audio: new FormControl(true),
    video: new FormControl(true),
  });

  deviceConfig = new FormGroup(
    {
      audio: new FormControl(''),
      video: new FormControl(''),
    },
    {
      validators: someOneSelectedValidator,
    }
  );

  streamConfig: {
    audio: MediaStream | null;
    video: MediaStream | null;
  } = {
    audio: null,
    video: null,
  };

  ngOnInit(): void {
    let audio = localStorage.getItem('audio');
    let video = localStorage.getItem('video');
    if (audio) audio = toJson(audio);
    if (video) video = toJson(video);

    navigator.mediaDevices.enumerateDevices().then((devices) => {
      this._audio.next(devices.filter((d) => d.kind === 'audioinput'));
      this._video.next(devices.filter((d) => d.kind === 'videoinput'));

      this.deviceConfig.patchValue({ audio, video });
    });
  }

  compareWith(o1: MediaDeviceInfo, o2: MediaDeviceInfo) {
    return o1 && o2 && o1.deviceId === o2.deviceId;
  }

  async onAudioChange(config: MediaDeviceInfo) {
    if (!config) {
      localStorage.removeItem('audio');
      this.streamConfig.audio = null;
      return;
    }
    const devices = navigator.mediaDevices;
    const audio = { deviceId: config.deviceId };
    const stream = await devices.getUserMedia({ audio });
    localStorage.setItem('audio', toText(config.toJSON()));
    this.streamConfig.audio = stream;
  }

  async onVideoChange(config: MediaDeviceInfo) {
    if (!config) {
      localStorage.removeItem('video');
      this.streamConfig.video = null;
      return;
    }
    const devices = navigator.mediaDevices;
    const video = { deviceId: config.deviceId };
    const stream = await devices.getUserMedia({ video });
    localStorage.setItem('video', toText(config.toJSON()));
    this.streamConfig.video = stream;
  }
}
```

Arquivo: `apps/webapp/src/app/config/config.component.scss`
```ts
:host {
  display: flex;
  flex-direction: column;

  .container {
    width: 410px;
    overflow: hidden;

    video, audio {
      max-width: 100%;
    }
  }
}
```

Arquivo: `apps/webapp/src/app/config/config.component.html`
```html
<h3 mat-dialog-title>Configuração</h3>

<form [formGroup]="deviceConfig">
  <mat-form-field appearance="fill">
    <mat-label>Câmera</mat-label>
    <mat-select
      formControlName="video"
      [compareWith]="compareWith"
      (selectionChange)="onVideoChange($event.value)"
    >
      <mat-option>- Sem câmera -</mat-option>
      <mat-option *ngFor="let d of video$ | async" [value]="d">
        {{ d.label }}
      </mat-option>
    </mat-select>
    <mat-error *ngIf="deviceConfig.get('video')?.invalid">
      Por favor, selecione uma câmera
    </mat-error>
    <mat-hint>Selecione sua câmera</mat-hint>
  </mat-form-field>
  <video
    muted
    autoplay
    playsinline
    poster="assets/camera.svg"
    [srcObject]="streamConfig.video"
  ></video>

  <mat-form-field appearance="fill">
    <mat-label>Microfone</mat-label>
    <mat-select
      formControlName="audio"
      [compareWith]="compareWith"
      (selectionChange)="onAudioChange($event.value)"
    >
      <mat-option>- Sem microfone -</mat-option>
      <mat-option *ngFor="let d of audio$ | async" [value]="d">
        {{ d.label }}
      </mat-option>
    </mat-select>
    <mat-error *ngIf="deviceConfig.get('audio')?.invalid">
      Por favor, selecione um microfone
    </mat-error>
    <mat-hint>Selecione seu microfone</mat-hint>
  </mat-form-field>

  <div class="container" *ngIf="streamConfig.audio">
    <audio autoplay playsinline [srcObject]="streamConfig.audio"></audio>
  </div>
</form>

<footer mat-dialog-actions align="end">
  <button
    type="button"
    mat-stroked-button
    [disabled]="deviceConfig.invalid"
    [mat-dialog-close]="deviceConfig.valid"
    [color]="deviceConfig.valid ? 'accent' : 'default'"
  >
    Salvar e entrar
  </button>
</footer>
```



###  4.5. <a name='Meet'></a>Meet

Gerando o componente

```sh
nx g m meet --route meet --module app --project webapp
```

##### Component

Arquivo: `apps/webapp/src/app/meet/meet.component.ts`
```ts
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { drawOscilloscope } from '@webrtc/adapters';
import { Peer } from '@webrtc/ports';



@Component({
  selector: 'webrtc-meet',
  templateUrl: './meet.component.html',
  styleUrls: ['./meet.component.scss'],
})
export class MeetComponent implements OnInit, AfterViewInit {
  meet: string;
  
  @ViewChild('audioCanvas')
  audioCanvasRef!: ElementRef<HTMLCanvasElement>;
  audioCanvas!: HTMLCanvasElement;
  
  recorder!: MediaRecorder | null;

  constructor(
    readonly route: ActivatedRoute,
    private _router: Router,
    readonly peer: Peer
  ) {
    const { meet } = this.route.snapshot.params;
    if (meet) this.meet = meet;
    else this.meet = '';
  }

  ngOnInit(): void {
    this.peer.connect(this.meet);
  }

  ngAfterViewInit(): void {
    this.audioCanvas = this.audioCanvasRef.nativeElement;
    this.peer.on('stream', (stream) => this.draw(stream));
  }

  async draw(stream: MediaStream) {
    if (this.audioCanvas) {
      const audioCtx = new AudioContext();
      const source = audioCtx.createMediaStreamSource(stream);

      const analyser = audioCtx.createAnalyser();

      const style = { fill: '#fff', stroke: '#00bb77' };
      drawOscilloscope(this.audioCanvas, analyser, style);

      source.connect(analyser);
      analyser.connect(audioCtx.destination);
    }
  }

  record(stream: MediaStream) {
    if (!this.recorder || this.recorder?.state === 'inactive') {
      this.recorder = new MediaRecorder(stream);
      const blobs: Blob[] = [];
      this.recorder.ondataavailable = ({ data }) => {
        blobs.push(data);
      };
      this.recorder.onstop = () => {
        const blob = new Blob(blobs, { type: 'video/webm' });
        const link = document.createElement('a');
        link.download = new Date().toDateString() + '.webm';
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);
      };

      this.recorder.start();
    } else {
      this.recorder.stop();
      this.recorder = null;
    }
  }

  end() {
    this.peer.close();
    this._router.navigate(['/']);
  }
}
```

Arquivo: `apps/webapp/src/app/meet/meet.component.scss`
```scss
:host {
  flex: 1;
  margin: 20px;
  display: flex;
  align-items: center;
  flex-direction: column;
}

.container {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  object-fit: contain;
}

.mat-card {
  padding: 0;
  overflow: hidden;
  border-radius: 8px;

  background-color: white;
  &.videoff {
    transition: opacity 250ms ease-in-out;
    opacity: 0.2;
    video {
      opacity: 0;
      transition: opacity 250ms ease-in-out;
    }
  }
}

.progress {
  position: fixed;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

video {
  width: 100%;
  max-width: 100%;
}

input[type='file'] {
  // visibility: hidden;
  display: none;
}

@media (orientation: landscape) {
  .mat-card#remote video {
    height: 100%;
    object-fit: contain;
  }
}

@media (orientation: portrait) {
  .mat-card#remote video {
    height: 100%;
    object-fit: cover;
  }
}

.mat-card#remote {
  border-radius: 8px 8px 28px 8px;
  object-fit: contain;
  width: 100%;
  flex: 1;
}

.mat-card#local {
  max-width: 200px;
  position: fixed;
  bottom: 20px;
  left: 20px;

  & > .mat-card-actions {
    margin: 0;
    padding: 0;
    opacity: 0.8;
    display: flex;
    margin-bottom: 0;
    justify-content: space-evenly;
  }
}

.mat-fab {
  position: fixed;
  bottom: 20px;
  right: 20px;
}
```

Arquivo: `apps/webapp/src/app/meet/meet.component.html`
```html
<mat-card id="remote">
  <video autoplay playsinline [srcObject]="peer.remote"></video>
</mat-card>

<mat-card id="local" [ngClass]="{ videoff: peer.uiState.video }">
  <video autoplay playsinline [muted]="!!peer.stream" [srcObject]="peer.stream"></video>

  <canvas #audioCanvas height="15px"> </canvas>

  <mat-card-actions>
    <button
      type="button"
      mat-icon-button
      (click)="peer.toggleVideo(peer.stream)"
    >
      <mat-icon>
        {{ peer.uiState.video ? 'videocam_off' : 'videocam' }}
      </mat-icon>
    </button>
    <button
      type="button"
      mat-icon-button
      (click)="peer.toggleAudio(peer.stream)"
    >
      <mat-icon>{{ peer.uiState.audio ? 'mic_off' : 'mic' }}</mat-icon>
    </button>
    <button type="button" mat-icon-button (click)="inputFile.click()">
      <mat-icon>upload</mat-icon>
    </button>
    <button
      type="button"
      mat-icon-button
      [color]="recorder?.state !== 'recording' ? 'default' : 'warn'"
      (click)="record(peer.stream)"
    >
      <mat-icon>{{
        recorder?.state !== 'recording'
          ? 'radio_button_unchecked'
          : 'radio_button_checked'
      }}</mat-icon>
    </button>
  </mat-card-actions>
</mat-card>

<input
  #inputFile
  type="file"
  name="files"
  [multiple]="false"
  (change)="peer.upload($any($event.target).files[0])"
/>

<button mat-fab color="warn" (click)="end()">
  <mat-icon>call_end</mat-icon>
</button>

<ng-container *ngIf="(peer.progress$ | async) !== 0">
  <div class="progress">
    <mat-progress-spinner
      color="primary"
      mode="determinate"
      [value]="peer.progress$ | async">
    </mat-progress-spinner>
  </div>
</ng-container>
```

##### Guard

```sh
nx g g meet/meet --project webapp
# Enter em branco
```


Arquivo: `apps/webapp/src/app/meet/meet.guard.ts`
```ts
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Signaling, SignalingEvent, SignalMessage, Socket } from '@webrtc/ports';
import { Observable } from 'rxjs';

import { ConfigComponent } from '../config/config.component';

@Injectable({
  providedIn: 'root',
})
export class MeetGuard implements CanActivate {
  constructor(
    readonly router: Router,
    readonly dialog: MatDialog,
    private _signaling: Signaling<Socket>
  ) {}

  canActivate({
    params,
  }: ActivatedRouteSnapshot): boolean | Observable<boolean> {
    /* if the meet is wrong, return */
    if (typeof params.meet !== 'string') {
      return false;
    }

    /* ask if there is anyone in the meeting room */
    const payload: Pick<SignalMessage, 'meet'> = { meet: params.meet };

    const full$ = new Observable<boolean>((subscribe) => {
      /* listening to availability response */
      this._signaling.on(SignalingEvent.Available, (message) => {
        if (message) {
          console.log(message);
          subscribe.next(!!message);
        }
      });
    });

    this._signaling.emit(SignalingEvent.KnockKnock, payload);

    return full$;
  }

  openAlert(route: ActivatedRouteSnapshot) {
    return this.dialog
      .open(ConfigComponent, {
        data: route.paramMap.get('meet'),
        closeOnNavigation: false,
        disableClose: true,
      })
      .afterClosed();
  }
}
```
##### Module


Arquivo: `apps/webapp/src/app/meet/meet.module.ts`
```ts
import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule, Routes } from '@angular/router';

import { MeetComponent } from './meet.component';
import { MeetGuard } from './meet.guard';


const routes: Routes = [
  { path: ':meet', component: MeetComponent, canActivate: [MeetGuard] }
];

@NgModule({
  declarations: [
    MeetComponent,
  ],
  imports: [
    CommonModule,
    LayoutModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    RouterModule.forChild(routes)
  ],
  providers: [MeetGuard]
})
export class MeetModule { }
```

###  4.6. <a name='AppRouting'></a>App Routing

```sh
nx g m app-routing --flat --project webapp
```

Arquivo `apps/webapp/src/app/app-routing.module.ts`
```ts
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';



@NgModule({
  exports: [RouterModule],
  imports: [
    RouterModule.forRoot(
      [
        {
          path: '',
          component: HomeComponent
        },
        {
          path: 'meet',
          loadChildren: () =>
            import('./meet/meet.module').then((m) => m.MeetModule),
        },
      ],
      { useHash: true, initialNavigation: 'enabledBlocking' }
    )
  ]
})
export class AppRoutingModule { }
```

###  4.7. <a name='App'></a>App


####  4.7.1. <a name='Module'></a>Module

```ts
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { BrowserModule } from '@angular/platform-browser';
import { MatInputModule } from '@angular/material/input';
import { HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { ConfigComponent } from './config/config.component';
import { HomeComponent } from './home/home.component';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent, ConfigComponent, HomeComponent],
  imports: [
    BrowserModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDialogModule,
    HttpClientModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([{ path: 'meet', loadChildren: () => import('./meet/meet.module').then(m => m.MeetModule) }], { initialNavigation: 'enabledBlocking' }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

```

####  4.7.2. <a name='Component-1'></a>Component

Arquivo `apps/webapp/src/app/app.scss`
```scss
:host {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  main {
    flex: 1;
    width: 100%;
    display: flex;
  }

  background-color: #00bb77;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cpolygon fill='%23000' fill-opacity='.1' points='120 0 120 60 90 30 60 0 0 0 0 0 60 60 0 120 60 120 90 90 120 60 120 0'/%3E%3C/svg%3E");
}
```

###  4.8. <a name='Styles'></a>Styles

####  4.8.1. <a name='Typography'></a>Typography

Arquivo: `apps/webapp/src/theming/typografy`
```scss
@font-face {
  font-family: "Montserrat";
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/montserrat/v17/JTUSjIg1_i6t8kCHKm45xW0.woff) format("woff");
}
@font-face {
  font-family: "Montserrat";
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/montserrat/v17/JTURjIg1_i6t8kCHKm45_ZpC7g0.woff) format("woff");
}
@font-face {
  font-family: "Montserrat";
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/montserrat/v17/JTUSjIg1_i6t8kCHKm459WRhyyTh89ZNpQ.woff2) format("woff2");
  unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
}
@font-face {
  font-family: "Montserrat";
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/montserrat/v17/JTUSjIg1_i6t8kCHKm459W1hyyTh89ZNpQ.woff2) format("woff2");
  unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}
@font-face {
  font-family: "Montserrat";
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/montserrat/v17/JTUSjIg1_i6t8kCHKm459WZhyyTh89ZNpQ.woff2) format("woff2");
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB;
}
@font-face {
  font-family: "Montserrat";
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/montserrat/v17/JTUSjIg1_i6t8kCHKm459WdhyyTh89ZNpQ.woff2) format("woff2");
  unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
@font-face {
  font-family: "Montserrat";
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/montserrat/v17/JTUSjIg1_i6t8kCHKm459WlhyyTh89Y.woff2) format("woff2");
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC,
    U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
@font-face {
  font-family: "Montserrat";
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/montserrat/v17/JTURjIg1_i6t8kCHKm45_ZpC3gTD_vx3rCubqg.woff2) format("woff2");
  unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
}
@font-face {
  font-family: "Montserrat";
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/montserrat/v17/JTURjIg1_i6t8kCHKm45_ZpC3g3D_vx3rCubqg.woff2) format("woff2");
  unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}
@font-face {
  font-family: "Montserrat";
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/montserrat/v17/JTURjIg1_i6t8kCHKm45_ZpC3gbD_vx3rCubqg.woff2) format("woff2");
  unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB;
}
@font-face {
  font-family: "Montserrat";
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/montserrat/v17/JTURjIg1_i6t8kCHKm45_ZpC3gfD_vx3rCubqg.woff2) format("woff2");
  unicode-range: U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
@font-face {
  font-family: "Montserrat";
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/montserrat/v17/JTURjIg1_i6t8kCHKm45_ZpC3gnD_vx3rCs.woff2) format("woff2");
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC,
    U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
```

##### styles.scss


Arquivo: `apps/webapp/src/styles.scss`
```scss
@use '~@angular/material' as mat;

@import './theming/typografy';

@include mat.core();

$works-primary: mat.define-palette(mat.$purple-palette);
$works-accent: mat.define-palette(mat.$cyan-palette);
$works-warn: mat.define-palette(mat.$red-palette);
$works-theme: mat.define-light-theme(
  (
    color: (
      primary: $works-primary,
      accent: $works-accent,
      warn: $works-warn,
    ),
  )
);
@include mat.core-theme($works-theme);
@include mat.icon-theme($works-theme);
@include mat.card-theme($works-theme);
@include mat.input-theme($works-theme);
@include mat.dialog-theme($works-theme);
@include mat.button-theme($works-theme);
@include mat.select-theme($works-theme);
@include mat.progress-spinner-theme($works-theme);
@include mat.form-field-theme($works-theme);

html,
body {
  height: 100%;
}

body {
  margin: 0;
  font-family: Montserrat,sans-serif;
}

.mat-form-field {
  width: 100%;
}
```

###  4.9. <a name='IndexHTML'></a>Index HTML

Arquivo: `apps/webapp/src/index.html`
```html
<!DOCTYPE html>
<html lang="pt-br">
  <head>
    <meta charset="utf-8" />
    <title>Webapp</title>
    <base href="/" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/x-icon" href="favicon.ico" />
    <link rel="preconnect" href="https://fonts.gstatic.com" />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/icon?family=Material+Icons"
    />
  </head>
  <body>
    <webrtc-root></webrtc-root>
  </body>
</html>
```
