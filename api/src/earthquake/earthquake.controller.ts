import { Controller, Get, Logger, Query } from '@nestjs/common';
import { GetBulletinDto } from './earthquake.dto';
import { EarthquakeService } from './earthquake.service';
import { ApiOkResponse } from '@nestjs/swagger';
import { BulletinIntf } from 'src/interfaces/earthquake.interface';

@Controller('earthquakes')
export class EarthquakeController {
  private readonly logger = new Logger(EarthquakeController.name);

  constructor(private service: EarthquakeService) {}

  @Get('getbulletin')
  @ApiOkResponse({
    type: [BulletinIntf],
  })
  async getbulletin(
    @Query() query: GetBulletinDto,
  ): Promise<{ eta_results: BulletinIntf[] }> {
    try {
      const simId = await this.service.findSimResultId(query);
      if (simId) {
        const bulletin = await this.service.findObservationPoints(simId);
        return { eta_results: bulletin };
      }
      return { eta_results: [] };
    } catch (error) {
      throw <Error>error;
    }
  }
}
