import { promises } from 'fs'
import { dirname } from 'path'
import { injectable } from 'inversify'

import { FileUploaderInterface } from '../../Domain/Services/FileUploaderInterface'
import { UploadChunkResult } from '../../Domain/Upload/UploadChunkResult'

@injectable()
export class FSFileUploader implements FileUploaderInterface {
  async uploadFileChunk(dto: { uploadId: string; data: Uint8Array; filePath: string; chunkId: number }): Promise<string> {
    await promises.appendFile(dto.filePath, dto.data, { flag: 'a+' })

    return dto.uploadId
  }

  async finishUploadSession(_uploadId: string, _filePath: string, _uploadChunkResults: UploadChunkResult[]): Promise<void> {
    return
  }

  async createUploadSession(filePath: string): Promise<string> {
    return promises.mkdir(dirname(`${__dirname}/tmp/${filePath}`), { recursive: true })
  }
}
