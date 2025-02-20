import { Body, Controller, Post, UseGuards, Get, Request } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthGuard } from './auth.guard'
import { ApiBearerAuth } from '@nestjs/swagger'
import { AuthDto } from './auth.dto'
import { JwtAuthGuard } from './jwt-auth.guard'

@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  login(@Body() body: AuthDto) {
    return this.authService.signin(body)
  }

  // @UseGuards(AuthGuard)
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Request() req: { user: string }) {
    return req.user
  }
}
