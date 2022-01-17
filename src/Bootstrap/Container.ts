import * as winston from 'winston'
import * as AWS from 'aws-sdk'
import { Container } from 'inversify'

import { Env } from './Env'
import TYPES from './Types'
import { CreateValetToken } from '../Domain/UseCase/CreateValetToken/CreateValetToken'
import { StreamUploadFile } from '../Domain/UseCase/StreamUploadFile/StreamUploadFile'
import { ValetTokenAuthMiddleware } from '../Controller/ValetTokenAuthMiddleware'
import { CrossServiceTokenData, TokenDecoder, TokenDecoderInterface, TokenEncoder, TokenEncoderInterface, ValetTokenData } from '@standardnotes/auth'
import { ApiGatewayAuthMiddleware } from '../Controller/ApiGatewayAuthMiddleware'

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

    // use cases
    container.bind<CreateValetToken>(TYPES.CreateValetToken).to(CreateValetToken)
    container.bind<StreamUploadFile>(TYPES.StreamUploadFile).to(StreamUploadFile)

    // middleware
    container.bind<ValetTokenAuthMiddleware>(TYPES.ValetTokenAuthMiddleware).to(ValetTokenAuthMiddleware)
    container.bind<ApiGatewayAuthMiddleware>(TYPES.ApiGatewayAuthMiddleware).to(ApiGatewayAuthMiddleware)

    // env vars
    container.bind(TYPES.S3_BUCKET_NAME).toConstantValue(env.get('S3_BUCKET_NAME'))
    container.bind(TYPES.S3_AWS_REGION).toConstantValue(env.get('S3_AWS_REGION'))
    container.bind(TYPES.AUTH_JWT_SECRET).toConstantValue(env.get('AUTH_JWT_SECRET'))
    container.bind(TYPES.VALET_TOKEN_SECRET).toConstantValue(env.get('VALET_TOKEN_SECRET'))
    container.bind(TYPES.VALET_TOKEN_TTL).toConstantValue(env.get('VALET_TOKEN_TTL'))
    container.bind(TYPES.VERSION).toConstantValue(env.get('VERSION'))

    // services
    container.bind<TokenDecoderInterface<CrossServiceTokenData>>(TYPES.CrossServiceTokenDecoder).toConstantValue(new TokenDecoder<CrossServiceTokenData>(container.get(TYPES.AUTH_JWT_SECRET)))
    container.bind<TokenEncoderInterface<ValetTokenData>>(TYPES.ValetTokenEncoder).toConstantValue(new TokenEncoder<ValetTokenData>(container.get(TYPES.VALET_TOKEN_SECRET)))
    container.bind<TokenDecoderInterface<ValetTokenData>>(TYPES.ValetTokenDecoder).toConstantValue(new TokenDecoder<ValetTokenData>(container.get(TYPES.VALET_TOKEN_SECRET)))

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
