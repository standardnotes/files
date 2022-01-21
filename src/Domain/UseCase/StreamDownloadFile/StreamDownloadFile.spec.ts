import 'reflect-metadata'

import * as AWS from 'aws-sdk'
import { Readable } from 'stream'

import { StreamDownloadFile } from './StreamDownloadFile'

describe('StreamDownloadFile', () => {
  let s3Client: AWS.S3
  const s3BuckeName = 'my-bucket'

  const createUseCase = () => new StreamDownloadFile(
    s3Client,
    s3BuckeName
  )

  beforeEach(() => {
    const awsRequest = {} as jest.Mocked<AWS.Request<AWS.S3.Types.GetObjectOutput, AWS.AWSError>>
    awsRequest.createReadStream = jest.fn().mockReturnValue(new Readable())

    s3Client = {} as jest.Mocked<AWS.S3>
    s3Client.getObject = jest.fn().mockReturnValue(awsRequest)
  })

  it('should stream download file contents from S3', async () => {
    const result = await createUseCase().execute({
      userUuid: '2-3-4',
      resource: '1-2-3',
    })

    expect(result.readStream).toBeInstanceOf(Readable)
  })
})
