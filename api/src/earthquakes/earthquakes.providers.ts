import { DataSource } from 'typeorm';
import { Earthquake } from './earthquakes.entity';

export const earthquakesProviders = [
  {
    provide: 'EARTHQUAKE_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(Earthquake),
    inject: ['PG_SOURCE'],
  },
];
