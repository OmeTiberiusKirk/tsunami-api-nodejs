import { Controller, Get, Logger, Query } from '@nestjs/common';
import { GetBulletinDto } from './earthquakes.dto';
import { EarthquakesService } from './earthquakes.service';
import { Bulletin } from './earthquakes.resp';
import { ApiOkResponse } from '@nestjs/swagger';

@Controller('earthquakes')
export class EarthquakesController {
  private readonly logger = new Logger(EarthquakesController.name);

  constructor(private service: EarthquakesService) {}

  @Get('getbulletin')
  @ApiOkResponse({
    type: [Bulletin],
  })
  async getbulletin(
    @Query() query: GetBulletinDto,
  ): Promise<{ eta_results: Bulletin[] }> {
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
