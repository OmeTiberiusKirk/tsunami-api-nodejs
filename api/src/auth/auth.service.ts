import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AuthDto } from './auth.dto'
import { Repository } from 'typeorm'
import { User } from 'src/user/user.entity'
import * as bcrypt from 'bcrypt'
import { ConfigType } from '@nestjs/config'
import jwtConfig from 'src/configs/jwt.config'
import jwtRefreshConfig from 'src/configs/jwt-refresh.config'

export type JwtPayload = {
  sub: number
  email: string
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger()

  constructor(
    @Inject('USER_REPOSITORY') private userRepository: Repository<User>,
    private jwtService: JwtService,
    @Inject(jwtConfig.KEY) private accessConfig: ConfigType<typeof jwtConfig>,
    @Inject(jwtRefreshConfig.KEY)
    private refreshConfig: ConfigType<typeof jwtRefreshConfig>,
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

      const { accessToken, refreshToken } = await this.getTokens({
        sub: user.id || 0,
        email: user.email,
      })

      return { accessToken, refreshToken }
    } catch (error) {
      throw <Error>error
    }
  }

  private async getTokens(user: JwtPayload) {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(user),
      this.generateRefreshToken(user),
    ])

    return { accessToken, refreshToken }
  }

  private generateAccessToken({ sub, email }: JwtPayload) {
    return this.jwtService.sign(
      {
        sub,
        email,
      },
      {
        secret: this.accessConfig.secret,
        expiresIn: this.accessConfig.signOptions?.expiresIn,
      },
    )
  }

  private generateRefreshToken({ sub, email }: JwtPayload) {
    return this.jwtService.sign(
      {
        sub,
        email,
      },
      this.refreshConfig,
    )
  }

  refresh(payload: JwtPayload) {
    try {
      const accessToken = this.generateAccessToken(payload)
      return accessToken
    } catch (error) {
      this.logger.error(error)
      throw new InternalServerErrorException(<Error>error)
    }
  }
}
