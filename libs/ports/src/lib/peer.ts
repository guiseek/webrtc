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
