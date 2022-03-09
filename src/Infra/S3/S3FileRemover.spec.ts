import 'reflect-metadata'

import * as AWS from 'aws-sdk'

import { S3FileRemover } from './S3FileRemover'

describe('S3FileRemover', () => {
  let s3Client: AWS.S3
  const s3BuckeName = 'test'

  const createService = () => new S3FileRemover(s3Client, s3BuckeName)

  beforeEach(() => {
    const deleteObjectRequest = {} as jest.Mocked<AWS.Request<AWS.S3.Types.DeleteObjectRequest, AWS.AWSError>>
    deleteObjectRequest.promise = jest.fn()

    s3Client = {} as jest.Mocked<AWS.S3>
    s3Client.deleteObject = jest.fn().mockReturnValue(deleteObjectRequest)

    const headRequest = {} as jest.Mocked<AWS.Request<AWS.S3.Types.HeadObjectOutput, AWS.AWSError>>
    headRequest.promise = jest.fn().mockReturnValue(Promise.resolve({ ContentLength: 200 }))
    s3Client.headObject = jest.fn().mockReturnValue(headRequest)
  })

  it('should delete a file', async () => {
    expect(await createService().remove('123/234')).toEqual(200)

    expect(s3Client.deleteObject).toHaveBeenCalledWith({
      Bucket: 'test',
      Key: '123/234',
    })
  })
})
