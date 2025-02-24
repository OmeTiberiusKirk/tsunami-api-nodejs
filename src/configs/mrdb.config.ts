import { registerAs } from '@nestjs/config'
import { DataSourceOptions } from 'typeorm'

export default registerAs(
  'mr-db',
  (): DataSourceOptions => ({
    type: 'mariadb',
    host: process.env.MR_DB_HOST,
    ...(process.env.MR_DB_PORT && {
      port: parseInt(process.env.MR_DB_PORT, 10),
    }),
    username: process.env.MR_DB_USER,
    password: process.env.MR_DB_PASS,
    database: process.env.MR_DB_NAME,
    synchronize: true,
  }),
)
