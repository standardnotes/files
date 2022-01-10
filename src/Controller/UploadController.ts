/* istanbul ignore file */
import * as AWS from 'aws-sdk'
import { PassThrough } from 'stream'
import {
  BaseHttpController,
  controller,
  httpPost,
} from 'inversify-express-utils'
import { Request, Response } from 'express'
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
  public async upload(request: Request, response: Response): Promise<void> {
    this.logger.info('Starting file upload')

    request.busboy.on('file', (_name: string, stream: Readable, info: FileInfo) => {
      const passThroughStream = new PassThrough()

      this.s3Client.upload({ Bucket: this.s3BuckeName, Key: info.filename, Body: passThroughStream }, (error: Error, data: AWS.S3.ManagedUpload.SendData) => {
        this.logger.info(error)
        this.logger.info(data)
        this.logger.info(`Upload of '${info.filename}' finished`)
      })

      stream.pipe(passThroughStream)
    })

    request.busboy.on('finish', function () {
      response.status(200).json({ 'message': 'File uploaded successfully.' })
    })

    request.pipe(request.busboy)
  }
}
