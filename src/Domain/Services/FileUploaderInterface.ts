import { Writable } from 'stream'

export interface FileUploaderInterface {
  createUploadStream(filePath: string): Writable
}
