import 'reflect-metadata'

import * as AWS from 'aws-sdk'
import { Logger } from 'winston'
import { Writable } from 'stream'

import { StreamUploadFile } from './StreamUploadFile'
import { Request, Response } from 'express'
import { Busboy } from 'busboy'
import { DomainEventFactoryInterface } from '../../Event/DomainEventFactoryInterface'
import { DomainEventPublisherInterface } from '@standardnotes/domain-events'

describe('StreamUploadFile', () => {
  let s3Client: AWS.S3
  const s3BuckeName = 'my-bucket'
  let logger: Logger
  let request: Request
  let response: Response
  let domainEventPublisher: DomainEventPublisherInterface
  let domainEventFactory: DomainEventFactoryInterface

  const createUseCase = () => new StreamUploadFile(
    s3Client,
    s3BuckeName,
    domainEventPublisher,
    domainEventFactory,
    logger
  )

  beforeEach(() => {
    s3Client = {} as jest.Mocked<AWS.S3>

    domainEventPublisher = {} as jest.Mocked<DomainEventPublisherInterface>

    domainEventFactory = {} as jest.Mocked<DomainEventFactoryInterface>

    logger = {} as jest.Mocked<Logger>
    logger.debug = jest.fn()

    request = {} as jest.Mocked<Request>
    request.busboy = {} as jest.Mocked<Busboy>
    request.busboy.on = jest.fn()
    request.pipe = jest.fn().mockReturnValue(new Writable())

    response = {} as jest.Mocked<Response>
    response.locals = {
      userUuid: '1-2-3',
    }
  })

  it('should stream upload file contents to S3', async () => {
    const result = await createUseCase().execute({
      request,
      response,
      userUuid: '1-2-3',
      resource: '2-3-4',
    })

    expect(result.writeStream).toBeInstanceOf(Function)
  })
})
