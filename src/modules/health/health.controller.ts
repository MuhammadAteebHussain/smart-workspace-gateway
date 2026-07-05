import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { DiscoveryService } from './discovery.service';

@ApiTags('Health')
@Controller({ path: 'health', version: '1' })
export class HealthController {
  constructor(private readonly discoveryService: DiscoveryService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Gateway health check' })
  check() {
    return {
      status: 'ok',
      service: 'smart-workspace-gateway',
      phase: 2,
      step: 5,
      timestamp: new Date().toISOString(),
    };
  }

  @Public()
  @Get('services')
  @ApiOperation({
    summary: 'Discover downstream services (static config + health ping)',
  })
  discoverServices() {
    return this.discoveryService.discover();
  }
}
