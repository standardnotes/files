import 'reflect-metadata'

import { AccountDeletionRequestedEvent, AccountDeletionRequestedEventPayload } from '@standardnotes/domain-events'
import { MarkFilesToBeRemoved } from '../UseCase/MarkFilesToBeRemoved/MarkFilesToBeRemoved'

import { AccountDeletionRequestedEventHandler } from './AccountDeletionRequestedEventHandler'

describe('AccountDeletionRequestedEventHandler', () => {
  let markFilesToBeRemoved: MarkFilesToBeRemoved
  let event: AccountDeletionRequestedEvent

  const createHandler = () => new AccountDeletionRequestedEventHandler(markFilesToBeRemoved)

  beforeEach(() => {
    markFilesToBeRemoved = {} as jest.Mocked<MarkFilesToBeRemoved>
    markFilesToBeRemoved.execute = jest.fn()

    event = {} as jest.Mocked<AccountDeletionRequestedEvent>
    event.payload = {
      userUuid: '1-2-3',
    } as jest.Mocked<AccountDeletionRequestedEventPayload>
  })

  it('should mark files to be remove for user', async () => {
    await createHandler().handle(event)

    expect(markFilesToBeRemoved.execute).toHaveBeenCalledWith({ userUuid: '1-2-3' })
  })
})
