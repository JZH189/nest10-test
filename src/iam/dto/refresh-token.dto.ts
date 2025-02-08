import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({ description: 'refreshToken', example: '' })
  @IsNotEmpty()
  refreshToken: string;
}
