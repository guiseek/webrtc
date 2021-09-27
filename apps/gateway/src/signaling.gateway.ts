import {
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { SignalingEvent, SignalMessage } from '@webp2p/ports';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class SignalingGateway implements OnGatewayConnection {
  @WebSocketServer()
  private server: Server;

  handleConnection(@ConnectedSocket() client: Socket) {
    client.emit(SignalingEvent.Connection, { id: client.id });
  }

  @SubscribeMessage(SignalingEvent.KnockKnock)
  knockKnock(
    @ConnectedSocket() contact: Socket,
    @MessageBody() payload: SignalMessage
  ) {
    const room = this.takeOrStartRoom(payload);
    if (room.length >= 0 && room.length < 2) {
      contact.emit(SignalingEvent.Available, true);
    } else {
      contact.emit(SignalingEvent.Available, false);
    }
  }

  @SubscribeMessage(SignalingEvent.Message)
  onMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() payload: SignalMessage
  ) {
    if (socket.rooms.has(payload.meet)) {
      socket.to(payload.meet).emit('message', payload);
    } else {
      socket.join(payload.meet);
      socket.broadcast.emit('message', payload);
    }
  }

  private takeOrStartRoom({ meet }: SignalMessage) {
    const adapter = this.server.sockets.adapter;
    return adapter.rooms[meet] ?? { length: 0 };
  }
}
