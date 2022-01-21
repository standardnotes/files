import * as AWS from 'aws-sdk'
import { inject, injectable } from 'inversify'
import TYPES from '../../../Bootstrap/Types'
import { UseCaseInterface } from '../UseCaseInterface'
import { StreamDownloadFileDTO } from './StreamDownloadFileDTO'
import { StreamDownloadFileResponse } from './StreamDownloadFileResponse'

@injectable()
export class StreamDownloadFile implements UseCaseInterface {
  constructor(
    @inject(TYPES.S3) private s3Client: AWS.S3,
    @inject(TYPES.S3_BUCKET_NAME) private s3BuckeName: string,
  ) {
  }

  async execute(dto: StreamDownloadFileDTO): Promise<StreamDownloadFileResponse> {
    const readStream = this.s3Client.getObject({
      Bucket: this.s3BuckeName,
      Key: `${dto.userUuid}/${dto.resource}`,
    }).createReadStream()

    return {
      readStream,
    }
  }
}
