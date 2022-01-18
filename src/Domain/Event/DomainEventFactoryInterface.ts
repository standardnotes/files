import { FileUploadedEvent } from '@standardnotes/domain-events'

export interface DomainEventFactoryInterface {
  createFileUploadedEvent(payload: { userUuid: string, filePath: string, fileName: string, fileByteSize: number }): FileUploadedEvent
}
