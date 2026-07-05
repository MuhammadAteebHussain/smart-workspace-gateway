import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { ServiceHealthResult } from '../common/interfaces/service-health.interface';
import { TokenValidationResponse } from '../common/interfaces/jwt-payload.interface';

@Injectable()
export class AuthServiceClient {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  getBaseUrl(): string {
    return this.configService.get<string>('services.auth')!;
  }

  async validateToken(token: string): Promise<TokenValidationResponse> {
    const response = await firstValueFrom(
      this.httpService.post<TokenValidationResponse>(
        `${this.getBaseUrl()}/api/v1/auth/validate`,
        { token },
        { validateStatus: () => true },
      ),
    );

    if (response.status >= 400) {
      return {
        valid: false,
        message:
          (response.data as TokenValidationResponse)?.message ??
          'Token validation failed',
      };
    }

    return response.data;
  }

  async checkHealth(): Promise<ServiceHealthResult> {
    const url = this.getBaseUrl();
    const start = Date.now();

    try {
      const response = await firstValueFrom(
        this.httpService.get<Record<string, unknown>>(`${url}/api/v1/health`, {
          timeout: 3000,
          validateStatus: () => true,
        }),
      );

      const latencyMs = Date.now() - start;
      const isUp =
        response.status === 200 &&
        (response.data as { status?: string })?.status === 'ok';

      return {
        name: 'auth',
        url,
        status: isUp ? 'up' : 'down',
        latencyMs,
        details: isUp ? response.data : undefined,
        error: isUp ? undefined : `HTTP ${response.status}`,
      };
    } catch (error) {
      return {
        name: 'auth',
        url,
        status: 'down',
        latencyMs: Date.now() - start,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
