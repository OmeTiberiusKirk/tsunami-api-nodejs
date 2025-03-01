import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { userProviders } from './user.provider'
import { DatabaseModule } from 'src/database/database.module'
import { UserController } from './user.controller'
import { PrismaService } from 'src/prisma.service'

@Module({
  imports: [DatabaseModule],
  providers: [...userProviders, UserService, PrismaService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
