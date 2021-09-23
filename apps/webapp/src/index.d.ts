interface MediaRecorderEventMap {
  "dataavailable": BlobEvent;
  "error": Event;
  "pause": Event;
  "resume": Event;
  "start": Event;
  "stop": Event;
}

interface MediaRecorder extends EventTarget {
  readonly audioBitsPerSecond: number;
  readonly mimeType: string;
  ondataavailable: ((this: MediaRecorder, ev: BlobEvent) => any) | null;
  onerror: ((this: MediaRecorder, ev: Event) => any) | null;
  onpause: ((this: MediaRecorder, ev: Event) => any) | null;
  onresume: ((this: MediaRecorder, ev: Event) => any) | null;
  onstart: ((this: MediaRecorder, ev: Event) => any) | null;
  onstop: ((this: MediaRecorder, ev: Event) => any) | null;
  readonly state: RecordingState;
  readonly stream: MediaStream;
  readonly videoBitsPerSecond: number;
  pause(): void;
  requestData(): void;
  resume(): void;
  start(timeslice?: number): void;
  stop(): void;
  addEventListener<K extends keyof MediaRecorderEventMap>(type: K, listener: (this: MediaRecorder, ev: MediaRecorderEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
  removeEventListener<K extends keyof MediaRecorderEventMap>(type: K, listener: (this: MediaRecorder, ev: MediaRecorderEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}

declare const MediaRecorder: {
  prototype: MediaRecorder;
  new(stream: MediaStream, options?: MediaRecorderOptions): MediaRecorder;
  isTypeSupported(type: string): boolean;
};

interface MediaRecorderErrorEvent extends Event {
  readonly error: DOMException;
}

declare const MediaRecorderErrorEvent: {
  prototype: MediaRecorderErrorEvent;
  new(type: string, eventInitDict: MediaRecorderErrorEventInit): MediaRecorderErrorEvent;
};
