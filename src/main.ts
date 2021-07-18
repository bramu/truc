import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


import { SimpleAuthGuard } from './users/simple-auth.guard';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();

export { SimpleAuthGuard };
