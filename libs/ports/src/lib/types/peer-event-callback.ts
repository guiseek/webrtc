import { PeerEventMap } from './peer-event-map';
import { PeerEvent } from './peer-event';
import { Callback } from './callback';

export type PeerEventCallback<K extends PeerEvent> = Map<
  K,
  Callback<PeerEventMap[K]>
>;