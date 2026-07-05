import { Injectable } from '@nestjs/common';
import { AuthServiceClient } from '../../clients/auth-service.client';
import { DiscoveryResult } from '../../common/interfaces/service-health.interface';

@Injectable()
export class DiscoveryService {
  constructor(private readonly authServiceClient: AuthServiceClient) {}

  async discover(): Promise<DiscoveryResult> {
    const auth = await this.authServiceClient.checkHealth();

    return {
      gateway: {
        status: 'ok',
        service: 'smart-workspace-gateway',
        phase: 2,
      },
      services: {
        auth,
      },
      timestamp: new Date().toISOString(),
    };
  }
}
