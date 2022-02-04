import { inject, injectable } from 'inversify'
import { Logger } from 'winston'

import TYPES from '../../../Bootstrap/Types'
import { UseCaseInterface } from '../UseCaseInterface'
import { UploadFileChunkDTO } from './UploadFileChunkDTO'
import { UploadFileChunkResponse } from './UploadFileChunkResponse'
import { FileUploaderInterface } from '../../Services/FileUploaderInterface'
import { UploadRepositoryInterface } from '../../Upload/UploadRepositoryInterface'

@injectable()
export class UploadFileChunk implements UseCaseInterface {
  constructor(
    @inject(TYPES.FileUploader) private fileUploader: FileUploaderInterface,
    @inject(TYPES.UploadRepository) private uploadRepository: UploadRepositoryInterface,
    @inject(TYPES.Logger) private logger: Logger,
  ) {
  }

  async execute(dto: UploadFileChunkDTO): Promise<UploadFileChunkResponse> {
    try {
      this.logger.debug(`Starting upload file chunk ${dto.chunkId} for resource: ${dto.resource}`)

      const filePath = `${dto.userUuid}/${dto.resource}`

      const uploadId = await this.uploadRepository.retrieveUploadSessionId(filePath)
      if (uploadId === undefined) {
        this.logger.warn(`Could not find upload session for file path: ${filePath}`)

        return {
          success: false,
          message: 'Could not find upload session',
        }
      }

      const uploadFileChunkETag = await this.fileUploader.uploadFileChunk({
        uploadId,
        data: dto.data,
        chunkId: dto.chunkId,
        filePath,
      })

      await this.uploadRepository.storeUploadChunkResult(uploadId, {
        ETag: uploadFileChunkETag,
        PartNumber: dto.chunkId,
      })

      return {
        success: true,
      }
    } catch (error) {
      this.logger.error(`Could not upload file chunk for resource: ${dto.resource}`)

      return {
        success: false,
        message: 'Could not upload file chunk',
      }
    }
  }
}
