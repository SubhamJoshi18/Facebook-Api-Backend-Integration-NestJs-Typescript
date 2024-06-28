import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { GlobalExceptionFilter } from './httpException/globalHttpException';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  await app.listen(3000);
  const logger = app.get(Logger);
  app.useGlobalFilters(new GlobalExceptionFilter(logger));
}
bootstrap();
