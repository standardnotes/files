import 'reflect-metadata'

import * as AWS from 'aws-sdk'
import { Logger } from 'winston'
import { PassThrough } from 'stream'

import { S3FileUploader } from './S3FileUploader'

describe('S3FileUploader', () => {
  let s3Client: AWS.S3
  const s3BucketName = 'test'
  let logger: Logger

  const createService = () => new S3FileUploader(s3Client, s3BucketName, logger)

  beforeEach(() => {
    s3Client = {} as jest.Mocked<AWS.S3>
    s3Client.upload = jest.fn()

    logger = {} as jest.Mocked<Logger>
    logger.debug = jest.fn()
  })

  it('should create an upload stream', () => {
    expect(createService().createUploadStream('test.txt')).toBeInstanceOf(PassThrough)
  })
})
