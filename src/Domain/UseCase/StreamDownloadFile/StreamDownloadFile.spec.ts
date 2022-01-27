import 'reflect-metadata'

import { Readable } from 'stream'
import { FileDownloaderInterface } from '../../Services/FileDownloaderInterface'

import { StreamDownloadFile } from './StreamDownloadFile'

describe('StreamDownloadFile', () => {
  let fileDownloader: FileDownloaderInterface

  const createUseCase = () => new StreamDownloadFile(fileDownloader)

  beforeEach(() => {
    fileDownloader = {} as jest.Mocked<FileDownloaderInterface>
    fileDownloader.createDownloadStream = jest.fn().mockReturnValue(new Readable())
  })

  it('should stream download file contents from S3', async () => {
    const result = await createUseCase().execute({
      userUuid: '2-3-4',
      resource: '1-2-3',
    })

    expect(result.readStream).toBeInstanceOf(Readable)
  })
})
