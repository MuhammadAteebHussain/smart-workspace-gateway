import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ProxyService } from '../../common/services/proxy.service';

@Module({
  controllers: [AuthController],
  providers: [ProxyService],
})
export class AuthModule {}
