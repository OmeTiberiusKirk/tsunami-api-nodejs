import { ConfigModule, ConfigType } from '@nestjs/config'
import mrdbConfig from 'src/configs/mrdb.config'
import pgdbConfig from 'src/configs/pgdb.config'
import { DataSource } from 'typeorm'

export const databaseProviders = [
  {
    provide: 'PG_SOURCE',
    inject: [pgdbConfig.KEY],
    imports: [ConfigModule.forFeature(pgdbConfig)],
    useFactory: async (config: ConfigType<typeof pgdbConfig>) => {
      const dataSource = new DataSource(config)
      return dataSource.initialize()
    },
  },
  {
    provide: 'MR_SOURCE',
    inject: [mrdbConfig.KEY],
    imports: [ConfigModule.forFeature(mrdbConfig)],
    useFactory: async (config: ConfigType<typeof mrdbConfig>) => {
      const dataSource = new DataSource(config)
      return dataSource.initialize()
    },
  },
]
