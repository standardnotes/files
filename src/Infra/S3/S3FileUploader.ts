import { inject, injectable } from 'inversify'
import * as AWS from 'aws-sdk'
import { PassThrough, Writable } from 'stream'
import { Logger } from 'winston'
import TYPES from '../../Bootstrap/Types'
import { FileUploaderInterface } from '../../Domain/Services/FileUploaderInterface'

@injectable()
export class S3FileUploader implements FileUploaderInterface {
  constructor(
    @inject(TYPES.S3) private s3Client: AWS.S3,
    @inject(TYPES.S3_BUCKET_NAME) private s3BuckeName: string,
    @inject(TYPES.Logger) private logger: Logger,
  ) {
  }

  createUploadStream(filePath: string): Writable {
    const passThroughStream = new PassThrough()

    this.s3Client.upload({
      Bucket: this.s3BuckeName,
      Key: filePath,
      Body: passThroughStream,
      StorageClass: 'INTELLIGENT_TIERING',
    },
    /* istanbul ignore next */
    () => {
      this.logger.debug(`Upload of '${filePath}' finished`)
    })

    return passThroughStream
  }
}
