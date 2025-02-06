import { Injectable } from '@nestjs/common';
import { hashSync, compareSync } from 'bcryptjs';
// import { HashingService } from './hashing.service';

@Injectable()
export class BcryptService {
  hash(data: string): string {
    return hashSync(data, 8);
  }

  compare(data: string, encrypted: string): boolean {
    return compareSync(data, encrypted);
  }
}
