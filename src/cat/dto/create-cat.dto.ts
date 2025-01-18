import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCatDto {
  @ApiProperty({ description: 'name', example: 'name' })
  @IsString()
  readonly name: string;

  @ApiProperty({ description: 'age', example: 13 })
  @IsNumber()
  readonly age: number;

  @ApiProperty({ description: 'breed', example: 'breed' })
  @IsString()
  readonly breed: string;

  @ApiProperty({ description: 'features', example: ['f1'] })
  @IsString({ each: true })
  readonly features: string[];
}
