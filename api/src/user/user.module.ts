import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { userProviders } from './user.provider';
import { DatabaseModule } from 'src/database/database.module';
import { UserController } from './user.controller';

@Module({
  imports: [DatabaseModule],
  providers: [...userProviders, UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
