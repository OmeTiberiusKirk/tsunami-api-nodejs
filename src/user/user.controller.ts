import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common'
import { CreateUserDto } from './user.dto'
import { UserService } from './user.service'
import { AccessTokenGuard } from 'src/guards/jwt.guard'
import { ApiBearerAuth } from '@nestjs/swagger'
import { RolesGuard } from 'src/roles/roles.guard'
import { Roles } from 'src/roles/roles.decorator'
import { Role } from '@prisma/client'

@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private userService: UserService) { }

  @Post('create')
  @UseGuards(RolesGuard)
  @Roles(Role.superadmin)
  @UseGuards(AccessTokenGuard)
  async create(@Body() data: CreateUserDto) {
    try {
      return await this.userService.create(data)
    } catch (error) {
      throw new HttpException(
        (<Error>error).message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }
}
