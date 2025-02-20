import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AuthDto } from './auth.dto'
import { Repository } from 'typeorm'
import { User } from 'src/user/user.entity'
import * as bcrypt from 'bcrypt'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signin(values: AuthDto) {
    try {
      const user = await this.userRepository
        .createQueryBuilder('u')
        .where('u.email = :email', { email: values.username })
        .getOne()
      if (!user) throw new UnauthorizedException('Email not found.')
      const isMatch = await bcrypt.compare(values.password, user.password)

      if (!isMatch) throw new UnauthorizedException('Password is invalid')

      const {accessToken, refreshToken} = await this.getTokens(user)
      console.log(refreshToken)
      
      return accessToken
    } catch (error) {
      throw <Error>error
    }
  }

  private async getTokens(user: User) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: user.id,
          email: user.email,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: user.id,
          email: user.email,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ])

    return { accessToken, refreshToken }
  }
}
