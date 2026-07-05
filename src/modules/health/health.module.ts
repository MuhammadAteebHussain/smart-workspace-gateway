import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { DiscoveryService } from './discovery.service';

@Module({
  controllers: [HealthController],
  providers: [DiscoveryService],
})
export class HealthModule {}
