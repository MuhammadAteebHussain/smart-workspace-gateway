import { NestFactory } from '@nestjs/core';
import { VersioningType } from '@nestjs/common';
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

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Smart Workspace API Gateway')
    .setDescription('Phase 1: test routing only. Auth and microservice proxy come later.')
    .setVersion('1.0')
    .addTag('Health', 'Is the gateway running?')
    .addTag('Test', 'Simple routes to learn how routing works')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(`${apiPrefix}/docs`, app, document);

  await app.listen(port);
  console.log(`Gateway running on http://localhost:${port}/${apiPrefix}/v1`);
  console.log(`Try:       http://localhost:${port}/${apiPrefix}/v1/test/ping`);
  console.log(`Swagger:   http://localhost:${port}/${apiPrefix}/docs`);
}

bootstrap();
