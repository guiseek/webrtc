import { PeerEventCallback, PeerEventMap, PeerEvent, Callback } from './types';
import { SignalMessage } from './interfaces';

export abstract class Peer {
  abstract uuid?: string;

  abstract conn: RTCPeerConnection;

  abstract stream: MediaStream;
  abstract remote?: MediaStream;

  abstract readonly events: PeerEventCallback<PeerEvent>;

  public abstract on<K extends keyof PeerEventMap>(
    key: K,
    fn: Callback<PeerEventMap[K]>
  ): void;

  public abstract connect(uuid?: string): void;

  public abstract send(message: string): void;

  public abstract upload(message: ArrayBuffer): void;

  abstract listen(): void;

  abstract gotStream(): (stream: MediaStream) => void;

  abstract setDescription(): (value: RTCSessionDescriptionInit) => void;

  abstract getSignalMessage(): (message: SignalMessage) => void;

  abstract getIceCandidate(): (event: RTCPeerConnectionIceEvent) => void;

  abstract errorHandler(error: Event): void;
}
