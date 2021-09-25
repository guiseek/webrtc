export const environment: {
  production: boolean;
  signaling: string;
  iceServers: RTCIceServer[];
} = {
  production: false,
  signaling: 'https://gateway.p2p.works',
  
  iceServers: [
    {
      urls: ['stun:54.90.98.123:3478'],
      username: 'works',
      credential: 'contact',
      credentialType: 'password',
    },
  ],
};