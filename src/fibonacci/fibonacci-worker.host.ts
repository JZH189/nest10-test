import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { Worker } from 'worker_threads';
import { randomUUID } from 'crypto';
import { join } from 'path';
import { firstValueFrom, fromEvent, Observable, filter, map } from 'rxjs';

@Injectable()
export class FibonacciWorkerHost
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private worker: Worker;
  private message$: Observable<{ id: string; result: number }>;
  onApplicationBootstrap() {
    this.worker = new Worker(join(__dirname, 'fibonacci.worker.js'));
    this.message$ = fromEvent(this.worker, 'message') as unknown as Observable<{
      id: string;
      result: number;
    }>;
  }

  async onApplicationShutdown() {
    this.worker.terminate();
  }

  run(n: number) {
    const uniqueId = randomUUID();
    this.worker.postMessage({ n, id: uniqueId });
    return firstValueFrom(
      this.message$.pipe(
        filter(({ id }) => id === uniqueId),
        map(({ result }) => result),
      ),
    );
  }
}
