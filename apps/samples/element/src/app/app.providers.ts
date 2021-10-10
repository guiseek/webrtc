import { PeerImpl, SignalingImpl } from '@webp2p/adapters';
import { environment } from '../environments/environment';
import { Peer, Signaling, Socket } from '@webp2p/ports';
import { Injector } from '@nx-clean/core';

export const injector = Injector.create([
  {
    provide: Signaling,
    useFactory: () => {
      return new SignalingImpl(environment.signaling);
    },
  },
  {
    provide: Peer,
    useFactory: (signaling: Signaling<Socket>) => {
      return new PeerImpl({ iceServers: environment.iceServers }, signaling);
    },
    deps: [Signaling],
  }
]);
