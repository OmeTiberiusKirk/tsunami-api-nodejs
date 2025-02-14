import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { EarthquakesModule } from 'src/earthquakes/earthquakes.module';

@Module({
  imports: [EarthquakesModule],
  providers: [EventsGateway],
})
export class EventsModule {}
