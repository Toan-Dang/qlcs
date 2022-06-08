import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  if (process.env.NODE_ENV !== 'production') require('dotenv').config();
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  let port = process.env.PORT || 2371;
  await app.listen(port);
}
bootstrap();
