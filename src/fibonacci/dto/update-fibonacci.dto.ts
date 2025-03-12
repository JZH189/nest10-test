import { PartialType } from '@nestjs/swagger';
import { CreateFibonacciDto } from './create-fibonacci.dto';

export class UpdateFibonacciDto extends PartialType(CreateFibonacciDto) {}
