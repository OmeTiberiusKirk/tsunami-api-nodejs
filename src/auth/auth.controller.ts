import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Request,
  Req,
} from '@nestjs/common'
import { AuthService, JwtPayload } from './auth.service'
import { ApiBearerAuth } from '@nestjs/swagger'
import { AuthDto } from './auth.dto'
import { AccessTokenGuard } from '../guards/jwt.guard'
import { RefreshTokenGuard } from '../guards/jwt-refresh.guard'

@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  login(@Body() body: AuthDto) {
    return this.authService.signin(body)
  }

  @UseGuards(AccessTokenGuard)
  @Get('me')
  getMe(@Request() req: { user: string }) {
    return req.user
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@Req() req: { user: JwtPayload }) {
    return this.authService.refresh(req.user)
  }
}
