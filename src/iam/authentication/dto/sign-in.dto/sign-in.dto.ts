import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength } from 'class-validator';

export class SignInDto {
  @ApiProperty({ description: 'email', default: '123456@163.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'password', default: '123456@163.com' })
  @MinLength(10)
  password: string;
}
