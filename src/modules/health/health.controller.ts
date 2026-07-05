import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller({ path: 'health', version: '1' })
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Gateway health check' })
  check() {
    return {
      status: 'ok',
      service: 'smart-workspace-gateway',
      phase: 1,
      timestamp: new Date().toISOString(),
    };
  }
}
