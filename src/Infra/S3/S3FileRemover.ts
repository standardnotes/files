import { inject, injectable } from 'inversify'
import * as AWS from 'aws-sdk'

import TYPES from '../../Bootstrap/Types'
import { FileRemoverInterface } from '../../Domain/Services/FileRemoverInterface'

@injectable()
export class S3FileRemover implements FileRemoverInterface {
  constructor(
    @inject(TYPES.S3) private s3Client: AWS.S3,
    @inject(TYPES.S3_BUCKET_NAME) private s3BuckeName: string,
  ) {
  }

  async remove(filePath: string): Promise<number> {
    const head = await this.s3Client.headObject({
      Bucket: this.s3BuckeName,
      Key: filePath,
    }).promise()

    const fileSize = head.ContentLength as number

    await this.s3Client.deleteObject({
      Bucket: this.s3BuckeName,
      Key: filePath,
    }).promise()

    return fileSize
  }
}
