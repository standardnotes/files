import * as winston from 'winston'
import * as AWS from 'aws-sdk'
import { Container } from 'inversify'

import { Env } from './Env'
import TYPES from './Types'
import { StreamUploadFile } from '../Domain/UseCase/StreamUploadFile/StreamUploadFile'
import { ValetTokenAuthMiddleware } from '../Controller/ValetTokenAuthMiddleware'
import { TokenDecoder, TokenDecoderInterface, ValetTokenData } from '@standardnotes/auth'
import { Timer, TimerInterface } from '@standardnotes/time'
import { DomainEventFactoryInterface } from '../Domain/Event/DomainEventFactoryInterface'
import { DomainEventFactory } from '../Domain/Event/DomainEventFactory'
import { SNSDomainEventPublisher } from '@standardnotes/domain-events-infra'

export class ContainerConfigLoader {
  async load(): Promise<Container> {
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

    container.bind<AWS.SNS>(TYPES.SNS).toConstantValue(new AWS.SNS({
      apiVersion: 'latest',
      region: env.get('SNS_AWS_REGION'),
    }))

    // use cases
    container.bind<StreamUploadFile>(TYPES.StreamUploadFile).to(StreamUploadFile)

    // middleware
    container.bind<ValetTokenAuthMiddleware>(TYPES.ValetTokenAuthMiddleware).to(ValetTokenAuthMiddleware)

    // env vars
    container.bind(TYPES.S3_BUCKET_NAME).toConstantValue(env.get('S3_BUCKET_NAME'))
    container.bind(TYPES.S3_AWS_REGION).toConstantValue(env.get('S3_AWS_REGION'))
    container.bind(TYPES.VALET_TOKEN_SECRET).toConstantValue(env.get('VALET_TOKEN_SECRET'))
    container.bind(TYPES.SNS_TOPIC_ARN).toConstantValue(env.get('SNS_TOPIC_ARN'))
    container.bind(TYPES.SNS_AWS_REGION).toConstantValue(env.get('SNS_AWS_REGION'))
    container.bind(TYPES.VERSION).toConstantValue(env.get('VERSION'))

    // services
    container.bind<TokenDecoderInterface<ValetTokenData>>(TYPES.ValetTokenDecoder).toConstantValue(new TokenDecoder<ValetTokenData>(container.get(TYPES.VALET_TOKEN_SECRET)))
    container.bind<TimerInterface>(TYPES.Timer).toConstantValue(new Timer())
    container.bind<DomainEventFactoryInterface>(TYPES.DomainEventFactory).to(DomainEventFactory)
    container.bind<SNSDomainEventPublisher>(TYPES.DomainEventPublisher).toConstantValue(
      new SNSDomainEventPublisher(
        container.get(TYPES.SNS),
        container.get(TYPES.SNS_TOPIC_ARN)
      )
    )

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
