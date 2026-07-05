import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('Gateway (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/api/v1/health (GET) returns gateway status', () => {
    return request(app.getHttpServer())
      .get('/api/v1/health')
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toBe('ok');
        expect(res.body.step).toBe(5);
      });
  });

  it('/api/v1/test/ping (GET) public route works without token', () => {
    return request(app.getHttpServer())
      .get('/api/v1/test/ping')
      .expect(200)
      .expect((res) => {
        expect(res.body.message).toBe('pong');
      });
  });

  it('/api/v1/test/secret (GET) without token returns 401', () => {
    return request(app.getHttpServer()).get('/api/v1/test/secret').expect(401);
  });

  it('/api/v1/health/services (GET) returns auth discovery result', () => {
    return request(app.getHttpServer())
      .get('/api/v1/health/services')
      .expect(200)
      .expect((res) => {
        expect(res.body.services.auth.name).toBe('auth');
      });
  });
});
