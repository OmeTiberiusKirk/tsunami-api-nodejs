import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Cron } from '@nestjs/schedule'
import * as fs from 'node:fs/promises'
import { Earthquake } from 'src/earthquake/earthquake.entity'
import { EarthquakeService } from 'src/earthquake/earthquake.service'
import { EventsGateway } from 'src/events/events.gateway'
import {
  getGfzEarthquakes,
  getTmdEarthquakes,
  getUsgsEarthquakes,
} from './utils'

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name)
  private bound: number[][]
  readonly mode: 'development' | 'production'

  constructor(
    private eqService: EarthquakeService,
    private eventsGateway: EventsGateway,
    readonly config: ConfigService,
  ) {
    this.mode = config.get('NODE_ENV') || 'development'
    void getUsgsEarthquakes(this.mode)
    void this.handleCron()
  }

  @Cron('* */3 * * * *')
  async handleCron() {
    const values = await this.getEarthquakes()
    await this.insertEarthquakes(values)
    await this.eventsGateway.emitRecentEarthquakes()
  }

  private async insertEarthquakes(values: Earthquake[]) {
    try {
      const str = await this.readFile('/src/tasks/data/tsunami.geojson')
      values = values.filter((value) => {
        return this.addBound(<number[][]>JSON.parse(str)).contains([
          value.longitude,
          value.latitude,
        ])
      })

      await this.eqService.insertEarthquakes(values)
    } catch (error) {
      this.logger.error(error)
    }
  }

  private async getEarthquakes(): Promise<Earthquake[]> {
    const values = await Promise.all([
      // tmd
      getTmdEarthquakes(this.mode),
      // gfz
      getGfzEarthquakes(this.mode),
      // usgs
      getUsgsEarthquakes(this.mode),
    ])
    return values.flat()
  }

  private async readFile(path: string) {
    const data = await fs.readFile(process.cwd() + path, {
      encoding: 'utf8',
    })

    return data
  }

  private addBound(bound: number[][]): this {
    this.bound = bound
    return this
  }

  private contains(point: number[]): boolean {
    this.bound.sort((a, b) => b[0] - a[0])
    const maxLong: number = this.bound[0][0]
    const minLong: number = this.bound[this.bound.length - 1][0]
    this.bound.sort((a, b) => b[1] - a[1])
    const maxLat: number = this.bound[0][1]
    const minLat: number = this.bound[this.bound.length - 1][1]
    return (
      point[0] <= maxLong &&
      point[0] >= minLong &&
      point[1] <= maxLat &&
      point[1] >= minLat
    )
  }
}
