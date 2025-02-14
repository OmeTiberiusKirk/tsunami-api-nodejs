import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { EarthquakesController } from './earthquakes.controller';
import { earthquakesProviders } from './earthquakes.providers';
import { EarthquakesService } from './earthquakes.service';

@Module({
  exports: [EarthquakesService],
  imports: [DatabaseModule],
  providers: [...earthquakesProviders, EarthquakesService],
  controllers: [EarthquakesController],
})
export class EarthquakesModule {}
