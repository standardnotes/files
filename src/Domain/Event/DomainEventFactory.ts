import { FileUploadedEvent, FileRemovedEvent } from '@standardnotes/domain-events'
import { TimerInterface } from '@standardnotes/time'
import { inject, injectable } from 'inversify'

import TYPES from '../../Bootstrap/Types'
import { DomainEventFactoryInterface } from './DomainEventFactoryInterface'

@injectable()
export class DomainEventFactory implements DomainEventFactoryInterface {
  constructor (
    @inject(TYPES.Timer) private timer: TimerInterface,
  ) {
  }

  createFileRemovedEvent(payload: { userUuid: string, filePath: string, fileName: string, fileByteSize: number }): FileRemovedEvent {
    return {
      type: 'FILE_REMOVED',
      createdAt: this.timer.getUTCDate(),
      meta: {
        correlation: {
          userIdentifier: payload.userUuid,
          userIdentifierType: 'uuid',
        },
      },
      payload,
    }
  }

  createFileUploadedEvent(payload: { userUuid: string, filePath: string, fileName: string, fileByteSize: number }): FileUploadedEvent {
    return {
      type: 'FILE_UPLOADED',
      createdAt: this.timer.getUTCDate(),
      meta: {
        correlation: {
          userIdentifier: payload.userUuid,
          userIdentifierType: 'uuid',
        },
      },
      payload,
    }
  }
}
