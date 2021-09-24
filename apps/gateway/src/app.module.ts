import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { SignalingGateway } from './signaling.gateway';

@Module({
  providers: [SignalingGateway],
  controllers: [AppController],
})
export class AppModule {}
