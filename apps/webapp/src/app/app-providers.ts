import { PeerImpl, SignalingImpl } from '@webrtc/adapters';
import { Peer, Signaling, Socket } from '@webrtc/ports';

export class AppProviders {
  static forPorts({
    signaling,
    iceServers,
  }: {
    signaling: string;
    iceServers: RTCIceServer[];
  }) {
    return [
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
    ];
  }
}