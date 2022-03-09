import { Uuid } from '@standardnotes/common'

export type RemoveFileDTO = {
  userUuid: Uuid
  resource: string
}
