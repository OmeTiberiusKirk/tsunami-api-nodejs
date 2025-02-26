import * as dotenv from 'dotenv'
import { DataSource } from 'typeorm'

// Load env file
dotenv.config({ path: process.cwd() + '/.env' })

export default new DataSource({
  type: 'postgres',
  host: process.env.PG_DB_HOST,
  ...(process.env.PG_DB_PORT && {
    port: parseInt(process.env.PG_DB_PORT, 10),
  }),
  username: process.env.PG_DB_USER,
  password: process.env.PG_DB_PASS,
  database: process.env.PG_DB_NAME,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
})
