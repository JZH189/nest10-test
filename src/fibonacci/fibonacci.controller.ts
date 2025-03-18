import { Controller, Get, Query } from '@nestjs/common';
import { FibonacciWorkerHost } from './fibonacci-worker.host';
import { Public } from 'src/common/decorators/public.decorators';

@Public() //自定义装饰器
@Controller('fibonacci')
export class FibonacciController {
  constructor(private readonly fibonacciWorkerHost: FibonacciWorkerHost) {}

  @Get()
  fibonacci(@Query('n') n = 10) {
    return this.fibonacciWorkerHost.run(n);
  }
}
