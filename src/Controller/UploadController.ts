/* istanbul ignore file */
import * as AWS from 'aws-sdk'
import { PassThrough } from 'stream'
import {
  BaseHttpController,
  controller,
  httpPost,
} from 'inversify-express-utils'
import { Request } from 'express'
import { Readable } from 'stream'
import { FileInfo } from 'busboy'
import { inject } from 'inversify'
import TYPES from '../Bootstrap/Types'
import { Logger } from 'winston'

@controller('/files')
export class UploadController extends BaseHttpController {
  constructor(
    @inject(TYPES.Logger) private logger: Logger,
    @inject(TYPES.S3) private s3Client: AWS.S3,
    @inject(TYPES.S3_BUCKET_NAME) private s3BuckeName: string,
  ) {
    super()
  }

  @httpPost('/')
  public async upload(request: Request): Promise<void> {
    this.logger.info('Starting file upload')

    request.pipe(request.busboy)

    request.busboy.on('file', (name: string, stream: Readable, info: FileInfo) => {
      this.logger.info(`File handling started ${name}`)
      stream.pipe(this.uploadFromStream(info.filename))
    })
  }

  private uploadFromStream(fileName: string) {
    this.logger.info(`Uploading from stream started: ${fileName}`)
    const passThroughStream = new PassThrough()

    this.s3Client.upload({ Bucket: this.s3BuckeName, Key: fileName, Body: passThroughStream }, (error: Error, data: AWS.S3.ManagedUpload.SendData) => {
      this.logger.info(error)
      this.logger.info(data)
      this.logger.info(`Upload of '${fileName}' finished`)
    })

    passThroughStream.on('close', () => {
      this.logger.info('Closed pass through stream')
    })

    return passThroughStream
  }
}
