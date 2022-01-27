import { inject, injectable } from 'inversify'
import TYPES from '../../../Bootstrap/Types'
import { FileDownloaderInterface } from '../../Services/FileDownloaderInterface'
import { UseCaseInterface } from '../UseCaseInterface'
import { StreamDownloadFileDTO } from './StreamDownloadFileDTO'
import { StreamDownloadFileResponse } from './StreamDownloadFileResponse'

@injectable()
export class StreamDownloadFile implements UseCaseInterface {
  constructor(
    @inject(TYPES.FileDownloader) private fileDownloader: FileDownloaderInterface,
  ) {
  }

  async execute(dto: StreamDownloadFileDTO): Promise<StreamDownloadFileResponse> {
    const readStream = this.fileDownloader.createDownloadStream(`${dto.userUuid}/${dto.resource}`)

    return {
      readStream,
    }
  }
}
