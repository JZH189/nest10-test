import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { BcryptService } from '../hashing/bcrypt.service';
import { SignUpDto } from './dto/sign-up.dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto/sign-in.dto';
import { AbstractService } from 'src/common/abstract.service';

@Injectable()
export class AuthenticationService extends AbstractService {
  constructor(private readonly bcryptService: BcryptService) {
    super();
  }

  async signUp({ email, password }: SignUpDto) {
    try {
      // const user = new User();
      // user.email = email;
      // user.password = await this.hashingService.hash(password);
      // await this.usersRepository.save(user);
      await this.entityManager.insert(User, {
        password: this.bcryptService.hash(password),
        email,
      });
    } catch (error) {
      const pgUniqueViolationErrorCode = '23505';
      if (error.code === pgUniqueViolationErrorCode) {
        throw new ConflictException();
      }
      throw error;
    }
  }

  async signIn({ email, password }: SignInDto) {
    const user = await this.entityManager.findOne(User, {
      where: {
        email,
      },
    });
    if (!user) {
      throw new UnauthorizedException('User does not exists');
    }
    const isEqual = await this.bcryptService.compare(password, user.password);
    if (!isEqual) {
      throw new UnauthorizedException('Password does not match');
    }
    return true;
  }
}
