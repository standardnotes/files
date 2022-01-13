import { Writable } from 'stream'

export type StreamUploadFileResponse = {
  writeStream: () => Writable
}
