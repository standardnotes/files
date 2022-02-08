import { Readable } from 'stream'
import { createReadStream, promises } from 'fs'

import { FileDownloaderInterface } from '../../Domain/Services/FileDownloaderInterface'
import { injectable } from 'inversify'

@injectable()
export class FSFileDownloader implements FileDownloaderInterface {
  async getFileSize(filePath: string): Promise<number> {
    return (await promises.stat(`${__dirname}/tmp/${filePath}`)).size
  }

  createDownloadStream(filePath: string, startRange: number, endRange: number): Readable {
    return createReadStream(`${__dirname}/tmp/${filePath}`, { start: startRange, end: endRange })
  }
}
