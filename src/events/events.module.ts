import { Module } from '@nestjs/common'
import { EventsGateway } from './events.gateway'
import { EarthquakesModule } from 'src/earthquake/earthquake.module'

@Module({
  imports: [EarthquakesModule],
  providers: [EventsGateway],
})
export class EventsModule {}
