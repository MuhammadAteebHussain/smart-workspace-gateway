import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const port = configService.get<number>('port')!;
  const apiPrefix = configService.get<string>('apiPrefix')!;

  app.enableCors();
  app.setGlobalPrefix(apiPrefix);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: configService.get<string>('apiVersion')!,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Smart Workspace API Gateway')
    .setDescription(
      'Phase 2 Step 5: auth proxy + JWT guard. Public: health, login, register. Protected: other routes.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Health', 'Gateway health + service discovery')
    .addTag('Auth', 'Login & register (proxied to Auth Service)')
    .addTag('Test', 'Public and protected test routes')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(`${apiPrefix}/docs`, app, document);

  await app.listen(port);
  console.log(`Gateway running on http://localhost:${port}/${apiPrefix}/v1`);
  console.log(`Swagger:   http://localhost:${port}/${apiPrefix}/docs`);
  console.log(`Login:     POST http://localhost:${port}/${apiPrefix}/v1/auth/login`);
  console.log(`Protected: GET  http://localhost:${port}/${apiPrefix}/v1/test/secret`);
}

bootstrap();
