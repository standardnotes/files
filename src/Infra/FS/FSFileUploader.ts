import { createWriteStream } from 'fs'
import { injectable } from 'inversify'
import { Writable } from 'stream'

import { FileUploaderInterface } from '../../Domain/Services/FileUploaderInterface'

@injectable()
export class FSFileUploader implements FileUploaderInterface {
  createUploadStream(filePath: string): Writable {
    return createWriteStream(`./tmp/${filePath}`, { flags: 'w+' })
  }
}
