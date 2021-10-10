1. [Ports](./PORTS.md)

1. [Adapters](./ADAPTERS.md)

1. [Gateway](./GATEWAY.md)

1. [Web App](./WEBAPP.md)
   1. [Web App](./WEBAPP.md)
   1. [Web App 2](./WEBAPP-2.md)
   1. [Web App 3](./WEBAPP-3.md)

---

# Gateway

## Criando a aplicação

```sh
nx generate @nrwl/nest:application --name=gateway
```

### Movendo pra raiz

```sh
mv apps/gateway/src/app/app.module.ts apps/gateway/src/
mv apps/gateway/src/app/app.controller.ts apps/gateway/src/
```

### Removendo o desnecessário

```sh
rm -rf apps/gateway/src/app
```

### Criando o gateway de sinalização

```sh
nx generate @nrwl/nest:gateway --name=signaling --project=gateway
```

## Implementando

### Module

Arquivo `apps/gateway/src/app.module.ts`

```ts
import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { SignalingGateway } from './signaling.gateway';

@Module({
  providers: [SignalingGateway],
  controllers: [AppController],
})
export class AppModule {}
```

### Controller

Arquivo `apps/gateway/src/app.controller.ts`

```ts
import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getData() {
    return { message: 'Gateway' };
  }
}
```

### Gateway

Arquivo `apps/gateway/src/signaling.gateway.ts`

```ts
import {
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { SignalingEvent, SignalMessage } from '@webrtc/ports';
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
```

### Main

Arquivo `apps/gateway/src/main.ts`

```ts
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3333;
  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port + '/' + globalPrefix);
  });
}

bootstrap();
```


<center>

[Adapters &nbsp; 🔙 ](./ADAPTERS.md) - [ 🔜 &nbsp; Web App](./WEBAPP.md)

</center>

---

[Guilherme Visi Siquinelli](https://guiseek.dev) &copy; 2021