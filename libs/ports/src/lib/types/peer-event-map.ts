import { DataProgress } from '../interfaces';

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
   * Um novo RTCIceCandidateé disponibilizado para o script.
   */
  iceCandidateChange: RTCIceCandidate;

  /**
   * O RTCPeerConnection's estado encontro ICE mudou.
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
   * Dados recebidos via DataChannel
   */
  data: ArrayBuffer;

  /**
   * Mensagem recebida via DataChannel
   */
  message: string;

  /**
   * Valores relativos a um envio de arquivos
   * usando DataChannel, úteis para progresso
   */
  progress: DataProgress;
};
