import { Module } from '@nestjs/common'
import { UserService } from './user.service'
import { DatabaseModule } from 'src/database/database.module'
import { UserController } from './user.controller'
import { PrismaService } from 'src/prisma.service'

@Module({
  imports: [DatabaseModule],
  providers: [UserService, PrismaService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
