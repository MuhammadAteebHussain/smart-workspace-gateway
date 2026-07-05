import { Global, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthServiceClient } from './auth-service.client';

@Global()
@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
    }),
  ],
  providers: [AuthServiceClient],
  exports: [HttpModule, AuthServiceClient],
})
export class ClientsModule {}
