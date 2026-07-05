import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Method } from 'axios';
import { firstValueFrom } from 'rxjs';
import type { AuthenticatedRequest } from '../interfaces/authenticated-request.interface';

@Injectable()
export class ProxyService {
  constructor(private readonly httpService: HttpService) {}

  async forward(options: {
    baseUrl: string;
    path: string;
    method: Method;
    request: AuthenticatedRequest;
    body?: unknown;
  }): Promise<{ data: unknown; status: number }> {
    const { baseUrl, path, method, request, body } = options;

    const response = await firstValueFrom(
      this.httpService.request({
        method,
        url: `${baseUrl}${path}`,
        data: body,
        headers: this.buildHeaders(request),
        validateStatus: () => true,
      }),
    );

    return { data: response.data, status: response.status };
  }

  private buildHeaders(request: AuthenticatedRequest): Record<string, string> {
    const headers: Record<string, string> = {};
    const forward = ['authorization', 'content-type', 'accept'];

    for (const key of forward) {
      const value = request.headers[key];
      if (value) {
        headers[key] = Array.isArray(value) ? value[0] : value;
      }
    }

    if (request.user?.sub) {
      headers['x-user-id'] = request.user.sub;
    }

    return headers;
  }
}
