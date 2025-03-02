import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { JwtModule } from '@nestjs/jwt'
import { DatabaseModule } from 'src/database/database.module'
import { AccessTokenStrategy } from '../strategies/accessToken.strategy'
import jwtConfig from 'src/configs/jwt.config'
import { ConfigModule } from '@nestjs/config'
import refreshJwtConfig from 'src/configs/jwt-refresh.config'
import { RefreshTokenStrategy } from '../strategies/refreshToken.strategy'
import { PrismaService } from 'src/prisma.service'

@Module({
  imports: [
    DatabaseModule,
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(refreshJwtConfig),
  ],
  providers: [
    PrismaService,
    AuthService,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule { }
