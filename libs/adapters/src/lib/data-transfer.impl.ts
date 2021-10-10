import {
  Callback,
  DataTransfer,
  EventCallback,
  EventEmitter,
} from '@webp2p/ports';

export interface DataTransferMap {
  message: string;
  binary: ArrayBuffer;
}

export class TransferEmitter implements EventEmitter<DataTransferMap> {
  events: EventCallback<DataTransferMap>;

  constructor() {
    this.events = new Map();
  }

  public on<K extends keyof DataTransferMap>(
    key: K,
    fn: Callback<DataTransferMap[K]>
  ): void {
    const events = this.events.get(key) ?? [];
    events.push(fn as () => void);
    this.events.set(key, events);
  }

  get<K extends keyof DataTransferMap>(key: K): Callback<DataTransferMap[K]>[] {
    return this.events.get(key) ?? [];
  }
}

export class DataTransferImpl implements DataTransfer<DataTransferMap> {
  event: EventEmitter<DataTransferMap>;

  constructor(private channel: RTCDataChannel) {
    this.event = new TransferEmitter();

    channel.onmessage = ({ data }: MessageEvent<ArrayBuffer>) => {
      if (typeof data === 'string') {
        this.event.get('message').map((cb) => cb(data));
      }

      if (data instanceof ArrayBuffer) {
        this.event.get('binary').map((cb) => cb(data));
      }
    };
  }
}
 