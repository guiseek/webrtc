import { EventEmitter } from './interfaces/event-emitter';

export interface DataTransferMap {
  message: string;
  binary: ArrayBuffer;
}

export abstract class DataTransfer<T extends DataTransferMap> {
  abstract event: EventEmitter<T>;
}
