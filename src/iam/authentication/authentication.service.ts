import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { BcryptService } from '../hashing/bcrypt.service';
import { SignUpDto } from './dto/sign-up.dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto/sign-in.dto';
import { AbstractService } from 'src/common/abstract.service';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { RefreshTokenDto } from '../dto/refresh-token.dto';
import { ref } from '@hapi/joi';

@Injectable()
export class AuthenticationService extends AbstractService {
  constructor(
    private readonly bcryptService: BcryptService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {
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
    const { accessToken, refreshToken } = await this.generateTokens(user);
    return {
      accessToken,
      refreshToken,
    };
  }

  private async generateTokens(user: User) {
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken<Partial<ActiveUserData>>(
        user.id,
        this.jwtConfiguration.accessTokenTtl,
        {
          email: user.email,
        },
      ),
      this.signToken<Partial<ActiveUserData>>(
        user.id,
        this.jwtConfiguration.refreshTokenTtl,
      ),
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(refreshTokenDto: RefreshTokenDto) {
    try {
      const { sub } = await this.jwtService.verifyAsync<
        Pick<ActiveUserData, 'sub'>
      >(refreshTokenDto.refreshToken, {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
      });
      const user = await this.entityManager.findOneByOrFail(User, {
        id: sub,
      });
      return await this.generateTokens(user);
    } catch {
      throw new UnauthorizedException();
    }
  }

  private async signToken<T>(userId: number, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      } as ActiveUserData,
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );
  }
}
