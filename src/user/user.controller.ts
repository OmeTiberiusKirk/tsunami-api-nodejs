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
import { Roles } from 'src/role/role.decorator'
import { Role } from 'src/role/role.enum'
import { AccessTokenGuard } from 'src/guards/jwt.guard'

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('create')
  @UseGuards(AccessTokenGuard)
  @Roles(Role.ADMIN)
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
