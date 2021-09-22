export type PeerEventMap = {
  /**
   * A nova mídia de entrada foi negociada para um
   * determinado RTCRtpReceivere esse receptor track foi
   * adicionado a quaisquer MediaStreams remotos associados.
   */
  track: MediaStreamTrack;

  /**
   * Stream local disponível
   */
  stream: MediaStream;

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
   * Um novo RTCIceCandidate está disponível.
   */
  iceCandidateChange: RTCIceCandidate;

  /**
   * O estado ICE mudou.
   */
  iceGatheringChange: RTCIceGatheringState;

  /**
   * O RTCPeerConnectionIceEvent da conexão ICE mudou.
   */
  iceConnectionChange: RTCPeerConnectionIceEvent;


  /**
   * Um novo RTCDataChannel é despachado para o script
   * em resposta ao outro par criando um canal.
   */
  dataChannel: RTCDataChannel;

  /**
   * Um novo RTCDataChannel é despachado para o script
   * em resposta ao outro par criando um canal.
   */
  data: ArrayBuffer | string;
};