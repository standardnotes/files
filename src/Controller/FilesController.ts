import {
  BaseHttpController,
  controller,
  httpGet,
  httpPost,
} from 'inversify-express-utils'
import { Request, Response } from 'express'
import { inject } from 'inversify'
import { Writable } from 'stream'
import TYPES from '../Bootstrap/Types'
import { StreamUploadFile } from '../Domain/UseCase/StreamUploadFile/StreamUploadFile'
import { StreamDownloadFile } from '../Domain/UseCase/StreamDownloadFile/StreamDownloadFile'

@controller('/files', TYPES.ValetTokenAuthMiddleware)
export class FilesController extends BaseHttpController {
  constructor(
    @inject(TYPES.StreamUploadFile) private streamUploadFile: StreamUploadFile,
    @inject(TYPES.StreamDownloadFile) private streamDownloadFile: StreamDownloadFile,
  ) {
    super()
  }

  @httpPost('/')
  public async upload(request: Request, response: Response): Promise<() => Writable> {
    const result = await this.streamUploadFile.execute({
      request,
      response,
      userUuid: response.locals.userUuid,
      resource: response.locals.permittedResources[0],
    })

    return result.writeStream
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
