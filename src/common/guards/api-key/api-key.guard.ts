import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorators';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    console.log('this.reflector: ', this.reflector);
    const isPublic = this.reflector.get(IS_PUBLIC_KEY, context.getHandler());
    console.log('isPublic: ', isPublic);
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.header('Authorization');
    const apikey = this.configService.get<string>('API_KEY');
    console.log('apikey: ', apikey);
    console.log('authHeader: ', authHeader);
    //做一些逻辑处理用来决定是否放行请求
    return true;
  }
}
