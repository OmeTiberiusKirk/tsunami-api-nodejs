import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { EarthquakeController } from './earthquake.controller';
import { earthquakeProviders } from './earthquake.providers';
import { EarthquakeService } from './earthquake.service';

@Module({
  exports: [EarthquakeService],
  imports: [DatabaseModule],
  providers: [...earthquakeProviders, EarthquakeService],
  controllers: [EarthquakeController],
})
export class EarthquakesModule {}
