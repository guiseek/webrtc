import { PeerImpl, SignalingImpl } from '@webp2p/adapters';
import { Peer, Signaling, Socket } from '@webp2p/ports';
import { Injector } from '@nx-clean/core';

export const loadModule = ({ signaling, iceServers }) => {
  return Injector.create([
    {
      provide: Signaling,
      useFactory: () => {
        return new SignalingImpl(signaling);
      },
    },
    {
      provide: Peer,
      useFactory: (signaling: Signaling<Socket>) => {
        return new PeerImpl({ iceServers: iceServers }, signaling);
      },
      deps: [Signaling],
    },
  ]);
};
