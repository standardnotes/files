import 'reflect-metadata'

import * as AWS from 'aws-sdk'
import { Readable } from 'stream'

import { S3FileDownloader } from './S3FileDownloader'

describe('S3FileDownloader', () => {
  let s3Client: AWS.S3
  const s3BuckeName = 'test'

  const createService = () => new S3FileDownloader(s3Client, s3BuckeName)

  beforeEach(() => {
    const awsRequest = {} as jest.Mocked<AWS.Request<AWS.S3.Types.GetObjectOutput, AWS.AWSError>>
    awsRequest.createReadStream = jest.fn().mockReturnValue(new Readable())

    s3Client = {} as jest.Mocked<AWS.S3>
    s3Client.getObject = jest.fn().mockReturnValue(awsRequest)
  })

  it('should create a download stream', () => {
    expect(createService().createDownloadStream('test.txt')).toBeInstanceOf(Readable)
  })
})
