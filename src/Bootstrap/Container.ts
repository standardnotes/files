import * as winston from 'winston'
import * as IORedis from 'ioredis'
import * as AWS from 'aws-sdk'
import { Container } from 'inversify'

import { Env } from './Env'
import TYPES from './Types'
import { UploadFileChunk } from '../Domain/UseCase/UploadFileChunk/UploadFileChunk'
import { ValetTokenAuthMiddleware } from '../Controller/ValetTokenAuthMiddleware'
import { TokenDecoder, TokenDecoderInterface, ValetTokenData } from '@standardnotes/auth'
import { Timer, TimerInterface } from '@standardnotes/time'
import { DomainEventFactoryInterface } from '../Domain/Event/DomainEventFactoryInterface'
import { DomainEventFactory } from '../Domain/Event/DomainEventFactory'
import { RedisDomainEventPublisher, SNSDomainEventPublisher } from '@standardnotes/domain-events-infra'
import { StreamDownloadFile } from '../Domain/UseCase/StreamDownloadFile/StreamDownloadFile'
import { FileDownloaderInterface } from '../Domain/Services/FileDownloaderInterface'
import { S3FileDownloader } from '../Infra/S3/S3FileDownloader'
import { FileUploaderInterface } from '../Domain/Services/FileUploaderInterface'
import { S3FileUploader } from '../Infra/S3/S3FileUploader'
import { FSFileDownloader } from '../Infra/FS/FSFileDownloader'
import { FSFileUploader } from '../Infra/FS/FSFileUploader'
import { CreateUploadSession } from '../Domain/UseCase/CreateUploadSession/CreateUploadSession'
import { FinishUploadSession } from '../Domain/UseCase/FinishUploadSession/FinishUploadSession'
import { UploadRepositoryInterface } from '../Domain/Upload/UploadRepositoryInterface'
import { RedisUploadRepository } from '../Infra/Redis/RedisUploadRepository'
import { GetFileMetadata } from '../Domain/UseCase/GetFileMetadata/GetFileMetadata'

export class ContainerConfigLoader {
  async load(): Promise<Container> {
    const env: Env = new Env()
    env.load()

    const container = new Container()

    const logger = this.createLogger({ env })
    container.bind<winston.Logger>(TYPES.Logger).toConstantValue(logger)

    const redisUrl = env.get('REDIS_URL')
    const isRedisInClusterMode = redisUrl.indexOf(',') > 0
    let redis
    if (isRedisInClusterMode) {
      redis = new IORedis.Cluster(redisUrl.split(','))
    } else {
      redis = new IORedis(redisUrl)
    }

    container.bind(TYPES.Redis).toConstantValue(redis)

    if (env.get('S3_AWS_REGION', true)) {
      const s3Client = new AWS.S3({
        apiVersion: 'latest',
        region: env.get('S3_AWS_REGION', true),
      })
      container.bind<AWS.S3>(TYPES.S3).toConstantValue(s3Client)
      container.bind<FileDownloaderInterface>(TYPES.FileDownloader).to(S3FileDownloader)
      container.bind<FileUploaderInterface>(TYPES.FileUploader).to(S3FileUploader)
    } else {
      container.bind<FileDownloaderInterface>(TYPES.FileDownloader).to(FSFileDownloader)
      container.bind<FileUploaderInterface>(TYPES.FileUploader).to(FSFileUploader)
    }

    if (env.get('SNS_AWS_REGION', true)) {
      container.bind<AWS.SNS>(TYPES.SNS).toConstantValue(new AWS.SNS({
        apiVersion: 'latest',
        region: env.get('SNS_AWS_REGION', true),
      }))
    }

    // use cases
    container.bind<UploadFileChunk>(TYPES.UploadFileChunk).to(UploadFileChunk)
    container.bind<StreamDownloadFile>(TYPES.StreamDownloadFile).to(StreamDownloadFile)
    container.bind<CreateUploadSession>(TYPES.CreateUploadSession).to(CreateUploadSession)
    container.bind<FinishUploadSession>(TYPES.FinishUploadSession).to(FinishUploadSession)
    container.bind<GetFileMetadata>(TYPES.GetFileMetadata).to(GetFileMetadata)

    // middleware
    container.bind<ValetTokenAuthMiddleware>(TYPES.ValetTokenAuthMiddleware).to(ValetTokenAuthMiddleware)

    // env vars
    container.bind(TYPES.S3_BUCKET_NAME).toConstantValue(env.get('S3_BUCKET_NAME', true))
    container.bind(TYPES.S3_AWS_REGION).toConstantValue(env.get('S3_AWS_REGION', true))
    container.bind(TYPES.VALET_TOKEN_SECRET).toConstantValue(env.get('VALET_TOKEN_SECRET'))
    container.bind(TYPES.SNS_TOPIC_ARN).toConstantValue(env.get('SNS_TOPIC_ARN', true))
    container.bind(TYPES.SNS_AWS_REGION).toConstantValue(env.get('SNS_AWS_REGION', true))
    container.bind(TYPES.REDIS_URL).toConstantValue(env.get('REDIS_URL'))
    container.bind(TYPES.REDIS_EVENTS_CHANNEL).toConstantValue(env.get('REDIS_EVENTS_CHANNEL'))
    container.bind(TYPES.MAX_CHUNK_BYTES).toConstantValue(+env.get('MAX_CHUNK_BYTES'))
    container.bind(TYPES.VERSION).toConstantValue(env.get('VERSION'))

    // services
    container.bind<TokenDecoderInterface<ValetTokenData>>(TYPES.ValetTokenDecoder).toConstantValue(new TokenDecoder<ValetTokenData>(container.get(TYPES.VALET_TOKEN_SECRET)))
    container.bind<TimerInterface>(TYPES.Timer).toConstantValue(new Timer())
    container.bind<DomainEventFactoryInterface>(TYPES.DomainEventFactory).to(DomainEventFactory)

    // repositories
    container.bind<UploadRepositoryInterface>(TYPES.UploadRepository).to(RedisUploadRepository)

    if (env.get('SNS_TOPIC_ARN', true)) {
      container.bind<SNSDomainEventPublisher>(TYPES.DomainEventPublisher).toConstantValue(
        new SNSDomainEventPublisher(
          container.get(TYPES.SNS),
          container.get(TYPES.SNS_TOPIC_ARN)
        )
      )
    } else {
      container.bind<RedisDomainEventPublisher>(TYPES.DomainEventPublisher).toConstantValue(
        new RedisDomainEventPublisher(
          container.get(TYPES.Redis),
          container.get(TYPES.REDIS_EVENTS_CHANNEL)
        )
      )
    }

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
