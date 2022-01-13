import {
  BaseHttpController,
  controller,
  httpPost,
} from 'inversify-express-utils'
import { Request, Response } from 'express'
import { inject } from 'inversify'
import { Writable } from 'stream'
import TYPES from '../Bootstrap/Types'
import { StreamUploadFile } from '../Domain/UseCase/StreamUploadFile/StreamUploadFile'

@controller('/files', TYPES.ValetTokenAuthMiddleware)
export class UploadController extends BaseHttpController {
  constructor(
    @inject(TYPES.StreamUploadFile) private streamUploadFile: StreamUploadFile,
  ) {
    super()
  }

  @httpPost('/')
  public async upload(request: Request, response: Response): Promise<() => Writable> {
    const result = await this.streamUploadFile.execute({
      request,
      response,
    })

    return result.writeStream
  }
}
