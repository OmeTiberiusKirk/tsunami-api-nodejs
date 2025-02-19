import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './auth.dto';
import { AuthGuard } from './auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth('access_token')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  login(@Body() signInDto: AuthDto) {
    return this.authService.login(signInDto);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  getMe(@Request() req: { user: string }) {
    return req.user;
  }
}
