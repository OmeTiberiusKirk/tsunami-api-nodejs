import { DataSource } from 'typeorm'
import { Earthquake } from './earthquake.entity'

export const earthquakeProviders = [
  {
    provide: 'EARTHQUAKE_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(Earthquake),
    inject: ['PG_SOURCE'],
  },
]
