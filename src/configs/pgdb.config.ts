import { registerAs } from '@nestjs/config'
import { DataSourceOptions } from 'typeorm'

export default registerAs(
  'pg-db',
  (): DataSourceOptions => ({
    type: 'postgres',
    host: process.env.PG_DB_HOST,
    ...(process.env.PG_DB_PORT && {
      port: parseInt(process.env.PG_DB_PORT, 10),
    }),
    username: process.env.PG_DB_USER,
    password: process.env.PG_DB_PASS,
    database: process.env.PG_DB_NAME,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  }),
)
