import 'reflect-metadata'

import { DomainEventPublisherInterface, FileUploadedEvent } from '@standardnotes/domain-events'
import { Logger } from 'winston'
import { DomainEventFactoryInterface } from '../../Event/DomainEventFactoryInterface'
import { FileUploaderInterface } from '../../Services/FileUploaderInterface'
import { UploadRepositoryInterface } from '../../Upload/UploadRepositoryInterface'

import { FinishUploadSession } from './FinishUploadSession'

describe('FinishUploadSession', () => {
  let fileUploader: FileUploaderInterface
  let uploadRepository: UploadRepositoryInterface
  let domainEventPublisher: DomainEventPublisherInterface
  let domainEventFactory: DomainEventFactoryInterface
  let logger: Logger

  const createUseCase = () => new FinishUploadSession(
    fileUploader,
    uploadRepository,
    domainEventPublisher,
    domainEventFactory,
    logger
  )

  beforeEach(() => {
    fileUploader = {} as jest.Mocked<FileUploaderInterface>
    fileUploader.finishUploadSession = jest.fn().mockReturnValue('ETag123')

    uploadRepository = {} as jest.Mocked<UploadRepositoryInterface>
    uploadRepository.retrieveUploadSessionId = jest.fn().mockReturnValue('123')
    uploadRepository.retrieveUploadChunkResults = jest.fn().mockReturnValue([{ ETag: '123', PartNumber: 1 }])

    domainEventPublisher = {} as jest.Mocked<DomainEventPublisherInterface>
    domainEventPublisher.publish = jest.fn()

    domainEventFactory = {} as jest.Mocked<DomainEventFactoryInterface>
    domainEventFactory.createFileUploadedEvent = jest.fn().mockReturnValue({} as jest.Mocked<FileUploadedEvent>)

    logger = {} as jest.Mocked<Logger>
    logger.debug = jest.fn()
    logger.error = jest.fn()
    logger.warn = jest.fn()
  })

  it('should not finish an upload session if non existing', async () => {
    uploadRepository.retrieveUploadSessionId = jest.fn().mockReturnValue(undefined)

    await createUseCase().execute({
      resource: '2-3-4',
      userUuid: '1-2-3',
    })

    expect(fileUploader.finishUploadSession).not.toHaveBeenCalled()
    expect(domainEventPublisher.publish).not.toHaveBeenCalled()
  })

  it('should indicate of an error in finishing session fails', async () => {
    uploadRepository.retrieveUploadSessionId = jest.fn().mockImplementation(() => {
      throw new Error('oops')
    })

    expect(await createUseCase().execute({
      resource: '2-3-4',
      userUuid: '1-2-3',
    })).toEqual({
      success: false,
      message: 'Could not finish upload session',
    })

    expect(fileUploader.finishUploadSession).not.toHaveBeenCalled()
    expect(domainEventPublisher.publish).not.toHaveBeenCalled()
  })

  it('should finish an upload session', async () => {
    await createUseCase().execute({
      resource: '2-3-4',
      userUuid: '1-2-3',
    })

    expect(fileUploader.finishUploadSession).toHaveBeenCalledWith('123', '1-2-3/2-3-4', [{ ETag: '123', PartNumber: 1 }])
    expect(domainEventPublisher.publish).toHaveBeenCalled()
  })
})
