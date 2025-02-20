import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { JwtModule } from '@nestjs/jwt'
import { jwtConstants } from './constants'
import { userProviders } from 'src/user/user.provider'
import { DatabaseModule } from 'src/database/database.module'
import { AccessTokenStrategy } from './strategies/accessToken.strategy'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [AuthService, ...userProviders, AccessTokenStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
