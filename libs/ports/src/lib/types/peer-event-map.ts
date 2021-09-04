export type PeerEventMap = {
  /**
   * A nova mídia de entrada foi negociada para um
   * determinado RTCRtpReceivere esse receptor track foi
   * adicionado a quaisquer MediaStreams remotos associados.
   */
  track: MediaStreamTrack;

  /**
   * O estado de sinalização mudou. Essa mudança
   * de estado é o resultado de um setLocalDescriptionou
   * de setRemoteDescriptionser invocado.
   */
  signalingChange: RTCSignalingState;

  /**
   * A RTCPeerConnectionState mudou.
   */
  connectionChange: RTCPeerConnectionState;

  /**
   * Um novo RTCIceCandidateé disponibilizado para o script.
   */
  iceCandidateChange: RTCIceCandidate;

  /**
   * O RTCPeerConnection's estado encontro ICE mudou.
   */
  iceGatheringChange: RTCIceGatheringState;

  /**
   * O RTCIceConnectionState da conexão ICE mudou.
   */
  iceConnectionChange: RTCIceConnectionState;
};
