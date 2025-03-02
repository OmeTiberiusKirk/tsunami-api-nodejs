import { ConfigModule, ConfigType } from '@nestjs/config'
import mrdbConfig from 'src/configs/mrdb.config'
import { DataSource } from 'typeorm'

export const databaseProviders = [
  {
    provide: 'MR_SOURCE',
    inject: [mrdbConfig.KEY],
    imports: [ConfigModule.forFeature(mrdbConfig)],
    useFactory: (config: ConfigType<typeof mrdbConfig>) => {
      const dataSource = new DataSource(config)
      return dataSource.initialize()
    },
  },
]
