import { Readable } from 'stream'

export interface FileDownloaderInterface {
  createDownloadStream(filePath: string): Readable
}
