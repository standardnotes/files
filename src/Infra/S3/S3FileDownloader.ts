import { inject, injectable } from 'inversify'
import * as AWS from 'aws-sdk'
import { Readable } from 'stream'
import TYPES from '../../Bootstrap/Types'
import { FileDownloaderInterface } from '../../Domain/Services/FileDownloaderInterface'

@injectable()
export class S3FileDownloader implements FileDownloaderInterface {
  constructor(
    @inject(TYPES.S3) private s3Client: AWS.S3,
    @inject(TYPES.S3_BUCKET_NAME) private s3BuckeName: string,
  ) {
  }

  createDownloadStream(filePath: string): Readable {
    return this.s3Client.getObject({
      Bucket: this.s3BuckeName,
      Key: filePath,
    }).createReadStream()
  }
}
