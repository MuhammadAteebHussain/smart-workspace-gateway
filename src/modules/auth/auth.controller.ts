import { Body, Controller, HttpCode, Post, Req, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { Public } from '../../common/decorators/public.decorator';
import { ProxyService } from '../../common/services/proxy.service';
import { AuthServiceClient } from '../../clients/auth-service.client';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import type { AuthenticatedRequest } from '../../common/interfaces/authenticated-request.interface';

@ApiTags('Auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(
    private readonly proxyService: ProxyService,
    private readonly authServiceClient: AuthServiceClient,
  ) {}

  @Public()
  @Post('register')
  @HttpCode(201)
  @ApiOperation({ summary: 'Register (proxied to Auth Service)' })
  @ApiResponse({ status: 201, description: 'User created' })
  @ApiResponse({ status: 409, description: 'Email already registered' })
  async register(
    @Req() req: AuthenticatedRequest,
    @Res({ passthrough: true }) res: Response,
    @Body() body: RegisterDto,
  ) {
    return this.forward(req, res, body, '/api/v1/auth/register', 201);
  }

  @Public()
  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Login (proxied to Auth Service)' })
  @ApiResponse({ status: 200, description: 'Returns accessToken + user' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @Req() req: AuthenticatedRequest,
    @Res({ passthrough: true }) res: Response,
    @Body() body: LoginDto,
  ) {
    return this.forward(req, res, body, '/api/v1/auth/login', 200);
  }

  private async forward(
    req: AuthenticatedRequest,
    res: Response,
    body: unknown,
    path: string,
    defaultStatus: number,
  ) {
    const result = await this.proxyService.forward({
      baseUrl: this.authServiceClient.getBaseUrl(),
      path,
      method: 'POST',
      request: req,
      body,
    });

    res.status(result.status || defaultStatus);
    return result.data;
  }
}
