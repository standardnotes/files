import * as winston from 'winston'
import { Container } from 'inversify'

import { Env } from './Env'
import TYPES from './Types'
import { ValetKeyGeneratorS3 } from '../Infra/AWS/ValetKeyGeneratorS3'
import { ValetKeyGenerator } from '../Domain/ValetKey/ValetKeyGenerator'

export class ContainerConfigLoader {
  async load(): Promise<Container> {
    const env: Env = new Env()
    env.load()

    const container = new Container()

    const logger = this.createLogger({ env })
    container.bind<winston.Logger>(TYPES.Logger).toConstantValue(logger)

    container.bind<ValetKeyGenerator>(TYPES.ValetKeyGenerator)
      .toConstantValue(new ValetKeyGeneratorS3())

    // env vars
    container.bind(TYPES.S3_BUCKET_NAME).toConstantValue(env.get('S3_BUCKET_NAME'))

    return container
  }

  createLogger({ env }: { env: Env }): winston.Logger {
    return winston.createLogger({
      level: env.get('LOG_LEVEL') || 'info',
      format: winston.format.combine(
        winston.format.splat(),
        winston.format.json(),
      ),
      transports: [
        new winston.transports.Console({ level: env.get('LOG_LEVEL') || 'info' }),
      ],
    })
  }
}
