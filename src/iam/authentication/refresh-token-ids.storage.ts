import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RefreshTokenIdsStorage
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private redisClent: Redis;

  constructor(private readonly configService: ConfigService) {}

  //生命周期钩子函数
  onApplicationShutdown() {
    //确保应用程序停止的时候关闭连接
    return this.redisClent.quit();
  }

  //生命周期钩子函数
  onApplicationBootstrap() {
    const host = this.configService.get<string>('redis.host');
    const port = this.configService.get<number>('redis.port');
    this.redisClent = new Redis({
      host,
      port,
    });
  }

  async insert(userId: number, tokenId: string): Promise<void> {
    await this.redisClent.set(this.getKey(userId), tokenId);
  }

  async validate(userId: number, tokenId: string): Promise<boolean> {
    const storedId = await this.redisClent.get(this.getKey(userId));
    return storedId === tokenId;
  }

  async invalidate(userId: number): Promise<void> {
    await this.redisClent.del(this.getKey(userId));
  }

  private getKey(userId: number): string {
    return `user-${userId}`;
  }
}
