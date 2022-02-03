import { Readable } from 'stream'
import { createReadStream } from 'fs'

import { FileDownloaderInterface } from '../../Domain/Services/FileDownloaderInterface'
import { injectable } from 'inversify'

@injectable()
export class FSFileDownloader implements FileDownloaderInterface {
  createDownloadStream(filePath: string): Readable {
    return createReadStream(`${__dirname}/tmp/${filePath}`, { flags: 'a+' })
  }
}
