import { AccountDeletionRequestedEvent, DomainEventHandlerInterface } from '@standardnotes/domain-events'
import { inject, injectable } from 'inversify'

import TYPES from '../../Bootstrap/Types'
import { MarkFilesToBeRemoved } from '../UseCase/MarkFilesToBeRemoved/MarkFilesToBeRemoved'

@injectable()
export class AccountDeletionRequestedEventHandler implements DomainEventHandlerInterface {
  constructor (
    @inject(TYPES.MarkFilesToBeRemoved) private markFilesToBeRemoved: MarkFilesToBeRemoved,
  ) {
  }

  async handle(event: AccountDeletionRequestedEvent): Promise<void> {
    await this.markFilesToBeRemoved.execute({
      userUuid: event.payload.userUuid,
    })
  }
}
