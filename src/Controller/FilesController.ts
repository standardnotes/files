import {
  BaseHttpController,
  controller,
  httpGet,
  httpPost,
  results,
} from 'inversify-express-utils'
import { Request, Response } from 'express'
import { inject } from 'inversify'
import { Writable } from 'stream'
import TYPES from '../Bootstrap/Types'
import { UploadFileChunk } from '../Domain/UseCase/UploadFileChunk/UploadFileChunk'
import { StreamDownloadFile } from '../Domain/UseCase/StreamDownloadFile/StreamDownloadFile'
import { CreateUploadSession } from '../Domain/UseCase/CreateUploadSession/CreateUploadSession'
import { FinishUploadSession } from '../Domain/UseCase/FinishUploadSession/FinishUploadSession'
import { GetFileMetadata } from '../Domain/UseCase/GetFileMetadata/GetFileMetadata'

@controller('/v1/files', TYPES.ValetTokenAuthMiddleware)
export class FilesController extends BaseHttpController {
  private readonly MAX_CHUNK_SIZE = 100_000

  constructor(
    @inject(TYPES.UploadFileChunk) private uploadFileChunk: UploadFileChunk,
    @inject(TYPES.CreateUploadSession) private createUploadSession: CreateUploadSession,
    @inject(TYPES.FinishUploadSession) private finishUploadSession: FinishUploadSession,
    @inject(TYPES.StreamDownloadFile) private streamDownloadFile: StreamDownloadFile,
    @inject(TYPES.GetFileMetadata) private getFileMetadata: GetFileMetadata,
  ) {
    super()
  }

  @httpPost('/upload/create-session')
  public async startUpload(_request: Request, response: Response): Promise<results.BadRequestErrorMessageResult | results.JsonResult> {
    const result = await this.createUploadSession.execute({
      userUuid: response.locals.userUuid,
      resource: response.locals.permittedResources[0],
    })

    if (!result.success) {
      return this.badRequest(result.message)
    }

    return this.json({ success: true, uploadId: result.uploadId })
  }

  @httpPost('/upload/chunk')
  public async uploadChunk(request: Request, response: Response): Promise<results.BadRequestErrorMessageResult | results.JsonResult> {
    const { chunkId, chunk } = request.body
    if (chunkId === undefined || chunk === undefined) {
      return this.badRequest('Missing required chunk parameters')
    }

    const result = await this.uploadFileChunk.execute({
      userUuid: response.locals.userUuid,
      resource: response.locals.permittedResources[0],
      chunkId,
      data: Uint8Array.from(Object.values(chunk)),
    })

    if (!result.success) {
      return this.badRequest(result.message)
    }

    return this.json({ success: true, message: 'Chunk uploaded successfully' })
  }

  @httpPost('/upload/close-session')
  public async finishUpload(_request: Request, response: Response): Promise<results.BadRequestErrorMessageResult | results.JsonResult> {
    const result = await this.finishUploadSession.execute({
      userUuid: response.locals.userUuid,
      resource: response.locals.permittedResources[0],
    })

    if (!result.success) {
      return this.badRequest(result.message)
    }

    return this.json({ success: true, message: 'File uploaded successfully' })
  }

  @httpGet('/')
  public async download(request: Request, response: Response): Promise<results.BadRequestErrorMessageResult | (() => Writable)> {
    const range = request.headers['range']
    if (!range) {
      return this.badRequest('File download requires range header to be set.')
    }

    let chunkSize = +(request.headers['x-chunk-size'] as string)
    if (!chunkSize || chunkSize > this.MAX_CHUNK_SIZE) {
      chunkSize = this.MAX_CHUNK_SIZE
    }

    const fileMetadata = await this.getFileMetadata.execute({
      userUuid: response.locals.userUuid,
      resource: response.locals.permittedResources[0],
    })

    if (!fileMetadata.success) {
      return this.badRequest(fileMetadata.message)
    }

    const startRange = Number(range.replace(/\D/g, ''))
    const endRange = Math.min(startRange + chunkSize - 1, fileMetadata.size - 1)

    const headers = {
      'Content-Range': `bytes ${startRange}-${endRange}/${fileMetadata.size}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': endRange - startRange + 1,
      'Content-Type': 'application/octet-stream',
    }

    response.writeHead(206, headers)

    const result = await this.streamDownloadFile.execute({
      userUuid: response.locals.userUuid,
      resource: response.locals.permittedResources[0],
      startRange,
      endRange,
    })

    if (!result.success) {
      return this.badRequest(result.message)
    }

    return () => result.readStream.pipe(response)
  }
}
