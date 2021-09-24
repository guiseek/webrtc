export interface SignalMessage {
  sdp: RTCSessionDescription;
  ice: RTCIceCandidate;
  meet: string;
  user: string;
}
