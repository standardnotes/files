import * as winston from 'winston'
import { Container } from 'inversify'

import { Env } from './Env'
import TYPES from './Types'
import { CreateValetToken } from '../Domain/UseCase/CreateValetToken/CreateValetToken'
import dayjs = require('dayjs')
import customParseFormat = require('dayjs/plugin/customParseFormat')
import utc = require('dayjs/plugin/utc')
import { CrypterInterface } from '../Domain/Encryption/CrypterInterface'
import { CrypterTest } from '../Domain/Encryption/test/CrypterTest'

export class ContainerConfigLoader {
  async load(): Promise<Container> {
    dayjs.extend(customParseFormat)
    dayjs.extend(utc)

    const env: Env = new Env()
    env.load()

    const container = new Container()

    const logger = this.createLogger({ env })
    container.bind<winston.Logger>(TYPES.Logger).toConstantValue(logger)

    // use cases
    container.bind<CreateValetToken>(TYPES.CreateValetToken).to(CreateValetToken)

    // services
    // todo: replace CrypterTest with CrypterSncrypto
    container.bind<CrypterInterface>(TYPES.Crypter).to(CrypterTest)

    // env vars
    container.bind(TYPES.S3_BUCKET_NAME).toConstantValue(env.get('S3_BUCKET_NAME'))
    container.bind(TYPES.JWT_SECRET).toConstantValue(env.get('JWT_SECRET'))
    container.bind(TYPES.VALET_TOKEN_SECRET).toConstantValue(env.get('VALET_TOKEN_SECRET'))

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
