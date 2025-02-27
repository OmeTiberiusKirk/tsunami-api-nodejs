import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { CreateUserDto } from './user.dto'
import { TransformInterceptor } from 'src/interceptors/response.interceptor'
import { UserService } from './user.service'
import { AccessTokenGuard } from 'src/guards/jwt.guard'
import { ApiBearerAuth } from '@nestjs/swagger'
import { RolesGuard } from 'src/roles/roles.guard'
import { Roles } from 'src/roles/roles.decorator'
import { Role } from 'src/roles/roles.enum'

@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('create')
  @UseGuards(RolesGuard)
  @Roles(Role.SUPERADMIN)
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(TransformInterceptor)
  async create(@Body() data: CreateUserDto) {
    try {
      await this.userService.create(data)
      return 'user'
    } catch (error) {
      throw new HttpException(
        (<Error>error).message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }
}
