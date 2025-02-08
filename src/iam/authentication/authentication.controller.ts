import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignUpDto } from './dto/sign-up.dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto/sign-in.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enums/auth-type.enum';
import { RefreshTokenDto } from './../dto/refresh-token.dto';

@ApiTags('验证模块')
@Auth(AuthType.None)
@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @ApiOperation({
    summary: '注册',
  })
  @Post('sign-up')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @ApiOperation({
    summary: '登录',
  })
  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @ApiOperation({
    summary: '刷新token',
  })
  @HttpCode(HttpStatus.OK)
  @Post('refresh-tokens')
  refreshTokens(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto);
  }
}
