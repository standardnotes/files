import * as winston from 'winston'
import { Container } from 'inversify'

import { Env } from './Env'
import TYPES from './Types'
import { CreateValetToken } from '../Domain/UseCase/CreateValetToken/CreateValetToken'
import dayjs = require('dayjs')
import customParseFormat = require('dayjs/plugin/customParseFormat')
import utc = require('dayjs/plugin/utc')
import { CrypterInterface } from '../Domain/Encryption/CrypterInterface'
import { CrypterNode } from '../Domain/Encryption/CrypterNode'
import { OperationValidator } from '../Domain/Operation/OperationValidator'
import { ValetPayloadGenerator } from '../Domain/ValetToken/ValetPayloadGenerator'
import { ValetTokenGenerator } from '../Domain/ValetToken/ValetTokenGenerator'
import { DateValidator } from '../Domain/Date/DateValidator'
import { CreateValetTokenValidator } from '../Domain/UseCase/CreateValetToken/CreateValetTokenValidator'
import { UuidValidator } from '../Domain/Uuid/UuidValidator'

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
    container.bind<CrypterInterface>(TYPES.Crypter).to(CrypterNode)

    container.bind<ValetPayloadGenerator>(TYPES.ValetPayloadGenerator).to(ValetPayloadGenerator)
    container.bind<ValetTokenGenerator>(TYPES.ValetTokenGenerator).to(ValetTokenGenerator)

    // validators
    container.bind<OperationValidator>(TYPES.OperationValidator).to(OperationValidator)
    container.bind<DateValidator>(TYPES.DateValidator).to(DateValidator)
    container.bind<UuidValidator>(TYPES.UuidValidator).to(UuidValidator)
    container.bind<CreateValetTokenValidator>(TYPES.CreateValetTokenValidator).to(CreateValetTokenValidator)

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
