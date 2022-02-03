import { createWriteStream, mkdirSync, mkdtempSync } from 'fs'
import { dirname } from 'path'
import { injectable } from 'inversify'
import { Writable } from 'stream'

import { FileUploaderInterface } from '../../Domain/Services/FileUploaderInterface'

@injectable()
export class FSFileUploader implements FileUploaderInterface {
  createUploadStream(filePath: string): Writable {
    mkdirSync(dirname(`${__dirname}/tmp/${filePath}`), { recursive: true })

    return createWriteStream(`${__dirname}/tmp/${filePath}`, { flags: 'w+' })
  }
}
