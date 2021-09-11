import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

import { SimpleAuthGuard } from './users/simple-auth.guard';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  // https://docs.nestjs.com/openapi/introduction
  // https://docs.nestjs.com/openapi/operations
  const config = new DocumentBuilder()
    .setTitle('Truc')
    .setDescription('The truc APIs description')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'access-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('apis', app, document);

  await app.listen(3000);
}
bootstrap();

export { SimpleAuthGuard };
