import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Test')
@Controller({ path: 'test', version: '1' })
export class TestController {
  @Public()
  @Get('ping')
  @ApiOperation({ summary: 'Simple ping — public route' })
  ping() {
    return {
      message: 'pong',
      phase: 2,
      description: 'Public route — no token required',
    };
  }

  @Public()
  @Get('hello/:name')
  @ApiOperation({ summary: 'Route with a URL parameter — public' })
  hello(@Param('name') name: string) {
    return {
      message: `Hello, ${name}!`,
      route: '/api/v1/test/hello/:name',
      param: name,
    };
  }

  @Get('secret')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Protected route — requires JWT' })
  secret() {
    return {
      message: 'You are authenticated!',
      phase: 2,
      step: 5,
    };
  }
}
