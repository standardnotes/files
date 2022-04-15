import { inject, injectable } from 'inversify'
import * as AWS from 'aws-sdk'

import TYPES from '../../Bootstrap/Types'
import { FileRemoverInterface } from '../../Domain/Services/FileRemoverInterface'
import { RemovedFileDescription } from '../../Domain/File/RemovedFileDescription'
import { Logger } from 'winston'

@injectable()
export class S3FileRemover implements FileRemoverInterface {
  constructor(
    @inject(TYPES.S3) private s3Client: AWS.S3,
    @inject(TYPES.S3_BUCKET_NAME) private s3BuckeName: string,
    @inject(TYPES.Logger) private logger: Logger
  ) {
  }

  async markFilesToBeRemoved(userUuid: string): Promise<Array<RemovedFileDescription>> {
    this.logger.debug('[%s] Listing objects in bucket %s', userUuid, this.s3BuckeName)

    const filesResponse = await this.s3Client.listObjectsV2({
      Bucket: this.s3BuckeName,
      Prefix: `${userUuid}/`,
    }).promise()

    if (filesResponse.Contents === undefined) {
      return []
    }

    const files = filesResponse.Contents

    const removedFileDescriptions: Array<RemovedFileDescription> = []

    for (const file of files) {
      if (file.Key === undefined) {
        continue
      }

      this.logger.debug(`Copying object ${file.Key}`)

      await this.s3Client.copyObject({
        Bucket: this.s3BuckeName,
        Key: `expiration-chamber/${file.Key}`,
        CopySource: `${this.s3BuckeName}/${file.Key}`,
        StorageClass: 'DEEP_ARCHIVE',
      }).promise()

      this.logger.debug(`Deleting object ${file.Key}`)

      await this.s3Client.deleteObject({
        Bucket: this.s3BuckeName,
        Key: file.Key,
      }).promise()

      removedFileDescriptions.push({
        fileByteSize: file.Size as number,
        fileName: file.Key.replace(`${userUuid}/`, ''),
        filePath: file.Key,
        userUuid,
      })
    }

    return removedFileDescriptions
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
