import { Uuid } from '@standardnotes/common'

export type CreateUploadSessionDTO = {
  userUuid: Uuid
  resource: string
}
