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

@controller('/v1/files', TYPES.ValetTokenAuthMiddleware)
export class FilesController extends BaseHttpController {
  constructor(
    @inject(TYPES.UploadFileChunk) private uploadFileChunk: UploadFileChunk,
    @inject(TYPES.CreateUploadSession) private createUploadSession: CreateUploadSession,
    @inject(TYPES.FinishUploadSession) private finishUploadSession: FinishUploadSession,
    @inject(TYPES.StreamDownloadFile) private streamDownloadFile: StreamDownloadFile,
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

    return this.json({ uploadId: result.uploadId })
  }

  @httpPost('/upload/chunk')
  public async uploadChunk(request: Request, response: Response): Promise<results.BadRequestErrorMessageResult | results.OkResult> {
    const chunkId = request.headers['x-upload-chunk-id']
    if (chunkId === undefined) {
      return this.badRequest('Missing x-upload-chunk-id header')
    }

    const result = await this.uploadFileChunk.execute({
      userUuid: response.locals.userUuid,
      resource: response.locals.permittedResources[0],
      chunkId: +chunkId,
      data: request.body,
    })

    if (!result.success) {
      return this.badRequest(result.message)
    }

    return this.ok()
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

    return this.json({ message: 'File uploaded successfully' })
  }

  @httpGet('/')
  public async download(_request: Request, response: Response): Promise<() => Writable> {
    const result = await this.streamDownloadFile.execute({
      userUuid: response.locals.userUuid,
      resource: response.locals.permittedResources[0],
    })

    response.setHeader('content-type', 'application/octet-stream')

    return () => result.readStream.pipe(response)
  }
}
