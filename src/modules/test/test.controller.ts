import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Test')
@Controller({ path: 'test', version: '1' })
export class TestController {
  @Get('ping')
  @ApiOperation({ summary: 'Simple ping — proves routing works' })
  ping() {
    return {
      message: 'pong',
      phase: 1,
      description: 'Gateway received your request and responded directly',
    };
  }

  @Get('hello/:name')
  @ApiOperation({ summary: 'Route with a URL parameter' })
  hello(@Param('name') name: string) {
    return {
      message: `Hello, ${name}!`,
      route: '/api/v1/test/hello/:name',
      param: name,
    };
  }
}
