import { SignalingGateway } from './signaling.gateway';
import { Module } from '@nestjs/common';

@Module({
  providers: [SignalingGateway],
})
export class AppModule {}
