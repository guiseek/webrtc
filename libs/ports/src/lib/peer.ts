import { EventEmitter, PeerUiState, SignalMessage } from './interfaces';
import { DataTransfer, DataTransferMap } from './data-transfer';
import { PeerEventMap } from './types';

export abstract class Peer {
  abstract user: string;
  abstract meet?: string;

  abstract uiState: PeerUiState;

  abstract stream: MediaStream;
  abstract remote?: MediaStream;

  abstract conn: RTCPeerConnection;

  abstract receiveBuffer: ArrayBuffer[];
  abstract receivedSize: number;

  abstract readonly event: EventEmitter<PeerEventMap>;

  public abstract connect(uuid?: string): void;

  public abstract send(message: string): void;

  public abstract upload(message: File): void;

  abstract openChannel(fn: (channel: DataTransfer<DataTransferMap>) => void): void

  abstract gotStream(): (stream: MediaStream) => void;

  abstract setDescription(): (value: RTCSessionDescriptionInit) => void;

  abstract getSignalMessage(): (message: SignalMessage) => void;

  abstract getIceCandidate(): (event: RTCPeerConnectionIceEvent) => void;

  abstract onReceiveMessageCallback(data: ArrayBuffer): void;

  abstract toggleVideo(stream: MediaStream): void;
  
  abstract toggleAudio(stream: MediaStream): void;

  abstract toggle(stream: MediaStream, uiState: keyof PeerUiState): void;

  abstract errorHandler(error: Event): void;

  abstract close(): void;
}
