import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AuthDto } from './auth.dto'
import * as bcrypt from 'bcrypt'
import { ConfigType } from '@nestjs/config'
import jwtConfig from 'src/configs/jwt.config'
import jwtRefreshConfig from 'src/configs/jwt-refresh.config'
import { PrismaService } from 'src/prisma.service'
import { Role } from '@prisma/client';

export type JwtPayload = {
  sub: number
  email: string
  role: Role
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)

  constructor(
    private jwtService: JwtService,
    @Inject(jwtConfig.KEY) private accessConfig: ConfigType<typeof jwtConfig>,
    @Inject(jwtRefreshConfig.KEY)
    private refreshConfig: ConfigType<typeof jwtRefreshConfig>,
    private prisma: PrismaService
  ) {
  }

  async signin(values: AuthDto) {
    try {
      const user = await this.prisma.user.findFirst({ where: { email: values.username } })
      if (!user) throw new UnauthorizedException('Email not found.')
      const isMatch = await bcrypt.compare(values.password, user.password)

      if (!isMatch) throw new UnauthorizedException('Password is invalid')

      const { accessToken, refreshToken } = await this.getTokens({
        sub: user.id || 0,
        email: user.email,
        role: user.role,
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

  private generateAccessToken(payload: JwtPayload) {
    return this.jwtService.sign(payload, {
      secret: this.accessConfig.secret,
      expiresIn: this.accessConfig.signOptions?.expiresIn,
    })
  }

  private generateRefreshToken(payload: JwtPayload) {
    return this.jwtService.sign(payload, this.refreshConfig)
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
