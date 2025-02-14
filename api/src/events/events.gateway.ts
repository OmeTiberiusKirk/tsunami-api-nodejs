import {
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'node:http';
import { EarthquakesService } from 'src/earthquakes/earthquakes.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class EventsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(private readonly eqService: EarthquakesService) {}

  @SubscribeMessage('events')
  handleEvent(@MessageBody() data: string) {
    this.server.emit('events', data);
  }

  async handleConnection() {
    await this.emitRecentEarthquakes();
  }

  async emitRecentEarthquakes() {
    const eq = await this.eqService.getRecentEearthquakes();
    this.server.emit('earthquakeData', JSON.stringify(eq));
  }
}
