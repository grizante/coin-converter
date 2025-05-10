import { ValidationPipe } from '@nestjs/common';
import { RequestHandler } from '@nestjs/common/interfaces';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Response } from 'express';
import redoc from 'redoc-express';

import { MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { grpcServerOptions } from './core/grpc/grpc.server';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const docbuilder = new DocumentBuilder();
  const document = SwaggerModule.createDocument(
    app,
    docbuilder.setTitle('Coin Converter API').setVersion('v0.0.1').build(),
  );

  const adapter = app.getHttpAdapter();

  adapter.get('/docs/openapi.json', (_req: Request, res: Response) => {
    res.json(document);
  });

  adapter.get(
    '/docs',
    redoc({
      title: 'Coin Converter API',
      specUrl: '/docs/openapi.json',
      redocOptions: {},
    }) as RequestHandler,
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const grpcMicroservice =
    app.connectMicroservice<MicroserviceOptions>(grpcServerOptions);
  await grpcMicroservice.listen();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
