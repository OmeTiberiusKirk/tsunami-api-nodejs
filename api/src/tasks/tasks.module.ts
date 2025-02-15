import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { EarthquakesModule } from 'src/earthquakes/earthquakes.module';
import { EventsGateway } from 'src/events/events.gateway';

@Module({
  imports: [EarthquakesModule],
  providers: [TasksService, EventsGateway],
})
export class TasksModule {}
