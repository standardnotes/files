import { DomainEventPublisherInterface } from '@standardnotes/domain-events'
import { inject, injectable } from 'inversify'
import { Logger } from 'winston'

import TYPES from '../../../Bootstrap/Types'
import { DomainEventFactoryInterface } from '../../Event/DomainEventFactoryInterface'
import { FileRemoverInterface } from '../../Services/FileRemoverInterface'
import { UseCaseInterface } from '../UseCaseInterface'
import { RemoveFileDTO } from './RemoveFileDTO'
import { RemoveFileResponse } from './RemoveFileResponse'

@injectable()
export class RemoveFile implements UseCaseInterface {
  constructor(
    @inject(TYPES.FileRemover) private fileRemover: FileRemoverInterface,
    @inject(TYPES.DomainEventPublisher) private domainEventPublisher: DomainEventPublisherInterface,
    @inject(TYPES.DomainEventFactory) private domainEventFactory: DomainEventFactoryInterface,
    @inject(TYPES.Logger) private logger: Logger,
  ) {
  }

  async execute(dto: RemoveFileDTO): Promise<RemoveFileResponse> {
    try {
      this.logger.debug(`Removing file: ${dto.resource}`)

      const filePath = `${dto.userUuid}/${dto.resource}`

      const removedFileSize = await this.fileRemover.remove(filePath)

      await this.domainEventPublisher.publish(
        this.domainEventFactory.createFileRemovedEvent({
          userUuid: dto.userUuid,
          filePath: `${dto.userUuid}/${dto.resource}`,
          fileName: dto.resource,
          fileByteSize: removedFileSize,
        })
      )

      return {
        success: true,
      }
    } catch (error) {
      this.logger.error(`Could not remove resource: ${dto.resource} - ${error.message}`)

      return {
        success: false,
        message: 'Could not remove resource',
      }
    }
  }
}
