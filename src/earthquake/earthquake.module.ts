import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { EarthquakeController } from './earthquake.controller'
import { EarthquakeService } from './earthquake.service'
import { PrismaService } from 'src/prisma.service'

@Module({
  exports: [EarthquakeService],
  imports: [DatabaseModule],
  providers: [EarthquakeService, PrismaService],
  controllers: [EarthquakeController],
})
export class EarthquakesModule {}
