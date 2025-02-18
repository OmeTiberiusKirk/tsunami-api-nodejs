import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './user.dto';
import { ResponseMessage } from 'src/interceptors/response-message.decorator';
import { TransformInterceptor } from 'src/interceptors/response.interceptor';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('create')
  @ResponseMessage('Inserted User Successfully')
  @UseInterceptors(TransformInterceptor)
  async create(@Body() data: CreateUserDto) {
    try {
      await this.userService.create(data);
      return 'user';
    } catch (error) {
      throw new HttpException(
        (<Error>error).message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
