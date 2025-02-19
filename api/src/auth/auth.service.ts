import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './auth.dto';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger();

  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(values: AuthDto) {
    try {
      const user = await this.userRepository
        .createQueryBuilder('u')
        .where('u.email = :email', { email: values.username })
        .getOne();
      if (!user) throw new UnauthorizedException('Email not found.');

      if (user?.password !== values.password)
        throw new UnauthorizedException('Password is invalid');

      const payload = { sub: user.id, email: user.email };
      // const { password, ...result } = user;
      // TODO: Generate a JWT and return it here
      // instead of the user object
      return await this.jwtService.signAsync(payload);
    } catch (error) {
      throw <Error>error;
    }
  }
}
