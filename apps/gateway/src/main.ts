import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

(async () => {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3333;
  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port);
  });
})()
