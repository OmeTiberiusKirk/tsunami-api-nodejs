import { Controller, Get, Query } from '@nestjs/common'
import { GetBulletinDto } from './earthquake.dto'
import { EarthquakeService } from './earthquake.service'
import { BulletinIntf } from 'src/interfaces/earthquake.interface'

@Controller('earthquakes')
export class EarthquakeController {
  constructor(private service: EarthquakeService) {}

  @Get('getbulletin')
  async getbulletin(
    @Query() query: GetBulletinDto,
  ): Promise<{ eta_results: BulletinIntf[] }> {
    try {
      const simId = await this.service.findSimResultId(query)
      if (simId) {
        const bulletin = await this.service.findObservationPoints(simId)
        return { eta_results: bulletin }
      }
      return { eta_results: [] }
    } catch (error) {
      throw <Error>error
    }
  }
}
