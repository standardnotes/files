import 'reflect-metadata'

import { Request, Response } from 'express'
import { Writable } from 'stream'
import { StreamUploadFile } from '../Domain/UseCase/StreamUploadFile/StreamUploadFile'
import { UploadController } from './UploadController'

describe('UploadController', () => {
  let streamUploadFile: StreamUploadFile
  let request: Request
  let response: Response
  let writeStream: () => Writable

  const createController = () => new UploadController(streamUploadFile)

  beforeEach(() => {
    writeStream = () => new Writable()
    streamUploadFile = {} as jest.Mocked<StreamUploadFile>
    streamUploadFile.execute = jest.fn().mockReturnValue({ writeStream })

    request = {} as jest.Mocked<Request>
    response = {
      locals: {},
    } as jest.Mocked<Response>
    response.locals.userUuid = '1-2-3'
    response.locals.permittedResources = ['2-3-4']
  })

  it('should return a writable stream upon file upload', async () => {
    const result = await createController().upload(request, response)

    expect(result()).toBeInstanceOf(Writable)
  })
})
