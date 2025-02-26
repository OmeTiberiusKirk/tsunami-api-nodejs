import { Inject, Injectable, Logger } from '@nestjs/common'
import { DataSource, Repository } from 'typeorm'
import { Earthquake } from './earthquake.entity'
import { GetBulletinDto } from './earthquake.dto'
import { BulletinIntf } from 'src/interfaces/earthquake.interface'

@Injectable()
export class EarthquakeService {
  private readonly logger = new Logger(EarthquakeService.name)

  constructor(
    @Inject('EARTHQUAKE_REPOSITORY')
    private eqRepository: Repository<Earthquake>,
    @Inject('MR_SOURCE')
    private mrDataSource: DataSource,
  ) {}

  async getRecentEearthquakes() {
    const eq = await this.eqRepository.find({})
    return eq
  }

  async insertEarthquakes(values: Earthquake[]) {
    try {
      await this.eqRepository
        .createQueryBuilder()
        .insert()
        .into(Earthquake)
        .values(values)
        .orUpdate(
          [
            'title',
            'description',
            'latitude',
            'longitude',
            'magnitude',
            'depth',
            'time',
          ],
          ['uid'],
        )
        .execute()
    } catch (error) {
      this.logger.error(error)
    }
  }

  async findSimResultId(query: GetBulletinDto): Promise<number | undefined> {
    try {
      let depth = query.depth

      if (query.depth >= 0 && query.depth <= 29.9) {
        depth = 10
      } else {
        depth = 30
      }

      const rawData = await this.mrDataSource.query<{ id: number }[]>(
        `SELECT id, job_profile_id, name, magnitude,
          depth, decimal_lat, decimal_long,
          ROUND(SQRT(POW(decimal_lat-(?), 2) + POW(decimal_long-(?), 2)), 3) AS R
          FROM sim_result
          WHERE grp_id = ? AND magnitude >= ? AND depth >= ?
          ORDER BY depth, magnitude, R`,
        [query.latitude, query.longitude, 1, query.magnitude, depth],
      )
      return rawData?.[0]?.id
    } catch (error) {
      throw <Error>error
    }
  }

  async findObservationPoints(simId: number): Promise<BulletinIntf[]> {
    try {
      const rawData = await this.mrDataSource.query<BulletinIntf[]>(
        `SELECT observe_point.observ_point_id, observe_point.province_t,
         observe_point.name_t, observe_point.lat_1, observe_point.lat_2, observe_point.lat_3,
         observe_point.long_1, observe_point.long_2, observe_point.long_3, observe_point.decimal_lat,
         observe_point.decimal_long, sim_point_val.values, sim_point_val.type, sim_point_val.region_no
        FROM observe_point, sim_point_val 
        WHERE sim_result_id = ? AND observe_point.observ_point_id = sim_point_val.id_point
          AND sim_point_val.type = 'ETA'`,
        [simId],
      )
      return rawData
    } catch (error) {
      throw <Error>error
    }
  }
}
