export interface SignalMessage {
  sdp: RTCSessionDescription;
  ice: RTCIceCandidate;
  uuid: string;
}
