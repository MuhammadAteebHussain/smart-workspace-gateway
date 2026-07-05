import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import configuration from './configuration';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: Joi.object({
        PORT: Joi.number().default(3000),
        API_PREFIX: Joi.string().default('api'),
        API_VERSION: Joi.string().default('1'),
        AUTH_SERVICE_URL: Joi.string()
          .uri()
          .default('http://localhost:3001'),
      }),
    }),
  ],
})
export class AppConfigModule {}
