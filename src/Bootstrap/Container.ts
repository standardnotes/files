import * as winston from 'winston'
import * as AWS from 'aws-sdk'
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
import { StreamUploadFile } from '../Domain/UseCase/StreamUploadFile/StreamUploadFile'

export class ContainerConfigLoader {
  async load(): Promise<Container> {
    dayjs.extend(customParseFormat)
    dayjs.extend(utc)

    const env: Env = new Env()
    env.load()

    const container = new Container()

    const logger = this.createLogger({ env })
    container.bind<winston.Logger>(TYPES.Logger).toConstantValue(logger)

    const s3Client = new AWS.S3({
      apiVersion: 'latest',
      region: env.get('S3_AWS_REGION'),
    })
    container.bind<AWS.S3>(TYPES.S3).toConstantValue(s3Client)

    // use cases
    container.bind<CreateValetToken>(TYPES.CreateValetToken).to(CreateValetToken)
    container.bind<StreamUploadFile>(TYPES.StreamUploadFile).to(StreamUploadFile)

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
    container.bind(TYPES.S3_AWS_REGION).toConstantValue(env.get('S3_AWS_REGION'))
    container.bind(TYPES.JWT_SECRET).toConstantValue(env.get('JWT_SECRET'))
    container.bind(TYPES.VALET_TOKEN_SECRET).toConstantValue(env.get('VALET_TOKEN_SECRET'))
    container.bind(TYPES.VERSION).toConstantValue(env.get('VERSION'))

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
