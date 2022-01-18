import * as AWS from 'aws-sdk'
import { inject, injectable } from 'inversify'
import { PassThrough } from 'stream'
import { Logger } from 'winston'
import { Readable } from 'stream'
import { FileInfo } from 'busboy'

import TYPES from '../../../Bootstrap/Types'
import { UseCaseInterface } from '../UseCaseInterface'
import { StreamUploadFileDTO } from './StreamUploadFileDTO'
import { StreamUploadFileResponse } from './StreamUploadFileResponse'
import { DomainEventPublisherInterface } from '@standardnotes/domain-events'
import { DomainEventFactoryInterface } from '../../Event/DomainEventFactoryInterface'

@injectable()
export class StreamUploadFile implements UseCaseInterface {
  constructor(
    @inject(TYPES.S3) private s3Client: AWS.S3,
    @inject(TYPES.S3_BUCKET_NAME) private s3BuckeName: string,
    @inject(TYPES.DomainEventPublisher) private domainEventPublisher: DomainEventPublisherInterface,
    @inject(TYPES.DomainEventFactory) private domainEventFactory: DomainEventFactoryInterface,
    @inject(TYPES.Logger) private logger: Logger,
  ) {
  }

  async execute(dto: StreamUploadFileDTO): Promise<StreamUploadFileResponse> {
    this.logger.debug('Starting file upload')

    dto.request.busboy.on(
      'file',
      /* istanbul ignore next */
      async (_fieldName: string, stream: Readable, _info: FileInfo) => {
        this.logger.debug(`Uploading from stream started: ${dto.resource}`)
        const passThroughStream = new PassThrough()

        const filePath = `${dto.userUuid}/${dto.resource}`

        await this.s3Client.upload({
          Bucket: this.s3BuckeName,
          Key: filePath,
          Body: passThroughStream,
          StorageClass: 'INTELLIGENT_TIERING',
        }).promise()

        await this.domainEventPublisher.publish(
          this.domainEventFactory.createFileUploadedEvent({
            userUuid: dto.userUuid,
            filePath,
            fileName: dto.resource,
            fileByteSize: +(dto.request.headers['content-length'] as string),
          })
        )

        this.logger.debug(`Upload of '${filePath}' finished`)

        dto.response.writeHead(200, { 'Connection': 'close' })
        dto.response.end('File successfully uploaded.')

        stream.pipe(passThroughStream)
      }
    )

    return {
      writeStream:
      /* istanbul ignore next */
      () => dto.request.pipe(dto.request.busboy),
    }
  }
}
